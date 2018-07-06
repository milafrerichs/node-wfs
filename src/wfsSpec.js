const nock = require('nock')
const fs = require('fs');

const wfs = require('./wfs');

let getCapabitlitesXML = require('./../fixtures/getCapabilities');

describe("wfs", function() {
  describe("getInfo", function() {
    it('returns info for that layer', function(done) {
      const url = 'http://wfs.url'
      nock('http://wfs.url')
      .get('/layerName?service=wfs&version=1.1.0&request=GetCapabilities')
      .reply(200, getCapabitlitesXML);
      wfs.getInfo(url+'/layerName').then(function(result) {
        expect(result).toEqual({
          layerName: 'fis:re_planungsraum',
          title: 'LOR',
          abstract: 'LOR Abstract'
        });
        done();
      })
    });
  });
});
