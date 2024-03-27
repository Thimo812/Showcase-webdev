
class ContactForm {
    constructor() {
        this.addFormEventListeners();
        this.addCaptchaEventListeners();
    }

    addFormEventListeners() {

        const form = document.querySelector("form");

        form.addEventListener("submit", async(event) => {

            event.preventDefault();
        
            if (!grecaptcha.getResponse()) {
                alert("Voer aub de Captcha in");
                return;
            }
        
            var json = {
                "FirstName": form.elements["firstname"].value,
                "LastName": form.elements["lastname"].value,
                "Email": form.elements["email"].value,
                "Phone": form.elements["phone-number"].value
            };
        
            form.reset();
            grecaptcha.reset();
        
            fetch('https://ca-showcasewebapp-app.yellowsky-37a5ad75.westeurope.azurecontainerapps.io/api/ContactForm/CreateRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('bearer-token')}` 
                },
                body: JSON.stringify(json)
            }).then((response) => {
                if (response.ok) {
                    alert("Het contactverzoek is succesvol verzonden");
                } else {
                    alert("Er heeft een error plaatsgevonden, uw verzoek is niet verzonden");
                }
            });
        });
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

const form = new ContactForm();


