const mammoth = require("mammoth");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
//const path = require('path');
const fs = require('fs');
const generatePPTX = require('./generator');
//const filePath = path.relative(__dirname, './test.docx');
var options = {
    convertImage: mammoth.images.imgElement(function (image) {
        return image.read("base64").then(function (imageBuffer) {
            return {
                src: "data:" + image.contentType + ";base64," + imageBuffer
            };
        });
    })
};
let questionPool;
let currentQuestionTitle;

module.exports = async function convertDocx2Pptx(filePath) {
    questionPool = {};
    const result = await mammoth.convertToHtml({
        path: filePath,
        options: options
    })
    const body = result.value;
    const htmlString = `<html><head></head><body>${body}</body></html>`;
    //console.log(htmlString);
    fs.writeFileSync('./output3.html',htmlString);
    const dom = new JSDOM(htmlString, {
        includeNodeLocations: true,
        contentType: "text/html",
    });
    const document = dom.window.document;

    const selectionQuestion = Array.from(document.querySelectorAll('p')).find((element) => {
        if (element && element.textContent) {
            return element.textContent.search('part_one') !== -1
        }
        return false;
    });

    const fieldQuestion = Array.from(document.querySelectorAll('p')).find((element) => {
        if(element && element.textContent) {
            return element.textContent.search('part_two') !== -1
        }
        return false;
    });
    //selectionQuestion && console.log(selectionQuestion.textContent);
    // const selectionQuestions = [];
    selectionQuestion.nextSibling;
    classify(selectionQuestion.nextSibling);
    // for (let key in questionPool) { 
    //     const q = questionPool[key];
    //     let tmpOpt = classifyOption(q['rawOptions']);
    //     tmpOpt = tmpOpt.map((item) => item.trim());
    //     q['options'] = tmpOpt;
    // }

    // fieldQuestion.nextSibling;
    classify2(fieldQuestion.nextSibling);
    for (let key in questionPool) { 
        const q = questionPool[key];
        let tmpOpt = classifyOption(q['rawOptions']);
        tmpOpt = tmpOpt.map((item) => item.trim());
        q['options'] = tmpOpt;
    }
    //console.log(questionPool);
    fs.writeFileSync('./questions.json', JSON.stringify(questionPool, null, 2));

    generatePPTX('./questions.json');
    //fs.unlinkSync('./questions.json');
    return __dirname + '/question.pptx';
}

function classify(element) {
    const titleReg = /^\d+[\s\S]*/g;
    if (!element.nextSibling || (element && element.textContent.search('part_two') !== -1)) {
        return;
    } else {
        //is question title
        console.log(typeof element.firstChild);
        if (element.textContent.search(titleReg) !== -1) {
            //console.log(element.textContent);
            let rawTitle = dealwithOtherTags(element.innerHTML);
            rawTitle = dealwithEM(rawTitle);
            const pureTitle = leftTrimSpecialChar(rawTitle);
            console.log(pureTitle);
            currentQuestionTitle = pureTitle;
            questionPool[currentQuestionTitle] = {
                title: pureTitle,
                no: getQuestionNumber(element.textContent),
                rawOptions: [],
                image: null
            }
        }
        else if (element.firstChild && element.firstChild.nodeName === 'IMG') {
            if (questionPool[currentQuestionTitle]) {
                questionPool[currentQuestionTitle]['image'] = element.firstChild.src;//.substring(0,20);
            }
        }
        else {
            if (questionPool[currentQuestionTitle]) {
                const rawOption = dealwithEM(element.innerHTML);
                questionPool[currentQuestionTitle]['rawOptions'].push(rawOption);
            }
        }
        return classify(element.nextSibling);
    }
}

function classify2(element) {
    const titleReg = /^\d+[\s\S]*/g;
    if (!element.nextSibling || (element && element.textContent.search('part_three') !== -1)) {
        return;
    } else {
        //is question title
        console.log(typeof element.firstChild);
        if (element.textContent.search(titleReg) !== -1) {
            //console.log(element.textContent);
            let rawTitle = dealwithOtherTags(element.innerHTML);
            rawTitle = dealwithEM(rawTitle);
            const pureTitle = leftTrimSpecialChar(rawTitle);
            console.log(pureTitle);
            currentQuestionTitle = pureTitle;
            questionPool[currentQuestionTitle] = {
                title: pureTitle,
                no: getQuestionNumber(element.textContent),
                rawOptions: [],
                image: null
            }
        }
        else if (element.firstChild && element.firstChild.nodeName === 'IMG') {
            if (questionPool[currentQuestionTitle]) {
                questionPool[currentQuestionTitle]['image'] = element.firstChild.src;//.substring(0,20);
            }
        }
        // else {
        //     if (questionPool[currentQuestionTitle]) {
        //         const rawOption = dealwithEM(element.innerHTML);
        //         questionPool[currentQuestionTitle]['rawOptions'].push(rawOption);
        //     }
        // }
        return classify2(element.nextSibling);
    }
}
function dealwithOtherTags(str){
    return match = str.replace(/(<a.*<\/a>)/g, '');
}

function dealwithEM(str){
    return match = str.replace(/<em>|<\/em>/g, '');
}


function classifyOption(rawOptions) {
    const optionCount = rawOptions.length;
    if (optionCount === 1 && isAllOptionsInOneLine(rawOptions[0])) {
        //split options
        let arr = rawOptions[0].split(/\t/);
        if (arr.length < 4) {
            arr = rawOptions[0].split(/\s/);
        }
        return arr.filter((result) => result.trim() !== '');
    }
    if (optionCount === 2) {
        let tmp = []
        if (isTwoOptionsInOneLine(rawOptions[0])) {
            let arr = rawOptions[0].split(/\t/);
            if (arr.length < 2) {
                arr = rawOptions[0].split(/\s/);
            }
            tmp = tmp.concat(arr.filter((result) => result.trim() !== ''));
        }
        if (isTwoOptionsInOneLine(rawOptions[1])) {
            let arr = rawOptions[1].split(/\t/);
            if (arr.length < 2) {
                arr = rawOptions[1].split(/\s/);
            }
            tmp = tmp.concat(arr.filter((result) => result.trim() !== ''));
        }
        return tmp;
    }
    if (optionCount === 4) {
        return JSON.parse(JSON.stringify(rawOptions));
    }
    return [];
}
function isAllOptionsInOneLine(content) {
    const testReg = /[aA][\w\W]*[bB][\w\W]*[cC][\w\W]*[dD][\w\W]*/g;
    return content.search(testReg) !== -1 ? true : false;
}
function isTwoOptionsInOneLine(content) {
    const testReg = /[aA][\w\W]*[bB][\w\W]*/g;
    const testReg2 = /[cC][\w\W]*[dD][\w\W]*/g;
    const result = content.search(testReg) !== -1 ? true : false;
    const result2 = content.search(testReg2) !== -1 ? true : false;
    if (result || result2) {
        return true;
    }
    return false;
}
function leftTrimSpecialChar(word) {
    const reg = /[\u4e00-\u9fa5A-Za-z]/;
    while (word.length > 0 && !reg.test(word.charAt(0))) {
        word = word.substring(1, word.length);
    }
    return word;
}
function getQuestionNumber(content) {
    const reg = /^\d*/;
    const result = content.match(reg);
    if (result[0] !== '') {
        return parseInt(result[0])
    }
    return 0;
}