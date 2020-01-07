<component>
<style>
</style>
<template>
    <div class="input-filter">
        <input type="text" @blur="inputBlur" @focus="egTag=''">
        <div class="filters-list" v-if="plShow" @mousedown="egTag='psl'" tabindex="101" @blur="plShow=false;"><scroll>
            <a v-for="fi in filters" @click="fiClick(fi)">{{ps.name}}</a>
        </scroll></div>
    </div>   
</template>
<script>
function inputFilter(){
    Object.assign(this,{
        name:"input-filter",
        props:["value","filters"],
        data(){
            return {
                egTag:"",
                plShow:false,
            }
        },
        methods:{
            inputBlur(){

            },
            fiClick(fi){

            }
        }
    })
}
</script>
</component>