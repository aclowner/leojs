<component>
    <style>
    .layer-enter{
        transform:scale(0.5);
        opacity: 0.1;
    }
    .layer-enter-active{
        transition:  all .4s;    
    }
    .layer-leave-active{
        opacity: 0;
        top: 50%;
        transition:  all .4s; 
    }
    .popuping-enter{
        top: 40%;
        opacity: 0.1;
    }
    .popuping-enter-active{
        transition:  all .6s;    
    }
    .popuping-leave-active{
        opacity: 0;
        top: 60%;
        transition:  all .5s; 
    }
    </style>
    <template>
        <transition mode="in-out" name="layer">
        <div class="layer" v-show="ppShow.length>0||alertOpen">
            <transition-group mode="in-out" name="popuping" >
                <popup-body v-for="(pp,pi) in ppShow" :key="pp[1]" :title="pp[0]" :class="{show:!alertOpen&&pi==ppShow.length-1}">
                    <component v-bind:is="pp[1].transLink()" :ref="pp[1]"></component>
                </popup-body>      
                <alert v-if="alertOpen" key="alert" :btns="alertBtn" :con="alertCon"></alert>      
            </transition-group>
        </div>
        </transition>
    </template>
    <script>
    NS.Component(['popupBody','alert']);
    function popup(){
        Object.assign(this,{
            props:{                
            },
            data(){
                return {
                    ppShow:[], //显示的弹出层 默认后面的在上面
                    alertOpen:false,
                    alertCon:"",
                    alertBtn:[],
                    alertCall:null,
                }
            },
            methods:{
                show(pp,param){  //打开
                    this.ppShow.push(pp);
                    //打开时需要调用改组件
                    if(param)  
                        setTimeout(()=>{this.child(pp[1],param);},0);                        
                },
                close(pp,opp,param){  //关闭
                    if(!pp){
                        this.ppShow = [];
                        return;
                    }
                    let ppi = this.ppShow.findIndex(o=>o[1]==pp);
                    this.ppShow.splice(ppi,1);
                    //关闭时需要调用其他层组件
                    if(opp&&param)   
                        this.child(opp,param);
                },
                alert(con,fn,btns){
                    this.alertCon = con;
                    this.alertBtn = btns || [["确定","blue"]];
                    this.alertOpen = true;
                    this.alertCall = fn;
                },
                confirm(con,fn,btns){
                    this.alertCon = con;
                    this.alertBtn = btns || [["确定","blue mr"],["取消",""]];
                    this.alertOpen = true;
                    this.alertCall = fn;
                },
                alertBtnEvent(ot){
                    console.log(ot);
                    this.alertCall(ot);
                    this.alertOpen = false;
                },
                child(pp,param){  //调用子组件函数，data
                    //param为{key:value} key为变量、函数，value为参数
                    console.log(pp,param);
                    for(let key in param){                        
                        let cv = this.$refs[pp][0][key];
                        console.log(key,typeof(cv),param[key],cv);
                        if(typeof(cv)=="function")  //函数
                            cv(param[key]);  
                        else if(typeof(cv)=="object"&&!Array.isArray(cv)) //对象使用assing合并
                            Object.assign(this.$refs[pp][0][key],param[key]);
                        else //非对象变量
                            this.$refs[pp][0][key] = param[key];
                    }
                },
                childPrev(param){
                    if(this.ppShow.length<2)
                        return;
                    let pp = this.ppShow[this.ppShow.length-2];
                    this.child(pp[1],param)
                },
                send(param){
                    this.$emit("send",param);
                }
            },
        })
    }
</script>
</component>