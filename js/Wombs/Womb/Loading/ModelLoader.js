define(function(require, exports, module) {

  var three = require( 'lib/three.min' );
  var OBJLoad = require( 'Womb/Loading/OBJLoader' );

  function ObjectLoader( womb , params ){

    this.womb   = womb;

    this.OBJLoader  = new OBJLoad();
    this.JSONLoader = new THREE.JSONLoader();

    this.geometries = [];

  }


  ObjectLoader.prototype.loadFile = function( format ,  file , callback ){

    this.womb.loader.addToLoadBar();


    if( format == 'OBJ' ){

      this.OBJLoader.load( file , function( object ){
        geometries = [];
        console.log( this );
        this.womb.loader.loadBarAdd();
        object.traverse( function ( child ) {

          if ( child instanceof THREE.Mesh ) {
            child.geometry.computeBoundingBox();
            geometries.push( child.geometry);
          }
        
        });
        callback( geometries );
      });

    }else if( format == 'JSON' ){


      this.JSONLoader.load( file , function( object ){
        geometries = [];
        
        this.womb.loader.loadBarAdd();

        object.traverse( function ( child ) {

          if ( child instanceof THREE.Mesh ) {
            child.geometry.computeBoundingBox();

            geometries.push( child.geometry);
          }
        
        });


        callback( geometries );

      });

    }


  }

  ObjectLoader.prototype.assignUVs = function( geometry ){

    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;

  }



  module.exports = ObjectLoader;

});
