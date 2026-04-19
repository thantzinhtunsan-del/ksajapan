const pdf = require('pdf-parse/lib/pdf-parse.js');
const fs = require('fs');
const buf = fs.readFileSync('C:/Users/thant/OneDrive/Desktop/過去問題集/人間の尊厳と自立_問題集.pdf');
pdf(buf).then(data => {
  console.log('Pages:', data.numpages);
  console.log(data.text.slice(0, 4000));
}).catch(e => console.error(e.message));
