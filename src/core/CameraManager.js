import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CAMERA_CONFIG } from "../config/camera.js";

export class CameraManager {
    constructor(domElement) {
        this.camera = null;
        this.controls = null;
        this.domElement = domElement;
        this.zoomAnimation = null;
        this._lookAt = new THREE.Vector3();
    }

    create() {
        this.camera = new THREE.PerspectiveCamera(
            CAMERA_CONFIG.fov,
            window.innerWidth / window.innerHeight,
            CAMERA_CONFIG.near,
            CAMERA_CONFIG.far
        );

        this.camera.position.set(
            CAMERA_CONFIG.position.x,
            CAMERA_CONFIG.position.y,
            CAMERA_CONFIG.position.z
        );

        this.camera.lookAt(
            CAMERA_CONFIG.target.x,
            CAMERA_CONFIG.target.y,
            CAMERA_CONFIG.target.z
        );

        return this.camera;
    }

    createControls(){
        this.controls = new OrbitControls(this.camera, this.domElement);
        this.controls.target.set(
            CAMERA_CONFIG.target.x,
            CAMERA_CONFIG.target.y,
            CAMERA_CONFIG.target.z
        );
        this.controls.enablePan = CAMERA_CONFIG.controls.enablePan;
        this.controls.enableDamping = CAMERA_CONFIG.controls.enableDamping;
        this.controls.enableZoom = CAMERA_CONFIG.controls.enableZoom;
        this.controls.enableRotate = CAMERA_CONFIG.controls.enableRotate;
        this.controls.autoRotate = CAMERA_CONFIG.controls.autoRotate;
        this.controls.dampingFactor = CAMERA_CONFIG.controls.dampingFactor;
        this.controls.rotateSpeed = CAMERA_CONFIG.controls.rotateSpeed;
        this.controls.update();

        return this.controls;
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    startZoomOut({ from, to, duration, lookAt }) {
        this.zoomAnimation = {
            from: new THREE.Vector3(from.x, from.y, from.z),
            to: new THREE.Vector3(to.x, to.y, to.z),
            duration,
            startTime: performance.now(),
            lookAt: new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z)
        };
        this.camera.position.copy(this.zoomAnimation.from);
        if (this.controls) {
            this.controls.target.copy(this.zoomAnimation.lookAt);
            this.controls.update();
        } else {
            this.camera.lookAt(this.zoomAnimation.lookAt);
        }
    }

    update(){
        if (this.zoomAnimation) {
            const { from, to, duration, startTime } = this.zoomAnimation;
            const t = Math.min(1, (performance.now() - startTime) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            this.camera.position.lerpVectors(from, to, eased);

            if (t >= 1) {
                this.zoomAnimation = null;
            }
        }

        if (this.controls) {
            this.controls.update();
        }
    }

    getCamera() {
        return this.camera;
    }

    getControls(){
        return this.controls;
    }

    handleResize() {
        if (!this.camera) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}