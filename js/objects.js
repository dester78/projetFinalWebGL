// import { Vector3 } from "three";

///import { Object3D } from "../libs/three";



class PlaneObjects {
    constructor(myX, myY, myZ,myHeight, myPlaneWidth, myPlaneHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess) {
        this._x = myX;
        this._y=myY;
        this._z=myZ;
        this._height=myHeight;
        this._planeWidth=myPlaneWidth;
        this._planeHeight=myPlaneHeight;
        this._widthSegment=myWidthSegment;
        this._heightSegment=myHeightSegment;
        this._specular=mySpecular;
        this._color=myColor;
        this._emissive= myEmissive;
        this._shininess= myShininess;
    }

    get planeThreeMesh(){return this._planeThreeMesh};
    get planeGeometry(){return this._planeGeometry};
    get planeMaterial(){return this._planeMaterial};
    

    get x(){return this._x;}
    get y(){return this._y;}
    get z(){return this._z;}
    get height(){return this._height;}
    get planeWidth(){return this._planeWidth;}
    get planeHeight(){return this._planeHeight}
    get widthSegment(){return this._widthSegment}
    get heightSegment(){return this._heightSegment;}
    get specular(){return this._specular;}
    get color(){return this._color;}
    get emissive(){return this._emissive;}
    get shininess(){return this._shininess;}

    set planeThreeMesh(myThreeMesh){this._planeThreeMesh=myThreeMesh};
    set planeMaterial(myPlaneMaterial){this._planeMaterial=myPlaneMaterial};
    set planeGeometry(myPlaneGeometry){this._planeGeometry=myPlaneGeometry};


    createPlaneGeometry (){
        this.planeGeometry = new THREE.PlaneGeometry(this._planeWidth, this._planeHeight, this._widthSegment, this._heightSegment);     
    }

    createPlaneMaterial(){
        this.planeMaterial = new THREE.MeshPhongMaterial({
            specular: this.specular,         // Specular color of the material (light)
            color: this.color,            // Geometry color in hexadecimal
            emissive: this.emissive,         // Emissive color of the material (dark)
            shininess: this.shininess,              // How shiny the specular highlight is
            flatShading: THREE.FlatShading,
            transparent:false // NoShading, FlatShading or SmoothShading
        }); 
    }
    createPlaneThreeMesh(){
        console.log(this.planeThreeMesh);
        this.planeThreeMesh= new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.planeThreeMesh.receiveShadow=true;
        scene.add(this.planeThreeMesh);

    }
    
    setPosition(){
        this.planeThreeMesh.rotateX( -Math.PI / 2 );
        this.planeThreeMesh.position.set(this.x,this.y,this.z);
    }
  
}

class Ground extends PlaneObjects{

    constructor( myX, myY, myZ,myHeight, myPlaneWidth, myPlaneHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess) {
        super(myX, myY, myZ,myHeight, myPlaneWidth, myPlaneHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess);
    }

    get invisibleMeshGround(){return this._invisibleMeshGround;}
    get groundCircleRadius(){
        return this.planeGeometry.parameters.width/2.5;
    }
    get groundCenter(){   
        return new THREE.Vector3(0,this._height,0) ;
    }


    set invisibleMeshGround(myInvisibleMeshGround){
        this._invisibleMeshGround=myInvisibleMeshGround;
    }

    set snowMeshGround(mySnowMeshGround){
        this._invisibleSnowGround=mySnowMeshGround;
    }

    initGround(){

        this.createPlaneGeometry();
        this.createPlaneMaterial();
        this.setCircularGroundVertices();
        this.createPlaneThreeMesh();
        this.createInvisibleMeshGround();
        this.setPosition();
    }
       
    createInvisibleMeshGround(){
        var geometry = new THREE.CircleGeometry( this.groundCircleRadius, 32 );
        var material = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
        this.invisibleMeshGround = new THREE.Mesh( geometry, material );
        this.invisibleMeshGround.visible=false;
        scene.add( this.invisibleMeshGround );
        this.invisibleMeshGround.rotateX( -Math.PI / 2 );
        // this.invisibleMeshGround.position.y==this.height+this.y;
        this.invisibleMeshGround.position.y=this.height+this.y;
    }

    createSnowMeshGround(){
        var geometry = new THREE.CircleGeometry( this.groundCircleRadius, 32 );
        var material = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
        this.invisibleMeshGround = new THREE.Mesh( geometry, material );
        this.invisibleMeshGround.visible=false;
        scene.add( this.invisibleMeshGround );
        this.invisibleMeshGround.rotateX( -Math.PI / 2 );
        // this.invisibleMeshGround.position.y==this.height+this.y;
        this.invisibleMeshGround.position.y=this.height+this.y;

        
    }

    //Génère aléatoirement des vecteurs pour avoir un terrain avec du relief,
    //si les vecteurs se situes en dehors de la circonférence du cercle de l'ile ils ne sont pas modifiés
    setCircularGroundVertices(){
     
        const center = this.groundCenter;
        const circleRadius=this.groundCircleRadius;
        const height= this.height;
        this.planeGeometry.rotateX( -Math.PI / 2 );
        this.planeGeometry.vertices.map(function (vertex) {

        if(vertex.distanceTo(center)<=circleRadius){
            vertex.x += .5 + Math.random() / 10;
            vertex.y += .5 + Math.random() / 10 + height;
            vertex.z += .5 + Math.random() / 10 ;
        }
        return vertex;
        });

        this.planeGeometry.rotateX( Math.PI / 2 );
        this.planeGeometry.computeFaceNormals();
    }
}

class Ocean extends PlaneObjects{

    constructor( myX, myY, myZ,myHeight, myPlaneWidth, myPlaneHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess,mySeason) {
        super(myX, myY, myZ,myHeight, myPlaneWidth, myPlaneHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess);
        this._season=mySeason;
        this._animationCounter=0;
    }

    get season(){return this._season};
    get animationCounter(){return this._animationCounter};
    set season(mySeason){this._season=mySeason};
    set animationCounter(myAnimationCounter){this._animationCounter=myAnimationCounter};
    

    initOcean(){

        this.createPlaneGeometry();
        this.createPlaneMaterial();
        this.setOceanVertices();
        this.createPlaneThreeMesh();
        this.setPosition();

    }

    setOceanVertices(){

        this.planeGeometry.vertices.map(function (vertex) {
            vertex.x += Math.random() * Math.random() * 30;
            vertex.y += Math.random() * Math.random() * 20;
            return vertex;
        });
    }

    animateOcean(){

        var i = 0;
        for (var ix = 0; ix < this.widthSegment; ix++) {
            for (var iy = 0; iy < this.heightSegment; iy++) {
                this.planeGeometry.vertices[i++].z =
                (Math.sin(ix + this.animationCounter + this.season))+ (Math.cos(iy + this.animationCounter +this.season))+this.y //Permet de régler la force de l'océan
                this.planeGeometry.verticesNeedUpdate = true;
            }
        }
        return this.animationCounter += 0.015*(this.season*this.season);
    }
}


class Model3DGroup{
    constructor(myX, myY, myZ,myScale,myFilePath,myFileName,myName,myNumberOfElement,myDistribution,myDistributionControl,mySeason){
        this._x = myX;
        this._y=myY;
        this._z=myZ;
        this._scale=myScale;
        this._filePath=myFilePath;
        this._fileName=myFileName;
        this._name=myName;
        this._numberOfElement=myNumberOfElement;
        this._distribution=myDistribution;
        this._distributionControl=myDistributionControl;
        this._season=mySeason;
        this._manager=new THREE.LoadingManager();
    }

    get scale(){return this._scale;}
    get x(){return this._x;}
    get y(){return this._y;}
    get z(){return this._z;}
    get filePath(){return this._filePath;}
    get fileName(){return this._fileName;}
    get name(){return this._name;}
    get numberOfElement(){return this._numberOfElement;}
    get manager(){return this._manager;}
    get distribution(){return this._distribution;}
    get distributionControl(){return this._distributionControl}
    get season(){return this._season;}

    get collisionDistance(){
        var box = new THREE.Box3().setFromObject(this.modelGroup.children[0]);
        var boxSize = new THREE.Vector3();
        boxSize=box.getSize(boxSize)
        return (boxSize.x+boxSize.z)/2 
    }


    get modelGroup(){return this._modelGroup;}
    set modelGroup(myModelGroup){this._modelGroup=myModelGroup;}

    initModel(ground){

        var modelGroup=this;
        this.createModelGroup();
        this.loadModel();
        this.manager.onLoad=function(){
            if(modelGroup.scale!=0){
                modelGroup.proportionalScale();
                console.log(modelGroup);
                // modelGroup.modelGroup.position.y+=10
            }
            modelGroup.cloneGroupElements()
            modelGroup.randomizePositionInModelGroup(ground);
        }
    }
    createModelGroup(){
        this.modelGroup=new THREE.Group();
        this.modelGroup.name=this.name;
        this.modelGroup.position.set(this.x,this.y,this.z);
        
        scene.add(this.modelGroup);
    }

    proportionalScale(){

        for(var i = 0; i<this.modelGroup.children.length;i++){
            
            var centralVector= new THREE.Vector3();
            var meshCounter=0
            var meshArray=[]

            this.modelGroup.children[i].traverse(function(child){
                if(child.isMesh){
                    centralVector.add(child.parent.position)
                    meshCounter=meshArray.push(child);
                }
            })

            centralVector.divideScalar(meshCounter)
            for(--meshCounter;meshCounter>=0;meshCounter--){

                var distanceToCenter= centralVector.clone()
                distanceToCenter.add(meshArray[meshCounter].parent.position)

                meshArray[meshCounter].geometry.scale(this.scale,this.scale,this.scale);

                meshArray[meshCounter].parent.position.copy(distanceToCenter.multiplyScalar(this.scale))
                meshArray.pop()  
            }
        }
    }

    loadModel(){   

        var scale=this.scale;
        var modelGroupName=this.name;
        var loader = new THREE.GLTFLoader(this.manager);
        loader.setDRACOLoader( new THREE.DRACOLoader() );
        THREE.DRACOLoader.setDecoderPath( '/libs/draco' );
        loader.setPath(this.filePath);
        loader.load( this.fileName, function ( gltf ) {

            gltf.scene.traverse( function ( child ) {
                 
                if ( child.isMesh ) {
                    
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if(child.name=="visibleFalse"){
                        child.visible=false
                    }
                    console.log(child);
                    console.log(child.name);
                }
            } );

            
            scene.add(gltf.scene);
            var modelGroup=scene.getObjectByName(modelGroupName);
            // var gltfScene=gltf.scene.getObjectByProperty("type","Scene");
            // console.log(scene);
            modelGroup.add(gltf.scene);
            scene.add(modelGroup);
           
        }, 
        undefined, function ( error ) {
            console.error( error );
        } );
        
        return
    }

    randomizePositionInModelGroup(ground){

        
        for(var i = 0 ; i<this.modelGroup.children.length; i ++){

            var collisionBool=true; 
            var sign=i%2==0?1:-1

            while(collisionBool==true){
            
                this.modelGroup.children[i].rotation.y=Math.random()*sign*Math.cos(i*(this.modelGroup.children.length)*180/Math.PI);
                this.modelGroup.children[i].position.x=Math.random()*ground.groundCircleRadius*sign;
                this.modelGroup.children[i].position.z=Math.random()*ground.groundCircleRadius*sign*Math.cos(i*(this.modelGroup.children.length)*180/Math.PI);

                if(this.modelGroup.children[i].position.distanceTo(ground.groundCenter)<ground.groundCircleRadius){
                    collisionBool=false
                }        
            }
        }
    }
   
    cloneGroupElements(){

        for(var i = 1 ; i < this.numberOfElement ; i++){
            this.modelGroup.add(this.modelGroup.children[0].clone());
        }
    }

}

// if(index!=0&&distributionControl==true){
//     
// }
