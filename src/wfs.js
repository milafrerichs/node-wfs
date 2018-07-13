const fetch = require('node-fetch');
const url = require('url');
const fs = require('fs');
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
};

const saveFeature = function(urlString, typeName, format, outputfile) {
  const feature = getFeature(urlString, typeName, format);
  feature.then(function(result) {
    if (format === 'application/json') {
      result = JSON.stringify(result);
    }
    fs.writeFile(outputfile, result, function(err) {
      if(err) {
        console.log('err', err);
      }
      console.log('success');
    });
  })
}
const getFeature = function(urlString, typeName, format) {
  const paramsString = `service=wfs&version=1.1.0&request=GetFeature&TYPENAME=${typeName}`;
  const wfsUrlParams = new url.URLSearchParams(paramsString);
  if (format) {
    wfsUrlParams.append('outputFormat', format);
  }
  const wfsUrl = `${urlString}?${wfsUrlParams.toString()}`;
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
  saveFeature: saveFeature
}
