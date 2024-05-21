describe("Products purchase task - Exercise1", () => {
  let url = "https://www.automationexercise.com/";
  before(() => {
    // Login to the site
    cy.visit(url);
    cy.get(".shop-menu .nav.navbar-nav li a")
      .contains("Signup / Login")
      .click();

    cy.url().should("include", "/login");
    cy.get('input[data-qa="login-email"]').type("qat@mailinator.com");
    cy.get('input[data-qa="login-password"]').type("123456");
    cy.get('button[data-qa="login-button"]').click();
    cy.contains("Logged in as").should("be.visible");
  });

  // Add Fancy Green Top to cart
  it("should add Fancy Green Top to the cart", () => {
    cy.scrollTo("top");
    cy.get(".panel-title").contains("Women").click();
    cy.get("#Women").should("be.visible");
    cy.get("#Women .panel-body ul li a").contains("Tops").click();
    cy.url().should("include", "/category_products/2");

    cy.get(".productinfo.text-center")
      .contains("Fancy Green Top")
      .parents(".single-products")
      .find(".productinfo .add-to-cart")
      .first()
      .click();

    cy.get("button").contains("Continue Shopping").click();
  });

  it("should add Summer White Top to the cart and view the cart", () => {
    // Ensure we are on the Tops page
    cy.visit(url + "category_products/2");

    cy.get(".productinfo.text-center")
      .contains("Summer White Top")
      .parents(".single-products")
      .find(".productinfo .add-to-cart")
      .first()
      .click();

    cy.get(".modal-content").should("be.visible");
    cy.get(".modal-content a").contains("View Cart").click();

    cy.url().should("include", "/view_cart");

    cy.get("tbody")
      .find("tr")
      .within(() => {
        cy.get(".cart_description").should("contain", "Fancy Green Top");
        cy.get(".cart_price").should("contain", "Rs. 700");
      });

    cy.get("tbody")
      .find("tr")
      .within(() => {
        cy.get(".cart_description").should("contain", "Summer White Top");
        cy.get(".cart_price").should("contain", "Rs. 400");
      });
  });

  it("should fetch, sort by price, and print labels and prices", () => {
    cy.visit(url);

    cy.get(".features_items .col-sm-4").then(($elements) => {
      const products = [];

      $elements.each((index, element) => {
        const label = Cypress.$(element).find(".productinfo p").text();
        const priceText = Cypress.$(element).find(".productinfo h2").text();
        const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));

        products.push({ label, price });
      });

      products.sort((a, b) => a.price - b.price);

      // Print sorted products to the console
      console.log("Sorted products:");
      products.forEach((product) => {
        console.log(`Label: ${product.label}, Price: Rs. ${product.price}`);
      });
    });
  });
});
