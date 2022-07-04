const pptxgen = require('pptxgenjs');
const fs = require('fs');
const sizeOf = require('image-size')
module.exports = function generatePPTX(jsonFilePath){
    const jsonString = fs.readFileSync(jsonFilePath);
    //console.log();
    const questionsPool = JSON.parse(jsonString);
    const pres = new pptxgen();
    
    for (const key in questionsPool) {
        if (Object.hasOwnProperty.call(questionsPool, key)) {
            const q = questionsPool[key];
            let slide = pres.addSlide();
            slide.addText(q.title,{
                fontSize: 18,
                x: 1,
                y: 1,
                color: '363636',
                fill: {color: 'F1F1F1'},
                align: pres.AlignH.left,
            });
            if(q.image){
                let base64String = q.image;
                let base64Image = base64String.split(';base64,').pop();
                let imageFiltPath = './images/' + key+'.png';
                fs.writeFileSync(imageFiltPath, base64Image, {encoding: 'base64'});
                const dimensions = sizeOf(imageFiltPath);
                //console.log(dimensions.width, dimensions.height)
                slide.addImage({ path: imageFiltPath, x: 1, y: 2 ,w:2, h: 2 * dimensions.height / dimensions.width, type: 'cover'});               
            }
            if(q.options && q.options.length > 0){
                for (let i = 0; i < q.options.length; i++) {
                    const option = q.options[i];
                    slide.addText(option,{
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
}