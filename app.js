import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    antialias: true
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Holographic grid effect
const gridHelper = new THREE.GridHelper(100, 100, 0x00ff00, 0x00ff00);
gridHelper.material.opacity = 0.1;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Floating particles
const particles = new THREE.BufferGeometry();
const particleCount = 1000;
const posArray = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x00ff00
});
const particleMesh = new THREE.Points(particles, particleMaterial);
scene.add(particleMesh);

camera.position.set(0, 2, 5);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    particleMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();