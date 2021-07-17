/**
 * Create and export configuration variables
 * 
 * 
 */

//Container for all environments
const environments = {};

//Staging (default) environment 
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    hashingSecret: 'thisIsASecret',
    ONE_HOUR_IN_MILLISECONDS: 1000*60*60,
    currency: 'USD',
    API_KEYS: {
        Stripe: 'sk_test_51IwoedF0CIFQrzQw1feF3TIYXlxQ0ej6ATcEwo8ittlhfmukHCtLi9Um1HpOIBIBW3lEI3qxmpMcSLrB0PzV49O300ume1LHIR',
        Mailgun: {
            key: 'd9433e7a785d11b1af49227cbf3db9f8-1d8af1f4-f58b0fea',
            domain: 'sandbox8269b2bd9ee143deaf84209fd4d69627.mailgun.org'
        }
    },
    templateGlobals : {
        'appName' : 'PizzaDelivery',
        'companyName' : 'NotARealCompany, Inc.',
        'yearCreated' : '2021',
        'baseUrlHttps' : `https://localhost:3001/`
    },
    THIRTYSECONDSINMILLISECONDS:  1000 * 30
};

//Production environment 
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    hashingSecret: 'thisIsAlsoASecret',
    ONE_HOUR_IN_MILLISECONDS: 1000*60*60,
    currency: 'USD',
    API_KEYS: {
        Stripe: 'sk_test_51IwoedF0CIFQrzQw1feF3TIYXlxQ0ej6ATcEwo8ittlhfmukHCtLi9Um1HpOIBIBW3lEI3qxmpMcSLrB0PzV49O300ume1LHIR',
        Mailgun: {
            key: 'd9433e7a785d11b1af49227cbf3db9f8-1d8af1f4-f58b0fea',
            domain: 'sandbox8269b2bd9ee143deaf84209fd4d69627.mailgun.org'
        }    
    },
    templateGlobals : {
        'appName' : 'PizzaDelivery',
        'companyName' : 'NotARealCompany, Inc.',
        'yearCreated' : '2021',
        'baseUrlHttps' : `https://localhost:5001/`
    },
    THIRTYSECONDSINMILLISECONDS:  1000 * 30
};

//Get the environment that was passed as a command line argument
const environmentPassed = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';

//Determine the environment to export
const environmentToExport = typeof(environments[environmentPassed]) == 'object' ? environments[environmentPassed] : environments['staging'];

//Export the environment
module.exports = environmentToExport;