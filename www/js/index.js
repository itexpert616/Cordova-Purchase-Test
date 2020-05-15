var app = {
  state = {
    error: '',
    status: 'Loading...',
    product1: {},
    product2: {},
  },
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
    store.register([{
        id:    'my_subscription1',
        type:   store.PAID_SUBSCRIPTION,
    }, {
        id:    'my_subscription2',
        type:   store.PAID_SUBSCRIPTION,
    }]);

    // Setup the receipt validator service.
    store.validator = '<<< YOUR_RECEIPT_VALIDATION_URL >>>';

    // Show errors for 10 seconds.
    store.error(function(error) {
        this.setState({ error: `ERROR ${error.code}: ${error.message}` });
        setTimeout(function() {
            this.setState({ error: `` });
        }, 10000);
    });

    store.when('subscription').updated(function() {
        const product1 = store.get('my_subscription1') || {};
        const product2 = store.get('my_subscription2') || {};
    
        let status = 'Please subscribe below';
        if (product1.owned || product2.owned)
            status = 'Subscribed';
        else if (product1.state === 'approved' || product2.state === 'approved')
            status = 'Processing...';
    
        setState({ product1, product2, status });
    });

    store.refresh();
  },

  render: function () {
    const purchaseProduct1 = this.state.product1.canPurchase
      ? `<button onclick="store.order('my_subscription1')">Subscribe</button>`
      : "";
    const purchaseProduct2 = this.state.product2.canPurchase
      ? `<button onclick="store.order('my_subscription2')">Subscribe</button>`
      : "";

    const body = document.getElementsByTagName("body")[0];
    body.innerHTML = `
        <pre> 
            ${this.state.error}
            subscription: ${this.state.status}
            
            id:     ${this.state.product1.id || ""}
            title:  ${this.state.product1.title || ""}
            state:  ${this.state.product1.state || ""}
            descr:  ${this.state.product1.description || ""}
            price:  ${this.state.product1.price || ""}
            expiry: ${this.state.product1.expiryDate || ""}
        </pre>
        ${purchaseProduct1}

        <pre>
        
            id:     ${this.state.product2.id || ""}
            title:  ${this.state.product2.title || ""}
            descr:  ${this.state.product2.description || ""}
            price:  ${this.state.product2.price || ""}
            state:  ${this.state.product2.state || ""}
            expiry: ${this.state.product2.expiryDate || ""}
        </pre>
        ${purchaseProduct2}
    `;
  },
};

app.initialize();
