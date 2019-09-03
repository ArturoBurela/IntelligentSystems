// Import libraries
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Stats
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
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new WebGLRenderer({ antialias: true });
const controls = new OrbitControls( camera, renderer.domElement );
// Bind renderer to html
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position
camera.position.z = 10;
camera.position.y = 10;

// renderer
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
// container.appendChild( renderer.domElement );
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;
// controls
controls.maxPolarAngle = Math.PI * 0.4;
controls.minDistance = 10;
// controls.maxDistance = 500;
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
};

animate();
