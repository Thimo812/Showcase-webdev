class Tile extends HTMLElement {

    shadowRoot;
    templateID = 'tile-template';

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {

        this.applyTemplate();
        this.attachStyling();

        this.shadowRoot.getElementById("container").innerHTML = this.getAttribute('content');
    }

    setStatus(status) {
        this.shadowRoot.querySelector("div").setAttribute("status", status);
    }

    static get observedAttributes() {
        return ['content'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'content' && oldValue !== newValue) {
            this.shadowRoot.getElementById("container").innerHTML = this.getAttribute('content');
        }
    }

    applyTemplate() {
        let template = document.getElementById(this.templateID);
        let clone = template.content.cloneNode(true);

        this.shadowRoot.appendChild(clone);
    }

    attachStyling() {
        const linkElement = document.createElement("link");
        linkElement.setAttribute("rel","stylesheet");
        linkElement.setAttribute("href","stylesheets/components/tile-styling.css");
        this.shadowRoot.appendChild(linkElement);
    }
}

customElements.define('tile-element', Tile);