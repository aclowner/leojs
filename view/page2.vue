<component>
    <style>
    .job-list{
        width: 280px;
        margin-right: 20px;
    }
    .job-edit{
        flex: 1;
        overflow: hidden;
    }
    .edit-panel, .detail-panel{
        height: 100%;
    }
    .job-list-title{
        height: 51px;
        border-bottom: solid 1px #eff0f2;
        padding-left: 20px;
        line-height:50px;
        letter-spacing: 2px;
    }
    .job-list-con{
        flex: 1;
        overflow: hidden;
        padding: 10px 0;
    }
    .no-list{
        line-height: 50px;
        text-align: center;
    }
    .job-item{
        height: 50px;
        padding: 5px 0 5px 20px;
    }
    .job-item>a{
        display: block;
        line-height: 40px;
        padding: 0 14px 0 32px ;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;        
        border-right: solid 4px transparent;
    }
    .job-item>a.active{    
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;    
        border-right-color: var(--input-active-color);
        background: #ebf2fc;
    }
    .job-edit .row>.key{
        width: 138px;
    }
    .job-edit .row>.val{
        padding-right: 30px;
    }
    .ed-top{
        padding: 10px 0;
        border-bottom: solid 5px #f7f8f9;
    }
    .ed-bottom{
        flex: 1;
        overflow: hidden;
        padding: 20px 0 20px 40px;
    }
    .detail-tab{
        padding: 20px 30px 5px 30px;
    }
    .users{
        margin-right: 40px;
    }
    .table-nopp .thead-tr{
        display: flex;
        background: var(--thead-bg);
        border-bottom: var(--thead-border);
    }
    .table-nopp .tbody-tr{
        display: flex;
        border-bottom: var(--tbody-border);
    }
    .table-nopp .tbody-tr>span, .table-nopp .thead-tr>span{
        flex: 1;
        line-height: 46px;
        padding: 0 14px;
    }
    </style>
    <template>
        <div class="page flex-column">
            <div class="title flex">
                <span>{{$route.params.title}}</span>
                <div class="ope">
                    <template v-if="!edit"><button class="btn green mr" @click="aeJob(0)">添加职务</button><button class="btn blue mr" @click="aeJob(active)">编辑职务</button><button class="btn orange">删除职务</button></template>  
                    <template v-if="edit"><button class="btn blue mr" @click="save">保存</button><button class="btn" @click="cancle">取消</button></template>  
                </div>
            </div>
            <div class="con flex">
                
                <div class="job-list box flex-column">
                    <div class="job-list-title">职务列表</div>
                    <div class="job-list-con">
                        <scroll>
                            <template v-if="list.length>0">
                                <div class="job-item" v-for="job in list"><a :class="{active:job.Id==active}" @click="jobClick(job.Id)">{{job.Name}}</a></div>
                            </template>
                            <div v-else class="no-list">暂无数据</div>
                        </scroll>
                    </div>
                </div>

                <div class="job-edit box">

                    <div class="edit-panel flex-column" v-show="edit">
                        <div class="ed-top">
                            <row name="职务名称："><input type="text" v-model="data.Name"></row>
                            <row name="职务描述："><textarea v-model="data.Remark"></textarea></row>
                        </div>
                        <div class="ed-bottom">
                            <tree-check :list="limits" :checks="checkedObj"></tree-check>                                
                        </div>
                    </div>

                    <div class="detail-panel flex-column" v-show="!edit">
                        <div class="ed-top">
                            <div class="flex">
                                <row name="职务名称:" style="width:380px;">{{data.Name}}</row>
                                <row name="人数统计:"> {{usersOfJob.length}}</row>
                            </div>
                            <row name="职务描述:">{{data.Remark||"--"}}</row>
                            <div class="detail-tab"><tab-btns :list="tabs" :active.sync="detailTab"></tab-btns></div>                            
                        </div>
                        <div class="ed-bottom">
                            <tree-check :list="detailTree" :checks="checkedObj" :checkbox="false" v-show="detailTab==1"></tree-check>   
                            <div class="table-nopp users" v-show="detailTab==2">
                                <div class="thead-tr">
                                    <span>序号</span><span>姓名</span><span>部门</span>
                                </div>
                                <div class="tbody-tr" v-for="(user,ui) in usersOfJob" >
                                    <span>{{ui+1}}</span><span>{{user.Name}}</span><span>{{user.Dept}}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>


            <popup ref="popup" ></popup>
        </div>
    </template>
    <script>
    NS.Component(["page2/treeCheck","components/popup"]);
    let jobQx = [
                    {JobId:1,limits:"01/0,0201/0-1-2-3-4,0202/0-1-2,0301/0-1,0302/0-1,030201/0-1,0303/0-1-2-3,0304/0,0701/0-1-2,0702/0-1-2,0703/0-1-2,0704/0-1-2,09/0-1-2"},
                    {JobId:2,limits:"01/0,0302/0-1,030201/0-1,0401/0-1,0402/0,08/0-1-2,09/0-1-2,10/0-1-2"},
                    {JobId:3,limits:"01/0,0301/0-1,0302/0-1,030201/0-1,0303/0-1-2-3,0304/0,0501/0-1,0502/0,06/0-1,09/0-1-2"}
                ];
    function page2(){
        Object.assign(this,{
            data(){
                return {
                    list:[{Id:1,Name:"职务一",Remark:"职务一的职务描述"},{Id:2,Name:"职务二",Remark:"职务二的职务描述"},{Id:3,Name:"职务三",Remark:"职务三的职务描述"}],
                    limits:NS.Load("../resource/menu.json"),
                    active:0,
                    edit:true, //  false 查看状态, true 编辑状态
                    checked:"",
                    data:{Id:"",Name:"",Remark:""},
                    tabs:[{name:"职务权限"},{name:"查看人员"}],
                    users:NS.Load("../resource/user.json"),
                    detailTab : 1,
                }
            },
            computed:{
                checkedObj(){
                    let re = {};
                    if(this.checked.length==0)
                        return re;
                    let arr = this.checked.split(",");
                    for(let i=0;i<arr.length;i++){
                        let ai = arr[i].split("/");
                        re[ai[0]] = ai[1].split("-").map(o=>parseInt(o));
                    }                    
                    return re;
                },
                detailTree(){                    
                    if(this.checked.length==0)
                        return []; 
                    let arr = JSON.parse(JSON.stringify(this.limits.treeToList())),
                        re = [],
                        hash = {},
                        v = this;
                    for (let i = 0; i < arr.length; i++) {
                        hash[arr[i].id] = arr[i];
                    }
                    for(let k in this.checkedObj){
                        re = v.getPars(hash,k,re);
                    }
                    console.log(re);
                    if(re.length>0)
                        return re.listToTree("id","pid","child");
                    return re;
                    //return this.limits.treeToList().listFindParents(this.checked.split(",").map(o=>o.split("/")[0]));
                },
                usersOfJob(){
                    if(!this.active)
                        return [];
                    return this.users.filter(o=>o.JobId==this.active);
                },

            },
            created(){
                
            },
            methods:{
                jobClick(id){
                    this.edit = false;
                    this.active = id;
                },
                aeJob(id){                    
                    this.edit = true;
                    this.active = id;              
                },
                save(){},
                cancle(){
                    let acon = this.active ? "确定取消编辑的内容？" : "确定取消添加的内容？";
                    this.$refs.popup.confirm(acon,(ot)=>{
                        if(ot=="确定"&&this.active)
                            this.edit = false;
                    });
                },
                getPars(da,id,re){
                    let item = da[id];
                    if(!item)
                        return re;
                    if(re.filter(o=>o.id==id).length==1)
                        return re;
                    if(item.limit&&item.limit.length>0)
                        item.limit = item.limit.filter((o,i)=>this.checkedObj[id].includes(i));
                    re.push(item);
                    if(item.pid)
                        this.getPars(da,item.pid,re);
                    return re;
                }
            },
            watch:{
                active(nv){
                    this.checked = nv ? jobQx.find(o=>o.JobId==nv).limits : "";
                    this.data = nv ? this.list.find(o=>o.Id==nv) : {Id:"",Name:""};
                }
            }
        });
    }
</script>
</component>