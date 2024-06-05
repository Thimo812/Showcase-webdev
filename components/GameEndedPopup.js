export default class GameEndedPopup extends HTMLElement {

    shadowRoot;

    templateID = 'gamepopup-template';

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.applyTemplate();
        this.applyStyling();
    }

    applyTemplate() {
        let template = document.getElementById(this.templateID);
        let clone = template.content.cloneNode(true);

        this.shadowRoot.appendChild(clone);
    }

    applyStyling() {
        const linkElement = document.createElement("link");
        linkElement.setAttribute("rel","stylesheet");
        linkElement.setAttribute("href","stylesheets/components/gameboard-styling.css");
        this.shadowRoot.appendChild(linkElement);
    }

    show(word, score) {
        this.shadowRoot.querySelector("div").style = "visibility: visible";
        this.shadowRoot.getElementById("wordfield").innerText = `Woord: ${word}`;
        this.shadowRoot.getElementById("scorefield").innerText = `score: ${score}`;
    }
}

customElements.define("game-popup", GameEndedPopup)