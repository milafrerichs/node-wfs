# WFS Tool

A little helper tool to get Infos and download Layers from a WFS Service.

## Installation

This is a node tool base don node > 8.11.  
Install via `yarn install` or `npm install`

## Usage

Since it is a node based tool you need to import the wfs tool and then can use the methods.  

### GetInfo

```
const wfs = require('./wfs');

wfs.getInfo(url).then(function(result) {
});
```

### GetFeature

```
const wfs = require('./wfs');

wfs.getFeature(url, typeName, format).then(function(result) {
});
```
