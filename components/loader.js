
class Loader extends HTMLElement {
    
    shadowRoot;

    templateId = 'loading-template';
    
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.applyTemplate();
        this.attachStyling();

        this.shadowRoot.getElementById("loading-message").innerText = this.innerHTML;
    }

    applyTemplate() {
        let template = document.getElementById(this.templateId);
        let clone = template.content.cloneNode(true);

        this.shadowRoot.appendChild(clone);
    }

    attachStyling() {
        const linkElement = document.createElement("link");
        linkElement.setAttribute("rel","stylesheet");
        linkElement.setAttribute("href","stylesheets/components/loader-styling.css");
        this.shadowRoot.appendChild(linkElement);
    }
}

customElements.define("loader-element", Loader);