const cheerio = require('cheerio');

let original_str = '<outer><div>foo1</div><div>foo2</div></outer>';
let some_weird_function = cheerio.load(original_str);
some_weird_function('div').each(function() {
  some_weird_object = cheerio(this);
  let old_text = some_weird_object.text();
  some_weird_object.text(old_text + old_text);
});

let new_str = some_weird_function.xml();
let initial_bullshit = '<html><head></head><body>';
let trailing_bullshit = '</body></html>';
console.log(new_str.substr(
  initial_bullshit.length,
  new_str.length - initial_bullshit.length - trailing_bullshit.length
));
