'use strict';

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

  for (var j = 0; j < animationWidth; j += 1) {
    for (var i = 0; i < animationHeight; i += 1) {
      var sx = j * tileWidth;
      var sy = i * tileHeight;
      var ex = (j + 1) * tileWidth;
      var ey = (i + 1) * tileHeight;

      console.log('frame (',sx,sy,') - (',ex,ey,')');
    }
  }
};

var image = {width:16, height:16*7}; // TODO: real image
parseMcmeta(image, JSON.stringify(
// http://minecraft.gamepedia.com/Resource_pack#Animation_Properties
{ 
   "animation":{
      "width":1,
      "height":7,
      "frametime":1,
      "frames":[{
         "index":0,
         "time": 0
         },
         1,2,3,4,5,6,4,2]
   }
}));

