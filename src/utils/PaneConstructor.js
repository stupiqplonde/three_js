import * as THREE from 'three';
import {Pane} from 'tweakpane'

export class PaneConstructor{
    constructor(scene){
        this.pane = new Pane();
        this.scene = scene;
    }

    addAllPanels(){
        this.addPositionPane();
    }

    addPositionPane(){
        const geometry = new THREE.ConeGeometry( 5, 20, 32 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const cone = new THREE.Mesh(geometry, material );
        this.scene.add( cone );
        this.pane.addBinding(cone.position, 'x', {
            min: -5,
            max: 5,
            step: 0.1
        })
        this.pane.addBinding(cone.position, 'y', {
            min: -10,
            max: 10,
            step: 0.1
        })
        this.pane.addBinding(cone.position, 'z', {
            min: -5,
            max: 5,
            step: 0.1
        })
    }
}