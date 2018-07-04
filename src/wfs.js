const fetch = require('node-fetch');
var parseString = require('xml2js').parseString;

const getInfo = function(url) {
  //const wfs_format = new WFS.default();
  return fetch(url)
    .then(function(text) {
      return text.text();
    })
    .then(function(data) {
      return new Promise(function(resolve, reject) {
        parseString(data, function(err, result) {
          if(err) {
            reject(err);
          }
          resolve(result)
        });
      })
    })
}

module.exports = {
  getInfo: getInfo
}
