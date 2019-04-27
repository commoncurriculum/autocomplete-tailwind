'use babel';

const { CompositeDisposable, File } = require('atom');
const completions = require('./completions.json');

class CompletionProvider {
  constructor () {
    this.subscriptions = new CompositeDisposable();
    this.selector = '.string.quoted, .source.pug .constant.language.js';
    this.pkg = new File(atom.project.resolvePath('./package.json'));
    this.shouldAutocomplete = false;

    if (this.pkg.existsSync()) {
      this.isTailwindInstalled();

      this.subscriptions.add(this.pkg.onDidChange(() => {
        this.isTailwindInstalled();
      }));

      this.subscriptions.add(this.pkg.onDidDelete(() => {
        this.shouldAutocomplete = false;
      }));
    } else {
      this.subscriptions.add(atom.project.onDidChangeFiles(events => {
        for (const event of events) {
          if (
            (event.action === 'renamed' || event.action === 'created') &&
            event.path === this.pkg.path
          ) {
            this.isTailwindInstalled();
          }
        }
      }))
    }
  }

  deactivate () {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }

    this.subscriptions = null;
  }

  async isTailwindInstalled () {
    try {
      const pkg = await this.pkg.read();

      const { dependencies, devDependencies } = JSON.parse(pkg);

      const packages = Object.assign(dependencies, devDependencies);

      this.shouldAutocomplete = packages.hasOwnProperty('tailwindcss');
    } catch (error) {
      // Ignore JSON parse errors.
    }
  }

  getSuggestions (request) {
    console.log(this.shouldAutocomplete);

    if (!this.shouldAutocomplete) {
      return [];
    }

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

export default CompletionProvider;
