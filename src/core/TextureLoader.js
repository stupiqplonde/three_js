import * as THREE from 'three';
import { TEXTURES_CONFIG } from '../config/texture.js';
import { texture } from 'three/tsl';

export class TextureLoader {
    constructor(){
        this.texture_loader = new THREE.TextureLoader();
    }

    load (url_name) {
        const url = TEXTURES_CONFIG.url.grass.albedo;
        const texture = this.texture_loader.load(
            url, 
            (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;     
        });
        return texture;
    }

    load_maps( url_name ){
        const url_ao = TEXTURES_CONFIG.url.grass.ao;
    }
    
}