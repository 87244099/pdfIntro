var pdfUtil = require('pdf-to-text');
var path = require("path");
var pdf_path = path.join(__dirname, "./pdf/___540218292953815028742138.pdf");
 
pdfUtil.info(pdf_path, function(err, info) {
    if (err) throw(err);
    console.log(info);
});