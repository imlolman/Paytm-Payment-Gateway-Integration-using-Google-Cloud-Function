"use strict";

module.exports = {
  returnPage: function (paramarray, checksum, status) {
    var field = '';
    var url = '';
    if (status == 'PROD') {
      url = 'https://securegw.paytm.in/theia/processTransaction';
    } else if (status == 'TEST') {
      url = 'https://securegw-stage.paytm.in/theia/processTransaction';
    }

    for (var param in paramarray) {
      field += `<input type="hidden" name="` + param + `" value="` + paramarray[param] + `">`;
    }


    return `<html>
  <head>
  <title>Merchant Check Out Page</title>
  </head>
  <body>
    <center><h1>Please do not refresh this page...</h1></center>
      <form method="post" action="` + url + `" name="f1">
      <table border="1">
        <tbody>
        ` + field + `
        <input type="hidden" name="CHECKSUMHASH" value="` + checksum + `">
        </tbody>
      </table>
      <script type="text/javascript">
        document.f1.submit();
      </script>
    </form>
  </body>
  </html>`;
  }
}