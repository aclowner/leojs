<component>
    <style>
    .pwd-stip{
        line-height: 20px;
        padding-left: 10px;
        color: var(--placeholder-color);
    }
    </style>
    <template>
        <div class="form">           
            <form-row name="手机号" class="must"><input type="text" placeholder="手机号用于登录" v-model="data.Tel"></form-row>   
            <form-row name="姓名" class="must vdf vrs">
                <input type="text" style="margin-right:30px" v-model="data.Name">
                <radio-group :list="['男','女']" :value.sync="data.Sex" type="2"></radio-group>
            </form-row>      
            <form-row name="账号" class="must"><input type="text" v-model="data.Account"></form-row>
            <form-row name="密码" class="must vdf vrs" v-if="!edit">
                <input type="text" v-model="data.Pwd">
                <span class="pwd-stip">8-20个字符，包括数字、英文和特殊字符</span>
            </form-row>
            <form-row name="部门"><input type="text" @click="dept" v-model="data.Dept"></form-row>
            <form-row name="职务"><leo-select :value.sync="data.JobId" :list="jobs"></leo-select></form-row>
            <form-row name="邮箱"><input type="text" @click="dept" v-model="data.Email"></form-row>
           
            <form-row class="form-btn"><button class="btn blue" @click="save">确定</button>&nbsp;&nbsp;<button @click="close" class="btn" >取消</button></form-row>   
        </div>
    </template>
    <script>
    
    NS.Component(["../components/select","../components/date"]);
    function userAdd(){
        Object.assign(this,{
            name:"user-add",
            data(){
                return {
                    data:{Id:"",Tel:"",Name:"",Sex:1,Account:"",Pwd:"",Dept:"",DeptId:"",Job:"",JobId:""},
                    jobs:[{Id:1,Name:"职务一"},{Id:2,Name:"职务二"},{Id:3,Name:"职务三"}],
                    edit:false  //-1 添加  >0 当前编辑数据的索引，用于更新数据                  
                }
            },
            methods:{
                dept(){                    
                    this.$parent.show(["部门选择","deptSelect"],{active:{Id:this.data.DeptId,Name:this.data.Dept}});
                },
                close(){
                    this.$parent.close();
                },
                save(){                    
                    if(this.data.JobId)
                        this.data.Job = this.jobs.find(o=>o.Id==this.data.JobId).Name;
                    this.$parent.send({fn:"userSave",data:this.data});
                    this.close();
                },
                deptSave(re){
                    this.data.DeptId = re.id;
                    this.data.Dept = re.name;
                }
            }
        })
    }
</script>
</component>