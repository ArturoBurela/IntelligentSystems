// Import libraries
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer
} from 'three';
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

// Create basic ThreeJS objects: scene, camera, controls and renderer
const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );
// Bind renderer to html
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position
camera.position.z = 10;
camera.position.y = 10;
// Instantiate Environment
const env = new MarsEnvironment(1, 1, scene);
// Instantiate Agent?
const agent = new RoverAgent(scene);

// animate the scene
const animate = function() {
  requestAnimationFrame(animate);
  // Call to env animate
  env.animate();
  renderer.render(scene, camera);
};

animate();
