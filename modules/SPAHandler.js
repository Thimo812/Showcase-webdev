class SPAHandler {

    constructor() {
        this.handleRoute = this.handleRoute.bind(this);
        window.addEventListener('hashchange', this.handleRoute);
        this.handleRoute();
    }

    handleRoute() {
        let path = window.location.hash.substr(1); // Extract the path from the URL
        let content = document.getElementById('content');

        if (!path) {
            window.location.hash = '#cv';
        }

        // Fetch HTML content based on the route
        this.fetchContent(path)
            .then(html => {
                content.innerHTML = html;
                this.loadAllScripts(path);
            })
            .catch(error => {
                console.error('Error fetching content:', error);
                content.innerHTML = '<h1>404 - Not Found</h1>';
            });
    }

    async fetchContent(path) {
        try {
            // Fetch HTML content based on the route
            const response = await fetch(`${path}.html`);
            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }
            return await response.text();
        } catch (error) {
            throw new Error('Error fetching content');
        }
    }

    async loadAllScripts(page) {

        switch (page) {
            case 'cv':
                break;
            case 'contact':
                this.loadScript("/modules/ContactForm.js");
                this.loadScript("https://www.google.com/recaptcha/api.js");
                break;
            case 'register':
                this.loadScript("/modules/RegisterForm.js");
                this.loadScript("https://www.google.com/recaptcha/api.js");
                break;
            case 'login':
                this.loadScript("/modules/LoginManager.js");
                this.loadScript("https://www.google.com/recaptcha/api.js");
                break;
            case 'game':
                this.loadModule("/modules/GameManager.js");
                this.loadModule("/components/GameBoard.js");
                break;
            case 'users':
                this.loadModule("/components/UserListItem.js");
                this.loadModule("/modules/UserManager.js");
        }
    }

    async loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = "";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    async loadModule(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.type = 'module';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
}

export {SPAHandler}