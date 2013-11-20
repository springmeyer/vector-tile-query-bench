vector-tile-query-bench
=======================

Compare rendering a UTFGrid from vector tile vs querying raw data and performing hit test.

### Depends

 - Mapnik 2.3.x
 - Node.js


## Setup

    npm install


## Running test

    node bench.js


## Results

OSX 10.8 / Node.js 0.10.22:

```sh
toJSON: 14ms
toGeoJSON: 26ms
query miss: 1ms
query hit: 1ms
query hit high tolerance: 28ms
rendering grid for one layer: 7ms
```
