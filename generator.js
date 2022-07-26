const pptxgen = require('pptxgenjs');
const fs = require('fs');
const sizeOf = require('image-size');
const { raw } = require('express');
module.exports = function generatePPTX(jsonFilePath){
    const jsonString = fs.readFileSync(jsonFilePath);
    //console.log();
    const questionsPool = JSON.parse(jsonString);
    const pres = new pptxgen();
    
    for (const key in questionsPool) {
        if (Object.hasOwnProperty.call(questionsPool, key)) {
            const q = questionsPool[key];
            let slide = pres.addSlide();
            let rawTitle = q.title;
            const textArr = generateText(rawTitle,true);
            slide.addText(textArr,{
                x: 1,
                y: 1,
                color: '363636',
                fill: {color: 'F1F1F1'},
                align: pres.AlignH.left,
            })
            
            if(q.image){
                let base64String = q.image;
                let base64Image = base64String.split(';base64,').pop();
                let imageFiltPath = './images/' +'tmp.png';
                fs.writeFileSync(imageFiltPath, base64Image, {encoding: 'base64'});
                const dimensions = sizeOf(imageFiltPath);
                //console.log(dimensions.width, dimensions.height)
                slide.addImage({ data: base64String, x: 1, y: 2 ,w:2, h: 2 * dimensions.height / dimensions.width, type: 'cover'});               
                fs.unlinkSync(imageFiltPath);
            }
            if(q.options && q.options.length > 0){
                for (let i = 0; i < q.options.length; i++) {
                    const option = q.options[i];
                    slide.addText(generateText(option),{
                        fontSize: 14,
                        x: q.image ? 3 : 1,
                        y: 2 + i * 0.5,
                        color: '363636',
                        fill: {color: 'F1F1F1'},
                        align: pres.AlignH.left,
                    })
                }
            }
        }
    }
    pres.writeFile({fileName: 'question.pptx'});

    function generateText(rawText, isTitle){
        const tmpArr = rawText.split(/((<sup>|<sub>).{1,2}(<\/sup>|<\/sub>))/).filter((x) => {
            if(x !== "<sub>" && x !== "</sub>" && x !== "<sup>" && x !== "</sup>"){
                return true
            }
            return false;
        });
        const textArr = [];
        for (let i = 0; i < tmpArr.length; i++) {
            let tmp = tmpArr[i];
            if(tmp.search(/^(<sub>.{1,2}<\/sub>)$/) !== -1){
                tmp =  tmp.replace(/<sub>|<\/sub>/g,"");
                const subtext = {    
                    text: tmp,
                    options: {
                        // fontSize: isTitle ? 12 : 8,
                        subscript: true
                        // color: '363636',
                        // fill: {color: 'F1F1F1'},
                    }
                }
                textArr.push(subtext);
            }
            else if(tmp.search(/^(<sup>.{1,2}<\/sup>)$/) !== -1){
                tmp =  tmp.replace(/<sup>|<\/sup>/g,"");
                const subtext = {    
                    text: tmp,
                    options: {
                        // fontSize: isTitle ? 12 : 8,
                        superscript: true
                        // color: '363636',
                        // fill: {color: 'F1F1F1'},
                    }
                }
                textArr.push(subtext);
            }
            else{
                const subtext = {    
                    text: tmp,
                    options: {
                        fontSize: isTitle ? 18 : 14,
                        // color: '363636',
                        // fill: {color: 'F1F1F1'},
                    }
                }
                textArr.push(subtext);
            }
        }
        return textArr;
    }
}