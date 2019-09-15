import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

import { Box3, SphereGeometry, Mesh, Object3D, MeshBasicMaterial, Vector3 } from "three";

class RoverAgent {
  constructor(scene) {
    this.scene = scene;
    // Instantiate a loader GLTF is prefered
    this.loader = new GLTFLoader();
    this.modelAgent = null;
    this.turnDown = false; 
    this.turnUp = false;
    this.turnRight = false; 
    this.turnLeft = false;
    this.agentGroup = null;
    this.derecha = null;
    this.izquierda = null;
    this.arriba =null;
    this.abajo = null;
    this.step = 1;
    this.materials = {
      dotU: new MeshBasicMaterial({ color: 0x0000ff }), dotD: new MeshBasicMaterial({ color: 0x00ff00 }),
      dotL: new MeshBasicMaterial({ color: 0xff0000 }), dotR: new MeshBasicMaterial({ color: 0xffffff })
    };
    this.hasRock = false;
    this.basePosition = new Vector3(0,0,0);
    this.addAgent();
  }

  addAgent() {
    const ctx = this;
    this.loader.load('assets/rover.glb', function (gltf) {
      gltf.scene.position.z = 0;
      gltf.scene.position.y = 0;
      gltf.scene.scale.set(50,50,50);
      gltf.scene.rotation.y = 0;
      let newBox = new Box3().setFromObject(gltf.scene);
      ctx.modelAgent = gltf.scene;
      ctx.modelAgent.collider = newBox;
      ctx.agentGroup = new Object3D();
      ctx.agentGroup.position.set(0,25,-400);
      ctx.agentGroup.rotation.set(0,0,0);
      ctx.agentGroup.add(ctx.modelAgent);
      let dotGeo = new SphereGeometry(5);
      ctx.derecha = new Mesh(dotGeo,ctx.materials.dotR);
      ctx.derecha.position.set(ctx.agentGroup.position.x, ctx.agentGroup.position.y, ctx.agentGroup.position.z + 60);
      ctx.izquierda = new Mesh(dotGeo, ctx.materials.dotL);
      ctx.izquierda.position.set(ctx.agentGroup.position.x, ctx.agentGroup.position.y, ctx.agentGroup.position.z - 60);
      ctx.arriba = new Mesh(dotGeo, ctx.materials.dotU);
      ctx.arriba.position.set(ctx.agentGroup.position.x + 60, ctx.agentGroup.position.y, ctx.agentGroup.position.z);
      ctx.abajo = new Mesh(dotGeo, ctx.materials.dotD);
      ctx.abajo.position.set(ctx.agentGroup.position.x - 60, ctx.agentGroup.position.y, ctx.agentGroup.position.z);
      ctx.scene.add(ctx.derecha);
      ctx.scene.add(ctx.izquierda);
      ctx.scene.add(ctx.arriba)
      ctx.scene.add(ctx.abajo);
      ctx.scene.add(ctx.agentGroup);
    }, undefined, function (error) {
      console.error(error);
    });
  }

  moverPuntos(direccion) {
    switch (direccion) {
      case 0: //izquierda
        this.arriba.position.z -= this.step;
        this.abajo.position.z -= this.step;
        this.izquierda.position.z -= this.step;
        this.derecha.position.z -= this.step;
        break;
      case 1: //this.derecha
        this.arriba.position.z += this.step;
        this.abajo.position.z += this.step;
        this.izquierda.position.z += this.step;
        this.derecha.position.z += this.step;
        break;
      case 2: //this.abajo
        this.arriba.position.x -= this.step;
        this.abajo.position.x -= this.step;
        this.izquierda.position.x -= this.step;
        this.derecha.position.x -= this.step;
        break;
      case 3: //this.arriba
        this.arriba.position.x += this.step;
        this.abajo.position.x += this.step;
        this.izquierda.position.x += this.step;
        this.derecha.position.x += this.step;
        break;

    }
  }

  checkObstacles() {
    this.turnUp = true;
    this.turnRight = true;
    this.turnLeft = true;
    this.turnDown = true;
  }

  moveAgent() {
    if (this.agentGroup.rotation.y === 0) {
      this.agentGroup.rotation.y = 0;
      this.modelAgent.rotation.y = 0;
      if (this.turnUp) {
        this.agentGroup.translateX(this.step);
        this.moverPuntos(3);
      }
      this.checkObstacles();
    } else if (this.agentGroup.rotation.y === Math.PI / 2) {
      this.agentGroup.rotation.y = Math.PI / 2;
      // this.modelAgent.rotation.y = Math.PI / 2;
      if (this.turnLeft) {
        this.agentGroup.translateX(this.step);
        this.moverPuntos(0);
      }
      this.checkObstacles();
    } else if (this.agentGroup.rotation.y === -Math.PI / 2) {
      this.agentGroup.rotation.y = -Math.PI / 2;
      // this.modelAgent.rotation.y = -Math.PI / 2;
      if (this.turnRight) {
        this.agentGroup.translateX(this.step);
        this.moverPuntos(1);
      }
      this.checkObstacles();
    } else if (this.agentGroup.rotation.y === -Math.PI){
      this.agentGroup.rotation.y = - Math.PI;
      this.modelAgent.rotation.y = - Math.PI;
      if (this.turnDown) {
        this.agentGroup.translateX(this.step);
        this.moverPuntos(2);
      }
      this.checkObstacles();
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rotateAgent(randomNum) {
    const ctx = this;
    if (randomNum >= 0 && randomNum < 0.25) {
      ctx.agentGroup.rotation.y = 0;
      console.log("arriba");
    } else if (randomNum >= 0.25 && randomNum < 0.5) {
      ctx.agentGroup.rotation.y = Math.PI / 2;
      console.log("izquierda");
    } else if (randomNum >= 0.5 && randomNum < 0.75) {
      ctx.agentGroup.rotation.y = -Math.PI;
      console.log("abajo");
    } else {
      ctx.agentGroup.rotation.y = -Math.PI/2;
      console.log("derecha");
    }
  }

  updateBase(collider) {
    if(this.modelAgent.collider.intersectsBox(collider)){
      console.log("lol");
    }
  }

  carryRock() {
  
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
