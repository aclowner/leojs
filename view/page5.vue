<component>
<style></style>
<template>
    <div class="page flex-column">
        <div class="title flex"><span>{{$route.params.title}}</span></div>
        <div class="con box">
            <webgl></webgl>
        </div>
    </div>
</template>
<script>   
NS.Component(["page5/webgl"]); 
function page5(){
    Object.assign(this,{
        data(){
            return {
                model:"../../resource/fbx/bgs.fbx"
            }
        }
    })
}
</script>
</component>