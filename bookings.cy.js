describe("API Testing with Cypress", () => {
  let token;
  let bookingId;
  let cardDetails = {
    name: "Test Card",
    number: "4100 0000 0000",
    cvc: "123",
    expiration: "01/1900",
  };

  it("should authenticate and get a token", () => {
    cy.request({
      method: "POST",
      url: "https://restful-booker.herokuapp.com/auth",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        username: "admin",
        password: "password123",
      },
    }).then((response) => {
      // Expect the status to be 200
      expect(response.status).to.eq(200);

      cy.log(response.body);
      expect(response.body).to.have.property("token");
      token = response.body.token;
    });
  });

  it("should create a booking", () => {
    cy.wrap(token).should("not.be.undefined");

    cy.request({
      method: "POST",
      url: "https://restful-booker.herokuapp.com/booking",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        firstname: "Kenneth",
        lastname: "Kisakye",
        totalprice: 2000,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-01-01",
          checkout: "2024-05-21",
        },
        additionalneeds: "Lunch",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(response.body);

      expect(response.body).to.have.property("bookingid");
      bookingId = response.body.bookingid;
    });
  });

  it("should retrieve the created booking", () => {
    cy.wrap(bookingId).should("not.be.undefined");
    cy.request({
      method: "GET",
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      cy.log(response.body);
      expect(response.body).to.have.property("firstname", "Kenneth");
      expect(response.body).to.have.property("lastname", "Kisakye");
    });
  });

  it("should update the booking", () => {
    // Ensure the token and bookingId are available before making the update request
    cy.wrap(token).should("not.be.undefined");
    cy.wrap(bookingId).should("not.be.undefined");

    cy.request({
      method: "PUT",
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: {
        firstname: "Kenneth",
        lastname: "Kisakye",
        totalprice: 3000,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-01-11",
          checkout: "2024-05-05",
        },
        additionalneeds: "Transport",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      cy.log(response.body);

      expect(response.body.bookingdates).to.have.property(
        "checkout",
        "2024-05-05"
      );
      expect(response.body).to.have.property("additionalneeds", "Transport");
    });
  });

  it("should proceed to checkout and place an order", () => {
    cy.visit("https://www.automationexercise.com/view_cart");
    cy.get(".check_out").contains("Proceed To Checkout").click();

    cy.get('textarea[name="message"]').type("Order placed.");
    cy.get(".btn.btn-default.check_out").contains("Place Order").click();

    cy.get('input[data-qa="name-on-card"]').type(cardDetails.name);
    cy.get('input[data-qa="card-number"]').type(cardDetails.number);
    cy.get('input[data-qa="cvc"]').type(cardDetails.cvc);
    cy.get('input[data-qa="expiry-month"]').type(
      cardDetails.expiration.split("/")[0]
    );
    cy.get('input[data-qa="expiry-year"]').type(
      cardDetails.expiration.split("/")[1]
    );

    cy.get('button[data-qa="pay-button"]').click();

    // Confirm the order
    cy.contains("Order placed successfully").should("be.visible");
  });
});
