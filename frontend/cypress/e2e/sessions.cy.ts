describe('Sessions', () => {
  describe('As regular user', () => {
    beforeEach(() => {
      cy.login('user@test.com', 'test!1234');
    });

    it('should display sessions list', () => {
      cy.visit('/sessions');
      cy.contains('Yoga Sessions').should('be.visible');
      cy.get('.grid > div').should('have.length.greaterThan', 0);
    });

    it('should view session details', () => {
      cy.visit('/sessions');
      cy.contains('View Details').first().click();
      cy.contains('Details').should('be.visible');
      cy.contains('Teacher:').should('be.visible');
      cy.contains('Participants:').should('be.visible');
    });

    it('should join a session', () => {
      cy.visit('/sessions');
      cy.contains('View Details').first().click();
      cy.contains('Join Session').should('be.visible');
      cy.contains('Join Session').click();
      cy.contains('Leave Session').should('be.visible');
    });

    it('should leave a session', () => {
      cy.visit('/sessions');
      cy.contains('View Details').first().click();
      // Ensure we're participating first
      cy.get('body').then(($body) => {
        if ($body.text().includes('Join Session')) {
          cy.contains('Join Session').click();
          cy.contains('Leave Session').should('be.visible');
        }
        cy.contains('Leave Session').click();
        cy.contains('Join Session').should('be.visible');
      });
    });

    it('should not show create session button for non-admin', () => {
      cy.visit('/sessions');
      cy.contains('Create Session').should('not.exist');
    });
  });

  describe('As admin user', () => {
    beforeEach(() => {
      cy.login('yoga@studio.com', 'test!1234');
    });

    it('should show create session button', () => {
      cy.visit('/sessions');
      cy.contains('Create Session').should('be.visible');
    });

    it('should create a new session', () => {
      cy.visit('/sessions/create');
      cy.get('input[name="name"]').type('New Cypress Session');
      cy.get('input[name="date"]').type('2026-06-15');
      cy.get('select[name="teacherId"]').select(1);
      cy.get('textarea[name="description"]').type('A session created by Cypress test');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/sessions');
      cy.contains('New Cypress Session').should('be.visible');
    });

    it('should edit a session', () => {
      cy.visit('/sessions');
      cy.contains('New Cypress Session')
        .parents('.bg-white')
        .find('a')
        .contains('View Details')
        .click();
      cy.contains('Edit').click();
      cy.get('input[name="name"]').clear().type('Updated Cypress Session');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/sessions');
    });

    it('should delete a session', () => {
      cy.visit('/sessions');
      cy.contains('Updated Cypress Session')
        .parents('.bg-white')
        .find('button')
        .contains('Delete')
        .click();
      cy.contains('Updated Cypress Session').should('not.exist');
    });

    it('should show delete button on session cards', () => {
      cy.visit('/sessions');
      cy.get('.grid > div').first().find('button').contains('Delete').should('be.visible');
    });
  });
});
