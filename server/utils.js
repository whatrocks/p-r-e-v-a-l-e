// Decompresses ArcGIS compressed geometry format. Taken from: https://github.com/Esri/terraformer-arcgis-parser/issues/10

module.exports = function _fromCompressedGeometry( /*String*/ str, /*SpatialReference*/ sr) {
  var xDiffPrev = 0,
    yDiffPrev = 0,
    points = [],
    x, y,
    strings,
    coefficient;

  // Split the string into an array on the + and - characters
  strings = str.match(/((\+|\-)[^\+\-]+)/g);

  // The first value is the coefficient in base 32
  coefficient = parseInt(strings[0], 32);

  for (var j = 1; j < strings.length; j += 2) {
    // j is the offset for the x value
    // Convert the value from base 32 and add the previous x value
    x = (parseInt(strings[j], 32) + xDiffPrev);
    xDiffPrev = x;

    // j+1 is the offset for the y value
    // Convert the value from base 32 and add the previous y value
    y = (parseInt(strings[j + 1], 32) + yDiffPrev);
    yDiffPrev = y;

    points.push([x / coefficient, y / coefficient]);
  }

  return points;
};
