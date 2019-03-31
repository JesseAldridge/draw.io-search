const fs = require('fs');
const path = require('path');
const assert = require("assert")

const pako = require('pako');
const glob = require('glob');
const cheerio = require('cheerio');
const pd = require('pretty-data').pd;
const unescape = require('unescape');
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
    diagram_text = unescape(diagram_text);
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


function main(root_dir_path) {
  const inflated_path = path.join(root_dir_path, 'inflated');
  if (fs.existsSync(inflated_path)) {
    assert(inflated_path.length > 10, 'inflated_path too short, not wiping');
    console.log('wiping:', inflated_path);
    nuke_dir.sync(inflated_path);
  }
  shell.mkdir('-p', inflated_path);

  console.log(`converting all xml files at: ${root_dir_path}`)

  inflate_all(root_dir_path, 'xml')
  inflate_all(root_dir_path, 'drawio')
}

function inflate_all(root_dir_path, extension) {
  glob(path.join(root_dir_path, '**/*.' + extension), function (er, paths) {
    for(let i = 0; i < paths.length; i++) {
      const curr_path = paths[i];
      console.log('curr_path:', curr_path);
      let base_path = curr_path.split(root_dir_path)[1];
      let new_path = path.join(root_dir_path, 'inflated', base_path)
      inflate_file(curr_path, path.join(root_dir_path, 'inflated', base_path));
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
