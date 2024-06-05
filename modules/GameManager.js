import SignalRHandler from "./SignalRHandler.js";

class GameManager {

    player1board = document.getElementById("player1board");
    player2board = document.getElementById("player2board");

    playerName = localStorage.getItem("username");

    signalRHandler = new SignalRHandler();

    wordLength = 5;
    rowCount = 6;

    currentRow = 0;
    currentColumn = 0;

    boardActive = true;

    constructor() {
        this.applyEventListeners();

        this.signalRHandler.start();
    }

    applyEventListeners() {
        document.addEventListener('keydown', (event) => {
            const pattern = /[a-zA-Z]/;

            if (event.key == 'Backspace') {
                this.removeLetter();
            } else if (event.key == "Enter") {
                this.sendWord();
            } else if (pattern.test(event.key) && event.key.length == 1) {
                this.addLetter(event.key);
            }
        });

        this.signalRHandler.connection.on("InvalidWord", (data) => this.showError("Vul een valide woord in"));

        this.signalRHandler.connection.on("UpdateBoard", (player, data) => {
            const board = this.playerName === player ? this.player1board : this.player2board
            this.renderBoard(data, board);
        });

        this.signalRHandler.connection.on("GameStarted", (data) => {
            document.getElementById("opponent-span").innerText = `Tegenstander: ${data}`
        })

        this.signalRHandler.connection.on("GameEnded", (winnerName, score) => {
            console.log(winnerName + score)
        });

        this.signalRHandler.connection.on("BoardFull", (player, data, word, score) => {
            const board = this.playerName === player ? this.player1board : this.player2board
            this.renderBoard(data, board);
            board.popup.show(word, score);
            this.boardActive = false;
        })
    }

    getTile(row, column, board) {
        return board.shadowRoot.querySelector(`tile-element[row="${row}"][column="${column}"]`);
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