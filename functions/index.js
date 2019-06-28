const functions = require('firebase-functions');

exports.donate = functions.https.onRequest((request, response) => {

  var paytm_config = require('./paytm/paytm_config').paytm_config;
  var paytm_checksum = require('./paytm/checksum');
  var myFun = require('./myFunction');

  if (request.method !== 'POST') {
    response.send("<script>window.location = '" + paytm_config.PaymentInitURL + "'</script>");
  }

  var random = Math.floor(Math.random() * 999999).toString();
  var amount = request.body.amount;
  var name = request.body.name
  var email = request.body.email
  var mobile = request.body.mobile;
  var orderid = request.body.orderid
  if (amount == undefined) {
    response.send('Amount is Mandatory.');
  } else {
    if (amount < paytm_config.MinAmount) {
      response.send('Minimum Amount of ' + paytm_config.MinAmount + ' is Mandatory.');
    }
  }
  if (name == undefined) {
    name = 'CUST' + random
  }
  if (email == undefined) {
    email = 'email' + Math.floor(Math.random() * 999999).toString() + '@na.com'
  }
  if (mobile == undefined) {
    mobile = '9999' + random
  }
  if (orderid == undefined) {
    orderid = 'ORDER' + random
  }

  var paramarray = {};
  paramarray['MID'] = paytm_config.MID; //Provided by Paytm
  paramarray['ORDER_ID'] = orderid.replace(' ', '-'); //unique OrderId for every request
  paramarray['CUST_ID'] = name.replace(' ', '-'); // unique customer identifier 
  paramarray['INDUSTRY_TYPE_ID'] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
  paramarray['CHANNEL_ID'] = paytm_config.CHANNEL_ID; //Provided by Paytm
  paramarray['TXN_AMOUNT'] = amount; // transaction amount
  paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
  paramarray['CALLBACK_URL'] = paytm_config.CALLBACK_URL; //Provided by Paytm
  paramarray['EMAIL'] = email.replace(' ', '-'); // customer email id
  paramarray['MOBILE_NO'] = mobile; // customer 10 digit mobile no.
  paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {

    response.send(myFun.returnPage(paramarray, checksum, paytm_config.PAYTM_ENVIRONMENT));
  });
});

exports.DonationCallback = functions.https.onRequest((request, response) => {
  var paytm_config = require('./paytm/paytm_config').paytm_config;
  var paytm_checksum = require('./paytm/checksum');

  var checksum = request.body.CHECKSUMHASH;
  delete request.body.CHECKSUMHASH;
  if (paytm_checksum.verifychecksum(request.body, paytm_config.MERCHANT_KEY, checksum)) {
    if (request.body.STATUS == "TXN_SUCCESS") {
      response.send("<script>window.location = '" + paytm_config.PaymentSuccessURL + "'</script>");
    } else {
      response.send("<script>window.location = '" + paytm_config.PaymentFailureURL + "'</script>");
    }
  } else {
    response.send("<script>window.location = '" + paytm_config.PaymentFailureURL + "'</script>");
  }
});