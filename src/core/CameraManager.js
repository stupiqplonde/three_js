import * as THREE from "three";
import { CAMERA_CONFIG } from "../config/camera.js";

export class CameraManager {
    constructor() {
        this.camera = null;
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

    getCamera() {
        return this.camera;
    }

    handleResize() {
        if (!this.camera) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}