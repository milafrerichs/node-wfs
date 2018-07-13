const nock = require('nock')
const fs = require('fs');

const wfs = require('./wfs');

let getCapabitlitesXML = require('./../fixtures/getCapabilities');
let getFeature = require('./../fixtures/getFeature');

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
  describe("getFeature", function() {
    describe('json format', function() {
      it('returns layer in that format', function(done) {
        const url = 'http://wfs.url';
        const typeName = 'fis:layerName';
        nock('http://wfs.url')
        .get(`/layerName?service=wfs&version=1.1.0&request=GetFeature&TYPENAME=fis%3AlayerName&outputFormat=application%2Fjson`)
        .reply(200, getFeature.json);
        wfs.getFeature(url+'/layerName', typeName, 'application/json').then(function(result) {
          expect(result).toEqual(getFeature.json)
          done();
        });
      });
    });
    describe('xml format', function() {
      it('returns layer in that format', function(done) {
        const url = 'http://wfs.url';
        const typeName = 'fis:layerName';
        nock('http://wfs.url')
        .get(`/layerName?service=wfs&version=1.1.0&request=GetFeature&TYPENAME=fis%3AlayerName`)
        .reply(200, getFeature.xml);
        wfs.getFeature(url+'/layerName', typeName).then(function(result) {
          expect(result).toEqual(getFeature.xml)
          done();
        });
      });
    });
  });
});
