import * as THREE from 'three'

export enum HEXAGON_TYPE {
    GRASSLAND = 'grassland',
    DESERT = 'desert',
    WATER = 'water',
    FOREST = 'forest'
}

export class Hexagon {

    mesh: THREE.Mesh

    constructor(x: number, y: number, type: HEXAGON_TYPE) {
       // create a hexagon shape
        var hexagonGeometry = new THREE.BufferGeometry();
        var hexagonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        var hexagonRadius = 2;

        var hexagonVertices = new Float32Array( [
            0.0, -1.0, 1.7320507764816284,          // levo dol
            0.0, 2.0, 0.0,                          // levo gor
            0.0, 1.0, 1.7320507764816284,           // levo sredina

            0.0, -2.0, 2.4492937051703357e-16,      // desno dol
            0.0, -1.0, -1.7320507764816284,         // desno sredina
            0.0, 1.0, -1.7320507764816284,          // desno gor

            0.0, 1.0, -1.7320507764816284,          // desno gor
            0.0, 2.0, 0.0,                          // levo gor
            0.0, -1.0, 1.7320507764816284,          // levo dol

            0.0, -2.0, 2.4492937051703357e-16,      // desno dol
            0.0, 1.0, -1.7320507764816284,          // desno gor
            0.0, -1.0, 1.7320507764816284,          // levo dol

        ] );

        var hexagonVertices1 = new Float32Array(36);

        let num = 0;
        for (var i = 0; i <= 5; i++) {
            var angle = i * Math.PI / 3;

            hexagonVertices1[num+1] = hexagonRadius * Math.cos(angle)
            hexagonVertices1[num+2] = hexagonRadius * Math.sin(angle)
            hexagonVertices1[num+3] = 0;

            num += 3
        }
        hexagonVertices1[18] = hexagonVertices1[0]
        hexagonVertices1[19] = hexagonVertices1[1]
        hexagonVertices1[20] = hexagonVertices1[2]
        console.log('vert ', hexagonVertices1)

        hexagonGeometry.setAttribute('position', new THREE.BufferAttribute(hexagonVertices, 3));

        this.mesh = new THREE.Mesh(hexagonGeometry, hexagonMaterial);
    }
}