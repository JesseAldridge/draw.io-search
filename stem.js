const stemmer = require('./PorterStemmer1980.js')

function stem(text) {
  NON_WORD_REGEX = /[0-9\W_]+/g

  const words = text.split(/ +/)
  const stemmed_words = []
  for(let i = 0; i < words.length; i++) {
    const clean_word = words[i].replace(NON_WORD_REGEX, '')
    const stem = stemmer.stemmer(clean_word)
    stemmed_words.push(stem)
  }

  return stemmed_words
}

exports.stem = stem
