<component>
<style>
.pixi{
    height: 100%;
    width: 100%;
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
let {Application,Sprite,Renderer} = PIXI;
function page6(){
    Object.assign(this,{
        data(){
            return {
                id:"pixi",
                size:{width:0,height:0}
            }
        },
        mounted(){
            this.container = this.$refs.pixi;
            this.size.width = this.container.clientWidth;
            this.size.height = this.container.clientHeight;
            let type = "WebGL";
            if(!PIXI.utils.isWebGLSupported())
                type = "canvas";
            PIXI.utils.sayHello(type);
            this.init();
        },
        methods:{
            init(){                
                let pixi = document.getElementById(this.id);
                    option = {
                        antialias:true,
                        backgroundColor:0xffffff
                    };                
                Object.assign(option,this.size);
                let app = new Application(option);
                pixi.appendChild(app.view);
                //this.loadMap(app);
                console.log("项目图片不便公开，有合适图后替换！")
            },
            loadMap(app){
                let mins = Math.min(this.size.width,this.size.height),
                    scale = 8192/mins,
                    size = 512/scale;
                for(let i=0;i<256;i++){
                    var sp = new Sprite.from("../resource/assets/maps/Map_"+i+".jpg");
                    sp.width = size;
                    sp.height = size;
                    sp.x = i%16*size;
                    sp.y = Math.floor(i/16)*size;
                    app.stage.addChild(sp);
                }
            }
        }
    })
}
</script>
</component>