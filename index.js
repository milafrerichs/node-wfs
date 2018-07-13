var fetch = require('node-fetch');
var url = require('url');
var parseString = require('xml2js').parseString;

var parseGetCapabilities = function(capabilitesXML) {
  return new Promise(function(resolve, reject) {
    parseString(capabilitesXML, function(err, result) {
      if(err) {
        reject(err);
      }
      var info = {
        layerName: '',
        title: '',
        abstract: ''
      };
      fl = result['wfs:WFS_Capabilities']['wfs:FeatureTypeList'][0]['wfs:FeatureType'];
      info.layerName = fl[0]['wfs:Name'][0];
      info.title = fl[0]['wfs:Title'][0];
      info.abstract = fl[0]['wfs:Abstract'][0];
      resolve(info);
    });
  });
};
/**
 * getInfo(WFSUrl)
 * return
 * {
 *  name: LayerName,
 *  geometry:,
 *  featurecount
 *  }
 */
var getInfo = function(url) {
  var wfsUrl = url+'?service=wfs&version=1.1.0&request=GetCapabilities';
  return fetch(wfsUrl)
    .then(function(text) {
      return text.text();
    })
    .then(function(data) {
      return parseGetCapabilities(data);
    });
};

var getFeature = function(urlString, typeName, format) {
  var paramsString = 'service=wfs&version=1.1.0&request=GetFeature&TYPENAME='+typeName;
  var wfsUrlParams = new url.URLSearchParams(paramsString);
  if (format) {
    wfsUrlParams.append('outputFormat', format);
  }
  var wfsUrl = urlString+'?'+wfsUrlParams.toString();
  return fetch(wfsUrl)
    .then(function(text) {
      if (format == 'application/json') {
        return text.json();
      } else {
        return text.text();
      }
    });
};

module.exports = {
  getInfo: getInfo,
  getFeature: getFeature,
};
