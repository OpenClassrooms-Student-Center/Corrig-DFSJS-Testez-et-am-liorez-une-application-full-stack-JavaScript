describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.visit('/login');
      cy.contains('Login to Yoga Studio').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Login');
    });

    it('should login with valid credentials', () => {
      cy.visit('/login');
      cy.get('input[type="email"]').type('yoga@studio.com');
      cy.get('input[type="password"]').type('test!1234');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/sessions');
      cy.contains('Yoga Sessions').should('be.visible');
    });

    it('should show error with invalid credentials', () => {
      cy.visit('/login');
      cy.get('input[type="email"]').type('wrong@test.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.contains('Invalid credentials').should('be.visible');
    });

    it('should navigate to register page', () => {
      cy.visit('/login');
      cy.contains('Register here').click();
      cy.url().should('include', '/register');
    });
  });

  describe('Register Page', () => {
    it('should display registration form', () => {
      cy.visit('/register');
      cy.contains('Register for Yoga Studio').should('be.visible');
      cy.get('input[name="firstName"]').should('be.visible');
      cy.get('input[name="lastName"]').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
    });

    it('should register a new user', () => {
      const uniqueEmail = `test-${Date.now()}@test.com`;
      cy.visit('/register');
      cy.get('input[name="firstName"]').type('Test');
      cy.get('input[name="lastName"]').type('User');
      cy.get('input[type="email"]').type(uniqueEmail);
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/sessions');
    });

    it('should navigate to login page', () => {
      cy.visit('/register');
      cy.contains('Login here').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Authentication flow', () => {
    it('should redirect unauthenticated users to login', () => {
      cy.visit('/sessions');
      cy.url().should('include', '/login');
    });

    it('should logout successfully', () => {
      cy.login('yoga@studio.com', 'test!1234');
      cy.visit('/sessions');
      cy.contains('Logout').click();
      cy.url().should('include', '/login');
    });
  });
});
