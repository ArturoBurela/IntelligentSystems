// Environment

import {
  BoxGeometry,
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
  TextureLoader
} from 'three';

import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

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
  }

  addMarsBase() {
    this.loader = new GLTFLoader();
    const ctx = this;
    this.loader.load('assets/mars_base/scene.gltf', function(gltf) {
      console.log(gltf);
      ctx.scene.add(gltf.scene);
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
}

export {
  MarsEnvironment
};
