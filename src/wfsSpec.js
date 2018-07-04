const wfs = require('./wfs');

describe("wfs", function() {
  describe("listLayers", function() {
    it('returns a list of layers for a given URL', function() {
      const url = 'http://list.url'
      expect(wfs.listLayers(url).length).toBe(1);
    });
  });
});
