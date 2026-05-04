import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020812);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.set(0, 45, 70);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
scene.add(ambientLight);

const sunlight = new THREE.PointLight(0xfff0c2, 2.6, 0, 2);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);

const fillLight = new THREE.HemisphereLight(0x7ea8ff, 0x1b2233, 0.28);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0x8fb3ff, 0.5);
rimLight.position.set(-120, 80, -40);
scene.add(rimLight);

// Cinematic accent lights for richer contrast and color separation.
const warmKey = new THREE.SpotLight(0xffb36a, 1.1, 450, Math.PI / 7, 0.45, 1.4);
warmKey.position.set(110, 60, 90);
warmKey.target.position.set(25, 0, 0);
scene.add(warmKey);
scene.add(warmKey.target);

const coolFill = new THREE.SpotLight(0x5da8ff, 0.9, 420, Math.PI / 6, 0.5, 1.1);
coolFill.position.set(-130, 35, -70);
coolFill.target.position.set(-20, 0, 10);
scene.add(coolFill);
scene.add(coolFill.target);

const magentaRim = new THREE.PointLight(0xc97dff, 0.75, 260, 2);
magentaRim.position.set(0, 95, -110);
scene.add(magentaRim);

const cyanRim = new THREE.PointLight(0x66fff5, 0.6, 230, 2);
cyanRim.position.set(-95, -25, 95);
scene.add(cyanRim);

const sunGeometry = new THREE.SphereGeometry(8, 48, 48);
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffc94a,
    emissive: 0xffa31a,
    emissiveIntensity: 1.2,
    roughness: 0.8
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const planetsConfig = [
    { name: "Mercury", radius: 1, distance: 14, color: 0x9e9e9e, orbitSpeed: 0.04, spinSpeed: 0.01 },
    { name: "Venus", radius: 1.6, distance: 20, color: 0xd9a066, orbitSpeed: 0.025, spinSpeed: 0.008 },
    { name: "Earth", radius: 1.7, distance: 28, color: 0x3c82ff, orbitSpeed: 0.018, spinSpeed: 0.03 },
    { name: "Mars", radius: 1.3, distance: 36, color: 0xb34a2f, orbitSpeed: 0.014, spinSpeed: 0.026 },
    { name: "Jupiter", radius: 4.8, distance: 50, color: 0xc99a6b, orbitSpeed: 0.008, spinSpeed: 0.035 },
    { name: "Saturn", radius: 4, distance: 66, color: 0xd6c08e, orbitSpeed: 0.006, spinSpeed: 0.032 },
    { name: "Uranus", radius: 2.8, distance: 80, color: 0x78d3d1, orbitSpeed: 0.004, spinSpeed: 0.028 },
    { name: "Neptune", radius: 2.7, distance: 94, color: 0x4f72ff, orbitSpeed: 0.003, spinSpeed: 0.025 }
];

const planets = planetsConfig.map((config) => {
    const orbit = new THREE.Group();
    scene.add(orbit);

    const geometry = new THREE.SphereGeometry(config.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: 0.9,
        metalness: 0.05
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = config.distance;
    orbit.add(mesh);

    return { ...config, orbit, mesh };
});

const saturn = planets.find((planet) => planet.name === "Saturn");
if (saturn) {
    const ringGeometry = new THREE.RingGeometry(5.2, 7.3, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xa79060,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2.5;
    saturn.mesh.add(ring);
}

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    sun.rotation.y += delta * 0.3;

    for (const planet of planets) {
        planet.orbit.rotation.y += planet.orbitSpeed * delta * 8;
        planet.mesh.rotation.y += planet.spinSpeed * delta * 8;
    }

    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();