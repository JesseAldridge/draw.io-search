const fs = require('fs');
const path = require('path');
const assert = require('assert');

const expand_home_dir = require('expand-home-dir');
const shell = require('shelljs');
const nuke_dir = require('rimraf');
const us = require("underscore.string");
const glob = require('glob');

const inflate_diagram = require('./inflate_diagram.js')

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
      base_path = us(base_path).strLeftBack(".").value() + '.json'
      let inflated_file_path = path.join(inflated_dir_path, base_path)
      inflate_diagram.inflate_diagram(orig_file_path, inflated_file_path);
    }
  });
}

main(expand_home_dir(process.argv[2]));
