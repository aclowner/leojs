<component>
<style>
.input-filter{
    position: relative;
}
.filters-list{
    position: absolute;
    top: var(--input-height);
    margin-top: 2px;
    right: 0;
    left: 0;
    height: auto;
    border: var(--input-border);
    background: var(--select-bg);
    z-index: 9;
}
.filters-list>._scroll>._con{
    display: block;
    padding: 2px;
    overflow: hidden;
    max-height: 166px;
}
.filters-list a{
    display: block;
    line-height: 32px;
    margin: 1px 0;
    padding: 0 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.filters-list a:hover{
    background: #f3f3f3;
}
.filters-list a.active{
    color: var(--select-color);
}
.filters-list>._scroll>._bar {
    width: 6px;
}
</style>
<template>
    <div class="input-filter">
        <input type="text" @blur="inputBlur" @focus="listUp=true" v-model="inputVal">
        <div class="filters-list" v-show="flShow" @mousedown="listUp=false" tabindex="101" @blur="flShow=false;"><scroll>
            <a v-for="fi in filters" @click="fiClick(fi)">{{fi.Name}}</a>
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
                flShow:false,
                inputVal:this.value,
                ivWatch:true,  //是否进行inputVal监听 点击选中、父级改值，不触发监听，手动输入触发监听
                listUp:true,   //输入框失去焦点时，下拉框是否收起  用于滚动下拉选择，不收起下拉框
            }
        },
        methods:{
            inputBlur(){
                if(this.listUp)
                    this.flShow = false;
            },
            fiClick(fi){
                this.ivWatch = false;
                this.inputVal = fi.Name;
                this.$emit("fclick",fi);
                this.$emit("update:value",fi.Name)
                this.flShow = false;
            }
        },
        watch:{
            inputVal(nv){
                if(!this.ivWatch){
                    this.ivWatch = true;
                    return;
                }                    
                this.$emit("change",nv);
            },
            filters(nv){
                this.flShow = nv.length>0;
            }
        }
    })
}
</script>
</component>