
class LoginForm {

    constructor() {
        this.addFormEventListeners();
        this.addCaptchaEventListeners();
    }

    addFormEventListeners() {

        const form = document.getElementById("loginform");

        form.addEventListener("submit", async(event) => {

            event.preventDefault();
                    
            if (!grecaptcha.getResponse()) {
                alert("Voer aub de Captcha in");
                return;
            }
        
            var json = {
                "email": form.elements['mail'].value,
                "password": form.elements['password'].value
            };
        
            form.reset();
            grecaptcha.reset();
        
            fetch('https://localhost:7241/api/account/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(json)
            }).then((response) => {
                if (response.ok) {
                    response.json().then((body) => {
                        this.manageLogin(body);
                    });
                } else if (response.status == 401) {
                    this.showError('Onjuiste gebruikersnaam of wachtwoord');
                }
            });
        });
    }

    showError(message) {
        const errorSpan = document.getElementById("error-message");
        errorSpan.innerHTML = message;

        const errorBox = document.getElementById("errorbox");
        errorBox.style = "display: flex;"
    }

    addCaptchaEventListeners() {
        const captcha = document.querySelector(".g-recaptcha");
        captcha.addEventListener("click", onclick);
    }

    onClick(e) {
        e.preventDefault();
        grecaptcha.enterprise.ready(async () => {
        const token = await grecaptcha.enterprise.execute('6Le1XIEpAAAAALEZYkoqSBSKA8OeKu9xlTIli1W3', {action: 'LOGIN'});
        });
    }

    manageLogin(body) {
        localStorage.setItem('bearer-token', body.accessToken);
        localStorage.setItem('refresh-token', body.refreshToken);
        window.location.hash = '#cv';
    }
}

const loginForm = new LoginForm();