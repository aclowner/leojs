<component>
    <style>
    </style>
    <template>
        <div class="tree _scroll">
            <div class="_con">
                <tree-item :item="item" :open="true" :active="active" v-for="item in list" @change="change">
                </tree-item>
            </div>
        </div>
    </template>
    <script>
        NS.Component(['treeItem']);
        function tree() {
            Object.assign(this, {
                props: {
                    list: Array,  //树结构数据 子级字段:child,
                    value:{default:0}
                },
                data() {
                    return {
                        active: this.value   //当前树选中项Id
                    }
                },
                methods: {
                    change(item, level) {
                        this.active = item.Id;
                        this.$emit('change', item, level);  //选中项后发出事件
                    }
                },
                watch: {
                    value(n){
                        this.active = n;
                    }
                },
            })
        }
    </script>
</component>