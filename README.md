# mcmeta

Parse .mcmeta files from Minecraft resource packs

[![Build Status](https://travis-ci.org/deathcap/mcmeta.png)](https://travis-ci.org/deathcap/mcmeta)

Usage:
    
    var frames = require('mcmeta')(pixels, json);

`pixels` should be an [ndarray](https://github.com/mikolalysenko/ndarray) of the texture pixel
data (e.g., from [get-pixels](https://github.com/mikolalysenko/get-pixels)),
`json` a JSON string or decoded object from the corresponding `.mcmeta` file contents.

The `frames` return value will be an array of the animation frames, objects with
`image` set to the image tile URL, and `time` the duration to remain on this frame.
For an example, see demo.js and run `npm start`, or view the live demo at
[http://deathcap.github.io/mcmeta/](http://deathcap.github.io/mcmeta/).


References:

* http://minecraft.gamepedia.com/Resource%5fpack#Animation%5fProperties

(Minecraft is property of Mojang Specifications)

## License

MIT

