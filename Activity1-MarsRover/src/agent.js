import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

import { Box3 } from "three";
import { Tween } from "@tweenjs/tween.js";

class RoverAgent {
  constructor(scene, x, y, z) {
    this.scene = scene;
    // Instantiate a loader GLTF is prefered
    this.loader = new GLTFLoader();
    this.modelAgent;

    this.multiagent = multiagent;
    this.addAgent(x, y, z, scene);
    this.rockStack = 0;
    this.rockLimit = 6;
    this.rocksCollected = 0;
    this.full = false;
    this.velocity = 7;
    this.isCarrier = carrier;
    this.rotate = true;
  }

  addAgent(x, y, z, scene) {
    const ctx = this;
    this.loader.load('assets/rover.glb', function (gltf) {
      gltf.scene.position.z = z;
      gltf.scene.position.y = y;
      gltf.scene.position.x = x;
      gltf.scene.scale.set(50,50,50);
      gltf.scene.rotation.set(0,0,0);
      //console.log(gltf.scene);
      let newBox = new Box3().setFromObject(gltf.scene);
      ctx.modelAgent = gltf.scene;
      ctx.modelAgent.collider = newBox;
      ctx.scene.add(ctx.modelAgent);
      //console.log('agente creado');
      scene.agentsLoaded += 1;
      //console.log('numero de agentes cargados: ' + scene.agentsLoaded.toString());
    }, undefined, function (error) {
      console.error(error);
    });
  }

  moveAgent() {
    const ctx = this;
    //console.log('rotation of agent is: ' + ctx.modelAgent.rotation.y.toString());
    if (ctx.modelAgent.rotation.y === 0) {
      ctx.modelAgent.position.z += ctx.velocity;
    } else if (ctx.modelAgent.rotation.y === (Math.PI / 2)) {
      ctx.modelAgent.position.x += ctx.velocity;
    } else if (ctx.modelAgent.rotation.y === Math.PI) {
      ctx.modelAgent.position.z -= ctx.velocity;
    } else if (ctx.modelAgent.rotation.y === ((3 * Math.PI) / 2)) {
      ctx.modelAgent.position.x -= ctx.velocity;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rotateAgent() {
    let randomNum = Math.random();
    const ctx = this;
    if (randomNum >= 0 && randomNum < 0.25) {
      ctx.modelAgent.rotation.y = 0;
    } else if (randomNum >= 0.25 && randomNum < 0.5) {
      ctx.modelAgent.rotation.y = Math.PI / 2;
    } else if (randomNum >= 0.5 && randomNum < 0.75) {
      ctx.modelAgent.rotation.y = Math.PI;
    } else {
      ctx.modelAgent.rotation.y = (3 * Math.PI) / 2;
    }
  }

  //Cuando se colisiona con la nave/estación
  updateBase(collider) {
    if (this.modelAgent.collider.intersectsBox(collider)) {
      //console.log("lol");
      if (this.rockStack > 0) {
        console.log('A total of ' + this.rockStack.toString() + ' more rocks have been left at the station.');
        this.rocksCollected += this.rockStack;
        console.log('The total of rocks left by this agent at the station is: ' + this.rocksCollected.toString() + ' rocks.');
        return true;
      }
    }
    return false;
  }

  //Cuando se colisiona con una roca
  updateRock(col) {
    if (!this.multiagent) {
      if (this.modelAgent.collider.intersectsBox(col)) {
        if (this.rockStack === this.rockLimit) {
          return false;
        }
        else {
          this.rockStack += 1;
          console.log('Rock stack has ' + this.rockStack.toString() + ' rocks');
          if (this.rockStack == this.rockLimit) {
            console.log('Rock stack limit has been already reached, agent must go to the station!');
            this.full = true;
          }
          return true;
        }
        //console.log("Rock Found!!!");
      }
      return false;
    }
    else {
      if(this.multiagent && !this.isCarrier){
        this.sendMessage(this.modelAgent.position);
      } 
      else if (this.multiagent && this.isCarrier){
        if (this.modelAgent.collider.intersectsBox(col)) {
          if (this.rockStack === this.rockLimit) {
            return false;
          }
          else {
            this.rockStack += 1;
            console.log('Rock stack has ' + this.rockStack.toString() + ' rocks');
            if (this.rockStack == this.rockLimit) {
              console.log('Rock stack limit has been already reached, agent must go to the station!');
              this.full = true;
            }
            return true;
          }
          //console.log("Rock Found!!!");
        }
        return false;
      }
    }
    
  }

  //Cuando se colisiona con un obstáculo
  updateObstacle(col) {
    if (this.modelAgent.collider.intersectsBox(col)) {
      console.log("Obstacle Found!!!");
      var selection = Math.round(Math.random());
      this.avoidObstacle(selection);
    }
  }

  avoidObstacle(selection) {
    const ctx = this;
    if (ctx.modelAgent.rotation.y === 0 || ctx.modelAgent.rotation.y === Math.PI) {

      if (ctx.modelAgent.rotation.y === 0) {
        ctx.modelAgent.position.z -= 5;
      }
      else if (ctx.modelAgent.rotation.y === Math.PI) {
        ctx.modelAgent.position.z += 5;
      }

      if (selection === 0) {
        ctx.modelAgent.rotation.y = Math.PI / 2;
      }
      else {
        ctx.modelAgent.rotation.y = (3 * Math.PI) / 2;
      }

    } else if (ctx.modelAgent.rotation.y === (Math.PI / 2) || ctx.modelAgent.rotation.y === ((3 * Math.PI) / 2)) {

      if (ctx.modelAgent.rotation.y === (Math.PI / 2)) {
        ctx.modelAgent.position.x -= 5;
      }
      else if (ctx.modelAgent.rotation.y === ((3 * Math.PI) / 2)) {
        ctx.modelAgent.position.x += 5;
      }

      if (selection === 0) {
        ctx.modelAgent.rotation.y = 0;
      }
      else {
        ctx.modelAgent.rotation.y = Math.PI;
      }
    }
  }

  updateLimits() {
    const ctx = this;
    if (ctx.modelAgent.position.z >= 1000 || ctx.modelAgent.position.z <= -1600 ||
      ctx.modelAgent.position.x >= 1150 || ctx.modelAgent.position.x <= -1150) {
      console.log('Limit of map has been reached, go other way');
      ctx.avoidObstacle(Math.round(Math.random()));
    }
  }

  sendMessage(position) {
    console.log("Rock at position", position);
    return position;
  }

  goForRock(position) {
    const ctx = this;
    if(ctx.isCarrier){
      new Tween().to(position, 5000)

    }
  }

  animate() {
    if (this.modelAgent && this.modelAgent.collider) {
      this.modelAgent.collider.setFromObject(this.modelAgent);
    }
  }
}

export {
  RoverAgent
};