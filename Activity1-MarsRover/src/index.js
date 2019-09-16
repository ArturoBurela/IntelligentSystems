// Import libraries
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock
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
const scene = new Scene();
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
const env = new MarsEnvironment(1, 1, scene);
// Instantiate Agent?
const agent = new RoverAgent(scene);
let random = Math.random();
let rotateRand = Math.random();
let rotate = true;
var x;
// animate the scene
const animate = function() {
  requestAnimationFrame(animate);
  // Call to env animate
  env.animate();
  agent.animate();
  renderer.render(scene, camera);
  if (agent.modelAgent && env.marsBase) {
    agent.moveAgent(random);
    agent.updateLimits();
    if(agent.updateBase(env.marsBase.collider)){
      env.totalRocks += agent.rockStack;
      agent.rockStack = 0;
      agent.full = false;
    }
    for(x = 0; x < env.rocksColliders.length; x++)
    {
      if(agent.updateRock(env.rocksColliders[x])) {
        //Remover el collider y el mesh de la roca en la variable env
        console.log('The agent got a rock!');
        scene.remove(scene.getObjectByName(env.rocksColliders[x].name));
        env.rocksColliders.splice(x,1);
        env.rocks.splice(x,1);
      }
    }
    for(x = 0; x < env.ufos.length; x++)
    {
      agent.updateObstacle(env.ufos[x]);
    }

    if(agent.full == true && Math.floor(clock.getElapsedTime()) % 5 === 0){
      if(agent.modelAgent.position.z > 250){
        agent.modelAgent.rotation.y = Math.PI;
      }
      else if(agent.modelAgent.position.z < -300){
        agent.modelAgent.rotation.y = 0;
      }
      else if(agent.modelAgent.position.x > 850){
        agent.modelAgent.rotation.y = ((3*Math.PI) / 2);
      }
      else if(agent.modelAgent.position.x < -850){
        agent.modelAgent.rotation.y = Math.PI / 2;
      }
    }

    if(Math.floor(clock.getElapsedTime()) % 10 === 0 && clock.getElapsedTime() > 1 && rotate && agent.full == false){
      rotate = false;
      agent.rotateAgent(rotateRand);
      rotateRand = Math.random();
      random = Math.random();
    } else if (Math.floor(clock.getElapsedTime()) % 10 === 0 && !rotate) {
      rotate = false;
    } else {
      rotate = true;
    }
  }
};

animate();
