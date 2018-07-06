const wfs = require('./src/wfs');

const url = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_planungsraum';


p = wfs.getInfo(url);

p.then(function(data) {
  console.log(data)
});
