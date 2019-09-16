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
    this.rockStack = 0;
    this.rockLimit = 6;
    this.rocksCollected = 0;
  }

  addAgent() {
    const ctx = this;
    this.loader.load('assets/rover.glb', function (gltf) {
      gltf.scene.position.z = -250;
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
    //console.log('rotation of agent is: ' + ctx.modelAgent.rotation.y.toString());
    if (ctx.modelAgent.rotation.y === 0) {
      ctx.modelAgent.position.z += 1;
    } else if (ctx.modelAgent.rotation.y === (Math.PI / 2)) {
      ctx.modelAgent.position.x += 1;
    } else if (ctx.modelAgent.rotation.y === Math.PI) {
      ctx.modelAgent.position.z -= 1;
    } else if (ctx.modelAgent.rotation.y === ((3*Math.PI) / 2)){
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
      ctx.modelAgent.rotation.y = Math.PI / 2;
    } else if (randomNum >= 0.5 && randomNum < 0.75) {
      ctx.modelAgent.rotation.y = Math.PI;
    } else {
      ctx.modelAgent.rotation.y = (3*Math.PI) / 2;
    }
  }

  //Cuando se colisiona con la nave/estación
  updateBase(collider) {
    if(this.modelAgent.collider.intersectsBox(collider)){
      //console.log("lol");
      if(this.rockStack > 0) {
        console.log('A total of ' + this.rockStack.toString() + ' more rocks have been left at the station.');
        this.rocksCollected += this.rockStack;
        console.log('The total of rocks at the station is: ' + this.rocksCollected.toString() + ' rocks.');
        this.rockStack = 0;
      }
    }
  }

  //Cuando se colisiona con una roca
  updateRock(col){
    if(this.modelAgent.collider.intersectsBox(col)){
      if(this.rockStack >= this.rockLimit){
        console.log('Rock stack limit has been already reached, agent must go to the station!');
        return false;
      }
      //console.log("Rock Found!!!");
      this.rockStack += 1;
      console.log('Rock stack has ' + this.rockStack.toString() + ' rocks');
      return true;
    }
    return false;
  }

  //Cuando se colisiona con un obstáculo
  updateObstacle(col){
    const ctx = this;
    if(this.modelAgent.collider.intersectsBox(col)){
      console.log("Obstacle Found!!!");
      var selection = Math.round(Math.random());
      if (ctx.modelAgent.rotation.y === 0 || ctx.modelAgent.rotation.y === Math.PI) {
        if (selection === 0){
          ctx.modelAgent.rotation.y = Math.PI / 2;
        }
        else{
          ctx.modelAgent.rotation.y = (3*Math.PI) / 2;
        }
      } else if (ctx.modelAgent.rotation.y === (Math.PI / 2) || ctx.modelAgent.rotation.y === ((3*Math.PI) / 2)) {
        if (selection === 0){
          ctx.modelAgent.rotation.y = 0;
        }
        else{
          ctx.modelAgent.rotation.y = Math.PI;
        }
      }
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
