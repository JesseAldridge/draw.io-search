const fs = require('fs');
const path = require('path');
const assert = require('assert');

const pako = require('pako');
const glob = require('glob');
const cheerio = require('cheerio');
const pd = require('pretty-data').pd;
const unescape_ = require('unescape');
const expand_home_dir = require('expand-home-dir');
const shell = require('shelljs');
const nuke_dir = require('rimraf');

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
  doc_elem('diagram').each(function(index) {
    let diagram_elem = cheerio(this);
    let diagram_text = diagram_elem.text();
    diagram_text = Buffer.from(diagram_text, 'base64');
    diagram_text = pako.inflateRaw(diagram_text);
    diagram_text = bytesToString(diagram_text);
    diagram_text = decodeURIComponent(diagram_text);
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


function main(original_dir_path) {
  console.log(`${new Date()} inflating all diagrams...`)

  const inflated_dir_path = expand_home_dir('~/inflated_diagrams');
  if (fs.existsSync(inflated_dir_path)) {
    assert(inflated_dir_path.length > 10, 'inflated_dir_path too short, not wiping');
    console.log('wiping:', inflated_dir_path);
    nuke_dir.sync(inflated_dir_path);
  }
  shell.mkdir('-p', inflated_dir_path);

  console.log(`converting all xml files at: ${original_dir_path}`)

  inflate_all(original_dir_path, inflated_dir_path, 'xml')
  inflate_all(original_dir_path, inflated_dir_path, 'drawio')

  console.log(`${new Date()} done`)
}

function inflate_all(original_dir_path, inflated_dir_path, extension) {
  glob(path.join(original_dir_path, '**/*.' + extension), function (er, paths) {
    for(let i = 0; i < paths.length; i++) {
      const orig_file_path = paths[i];
      console.log('orig_file_path:', orig_file_path);
      let base_path = orig_file_path.split(original_dir_path)[1];
      let inflated_file_path = path.join(inflated_dir_path, base_path)
      inflate_file(orig_file_path, inflated_file_path);
    }
  });
}

function inflate_file(orig_path, inflated_path) {
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

main(expand_home_dir(process.argv[2]));
