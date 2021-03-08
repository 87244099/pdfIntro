let fs = require('fs');
const path = require("path");
// ___540218292953815028742138.pdf
let pdf2json = require("pdf2json");

// let pdfParser = new pdf2json(this, 1);

// let pdfDir = path.join(__dirname, "./pdf");
// let testPdfPath = path.join(pdfDir, "./___540218292953815028742138.pdf");

// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
// pdfParser.on("pdfParser_dataReady", pdfData => {
//     console.log("pdfData", pdfData);
//     // fs.writeFileSync("./result/pdf.json", JSON.stringify(pdfData));
//     let text = pdfParser.getRawTextContent();
//     console.log([...new Set(text.match(/[a-zA-Z]+/ig))]);
//     fs.writeFileSync("./result/pdf_text", text);
//     parseText(text);
// });

// pdfParser.loadPDF(testPdfPath);
let AllWords = [];
(async()=>{
    
    let files = fs.readdirSync(path.join(__dirname, "./pdf"));
    for(var i=0; i<files.length; i++){
        let testPdfPath = path.join(__dirname, "./pdf/"+files[i]);

        try{
            let res = await readPdf(testPdfPath);
            parseContent({
                pdfData: res.pdfData,
                content: res.content,
                pdfPath: testPdfPath
            });
        }catch(e){
            // console.log(e);
        }
    }

    console.log(JSON.stringify(AllWords));



})();

function readPdf(file){
    return new Promise((resolve, reject)=>{

        try{
            let pdfParser = new pdf2json(this, 1);
            pdfParser.loadPDF(file);

            pdfParser.on("pdfParser_dataReady", (pdfData)=>{
                let content = pdfParser.getRawTextContent();
                resolve({
                    pdfData:pdfData,
                    content: content
                });
            });
            pdfParser.on("pdfParser_dataError", reject);
        }catch(e){
            reject(e);
        }
    });
}


let words = [];

function parseContent(res){
    let {
        content,
        pdfData,
        pdfPath
    } = res;
    // if(pdfPath.includes("___540252199838450985088744")){
        // console.log("content", content);
        parseSkillWords(content);
        
    // console.log(parseParagraph(content));
    // return
    // }
    
    // console.log(content);
    // console.log("pdfPath", pdfPath);
    // console.log("pdfData", pdfData);
    // // console.log("content", content);
    // // console.log("经历", content.includes("经历"), content);//经历命中
    // let first = content.split("\n").slice(0, 5);
    // console.log(first.join("\n"));
    // console.log("--------------------");
}

function parseSkillWords(content){

    let wordLib = ["Vue","Express","vue-cli","element-ui","nodemailer","Github","AntD","mockjs","code review","js","Bootstrap","Sass","Less","Git","Webpack","Node","MongoDB","react","https","element","jsp","servlet","mqsql","tomcat","ie","chrome","fire","fox","javascript","js","vue-router","vuex","axios","KUMON","JAVA","Linux","SQLServer","Javaweb","web","ES","node","js","webpack","Java","Web","Python","S","Client","Server","Visual","SQL","ASP","NET","B","Browser","FC","Apache","Tomcat","Node","js","Webpack","spark","uniapp","java","python","Linux","Word","PowerPoint","Gitee","ERP","Spark","web","Uniapp","Excel","Web","Web","yrz","DOM","JS","jQuery","Cookie","localStorage","ajax","json","jsonp","transition","animation","Animate","CORS","node","Node","js","MongoDB","async","await","promise","router","Axios","VueX","react","echarts","echart","vant","vueX","swiper","VueRouter","axios","ACA","K","Java","Oracle","Linux","GPA","Web","ElementUI","js","bug","JavaWeb","MVC","JDBC","jsp","Ajax","Node","ps","UI","W","SqlServer","git","webpack","Web","ID","UI","api","Java","Web","ID","ECS","Wordpress","js"];

    let _words = [...new Set(content.match(/[a-zA-Z]+/ig))];
    AllWords.push(..._words);
}

function parseParagraph(content){
    // 段落的特点是含有标点符号，且句号为结尾
    let pIndex = -1;
    let allLine = content.split("\n");
    let paragraphList = [];
    allLine.forEach((line, index)=>{
        let prevLine = allLine[index-1];
        let nextLine = allLine[index+1];
        if(isParagraphLine(line)){
            pIndex++;
        }

        let isEndLine = line.trim().endsWith("。") && !isParagraphLine(nextLine);

        let isColonLine = line.includes("：") && line.endsWith("。");
        let colonField = line.slice(0, line.indexOf("："));
        if(isColonLine){
            paragraphList.push({
                field: colonField,
                content: line.slice(line.indexOf("："))
            });
        }else if(isEndLine){
            
            let pFirst = allLine[index-pIndex];
            let startLine = pFirst.indexOf(":") > -1 ? pFirst.slice(0, pFirst.indexOf("：")-1) : allLine[index-pIndex-1];

            let pContent = allLine.slice(index-pIndex, index+1);
            paragraphList.push({
                field: startLine,
                content: pContent.join("\n")
            });
            pIndex=-1;
        }
    })

    console.log("paragraphList", paragraphList);
}

function isParagraphLine(line){
    return line.includes("，") || line.includes("。") || line.includes("、");
}