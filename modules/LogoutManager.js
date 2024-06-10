export default class AccountManager {

    constructor() {
        this.addEventListeners();
        this.checkAccount();
    }

    async checkAccount() {
        if (localStorage.getItem('bearer-token') == null) {
            this.setLoginStatus(false);
            return;
        }

        const response = await fetch('https://localhost:7241/api/Login', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('bearer-token')}` 
            }
        });
        this.setLoginStatus(response.status == 200);
    }

    setLoginStatus(isLoggedIn) {
        if (isLoggedIn) {
            const role = localStorage.getItem("role")
            document.getElementById("account-label").innerHTML = localStorage.getItem('username');
            document.getElementById("gameHeader").style = `display: ${role == "admin" || role == "gameUser" ? "flex" : "none"}`
            document.getElementById("userHeader").style = `display: ${role == "admin" ? "flex" : "none"}`;
            document.getElementById("register-button").style.display = 'none';
            document.getElementById("login-button").style.display = 'none';
            document.getElementById("logout-button").style.display = 'block';
        } else {
            localStorage.removeItem("bearer-token");
            localStorage.removeItem("refresh-token");
            localStorage.removeItem("username");
            document.getElementById("gameHeader").style = "display: none";
            document.getElementById("userHeader").style = "display: none";
            document.getElementById("account-label").innerHTML = 'Account';
            document.getElementById("register-button").style.display = 'block';
            document.getElementById("login-button").style.display = 'block';
            document.getElementById("logout-button").style.display = 'none';
        }
    }

    addEventListeners() {
        document.getElementById('logout-button').addEventListener("click", () => {
            localStorage.removeItem('refresh-token');
            localStorage.removeItem('bearer-token');
            localStorage.removeItem('username');

            this.checkAccount();
            
            window.location.hash = '#cv';
        });
    }
}