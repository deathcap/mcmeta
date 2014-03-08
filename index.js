'use strict';

var getPixels = require('get-pixels');
var savePixels = require('save-pixels');

var upTo = function(n) {
  var a = [];
  for (var i = 0; i < n; i += 1) {
    a.push(i);
  }
  return a;
};

// number of frames horizontal and vertical
var getTileCountX = function(imageWidth, imageHeight, json) {
  return (json.animation && json.animation.width) || 1;
};

var getTileCountY = function(imageWidth, imageHeight, json) {
  return (json.animation && json.animation.height) || (imageHeight / imageWidth); // vertical strip of frames
};

var parseFramesInfo = function(imageWidth, imageHeight, json) {
  console.log(json);

  var countTilesX = getTileCountX(imageWidth, imageHeight, json);
  var countTilesY = getTileCountY(imageWidth, imageHeight, json);

  var defaultFrametime = (json.animation && json.animation.frametime) || 1;

  var tileWidth = imageWidth / countTilesX;
  var tileHeight = imageHeight / countTilesY;

  var frames = [];
  if (json.animation) {
    var frameInfos = json.animation.frames || upTo(countTilesX * countTilesY);

    for (var i = 0; i < frameInfos.length; i += 1) {
      var frameInfo = frameInfos[i];

      var index = (typeof frameInfo === 'number') ? frameInfo : frameInfo.index;
      var time = (typeof frameInfo === 'object' && 'time' in frameInfo) ? frameInfo.time : defaultFrametime;

      if (typeof frameInfo === 'number') {
        index = frameInfo;
      } else {
        index = frameInfo.index;
      }

      frames.push({index:index, time:time});
    }
  } else {
    frames.push({index:0, time:0});
  }

  return frames;
};

var splitTiles = function(pixels, countTilesX, countTilesY) {
  var totalHeight = pixels.shape[0];
  var totalWidth = pixels.shape[1];
  countTilesX = countTilesX || 1; // assume vertical strip (1xN)
  countTilesY = countTilesY || totalHeight / (totalWidth / countTilesX); // e.g., 2 for 16x32 (16x(16*2))
  var tileWidth = totalWidth / countTilesX;
  var tileHeight = totalHeight / countTilesY;
  var tiles = [];

  console.log(countTilesY,tileWidth,tileHeight);
  for (var j = 0; j < countTilesX; j += 1) {
    for (var i = 0; i < countTilesY; i += 1) {
      var sx = j * tileWidth;
      var sy = i * tileHeight;
      var ex = (j + 1) * tileWidth;
      var ey = (i + 1) * tileHeight;

      console.log(sx,sy,ex,sy);
      var tilePixels = pixels.lo(sy, sx).hi(ey - sy, ex - sx);
      console.log(tilePixels);

      var canvas = savePixels(tilePixels, 'canvas');
      /* debug
      document.body.appendChild(document.createTextNode([sx,sy,ex,ey].join(',')));
      document.body.appendChild(document.createElement('br'));
      document.body.appendChild(canvas);
      document.body.appendChild(document.createElement('br'));
      console.log(canvas.width,canvas.height);
      */

      tiles.push(canvas.toDataURL());
    }
  }

  return tiles;
};

var getFrames = function(pixels, mcmetaString) {
  var json = (typeof mcmetaString === 'string' ? JSON.parse(mcmetaString) : mcmetaString) || {};

  if (json.texture) {
    if (json.texture.blur) {
      // TODO: blur when close up
    }

    if (json.texture.clamp) {
      // TODO: don't appear when otherwise might(?)
    }
  }

  var imageHeight = pixels.shape[0];
  var imageWidth = pixels.shape[1];

  console.log('wh',imageWidth,imageHeight);

  var framesInfo = parseFramesInfo(imageWidth, imageHeight, json);
  console.log('framesInfo',framesInfo);

  var countTilesX = getTileCountX(imageWidth, imageHeight, json);
  var countTilesY = getTileCountY(imageWidth, imageHeight, json);

  var tiles = splitTiles(pixels, countTilesX, countTilesY);

  var flipbook = [];

  for (var i = 0; i < framesInfo.length; i += 1) {
    var frameInfo = framesInfo[i];

    var image = tiles[frameInfo.index];
    var page = {index:frameInfo.index, image:image, time:frameInfo.time};

    flipbook.push(page);
    console.log(i, page.index, page.image, page.time);
  }

  return flipbook;
};

module.exports = getFrames;
module.exports.getFrames = getFrames;
module.exports.parseFramesInfo = parseFramesInfo;
module.exports.splitTiles = splitTiles;
