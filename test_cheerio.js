
cheerio = require('cheerio');

const foo_elem = cheerio.load('<foo><bar>abc</bar></foo');

// console.log(foo_elem.root().find('bar').text());
// equivalent to:s
console.log(foo_elem('bar').text());

console.log(foo_elem.length);
