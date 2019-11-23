const path = require('path');
const fs = require('fs');

const pako = require('pako');
const pd = require('pretty-data').pd;
const shell = require('shelljs');
const cheerio = require('cheerio');
const unescape_ = require('unescape');

function stringToBytes(str) {
  let arr = new Array(str.length);

  for (let i = 0; i < str.length; i++)
    arr[i] = str.charCodeAt(i);

  return arr;
}

function bytesToString(arr) {
  let str = '';

  for (let i = 0; i < arr.length; i++)
    str += String.fromCharCode(arr[i]);

  return str;
}

function xml_to_text(document_html) {
  const doc_elem = cheerio.load(document_html);
  let all_cell_text = '';
  doc_elem('diagram').each(function(diagram_index) {
    all_cell_text += `diagram ${diagram_index}\n---\n`
    let diagram_elem = cheerio(this);
    let diagram_text = diagram_elem.text();
    diagram_text = Buffer.from(diagram_text, 'base64');
    try {
      diagram_text = pako.inflateRaw(diagram_text);
    } catch(err) {
      console.log('error in inflateRaw');
      return;
    }

    diagram_text = bytesToString(diagram_text);

    try {
      diagram_text = decodeURIComponent(diagram_text);
    }
    catch(err) {
      console.log('error in decodeURIComponent');
      return;
    }

    diagram_text = unescape_(diagram_text);
    diagram_text = pd.xml(diagram_text);

    const inflated_diagram_elem = cheerio.load(diagram_text);
    let cells = inflated_diagram_elem('mxcell').each(function(index) {
      const mxcell_elem = cheerio(this);
      const style = mxcell_elem.attr('style');
      if(style && style.indexOf('image') != -1)
        return;
      all_cell_text += mxcell_elem.attr('value') + '\n';
    });
  });

  return all_cell_text;
};

function inflate_diagram(orig_path, inflated_path) {
  shell.mkdir('-p', path.dirname(inflated_path));

  console.log('reading:', orig_path);
  fs.readFile(orig_path, 'utf8', function(err, text) {
    let document_text = xml_to_text(text);
    console.log('writing to:', inflated_path);
    fs.writeFile(inflated_path, document_text, function() {
      console.log('wrote:', inflated_path);
    });
  });
}

if(typeof(exports) != 'undefined')
  exports.inflate_diagram = inflate_diagram

if(require.main === module) {
  inflate_diagram('data/test.drawio', 'data/test-inflated.txt');
}
