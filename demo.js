'use strict';

var mcmeta = require('./');
var getPixels = require('get-pixels');
var splitTiles = mcmeta.splitTiles;
var getFrames = mcmeta.getFrames;

// 16x32 test from https://github.com/deathcap/ProgrammerArt/commit/eeed8860d062c894b08381b7951a13eef6fe5ccd
var waterFlow2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAOBGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4bBsrEwAAAL5JREFUSA29k1EOwjAMQwHteJyAa8L9NrlSUFZiO1KBfGztUr84a3t97PvzshC3Be2QbgZwT/lXGr+HDpBFgOX5gCy30AWU1WGhCxh2q0cHQKv/xYGs/nMHtrpy0BIrAHKA2GDbGEfWQtRdmCExP7lSgFhYCiPJWoi8fSsHuX/qggG+so3WPhawfwDLuQUKYwAqmBMK0HKhAHOxcu4A1oUDlFXzxw5AuugAUJBCugB6JjqAEMPFR7C7gIVSGKQD/SYYDUgAKtAAAAAASUVORK5CYII=';
if (!process.browser) throw new Error('requires browserify environment'); // because data URLs only supported with get-pixels on browser for now, not nodejs

getPixels(waterFlow2, function(err, pixels) {
  console.log(err, pixels)
  window.pixels = pixels;

  //splitTiles(pixels);
  var frames = getFrames(pixels, {animation:{frametime:10}});
  frames.forEach(function(frame) {
    var img = new Image();
    img.width = img.height = '64';
    img.src = frame.image;
    
    document.body.appendChild(img);
    document.body.appendChild(document.createTextNode('('+frame.index+') '));
    document.body.appendChild(document.createTextNode('dt='+frame.time));
    document.body.appendChild(document.createElement('br'));
  });
});
