'use babel';

const CompletionProvider = require('./completion-provider');

class AutocompleteTailwind {
  constructor () {
    this.completionProvider = null;
  }

  activate () {
    this.completionProvider = new CompletionProvider();
  }

  deactivate() {
    this.completionProvider.deactivate();
    this.completionProvider = null;
  }

  getCompletionProvider () {
    return this.completionProvider;
  }
};

module.exports = new AutocompleteTailwind();
