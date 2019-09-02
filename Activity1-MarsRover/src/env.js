// Environment

import {
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  HemisphereLight,
  HemisphereLightHelper,
  Color,
  Fog,
  PlaneBufferGeometry,
  MeshLambertMaterial,
  SphereBufferGeometry,
  ShaderMaterial,
  BackSide
} from 'three';

class MarsEnvironment {
  constructor(numRocks, numObstacles, scene) {
    this.height = 1;
    this.width = 1;
    this.scene = scene;
    this.addLights();
    this.addGround();
    this.addSky();
    this.createPlane();
  }

  addGround() {
    const groundGeo = new PlaneBufferGeometry(10000, 10000);
    const groundMat = new MeshLambertMaterial({
      color: 0xffffff
    });
    groundMat.color.setHSL(0.095, 1, 0.75);
    const ground = new Mesh(groundGeo, groundMat);
    ground.position.y = 0;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  addSky() {
    var vertexShader = document.getElementById('vertexShader').textContent;
    var fragmentShader = document.getElementById('fragmentShader').textContent;
    var uniforms = {
      "topColor": {
        value: new Color(0x0077ff)
      },
      "bottomColor": {
        value: new Color(0xffffff)
      },
      "offset": {
        value: 33
      },
      "exponent": {
        value: 0.6
      }
    };
    uniforms["topColor"].value.copy(this.hemiLight.color);
    this.scene.fog.color.copy(uniforms["bottomColor"].value);
    var skyGeo = new SphereBufferGeometry(4000, 32, 15);
    var skyMat = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: BackSide
    });
    var sky = new Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  addLights() {
    this.scene.background = new Color().setHSL(0.6, 0, 1);
    this.scene.fog = new Fog(this.scene.background, 1, 5000);
    this.hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);
    this.hemiLightHelper = new HemisphereLightHelper(this.hemiLight, 10);
    this.scene.add(this.hemiLightHelper);
  }

  createPlane() {
    const geometry = new BoxGeometry(5, 5, 5);
    const material = new MeshBasicMaterial({
      color: 0x00ff00
    });
    this.cube = new Mesh(geometry, material);
    this.cube.position.z = -5;
    this.cube.position.y += 3;
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
