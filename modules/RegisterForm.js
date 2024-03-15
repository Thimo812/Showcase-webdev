
class RegisterForm {

    constructor() {
        this.addFormEventListeners();
        this.addCaptchaEventListeners();
    }

    addFormEventListeners() {

        const form = document.getElementById("registerform");

        form.addEventListener("submit", async(event) => {

            event.preventDefault();

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
        
            var json = {
                "email": form.elements['mail'].value,
                "password": password
            };
        
            form.reset();
            grecaptcha.reset();
        
            fetch('https://localhost:7241/api/account/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(json)
            }).then((response) => {
                if (response.ok) {
                    alert("Uw account is aangemaakt");
                } else {
                    response.json().then((body) => {
                        const errors = Object.values(body.errors).flat();
                        this.showErrors(errors);
                    });
                }
            });
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