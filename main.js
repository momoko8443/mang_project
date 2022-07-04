const mammoth = require("mammoth");
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const path = require('path');
const fs = require('fs');
const generatePPTX = require('./generator');
const filePath = path.relative(__dirname, './test.docx');
var options = {
    convertImage: mammoth.images.imgElement(function(image) {
        return image.read("base64").then(function(imageBuffer) {
            return {
                src: "data:" + image.contentType + ";base64," + imageBuffer
            };
        });
    })
};

let questionPool = {};
let currentQuestionTitle;
mammoth.convertToHtml({
    path: filePath,
    options: options
}).then((result)=>{
    const body = result.value;
    const htmlString = `<html><head></head><body>${body}</body></html>`;
    //console.log(htmlString);
    const dom = new JSDOM(htmlString,{
        includeNodeLocations: true,
        contentType: "text/html",
    });
    const document = dom.window.document;
    
    const selectionQuestion = Array.from(document.querySelectorAll('p')).find((element)=> {
        if(element && element.textContent){
            return element.textContent.search('part_one') !== -1
        }
        return false;
    });
    //selectionQuestion && console.log(selectionQuestion.textContent);
    // const selectionQuestions = [];
    selectionQuestion.nextSibling;
    classify(selectionQuestion.nextSibling);
    for(let key in questionPool){
        const q = questionPool[key];
        q['options'] = classifyOption(q['rawOptions']);
    }
    //console.log(questionPool);
    fs.writeFileSync('./questions.json',JSON.stringify(questionPool,null,2));

    generatePPTX('./questions.json');
}).done(); 

function classify(element){
    const titleReg = /^\d+[\s\S]*/g;
    if(!element.nextSibling || (element.nextSibling && element.nextSibling.textContent.search('part_two') !== -1)){
        return;
    }else{
        //is question title
        console.log(typeof element.firstChild);
        if(element.textContent.search(titleReg) !== -1){
            //console.log(element.textContent);
            const pureTitle = leftTrimSpecialChar(element.textContent);
            console.log(pureTitle);
            currentQuestionTitle = pureTitle;
            questionPool[currentQuestionTitle] = {
                title: pureTitle,
                no: getQuestionNumber(element.textContent),
                rawOptions:[],
                image: null
            }
        }
        else if(element.firstChild && element.firstChild.nodeName === 'IMG'){
            if(questionPool[currentQuestionTitle]){
                questionPool[currentQuestionTitle]['image'] = element.firstChild.src;//.substring(0,20);
            }
        }
        else{
           if(questionPool[currentQuestionTitle]){
            questionPool[currentQuestionTitle]['rawOptions'].push(element.textContent);
           }
        }
        return classify(element.nextSibling);
    }
}

function classifyOption(rawOptions){
    const optionCount = rawOptions.length;
    if(optionCount === 1 && isAllOptionsInOneLine(rawOptions[0])){
        //split options
        const arr = rawOptions[0].split(/\t/);
        return arr.filter((result) => result !== '');
    }
    if(optionCount > 1){
        return JSON.parse(JSON.stringify(rawOptions));
    }
}
function isAllOptionsInOneLine(content){
    const testReg = /[aA][\w\W]*[bB][\w\W]*[cC][\w\W]*[dD][\w\W]*/g;
    return content.search(testReg) !== -1 ? true : false;
}

function leftTrimSpecialChar(word){
    const reg = /[\u4e00-\u9fa5A-Za-z]/;
    while(word.length > 0 && !reg.test(word.charAt(0))){
        word = word.substring(1,word.length-1);
    }
    return word;
}
function getQuestionNumber(content){
    const reg = /^\d*/;
    const result = content.match(reg);
    if(result[0] !== ''){
        return parseInt(result[0])
    }
    return 0;
}