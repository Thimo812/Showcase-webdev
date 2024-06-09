export default class UserListItem extends HTMLElement {

    templateId = "userListItemTemplate";

    shadowRoot;

    userId;
    userName;
    userRole;

    constructor(userName, userId, userRole) {
        super();
        this.shadowRoot = this.attachShadow({mode: 'open'});

        this.userName = userName;
        this.userId = userId;
        this.userRole = userRole;
    }

    connectedCallback() {
        this.applyTemplate();
        this.applyStyling();
        this.applyEventListeners();
    }

    applyTemplate() {
        const template = document.getElementById(this.templateId);
        const clone = template.content.cloneNode(true);
        this.shadowRoot.appendChild(clone);

        this.shadowRoot.querySelector("p").innerText = this.userName;
        this.shadowRoot.querySelector("input").checked = this.userRole == "Admin" || this.userRole == "gameUser" ? true : false
    }

    applyStyling() {
        const linkElement = document.createElement("link");
        linkElement.setAttribute("rel","stylesheet");
        linkElement.setAttribute("href","stylesheets/components/userListItem.css");
        this.shadowRoot.appendChild(linkElement);
    }

    applyEventListeners() {
        this.shadowRoot.querySelector("input").addEventListener("change", (event) => {
            const isChecked = event.target.checked;
            this.sendPermissionChange(this.userId, isChecked)
            .then((success) => { if (!success) this.shadowRoot.querySelector("input").checked = !isChecked });
        });
    }

    async sendPermissionChange(userId, isPermitted) {
        const body = {
            UserId: userId,
            RoleName: `${isPermitted ? "gameUser" : "User"}`
        }
        const response = await fetch('https://localhost:7241/api/User/UpdateUserRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('bearer-token')}` 
            },
            body: JSON.stringify(body)
        });
        if (response.status == 401) return false;
        return true;
    }
}

customElements.define("user-listitem", UserListItem);