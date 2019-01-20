class Ground {
    constructor(hei, largeur) {
        this.hauteur = hauteur;
        this.largeur = largeur;
    }

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

}