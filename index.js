'use strict';

var upTo = function(n) {
  var a = [];
  for (var i = 0; i < n; i += 1) {
    a.push(i);
  }
  return a;
};

var parseMcmeta = function(image, data) {
  var json = JSON.parse(data);

  console.log(json);

  if (!json.animation) return;

  // number of frames horizontal and vertical
  var animationWidth = json.animation.width || 1;
  var animationHeight = json.animation.height || (image.height / image.width); // vertical strip of frames

  var defaultFrametime = json.animation.frametime || 1;

  var tileWidth = image.width / animationWidth;
  var tileHeight = image.height / animationHeight;

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

  console.log(frames);
};

var image = {width:16, height:16*7}; // TODO: real image
parseMcmeta(image, JSON.stringify(
// http://minecraft.gamepedia.com/Resource_pack#Animation_Properties
{ 
   "animation":{
      "width":1,
      "height":7,
      "frametime":1,
      /*"frames":[{
         "index":0,
         "time": 0
         },
         1,2,3,4,5,6,4,2]
         */
   }
}));

