const fs = require('fs')
const parsePdf = require('parse-pdf');
let path = require("path");
console.log("star");
(async()=>{
    console.log("star");
    const parsed = await parsePdf(fs.readFileSync(path.join(__dirname, "./pdf/___540218292953815028742138.pdf")))
    console.log("parsed", parsed);
})();
 