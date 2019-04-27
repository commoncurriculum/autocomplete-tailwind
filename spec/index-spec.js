'use babel';

describe('autocomplete-tailwind', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('autocomplete-tailwind');
  });

  describe('describe testing', () => {
    it('has one valid test', () => {
      expect(1).toBe(1);
    });
  });
});
