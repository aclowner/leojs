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
    .sel-list ._con{
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
            <div class="sel-list _scroll" v-show="show" tabindex="99" @blur="listBlur" @mousedown="listMD">
            <ul class='_con'>
                <li class="disable" v-if='!list||list.length==0'>暂无数据</li>
                <template v-else>
                    <template v-if="liType==1"><li v-for="li in list"  :class="{active:li[lid]==val}" @click="liClick(li[lid])">{{li[lname]}}</li></template>
                    <template v-else-if="liType==2"><li v-for="li in list"  :class="{active:li==val}" @click="liClick(li)">{{li}}</li></template>
                    <template v-else><li v-for="(li,i) in list" :class="{active:i==parseInt(val)}" @click="liClick(i)">{{li}}</li></template>
                </template>
            </ul></div>
        </div>
    </template>
    <script>
    function select(){
        Object.assign(this,{
            name:"leo-select",
            props:{
                'list':Array,
                'name':{default:""},
                'lid':{default:"Id"},
                'lname':{default:"Name"},
                'value':{default:""},
                'liType':{default:1},
                'placeholder':'',
            },
            data(){
                return{
                    val:this.value,
                    show:false,
                    evTag:"",
                }
            },
            computed:{
                text(){						
                    let rt = "",
                        sv = this.val+"";			
                    if(this.val!=undefined &&sv.length>0&&this.list&&this.list.length>0){
                        if(this.liType==1)
                            rt = this.list.find(o=>o[this.lid]==this.val)?this.list.find(o=>o[this.lid]==this.val)[this.lname]:"";
                        else if(this.liType==2)
                            rt = this.val;
                        else
                            rt = this.list[this.val];
                    }
                    if(this.placeholder && rt)
                        rt = this.placeholder + " - " + rt;
                    return rt;
                }
            },
            methods:{
                inputFocus(){
                    if(this.evTag!="imd")
                        this.show = true;
                    else
                        this.evTag = "";
                },
                inputMD(){
                    this.evTag = "imd";
                    this.show = !this.show;
                },
                inputBlur(){
                    if(this.evTag!="lmd")
                        this.show = false;				
                },
                listMD(){
                    this.evTag = "lmd";
                },
                listBlur(){
                    this.show = false;			
                },
                liClick(v){
                    this.val = v;
                    this.show = false;
                }
            },	
            watch:{
                value(v){
                    this.val = v;
                },
                val(v,o){
                    this.$emit("update:value",this.val);
                    if(v!=o)
                        this.$emit('change',this.val,this.text);
                }
            }
        })
    }
</script>
</component>