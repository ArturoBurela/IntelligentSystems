// Environment

import {
  BoxGeometry,
  Box3,
  BoxHelper,
  Box3Helper,
  DirectionalLight,
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
  MeshPhongMaterial,
  ImageUtils,
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

import {
  FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader';

import { cloneFbx } from '../utils/cloneFBX.js';

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
    this.rocksColliders = [];
    this.ufoModel = null;
    this.ufos = [];
    //Number of rocks and obstacles to spawn
    this.loadEnv(75,5).then((res) => {
      console.log(res + ' rocks spawned');
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
    return new Promise(resolve => {
      console.log('rocas!');

      setTimeout(() => {
        var x;
        for(x = 0; x < no_of_rocks; x++) {
          var model_no = Math.floor(Math.random() * 6);

          var rock = temp_env.rockModels[model_no].clone();
          rock.position.set( ((Math.floor(Math.random() * 201)-100) * 20), 35, ((Math.floor(Math.random() * 201)-100) * 20));

          var rbox = new Box3().setFromObject(rock);
          var hrbox = new BoxHelper(rock, 0x00ff00);
          hrbox.position.set(rock.position);
          hrbox.visible = true;

          temp_env.rocks.push(rock);
          temp_env.scene.add(rock);
          temp_env.scene.add(hrbox);
          temp_env.rocksColliders.push(rbox);
        }
        resolve(no_of_rocks);
      }, 2000);
    });
  }

  loadRockModels() {

    const temp_env = this;

    return new Promise(resolve => {

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
                resolve();
            },
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
            });
      }

    });
  }

  loadObsModel() {
    const temp_env = this;

    return new Promise(resolve => {

      var text = new MeshPhongMaterial ({
        normalMap: new TextureLoader().load('assets/ufo/ufo_normal.png'),
        map: new TextureLoader().load('assets/ufo/ufo_diffuse.png'),
        specularMap: new TextureLoader().load('assets/ufo/ufo_spec.png')
      });

      const objLoader = new OBJLoader();
      objLoader.load(
          'assets/ufo/Low_poly_UFO.obj',
          function(object)
          {
              object.traverse( function ( child )
              {
                  if ( child instanceof Mesh )
                  {
                      child.castShadow = true;
                      child.receiveShadow = true;
                      child.material = text;
                  }
              } );

              object.scale.set(6,6,6);
              temp_env.ufoModel = object;

              resolve();
          },
          function ( xhr ) {
              console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          // called when loading has errors
          function ( error ) {
              console.log( 'An error happened' );
          });

    });
  }

  cloneObs(no_of_ufos) {
    const temp_env = this;
    return new Promise(resolve => {
      console.log('ufos!');

      setTimeout(() => {
        var x;
        for(x = 0; x < no_of_ufos; x++) {

          var newUfo = temp_env.ufoModel.clone();
          newUfo.position.set( ((Math.floor(Math.random() * 201)-100) * 20), 15, ((Math.floor(Math.random() * 201)-100) * 20));

          var ubox = new Box3().setFromObject(newUfo);
          var hubox = new BoxHelper(newUfo, 0x00ff00);
          hubox.position.set(newUfo.position);
          hubox.visible = true;

          temp_env.scene.add(newUfo);
          temp_env.scene.add(hubox);
          temp_env.ufos.push(ubox);
        }
        resolve(no_of_ufos);
      }, 2000);
    });
  }

  async loadEnv(x, y){
    await this.loadRockModels();
    await this.cloneRocks(x);
    await this.loadObsModel();
    await this.cloneObs(y);
    return x;
  }

}

export {
  MarsEnvironment
};
