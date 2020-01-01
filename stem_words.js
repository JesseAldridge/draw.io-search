// const stemmer = require('./PorterStemmer1980.js')
const natural = require('natural');

function tokenize_words(text) {
  const re = /([A-Za-z'&]+)/g
  let m = null;
  const tokens = []
  do {
    m = re.exec(text)
    if(m)
      tokens.push(m[0].toLowerCase())
  } while(m)
  return tokens
}

const stem_words = (function() {
  const word_to_stem = {}

  return function(text) {
    const tokens = tokenize_words(text)
    const stemmed_words = []
    for(let i = 0; i < tokens.length; i++) {
      if(!word_to_stem[tokens[i]]) {
        // word_to_stem[tokens[i]] = stemmer.stemmer(tokens[i])
        const stem = natural.LancasterStemmer.stem(tokens[i])
        word_to_stem[tokens[i]] = stem
      }
      stemmed_words.push(word_to_stem[tokens[i]])
    }

    return stemmed_words
  }
})()

exports.stem_words = stem_words

if(require.main === module) {
  console.log(stem_words('data-cats/data_cats.json'))
}
