

var camera, scene, renderer;
var geometry, material, mesh;
var objects = [];
var raycaster;





// POINTERLOCK FUNCTIONS
compatibilityControl();
initWindowListener();
initMovementListener();



init();
animate();

var prevTime = performance.now();
var velocity = new THREE.Vector3();
function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
    console.log(camera);

    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );
    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );
   

    const planeGeometry = new THREE.PlaneGeometry(150, 150, 480, 960);


    const planeMaterial = new THREE.MeshPhongMaterial({
    specular: 0xfb8717,         // Specular color of the material (light)
    color: 0xFF4E50,            // Geometry color in hexadecimal
    emissive: 0xFF4E50,         // Emissive color of the material (dark)
    shininess: 30,              // How shiny the specular highlight is
    shading: THREE.FlatShading  // NoShading, FlatShading or SmoothShading
    });
    

    


    planeGeometry.translate( 0, 0, 8 );
    planeGeometry.rotateX( -Math.PI / 2 );//Fait pivoter le planeGeometry pour afficher sa partie visible à plat 
    planeGeometry.computeBoundingBox();
    
    
    //Génère aléatoirement des vecteurs pour avoir un terrain avec du relief, si les vecteurs se situes en dehors de la circonférence du cercle de l'ile ils ne sont pas modifiés
    planeGeometry.vertices.map(function (vertex,index,vertices) {
        const center= new THREE.Vector3;
        if(vertex.distanceTo(planeGeometry.boundingBox.getCenter(center))<=planeGeometry.parameters.width/2){
            vertex.x += .5 + Math.random() / 10;
            vertex.y += .5 + Math.random() / 10;
            vertex.z += .5 + Math.random() / 5;
        }
        
        return vertex;
        });
        console.log(planeGeometry);

        
    

    
    // Update geometry.
    planeGeometry.computeFaceNormals();



    
    
    
 
    
    console.log(planeGeometry.boundingBox.getCenter())

        camera.position=planeGeometry.boundingBox.getCenter()
    
    // Create plane
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    scene.add(plane);
    console.log(plane);

    //Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
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
        prevTime = time;
    }
    renderer.render( scene, camera );
}





