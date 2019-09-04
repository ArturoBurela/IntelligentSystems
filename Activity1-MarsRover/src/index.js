// Import libraries
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
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
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new WebGLRenderer({ canvas: canvas, context: context });
const controls = new OrbitControls( camera, renderer.domElement );
// Bind renderer to html
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position
camera.position.z = 500;
camera.position.y = 500;

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

// animate the scene
const animate = function() {
  requestAnimationFrame(animate);
  // Call to env animate
  env.animate();
  renderer.render(scene, camera);
  // console.log(camera.position);
};

animate();
