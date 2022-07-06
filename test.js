const args = require('minimist')(process.argv.slice(2));
const convertDocx2Pptx = require('./main');
const filePath = args['file'];
convertDocx2Pptx(filePath);
//console.log(pptPath);

