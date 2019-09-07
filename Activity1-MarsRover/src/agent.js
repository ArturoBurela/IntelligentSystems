import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

class RoverAgent {
  constructor(scene) {
    this.scene = scene;
    // Instantiate a loader GLTF is prefered
    this.loader = new GLTFLoader();
    this.addAgent();
    this.hasStuff = false;
    this.position = this.moveAgent();
  }

  addAgent() {
    const ctx = this;
    this.loader.load('assets/rover.glb', function(gltf) {
      gltf.scene.position.z = -300;
      gltf.scene.position.y += 200;
      gltf.scene.scale.addScalar(5);
      ctx.scene.add(gltf.scene);
    }, undefined, function(error) {
      console.error(error);
    });
  }

  moveAgent(){

  }
}

export {
  RoverAgent
};
