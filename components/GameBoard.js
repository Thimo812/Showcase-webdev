class GameBoard extends HTMLElement {

    shadowRoot;
    templateId = 'gameboard-template';

    wordLength = 5;
    rowCount = 6;

    currentRow = 0;
    currentColumn = 0;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.applyTemplate();
        this.attachStyling();
        this.applyEventListeners();
    }

    applyTemplate() {
        let template = document.getElementById(this.templateId);
        let clone = template.content.cloneNode(true);

        this.shadowRoot.appendChild(clone);

        for(let i = 0; i < this.rowCount; i++) {
            for(let a = 0; a < this.wordLength; a++) {
                const tile = document.createElement('tile-element');
                tile.setAttribute("column", a);
                tile.setAttribute("row", i);

                this.shadowRoot.getElementById("container").appendChild(tile);
            }
        }
    }

    attachStyling() {
        const linkElement = document.createElement("link");
        linkElement.setAttribute("rel","stylesheet");
        linkElement.setAttribute("href","stylesheets/components/gameboard-styling.css");
        this.shadowRoot.appendChild(linkElement);
    }

    applyEventListeners() {
        document.addEventListener('keydown', (event) => {
            const pattern = /[a-zA-Z]/;

            if (event.key == 'Backspace') {
                this.removeLetter();
            } else if (event.key == "Enter") {
                this.sendWord();
            } else if (pattern.test(event.key)) {
                this.addLetter(event.key);
            }
        });
    }

    removeLetter() {
        if (this.currentColumn == 0) return;

        this.currentColumn--;

        let currentTile = this.getCurrentTile();

        currentTile.setAttribute('content', "");
    }

    addLetter(letter) {
        if (this.currentColumn > 4) return;

        let currentTile = this.getCurrentTile();

        console.log(currentTile);

        console.log(currentTile);

        currentTile.setAttribute('content', letter);

        this.currentColumn++;
    }

    sendWord() {
        if (this.currentColumn < 5) return;

        this.currentColumn = 0;
        this.currentRow++;
    }

    getCurrentTile() {
        return this.shadowRoot.querySelector(`tile-element[row="${this.currentRow}"][column="${this.currentColumn}"]`);
    }
}

customElements.define('game-board', GameBoard);