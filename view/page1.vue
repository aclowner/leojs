<component>
  <style lang="less">
.con {
  .p-left {
    width: 320px;
    margin-right: 20px;
    padding: 20px 0;
  }
  .p-right {
    flex: 1;
    .search-ope {
      height: 78px;
      align-items: center;
      padding: 0 20px;
      justify-content: space-between;
      .search {
        width: 360px;
      }
    }
    .tables {
      flex: 1;
      overflow: hidden;
      .td-Ope {
        flex: unset;
        width: 328px;
      }
    }
  }
}
</style>
  <template>
  <div class="page flex-column">
    <div class="title flex">
      <span>系统管理</span>
      <div class="ope">
        <button class="btn green mr" @click="addUser()">添加员工</button>
        <button class="btn green mr" @click="editDept(1)">添加部门</button>
        <button class="btn blue mr" @click="editDept(2)" :disabled="!active.Id">编辑部门</button>
        <button class="btn orange" @click="delDept" :disabled="!active.Id">删除部门</button>
      </div>
    </div>
    <div class="con flex">
      <div class="p-left box">
        <tree :list="deptTree" @change="deptClick"></tree>
      </div>
      <div class="p-right box flex-column">
        <div class="search-ope flex">
          <div class="search">
            <input type="text" v-model="filter" />
          </div>
        </div>
        <div class="tables">
          <leo-table :list="listFilter" @change="(da)=>{listShow = da}" class="table-pro-manage">
            <div class="tr" slot="thead">
              <span v-for="(v,k,i) in tableKeys" :class="'td-'+k">
                <a class="checkbox" v-if="i==0"></a>{{v}}
              </span>
            </div>
            <div class="tr" slot="tbody" v-for="(tr,index) in listShow" :key="index">
              <span v-for="(v,k,i) in tableKeys" :class="'td-'+k">
                <template v-if="k=='Ope'">
                  <a class="a-btn blue" @click="trBtn(1,tr,index)">编辑</a>
                  <a class="a-btn green" @click="trBtn(2,tr,index)">详细</a>
                  <a class="a-btn orange" @click="trBtn(3,tr,index)">删除</a>
                </template>
                <template v-else>{{tr[k]}}</template>
              </span>
            </div>
          </leo-table>
        </div>
      </div>
    </div>

    <popup ref="popup" @send="ppCall"></popup>
  </div>
</template>
  <script>
NS.Component([
  "components/tree",
  "components/table",
  "components/popup",
  "page1/userAdd",
  "page1/deptSelect",
  "page1/deptAdd"
]);
function page1() {
  Object.assign(this, {
    data: function() {
      return {
        dept: NS.Load("../resource/dept.json"),
        tableKeys: {Name: "姓名",  Sex: "性别",  Dept: "部门",  Job: "职务",  Ope: "操作"},
        list: NS.Load("../resource/user.json"),
        listShow: [],
        active: {},
        filter: ""
      };
    },
    computed: {
      deptTree() {
        return this.dept.listToTree();
      },
      allIds() {
        let re = [];
        if (!this.active.Id) return re;
        re.push(this.active.Id);
        if (this.active.child) {
          let arr = this.active.child.treeToList(0, "Id").map(o => o.Id);
          re.push(...arr);
        }
        return re;
      },
      listFilter() {
        console.log(this.allIds);
        if (this.allIds.length == 0)
          return this.list.filter(o => o.Name.indexOf(this.filter) >= 0);
        return this.list.filter(o =>  this.allIds.includes(o.DeptId) && o.Name.indexOf(this.filter) >= 0);
      }
    },
    created() {},
    methods: {
      deptClick(item) {
        console.log(item);
        this.active = item;
      },
      addUser(da = {}) {
        //添加、编辑用户
        if (!da.edit && this.active.Id) {
          da.data = {};
          da.data.Dept = this.active.Name;
          da.data.DeptId = this.active.Id;
        }
        this.$refs.popup.show(["用户编辑", "userAdd"], da);
      },
      editDept(t) {
        //1添加、2编辑部么
        let da = {};
        if (t == 2) {
          let deptDa = JSON.parse(JSON.stringify(this.active));
          delete deptDa.child;
          da.data = deptDa;
        } else {
          if (this.active.Id)
            da.data = { Pid: this.active.Id, Pname: this.active.Name };
        }
        this.$refs.popup.show(["部门编辑", "deptAdd"], da);
      },
      delDept() {
        this.$refs.popup.alert(
          "该部门有绑定的人员或子部门，不可删除！",
          ot => {},
          [["自定义按钮", "green"]]
        );
      },
      trBtn(t, da) {
        //t 1：编辑 2：详细 3：删除  da 当前数据 index 当前数据索引
        if (t == 1) this.addUser({ data: da, edit: true });
        else if (t == 2) return "";
        else if (t == 3) this.delUser(da);
      },
      delUser(da) {
        this.$refs.popup.confirm("确定删除当前用户吗？", ot => {
          if (ot == "确定") {
            let index = this.list.findIndex(o => o.Id == da.Id);
            this.list.splice(index, 1);
          }
        });
      },
      ppCall(re) {
        console.log(re);
        if (re.fn == "userSave") {
          //添加编辑用户
          if (re.data.Id) {
            let index = this.list.findIndex(o => o.Id == re.data.Id);
            this.list.splice(index, 1, re.data);
          } else this.list.push(re.data);
        } else if (re.fn == "deptSave") {
          if (re.data.Id) {
            let index = this.dept.findIndex(o => o.Id == re.data.Id);
            this.dept.splice(index, 1, re.data);
          } else this.dept.push(re.data);
        }
      }
    }
  });
}
</script>
</component>