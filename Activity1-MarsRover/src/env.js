// Environment

import {
  BoxGeometry,
  Box3,
  Box3Helper,
  MeshBasicMaterial,
  Mesh,
  Color,
  Fog,
  RepeatWrapping,
  SphereBufferGeometry,
  ShaderMaterial,
  BackSide,
  AmbientLight,
  MeshLambertMaterial,
  PlaneBufferGeometry,
  TextureLoader,
  Vector3
} from 'three';

import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

import {
  OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader';

const BACKGROUND_COLOR = 0x000000;
const AMBIENT_COLOR = 0x000000;
const FOG_COLOR = 0x000000;


class MarsEnvironment {
  constructor(numRocks, numObstacles, scene) {
    this.numRocks = numRocks;
    this.numObstacles = numObstacles;
    this.scene = scene;
    this.addLights();
    // this.addGround();
    this.addSky();
    this.addMarsBase();
    this.createPlane();
    this.rockModels = [];
    this.rocks = [];
    this.loadRockModels().then( function(res) {
      //clone the number of desired rocks
      return this.cloneRocks(res);
    });

    this.marsBase = null;
    this.helperBox = null;
    this.newBox = null;
    this.vectors = [
      new Vector3(-700, 200,0),
      new Vector3(700, 200,0),
      new Vector3(700, 200, -300),
      new Vector3(-700, 200, -300),
      new Vector3(-700, 200, 0),
      new Vector3(700, 0, 0),
      new Vector3(700, 0, -300),
      new Vector3(-700, 0, -300),
      new Vector3(-700, 0, 0),

    ];
  }

  addMarsBase() {
    this.loader = new GLTFLoader();
    const ctx = this;
    this.loader.load('assets/mars_base/scene.gltf', function(gltf) {
      ctx.newBox = new Box3().setFromPoints(ctx.vectors);
      ctx.marsBase = gltf.scene;
      ctx.marsBase.collider = ctx.newBox;
      ctx.helperBox = new Box3Helper(ctx.newBox);
      ctx.helperBox.visible = true;
      ctx.scene.add(ctx.marsBase);
      ctx.scene.add(ctx.helperBox);
    }, undefined, function(error) {
      console.error(error);
    });
  }

  addLights() {
    this.scene.background = new Color(BACKGROUND_COLOR);
    this.scene.fog = new Fog(0x0f0f0f, 100, 3500);
    this.scene.add(new AmbientLight(0xee2400));
  }

  addGround() {
    const loader = new TextureLoader();
    const groundTexture = loader.load('assets/surface.jpg');
    groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
    groundTexture.repeat.set(100, 100);
    groundTexture.anisotropy = 16;
    const groundMaterial = new MeshLambertMaterial({
      map: groundTexture
    });
    const mesh = new Mesh(new PlaneBufferGeometry(20000, 20000), groundMaterial);
    mesh.position.y = 0;
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  addSky() {
    const vertexShader = document.getElementById('vertexShader').textContent;
    const fragmentShader = document.getElementById('fragmentShader').textContent;
    const uniforms = {
      "topColor": {
        value: new Color(0x000000)
      },
      "bottomColor": {
        value: new Color(0xcc501e)
      },
      "offset": {
        value: 33
      },
      "exponent": {
        value: 0.6
      }
    };
    // uniforms["topColor"].value.copy(0xee2400);
    this.scene.fog.color.copy(uniforms["bottomColor"].value);
    const skyGeo = new SphereBufferGeometry(4000, 32, 15);
    const skyMat = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: BackSide
    });
    const sky = new Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  createPlane() {
    const geometry = new BoxGeometry(5, 5, 5);
    const material = new MeshBasicMaterial({
      color: 0x00ff00
    });
    this.cube = new Mesh(geometry, material);
    this.cube.scale.addScalar(5);
    this.cube.position.z = -200;
    this.cube.position.y += 200;
    this.scene.add(this.cube);
  }

  animate() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
  }

  cloneRocks(no_of_rocks) {
    const temp_env = this;
    var x;
    for(x = 0; x < no_of_rocks; x++) {
      var model_no = Math.floor(Math.random() * 6);
      console.log('rocas!');
      var rock = temp_env.rockModels[model_no].clone();
      rock.position.set( ((Math.floor(Math.random() * 100)+10) * 10), 40, ((Math.floor(Math.random() * 100)+10) * 10));
      temp_env.rocks.push(rock);
      temp_env.scene.add(rock);
    }
  }

  loadRockModels() {

    const temp_env = this;

    return new Promise(function( resolve, reject ){

      var texture = new TextureLoader().load('assets/Rocks/Texture/diffuseG6.jpg');

      var i;
      for (i = 1; i < 7; i++) {
        var path = 'assets/Rocks/Rock';
        const objLoader = new OBJLoader();
        objLoader.load(
            path.concat(i.toString(),'.obj'),
            function(object)
            {
                object.traverse( function ( child )
                {
                    if ( child instanceof Mesh )
                    {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material.map = texture;
                    }
                } );

                object.scale.set(30,30,30);
                temp_env.rockModels.push(object);
                //rock.position.z = 600;
                //rock.position.x = 0;
                //rock.position.y = 40;
                //temp_env.scene.add(object);
            },
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
            });
      }
      //clone the number of desired rocks
      return 25;
    });
  }

}

export {
  MarsEnvironment
};
