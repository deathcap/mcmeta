'use strict';

var mcmeta = require('./');
var test = require('tape');

var parseFrameOffsets = mcmeta.parseFrameOffsets;

test('animation sample', function(t) {
  // http://minecraft.gamepedia.com/Resource_pack#Animation_Properties
  var input = {
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
  };

  var output = parseFrameOffsets(16, 16*7, input);
  console.log(output);

  t.deepEqual(output,
    [ { index: 0, time: 0, coords: [ 0, 0, 16, 16 ] },
      { index: 1, time: 1, coords: [ 0, 16, 16, 32 ] },
      { index: 2, time: 1, coords: [ 0, 32, 16, 48 ] },
      { index: 3, time: 1, coords: [ 0, 48, 16, 64 ] },
      { index: 4, time: 1, coords: [ 0, 64, 16, 80 ] },
      { index: 5, time: 1, coords: [ 0, 80, 16, 96 ] },
      { index: 6, time: 1, coords: [ 0, 96, 16, 112 ] },
      { index: 4, time: 1, coords: [ 0, 64, 16, 80 ] },
      { index: 2, time: 1, coords: [ 0, 32, 16, 48 ] } ]
  );
  t.end();
});

test('empty animation, 16x(16*7)', function(t) {
  var output = parseFrameOffsets(16, 16*7, 
  {
    "animation":{}
  });

  console.log(output);
  t.deepEqual(output,
    [ { index: 0, time: 1, coords: [ 0, 0, 16, 16 ] },
      { index: 1, time: 1, coords: [ 0, 16, 16, 32 ] },
      { index: 2, time: 1, coords: [ 0, 32, 16, 48 ] },
      { index: 3, time: 1, coords: [ 0, 48, 16, 64 ] },
      { index: 4, time: 1, coords: [ 0, 64, 16, 80 ] },
      { index: 5, time: 1, coords: [ 0, 80, 16, 96 ] },
      { index: 6, time: 1, coords: [ 0, 96, 16, 112 ] } ]
    );
  t.end();
});

test('empty non-animated', function(t) {
  var output = parseFrameOffsets(16, 16*7, {});

  console.log(output);

  t.deepEqual(output,
    [ { coords: [ 0, 0, 16, 16 ] } ]);
  t.end();
});
