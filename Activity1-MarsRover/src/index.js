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
const canvas = document.createElement( 'canvas' );
// Try to use WEBGL2, fallback to default context
const context = WEBGL.isWebGL2Available() ? canvas.getContext( 'webgl2', { alpha: false } ) : canvas.getContext();
// Create basic ThreeJS objects: scene, camera, controls and renderer
var scene = new Scene();
scene.agentsLoaded = 0;
var clock = new Clock();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new WebGLRenderer({ canvas: canvas, context: context });
const controls = new OrbitControls( camera, renderer.domElement );
// Bind renderer to html
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position
// camera.position.z = 500;
// camera.position.y = 500;
camera.position.set(9.6,1242.3,-158.76);

// renderer
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
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

// Instantiate Environment
var env = new MarsEnvironment(1, 1, scene);
// Instantiate Agent?
var agents = [];
//const agent = new RoverAgent(scene);
var no_of_agents = 6;
//let rotate = true;
var x;
var i;
// animate the scene
const animate = function() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if(scene.agentsLoaded == no_of_agents) {
    // Call to env animate
    env.animate();

    for(i = 0; i < no_of_agents; i++){
      agents[i].animate();
    }

    if (env.marsBase) {
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
            console.log('The agent got a rock!');
            scene.remove(scene.getObjectByName(env.rocksColliders[x].name));
            env.rocksColliders.splice(x,1);
            env.rocks.splice(x,1);
          }
        }
        for(x = 0; x < env.ufos.length; x++)
        {
          agents[i].updateObstacle(env.ufos[x]);
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

        if(Math.floor(clock.getElapsedTime()) % 10 === 0 && clock.getElapsedTime() > 1 && agents[i].rotate && agents[i].full == false){
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

function loadAgent(a) {
  return new Promise(resolve => {
    const newAgent = new RoverAgent(scene, (-642 + (233 * a)), 25, -250);
    agents.push(newAgent);
    resolve();
  });
}

async function loadAll() {
  var i;
  for(i = 0; i < no_of_agents; i++){
    await loadAgent(i);
  }
}

async function start() {
  await loadAll();

  return;
}

start();

animate();
