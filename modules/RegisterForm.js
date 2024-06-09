
class RegisterForm {

    constructor() {
        this.addFormEventListeners();
        this.addCaptchaEventListeners();
    }

    addFormEventListeners() {

        const form = document.getElementById("registerform");

        form.addEventListener("submit", async(event) => {

            event.preventDefault();

            let mail = form.elements['mail'].value
            let password = form.elements['password'].value;
            let rpassword = form.elements['rpassword'].value;

            if (!password == rpassword) {
                alert("De wachtwoorden komen niet overheen");
                return;
            }
                    
            if (!grecaptcha.getResponse()) {
                alert("Voer aub de Captcha in");
                return;
            }

            form.reset();
            grecaptcha.reset();
        
            var json = {
                "email": mail,
                "password": password
            };
            console.log(mail)

            this.register(json);
            
        });
    }

    async register(json) {
        fetch('https://localhost:7241/api/account/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(json)
        }).then((response) => {
            if (response.ok) {
                this.login(json);
            } else {
                response.json().then((body) => {
                    const errors = Object.values(body.errors).flat();
                    this.showErrors(errors);
                });
            }
        });
    }

    login(json) {
        fetch('https://localhost:7241/api/account/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(json)
        }).then((response) => {
            if (response.ok) {
                response.json().then((body) => {
                    window.location.hash = '#cv';
                    localStorage.setItem('bearer-token', body.accessToken);
                    localStorage.setItem('refresh-token', body.refreshToken);
                    localStorage.setItem('username', body.username);
                });
            }
        });
    }

    showErrors(errors) {
        let errorMessage = "";
        errors.forEach(error => {
            errorMessage += error + '</br>';
        });

        console.log(errorMessage);

        const errorSpan = document.getElementById("error-message");
        errorSpan.innerHTML = errorMessage;

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

    
}

const registerForm = new RegisterForm();