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

var parseFrameOffsets = function(imageWidth, imageHeight, json) {
  console.log(json);

  // number of frames horizontal and vertical
  var animationWidth = (json.animation && json.animation.width) || 1;
  var animationHeight = (json.animation && json.animation.height) || (imageHeight / imageWidth); // vertical strip of frames

  var defaultFrametime = (json.animation && json.animation.frametime) || 1;

  var tileWidth = imageWidth / animationWidth;
  var tileHeight = imageHeight / animationHeight;

  var frameCoords = [];

  for (var j = 0; j < animationWidth; j += 1) {
    for (var i = 0; i < animationHeight; i += 1) { // assuming counted vertical then horizontal (not verified)
      var sx = j * tileWidth;
      var sy = i * tileHeight;
      var ex = (j + 1) * tileWidth;
      var ey = (i + 1) * tileHeight;

      frameCoords.push([sx, sy, ex, ey]);
    }
  }

  var frames = [];
  if (json.animation) {
    var frameInfos = json.animation.frames || upTo(animationWidth * animationHeight);

    for (i = 0; i < frameInfos.length; i += 1) {
      var frameInfo = frameInfos[i];

      var index = (typeof frameInfo === 'number') ? frameInfo : frameInfo.index;
      var time = (typeof frameInfo === 'object' && 'time' in frameInfo) ? frameInfo.time : 1;

      if (typeof frameInfo === 'number') {
        index = frameInfo;
      } else {
        index = frameInfo.index;
      }

      var coords = frameCoords[index];

      frames.push({index:index, time:time, coords:coords}); // TODO: crop image
    }
  } else {
    frames.push({coords:[0, 0, tileWidth, tileHeight]}); // TODO: or full texture?
  }

  if (json.texture) {
    if (json.texture.blur) {
      // TODO: blur when close up
    }

    if (json.texture.clamp) {
      // TODO: don't appear when otherwise might(?)
    }
  }

  return frames;
};

var splitFrames = function(pixels, countTilesX, countTilesY) {
  var totalHeight = pixels.shape[0];
  var totalWidth = pixels.shape[1];
  countTilesX = countTilesX || 1; // assume vertical strip (1xN)
  countTilesY = countTilesY || totalHeight / (totalWidth / countTilesX); // e.g., 2 for 16x32 (16x(16*2))
  var tileWidth = totalWidth / countTilesX;
  var tileHeight = totalHeight / countTilesY;

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
      document.body.appendChild(document.createTextNode([sx,sy,ex,ey].join(',')));
      document.body.appendChild(document.createElement('br'));
      document.body.appendChild(canvas);
      document.body.appendChild(document.createElement('br'));
      console.log(canvas.width,canvas.height);
    }
  }
};

var parse = function(pixels, mcmetaString) {
  //TODO var 
};

// TODO
module.exports = {
  parseFrameOffsets: parseFrameOffsets,
  splitFrames: splitFrames
};
