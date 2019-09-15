import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

import { Box3 } from "three";

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
      gltf.scene.rotation.set(0,0,0);
      let newBox = new Box3().setFromObject(gltf.scene);
      ctx.modelAgent = gltf.scene;
      ctx.modelAgent.collider = newBox;
      ctx.scene.add(ctx.modelAgent);
    }, undefined, function (error) {
      console.error(error);
    });
  }

  moveAgent(randomNum) {
    const ctx = this;
    if (Math.floor(ctx.modelAgent.rotation.y) === 0 || Math.floor(ctx.modelAgent.rotation.y) === 360) {
      ctx.modelAgent.position.z += 1;
    } else if (Math.floor(ctx.modelAgent.rotation.y) === 90) {
      ctx.modelAgent.position.x += 1;
    } else if (Math.floor(ctx.modelAgent.rotation.y) === 180) {
      ctx.modelAgent.position.z -= 1;
    } else if (Math.floor(ctx.modelAgent.rotation.y) === 270){
      ctx.modelAgent.position.x -= 1;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rotateAgent(randomNum) {
    const ctx = this;
    if (randomNum >= 0 && randomNum < 0.25) {
      ctx.modelAgent.rotation.y = 0;
    } else if (randomNum >= 0.25 && randomNum < 0.5) {
      ctx.modelAgent.rotation.y = 90;
    } else if (randomNum >= 0.5 && randomNum < 0.75) {
      ctx.modelAgent.rotation.y = 180;
    } else {
      ctx.modelAgent.rotation.y = 270;
    }
  }

  updateBase(collider) {
    if(this.modelAgent.collider.intersectsBox(collider)){
      console.log("lol");
    }
  }

  updateRock(col){
    if(this.modelAgent.collider.intersectsBox(col)){
      //console.log("Rock Found!!!");
    }
  }

  animate() {
    if(this.modelAgent && this.modelAgent.collider) {
      this.modelAgent.collider.setFromObject(this.modelAgent);
    }
  }
}

export {
  RoverAgent
};
