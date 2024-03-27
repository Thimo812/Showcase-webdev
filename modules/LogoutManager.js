export default class AccountManager {

    constructor() {
        this.addEventListeners();
        this.checkAccount();
    }

    checkAccount() {
        if (localStorage.getItem('bearer-token') == null) {
            document.getElementById("account-label").innerHTML = 'Account'
            document.getElementById("register-button").style.display = 'block';
            document.getElementById("login-button").style.display = 'block';
            document.getElementById("logout-button").style.display = 'none';
        } else {
            document.getElementById("account-label").innerHTML = localStorage.getItem('username');
            document.getElementById("register-button").style.display = 'none';
            document.getElementById("login-button").style.display = 'none';
            document.getElementById("logout-button").style.display = 'block';
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