<component>
<style>
.pixi{
    height: 100%;
    width: 100%;
    background-image: linear-gradient(to top right,#ebe6d3, #ece7d4);
}
</style>
<template>
    <div class="page flex-column">
        <div class="title flex"><span>{{$route.params.title}}</span></div>
        <div class="con box">
            <div class="pixi" ref="pixi" id="pixi">

            </div>
        </div>
    </div>
</template>
<script>
let SmartMap = NS.Import("../script/pixi/SmartMap");
let {Application,Sprite,Renderer,Container} = PIXI;
function page6(){
    Object.assign(this,{
        data(){
            return {
                id:"pixi",
                opations:{width:0,height:0}
            }
        },
        mounted(){
            this.container = this.$refs.pixi;
            this.opations.width = this.container.clientWidth;
            this.opations.height = this.container.clientHeight;
            let type = "WebGL";
            if(!PIXI.utils.isWebGLSupported())
                type = "canvas";
            PIXI.utils.sayHello(type);
            this.init();
        },
        methods:{
            init(){                
                this.opations.div = document.getElementById(this.id);

                map = new SmartMap(this.opations)
                
                this.loadMap(map);
                
            },
            loadMap(){
                let container = new Container();
                let wch = this.opations.width/this.opations.height;
                let scale = wch>2.1?2000/this.opations.height:4200/this.opations.width,
                    size = 200/scale,
                    offsetX = wch>2.1? (this.opations.width - 4200/scale)/2 : 0,
                    offsetY = wch>2.1? 0 : (this.opations.height - 2000/scale)/2;
                
                for(let i=0;i<210;i++){
                    var sp = new Sprite.from("../resource/assets/map/202009172523997dmh_"+(i+1)+".jpg");
                    sp.width = size;
                    sp.height = size;
                    sp.x = i%21*size + offsetX;
                    sp.y = Math.floor(i/21)*size + offsetY;
                    container.addChild(sp);
                }
                map.scene.addChild(container);
            }
        }
    })
}
</script>
</component>