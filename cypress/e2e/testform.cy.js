describe('Contact Form', () => {
  beforeEach(() => {
    // Visit the page containing the form before each test
    cy.visit('#contact');

    cy.get('.gdpr-consent').should('be.visible');
    cy.get('.gdpr-consent__button--accept').click();
  });

  it('should display the contact form', () => {
    cy.get('form.form-contactpagina').should('be.visible');
  });

  it('should submit the form successfully with valid inputs and CAPTCHA', () => {
    cy.get('#firstname').type('thimo');
    cy.get('#lastname').type('bosma');
    cy.get('#email').type('thimo8123@gmail.com');
    cy.get('#phone-number').type('06-12345678');

    cy.window().then((win) => {
      win.grecaptcha = {
        getResponse: () => 'mock-captcha-token',
        reset: cy.stub(),
      };
    });

    cy.intercept('POST', '**/api/ContactForm/CreateRequest', {
      statusCode: 200,
    }).as('formSubmit');

    cy.get('form.form-contactpagina').submit();

    cy.wait('@formSubmit');

    cy.get('#firstname').should('have.value', '');
    cy.get('#lastname').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#phone-number').should('have.value', '');
  });

  it('should display an error if CAPTCHA is not completed', () => {
    cy.get('#firstname').type('John');
    cy.get('#lastname').type('Doe');
    cy.get('#email').type('john.doe@example.com');
    cy.get('#phone-number').type('06-12345678');

    cy.window().then((win) => {
      win.grecaptcha = {
        getResponse: () => '',
        reset: cy.stub(),
      };
    });

    cy.get('form.form-contactpagina').submit();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Voer aub de Captcha in');
    });
  });

  it('should display an error if API call fails', () => {
    cy.get('#firstname').type('thimo');
    cy.get('#lastname').type('bosma');
    cy.get('#email').type('thimo8123@gmail.com');
    cy.get('#phone-number').type('06-12345678');

    cy.window().then((win) => {
      win.grecaptcha = {
        getResponse: () => 'mock-captcha-token',
        reset: cy.stub(),
      };
    });

    cy.intercept('POST', '**/api/ContactForm/CreateRequest', {
      statusCode: 500,
    }).as('formSubmitFail');

    cy.get('form.form-contactpagina').submit();

    cy.wait('@formSubmitFail');

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Er heeft een error plaatsgevonden, uw verzoek is niet verzonden');
    });
  });
});
