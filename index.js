const wfs = require('./src/wfs');

const url = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_planungsraum?service=wfs&version=1.1.0&request=GetCapabilities&outputFormat=application/json';

p = wfs.getInfo(url);

p.then(function(data) {
  sp = data['wfs:WFS_Capabilities']['ows:ServiceProvider'];
  fl = data['wfs:WFS_Capabilities']['wfs:FeatureTypeList'][0]['wfs:FeatureType'];
  console.log(fl)
});
