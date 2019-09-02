import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

class RoverAgent {
  constructor(scene) {
    this.scene = scene;
    // Instantiate a loader GLTF is prefered
    this.loader = new GLTFLoader();
    this.addAgent();
  }

  addAgent() {
    const ctx = this;
    this.loader.load('assets/rover.glb', function(gltf) {
      ctx.scene.add(gltf.scene);
    }, undefined, function(error) {
      console.error(error);
    });
  }
}

export {
  RoverAgent
};
