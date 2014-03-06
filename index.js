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

var parseMcmeta = function(image, data) {
  var json = JSON.parse(data);

  console.log(json);

  // number of frames horizontal and vertical
  var animationWidth = (json.animation && json.animation.width) || 1;
  var animationHeight = (json.animation && json.animation.height) || (image.height / image.width); // vertical strip of frames

  var defaultFrametime = (json.animation && json.animation.frametime) || 1;

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

  console.log(frames);
};

parseMcmeta({width:16, height:16*7}, JSON.stringify(
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

parseMcmeta({width:16, height:16*7}, JSON.stringify(
{
  "animation":{}
}));

parseMcmeta({width:16, height:16*7}, JSON.stringify(
{
}));

// 16x32 test from https://github.com/deathcap/ProgrammerArt/commit/eeed8860d062c894b08381b7951a13eef6fe5ccd
var waterFlow2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAOBGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4bBsrEwAAAL5JREFUSA29k1EOwjAMQwHteJyAa8L9NrlSUFZiO1KBfGztUr84a3t97PvzshC3Be2QbgZwT/lXGr+HDpBFgOX5gCy30AWU1WGhCxh2q0cHQKv/xYGs/nMHtrpy0BIrAHKA2GDbGEfWQtRdmCExP7lSgFhYCiPJWoi8fSsHuX/qggG+so3WPhawfwDLuQUKYwAqmBMK0HKhAHOxcu4A1oUDlFXzxw5AuugAUJBCugB6JjqAEMPFR7C7gIVSGKQD/SYYDUgAKtAAAAAASUVORK5CYII=';
if (!process.browser) throw new Error('requires browserify environment'); // because data URLs only supported with get-pixels on browser for now, not nodejs

getPixels(waterFlow2, function(err, pixels) {
  console.log(err, pixels)
  window.pixels = pixels;

  var totalHeight = pixels.shape[0];
  var totalWidth = pixels.shape[1];
  var countTilesX = 1; // assume vertical strip (1xN)
  var countTilesY = totalHeight / (totalWidth / countTilesX); // e.g., 2 for 16x32 (16x(16*2))
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
});
