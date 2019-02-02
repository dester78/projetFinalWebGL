
var camera, scene, renderer, isOnObject,season;
var objects = [];
var raycaster;

season=1;

// POINTERLOCK FUNCTIONS
compatibilityControl();
initWindowListener();
initMovementListener();

var ground= new Ground(0,-40,0,40,400,400,480,960,null,0xFF4E50,0xFF4E50,30);
var ocean= new Ocean(0,ground.y+ground.height*0.80,0,0,1500,1500,90,90,30,0x00aeff,0x0023b9,60,2);
var leafyTreeGroup_01= new Model3DGroup(0,ground.y+ground.height,0,0,'models/GLTF/trees/leafyTrees/','leafyTree_01.gltf','leafyTrees_01',20,0.5);
// var fisherManHouse_01= new Model3DGroup(0,ground.y+ground.height-4,0,0.1,'models/GLTF/buildings/fisherManHouse_01/','fisherManHouse_01.gltf','fisherManHouse_01',1,1,season);
var fisherManHouse_02= new Model3DGroup(0,ground.y+ground.height-2,0,0.1,'models/GLTF/buildings/fisherManHouse_02/','fisherManHouse_02.gltf','fisherManHouse_02',1,1,season);
var lowGrasses_01= new Model3DGroup(0,ground.y+ground.height+1,0,0,'models/GLTF/grasses/lowGrasses/','lowGrass_01.gltf','lowGrasses_01',500,0.1,season);
var highGrasses_01= new Model3DGroup(0,ground.y+ground.height-2,0,0.008,'models/GLTF/grasses/highGrasses/','highGrass_01.gltf','highGrasses_01',100,0.1,season);


init();
buildGui();
animate();

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    raycaster = new THREE.Raycaster( new THREE.Vector3(0,0,0), new THREE.Vector3( 0, - 1, 0 ),-10 , 10);
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    // var light = new THREE.HemisphereLight( 0xeeeeff, ground.color, 1 );
    // light.position.set( 0.5, 1, 0.75 );
    // scene.add( light );
	

	var ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
	scene.add( ambient );

	spotLight = new THREE.SpotLight( 0xffffff, 2 );
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
    controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );

	
	controls.getObject().position.y=ground.height+2

    ground.initGround();
	ocean.initOcean();
    // fisherManHouse_01.initModel(ground);
	fisherManHouse_02.initModel(ground);
    
	leafyTreeGroup_01.initModel(ground);
	lowGrasses_01.initModel(ground);
	highGrasses_01.initModel(ground);

	objects.push(ground.invisibleMeshGround);
	

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	document.body.appendChild( renderer.domElement );
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

    window.addEventListener( 'resize', onWindowResize, false );
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
