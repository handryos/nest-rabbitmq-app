describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/routes/login");
  });

  it("should load the login page", () => {
    cy.contains("Log-in").should("be.visible");

    cy.get('input[name="name"]').should("exist");
    cy.get('input[name="password"]').should("exist");

    cy.contains("Entrar").should("be.visible");
  });

  it("should navigate to registration page when 'Register a new user' link is clicked", () => {
    cy.get("a[href='/routes/register']").click();

    cy.url().should("include", "/routes/register");
  });

  it("should show form validation errors when fields are empty", () => {
    cy.get("button[type='submit']").click();

    cy.contains("This field is required").should("be.visible");
  });
});
