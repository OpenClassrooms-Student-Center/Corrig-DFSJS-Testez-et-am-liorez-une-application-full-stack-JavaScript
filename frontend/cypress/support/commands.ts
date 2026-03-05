declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      register(firstName: string, lastName: string, email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', 'http://localhost:8080/api/auth/login', { email, password }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body));
  });
});

Cypress.Commands.add('register', (firstName: string, lastName: string, email: string, password: string) => {
  cy.request('POST', 'http://localhost:8080/api/auth/register', { firstName, lastName, email, password }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body));
  });
});

export {};
