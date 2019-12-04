const fs = require('fs');
const path = require('path');

const stem_words = require('./stem_words.js');

function search_diagram(inflated_dir_path, path_, query_terms, term_to_document_frequency) {
  // diagram refers to a tab within a .drawio file
  const diagrams_json = fs.readFileSync(path_, 'utf8');
  let name_to_diagram = null
  try {
    name_to_diagram = JSON.parse(diagrams_json)
  }
  catch(e) {
    console.log('failed to parse json:', diagrams_json)
    return
  }

  // e.g. data-chop/data_chop.json
  const relavent_part_of_path = inflated_dir_path ? path_.split(inflated_dir_path)[1] : path_;
  const path_split = relavent_part_of_path.split('/')

  const path_tokens = []
  for(let i = 0; i < path_split.length; i++)
    stem_words.stem_words(path_split[i]).forEach(function(token) {
      path_tokens.push(token)
    })

  let sum_term_score = 0;
  const term_to_tab_to_matching_cells = {};
  const term_to_score = {};
  query_terms.forEach(function(query_term) {
    let path_score = 0 // is the term in the path of the .drawio file
    path_tokens.forEach(function(path_token) {
      if(path_token == query_term)
        path_score += 1
    })

    let term_frequency = 0 // the number of times the term occurs in the .drawio file
    const tab_to_matching_cells = {}

    const tab_names = Object.keys(name_to_diagram)
    tab_names.forEach(function(tab_name) {
      tab = name_to_diagram[tab_name]
      tab.cells.forEach(function(cell) {
        // tokens are stemmed during inflation
        const cell_tokens = cell.text.split()
        let cell_match_count = 0
        cell_tokens.forEach(function(cell_token) {
          if(cell_token == query_term)
            cell_match_count += 1
        })
        term_frequency += cell_match_count
        if(cell_match_count > 0) {
          if(!tab_to_matching_cells[tab_name])
            tab_to_matching_cells[tab_name] = []
          tab_to_matching_cells[tab_name].push(cell.text.substr(0, 80))
        }
      })
    })

    if(term_frequency > 0) {
      if(!term_to_document_frequency[query_term])
        term_to_document_frequency[query_term] = 0;
      term_to_document_frequency[query_term] += 1;
      term_to_tab_to_matching_cells[query_term] = tab_to_matching_cells
    }

    const term_score = term_frequency + path_score * 80;
    term_to_score[query_term] = term_score;
    sum_term_score += term_score;
  });

  if(sum_term_score > 0) {
    let new_path = path_.replace(/\.json$/, '.drawio');
    new_path = new_path.replace(/\/inflated_diagrams\//, '/Dropbox/diagrams/');
    return {
      path: new_path,
      term_to_score: term_to_score,
      term_to_tab_to_matching_cells: term_to_tab_to_matching_cells,
    };
  }

  return null
}

exports.search_diagram = search_diagram

if(require.main === module) {
  const match = search_diagram(null, 'data/test-inflated.json', ['per', 'bar'], {})
  console.log(JSON.stringify(match, null, 2))
}
