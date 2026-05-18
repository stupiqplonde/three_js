import * as THREE from 'three';
import { SYNTHWAVE_CONFIG } from '../config/synthwave.js';

function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

function heightAt(x, z) {
    const dist = SYNTHWAVE_CONFIG.camera.zoom.from.z - z;
    if (dist < SYNTHWAVE_CONFIG.terrain.flatRadius) {
        return 0;
    }

    const fade = smoothstep(
        SYNTHWAVE_CONFIG.terrain.flatRadius,
        SYNTHWAVE_CONFIG.terrain.flatRadius + 35,
        dist
    );

    const ridge =
        Math.sin(x * 0.11 + 0.4) * 2.2 +
        Math.sin(x * 0.23 + 1.2) * 1.1 +
        Math.cos(x * 0.07 - z * 0.04) * 1.6;

    const sideHill =
        Math.exp(-Math.pow((x - 22) / 10, 2) - Math.pow((z + 38) / 18, 2)) * 9 +
        Math.exp(-Math.pow((x + 24) / 11, 2) - Math.pow((z + 36) / 17, 2)) * 8;

    const centerPeak =
        Math.exp(-(x * x) / 22 - Math.pow((z + 42) / 11, 2)) * 22;

    return (ridge + sideHill + centerPeak) * fade;
}

const SUN_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SUN_FRAGMENT = /* glsl */ `
uniform float uBrightness;
varying vec2 vUv;

void main() {
    float y = vUv.y;
    vec3 yellow = vec3(1.0, 0.92, 0.25);
    vec3 orange = vec3(1.0, 0.45, 0.12);
    vec3 pink = vec3(1.0, 0.08, 0.45);

    vec3 color = y > 0.5
        ? mix(orange, yellow, (y - 0.5) * 2.0)
        : mix(pink, orange, y * 2.0);

    if (y < 0.52) {
        float t = y / 0.52;
        float freq = mix(6.0, 22.0, t);
        float band = fract(y * freq);
        float stripe = smoothstep(0.08, 0.22, band);
        color = mix(vec3(0.0), color, stripe);
    }

    if (length(vUv - 0.5) > 0.5) discard;

    gl_FragColor = vec4(color * uBrightness, 1.0);
}
`;

export class SynthwaveLandscape {
    constructor(scene) {
        this.scene = scene;
        this.terrain = null;
    }

    build() {
        this._createTerrain();
        this._createSun();
        this._createSunGlow();
        this._createHorizonGlow();
    }

    _createTerrain() {
        const { width, depth, segmentsX, segmentsZ } = SYNTHWAVE_CONFIG.terrain;
        const vertices = [];
        const halfW = width * 0.5;
        const zNear = 4;
        const zFar = -depth * 0.75;

        for (let iz = 0; iz <= segmentsZ; iz++) {
            const z = THREE.MathUtils.lerp(zNear, zFar, iz / segmentsZ);
            for (let ix = 0; ix < segmentsX; ix++) {
                const x1 = THREE.MathUtils.lerp(-halfW, halfW, ix / segmentsX);
                const x2 = THREE.MathUtils.lerp(-halfW, halfW, (ix + 1) / segmentsX);
                vertices.push(
                    x1, heightAt(x1, z), z,
                    x2, heightAt(x2, z), z
                );
            }
        }

        for (let ix = 0; ix <= segmentsX; ix++) {
            const x = THREE.MathUtils.lerp(-halfW, halfW, ix / segmentsX);
            for (let iz = 0; iz < segmentsZ; iz++) {
                const z1 = THREE.MathUtils.lerp(zNear, zFar, iz / segmentsZ);
                const z2 = THREE.MathUtils.lerp(zNear, zFar, (iz + 1) / segmentsZ);
                vertices.push(
                    x, heightAt(x, z1), z1,
                    x, heightAt(x, z2), z2
                );
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(vertices, 3)
        );

        const material = new THREE.LineBasicMaterial({
            color: SYNTHWAVE_CONFIG.gridColor,
            transparent: true,
            opacity: SYNTHWAVE_CONFIG.gridOpacity
        });

        this.terrain = new THREE.LineSegments(geometry, material);
        this.scene.add(this.terrain);
    }

    _createSun() {
        const { radius, position } = SYNTHWAVE_CONFIG.sun;
        const geometry = new THREE.CircleGeometry(radius, 64);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uBrightness: { value: SYNTHWAVE_CONFIG.sun.brightness }
            },
            vertexShader: SUN_VERTEX,
            fragmentShader: SUN_FRAGMENT,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const sun = new THREE.Mesh(geometry, material);
        sun.position.set(position.x, position.y, position.z);
        this.scene.add(sun);
        this.sun = sun;
    }

    _createSunGlow() {
        const { radius, position } = SYNTHWAVE_CONFIG.sun;
        const geometry = new THREE.CircleGeometry(radius * 1.35, 64);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff3a9a,
            transparent: true,
            opacity: SYNTHWAVE_CONFIG.sun.glowOpacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const glow = new THREE.Mesh(geometry, material);
        glow.position.set(position.x, position.y, position.z - 0.5);
        this.scene.add(glow);
    }

    _createHorizonGlow() {
        const geometry = new THREE.PlaneGeometry(120, 30);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff2a88,
            transparent: true,
            opacity: SYNTHWAVE_CONFIG.sun.horizonGlowOpacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const glow = new THREE.Mesh(geometry, material);
        glow.position.set(0, 8, -68);
        this.scene.add(glow);
    }
}
