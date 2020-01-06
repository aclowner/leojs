<component>
    <style>
    
    </style>
    <template>
        <div class="tree-check-item">            
            <div :class="['self',{open:openI&&item.child&&item.child.length>0}]">   
                <div class="tci-l">
                    <a :class="['icon-oc',{open:openI&&item.child&&item.child.length>0}]" v-if="item.child&&item.child.length>0" @click.stop="openI=!openI"></a>             
                    <a :class="['checkbox',cbCed]" @click="checkClick"></a>
                    <span>{{item.name}}</span>
                </div>                
                <div class="limits">
                    <button v-for="(btn,bi) in item.limit" :class="['btn',{checked:btnCed.indexOf(bi)>=0}]" @click="btnClick(bi)">{{btn}}</button>
                </div>
            </div>
            <div class="tree-child" v-if="item.child" v-show="openI">
                <!-- 有子级递归自己，直到子级结束 -->
                <tree-check-item :item="ici" v-for="ici in item.child" :check="check" ref="childItem" :ccks="childCks">
                </tree-check-item>
            </div>
        </div>
    </template>
    <script>
    //选择状态最小单位是button，故所有选择直接或间接作用于button，当前项checkbox的选择状态关联与 button和子级的checkbox状态
    //事件的监听与数据传输 由里向外 由层级最深的button向最外层的checkbox 
    function treeCheckItem(){
        Object.assign(this,{
            name : "tree-check-item",
            props: ["item","open","check","ccks"],
            data(){
                return {
                    openI : this.open,  //子级是否打开
                    limit : this.check[this.item.id] || [],  //当前项的button数组
                    childCks : this.item.child ? this.item.child.map(o=>o.id).toObject() : null,  //子级的选择状态，只针对于有子级的项，该值用于判断当前checkbox的选择状态
                }
            },            
            computed:{
                btnCed(){             
                    //console.log(this.check);
                    return this.check[this.item.id] || [];
                },
                cbCed(){   //checkbox选中状态  ""  "in"  "checked"
                    let cck = "checked",
                        bck = "checked";
                    if(this.item.limit)  //获取button全选状态
                        bck =  this.btnCed.length==0 ? "" : (this.btnCed.length==this.item.limit.length ? "checked": "in");
                    if(this.childCks){   //获取子级全选状态
                        let vals = Object.values(this.childCks);
                            cedl = vals.filter(o=>o=="checked").length;
                            cnulls = vals.filter(o=>o=="").length;
                        cck = cnulls==this.item.child.length ? "" : (cedl==this.item.child.length? "checked" : "in");
                    }
                    if(this.item.limit&&this.childCks)   //既有button选项，又有子级，同时判断button状态和子级状态
                        return cck=="" && bck == "" ? "" : (cck=="checked"&&bck=="checked"?"checked":"in");
                    else if(this.item.limit&&!this.childCks)  //只有button，没有子级，直接使用button状态
                        return bck; 
                    else   //只有子级，没有button，直接使用子级状态
                        return cck;
                }
            },
            methods:{
                btnClick(i){             //button按钮点击事件
                    let lindex = this.limit.indexOf(i);
                    if(lindex<0){   //增加选择  勾选非第一个权限，自动添加第一权限
                        this.limit.push(i);
                        if(this.limit.indexOf(0)<0)
                            this.limit.push(0);
                    }                        
                    else{           //删除选择  删除第一权限，则清空全部权限
                        if(i==0)
                            this.limit = [];
                        else
                            this.limit.splice(lindex,1);
                    }           
                    
                },
                checkClick(){            //checkbox点击事件     
                    //获取是checked还是取消选择     
                    let state = this.cbCed == "checked" ? false : true;                    
                    this.inChecked(state);                    
                },
                inChecked(state){
                    //当前项有button权限，对button进行全选或取消勾选，没有button选项，不做处理
                    if(this.item.limit&&this.item.limit.length>0){
                        if(state)  //全选
                            this.limit = this.item.limit.map((o,i)=>i);
                        else      //清空选择
                            this.limit = [];
                    }                 
                    
                    //获取子级组件，返回值位数组                    
                    let child = this.$refs.childItem;                    
                    //如果有子级，对子级进行循环
                    if(child){
                        for(let i=0;i<child.length;i++){
                            //子级每一项进行迭代，执行相同操作，直到子级结束
                            child[i].inChecked(state);
                        }
                    }                        
                },
            },
            watch:{
                // check(nv,ov){
                //     console.log(nv);
                // },
                // btnCed(nv,ov){
                //     console.log(nv);
                // },
                cbCed:{
                    //监听当前项checkbox勾选状态，并实时通知父级,用于父级判断当前checkbox选择状态
                    immediate:true,
                    handler(nv){
                        if(this.ccks)
                           this.ccks[this.item.id] = nv;
                    }
                   
                },
                limit(nv){
                    //this.check 为全程选中对象记录，对象类型，监听当前项选择状态更改，进而修改全程选中对象记录
                    //该数据可直接作为最后结果输出
                    this.check[this.item.id] = nv;
                }
            }
        })
    }
</script>
</component>