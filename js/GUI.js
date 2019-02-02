var gui;

function buildGui() {

    gui = new dat.GUI();

    var params = {
        'light color': spotLight.color.getHex(),
        intensity: spotLight.intensity,
        distance: spotLight.distance,
        angle: spotLight.angle,
        penumbra: spotLight.penumbra,
        decay: spotLight.decay,
        season:season

        
    }

    gui.addColor( params, 'light color' ).onChange( function ( val ) {

        spotLight.color.setHex( val );
        render();

    } );

    gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {

        spotLight.intensity = val;
        render();

    } );

    
    gui.add( params, 'season', 1, 2,1 ).onChange( function ( val ) {

        level = val;
        
        scene.remove(sierpinskiObj);

        sierpinskiObj = sierpinski(level,100);
        sierpinskiObj.name="pyramid";
        scene.add(sierpinskiObj);
        
        render();
    } );



    gui.add( params, 'distance', 50, 800 ).onChange( function ( val ) {


        spotLight.distance = val;
        render();

    } );

    gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {

        spotLight.angle = val;
        render();

    } );

    gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {

        spotLight.penumbra = val;
        render();

    } );

    gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {

        spotLight.decay = val;
        render();

    } );

    gui.open();

}
