<component>
<style>
.webgl{
    width: 100%;
    height: 100%;
}
</style>
<template>
    <div class="webgl" ref="webgl">            
        
    </div>
</template>
<script>
function webgl(){
    Object.assign(this,{
        props:["models"],
        data(){
            return {
                size:{width:0,height:0}
            }
        },
        mounted(){
            this.container = this.$refs.webgl;
            this.size.width = this.container.clientWidth;
            this.size.height = this.container.clientHeight;

            if ( WEBGL.isWebGLAvailable() === false ) {
                document.body.appendChild( WEBGL.getWebGLErrorMessage());
            }

            this.init();
            this.animate();
        },
        methods:{
            init(){                 
                this.clock = new THREE.Clock();
                this.mixers = [];

                this.camera = new THREE.PerspectiveCamera(45,this.size.width/this.size.height,1,3000);
                this.camera.position.set(0,300,1500);

                this.controls = new THREE.OrbitControls(this.camera);
                this.controls.target.set( 0, 100, 0 );
                this.controls.update();

                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color( 0xa0a0a0  );
                // this.scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

                this.light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
                this.light.position.set( 0, 400, 0 );
                this.scene.add( this.light );

                this.light = new THREE.DirectionalLight( 0xffffff );
                this.light.position.set( 0, 400, 100 );
                this.light.castShadow = true;
                this.light.shadow.camera.top = 180;
                this.light.shadow.camera.bottom = -100;
                this.light.shadow.camera.left = -120;
                this.light.shadow.camera.right = 120;
                this.scene.add( this.light );

                var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
                mesh.rotation.x = - Math.PI / 2;
                mesh.receiveShadow = true;
                this.scene.add( mesh );

                var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
                grid.material.opacity = 0.2;
                grid.material.transparent = true;
                this.scene.add( grid );

                var loader = new THREE.FBXLoader();
                loader.load( '../../resource/fbx/bgs.fbx', ( object )=>{
                    object.mixer = new THREE.AnimationMixer( object );
                    this.mixers.push( object.mixer );

                    var action = object.mixer.clipAction( object.animations[ 0 ] );
                    action.play();

                    object.traverse( ( child )=>{
                        if ( child.isMesh ) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    } );
                    this.scene.add( object );
                });

                this.renderer = new THREE.WebGLRenderer();
                this.renderer.setPixelRatio( window.devicePixelRatio );
                this.renderer.setSize( this.size.width, this.size.height);
                this.renderer.shadowMap.enabled = true;
                this.container.appendChild( this.renderer.domElement);

                this.stats = new Stats();
            },
            animate() {
                requestAnimationFrame( this.animate );
                if ( this.mixers.length > 0 ) {
                    for ( var i = 0; i < this.mixers.length; i ++ ) {
                        this.mixers[ i ].update( this.clock.getDelta() );
                    }
                }
                this.renderer.render( this.scene, this.camera );
                this.stats.update();

            }
        }
    })
}
</script>
</component>