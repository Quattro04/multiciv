import * as THREE from 'three'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { map } from './map';
import { Object3D } from 'three';

const scene = new THREE.Scene()

// ADD CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, -5, 5);
camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement)

// ADD CONTROLS
// const controls = new OrbitControls(camera, renderer.domElement);
const userControls = true;

// ADD AXIS HELPER
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// ADD POINT LIGHT
// const light = new THREE.PointLight(0xffffff, 1, 100);
// light.position.set(0, -5, 5);
// // light.castShadow = true;
// // light.shadow.mapSize.width = 1024;
// // light.shadow.mapSize.height = 1024;
// // light.shadow.camera.near = 0.5;
// // light.shadow.camera.far = 500;
// // light.shadow.bias=0.02
// scene.add(light)

// const pointLightHelper = new THREE.PointLightHelper( light, 1 );
// scene.add( pointLightHelper );

// ADD AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight( 0x404040 );
scene.add(ambientLight);

// ADD DIRECTIONAL LIGHT
// const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
// light.position.set(0, 0, 20);

// light.target.position.set(0, 0, 0); // position the light to look at the center of the scene
// light.lookAt(light.target.position);

// // light.lookAt(0,0,0);

// light.shadow.mapSize.width = 512; // default
// light.shadow.mapSize.height = 512; // default
// light.shadow.camera.near = 0.5; // default
// light.shadow.camera.far = 500; // default


const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(0, -10, 10);
sun.position.set(0, -10, 10);
sun.castShadow = true;

scene.add(sun);


// directionalLight.lookAt(0,0,0)
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.near = 0.5;
// directionalLight.shadow.camera.far = 500;
// scene.add(light);

// const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
// scene.add( helper );

// const helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
// const cube = new THREE.Mesh( geometry, material );
// cube.position.set(2,-4,0)
// cube.castShadow = true;
// scene.add( cube );

// Load all 3 hexagon objects and populate "objects"
const objects: Record<string, THREE.Object3D> = {};
let tent: THREE.Object3D;
var loader = new GLTFLoader();
loader.load('water-hex.glb', gltf => {
    onModelLoad(gltf, 'water')
});
loader.load('grassland-hex.glb', gltf => {
    onModelLoad(gltf, 'grassland')
});
loader.load('desert-hex.glb', gltf => {
    onModelLoad(gltf, 'desert')
});
loader.load('scene.gltf', gltf => {

    gltf.scene.traverse(function (child) {
        let childMesh: THREE.Mesh = child as THREE.Mesh;
        if (childMesh.isMesh) {
            childMesh.castShadow = true
            childMesh.receiveShadow = true
            childMesh.material = new THREE.MeshLambertMaterial( {color: 0xff0000} );
        }
    })

    let sc = gltf.scene
    sc.scale.set(0.3,0.3,0.3)
    sc.rotation.set(Math.PI/2,0,0)
    sc.position.set(3,-3,-0.2)

    // sc.castShadow = true;

    scene.add(sc);
});

const onModelLoad = (gltf: GLTF, type: string) => {

    // gltf.scene.traverse(function (child) {
    //     let childMesh: THREE.Mesh = child as THREE.Mesh;
    //     if (childMesh.isMesh) {
    //         child.castShadow = true
    //         child.receiveShadow = true
    //     }
    // })

    let m: THREE.Mesh = gltf.scene.children[0] as THREE.Mesh;
    let hexMesh = new THREE.Mesh(m.geometry, m.material) as Object3D;

    hexMesh.receiveShadow = true;
    hexMesh.rotation.set(-Math.PI/2, 0, 0);
    objects[type] = hexMesh

    //Check if all models loaded
    if (Object.keys(objects).length === 3) {
        const edge = new THREE.EdgesGeometry(m.geometry);
        const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        const edges = new THREE.LineSegments(edge, material);
        edges.rotation.set(-Math.PI/2, 0, 0);
        objects['edge'] = edges;
        buildMap();
    }
}

const xOneUnit = 1.73;
const yOneUnit = 1.5;
const buildMap = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            let hexagon = objects.grassland.clone();
            if (map[i][j].type === 'WAT') {
                hexagon = objects.water.clone();
            } else if (map[i][j].type === 'DST') {
                hexagon = objects.desert.clone();
            }
            let edgeCopy = objects.edge.clone();
            if (i % 2 === 0) {
                hexagon.position.set((xOneUnit / 2)  + (j * xOneUnit), i * -yOneUnit, -0.25);
                edgeCopy.position.set((xOneUnit / 2)  + (j * xOneUnit), i * -yOneUnit, -0.25);
            } else {
                hexagon.position.set(j * xOneUnit, i * -yOneUnit, -0.25);
                edgeCopy.position.set(j * xOneUnit, i * -yOneUnit, -0.25);
            }
            
            hexagon.receiveShadow = true;
            
            scene.add(hexagon);
            scene.add(edgeCopy);
        }
    }
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
window.addEventListener('resize', onWindowResize, false);

let xMouseClick = 0;
let yMouseClick = 0;
let enablePan = false;
const onMouseDown = (event: MouseEvent) => {
    if (event.button === 0 && userControls) {
        enablePan = true;
        xMouseClick = event.x;
        yMouseClick = event.y;
    }
}
const onMouseUp = (event: MouseEvent) => {
    if (event.button === 0 && userControls) {
        enablePan = false;
        xCameraPosition = xCameraPosition + xCameraDiff;
        yCameraPosition = yCameraPosition + yCameraDiff;
    }
}
let xCameraDiff = 0;
let yCameraDiff = 0;
const onMouseMove = (event: MouseEvent) => {
    if (enablePan) {
        xCameraDiff = (xMouseClick - event.x) / 150;
        yCameraDiff = (yMouseClick - event.y) / -150;
    }
}
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);

const render = () => {
    renderer.render(scene, camera)
}

let xCameraPosition = camera.position.x;
let yCameraPosition = camera.position.y;
let zCameraPosition = camera.position.z;

const animate = () => {
    requestAnimationFrame(animate)

    if (enablePan) {
        camera.position.set(xCameraPosition + xCameraDiff, yCameraPosition + yCameraDiff, zCameraPosition)
    }

    // controls.update()
    render()
}

animate();
