const { GeoIndex } = require('./lookup');

async function caPropertyLookup(req, res) {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const zoom = parseInt(req.query.zoom, 10);
  const minX = parseFloat(req.query.minX);
  const minY = parseFloat(req.query.minY);
  const maxX = parseFloat(req.query.maxX);
  const maxY = parseFloat(req.query.maxY);
  const filter = req.query.filter;

  if (isNaN(lat) || isNaN(lng) || isNaN(zoom) || isNaN(minX) || isNaN(minY) || isNaN(maxX) || isNaN(maxY)) {
    res.status(500).json({
      error: 'Invalid latlng',
      results: [],
    });
    return;
  }

  const commercialOnly = filter === 'commercial';
  let ret;
  if (zoom >= 18) {
    ret = await GeoIndex.getNearby(lat, lng, minX, minY, maxX, maxY, commercialOnly);
  } else {
    ret = await GeoIndex.getWithinBounds(minX, minY, maxX, maxY, zoom, commercialOnly);
  }
  if (ret === null) {
    res.json({
      errorCode: 'DATA_LOADING',
      results: [],
    });
    return;
  }
  res.json({
    results: ret.map(loc => {
      return [loc.address, loc.apn, loc.tax, loc.county, loc.lat, loc.lng];
    }),
  });
}

module.exports = {
  caPropertyLookup,
};
