export const SYNTHWAVE_CONFIG = {
    gridColor: 0xff2cf8,
    gridOpacity: 0.95,
    terrain: {
        width: 140,
        depth: 160,
        segmentsX: 90,
        segmentsZ: 110,
        flatRadius: 18
    },
    sun: {
        radius: 14,
        position: { x: 0, y: 11, z: -72 },
        brightness: 0.55,
        glowOpacity: 0.1,
        horizonGlowOpacity: 0.05
    },
    camera: {
        lookAt: { x: 0, y: 9, z: -55 },
        zoom: {
            duration: 16,
            from: { x: 0, y: 2.2, z: 8 },
            to: { x: 0, y: 8.5, z: 42 }
        }
    }
};
