/*
 * Frontend Logic for application
 *
 */

// Container for frontend application
var app = {};

// Config
app.config = {
  'sessionToken' : false
};

// AJAX Client (for RESTful API)
app.client = {}

// Interface for making API calls
app.client.request = function(headers,path,method,queryStringObject,payload,callback){

  // Set defaultspayload
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path+'?';
  var counter = 0;
  for(var queryKey in queryStringObject){
     if(queryStringObject.hasOwnProperty(queryKey)){
       counter++;
       // If at least one query string parameter has already been added, preprend new ones with an ampersand
       if(counter > 1){
         requestUrl+='&';
       }
       // Add the key and value
       requestUrl+=queryKey+'='+queryStringObject[queryKey];
     }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for(var headerKey in headers){
     if(headers.hasOwnProperty(headerKey)){
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  // If there is a current session token set, add that as a header
  if(app.config.sessionToken){
    xhr.setRequestHeader("token", app.config.sessionToken.id);
    xhr.setRequestHeader("isloggedin", true);
  } else {
    xhr.setRequestHeader("isloggedin", false);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;

        // Callback if requested
        if(callback){
          try{
            var parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } catch(e){
            callback(statusCode,responseReturned);
          }

        }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

};

// Bind the required buttons
app.bindGeneralButtons = function(){
  if (document.querySelector('#button')) {
    const buttons = document.querySelectorAll('#button');

    buttons.forEach(button => {
      button.addEventListener("click", function(e){
    
        // Stop it from redirecting anywhere
        e.preventDefault();
    

        //Handle Logout button click
        if (e.target.innerText == 'Logout') {
          //Log the user out
          app.logUserOut();
        }   
        
        if (e.target.alt == 'Logo') {  
          //Handle Logo button click
          app.client.requestTemplate('/');
        }
        
        //Handle Sign Up button click
        if (e.target.innerText == 'Sign Up' || e.target.innerText == 'Sign In and Order') {  
          app.client.requestTemplate('/user/account/create');
        }
        
        //Handle Login button click
        if (e.target.innerText == 'Login' || e.target.innerText == 'LOGIN AGAIN') {  
          app.client.requestTemplate('/user/session/create');
        }
        
        //Handle Account Settings button click
        if (e.target.innerText == 'Account Settings') {  
          app.client.requestTemplate('/user/account/edit');
        }
        
        //Handle Account Deleted button click
        if (e.target.innerText == 'Account Deleted') {  
          app.client.requestTemplate('/user/account/deleted');
        }
        
        //Handle Dashboard button click
        if (e.target.innerText == 'Dashboard') {  
          app.client.requestTemplate('/menu/list');
        }
        
        //Handle Cart button click
        if (e.target.className == 'cart') {  
          const cart = JSON.stringify(app.config.cart);
          if (cart) {
            app.client.requestTemplate('/user/cart/list', {cart});
          }
        }
        
        //Handle Add to Cart button click
        if (e.target.innerText == 'Add to Cart' ) {  
          if (app.config.sessionToken) {
            app.performItemAdditionToCart(e);
          }
        }
        
        //Handle Delete cart item click
        if (e.target.value == 'Delete' ) {
          if (app.config.sessionToken) {
            app.performItemDeletionFromCart(e);
          }
        }
        
        //Handle cart checkout button click
        if (e.target.innerText == 'Checkout' ) {
          if (app.config.sessionToken) {
            app.performCheckout(e);
          }
        }
        
      });
    });
  }
};

// Log the user out then redirect them
app.logUserOut = (redirectUser) => {
  // Set redirectUser to default to true
  redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

  // Get the current token id
  var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  // Send the current token to the tokens endpoint to delete it
  var header = {
    email: app.config.sessionToken.email_address
  }
  
  var queryStringObject = {
    'id' : tokenId
  };
  app.client.request(header,'api/tokens','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
    // Set the app.config token as false
    app.setSessionToken(false);

    //Clear cart globally and on local storage 
    app.clearCart();
    
    // Send the user to the logged out page
    if(redirectUser){
      app.client.requestTemplate('/user/session/deleted');
    }
    
  });
};

app.clearCart = () => {
  app.config.cart = false;
  localStorage.setItem('cart', false);
}

//Get a template from server
app.client.requestTemplate = (path, payload, callback) => {
  callback = typeof(callback) == 'function' && callback ? callback : false; 
  header = typeof(payload) == 'object' && payload !== null && payload !== {} ? payload : {};
  
  app.client.request(header, path, 'GET', undefined, undefined, (statusCode, response) => {
    
    //Replace current webpage with new webpage from server
    const html = document.querySelector('html');
    const doc = document.createElement('html');
    doc.innerHTML = response;
    html.parentNode.removeChild(html);
    window.document.append(doc);
  
    //Create a new entry in the browsers history without reloading the page
    window.history.pushState({}, '', `https://localhost:3001${path}`);
    
    //Replace the the current entry in the browsers history without reloading the page 
    window.history.replaceState({}, '', `https://localhost:3001${path}`);
    
    //Delay page display for 100ms
    app.delayPageDisplayFor100ms();

    //Add the loggedIn class to body 
    if (app.config.sessionToken) {
      app.setLoggedInClass(true);
    } else {
      app.setLoggedInClass(false);
    }

    //Call the init function as we just reloded
    app.init();

    //Execute the callback from the requestTemplate caller if any was passed
    if (callback) {
      callback(statusCode, response);
    }
  });

}

//Delay the page from displaying for 30ms
app.delayPageDisplayFor100ms = () => {

  document.querySelector('body').style.display = 'none';
    setTimeout(() => {
      document.querySelector('body').style.display = 'block';
    },100);
}

//Update header based on if user is logged in or not
app.updateHeader = () => {
  if (app.config.sessionToken) {
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
}

//Bind the forms
app.bindForms = function(){
  //Only bind if a form is in the DOM and its not the payment form
  if(document.querySelector("form") && document.querySelector("form").className !== 'payment'){

    var allForms = document.querySelectorAll("form");
    for(var i = 0; i < allForms.length; i++){
        allForms[i].addEventListener("submit", function(e){

        // Stop it from submitting
        e.preventDefault();
        var formId = this.id;
        var path = this.action;
        var method = this.method.toUpperCase();

        // Hide the error message (if it's currently shown due to a previous error)
       // document.querySelector("#"+formId+" .formError").style.display = 'none';

        // Hide the success message (if it's currently shown due to a previous error)
        if(document.querySelector("#"+formId+" .formSuccess")){
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }

        // Turn the inputs into a payload
        var payload = {};
        var elements = this.elements;
        for(var i = 0; i < elements.length; i++){
          if(elements[i].type !== 'submit'){
            // Determine the value of element
            var valueOfElement = elements[i].value;
            // Override the method of the form if the input's name is _method
            var nameOfElement = elements[i].name;
            if(nameOfElement == '_method'){
              method = valueOfElement;
            } else {
              // Create a payload field named "method" if the elements name is actually httpmethod
              if(nameOfElement == 'httpmethod'){
                nameOfElement = 'method';
              }
              // Create an payload field named "id" if the elements name is actually uid
              if(nameOfElement == 'uid'){
                nameOfElement = 'id';
              }
              payload[nameOfElement] = valueOfElement;
            }
          }
        }

        // If the method is DELETE, the payload should be a queryStringObject instead
        var queryStringObject = method == 'DELETE' ? payload : {};

        //If method is DELETE, set the accountDelete key to be true, default to null 
        var deletedHeader = {accountDeleted:true};
        var headers = method == 'DELETE' ? deletedHeader : null;

        // Call the API
        app.client.request(headers,path,method,queryStringObject,payload,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode !== 200){

            if(statusCode == 403){
              // log the user out
              app.logUserOut();

            } else {

              // Try to get the error from the api, or set a default error message
              var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

              // Set the formError field with the error text
              document.querySelector("#"+formId+" .formError").innerHTML = error;

              // Show (unhide) the form error field on the form
              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } else {
            // If successful, send to form response processor
            app.formResponseProcessor(formId,payload,responsePayload);
          }

        });
      });
    }
  }
};

//Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
  var functionToCall = false;
  // If account creation was successful, try to immediately log the user in
  if(formId == 'accountCreate'){
    // Take the email address and password, and use it to log the user in
    var newPayload = {
      'email_address' : requestPayload.email_address,
      'password' : requestPayload.password
    };

    app.client.request(undefined,'api/tokens','POST',undefined,newPayload,function(newStatusCode,newResponsePayload){
      // Display an error on the form if needed
      if(newStatusCode !== 200){

        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } else {
        // If successful, set the token and redirect the user
        app.setSessionToken(newResponsePayload);
        app.client.requestTemplate('/menu/list');
      }
    });
  }
  // If login was successful, set the token in localstorage and redirect the user
  if(formId == 'sessionCreate'){
    app.setSessionToken(responsePayload);
    app.client.requestTemplate('/menu/list');
  }

  // If forms saved successfully and they have success messages, show them
  var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2','checksEdit1'];
  if(formsWithSuccessMessages.indexOf(formId) > -1){
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }

  // If the user just deleted their account, redirect them to the account-delete page
  if(formId == 'accountEdit3'){
    app.logUserOut(false);
    app.client.requestTemplate('/user/account/deleted');
  }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
  app.config.sessionToken = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add){
  var target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};

//Adding an item to cart
app.performItemAdditionToCart = (e) => {
  //Update the item quantity or construct the new item to add and pass it to the next step in the process
  const itemNameToAdd = e.target.parentNode.parentNode.children[1].innerText;
  var itemsChecked = 0;
  var itemsToCheck = app.config.cart.length;

  //If there is at least one item in the cart, got to next step
  if (app.config.cart.length > 0) {
    app.config.cart.every(item => {
      //If item to add to cart is already in cart then increment it's quantity or else put it in
      if (item.name == itemNameToAdd) {
        //Item is in cart so increment its quantity
        item.quantity++;
        app.setCartItem(item, isItemPresent=true);
        return false;
      } 
     
      itemsChecked++;

      if (itemsChecked == itemsToCheck) {
        //Item is not in cart so put it in
        app.addItem(itemNameToAdd);
      }

      //Proceed to next item
      return true;
    });
  } else {
    app.addItem(itemNameToAdd);
  }
}

//Add an item to cart
app.addItem = (itemNameToAdd, isItemPresent) => {
  const itemToAdd = {
    "name": itemNameToAdd,
    "quantity": 1
  }
  app.setCartItem(itemToAdd, isItemPresent);
}

//Try to get cart from client or server and proceed to next step (updateCartAndPersist)
app.setCartItem = function(cartItem, isItemPresent){  
  cartItem = typeof(cartItem) == 'object' && cartItem !== null && cartItem !== {} ? cartItem : false;
  
  //Do nothing if cartItem is invalid
  if (cartItem) {
    app.updateCartAndPersist(cartItem, isItemPresent);
  };
} 

//Add a new item to cart and persist to storage; client and server
app.updateCartAndPersist = (cartItem, isItemPresent=false) => {
  //Get cart globally from app.config.cart  
  var cart = app.config.cart;
  
  //TODO improve this
  //Add item only if it is not present in cart
  if (!isItemPresent) {
    cart.push(cartItem);
  }

  var cartLength = cart.length;
  
  //Persist the cart to server 
  app.client.request(undefined, '/api/carts', 'POST', undefined, {cart}, (statusCode, response) => {
    if (statusCode === 200) {
      //TODO delete this
      console.log(response);
    }
  });
  
  //Stringify the cart object to persist to local storage
  cart = JSON.stringify(cart);
  localStorage.setItem('cart',false);
  localStorage.setItem('cart',cart);

  //Update the cart Display UI
  app.updateCartDisplay(cartLength);

  //show the from success UI
  document.querySelector(".formSuccess").style.display = 'block';

  //Remove the form success UI after a little while
  app.removeFormErrorOrSuccess('formSuccess');

}

app.updateCartDisplay = (val) => {
  val = Number.isInteger(val) && val > -1 ? val : false;

  if (val) {
    //Val is valid, update the cart display UI
    document.getElementById('cartDisplay').innerText = '';
    document.getElementById('cartDisplay').innerText = val;
  }
}

app.performItemDeletionFromCart = (e) => {
  //Get the item rowid to be deleted
  const rowIdObject = e.target.parentNode.parentNode.attributes.rowid;
  const rowId = parseInt(rowIdObject.value);
 
  //Get the current cart from global app.config.cart
  var cart = app.config.cart;

  //remove the item
  cart.splice(rowId, 1);

  //Update the cart on client and server
  app.updateCartAndPersist(undefined, true);

  cart = JSON.stringify(cart);
  app.client.requestTemplate('/user/cart/list', {cart});

  // document.querySelector(".formSuccess").style.display = 'block';
  // app.removeFormErrorOrSuccess('formSuccess');

}

app.removeFormErrorOrSuccess = (form) => {
  setTimeout(() => {
    document.querySelector(`.${form}`).style.display = 'none';
  }, 3000);
}

app.performCheckout = (e) => {
  app.client.requestTemplate('/user/order/create', undefined, (statusCode, response) => {
    if (statusCode === 200) {
      //Make sure user is logged in and Stripe is a function
      if (app.config.sessionToken && typeof(Stripe) === 'function') {
        //Remove form error if shown already due to previous error and continue 
        app.showPaymentFormError(false);
          
        // A reference to Stripe.js initialized with publishable API key.
        // TODO put this in env
        var stripe = Stripe("pk_test_51IwoedF0CIFQrzQwnDRn0rZjkvzSLboriVTpamL4QaXFPW2gG38m97hKuz7k61IozFuAzVHhKqL11qkdG2ltqPFr00msX9IYoB");
      
        //Disable the button until we have Stripe set up on the page
        document.querySelector("button.paymentButton").disabled = true;
      
        var elements = stripe.elements();
      
        var style = {
          base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d"
            }
          },
          invalid: {
            fontFamily: 'Arial, sans-serif',
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        };

        var card = elements.create("card", { style });
        // Stripe injects an iframe into the DOM
        card.mount("#card-element");
        card.on("change", function (event) {
          // Disable the Pay button if there are no card details in the Element
          document.querySelector("button.paymentButton").disabled = event.empty;
          document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
        });
      
        app.addPaymentFormEventListener(card, stripe);
       
      } else {
        //Show Error
        app.showPaymentFormError(true, 'Please make sure you are logged in, have internet access then try reloading the page.');
      }
    }
  });
}

app.addPaymentFormEventListener = (card, stripe) => {
  var paymentForm = document.getElementById('payment-form');  
  paymentForm.addEventListener('submit', (e) => {
    //Show loading animation
    app.loading(true);
    
    //Stop it from redirecting anywhere
    e.preventDefault();
    //Only continue if user is logged in and card element input field is in DOM (Might not be because of network)
    if (app.config.sessionToken && document.getElementById('card-element').children.length > 0) {
      //Remove form error if shown already due to previous error and continue 
      app.showPaymentFormError(false);
      
      //Complete payment when the submit button is clicked
      app.payWithCard(stripe, card);
    } else {
      app.showPaymentFormError(true, 'Please make sure you are logged in and have internet access.');
    }
  });
}

//Calls stripe.confirmCardPayment
//If the card requires authentication Stripe shows a pop-up modal to
//prompt the user to enter authentication details without leaving your page.
app.payWithCard = (stripe, card) => {
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the customer that there was an error.
      var errorElement = document.getElementById('card-error');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      app.stripeTokenHandler(result.token);
    }
  });
}    

app.stripeTokenHandler = (token) => {  
  app.client.request(undefined, '/api/orders', 'POST', undefined, {token}, (statusCode, response) => {
    if (statusCode === 200) {
      //The payment succeeded!
      //TODO correct the parameter below
      app.orderComplete('pay');
    } else if (statusCode == 403) {
      //Log user out, user provided an invalid token
      app.logUserOut(true);
    } else {
      //Show error to your customer
      app.showError(response.Error);
    }
  });
}

/* ------- UI helpers ------- */

//Shows a success message when the payment is complete
app.orderComplete = (paymentIntentId) => {
  app.loading(false);
  document
    .querySelector(".result-message a")
    .setAttribute(
      "href",
      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
    );
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("button.paymentButton").disabled = true;
};
  
//Show the customer the error from Stripe if their card fails to charge
app.showError = (errorMsgText) => {
  app.loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};
  
//Show a spinner on payment submission
app.loading = (isLoading) => {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("button.paymentButton").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button.paymentButton").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};

app.showPaymentFormError = (show, errMessage) => {
  const paymentFormError = document.querySelector('#payment-form .formError');
  if (show) {
    paymentFormError.innerText = errMessage;
    paymentFormError.style.display = 'block';
  } else {
    paymentFormError.innerText = '';
    paymentFormError.style.display = 'none';
  }
}


//Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function(){
  var tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string'){
    try{
      var token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
      } else {
        app.setLoggedInClass(false);
      }
    }catch(e){
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
    }
  }
};


// Get the cart from localstorage or server and set it in the app.config object
app.getCartItems = function(){
  //Only get cart items when logged in
  if (app.config.sessionToken) {
    app.setCartGloballyFromClientOrServer((cart) => {
      cart = typeof(cart) == 'object' && cart instanceof Array ? cart : [];
      app.config.cart = cart;
      app.updateCartDisplay(cart.length);
    });
  }
};

//Set the cart globally
app.setCartGloballyFromClientOrServer = (callback) => {
  var cart = localStorage.getItem('cart');
  cart = typeof(cart) == 'object' && cart instanceof Array ? cart : false;
 
  if (cart) {
    //Found cart in client side, so use it
    callback(cart);
  } else {
    //No cart in client side, try to get it from the server
    app.client.request(undefined, '/api/carts', 'GET', undefined, undefined, (statusCode, response) => {
      if (statusCode === 200) {
        //Got cart from server!, So use it
        callback(response.userCart);
      } else {
        //Still no cart from server, default to an empty array and use it
        cart = [];
        callback(cart);
      }
    });
  }
}


// Renew the token
app.renewToken = function(callback){
  var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    // Update the token with a new expiration
    var payload = {
      'id' : currentToken.id,
      'extend' : true,
    };
    app.client.request(undefined,'api/tokens','PUT',undefined,payload,function(statusCode,responsePayload){
      // Display an error on the form if needed
      if(statusCode == 200){
        // Get the new token details
        var queryStringObject = {'id' : currentToken.id};
        app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode == 200){
            app.setSessionToken(responsePayload);
            callback(false);
          } else {
            app.setSessionToken(false);
            callback(true);
          }
        });
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    });
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

// Load data on the page
app.loadDataOnPage = function(){
  // Get the current page from the body class
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  // Logic for cart List page
  if(primaryClass == 'cartList'){
    app.loadCartItemQuantity();
  }
};

// Load the account edit page specifically
app.loadCartItemQuantity = () => {
  const cart = app.config.cart;
  cart.forEach((item, index) => {
    document.querySelector(`[rowid="${index}"] > div:nth-child(4) > input`).value = item.quantity.toString();
  })
};



// Loop to renew token often
app.tokenRenewalLoop = function(){
  setInterval(function(){
    app.renewToken(function(err){
      if(!err){
        console.log("Token renewed successfully @ "+Date.now());
      }
    });
  },1000 * 60 * 60);
};

// Init (bootstrapping)
app.init = function(){
  app.updateHeader();

  // Bind all form submissions
  app.bindForms();

  // Bind logout logout button
  app.bindGeneralButtons();

  // Get the token from localstorage
  app.getSessionToken();

  //Get the cart from localstorage
  app.getCartItems();

  // Renew token
  app.tokenRenewalLoop();

  // Load data on page
  app.loadDataOnPage();
};

// Call the init processes after the window loads
window.onload = function(){
  app.init();
};
