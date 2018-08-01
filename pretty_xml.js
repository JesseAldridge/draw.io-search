const pd = require('pretty-data').pd;
const fs = require('fs');

text = fs.readFileSync(process.argv[2], 'utf8');
fs.writeFileSync(process.argv[2], pd.xml(text));
