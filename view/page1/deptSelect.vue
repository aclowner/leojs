<component>
    <style>
    .depts, .search-depts{
        height: 460px;
    }
    .dept-search{
        padding: 0 30px 10px 30px;
    }
    .form-dept-sel .tree-item .self{
        padding-right: 30px !important;
    }
    </style>
    <template>
        <div class="form form-dept-sel">
            <div class="dept-search">
                <div class="search"><input type="text" v-model="filter" /></div>
            </div>
            <div class="depts" v-if="filter.length==0"><scroll>
                 <tree :list="trees" @change="treeClick" :value="active.Id"></tree>
            </scroll></div>

            <div class="search-depts" v-if="filter.length>0">
            <scroll>
                <template v-if="listFilter.length>0">
                    <!-- <div class="fl-item" v-for="fl in listFilter">{{fl.Name}}</div> -->
                    <tree-item v-for="item in listFilter" :item="item" :active="active.Id"  @change="treeClick"></tree-item>
                </template>
                <template v-else>
                    <div style="padding-left:30px;line-height:50px;">暂无数据</div>
                </template>
                
            </scroll>
            </div>

            <row class="form-btn"><button class="btn blue" @click="save">确定</button>&nbsp;&nbsp;<button @click="cancle" class="btn" >取消</button></row>   
        </div>
    </template>
    <script>
    function deptSelect(){
        Object.assign(this,{
            name:"dept-select",
            data(){
                return {
                    filter:"",
                    list : NS.Load("../resource/dept.json"),
                    active: {Id:0},
                }
            },
            computed:{
                trees(){
                    console.log(this.list);
                    return this.list.listToTree();
                },
                listFilter(){
                    console.log(this.list);
                    return this.list.filter(o=>o.Name.indexOf(this.filter)>=0);
                }                
            },
            methods:{
                treeClick(item){                    
                    this.active = item;
                },
                close(){
                    this.$parent.close("deptSelect");
                },
                cancle(){
                    this.$parent.confirm("确定取消部门选择吗？",(ot)=>{
                        if(ot=="确定")
                            this.close();
                    });
                },
                save(){                    
                    this.$parent.childPrev({deptSave:{id:this.active.Id,name:this.active.Name}});
                    this.close();
                }
            }
        });
    }
</script>
</component>