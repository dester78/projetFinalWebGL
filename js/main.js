//<reference path="typings/globals/three/index.d.ts" />
if ( WEBGL.isWebGLAvailable() === false ) {

    document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

var renderer, scene, camera;


var spotLight, lightHelper, shadowCameraHelper;

var gui;

var centerThree;

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 65, 8, - 10 );

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.minDistance = 20;
    controls.maxDistance = 500;
    controls.enablePan = false;

    var ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
    scene.add( ambient );

    spotLight = new THREE.SpotLight( 0xffffff, 1 );
    spotLight.position.set( 300, 100, 100 );
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.05;
    spotLight.decay = 2;
    spotLight.distance = 800;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    scene.add( spotLight );

    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );

    var planeGeometry = new THREE.PlaneBufferGeometry( 2000, 2000 );

    var planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
    planeMesh.position.set( 0, - 1, 0 );
    planeMesh.rotation.x = - Math.PI * 0.5;
    planeMesh.receiveShadow = true;
    scene.add( planeMesh );


    var loader = new THREE.GLTFLoader();
    loader.setDRACOLoader( new THREE.DRACOLoader() );
    THREE.DRACOLoader.setDecoderPath( '../../examples/js/libs/draco' )
    
    loader.setPath('models/centerThreeGLTF/');

    loader.load( 'scene.gltf', function ( gltf ) {

        console.log(gltf);
            gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
                console.log(child);
                console.log(child.name);
            }

        } );

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );
    
    // 	scene.add( centerThree.scene );

    // }, undefined, function ( element ) {

    // 	// console.error( element );

    // } );

    window.addEventListener( 'resize', onResize, false );

}




function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {

    renderer.render( scene, camera );

}

function animate() {
    requestAnimationFrame( animate );
    if ( controlsEnabled ) {
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;
        var intersections = raycaster.intersectObjects( objects );
        var isOnObject = intersections.length > 0;
        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        if ( moveForward ) velocity.z -= 400.0 * delta;
        if ( moveBackward ) velocity.z += 400.0 * delta;
        if ( moveLeft ) velocity.x -= 400.0 * delta;
        if ( moveRight ) velocity.x += 400.0 * delta;
        if ( isOnObject === true ) {
            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
        }
        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );
        if ( controls.getObject().position.y < 10 ) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        prevTime = time;
    }
    renderer.render( scene, camera );
}

init();

render();
