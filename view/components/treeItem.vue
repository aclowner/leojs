<component>
    <style>
        .tree-child {
            margin-left: 20px;
        }

        .tree-item .self {
            margin-left: 20px;
            cursor: pointer;
            align-items: center;
            padding: 5px 0;
            position: relative;
        }

        .tree-item .self>span {
            line-height: 40px;
            display: block;
            padding: 0 14px 0 32px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .tree-item .self.active span {
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            border-right: solid 4px var(--input-active-color);
            background: #ebf2fc;
        }

        .tree-item .self .icon-oc {
            width: 16px;
            height: 16px;
            border-radius: 2px;
            position: absolute;
            background: var(--input-active-color);
            left: 10px;
            top: 17px;
        }

        .tree-item .self .icon-oc:before,
        .tree-item .self .icon-oc:after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
        }

        .tree-item .self .icon-oc:before {
            width: 10px;
            height: 2px;
        }

        .tree-item .self .icon-oc:after {
            width: 2px;
            height: 10px;
        }

        .tree-item .self .icon-oc.open:after {
            display: none;
        }
    </style>
    <template>
        <div class="tree-item">
            <div :class="['self',{active:item.Id==active}]" @click="itemClick(item)">
                <a :class="['icon-oc',{open:openI}]" v-if="item.child&&item.child.length>0"
                    @click.stop="openI=!openI"></a><span>{{item.Name}}</span>
            </div>
            <div class="tree-child" v-if="item.child" v-show="openI">
                <!-- 有子级递归自己，直到子级结束 -->
                <tree-item :item="ici" :active="active" v-for="ici in item.child" :level="level+1" @change="itemClick">
                </tree-item>
            </div>
        </div>
    </template>
    <script>
        function treeItem() {
            this.name = "tree-item";
            this.props = {
                item: { default: null },   //当前数据
                open: { default: false },  //自己是否打开
                level: { default: 1 },  //层级数量 1开始
                active: { default: 0 }   //选中项Id
            };
            this.data = function () {
                return {
                    openI: this.open
                }
            };
            this.methods = {
                itemClick(item, level = this.level) {
                    this.$emit('change', item, level);
                }
            };
        }
    </script>
</component>