var mapnik = require('mapnik');
var zlib = require('zlib');
var fs = require('fs');
var assert = require('assert');
var sm = new (require('sphericalmercator'))()

var z = 14;
var x = 2620;
var y = 6331;
var tile = './14_2620_6331.vector.pbf.z'

var vt = new mapnik.VectorTile(z,x,y);
fs.readFile(tile,function(err,raw){
    if (err) throw err;
    zlib.inflate(raw, function(err, data) {
        if (err) throw err;
        console.time('setData');
        vt.setData(data);
        console.timeEnd('setData');
        console.time('parse');
        vt.parse(function(err){
            console.timeEnd('parse');
            console.time('toJSON');
            var vdata = vt.toJSON();
            console.timeEnd('toJSON');
            assert.equal(vdata.length,23);

            console.time('toGeoJSON');
            var vdata = vt.toGeoJSON('__array__');
            console.timeEnd('toGeoJSON');
            assert.equal(vdata.length,23);

            console.time('query miss');
            var features = vt.query(0,0);
            console.timeEnd('query miss');
            assert.equal(features.length,0);

            // https://gist.github.com/anonymous/434d2eb1baf6c278764c
            var lon = -122.42284297943114;
            var lat = 37.79805179347195;
            console.time('query hit');
            var features = vt.query(lon,lat).map(function(f) { return f.toJSON() } );
            console.timeEnd('query hit');
            assert.equal(features.length,1);

            console.time('query hit high tolerance');
            var features = vt.query(lon,lat,{tolerance:1000}).map(function(f) { return f.toJSON() } );
            console.timeEnd('query hit high tolerance');
            assert.equal(features.length,509);

            console.time('rendering grid for one layer');
            var map = new mapnik.Map(256, 256);
            map.loadSync('./stylesheet.xml');
            map.extent = sm.bbox(x,y,z,false,'900913');
            //console.log(map.extent);
            //console.log(vt.names())
            vt.render(map, new mapnik.Grid(256, 256), {layer:0}, function(err, grid) {
                var utf = grid.encodeSync('utf');
                assert.equal(utf.keys.length,288);
                console.timeEnd('rendering grid for one layer');
            });

        });
    });
})
