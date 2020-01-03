<component>
    <style>
    </style>
    <template>
        <div class="tree-check-item">            
            <div :class="['self',{open:openI&&item.child&&item.child.length>0}]">   
                <div class="tci-l">
                    <a :class="['icon-oc',{open:openI&&item.child&&item.child.length>0}]" v-if="item.child&&item.child.length>0" @click.stop="openI=!openI"></a>  
                    <span>{{item.name}}</span>
                </div>                
                <div class="limits">
                    <button v-for="(btn,bi) in item.limit" class="btn">{{btn}}</button>
                </div>
            </div>
            <div class="tree-child" v-if="item.child" v-show="openI">
                <!-- 有子级递归自己，直到子级结束 -->
                <tree-view-item :item="ici" v-for="ici in item.child"></tree-view-item>
            </div>
        </div>
    </template>
    <script>
    function treeViewItem(){
        Object.assign(this,{
            name:"tree-view-item",
            props:["item"],
            data(){
                return {
                    openI : true,  //子级是否打开
                }
            }
        })
    }
</script>
</component>