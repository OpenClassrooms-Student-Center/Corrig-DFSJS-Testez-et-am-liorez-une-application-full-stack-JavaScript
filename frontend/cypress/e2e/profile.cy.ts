describe('Profile', () => {
  describe('As regular user', () => {
    beforeEach(() => {
      cy.login('user@test.com', 'test!1234');
    });

    it('should display user information', () => {
      cy.visit('/profile');
      cy.contains('My Profile').should('be.visible');
      cy.contains('First Name').should('be.visible');
      cy.contains('Last Name').should('be.visible');
      cy.contains('Email').should('be.visible');
      cy.contains('user@test.com').should('be.visible');
    });

    it('should show User badge for regular users', () => {
      cy.visit('/profile');
      cy.contains('User').should('be.visible');
    });

    it('should show Member Since date', () => {
      cy.visit('/profile');
      cy.contains('Member Since').should('be.visible');
    });

    it('should navigate back to sessions', () => {
      cy.visit('/profile');
      cy.contains('Back to Sessions').click();
      cy.url().should('include', '/sessions');
    });
  });

  describe('As admin user', () => {
    beforeEach(() => {
      cy.login('yoga@studio.com', 'test!1234');
    });

    it('should show Administrator badge', () => {
      cy.visit('/profile');
      cy.contains('Administrator').should('be.visible');
    });

    it('should display admin email', () => {
      cy.visit('/profile');
      cy.contains('yoga@studio.com').should('be.visible');
    });
  });

  describe('Account deletion', () => {
    it('should delete account with confirmation', () => {
      // Register a temporary user to delete
      const uniqueEmail = `delete-${Date.now()}@test.com`;
      cy.visit('/register');
      cy.get('input[name="firstName"]').type('Delete');
      cy.get('input[name="lastName"]').type('Me');
      cy.get('input[type="email"]').type(uniqueEmail);
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/sessions');

      cy.visit('/profile');
      cy.contains('Delete Account').should('be.visible');
      cy.contains('Delete Account').click();
      cy.url().should('include', '/login');
    });

    it('should redirect to login after account deletion', () => {
      const uniqueEmail = `delete2-${Date.now()}@test.com`;
      cy.visit('/register');
      cy.get('input[name="firstName"]').type('Delete');
      cy.get('input[name="lastName"]').type('Me');
      cy.get('input[type="email"]').type(uniqueEmail);
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/sessions');

      cy.visit('/profile');
      cy.contains('Delete Account').click();
      cy.url().should('include', '/login');
      // Should not be able to access protected routes
      cy.visit('/sessions');
      cy.url().should('include', '/login');
    });
  });
});
