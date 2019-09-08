#!/usr/local/bin/node
const fs = require('fs');

const glob = require('glob');
const expand_home_dir = require('expand-home-dir');

const inflated_dir_path = expand_home_dir('~/inflated_diagrams/');
const inflated_paths = glob.sync(inflated_dir_path + '**/*.txt');

const query_terms = process.argv.slice(2);
console.log('query_terms:', query_terms);

// Search content
const content_matches = [];
inflated_paths.forEach(function(path) {
  const content = fs.readFileSync(path, 'utf8');
  const term_to_match_count = {};
  let total_match_count = 0;
  query_terms.forEach(function(term) {
    term_to_match_count[term] = content.split(term).length - 1;
    total_match_count += term_to_match_count[term];
  });

  if(total_match_count > 0) {
    let new_path = path.replace(/\.txt$/, '.drawio');
    new_path = new_path.replace(/\/inflated_diagrams\//, '/Dropbox/diagrams/');
    content_matches.push({
      path: new_path,
      count: total_match_count,
    });
  }
});

content_matches.sort(function(a,b) {
  return a.count - b.count
});

content_matches.forEach(function(match) {
  console.log('match:', match.path, match.count);
})

// Search paths
inflated_paths.forEach(function(path) {
  path = path.split(inflated_dir_path)[1];
  for(let i = 0; i < query_terms.length; i++) {
    const term = query_terms[i];

    if(path.match(term)) {
      let new_path = path.replace(/\.txt$/, '.drawio');
      new_path = [inflated_dir_path, new_path].join('/');
      new_path = new_path.replace(/\/inflated_diagrams\//, '/Dropbox/diagrams/');
      console.log(new_path);
      break;
    }
  }
});
