class GDPR {

    constructor() {
        this.bindEvents();

        if(this.cookieStatus() !== 'accept') this.showGDPR();
    }

    bindEvents() {
        let buttonAccept = document.querySelector('.gdpr-consent__button--accept');
        buttonAccept.addEventListener('click', () => {
            this.saveMetaData();
            this.cookieStatus('accept');
            this.hideGDPR();
        });

        let buttonReject = document.querySelector('.gdpr-consent__button--reject');
        buttonReject.addEventListener('click', () => {
            this.saveMetaData();
            this.cookieStatus('reject');
            this.hideGDPR();
        })
    }

    resetContent(){
        const classes = [
            '.content-gdpr-accept',
            '.content-gdpr-reject',
            '.content-gdpr-not-chosen'];

        for(const c of classes){
            document.querySelector(c).classList.add('hide');
            document.querySelector(c).classList.remove('show');
        }
    }

    cookieStatus(status) {

        if (status) localStorage.setItem('gdpr-consent-choice', status);

        return localStorage.getItem('gdpr-consent-choice');
    }

    saveMetaData() {
        const date = new Date();

        let dateString = date.toLocaleDateString("nl-NL");

        let metaData = {
            date: dateString,
            tijd:  `${date.getHours()}:${date.getMinutes()}`
        }

        localStorage.setItem('gdpr-consent-metadata', JSON.stringify(metaData));
    }

    hideGDPR(){
        document.querySelector(`.gdpr-consent`).classList.add('hide');
        document.querySelector(`.gdpr-consent`).classList.remove('show');
    }

    showGDPR(){
        document.querySelector(`.gdpr-consent`).classList.add('show');
    }

}

const gdpr = new GDPR();

