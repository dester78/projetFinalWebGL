
var camera, scene, renderer, isOnObject,season,seasonTransitionCountern;
var objects = [];
var arrModels=[];
var arrControledRandomModel=[];
var raycaster;

//seasonTransitionCounter varie de 1 à 10 et permet de faire des transitions plus douce entre été et hiver
seasonTransitionCounter=0;
season=2;

// POINTERLOCK FUNCTIONS
compatibilityControl();
initWindowListener();
initMovementListener();

//Création des objets de la scène
var ground= new Ground(0,-40,0,40,500,500,480,960,null,0xFF4E50,0xFF4E50,30);
var snowGround= new SnowGround(ground.x,ground.y-0.1,ground.z,ground.height,ground.planeWidth-1,ground.planeHeight-1,ground.widthSegment-1,ground.heightSegment-2,null,0xE4F5F5,0xc9cacf,0);
var ocean= new Ocean(0,ground.y+ground.height*0.80,0,0,1500,1500,90,90,30,0x00aeff,0x0023b9,60,2);
arrModels[1]=new Model3DGroup(0,ground.y+ground.height,0,0,'models/GLTF/trees/leafyTrees/','leafyTree_01.gltf','leafyTrees_01',15,0.5,1);
// var fisherManHouse_01= new Model3DGroup(0,ground.y+ground.height-4,0,0.1,'models/GLTF/buildings/fisherManHouse_01/','fisherManHouse_01.gltf','fisherManHouse_01',1,1);
arrModels[0]= new Model3DGroup(0,ground.y+ground.height-2,0,0.1,'models/GLTF/buildings/fisherManHouse_02/','fisherManHouse_02.gltf','fisherManHouse_02',1,1,-1);
arrModels[2]= new Model3DGroup(0,ground.y+ground.height+1,0,0,'models/GLTF/grasses/lowGrasses/','lowGrass_01.gltf','lowGrasses_01',500,0.1,0);
arrModels[3]= new Model3DGroup(0,ground.y+ground.height-2,0,0.008,'models/GLTF/grasses/highGrasses/','highGrass_01.gltf','highGrasses_01',100,0.1,0);

// arrControledRandomModel.push(leafyTreeGroup_01);


init();
// buildGui();
controlRandomModelPosition();
animate();

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    raycaster = new THREE.Raycaster( new THREE.Vector3(0,0,0), new THREE.Vector3( 0, - 1, 0 ),-10 , 10);
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

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
    snowGround.initGround();
	ocean.initOcean();
	
    //Initialisation de la maison en premier car sa position est fixe et la déterminer aléatoirement est un enfer !!!! 
    arrModels[0].initModel(ground);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	document.body.appendChild( renderer.domElement );
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
    renderer.gammaOutput = true;
    
    snowTimeInition=performance.now();

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

        snowGround.animateSnowGround(ground.planeThreeMesh.position.y);

        prevTime = time;
    }
    renderer.render( scene, camera );
}

window.setInterval(iterateSeasonTransition,1000);

//Fait varier la transition entre été et hiver 
function iterateSeasonTransition(){

    if(season==2&&seasonTransitionCounter<10){
        seasonTransitionCounter+=0.5

    }
    else if(season==1&&seasonTransitionCounter>1){
        seasonTransitionCounter-=0.5
    }
}



