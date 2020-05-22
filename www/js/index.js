var app = {
  state: {},
  setState: function (attr) {
    Object.assign(this.state, attr);
    this.render(this.state);
  },

  initialize: function () {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },

  // deviceready Event Handler
  onDeviceReady: function () {
    const self = this;

    this.setState({
      error: "",
      status: "Loading...",
      product1: {},
      product2: {},
    });

    store.register([
      {
        id: "beady.purchasetest.subscription",
        type: store.PAID_SUBSCRIPTION,
      },
      {
        id: "beady.purchasetest.baseicsubscription",
        type: store.PAID_SUBSCRIPTION,
      },
    ]);

    // Setup the receipt validator service.
    store.validator =
      "https://validator.fovea.cc/v1/validate?appName=fun.beady.apps&apiKey=894e24ee-f0cc-4832-a771-f669904297f4";

    // Set application user name
    store.applicationUsername = "Test";

    // Show errors for 10 seconds.
    store.error(function (error) {
      self.setState({ error: `ERROR ${error.code}: ${error.message}` });
      setTimeout(function () {
        self.setState({ error: `` });
      }, 10000);
    });

    store.when("subscription").updated(function () {
      const product1 = store.get("beady.purchasetest.subscription") || {};
      const product2 = store.get("beady.purchasetest.baseicsubscription") || {};

      let status = "Please subscribe below";
      if (product1.owned || product2.owned) status = "Subscribed";
      else if (product1.state === "approved" || product2.state === "approved")
        status = "Processing...";

      self.setState({ product1, product2, status });
    });

    store
      .when("product")
      .approved((p) => p.verify())
      .verified((p) => p.finish());

    store.refresh();
  },

  render: function () {
    const purchaseProduct1 = this.state.product1.canPurchase
      ? `<button onclick="store.order('beady.purchasetest.subscription')">Subscribe</button>`
      : "";
    const purchaseProduct2 = this.state.product2.canPurchase
      ? `<button onclick="store.order('beady.purchasetest.baseicsubscription')">Subscribe</button>`
      : "";

    const content = document.getElementById("content");
    content.innerHTML = `
      <pre>
${this.state.error}
subscription: ${this.state.status}
      </pre>

      <pre> 
          
id:     ${this.state.product1.id || ""}
title:  ${this.state.product1.title || ""}
state:  ${this.state.product1.state || ""}
descr:  ${this.state.product1.description || ""}
price:  ${this.state.product1.price || ""}
expiry: ${this.state.product1.expiryDate || ""}
json:   ${JSON.stringify(this.state.product1, undefined, 2)}
      </pre>
${purchaseProduct1}

      <pre>

id:     ${this.state.product2.id || ""}
title:  ${this.state.product2.title || ""}
descr:  ${this.state.product2.description || ""}
price:  ${this.state.product2.price || ""}
state:  ${this.state.product2.state || ""}
expiry: ${this.state.product2.expiryDate || ""}
json:   ${JSON.stringify(this.state.product2, undefined, 2)}
      </pre>
${purchaseProduct2}
    `;
  },
};

app.initialize();
