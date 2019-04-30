'use strict';

const completions = require('./completions.json');

module.exports = {
  selector: '.string.quoted, .source.pug .constant.language.js, .source.css, .source.css.scss, .source.css.less',

  getSuggestions (request) {
    const { prefix, bufferPosition, editor, scopeDescriptor } = request;

    if (prefix.length === 0) {
      return [];
    }

    const { scopes } = scopeDescriptor;
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);

    if (!line.match(/class|className/i) && !scopes.includes('source.pug')) {
      return [];
    }

    let suggestions = [];

    for (const [text, rightLabel] of completions) {
      if (!prefix || text.startsWith(prefix)) {
        const completion = {
          replacementPrefix: prefix,
          rightLabel: rightLabel,
          text: text,
          type: 'tailwind'
        };

        if (rightLabel.indexOf('color') >= 0) {
          const result = rightLabel.match(/#[0-9a-f]{3,6}/i);
          const color = result ? result[0] : 'transparent';

          completion.leftLabelHTML = `<div style="background-color: ${color}" class="tailwind__color-preview"></div>`;
        }

        suggestions.push(completion);
      }
    }

    return suggestions;
  }
};
