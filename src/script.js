import * as THREE from 'three';

import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

const gui = new dat.GUI()

let camera, controls, scene, renderer, effect;

let sphere, plane;

const start = Date.now();

let mixer = null

init();
animate();



function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    //75, sizes.width / sizes.height, 0.1, 100
    camera.position.x = -30;
    camera.position.y = 0;
    camera.position.z = 300;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0, 0, 0 );

    const pointLight1 = new THREE.PointLight( 0xffffff, 0.1, 0, 0 );
    pointLight1.position.set( 500, 500, 500 );
    scene.add( pointLight1 );

    const pointLight2 = new THREE.PointLight( 0xffffff, 1, 0, 0 );
    pointLight2.position.set( - 500, - 500, - 500 );
    scene.add( pointLight2 );

    const gltfLoader = new GLTFLoader()
    
    
    
    gltfLoader.load(
        '/models/twerk_v1.gltf',
        (gltf) =>
        {
    
         mixer = new THREE.AnimationMixer(gltf.scene)
         const action = mixer.clipAction(gltf.animations[0])
    
         action.play()
        
         gltf.scene.scale.set(2, 2, 2)
         gltf.scene.position.set(0,-300,0)
         scene.add(gltf.scene)
        },
        () =>
        {
            console.log('progress')
        },
        () =>
        {
            console.log('error')
        },
    )


    sphere = new THREE.Mesh( new THREE.SphereGeometry( 200, 20, 10 ), new THREE.MeshPhongMaterial( { flatShading: true } ) );
    // scene.add( sphere );

    // Plane

    plane = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
    plane.position.y = - 200;
    plane.rotation.x = - Math.PI / 2;
    // scene.add( plane );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    effect = new AsciiEffect( renderer, ' .:-+*=%@#', { invert: true } );
    effect.setSize( window.innerWidth, window.innerHeight );
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'blue';

    // Special case: append effect.domElement, instead of renderer.domElement.
    // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

    document.body.appendChild( effect.domElement );

    controls = new TrackballControls( camera, effect.domElement );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    const timer = Date.now() - start;

    // Update mixer
    if ( mixer !== null )
    {
        mixer.update(timer * 0.00001)
    }


    controls.update();

    effect.render( scene, camera );

}

// const tick = () =>
// {
//     const elapsedTime = clock.getElapsedTime()
//     const deltaTime = elapsedTime - previousTime
//     previousTime = elapsedTime

//     // Update mixer
//     if ( mixer !== null )
//     {
//         mixer.update(deltaTime)
//     }

//     // Update controls
//     controls.update()

//     // Render
//     effect.render( scene, camera );

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }