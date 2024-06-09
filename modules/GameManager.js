import SignalRHandler from "./SignalRHandler.js";
import GameEndedPopup from "../components/GameEndedPopup.js"

class GameManager {

    player1board = document.getElementById("player1board");
    player2board = document.getElementById("player2board");

    playerName = localStorage.getItem("username");

    signalRHandler = new SignalRHandler();

    wordLength = 5;
    rowCount = 6;

    currentRow = 0;
    currentColumn = 0;

    boardActive = false;
    gameEnded = false;

    gamePage = document.getElementById("gameContainer")
    searchPage = document.querySelector(".game-searching");
    startPage = document.querySelector(".game-start");

    popup;

    constructor() {
        this.popup = new GameEndedPopup();
        this.gamePage.appendChild(this.popup);
        this.applyEventListeners();
        this.signalRHandler.start();
        this.setPage(this.startPage);
    }

    applyEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (!this.boardActive) return;

            const pattern = /[a-zA-Z]/;

            if (event.key == 'Backspace') {
                this.removeLetter();
            } else if (event.key == "Enter") {
                this.sendWord();
            } else if (pattern.test(event.key) && event.key.length == 1) {
                this.addLetter(event.key);
            }
        });

        document.getElementById("startButton").addEventListener("click", () => {
            this.signalRHandler.findGame();
        })

        document.getElementById("cancelButton").addEventListener("click", () => {
            this.signalRHandler.cancelFindGame();
            this.setPage(this.startPage);
        })

        this.popup.backButton.addEventListener("click", event => {
            this.setPage(this.startPage);
        });

        this.signalRHandler.connection.on("OnPlayerEnqueued", () => this.setPage(this.searchPage));
        this.signalRHandler.connection.on("InvalidWord", (data) => this.showError("Vul een valide woord in"));
        this.signalRHandler.connection.on("UpdateBoard", (player, data) => {
            const board = this.playerName === player ? this.player1board : this.player2board
            this.renderBoard(data, board);
        });
        this.signalRHandler.connection.on("GameStarted", (data) => {
            this.boardActive = true;
            this.setPage(this.gamePage);
            document.getElementById("opponent-span").innerText = `Tegenstander: ${data}`;
        })
        this.signalRHandler.connection.on("GameEnded", (winnerName, score) => {
            this.gameEnded = true;
            this.popup.show(winnerName, score)
            this.player1board.popup.hide();
            this.player2board.popup.hide();
        });
        this.signalRHandler.connection.on("BoardFull", (player, data, word, score) => {
            if (player == this.playerName) this.boardActive = false;
            const board = this.playerName === player ? this.player1board : this.player2board
            this.renderBoard(data, board);
            if (!this.gameEnded) board.popup.show(word, score);
        })
    }

    getTile(row, column, board) {
        return board.shadowRoot.querySelector(`tile-element[row="${row}"][column="${column}"]`);
    }

    setPage(page) {
        this.gamePage.style = "display: none";
        this.searchPage.style = "display: none";
        this.startPage.style = "display: none";

        page.style = page == this.gamePage ? "display: block; position: relative;" : "display: flex;";
    }

    getCurrentWord() {
        let letterArray = [];
        for (let i = 0; i < this.wordLength; i++) {
            const letter = this.getTile(this.currentRow, i, this.player1board).getAttribute("content")

            if (!letter) throw new Error();

            letterArray.push(letter)
        }
        let word = "";
        letterArray.forEach(letter => word += letter);
        return word;
    }

    removeLetter() {
        if (this.currentColumn == 0) return;

        this.currentColumn--;

        let currentTile = this.getTile(this.currentRow, this.currentColumn, this.player1board);

        currentTile.setAttribute('content', "");
    }

    addLetter(letter) {
        if (this.currentColumn >= this.wordLength) return;

        let currentTile = this.getTile(this.currentRow, this.currentColumn, this.player1board);

        currentTile.setAttribute('content', letter);

        this.currentColumn++;
    }

    emptyRow(row) {
        for (let i = 0; i < this.wordLength; i++) {
            const tile = this.getTile(row, i, this.player1board);

            if (!tile) return;

            tile.setAttribute("content", "");
        }
        this.currentColumn = 0;
    }

    async renderBoard(boardData, board) {
        let currentRow;
        for (let i = 0; i < boardData.length; i++) {
            const word = boardData[i];
            if (word) {
                for (let a = 0; a < word.letters.length; a++) {
                    const tile = this.getTile(i, a, board);
                    tile.setAttribute("content", word.letters[a].key)
                    tile.setStatus(word.letters[a].value);
                }
            }
            else {
                this.emptyRow(i);
                if (!currentRow) currentRow = i;
            }
        }

        if (board == this.player1board) this.currentRow = currentRow;
    }

    async showError(message) {
        let errorSpan = document.getElementById("error-span");
        errorSpan.innerText = message;
        await new Promise(resolve => setTimeout(resolve, 2000))
        errorSpan.innerText = "";
    }

    sendWord() {
        let currentWord;
        try {
            currentWord = this.getCurrentWord();
            this.signalRHandler.sendMessage("GuessWord", currentWord);
        } catch(err) {
            console.log("enter a valid word")
        }

        this.emptyRow(this.currentRow);
    }

}

var g = new GameManager();