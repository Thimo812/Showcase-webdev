import ScorePopup from "./ScorePopup.js";
import Tile from "./Tile.js";

class GameBoard extends HTMLElement {

    shadowRoot;
    popup;
    templateId = 'gameboard-template';

    wordLength = 5;
    rowCount = 6;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.applyTemplate();
        this.attachStyling();
    }

    applyTemplate() {
        let template = document.getElementById(this.templateId);
        let clone = template.content.cloneNode(true);
        this.shadowRoot.appendChild(clone);

        this.popup = new ScorePopup();
        this.shadowRoot.getElementById("container").appendChild(this.popup);

        const container = this.shadowRoot.getElementById("grid-container");

        let tiles = []

        for(let i = 0; i < this.rowCount; i++) {
            tiles[i] = []
            for(let a = 0; a < this.wordLength; a++) {
                const tile = new Tile(a, i);
                tiles[i][a] = tile;

                container.appendChild(tile);
            }
        }
    }

    attachStyling() {
        const linkElement = document.createElement("link");
        linkElement.setAttribute("rel","stylesheet");
        linkElement.setAttribute("href","stylesheets/components/gameboard-styling.css");
        this.shadowRoot.appendChild(linkElement);
    }
}

customElements.define('game-board', GameBoard);