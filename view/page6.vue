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
                        transparent:true,
                    };                
                Object.assign(option,this.size);
                let app = new Application(option);
                pixi.appendChild(app.view);
                this.loadMap(app);
                //console.log("项目图片不便公开，有合适图后替换！")
            },
            loadMap(app){
                let wch = this.size.width/this.size.height;
                let scale = wch>2.1?2000/this.size.height:4200/this.size.width,
                    size = 200/scale,
                    offsetX = wch>2.1? (this.size.width - 4200/scale)/2 : 0,
                    offsetY = wch>2.1? 0 : (this.size.height - 2000/scale)/2;
                console.log(wch,scale);
                for(let i=0;i<210;i++){
                    var sp = new Sprite.from("../resource/assets/map/202009172523997dmh_"+(i+1)+".jpg");
                    sp.width = size;
                    sp.height = size;
                    sp.x = i%21*size + offsetX;
                    sp.y = Math.floor(i/21)*size + offsetY;
                    app.stage.addChild(sp);
                }
            }
        }
    })
}
</script>
</component>