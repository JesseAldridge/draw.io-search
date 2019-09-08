#!/usr/local/bin/node
const fs = require('fs');

const glob = require('glob');
const expand_home_dir = require('expand-home-dir');

const inflated_dir_path = expand_home_dir('~/inflated_diagrams/');
const inflated_paths = glob.sync(inflated_dir_path + '**/*.txt');

const query_terms = process.argv.slice(2);
for(let i = 0; i < query_terms.length; i++)
  query_terms[i] = query_terms[i].toLowerCase();

// Search content
const matches = [];
const term_to_document_frequency = {};
inflated_paths.forEach(function(path) {
  const content = fs.readFileSync(path, 'utf8').toLowerCase();

  const term_to_score = {};
  let sum_term_score = 0;
  query_terms.forEach(function(term) {

    let path_score = 0;
    const relavent_part_of_path = path.split(inflated_dir_path)[1];
    if(relavent_part_of_path.toLowerCase().indexOf(term) != -1)
      path_score = 1;

    const term_frequency = content.split(term).length - 1;
    if(term_frequency > 0) {
      if(!term_to_document_frequency[term])
        term_to_document_frequency[term] = 0;
      term_to_document_frequency[term] += 1;
    }

    const term_score = term_frequency + path_score * 10;
    term_to_score[term] = term_score;
    sum_term_score += term_score;
  });

  if(sum_term_score > 0) {
    let new_path = path.replace(/\.txt$/, '.drawio');
    new_path = new_path.replace(/\/inflated_diagrams\//, '/Dropbox/diagrams/');
    matches.push({
      path: new_path,
      term_to_score: term_to_score,
    });
  }
});

function score(match) {
  let document_score = 0;
  for(let term in match.term_to_score)
    document_score += match.term_to_score[term] / (term_to_document_frequency[term] || 1);
  return document_score;
}

matches.sort(function(a,b) {
  return score(a) - score(b)
});

matches.forEach(function(match) {
  console.log('match:', match.path, score(match).toFixed(2));
});
