import * as THREE from 'three';

export class Set{
    constructor(scene){
        this.scene = scene;
    }

    createAllHelpers(){
        this._createGridHelper();
    }

    createAllMeshes(){
        return this._createCubeMesh();
    }

// helpers

    _createGridHelper(){
        const gridHelper = new THREE.GridHelper(20, 20, 0xFFFFFF, 0xff007f);
        gridHelper.position.y = 0;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.5;
        this.scene.add(gridHelper);
    }

    _createAxesHelper(){

    }

// components

    _createCubeMesh(){
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            roughness: 0.5,
            metalness: 0.5
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        return mesh;
    }
}