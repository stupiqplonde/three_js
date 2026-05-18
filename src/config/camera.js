import { SYNTHWAVE_CONFIG } from './synthwave.js';

export const CAMERA_CONFIG = {
    fov: 60,
    near: 0.1,
    far: 500,
    position: { ...SYNTHWAVE_CONFIG.camera.zoom.from },
    target: { ...SYNTHWAVE_CONFIG.camera.lookAt },

    controls: {
        enableDamping: true,
        dampingFactor: 0.08,
        autoRotate: false,
        enableZoom: true,
        enablePan: false,
        enableRotate: true,
        rotateSpeed: 0.6
    },

    zoom: SYNTHWAVE_CONFIG.camera.zoom
};
