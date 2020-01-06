<component>
    <style>
    .tree-check-item{
        position: relative;
        --border: solid 1px #b6c2d9;
    }
    .tree-check-item .self{
        padding: 0 30px 0 26px;
        display: flex;        
        position: relative;
    }
    .tree-check-item .icon-oc{
        position: absolute;
        width: 13px;
        height: 13px;
        top: 18px;
        left: 0;
        background: url("../../image/tree-check-open.png");
        z-index: 10;
    }
    .tree-check-item .icon-oc.open{
        background-position: 0 -13px;
    }
    .tree-check-item:before, .tree-check-item:after{
        content: "";
        position: absolute;
    }
    .tree-check-item:before{
        border-left: var(--border);
        top: 0;
        left: 6px;
        bottom: 0;
    }
    .tree-check-item:last-child:before{
        bottom: unset;
        height: 25px;
    }
     .tree-check>.tree-check-item:first-child:before{
        top: 24px;
    }
    .tree-check-item:after{
        border-top: var(--border);
        width: 14px;
        top: 24px;
        left: 7px;
    }
    .tree-check-item .tree-child{
        margin-left: 28px;
    }
    .tree-check-item .self .checkbox{
        margin-right: 9px;
    }
    .self.open:before{
        content: "";
        height: 22px;
        left: 34px;
        top: 35px;
        border-left: var(--border);
        position: absolute;
    }
    .tree-check-item .limits{
        width: 800px;
        margin-left: 120px;
    }
    .tree-check-item .limits .btn{
        margin: 5px 30px 5px 0;
        padding: 0;
    }
    .tree-check-item .limits .btn.checked:after{
        content:"";
        width: 17px;
        height: 17px;
        background: url("../../image/limit-check.png");
        position: absolute;
        right: 0;
        bottom: 0;
    }
    .tree-check-item .tci-l{
        flex: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        height: 40px;
        margin: 5px 0;
    }
    .tree-check-item .tci-l>span{
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    </style>
    <template>
        <div class="_scroll">
            <div class="_con">
                <div class="tree-check">
                    <template v-if="checkbox">
                        <tree-check-item v-for="item in list" :item="item" :open="true" :check="checked"></tree-check-item>
                    </template>
                    <template v-else>
                        <tree-view-item v-for="item in list" :item="item" ></tree-view-item>
                    </template>
                </div>
            </div>
        </div>
    </template>
    <script>
    NS.Component(['treeCheckItem','treeViewItem']);
    function treeCheck(){
        Object.assign(this,{
            name:"tree-check",
            props:{
                "list" : Array,
                "checks" : {default: () => {}},
                "checkbox" : {default:true}
            },
            data(){
                return {
                    checked : Object.assign(this.list.treeToList().map(o=>o.id).toObject(2),this.checks)
                }
            },
            methods:{
            },
            watch:{
                checked:{                    
                    handler(nv,ov){
                        let re = [];
                        for(let key in nv){
                            if(nv[key].length>0)
                                re.push(key+"/"+nv[key].join("-"));
                        }
                        console.log(re.join(","));
                    },
                    deep: true
                },
                checks(nv){
                    console.log(nv);
                    if(this.checkbox)
                        this.checked = Object.assign(this.list.treeToList().map(o=>o.id).toObject(2),nv);
                }
            }
        });
    } 
</script>
</component>