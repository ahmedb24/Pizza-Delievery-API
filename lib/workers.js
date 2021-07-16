/**
 * Worker to simulate the order's lifecycle
 * 
 * 
 */

//Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');
const util = require('util');
const debug = util.debuglog('workers');

//Container for workers module
const lib = {};

const trackedOrdersLoader = (callback) => {
    _data.read('orders', 'trackedOrders', (err, orderData) => {
        if (!err && orderData && orderData instanceof Array) {
            callback(false, orderData);
        } else {
            const trackedOrders = [];
            _data.create('orders', 'trackedOrders', trackedOrders, (err) => {
                if (!err) {
                    callback(false, trackedOrders);
                } else {
                    callback('Could not create the file for tracked orders')
                }
            });
        }
    });
}

//List all orders
const listOrders = (callback) => {
    _data.list('orders', (err, orders) => {
        if (!err && orders && orders.length > 0) {
            const orderObjects = [];

            //Lookup each order and push to orderObjects array
            orders.forEach(order => {
                const orderData = _data.readSync('orders', order);
                if (orderData != {} && typeof(orderData.id) == 'string') {
                    orderObjects.push(orderData);
                }
            });

            callback(false, orderObjects);
        } else {
            callback(err);
        }
    });
}

lib.gatherActiveOrders = () => {
    trackedOrdersLoader((err, trackedOrders) => {
        if (!err && trackedOrders) {
            //Create a list of tracked order IDs
            const trackedOrderIds = trackedOrders.map((x) => x.id);

            listOrders((err, orders) => {
                if (!err && orders && orders.length > 0 ) {

                    //Go through each order object in the orders array
                    orders.forEach(order => {
                        //If order is part of the tracked orders and it shouldn't be, remove it
                        if (trackedOrderIds.indexOf(order.id) > -1 && ['delivered', 'canceled', 'rejected'].indexOf(order.status) > -1) {
                            var unwantedTrackedOrderIndex = trackedOrders.indexOf(order);
                            trackedOrders.splice(unwantedTrackedOrderIndex, 1);
                        }

                        //If order is not part of the tracked orders and it should be, add it
                        if (trackedOrderIds.indexOf(order.id) == -1 && ['delivered', 'canceled', 'rejected'].indexOf(order.status) == -1) {
                            trackedOrders.push(order);
                        }
                    });

                    const stages = ["accepted","paid","readyToShip","shipped","delivered"];
                    
                    trackedOrders.forEach(trackedOrder => {
                        var currentStageIndex = stages.indexOf(trackedOrder.status);
                        
                        //Verify currentStageIndex is within the stages range
                        if (currentStageIndex >= 0 && currentStageIndex < stages.length-1) {
                            currentStageIndex++
                            trackedOrder.status = stages[currentStageIndex];

                            debug(`${Date.now()}: Order ID: ${trackedOrder.id}, Status: ${trackedOrder.status}`);

                            _data.update('orders', trackedOrder.id, trackedOrder, (err) => {
                                if (err) {
                                  debug("Error: Failed to update the order status.");
                                }
                            });

                            //Email new status to the user
                            helpers.email(trackedOrder);
                        }
                    });

                    //Remove delivered orders from further tracking
                    let i = trackedOrders.length;
                    while (i--) {
                        if (trackedOrders[i].status == "delivered") {
                            trackedOrders.splice(i, 1);
                        }
                    }

                    //Update tracked orders
                    _data.update('orders', 'trackedOrders', trackedOrders, err => {
                        if (err) {
                            debug("Failed to update tracked orders.");
                        }
                    });

                } else {
                    debug('Could not find orders to process');
                } 
            });


        } else {
            debug('Failed to setup order tracking');
        }
    });
}

lib.loop = () => {
    //Worker will age orders every 30seconds
    setInterval(() => {
        lib.gatherActiveOrders();
    }, config.THIRTYSECONDSINMILLISECONDS);
}

//Initialisation function for the workers library
lib.init = () => {
  helpers.colorLog("Background workers are running", "yellow");
//TODO undo this comment
  //lib.loop();
}

//Export the workers module
module.exports = lib;