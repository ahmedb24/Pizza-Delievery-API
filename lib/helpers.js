/*
 * Helpers for various tasks
 *
 */

// Dependencies
var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');
var config = require('./config');

// Container for all the helper methods
var helpers = {};

// Sample for testing that simply returns a number
helpers.getANumber = function(){
  return 1;
};

// Parse a JSON string to an object in all cases, without throwing
helpers.jsonify = function(str){
  try{
    return JSON.parse(str);
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str+=randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

//Console logging with colors and styles
helpers.colorLog = (message, color="", style="") => {

  const colors = {
    "black" : "\x1b[30m",
    "red" : "\x1b[31m",
    "green" : "\x1b[32m",
    "yellow" : "\x1b[33m",
    "blue" : "\x1b[34m",
    "magenta" : "\x1b[35m",
    "cyan" : "\x1b[36m",
    "white" : "\x1b[37m",
  };

  const styles = {
    "reset" : "\x1b[0m",
    "bright" : "\x1b[1m",
    "dim" : "\x1b[2m",
    "underscore" : "\x1b[4m",
    "blink" : "\x1b[5m",
    "reverse" : "\x1b[7m",
    "hidden" : "\x1b[8m",
  }

  const msgColor = typeof(colors[color]) == "string" ? colors[color] : "";
  const msgStyle = typeof(styles[style]) == "string" ? styles[style] : "";

  console.log(msgColor + msgStyle + "%s" + styles["reset"], message);
}

// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = function(templateName,data,isAddingGlobals,callback){
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data !== null ? data : {};
  if(templateName){
    var templatesDir = path.join(__dirname,'/../templates/');
    fs.readFile(templatesDir+templateName+'.html', 'utf8', function(err,str){
      if(!err && str && str.length > 0){
        //Do interpolation on the string if there is data
        if (Object.keys(data).length > 0) {
          var finalString = helpers.interpolate(str,data, isAddingGlobals);
          callback(false,finalString);
        } else {
          callback(false,str);
        }
      } else {
        callback('No template could be found');
      }
    });
  } else {
    callback('A valid template name was not specified');
  }
};

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = function(str,data,callback){
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};
  // Get the header
  helpers.getTemplate('_header',data,true,function(err,headerString){
    if(!err && headerString){
      // Get the footer
      helpers.getTemplate('_footer',data,true,function(err,footerString){
        if(!err && footerString){
          // Add them all together
          var fullString = headerString+str+footerString;
          callback(false,fullString);
        } else {
          callback('Could not find the footer template');
        }
      });
    } else {
      callback('Could not find the header template');
    }
  });
};

// Take a given string and data object, and find/replace all the keys within it
helpers.interpolate = function(str,data, isAddingGlobals = true){
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};

  // If required, Add the templateGlobals to the data object, prepending their key name with "global."
  if (isAddingGlobals) {
    for(var keyName in config.templateGlobals){
       if(config.templateGlobals.hasOwnProperty(keyName)){
         data['global.'+keyName] = config.templateGlobals[keyName];
       }
    }
  }

  // For each key in the data object, insert its value into the string at the corresponding placeholder
  for(var key in data){
     while (data.hasOwnProperty(key) && typeof(data[key]) == 'string' && str.indexOf(key) > -1){
        var replace = data[key];
        var find = '{'+key+'}';
        str = str.replace(find,replace);
     }
  }
  return str;
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = function(fileName,callback){
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
  if(fileName){
    var publicDir = path.join(__dirname,'/../public/');
    fs.readFile(publicDir+fileName, function(err,data){
      if(!err && data){
        callback(false,data);
      } else {
        callback('No file could be found');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
};

/**
 * Cart-Related Utils
 * 
*/

//Get all available menu items
helpers.getMenuItems = (callback) => {
  var templatesDir = path.join(__dirname,'/../.data/menu/');
  fs.readFile(templatesDir+'menu_1.json', 'utf8', (err, menuData) => {
      if (!err && menuData) {
          callback(false, menuData);
      } else {
          callback('A valid menu name was not specified');
      }
  });
}

//Get the cart template with the top and bottom
helpers.getCartTemplate = (templateToGet, templateData, cart, callback) => {
  if (templateToGet == '_indexDefault' || templateToGet == '_noCartItem') {
    helpers.getTemplate(templateToGet, templateData, true, (err, str) => {
      if (!err && str) {
        callback(false, str);
      } else {
        callback(err);
      }
    });
  } else {
    //TemplateToGet is not "indexDefault" or "noCartItem" so construct the cart template
    helpers.getCartMainTemplate((err, cartMainData) => {
      if (!err && cartMainData) {
        helpers.constructCartRowsAndPerformInterpolation(cart, cartMainData, (finalCartMainData, total) => {
          const cartBottomTemplateData = {"pizza.total": total.toString()};
          helpers.addUniversalCartTemplates(finalCartMainData, cartBottomTemplateData, (err, cartData) => {
            if (!err && cartData) {
              callback(false, cartData);
            } else {
              callback(err);
            }
          });
        });
      } else {
        callback(err);
      }
    });
  }
}

helpers.constructCartRowsAndPerformInterpolation =  (cart, cartMainData, callback) => {
  var finalCartMainData ='';
  helpers.getMenuItems((err, menuData) => {
    if (!err && menuData) {
      try {
        menuData = JSON.parse(menuData);
        var total = 0;
        //Go through each cart item and construct its name and price 
        cart.forEach((item, index) => {
          const itemData = {
            'pizza.rowid': index.toString(),
            'pizza.name': item.name,
            'pizza.price': menuData[item.name]
          }
          
          //Update the total price
          total += parseInt(itemData['pizza.price'].split('$')[1]) * item.quantity;

          //Do the string interpolation for current cart item
          finalCartMainData += helpers.interpolate(cartMainData, itemData, false);
        });
      } catch (error) {
      }
    }
    callback(finalCartMainData, total);
  });
}

//Get the string content of the cartMain template
helpers.getCartMainTemplate = (callback) => {
  var templatesDir = path.join(__dirname,'/../templates/');
  fs.readFile(templatesDir+'_cartMain.html', 'utf8', (err, cartMainData) => {
      if (!err && cartMainData && cartMainData.length > 0) {
          callback(false, cartMainData);
      } else {
          callback('A valid template name was not specified');
      }
  });
}

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalCartTemplates = function(str,cartBottomTemplateData,callback){
  str = typeof(str) == 'string' && str.length > 0 ? str : '';

  // Get the cart top
  helpers.getTemplate('_cartTop', undefined, false, (err,cartTopString) => {
    if(!err && cartTopString){
      // Get the cart bottom
      helpers.getTemplate('_cartBottom', cartBottomTemplateData, false, (err,cartBottomString) => {
        if(!err && cartBottomString){
          // Add them all together
          var fullString = cartTopString+str+cartBottomString;
          callback(false,fullString);
        } else {
          callback('Could not find the cart bottom template');
        }
      });
    } else {
      callback('Could not find the cart top template');
    }
  });
};


/**
 * External APIs
 *  
 */

//Send a request to Stripe payment inegration api and callback with a paymentIntent or error
helpers.stripe.getStripePaymentIntent = async (items, callback) => {
  //Set secret key. Remember to switch to your live secret key in production.
  const stripe = require('stripe')(config.API_KEYS.Stripe);
  
  try {
    var result = await stripe.paymentIntents.create({
      amount: 1,
      currency: 'usd',
      // Verify your integration in this guide by including this parameter
      metadata: {integration_check: 'accept_a_payment'}
    }).then((paymentIntent) => {
      return paymentIntent;
    }, (failed) => {
      console.log(failed);
    }).catch((err) => {
      console.log(err);
    });

    if (typeof(result) == 'object' && result !== null) {
      callback(false, result);
    } else {
      callback('Failed to create payment intent');
    }
    
  } catch (error) {
    console.log(error);
  }
}

//Try making Stripe Payment
helpers.tryMakingPayment = (amount, source, description, callback) => {
  //Construct the payload
  const payload = {
    amount: amount,
    currency: config.currency,
    //TODO Change back to correct source
    source: 'tok_bypassPending',
    description: description
  }

  //Stringify the payload
  const payloadString = querystring.stringify(payload);

  const requestDetails = {
    "protocol": "https:",
    "hostname": "api.stripe.com",
    "path": "/v1/charges",
    "method": "POST",
    "auth": config.API_KEYS.Stripe,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(payloadString)
    },
  }

  const req = https.request(requestDetails, (res) => {
    res.on('data', (data) => {
      var dataJson = helpers.jsonify(data.toString());
      
      let error = res.statusCode != 200 ? res.statusCode : false;

      if (error) {
        outcomeType = dataJson["error"]["type"];
        chargeId = dataJson["error"]["charge"];
      } else {
        outcomeType = dataJson["outcome"]["type"];
        chargeId = dataJson["id"];
      }

      const responseData = {
        chargeId, outcomeType
      };

      callback(error, responseData);
    });
  });

  req.on('error', e => {
    callback(e, {"outcomeType": "error"});
  });

  req.write(payloadString);
  req.end();
}

//Try making Stripe refund
helpers.tryMakingRefund = (chargeId, callback) => {
  const stringPayload = querystring.stringify({"charge" : chargeId});

  const reqDetails = {
    'protocol' : 'https:',
    'hostname' : 'api.stripe.com',
    'path' : '/v1/refunds',
    'method' : 'POST',
    'auth' : config.API_KEYS.Stripe,
    'headers' : {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(stringPayload)
    }
  };

  const req = https.request(reqDetails, res => {
    res.on('data', (data) => {
      let error = res.statusCode != 200 ? res.statusCode : false;
      const responseData = error ? "error" : "success";

      callback(error, responseData);
    });
  });

  req.on('error', e => {
    callback(e, "error");
  });

  req.write(stringPayload);
  req.end();
};

helpers.composeEmail = (orderData) => {

  const subject = `Your order with Pizza Delivery, #${orderData.id}`;
  const greeting = "Hey pizza lover!\n\n";
  const signature = "\n\nYours, Pizza Delivery.";
  let message = "Your order ";

  switch (orderData.status) {
    case "paid":

      message += "is confirmed and is being cooked right now.\n";

      let recipt = "";
      orderData.items.forEach(item => {
        recipt += item.name + " ".repeat(20 - item.name.length) + "|" +
          " ".repeat(5-String(item.quantity).length) + item.quantity + "pcs. |" +
          " ".repeat(6-String(item.price).length) + "$" + item.price + " |" +
          " ".repeat(10-String((item.price * item.quantity).toFixed(2)).length) + "$" + (item.price * item.quantity).toFixed(2) + "\n";
      });
      recipt += "=".repeat(52) + "\n";
      recipt += "Total:" + " ".repeat(45-String(orderData.total).length) +"$"+ orderData.total;

      message += "\nHere is your recipt:\n\n";
      message += recipt;

      message += "\n\nWe'll keep you updated about its further advancements.\n"

      break;
    case "readyToShip":
      message += "is ready and shipping really soon!\n";
      break;
    case "shipped":
      message += "is on the way!\n";
      break;
    case "delivered":
      message = "Enjoy your meal and see you soon!\n";
      break;
    case "canceled":
      message += "has been canceled and will be refunded if applicable.\n\nCome back soon!\n";
      break;
    case "rejected":
      message += "couldn't be processed by the payment system. Your shopping cart remains intact.\n";
      break;
    case "refunded":
      message += "has been refunded.\nSee you soon!";
      break;
    default:
      message = `Your order status: ${orderData.status}`;
  }

  return {
    "address" : orderData.email_address,
    "subject" : subject,
    "message" : greeting + message + signature
  };

};

helpers.sendEmail = (to, subject, emailMsgText, callback) => {
  const payload = {
    "from" : `Pizza Delivery <robot@${config.API_KEYS.Mailgun.domain}>`,
    //TODO change this back to 'to'
    "to" : 'comps244@gmail.com',
    "subject" : subject,
    "text" : emailMsgText
  };

  const stringPayload = querystring.stringify(payload);

  const reqDetails = {
    'protocol' : 'https:',
    'hostname' : 'api.mailgun.net',
    'path' : `/v3/${config.API_KEYS.Mailgun.domain}/messages`,
    'method' : 'POST',
    'auth' : `api:${config.API_KEYS.Mailgun.key}`,
    'headers' : {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(stringPayload)
    }
  };

  const req = https.request(reqDetails, res => {
    res.on('data', data => {
      // Data comes as a buffer, which gets converted to string and then jsonified
      const dataJson = helpers.jsonify(data.toString());

      let error = res.statusCode != 200 ? res.statusCode : false;

      callback(error, dataJson);
    });
  });

  req.on('error', err => {
    callback(err);
  });

  req.write(stringPayload);
  req.end();

};

helpers.email = orderData => {
  const email = helpers.composeEmail(orderData);
  helpers.sendEmail(email.address, email.subject, email.message, (err, data) => {
    if (!err && data) {
      helpers.colorLog(`Email: ${data.message}`, "green");
    } else {
      helpers.colorLog(err, "red");
    }
  });
};

// Export the module
module.exports = helpers;