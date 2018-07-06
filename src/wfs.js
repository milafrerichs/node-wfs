const fetch = require('node-fetch');
var parseString = require('xml2js').parseString;

const parseGetCapabilities = function(capabilitesXML) {
  return new Promise(function(resolve, reject) {
    parseString(capabilitesXML, function(err, result) {
      if(err) {
        reject(err);
      }
      const info = {
        layerName: '',
        title: '',
        abstract: ''
      };
      fl = result['wfs:WFS_Capabilities']['wfs:FeatureTypeList'][0]['wfs:FeatureType'];
      info.layerName = fl[0]['wfs:Name'][0]
      info.title = fl[0]['wfs:Title'][0]
      info['abstract'] = fl[0]['wfs:Abstract'][0]
      resolve(info)
    });
  });
}
/**
 * getInfo(WFSUrl)
 * return
 * {
 *  name: LayerName,
 *  geometry:,
 *  featurecount
 *  }
 */
const getInfo = function(url) {
  const wfsUrl = url+'?service=wfs&version=1.1.0&request=GetCapabilities';
  return fetch(wfsUrl)
    .then(function(text) {
      return text.text();
    })
    .then(function(data) {
      return parseGetCapabilities(data);
    })
}

module.exports = {
  getInfo: getInfo
}
