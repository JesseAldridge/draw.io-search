#!/usr/local/bin/node
const fs = require('fs');

const glob = require('glob');
const expand_home_dir = require('expand-home-dir');

const inflated_dir_path = expand_home_dir('~/inflated_diagrams/');
const inflated_paths = glob.sync(inflated_dir_path + '**/*.txt');
const query_regex = new RegExp(process.argv[2], 'gi');

// Search content
inflated_paths.forEach(function(path) {
  const content = fs.readFileSync(path, 'utf8');
  const matches = content.match(query_regex);
  if(matches) {
    let new_path = path.replace(/\.txt$/, '.drawio');
    new_path = new_path.replace(/\/inflated_diagrams\//, '/Dropbox/diagrams/');

    console.log(new_path, matches.length);
  }
});

// Search paths
inflated_paths.forEach(function(path) {
  // console.log('comparing against path:', path);
  if(path.match(query_regex)) {
    let new_path = path.replace(/\.txt$/, '.drawio');
    new_path = new_path.replace(/\/inflated_diagrams\//, '/Dropbox/diagrams/');
    console.log(new_path);
  }
});
