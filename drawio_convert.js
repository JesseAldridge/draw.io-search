const fs = require('fs');
const pako = require('pako');
const glob = require('glob');
const cheerio = require('cheerio');
const pd = require('pretty-data').pd;
const unescape = require('unescape');
const path = require('path');
const expand_home_dir = require('expand-home-dir');
const shell = require('shelljs');


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


function removeLinebreaks(data) {
  document.getElementById('textarea').value = data.replace(/(\r\n|\n|\r)/gm, '');
};

function xml_to_cheerio_elem(document_html) {
  const doc_elem = cheerio.load(document_html);
  doc_elem('diagram').each(function(index) {
    let diagram_elem = cheerio(this);
    let diagram_text = diagram_elem.text();
    diagram_text = Buffer.from(diagram_text, 'base64');
    diagram_text = pako.inflateRaw(diagram_text);
    diagram_text = bytesToString(diagram_text);
    diagram_text = decodeURIComponent(diagram_text);
    diagram_text = unescape(diagram_text);
    diagram_text = pd.xml(diagram_text);
    diagram_elem.html(diagram_text);
  });
  return doc_elem;
};


function main(root_path) {
  let inflated_dir_path = path.join(root_path, 'inflated');
  if(!fs.existsSync(inflated_dir_path))
    fs.mkdirSync(inflated_dir_path);

  const root_dir = '/Users/Jesse/Dropbox/diagrams/';
  glob(`${root_dir}/**/*.xml`, function (er, paths) {
    for(let i = 0; i < paths.length; i++) {
      const curr_path = paths[i];
      let base_path = curr_path.split(root_dir)[1];
      let new_path = path.join(root_dir, 'inflated', base_path)
      inflate_file(paths[i], path.join(root_dir, 'inflated', base_path));
    }
  });
}

function inflate_file(orig_path, inflated_path) {
  shell.mkdir('-p', path.dirname(inflated_path));

  fs.readFile(orig_path, 'utf8', function(err, text) {
    let new_doc = xml_to_cheerio_elem(text);
    let html_string = new_doc.html();

    let initial_str = '<html><head></head><body>';
    let trailing_str = '</body></html>';

    let transformed_str = html_string.substr(
      initial_str.length,
      html_string.length - initial_str.length - trailing_str.length
    );

    // console.log('transformed_str:', transformed_str);
    console.log('writing to:', inflated_path);
    fs.writeFile(inflated_path, transformed_str, function() {});
  });
}

main(expand_home_dir('~/Dropbox/diagrams/'));
