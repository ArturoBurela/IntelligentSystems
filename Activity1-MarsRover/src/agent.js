import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

class RoverAgent {
  constructor(scene) {
    this.scene = scene;
    // Instantiate a loader GLTF is prefered
    this.loader = new GLTFLoader();
    this.modelAgent;
    this.addAgent();
  }

  addAgent() {
    const ctx = this;
    this.loader.load('assets/rover.glb', function (gltf) {
      gltf.scene.position.z = -400;
      gltf.scene.position.y = 25;
      gltf.scene.scale.set(50,50,50);
      ctx.modelAgent = gltf.scene;
      ctx.scene.add(ctx.modelAgent);
    }, undefined, function (error) {
      console.error(error);
    });
  }

  moveAgent(randomNum) {
    const ctx = this;
    if (randomNum >= 0 && randomNum < 0.25) {
      ctx.modelAgent.position.z -= 1;
    } else if (randomNum >= 0.25 && randomNum < 0.5) {
      ctx.modelAgent.position.x -= 1;
    } else if (randomNum >= 0.5 && randomNum < 0.75) {
      ctx.modelAgent.position.z += 1;
    } else {
      ctx.modelAgent.position.x += 1;
    }
  }
  rotateAgent(randomNum) {
    const ctx = this;
    if (randomNum >= 0 && randomNum < 0.25) {
      ctx.modelAgent.rotation.y += Math.floor((Math.random() * 90) + 1);
    } else if (randomNum >= 0.25 && randomNum < 0.5) {
      ctx.modelAgent.rotation.y -= Math.floor((Math.random() * 90) + 1);
    } else if (randomNum >= 0.5 && randomNum < 0.75) {
      ctx.modelAgent.rotation.y += Math.floor((Math.random() * 90) + 1);
    } else {
      ctx.modelAgent.rotation.y -= Math.floor((Math.random() * 90) + 1);
    }
  }
}

export {
  RoverAgent
};