/**
 * Handlers to handle incoming routes
 * 
 *  
 */

//Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');

//Container for the handlers
const handlers = {}

/*
 * HTML Handlers
 *
 */

//Index Handler
handlers.index = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
      // Prepare data for interpolation
      var templateData = {
        'head.title' : 'Uptime Monitoring - Made Simple',
        'head.description' : 'We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we\'ll send you a text to let you know',
        'body.class' : 'index'
      };
  
      //If request came from client location then Get indexDefault else request came from client so check if client is loggedIn then get dashboard(menu/list) or else get index
      const templateToGet = data.headers.isloggedin ? data.headers.isloggedin == 'true' ? 'menuList' : 'index' : '_indexDefault'; 

      // Read in a template as a string
      helpers.getTemplate(templateToGet,templateData,false,function(err,str){
        if(!err && str){
          // Add the universal header and footer
          helpers.addUniversalTemplates(str,templateData,function(err,str){
            if(!err && str){
              // Return that page as HTML
              callback(200,str,'html');
            } else {
              callback(500,undefined,'html');
            }
          });
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(405,undefined,'html');
    }
};

// Create Account Handler
handlers.accountCreate = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
      // Prepare data for interpolation
      var templateData = {
        'head.title' : 'Create an Account',
        'head.description' : 'Signup is easy and only takes a few seconds.',
        'body.class' : 'accountCreate'
      };

      //If request came from client location then Get indexDefault else request came from client so check if client is loggedIn then get dashboard(menuList) or else get accountCreate
      const templateToGet = data.headers.isloggedin ? data.headers.isloggedin == 'true' ? 'menuList' : 'accountCreate' : '_indexDefault'; 

      // Read in a template as a string
      helpers.getTemplate(templateToGet,templateData,false,function(err,str){
        if(!err && str){
          // Add the universal header and footer
          helpers.addUniversalTemplates(str,templateData,function(err,str){
            if(!err && str){
              // Return that page as HTML
              callback(200,str,'html');
            } else {
              callback(500,undefined,'html');
            }
          });
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(405,undefined,'html');
    }
};

// Create New Session Handler
handlers.sessionCreate = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
      // Prepare data for interpolation
      var templateData = {
        'head.title' : 'Login to your account.',
        'head.description' : 'Please enter your email address and password to access your account.',
        'body.class' : 'sessionCreate'
      };

      //If request came from client location then Get indexDefault else request came from client so check if client is loggedIn then get dashboard(menuList) or else get sessionCreate
      const templateToGet = data.headers.isloggedin ? data.headers.isloggedin == 'true' ? 'menuList' : 'sessionCreate' : '_indexDefault'; 

      // Read in a template as a string
      helpers.getTemplate(templateToGet,templateData,false,function(err,str){
        if(!err && str){
          // Add the universal header and footer
          helpers.addUniversalTemplates(str,templateData,function(err,str){
            if(!err && str){
              // Return that page as HTML
              callback(200,str,'html');
            } else {
              callback(500,undefined,'html');
            }
          });
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(405,undefined,'html');
    }
};

// Edit Your Account Handler
handlers.accountEdit = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
      // Prepare data for interpolation
      var templateData = {
        'head.title' : 'Account Settings',
        'body.class' : 'accountEdit'
      };

      //If request came from client location then Get indexDefault else request came from client so check if client is loggedIn then get dashboard(menuList) or else get accountEdit
      const templateToGet = data.headers.isloggedin ? data.headers.isloggedin == 'true' ? 'accountEdit' : '_indexDefault' : '_indexDefault'; 

      // Read in a template as a string
      helpers.getTemplate(templateToGet,templateData,false,function(err,str){
        if(!err && str){
          // Add the universal header and footer
          helpers.addUniversalTemplates(str,templateData,function(err,str){
            if(!err && str){
              // Return that page as HTML
              callback(200,str,'html');
            } else {
              callback(500,undefined,'html');
            }
          });
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(405,undefined,'html');
    }
};

// Session has been deleted Handler
handlers.sessionDeleted = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
      // Prepare data for interpolation
      var templateData = {
        'head.title' : 'Logged Out',
        'head.description' : 'You have been logged out of your account.',
        'body.class' : 'sessionDeleted'
      };

    //If request came from client location then Get indexDefault else request came from client so check if client is loggedIn then get dashboard(menuList) or else get sessionDeleted
    const templateToGet = data.headers.isloggedin ? 'sessionDeleted' : '_indexDefault'; 

    // Read in a template as a string
    helpers.getTemplate(templateToGet,templateData,false,function(err,str){
       if(!err && str){
         // Add the universal header and footer
         helpers.addUniversalTemplates(str,templateData,function(err,str){
           if(!err && str){
             // Return that page as HTML
             callback(200,str,'html');
           } else {
             callback(500,undefined,'html');
           }
         });
       } else {
         callback(500,undefined,'html');
        }
       });
    } else {
      callback(405,undefined,'html');
    }
};

// Account has been deleted
handlers.accountDeleted = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
      // Prepare data for interpolation
      var templateData = {
        'head.title' : 'Account Deleted',
        'head.description' : 'Your account has been deleted.',
        'body.class' : 'accountDeleted'
      };

      //If request came from client location then Get indexDefault else request came from client so get accountDeleted
      const templateToGet = data.headers.isloggedin ? 'accountDeleted' : '_indexDefault'; 

      // Read in a template as a string
      helpers.getTemplate(templateToGet,templateData,false,function(err,str){
        if(!err && str){
          // Add the universal header and footer
          helpers.addUniversalTemplates(str,templateData,function(err,str){
            if(!err && str){
              // Return that page as HTML
              callback(200,str,'html');
            } else {
              callback(500,undefined,'html');
            }
          });
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(405,undefined,'html');
    }
};

//Menu List Handler
handlers.menuList = (data, callback) => {
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Menu',
            'body.class' : 'menuList'
        };

        //If request came from client location then Get indexDefault else request came from client so get menuList
        const templateToGet = data.headers.isloggedin ? 'menuList' : '_indexDefault'; 

        // Read in a template as a string
        helpers.getTemplate(templateToGet,templateData,false,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err && str){
                     // Return that page as HTML
                     callback(200,str,'html');
                   } else {
                     callback(500,undefined,'html');
                   }
                });
            } else {
                callback(500,undefined,'html');
            }
        });    
     
    } else {
      callback(405,undefined,'html');
    }
}

//Cart List Handler
handlers.cartList = (data, callback) => {
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Shopping Cart',
            'body.class' : 'cartList',
        };

        //Get the user cart from the client request header
        var userCart =  data.headers.cart;
        userCart = JSON.parse(userCart);

        //If request came from client location then Get indexDefault else request came from client so get cartList
        const templateToGet = data.headers.isloggedin ? typeof(userCart) == 'object' && userCart instanceof Array ? 'cartList' : '_noCartItem' : '_indexDefault'; 

        // Read in a template as a string
        helpers.getCartTemplate(templateToGet,templateData,userCart,function(err, cartData){
            if(!err && cartData){
                const finalString = helpers.interpolate(cartData, templateData, false);
                // Add the universal header and footer
                helpers.addUniversalTemplates(finalString,templateData,function(err,str){
                   if(!err && str){
                     // Return that page as HTML
                     callback(200,str,'html');
                   } else {
                     callback(500,undefined,'html');
                   }
                });
            } else {
                callback(500,undefined,'html');
            }
        });    
     
    } else {
      callback(405,undefined,'html');
    }
}

//Order Create Handler
handlers.orderCreate = (data, callback) => {
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Checkout',
            'head.description': 'Credit Card',
            'body.class' : 'orderCreate'
        };

        //If request came from get orderCreate else request came from client location so get indexDefault
        const templateToGet = data.headers.isloggedin ? 'orderCreate' : '_indexDefault';

        // Read in a template as a string
        helpers.getTemplate(templateToGet,templateData,false,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err && str){
                     // Return that page as HTML
                     callback(200,str,'html');
                   } else {
                     callback(500,undefined,'html');
                   }
                });
            } else {
                callback(500,undefined,'html');
            }
        });    
     
    } else {
      callback(405,undefined,'html');
    }
}
//Cart Read Handler

// handlers.cartList = (data, callback) => }{
//         // Reject any request that isn't a GET
//         if(data.method == 'get'){
//             // Prepare data for interpolation
//             var templateData = {
//               'head.title' : 'Cart',
//               'body.class' : 'cartList'
//             };


//             helpers.getCartMainTemplate((err, str) => {
//                 if (!err && str && str.length > 0) {
//                     //Looup the user's cart
//                     _data.read('users', );
//                 } else {
//                     callback(500, {Error: 'A valid template name was not specified'});
//                 }
//             });

//             // Read in a template as a string
//             helpers.getTemplate('accountDeleted',templateData,function(err,str){
//               if(!err && str){
//                 // Add the universal header and footer
//                 helpers.addUniversalTemplates(str,templateData,function(err,str){
//                   if(!err && str){
//                     // Return that page as HTML
//                     callback(200,str,'html');
//                   } else {
//                     callback(500,undefined,'html');
//                   }
//                 });
//               } else {
//                 callback(500,undefined,'html');
//               }
//             });
//           } else {
//             callback(405,undefined,'html');
//           }
// }
  

//Public assets
handlers.public = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
      // Get the filename being requested
      var trimmedAssetName = data.path.replace('public/','').trim();
      if(trimmedAssetName.length > 0){
        // Read in the asset's data
        helpers.getStaticAsset(trimmedAssetName,function(err,data){
          if(!err && data){
  
            // Determine the content type (default to plain text)
            var contentType = 'plain';
  
            if(trimmedAssetName.indexOf('.css') > -1){
              contentType = 'css';
            }
  
            if(trimmedAssetName.indexOf('.png') > -1){
              contentType = 'png';
            }
  
            if(trimmedAssetName.indexOf('.jpg') > -1){
              contentType = 'jpg';
            }
  
            if(trimmedAssetName.indexOf('.ico') > -1){
              contentType = 'favicon';
            }
  
            // Callback the data
            callback(200,data,contentType);
          } else {
            callback(404);
          }
        });
      } else {
        callback(404);
      }
  
    } else {
      callback(405);
    }
  };
  
  

/**
 * JSON API Handlers
 * 
 */


handlers.test = (data, callback) => {
    callback(300, {Result: 'This is the test payload'}, 'json');
}

//Not-Found Handler
handlers.notFound = (data, callback) => {
    callback(404);
}


//Users Handler
handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
}

//Container for user's methods
handlers._users = {};

//Users - POST
//Required fields: name, email address, street address, password 
//Required fields: none
handlers._users.post = (data, callback) => {
    //Validate required fields
    var name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var email_address = typeof(data.payload.email_address) == 'string' && data.payload.email_address.trim().length > 2 && data.payload.email_address.indexOf('@') > -1 ? data.payload.email_address.trim() : false;
    var street_address = typeof(data.payload.street_address) == 'string' && data.payload.street_address.trim().length > 2 && data.payload.street_address.indexOf(' ') > -1 ? data.payload.street_address.trim() : false;
    
    if (name && password && email_address && street_address) {  
        //Fields are valid, verify no user has the same email with new user
        handlers._users.VerifyUser(email_address, (userExists) => {
            if (!userExists) {
                //Hash the user's password
                var hashedPassword = helpers.hash(password);
        
                if (hashedPassword) {
                    //Generate a random ID for new user
                    var userId = helpers.createRandomString(10);
        
                    if (userId) {
                        //Create User object
                        const newUserData = {
                            userId,
                            name,
                            hashedPassword,
                            email_address,
                            street_address
                        }
        
                        //Create the new user
                        _data.create('users', userId, newUserData, (err) => {
                            if (!err) {
                                callback(200, {Result: 'Created New User Successfully'})
                            } else {
                                //Could not create new userId, callback 500
                                callback(500, {Error: 'Could not create the new user'})
                            }
                        });
                    } else {
                        //Could not create new userId, callback a 500
                        callback(500, {Error: 'Could not create ID for new user'})
                    }
                } else {
                    //Could not hash password, callback a 500
                    callback(500, {Error: 'Could not hash the user\'s password'})
                }

            } else {
                callback(400, {Error: 'A user with the specified email address already exists'});
            }
        }); 

    } else {
        //Required field missing or invalid, callback a 400
        callback(400, {Error: 'Missing or invalid required field(s)'});
    }
}

//Users - GET
//Required fields: email address
//Optional fields: none
handlers._users.get = (data, callback) => {
    //Validate required fileds
    var email_address = typeof(data.queryStringObject.email_address) == 'string' && data.queryStringObject.email_address.trim().length > 2 && data.queryStringObject.email_address.indexOf('@') > -1 ? data.queryStringObject.email_address.trim() : false;

    //Error if email_address is invalid
    if (email_address) {
       
        //Get token from headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        
        //Verify the token
        handlers._tokens.verifyToken(token, email_address, (isTokenValid, userId) => {
            if (isTokenValid) {
        
                //Token is valid so lookup the user
                _data.read('users', userId, (err, userData) => {
                    if (!err && userData) {
        
                        //Delete the hashed password from the userData and send it to the requesting user
                        delete userData.hashedPassword;
                        callback(200, userData);
                    } else {
                        callback(404, {Error: 'The specified user does not exist'});
                    }
                });
            } else {
                callback(403, {Error: 'Missing or invalid token specified'});
            }
        });
    } else {
        callback(400, {Error: 'Missing required field(s)'});
    }
}

//Users - PUT
//Required fields: email_address
//Optional fields: name, street_address, password 
handlers._users.put = (data, callback) => {
    //Validate Required fields
    var email_address = typeof(data.payload.email_address) == 'string' && data.payload.email_address.trim().length > 2 && data.payload.email_address.indexOf('@') > -1 ? data.payload.email_address.trim() : false;
    
    //Validate Optional fields
    var name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var street_address = typeof(data.payload.street_address) == 'string' && data.payload.street_address.trim().length > 2 && data.payload.street_address.indexOf(' ') > -1 ? data.payload.street_address.trim() : false;
    
    //Error if email_address is invalid
    if (email_address) {
        //Error if there's nothing to update
        if (name || password || street_address) {
            
            //Get the token from the headers
            var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            
            //Verify that the token is valid for the email address
            handlers._tokens.verifyToken(token, email_address, (isTokenValid, userId) => {
                //Error if token is invalid
                if (isTokenValid && userId) {
                    
                    //Looup the user
                    _data.read('users', userId, (err, userData) => {
                        if (!err && userData) {
                            //Update fields if necessary
                            if (name) {
                                userData.name = name;
                            }
                            if (password) {
                                var hashedPassword = helpers.hash(password);
                                userData.hashedPassword = hashedPassword;
                            }
                            if (street_address) {
                                userData.street_address = street_address;
                            }

                            //Store the newly updated user
                            _data.update('users', userId, userData, (err) => {
                                if (!err) {
                                    callback(200, {Result: 'User updated Successfully'});
                                } else {
                                    callback(500, {Error: 'Could not update the user'})
                                }
                            });
                        } else {
                            callback(400, {Error: 'Specified user does not exist'});
                        }
                    });
                } else {
                    callback(403, {Error: 'Missing or invalid token'});
                }
            });
        } else {
            callback(400, {Error: 'Missing field(s) to update'});
        }
    } else {
        callback(400, {Error: 'Missing required field'});
    }

}

//Users - DELETE
//Required fields: email_address
//Optional fields: none 
handlers._users.delete = (data, callback) => {
    //Validate email_address
    var email_address = typeof(data.queryStringObject.email_address) == 'string' && data.queryStringObject.email_address.trim().length > 2 && data.queryStringObject.email_address.indexOf('@') > -1 ? data.queryStringObject.email_address.trim() : false;

    //Error if email address is invalid
    if (email_address) {

        //Get and validate token from headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false
    
        //Verify that the token is valid for email address provided
        handlers._tokens.verifyToken(token, email_address, (isTokenValid, userId) => {
            if (isTokenValid && userId) {
                //Lookup the user
                _data.read('users', userId, (err, userData) => {
                    
                    if (!err && userData) {
                        //Delete the user
                        _data.delete('users', userId, (err) => {
                            if (!err) {
                                callback(200, {Result:'User deleted Successfully'});
                            } else {
                                callback(500, {Error: 'Could not delete the specified user'});
                            }
                        });
                    } else {
                        callback(400, {Error: 'Could not find the specified user'});
                    }
                });
            } else {
                callback(403, {Error: 'Mising required token in header, or token is invalid'});
            }
        });
    } else {
        callback(400, {Error: 'Mising or invalid requires field(s)'});
    }
}

//Verify and get requested user from list of available users
handlers._users.VerifyUser = (email_address, callback) => {
    //List all the users
    _data.list('users', (err, fileNames) => {
        if (!err && fileNames && fileNames.length > 0) {
            var isUserFound = false; 
            var counter = 0;
            fileNames.forEach(fileName => {
                //Lookup the file to check if its the required user file
                _data.read('users', fileName, (err, userData) => {
                    counter++;
                    if (!err && userData) {
                        //Check if the current userData contains the email_address being looked for
                        if (userData.email_address == email_address) {
                            isUserFound = true;
                            callback(true, userData);
                        } 
                        if (isUserFound == false && counter >= fileNames.length) {
                            callback(false);
                        }
                    }
                });
            });
        } else {
            callback(false);
        }
    });
}

//Tokens Handler
handlers.tokens = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    }
}

//Container for token methods
handlers._tokens = {}


//Tokens - POST
//Required fields: email_address, password  
//Optional fields: none 
handlers._tokens.post = (data, callback) => {
    //Validate required fileds
    var email_address = typeof(data.payload.email_address) == 'string' && data.payload.email_address.trim().length > 2 && data.payload.email_address.indexOf('@') > -1 ? data.payload.email_address.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (email_address && password) {
        //Verify that the specified user exist
        handlers._users.VerifyUser(email_address, (isUserExisting, userData) => {
            if (isUserExisting && userData) {
                //Hash the password
                var hashedPassword = helpers.hash(password);
                
                //Make sure specified password when hashed matches the hashed password that is stored
                if (hashedPassword == userData.hashedPassword) {
                    var expires = Date.now() + config.ONE_HOUR_IN_MILLISECONDS; 
                    var id = helpers.createRandomString(20);
                    var userId = userData.userId;
                    //user is valid so create a token object with token that expires 1 hour from now
                    var tokenData = {
                        id: id,
                        expires: expires,
                        email_address: email_address,
                        userId: userId
                    }

                    //Store the token
                    _data.create('tokens', id, tokenData, (err) => {
                        if (!err) { 
                            callback(200, tokenData);
                        } else {
                            callback(500, {Error: 'Could not create new token'});
                        }
                    });

                } else {
                    callback(400, {Error: 'Password did not match the specified user\'s stored password'});
                }
            } else {
                callback(400, {Error: 'The specified user does not exist'})
            }
        });
    } else {
        callback(400, {Error: 'Missing or invalid required field(s)'});
    }
}

//Tokens - GET
//Required fields: id
//Optional fields: none
handlers._tokens.get = (data, callback) => {
    //Validate required fields
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length > 0 ? data.queryStringObject.id.trim() : false;

    //Error if id is invalid
    if (id) {
        
        //Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404, {Error: 'The Specified token does not exist'});
            }
        });
    } else {
        callback(400, {Error: 'Missing or invalid required fields'});
    }
}

//Tokens - PUT (Extend)
//Required fields: id, extend
//Optional fields:none
handlers._tokens.put = (data, callback) => {
    //Validate required fields
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length > 0 ? data.payload.id.trim() : false;
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend ? true : false;

    //Error if required fields are invalid
    if (id && extend) {
        //Get the email from the headers
        var email_address = typeof(data.headers.email) == 'string' && data.headers.email.trim().length > 2 && data.headers.email.indexOf('@') > -1 ? data.headers.email.trim() : false;
        
        if (email_address) {
            //Verify the token is valid for the given email_address
            handlers._tokens.verifyToken(id, email_address, (isTokenValid, userId, tokenData) => {
                if (isTokenValid && tokenData) {
                    //Verify the token isn't expired
                    if (tokenData.expires > Date.now()) {
                        //Token isn't expired, extend its expiration by an hour
                        tokenData.expires = tokenData.expires + config.ONE_HOUR_IN_MILLISECONDS;
    
                        //Store the updated token
                        _data.update('tokens', id, tokenData, (err) => {
                            if (!err) {
                                callback(200, {Result: 'Token expiration extended succesfully'});
                            } else {
                                callback(500, {Error: 'Could not extend the specified token\'s expiration'});
                            }
                        });
                    } else {
                        callback(400, {Error: 'The specified token has already expired and cannot be extended'});
                    }
                } else {
                    callback(403, {Error: 'Invalid token or email provided'});
                }
            });
        } else {
            callback(403, {Error: 'Invalid email in headers'});
        }
    } else {
        callback(400, {Error: 'Missing or invalid required fields'});
    }

}

//Tokens - DELETE
//Required fields: id
//Optional fields: none
handlers._tokens.delete = (data, callback) => {
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length > 0 ? data.queryStringObject.id.trim() : false;

    //Error if ID is invalid
    if (id) {
        //Get the email from the headers
        var email_address = typeof(data.headers.email) == 'string' && data.headers.email.trim().length > 2 && data.headers.email.indexOf('@') > -1 ? data.headers.email.trim() : false;
        
        if (email_address) {

            //Verify the token is valid for the given email_address
            handlers._tokens.verifyToken(id, email_address, (isTokenValid) => {
                if (isTokenValid) {
                    //Token is valid, so delete it
                    _data.delete('tokens', id, (err) => {
                        if (!err) {
                            callback(200, {Result: 'Token deleted successfully'});
                        } else {
                            callback(500, {Error: 'Could not delete the specified token'});
                        }
                    });
                } else {
                    callback(403, {Error: 'Invalid token or email provided'})
                }
            });
        } else {
            callback(403, {Error: 'Missing or invalid email in headers'});
        }
    } else {
        callback(400, {Error: 'Missing or invalid required fields'});
    }
}

//Verify if a given token id is valid for a given user
handlers._tokens.verifyToken = (id, email_address, callback) => {
    //Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            //Get the user ID from the token Data
            var userId = tokenData.userId;

            //Lookup the user
            _data.read('users', userId, (err, userData) => {
                if (!err && userData) {
                    //If email address is provided then verify the email and token expiry
                    if (email_address) {
                        //Verify that the token is valid for the given user and has not expired
                        if (userData.email_address == email_address && tokenData.expires > Date.now()) {
                            callback(true, userId, tokenData, userData);
                        } else {
                            callback(false);
                        }
                    } else {
                        //No email provided so only verify token expiry
                        if (tokenData.expires > Date.now()) {
                            callback(true, userData);
                        } else {
                            callback(false);
                        }
                    }
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    });
}

//Menu Handler
handlers.menu = (data, callback) => {
    var acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._menu[data.method](data, callback);
    } else {
        callback(405);
    }
}

//Container for menu methods
handlers._menu = {};

//Menu - GET
//Required fields: tokenId
//Optional fields: none
handlers._menu.get = (data, callback) => {
    //Lookup the token from the headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    //Error if token if invalid
    if (token) {
        //Lookup the token
        _data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                //Read all items in the menu
                _data.read('menu', 'menu_1', (err, menuData) => {
                    if (!err && menuData) {
                        callback(200, menuData);
                    } else {
                        callback(500, {Error: 'Could not read menu items'});
                    }
                });
            } else {
                callback(404, {Error: 'The specified token does not exist'});
            }
        });
    } else {
        callback(403, {Error: 'Missing or invalid token'});
    }
}

//Carts Handler
handlers.carts = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._carts[data.method](data, callback);
    } else {
        callback(405);
    }
}

//Container for carts methods
handlers._carts = {};

//Carts - POST
//Required fields: menu_items
//Required fields: none
handlers._carts.post = (data, callback, isUpdatingUser) => {
    //Validate required fields
    var cart_items = typeof(data.payload.cart) == 'object' && data.payload.cart instanceof Array ? data.payload.cart : false;

    if (cart_items) {
        //Get token from headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    
        //Error if token is invalid
        if (token) {
            //Lookup the token
            _data.read('tokens', token, (err, tokenData) => {
                if (!err && tokenData) {
                    var userId = tokenData.userId

                    //Lookup the logged in user
                    _data.read('users', userId, (err, userData) => {
                        if (!err && userData) {
    
                            //Update the user
                            userData.cart = cart_items;

                            //Store the updated user
                            _data.update('users', userId, userData, (err) => {
                                if (!err) {
                                    var msgT0Reply = isUpdatingUser === true ? 'Updated user\'s cart successfully' : 'Created user\'s cart successfully';
                                    callback(200, {Result: msgT0Reply, cart:userData.cart});
                                } else {
                                    callback(500, {Error: 'Could not update user'});
                                }
                            });
                        } else {
                            callback(404, {Error: 'The specified token did not match any user'});
                        }
                    });
                } else {
                    callback(404, {Error: 'The specified token does not exist'});
                }
            });
        } else {
            callback(403, {Error: 'Missing or invalid token'});
        }
    } else {
        callback(400, {Error: 'Missing or invalid menu items in payload'});
    }
}

//Carts - GET
//Required fields: none
//Required fields: none
handlers._carts.get = (data, callback) => {
    //Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    //Error if token is invalid
    if (token) {
        //Lookup the token
        _data.read('tokens', token, (err, tokenData) => {
            if (!err && token) {
                var userId = tokenData.userId;
                
                //Lookup the logged in user 
                _data.read('users', userId, (err, userData) => {
                    if (!err && userData) {
                        var userCart = userData.cart;
                        if (userCart) {
                            callback(200, {userCart});
                        } else {
                            callback(500, {Error: 'The specified user\'s cart was not found'})
                        }
                    } else {
                        callback(404, {Error: 'The specified token did not match any user'});
                    }
                });
            } else {
                callback(404, {Error: 'The specified token does not exist'});
            }
        });
    } else {
        callback(403, {Error: 'Missing or invalid token'});
    }
}

//Carts - PUT
//Required fields: id, quantity
//Required fields: none
handlers._carts.put = (data, callback) => {
    handlers._carts.post(data, callback, true);
    // var id = typeof(data.payload.id) == 'number' && data.payload.id > 0 ? data.payload.id : false; 
    // var quantity = typeof(data.payload.quantity) == 'number' && data.payload.quantity > 0 ? data.payload.quantity : false; 

    // if (id && quantity) {
    //     //Get token from headers
    //     var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    
    //     //Error if token is invalid
    //     if (token) {
    //         //Lookup the token
    //         _data.read('tokens', token, (err, tokenData) => {
    //             if (!err && tokenData) {
    //                 var userId = tokenData.userId;
                    
    //                 //Lookup the logged in user 
    //                 _data.read('users', userId, (err, userData) => {
    //                     if (!err && userData) {

    //                         //Construct the new item object
    //                         var newItem = {
    //                             id,
    //                             quantity
    //                         }

    //                         //Get the user's cart and update accordingly
    //                         var userCart = typeof(userData.cart) == 'object' && userData.cart instanceof Array ? userData.cart : [];
    //                         userCart.push(newItem);

    //                         //Store the user's data
    //                         _data.update('users', userId, userData, (err) => {
    //                             if (!err) { 
    //                                 callback(200, {Result: 'Added new item to cart successfully'});
    //                             } else {
    //                                 callback(500, {Error: 'Could not update user with new cart item'});
    //                             }
    //                         });
    //                     } else {
    //                         callback(404);
    //                     }
    //                 });
    //             } else {
    //                 callback(404, {Error: 'The specified token does not exist'});
    //             }
    //         });
    //     } else {
    //         callback(403, {Error: 'Missing or invalid token'});
    //     }
    // } else {
    //     callback(400, {Error: 'Missing or invalid required field(s)'});
    // }
}

//Validate a user's order
handlers._carts.validateOrder = (userCart, callback) => {
    _data.read('menu', 'menu_1', (err, menuData) => {
        if (!err && menuData) {
            const order = {
                items: [],
                total: .0
            }

            for (let key in userCart) {
                if (userCart.hasOwnProperty(key)) {
                    var price = parseInt(menuData[userCart[key].name].split('$')[1]);
                    var quantity = userCart[key].quantity;
                    //Verify the price and quantity are number and integer repectively
                    if (typeof(price) == 'number' && Number.isInteger(quantity)) {
                        //Construct the item object
                        const item = {
                            name: userCart[key].name,
                            price: price,
                            quantity: quantity
                        }

                        //Update order items and total
                        order.items.push(item);
                        order.total += item.price * item.quantity;
                    }
                }
            }

            //Round total to 2 digits
            order.total = order.total.toFixed(2);

            //Callback positively only if order.items has atleast 1 item
            if (Object.keys(order.items).length > 0) {
                callback(false, order); 
            } else {
                callback(true);
            }
        } else {
            callback(true);
        }
    });
};

//Orders Handler
handlers.orders = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._orders[data.method](data, callback);
    } else {
        callback(405);
    }
}

//Container for orders submethods
handlers._orders = {};

//Orders - POST
//Required fields: payment data
//Required fields: none
handlers._orders.post = (data, callback) => {

    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false
    var paymentCreds =  typeof(data.payload.token) == 'object' && data.payload.token !== null && data.payload.token !== {} ? data.payload.token : false;

    if (paymentCreds && token) {

        handlers._tokens.verifyToken(token, undefined, (isTokenValid, userData) => {
            if (isTokenValid && userData) {
                //Get the user's cart 
                var userCart = typeof(userData.cart) == 'object' && userData.cart !== {} ? userData.cart : false;
                if (userCart) {
        
                    //Validate shopping cart
                    handlers._carts.validateOrder(userCart, (err, orderData) => {
                        if (!err && orderData) {
                            //Add other order fields
                            const orderId = helpers.createRandomString(20); 
                            orderData.id = orderId;
                            orderData.email_address = userData.email_address;
                            orderData.statusHistory = {
                                'accepted': Date.now()
                            }
                            orderData.status = 'accepted';
        
                            //Store the new order to filesystem
                            _data.create('orders', orderId, orderData, (err) => {
                                if (!err) {
                                    //Add the new order id to the user data
                                    var orders = typeof(userData.orders) == 'object' && userData.orders instanceof Array ? userData.orders : [];
                                    orders.push(orderId);
                                    userData.orders = orders;
        
                                    //Delete the user's cart
                                    delete userData.cart;
        
                                    //Update the user with the new order id and deleted cart
                                    _data.update('users', userData.userId, userData, (err) => {
                                        if (err) {
                                            // Not critical enough to rollback the entire transaction
                                            console.log(`${err}: failed to add order to the user: ${orderData.email_address} | orderId: ${orderData.id}`);
                                        } 
                                    });
        
                                    //Trying making payment
                                    const orderPaymentDesc = `Payment for order ${orderId}`;
                                    helpers.tryMakingPayment(Math.round(orderData.total * 100.0), paymentCreds, orderPaymentDesc, (err, chargeData) => {
                                        
                                        orderData.chargeId = chargeData.chargeId;
                                        helpers.colorLog(`Attempted payment: ${orderPaymentDesc} | Result: ${chargeData.outcomeType.toUpperCase()}`, err ? 'red': 'green', "bright");
                                        
                                        if (!err) {
                                            //Update the order's paid status history
                                            orderData.statusHistory.paid = Date.now();
                                            //Update the order's status
                                            orderData.status = 'paid';
                                        } else {
                                            //Update the order's rejected status history
                                            orderData.statusHistory.rejected = Date.now();
                                            // Update the order's status
                                            orderData.status = 'rejected';
                                        }
        
                                        //Update the order
                                        _data.update('orders', orderId, orderData, (err) => {
                                            //Not critical enough to rollback the transaction
                                            if (err) {
                                                console.log(`${err}: failed to add order to the user: ${orderData.email_address} orderId: ${orderData.id}`);
                                            }
                                            
                                            //Send email to user
                                            delete orderData.chargeId;
                                            helpers.email(orderData);
        
                                            callback(200, orderData);
                                        });
                                    });
                                } else {
                                    callback(500, {Error: 'Could not create new order'});
                                }
                            });
                        } else {
                            callback(500, {Error: 'Could not create order data from items in cart'});
                        }
                    });
                } else {
                    callback(403, {Error: 'No valid Shopping cart exists for the user'})
                }
            } else {
                callback(403, {Error: 'Invalid token provided'});
            }
        });
    } else {
        callback(400, {Error: 'Missing or invalid required field(s)'})
    }
}

//Orders - GET
//Required fields: email_address, orderId 
//Optional fields:  none
handlers._orders.get = (data, callback) => {
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    var email_address = typeof(data.payload.email_address) == 'string' && data.payload.email_address.trim().length > 2 && data.payload.email_address.indexOf('@') > -1 ? data.payload.email_address.trim() : false;
    var orderId = typeof(data.queryStringObject.orderId) == 'string' && data.queryStringObject.orderId.trim().length > 2 ? data.queryStringObject.orderId.trim() : false;

    if (email_address && orderId) {
         //Get token from heeaders
         var token = typeof(data.headers.token) == 'string' ? data.headers.token : false
    
         if (token) {
             handlers._tokens.verifyToken(token, email_address, (isTokenValid, userId, tokenData, userData) => {
                 if (isTokenValid) {
                     if (userData.orders.indexOf(orderId) > -1) {
                         //Lookup the order
                         _data.read('orders', orderId, (err, orderData) => {
                             if (!err && orderData) {
                                 //Verify order status is not canceled
                                 if (orderData.status !== 'canceled') {
                                     callback(200, orderData);
                                 } else {
                                     callback(400, {Error: 'Can\'t return the order, as it is already canceled' } )
                                 }
                             } else {
                                 callback(500, {Error: 'Order not found'});
                             }
                         });
                     } else {
                         callback(500, {Error: 'No order with the specified ID is associated with the user'});
                     }
                 } else {
                     callback(403, {Error: 'Missing or invalid token or email address'});
                 }
             });
         } else {
            callback(400, {Error: 'Missing or invalid token'});
         }
    } else {
        callback(400, {Error: 'Missing or invalid required fields'});
    }
}

//Orders - DELETE
//Required fields: email_address, orderId
//Optional fields: none
handlers._orders.delete = (data, callback) => {
    //Validate required fields
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    var email_address = typeof(data.payload.email_address) == 'string' && data.payload.email_address.trim().length > 2 && data.payload.email_address.indexOf('@') > -1 ? data.payload.email_address.trim() : false;
    var orderId = typeof(data.queryStringObject.orderId) == 'string' && data.queryStringObject.orderId.trim().length > 2 ? data.queryStringObject.orderId.trim() : false;

    if (email_address && orderId) {
        handlers._tokens.verifyToken(token, email_address, (isTokenValid, userId, tokenData, userData) => {
            if (isTokenValid) {
                _data.read('orders', orderId, (err, orderData) => {
                    if (!err && orderData) {
                        var cancellable = (["accepted", "paid", "readyToShip","shipped"].indexOf(orderData.status) > -1);
                        var refundable = (["paid", "readyToShip","shipped"].indexOf(orderData.status) > -1);

                        if (cancellable) {
                            //Update order status to canceled
                            orderData.statusHistory.canceled = Date.now();
                            orderData.status = 'canceled';

                            //Refund if applicable
                            if (refundable) {
                                helpers.tryMakingRefund(orderData.chargeId, (err, responseData) => {

                                    helpers.colorLog(`Attempted refund for chargeId: ${orderData.chargeId} | Result: ${responseData.toUpperCase()}`, err ? "red" : "green", "bright");
                      
                                    if (!err) {
                                      // Virtual status to inject into email composition, not saved to disk.
                                      orderData.status = "refunded";
                                      // Email about successful refund.the 
                                      helpers.email(orderData);
                                      callback(200);
                                    } else {
                                      callback(err, {"Error" : "Failed to refund."});
                                    } 
                                });
                            }

                            //Save updated order with canceled status
                            _data.update('orders', orderId, orderData, (err) => {
                                if (err) {
                                    helpers.colorLog(`Error: Failed to update order with canceled status': ${orderId}`);
                                }
                            });

                            //Email about cancelation
                            helpers.email(orderData);

                        } else {
                            callback(403, {"Error" : "Can't delete the order due to its status."});
                        }
                    } else {
                        callback(400, {Error: 'The specified orderId does not exist'});
                    }
                });
            } else {
                callback(403, {Error: 'Missing or invalid token or email address'});
            }
        });
    } else {
        callback(400, {Error: 'Missing or invalid required fields'});
    }
}

handlers._orders.performPriceExtraction = (userCart, callback) => {
    //Lookup each item's price and store in an array
    var itemPriceToExtract = userCart.length;
    var prices = [];
    var itemPriceExtracted = 0;
    var priceExtractionErrors = false;
    userCart.forEach((item) => {
        
        //Lookup the item
       _data.read('menu', item.id, (err, itemData) => {
            if (err) {
                priceExtractionErrors = true;
            } else {
                prices.push(itemData.price);
            }
            itemPriceExtracted++;
            if (itemPriceExtracted == itemPriceToExtract) {
                if (!priceExtractionErrors) {
                    callback(false, prices);
                } else {
                    callback('Errors encountered when attempting to read all the menu items and get their prices. Some items may not have been read successfully');
                }
            }
       }); 
    });
}

//Create_Payment_Intent Handler
handlers.create_payment_intent = (data, callback) => {
    var acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._create_payment_intent[data.method](data, callback);
    } else {
        callback(405);
    }
}

//Container for Create_Payment_Intent submethods
handlers._create_payment_intent = {};

//Create_Payment_Intent - POST
handlers._create_payment_intent.post = (data, callback) => {
    //Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    if (token) {
        //Lookup the token
        _data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {4
                var userId = tokenData.userId;
                
                //Lookup the logged in user 
                _data.read('users', userId, (err, userData) => {
                    if (!err && userData) {
                        //Get the user's cart 
                        var userCart = typeof(userData.cart) == 'object' && userData.cart instanceof Array && userData.cart.length > 0 ? userData.cart : [];
                        
                        //Extract the prices from each item
                        handlers._orders.performPriceExtraction(userCart, (err, prices) => {
                            if (!err && prices) {
                                helpers.stripe.getStripePaymentIntent(prices, (err, paymentIntent) => {
                                    if (!err && paymentIntent) {
                                        
                                    }
                                    console.log(paymentIntent);
                                });
                            } else {
                                callback(500, {Error:err});
                            }
                        });
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(404, {Error: 'The specified token does not exist'});
            }
        });
    } else {
        callback(400, 'Missing or invalid token');
    }

};


//Export the handlers module
module.exports = handlers;