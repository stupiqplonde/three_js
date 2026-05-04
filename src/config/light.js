export const LIGHTS_CONFIG = {
    main: {
        type: "directional",
        color: 0xffffff,
        intensity: 1.2,
        position: { x: 5, y: 10, z: 7 },
        castShadow: true,
        shadowMapSize: 1024
    },

    ambient: {
        type: "ambient",
        color: 0xffffff,
        intensity: 0.45
    }
};