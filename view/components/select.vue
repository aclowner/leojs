<component>
    <style>
    .sel-input{
        position: relative;
        height: var(--input-height);
    }
    .sel-list{
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
    .sel-list>._con{
        display: block;
        padding: 2px;
        overflow: hidden;
        max-height: 166px;
    }
    .sel-list li{
        display: block;
        line-height: 30px;
        margin: 1px 0;
        padding: 0 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .sel-input:before{
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 32px;
        border-left: var(--input-border);
    }
    .sel-input.name-input:before{
        border-left: var(--name-input-border);
    }
    .sel-input.select input{
        padding-right: 40px;
    }
    .sel-input.select:after{
        content: "";
        position: absolute;
    }
    .sel-input.select:after{
        color: var(--input-border-color);
        border-top: solid 5px;
        border-left: solid 6px transparent;
        border-right: solid 6px transparent;
        right: 16px;
        top: 50%;
        transform: translate(50%,-50%);
    }
    .select>.sel-list li:hover{
        background: #f3f3f3;
    }
    .select>.sel-list li.active{
        color: var(--select-color);
    }
    .select ._scroll ._bar {
        width: 6px;
    }
    </style>
    <template>
        <div :class="['sel-input','select',{'name-input':name}]">
            <span v-if="name">{{name}}</span>
            <input type="text" :value="text" @focus="inputFocus" @blur="inputBlur" @mousedown="inputMD" :placeholder="placeholder"/>
            <div class="sel-list _scroll" v-show="show" tabindex="99" @blur="show=false" @mousedown="evTag='lmd'">
                <ul class='_con'>
                    <li class="disable" v-if='!list||list.length==0'>暂无数据</li>
                    <template v-else>
                        <template v-if="type==1||type==2"><li v-for="li in list"  :class="{active:li[type==1?lid:lname]==value}" @click="liClick(li)">{{li[lname]}}</li></template>
                        <template v-else><li v-for="(lo,li) in list"  :class="{active:type==3?li==value:(li+parseInt(type)-4)==parseInt(value)}" @click="liClick(lo,li)">{{lo}}</li></template>
                    </template>
                </ul>
            </div>
        </div>
    </template>
    <script>
    function select(){
        Object.assign(this,{
            name:"leo-select",                      //组件名
            props:{
                'list':Array,                       //下拉数组                       
                'value':{default:""},               //选中值 sync传入，update修改
                'type':{default:1},                 //数据类型int 传入数据类型-返回数据类型  1,2传入[{Id:"",Name:""}, 1返回Id 2返回Name  3,4,5传入[a,b,c] 3返回a 4返回0 5返回1
                'lid':{default:"Id"},               //type为1,2时 Id字段
                'lname':{default:"Name"},           //type为1,2时 Name字段
                'placeholder':'',                   //输入框提示文字
                'name':{default:""},                //选中框前说明文字(特定项目加入，一般忽略)
            },
            data(){
                return{                    
                    text:"",                //输入框显示值
                    show:false,             //下拉框展开、收起
                    evTag:"",               //失去焦点前操作元素判断，用于判断下拉框是否收起  imd表示input上鼠标按下  lmd表示在下拉列表上鼠标按下
                }
            },
            created(){    
                this.setText();            
            },
            methods:{
                inputFocus(){
                    //输入框获取焦点，如果输入框点击获取焦点，不做展开下拉处理，点击事件已处理，如果其他方式获取焦点则打开下拉框
                    if(this.evTag!="imd")
                        this.show = true;
                    this.evTag = "";                        
                },
                inputMD(){
                    //赋值点击标签evTag为imd，inputFocus根据改值判断是否通过点击获取焦点
                    this.evTag = "imd";
                    //打开、关闭下拉框切换
                    this.show = !this.show;
                },
                inputBlur(){
                    //输入框失去焦点  如果下拉框点击会赋值evTag为lmd，下拉框获取焦点，此时不关闭下拉框，由下拉框失去焦点时关闭，如果不是下拉框点击，则直接关闭下拉框
                    if(this.evTag!="lmd")
                        this.show = false;				
                },
                liClick(lo,li){          
                    //下拉选项点击选中          
                    //关闭下拉框
                    this.show = false;                  
                    let uv = "",
                        type = parseInt(this.type); 
                    //获取当前输入、输出数据类型 this.type    
                    if(type==1||type==2)
                        uv = type==1?lo.Id:lo.Name;         //取当前选择对象Id或Name
                    else
                        uv = type==3?lo:li+(type-4);        //取当前选择的数据或索引或索引+1  (type-4)表示 type==4 取索引值 type==5 取索引值+1
                    this.$emit("update:value",uv);          //更新选择值
                    this.$emit('change',lo,li);             //发出选择时间change
                },
                setText(){
                    //设置输入框显示值
                    let val = this.value;
                    if(this.list.length==0||val==""||val==undefined)
                        this.text = "";
                    let tv = "",
                        type = parseInt(this.type);
                    if(type==2||type==3)
                        this.text = val;
                    else if(type==1){
                        let item = this.list.find(o=>o[this.lid]==val);
                        this.text = item ? item[this.lname] : "";
                    }
                    else
                        this.text = this.list[parseInt(val)-(type-4)] || "";      //(type-4)表示 type==4 value为索引值 type==5 value为索引值+1                  
                }
            },	
            watch:{
                list(){
                    //选择项改变重置输入框显示内容
                    this.setText();
                },
                value(){
                    //值改变重置输入框显示内容
                    this.setText();
                }
            }
        })
    }
</script>
</component>