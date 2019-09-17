// Import libraries
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  Vector3
} from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
// Custom Imports
import {
  MarsEnvironment
} from './env.js';
import {
  RoverAgent
} from './agent.js';

// Get Canvas
//const canvas = document.createElement( 'canvas' );
const canvas = document.getElementById("canvas");
// Try to use WEBGL2, fallback to default context
const context = WEBGL.isWebGL2Available() ? canvas.getContext('webgl2', { alpha: false }) : canvas.getContext();
// Create basic ThreeJS objects: scene, camera, controls and renderer
var scene = new Scene();
scene.agentsLoaded = 0;
scene.rocksGathered = 0;
var clock = new Clock();
var multiagente = true;
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new WebGLRenderer({ canvas: canvas, context: context });
const controls = new OrbitControls(camera, renderer.domElement);
// Bind renderer to html
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);

// Set camera position
// camera.position.z = 500;
// camera.position.y = 500;
camera.position.set(9.6, 1242.3, -158.76);
camera.rotation.y = (3 * Math.PI) / 2;

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// container.appendChild( renderer.domElement );
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;
// controls
controls.maxPolarAngle = Math.PI * 0.4;
controls.minDistance = 100;
controls.maxDistance = 3500;
// performance monitor
// stats = new Stats();
// container.appendChild( stats.dom );
//
// window.addEventListener( 'resize', onWindowResize, false );

var rocksSpawned = 20;
var obstaclesSpawned = 5;
// Instantiate Environment with number of rocks and number of obstacles
var env = new MarsEnvironment(rocksSpawned, obstaclesSpawned, multiagente, scene);
// Instantiate Agent?
var agents = [];
scene.agents = agents;
//const agent = new RoverAgent(scene);
var no_of_agents = 6;
//let rotate = true;
var x;
var i;
var finished = false;
var end = false;
// animate the scene
const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if(scene.agentsLoaded == no_of_agents) {
    // Call to env animate
    //env.animate();
    //let mensajes = env.updateMessages();
    //env.animate();

    for(i = 0; i < no_of_agents; i++){
      agents[i].animate();
      /*if (agents[i].isCarrier && mensajes.length > 0) { // Mensajes en el ambiente para saber posiciones
        if (agents[i].positions.length < 1){ // una roca por agente
          agents[i].positions.push(mensajes[0]); // agregar mensaje a agente
          mensajes.shift(); // eliminar de mensajes
          agents[i].positions = [...new Set(agents[i].positions)]; // que sea único
        }
      }*/
    }

    if (env.marsBase) {

      if(!end && env.totalRocks == env.rocksNum){
        console.log('the search is over, all rocks have been collected. SIMULATION ENDED');
        console.log('THIS SIMULATION TOOK: ' + Math.floor(clock.getElapsedTime()).toString() + ' seconds.');
        for(x = 0; x < agents.length; x++)
        {
          agents[x].stop = true;
        }
        end = true;
      }

      if(!finished && env.rocksNum == scene.rocksGathered){
        console.log('Rocks have been collected, all agents must return to the station right now.');
        for(x = 0; x < agents.length; x++)
        {
          agents[x].full = true;
        }
        finished = true;
      }


      for(i = 0; i < no_of_agents; i++){

        agents[i].moveAgent();
        agents[i].updateLimits();
        if(agents[i].updateBase(env.marsBase.collider)){
          env.totalRocks += agents[i].rockStack;
          console.log('The total number of rocks in the station is now: ' + env.totalRocks.toString() + ' rocks.' )
          agents[i].rockStack = 0;
          agents[i].full = false;
        }
        for(x = 0; x < env.rocksColliders.length; x++)
        {
          if(agents[i].updateRock(env.rocksColliders[x])) {
            //Remover el collider y el mesh de la roca en la variable env
            //console.log('The agent got a rock!');
            scene.remove(scene.getObjectByName(env.rocksColliders[x].name));

            if(agents[i].positions.length > 0) {
              if (agents[i].positions[0].x > env.rocksColliders[x].position.x - 10 && agents[i].positions[0].x < env.rocksColliders[x].position.x + 10
                  && agents[i].positions[0].z > env.rocksColliders[x].position.z - 10 && agents[i].positions[0].z < env.rocksColliders[x].position.z + 10) {
                var a;
                for(a = 0; a < agents.length; a++){
                  agents[a].deletePosition(env.rocksColliders[x].position);
                  //agents[a].positions.shift();
                }
                //console.log('se borró una posición');
              }
            }

            env.rocksColliders.splice(x,1);
            env.rocks.splice(x,1);


          }
        }
        for(x = 0; x < env.ufos.length; x++)
        {
          agents[i].updateObstacle(env.ufos[x]);
        }

        for(x = 0; x < agents.length; x++)
        {
          if(x != i){
            agents[i].updateOtherAgent(agents[x].modelAgent.collider);
          }
        }

        for (x = 0; x < agents.length; x++) {
          if (agents[i].isCarrier && agents[i].positions.length > 0 && Math.floor(clock.getElapsedTime()) % 1.5 === 0) {
            agents[i].goForRock(agents[i].positions[0]);
          }
        }

        if(agents[i].full == true && Math.floor(clock.getElapsedTime()) % 5 === 0){
          if(agents[i].modelAgent.position.z > 250){
            agents[i].modelAgent.rotation.y = Math.PI;
          }
          else if(agents[i].modelAgent.position.z < -300){
            agents[i].modelAgent.rotation.y = 0;
          }
          else if(agents[i].modelAgent.position.x > 850){
            agents[i].modelAgent.rotation.y = ((3*Math.PI) / 2);
          }
          else if(agents[i].modelAgent.position.x < -850){
            agents[i].modelAgent.rotation.y = Math.PI / 2;
          }
        }

        if(Math.floor(clock.getElapsedTime()) % 10 === 0 && clock.getElapsedTime() > 1 && agents[i].rotate && agents[i].full == false && agents[i].stop == false && agents[i].positions.length == 0){
          agents[i].rotate = false;
          agents[i].rotateAgent();
        } else if (Math.floor(clock.getElapsedTime()) % 10 === 0 && !agents[i].rotate) {
          agents[i].rotate = false;
        } else {
          agents[i].rotate = true;
        }

      }
    }

  }

};

function loadAgent(a, isCarrier) {
  return new Promise(resolve => {
    const newAgent = new RoverAgent(scene, (-642 + (233 * a)), 25, -250, isCarrier, env.multiagent, env);
    agents.push(newAgent);
    resolve();
  });
}

async function loadAll() {
  var i;
  for(i = 0; i < no_of_agents; i++){
    if (multiagente) {
      if (i < 3) {
        await loadAgent(i, false);
      } else {
        await loadAgent(i, true);
      }
    } else {
      await loadAgent(i,false);
    }
  }
}

loadAll();

animate();
