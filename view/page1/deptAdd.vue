<component>
    <style>
    </style>
    <template>
        <div class="form">
            <form-row name="名称"><input type="text" v-model="data.Name"></form-row>
            <form-row name="所属父级"><input type="text" @click="dept" v-model="data.Pname"></form-row>
            <form-row name="部门描述"><textarea v-model="data.Remark"></textarea></form-row>

            <form-row class="form-btn"><button class="btn blue" @click="save">确定</button>&nbsp;&nbsp;<button @click="close" class="btn" >取消</button></form-row>  
        </div>
    </template>
    <script>
    function deptAdd(){
        Object.assign(this,{
            name: "dept-add",
            data(){
                return {
                    data:{Id:"",Name:"",Pid:"",Pname:"",Remark:""}
                }
            },
            methods:{
                dept(){
                    this.$parent.show(["部门选择","deptSelect"],{active:{Id:this.data.Pid,Name:this.data.Pname}});
                },
                deptSave(re){
                    this.data.Pid = re.id;
                    this.data.Pname = re.name;
                },
                save(){
                    this.$parent.send({fn:"deptSave",data:this.data});
                    this.close();
                },
                close(){
                    this.$parent.close();
                }
            }
        });
    }
</script>
</component>