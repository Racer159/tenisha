const natural = require('natural');

var wordtokenizer = new natural.WordTokenizer();

module.exports = {
  check: function ( triggerPhrase, tokens ) {
    var newTokens = wordtokenizer.tokenize( triggerPhrase );
    var numTokens = newTokens.length;

    for (i = 0; i < numTokens; i++) {
        if (newTokens[i] != tokens[i]) {
            return false;
        }
    }

    return true;
  }
};

// private functions