///import { Object3D } from "../libs/three";


class PlaneObjects {
    constructor( myX, myY, myZ, myWidth, myHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess) {
        this._x = myX;
        this._y=myY;
        this._z=myZ;
        this._width=myWidth;
        this._height=myHeight;
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
    get width(){return this._width;}
    get height(){return this._height}
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
        this.planeGeometry = new THREE.PlaneGeometry(this.width, this._height, this._widthSegment, this._heightSegment);    
        this.planeGeometry.translate( this.x, this.y, this.z );    

    }

    createPlaneMaterial(){
        this.planeMaterial = new THREE.MeshPhongMaterial({
            specular: this.specular,         // Specular color of the material (light)
            color: this.color,            // Geometry color in hexadecimal
            emissive: this.emissive,         // Emissive color of the material (dark)
            shininess: this.shininess,              // How shiny the specular highlight is
            flatShading: THREE.FlatShading, 
            transparent:true // NoShading, FlatShading or SmoothShading
        }); 
    }

    

    createPlaneThreeMesh(){
        console.log(this.planeThreeMesh);
        this.planeThreeMesh= new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    }
    
    setPosition(){
        this.planeThreeMesh.rotateX( -Math.PI / 2 );
    }
  
}

class Ground extends PlaneObjects{

    constructor( myX, myY, myZ, myWidth, myHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess) {
        super(myX, myY, myZ, myWidth, myHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess);
    }

    initGround(){

        this.createPlaneGeometry();
        this.createPlaneMaterial();
        this.setCircularGroundVertices();
        this.createPlaneThreeMesh();
        this.setPosition();

    }
        get groundCircleRadius(){
            return this.planeGeometry.parameters.width/2.1;
        }
        get groundCenter(){
            return this.planeGeometry.boundingBox.getCenter(new THREE.Vector3()) ;
        }


    //Génère aléatoirement des vecteurs pour avoir un terrain avec du relief, si les vecteurs se situes en dehors de la circonférence du cercle de l'ile ils ne sont pas modifiés
    setCircularGroundVertices(){

        this.planeGeometry.computeBoundingBox();

        const tmpVector= new THREE.Vector3;
        const center = this.groundCenter;
        const circleRadius=this.groundCircleRadius;
        const height= this.y;
        this.planeGeometry.vertices.map(function (vertex) {

        if(vertex.distanceTo(center)<=circleRadius){
            vertex.x += .5 + Math.random() / 10;
            vertex.y += .5 + Math.random() / 10;
            vertex.z = .5 + Math.random() / 4 + height;
        }
        return vertex;
        });

        this.planeGeometry.computeFaceNormals();
    }
}

class Ocean extends PlaneObjects{

    constructor( myX, myY, myZ, myWidth, myHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess,myWeather) {
        super(myX, myY, myZ, myWidth, myHeight, myWidthSegment, myHeightSegment,mySpecular, myColor,myEmissive,myShininess);
        this._weather=myWeather;
        this._animationCounter=0;
    }

    get weather(){return this._weather};
    get animationCounter(){return this._animationCounter};
    set weather(myWeather){this._weather=myWeather};
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
                Math.sin((ix + this.animationCounter) * this.weather + this.weather*2) + Math.cos((iy + this.animationCounter) * this.weather + this.weather*2);//Permet de régler la force de l'océan
                this.planeGeometry.verticesNeedUpdate = true;
            }
        }
        return this.animationCounter += 0.015;
    }
}


class Model3DGroup{
    constructor(myX, myY, myZ,myFilePath,myFileName,myName,myNumberOfElement,myDistribution){
        this._x = myX;
        this._y=myY;
        this._z=myZ;
        this._filePath=myFilePath;
        this._fileName=myFileName;
        this._name=myName;
        this._numberOfElement=myNumberOfElement;
        this._distribution=myDistribution;
        this._manager=new THREE.LoadingManager();
    }

    get x(){return this._x;}
    get y(){return this._y;}
    get z(){return this._z;}
    get filePath(){return this._filePath;}
    get fileName(){return this._fileName;}
    get name(){return this._name;}
    get numberOfElement(){return this._numberOfElement;}
    get manager(){return this._manager;}


    get modelGroup(){return this._modelGroup;}
    set modelGroup(myModelGroup){this._modelGroup=myModelGroup;}

    initModel(ground){
        var modelGroup=this;
        this.createModelGroup();
        this.loadModel();
        this.manager.onLoad=function(){
            console.log(modelGroup);
            modelGroup.cloneGroupElements()
            modelGroup.randomizeElementPosition(ground);
        }
        // this.cloneGroupElements()
        // this.randomizeElementPosition();

    }
    createModelGroup(){
        this.modelGroup=new THREE.Group();
        this.modelGroup.name=this.name;
        this.modelGroup.translateY(this.y);
        scene.add(this.modelGroup);
    }

    loadModel(){   

        var modelGroupName=this.name;
        var loader = new THREE.GLTFLoader(this.manager);

        loader.setDRACOLoader( new THREE.DRACOLoader() );
        THREE.DRACOLoader.setDecoderPath( 'libs/draco' )

        loader.setPath(this.filePath);
        loader.load( this.fileName, function ( gltf ) {

            gltf.scene.traverse( function ( child ) {
                 
                if ( child.isMesh ) {

                    child.material.visible=true;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

            } );
            
            var modelGroup=scene.getObjectByName(modelGroupName);
            var obj=gltf.scene.getObjectByProperty("type","Object3D");
            modelGroup.add(obj);
           
        }, 
        undefined, function ( error ) {
            console.error( error );
        } );
        
        return
    }

    randomizeElementPosition(ground){

        // this.modelGroup.traverse(function(child){
        //     console.log(child);
        // })
        // console.log(this.modelGroup.children[0]);
        var box = new THREE.Box3().setFromObject(this.modelGroup.children[0]);
        this.modelGroup.children.map(function(element,index,arrElement){
            var collisionBool=true;
            while(collisionBool==true){
                element.position.x=0;
                element.position.y=0;
                element.position.x+=Math.random()*ground.groundCircleRadius;
                element.position.x*= Math.floor(Math.random()*2) == 1 ? 1 : -1;
                element.position.z+=Math.random()*ground.groundCircleRadius;
                element.position.z*= Math.floor(Math.random()*2) == 1 ? 1 : -1;
                console.log(element.position.distanceTo(ground.groundCenter));
                console.log(ground.groundCircleRadius);
                if(element.position.distanceTo(ground.groundCenter)<ground.groundCircleRadius){
                    console.log(ground);
                    collisionBool=false;

                }
            }
        })

    }
    
    cloneGroupElements(){

        for(var i = 0 ; i < this.numberOfElement ; i++){
            this.modelGroup.add(this.modelGroup.children[0].clone());
        }
    }

}