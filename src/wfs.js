const fetch = require('node-fetch');
const url = require('url');
const fs = require('fs');
const Jsonix = require('jsonix').Jsonix;

var XLink_1_0 = require('w3c-schemas').XLink_1_0;
var OWS_1_0_0 = require('ogc-schemas').OWS_1_0_0;
var Filter_1_1_0 = require('ogc-schemas').Filter_1_1_0;
var GML_3_1_1 = require('ogc-schemas').GML_3_1_1;
var SMIL_2_0 = require('ogc-schemas').SMIL_2_0;
var SMIL_2_0_Language = require('ogc-schemas').SMIL_2_0_Language;
var WFS_1_1_0 = require('ogc-schemas').WFS_1_1_0;

var mappings = [XLink_1_0, OWS_1_0_0, Filter_1_1_0, GML_3_1_1, SMIL_2_0, SMIL_2_0_Language, WFS_1_1_0];

const formatFeatureLayer = function(featureLayer) {
    return {
      layerName: featureLayer.name.prefix+':'+featureLayer.name.localPart,
      title: featureLayer.title,
      abstract: featureLayer._abstract,
      srs: featureLayer.defaultSRS,
      otherSRS: featureLayer.otherSRS,
      outputFormats: []
    };
}
const parseGetCapabilities = function(capabilitesXML) {
  return new Promise(function(resolve, reject) {
    var context =  new Jsonix.Context(mappings);
    var unmarshaller = context.createUnmarshaller();
    const result = unmarshaller.unmarshalString(capabilitesXML);
    var results = [];
    result.value.featureTypeList.featureType.forEach(function(featureLayer) {
      results.push(formatFeatureLayer(featureLayer));
    });
    resolve(results);
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
