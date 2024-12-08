describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/routes/register");
  });

  it("should display the registration form", () => {
    cy.get("h1").contains("Register User").should("be.visible");
    cy.get('input[name="name"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('input[name="passwordConfirmation"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Register").should("be.visible");
  });

  it("should register successfully with valid credentials", () => {
    cy.intercept(
      "POST",
      "http://localhost:3000/routes/register/auth/register",
      {
        statusCode: 201,
        body: {
          message: "User registered successfully",
        },
      }
    );

    const randomName = "user" + Math.random().toString(36).substr(2, 9);
    cy.get('input[name="name"]').type(randomName);
    cy.get('input[name="password"]').type("validpassword");
    cy.get('input[name="passwordConfirmation"]').type("validpassword");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/routes/login");
  });

  it("should show password mismatch error", () => {
    const randomName = "user" + Math.random().toString(36).substr(2, 9);

    cy.get('input[name="name"]').type(randomName);
    cy.get('input[name="password"]').type("validpassword");
    cy.get('input[name="passwordConfirmation"]').type("differentpassword");

    cy.get('button[type="submit"]').click();

    cy.contains("Passwords do not match").should("be.visible");
  });
});
