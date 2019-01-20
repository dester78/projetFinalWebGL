

var camera, scene, renderer;
var objects = [];
var raycaster;





// POINTERLOCK FUNCTIONS
compatibilityControl();
initWindowListener();
initMovementListener();

var ground= new Ground(0,10,-2,400,400,480,960,0xfb8717,0xFF4E50,0xFF4E50,30);
var ocean= new Ocean(0,0,0,1500,1500,90,90,30,0x00aeff,0x0023b9,60,2);
var threeGroup= new Model3DGroup(0,ground.y,0,'models/centerThreeGLTF/','scene.gltf','threes',10);

init();
animate();

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

    //Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    
    ground.initGround();
    ocean.initOcean();
    threeGroup.initModel(ground);

    camera.position.y=ground.y/2;

    scene.add(ground.planeThreeMesh);
    scene.add(ocean.planeThreeMesh);
    
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

    requestAnimationFrame( animate );
    if ( controlsEnabled ) {
        raycaster.ray.origin.copy( controls.getObject().position );//Fixe le raycaster sur la position de la caméra
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

        ocean.animateOcean();

        prevTime = time;
    }
    renderer.render( scene, camera );
}





