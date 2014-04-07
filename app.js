define(function(require, exports, module) {

  var m                   = require( 'Utils/Math'                 );

  var Womb                = require( 'Womb/Womb'                  );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var physicsParticles    = require( 'Shaders/physicsParticles'   );
  
  var FBOShaders          = require( 'Shaders/FBOShaders'         );
  var FBOParticles        = require( 'Species/FBOParticles'       );

  var FBOUtils            = require( 'Utils/FBOUtils'             );
  var helperFunctions     = require( 'Utils/helperFunctions'      );
  var m                   = require( 'Utils/Math'                 );


  
  womb = new Womb({
    cameraController: 'OrbitControls',
    // title:            'FBO Particle Dissipation',
    // link:             link, 
    // summary:          info,
    stats:            false,
    color:            '#000000',
    failureVideo:     84019684,
    size:             400
  });
  womb.camera.position.z =  500;
  womb.cameraController.controls.autoRotate = true;
  womb.cameraController.controls.autoRotateSpeed = 1;
  womb.cameraController.controls.userRotate = false;
  womb.cameraController.controls.userPan = false;
  womb.cameraController.controls.userZoom = false;

  womb.audio = womb.audioController.createStream( 'lib/audio/tracks/god.mp3' );

  
  var cubeGeo = new THREE.IcosahedronGeometry(45, 2);
  var mesh = new THREE.Mesh(cubeGeo, new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    })
  );

  womb.fboFire = new FBOParticles({
    audioTexture: womb.audio.texture,
    numberOfParticles: 1111111,
    geometry: cubeGeo,
    simulationShader: FBOShaders.fragment.god,
    fragmentShader: physicsParticles.fragment.fire,
    stopUpdating: false,
  })
  womb.fboFire.body.position.y -=100;
  womb.fireUniforms = womb.fboFire.particles.material.simulationShader.uniforms

  womb.loader.loadBarAdd();


  womb.start = function(){
    womb.fboFire.enter();

    var changeGod = function(){
      womb.fireUniforms.xFactor.value = m.ericRandomRange(.06, .1)
      womb.fireUniforms.yFactor.value = m.ericRandomRange(.06, .1)
      womb.fireUniforms.zFactor.value = m.ericRandomRange(.06, .1)
      womb.fireUniforms.fireSpeed.value = m.ericRandomRange(.4, .8)
    }
    var miracleGod = function(){
      womb.fireUniforms.fireSpeed.value = 1.5;
    }
    var fadeAudio = function(){
      womb.audio.fadeOut()
    }

    var endGod = function(){
    }
    setTimeout(changeGod, 35000)
    setTimeout(changeGod, 45000)
    setTimeout(miracleGod, 70000)
    setTimeout(changeGod, 81000)
    setTimeout(changeGod, 120000)
    setTimeout(fadeAudio, 180000)
    setTimeout(endGod, 3000)

  
    womb.audio.play();

  }
});
