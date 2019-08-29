// Import libraries
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three';
import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';
// Create scene, camera and renderer
const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer();
// Bind renderer to html
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Instantiate a loader
var loader = new GLTFLoader();

loader.load('assets/rover.glb', function(gltf) {
  scene.add(gltf.scene);
}, undefined, function(error) {
  console.error(error);
});

// Cube example for now, replace with env and agent
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({
  color: 0x00ff00
});
const cube = new Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const animate = function() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
