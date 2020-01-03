<component>
    <style>
        .div-table ._scroll ._bar{
            width: 6px;
        }
        .div-table{
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
        .div-table>.thead{
            height: 51px;
        }
        .div-table>.tbody{
            flex: 1;
            overflow: hidden;
        }
        .div-table>.tfoot{
            height: 53px;
            border-top: var( --tfoot-border);
            display: flex;
            justify-content: space-between;
            padding: 10px 36px;
        }
        .div-table .tr{
            line-height: 48px;
            border-bottom: var(--tbody-border);
            margin: 0 20px;
            display: flex;
        }
        .div-table>.thead .tr{
            background: var(--thead-bg);
            border-bottom: var(--thead-border);
        }
        .div-table .tr>span{
            padding: 0 10px 0 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex: 1;
        }
        .div-table.sw .tr>span{
            flex: unset;
        }
        .div-table .tr.tr-empty{
            border-bottom: none;
        }
        .div-table .tr.tr-empty span{
            width: 100%;
            text-align: center;
        }
        .div-table .paging{
            display: flex;
            justify-content: flex-end;
        }
        .div-table .paging>a{
            width: 32px;
            height: 32px;
            margin-left: 4px;
            text-align: center;
            line-height: 30px;
            background: var(--tfoot-size-bg);
            border: var(--tfoot-size-border);
        }
        .div-table .paging>a.a-omit{
            border: none;
            background: none;
            font-weight: bold;
            line-height: 50px;
        }
        .div-table .paging>a.active{
            background: var(--tfoot-size-active-bg);
            border-color: var(--tfoot-size-active-bg);
            color: #fff;
        }
        .paging>.a-prev, .paging>.a-next{
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--input-color);
        }
        .paging>.a-prev:before, .paging>.a-next:before{
            content: "";
            width: 8px;
            height: 8px;
            border-left: double 4px;
            border-bottom: double 4px;
        }
        .paging>.a-prev:before{
            transform: rotate(45deg);
        }
        .paging>.a-next:before{
            transform: rotate(-135deg);
        }
        .div-table .nums{
            line-height: 32px;
            position: relative;
        }
        .div-table .nums .a-size{
            display: inline-block;
            vertical-align: top;
            padding: 0 4px;
            transition: all 0.5s;
        }
        .div-table .nums .a-size:hover, .div-table .nums .a-size.active{
            padding: 0 16px;
            border-bottom: var(--tfoot-size-border);
            color: var(--tfoot-size-active-bg);
        }
        .div-table .nums .a-size:hover:after, .div-table .nums .a-size.active:after{
            content: "";
            display: inline-block;
            vertical-align: top;
            border-left: solid 5px transparent;
            border-right: solid 5px transparent;
            border-bottom: solid 5px;
            margin-left: 6px;
            margin-top: 13px;  
        }
        .div-table .size-arr{
            position: absolute;
            background: var(--tfoot-size-bg);
            border: var(--tfoot-size-border);
            right: 0;
            bottom: 32px;
            opacity: 0;
            transition: opacity 1s;
            z-index: -1;
        }
        .div-table .size-arr:focus{
            z-index: 1;
            opacity: 1;
        }
        .div-table .size-arr>a{
            line-height: 26px;
            display: block;
            margin: 2px;
            padding: 0 24px;
        }
        .div-table .size-arr>a:hover{
            color: var(--tfoot-size-active-bg);
        }
        .div-table .size-arr>a.active{   
            color: var(--tfoot-size-active-bg);
        }
        .div-table .checkbox{
            margin: 16px 11px 0 0;
        }
        .div-table .table-a{
            color: var(--select-color);
        }

        /* table-tr 更新动画 */
        .table-tr-enter{
            opacity: 0;    
            transform: translateY(-50px);
        }
        .table-tr-enter-active{
            transition: opacity 1.5s, transform 1s;
        }
        .table-tr-move{
            transition: opacity 0.5s, transform 1.5s;
        }
    </style>
    <template>
        <!-- .div-table.sw   sw表示是否自定义宽度，默认不自定平分宽度-->
        <div class="div-table">		
            <div class="thead"><slot name="thead"></slot></div>
            <div class="tbody _scroll">
                <div class="tr tr-empty" v-if="list.length==0"><span>暂无数据</span></div>
                <transition-group v-else name="table-tr" tag="div" mode='in-out' class="_con">
                    <slot name="tbody"></slot>
                </transition-group>
            </div>
            <div class="tfoot">
                <span  v-if="list.length==0">总计:0</span>
                <template v-else>
                    <div class="nums">						
                        <span>当前{{show[0]+1}}-{{show[1]}}</span>/<span>总计{{list.length}}</span>
                        <template>
                            <span>每页显示<a :class="['a-size',{active:sizeActive}]" @click="sizeClick">{{size}}</a></span>
                            <div class="size-arr" tabindex="1" ref="sizeArr" @blur="sizeArrBlur">
                                <a v-for="s in sizeArr" :class="{active:s==size}" @click="sizeSel(s)">{{s}}</a>
                            </div>
                        </template>
                    </div>
                    <div class="paging">
                        <a class="a-prev" @click="pagePN(-1)"></a>
                        <a v-for="a in pageNums" :class="[(a=='...'?'a-omit':'a-num'),{active:a==pageIndex}]" @click="numClick(a)">{{a}}</a>
                        <a class="a-next" @click="pagePN(1)"></a>
                    </div>
                </template>
            </div>
        </div>
    </template>
    <script>
        function table() {
            this.name = "leo-table";
            Object.assign(this, {
            props : {
                list:Array,
		        pageSize:{default:20},
            },
            data(){
                return {
                    sizeArr:[10,20,50],
                    size:this.pageSize,
                    pageIndex:1,
                    sizeActive:false,			
                }
            },
            computed:{
                show(){
                    let si = (this.pageIndex - 1)*this.size, ei = this.pageIndex * this.size;
                    ei = Math.min(this.list.length,ei);
                    return [si,ei];
                },
                pageTotal(){
                    return Math.ceil(this.list.length/this.size);
                },
                pageNums(){
                    let arr = null;
                    if(this.pageTotal<8)
                        arr = this.pageTotal;
                    else{
                        if(this.pageIndex<5)
                            arr = [1,2,3,4,5,"...",this.pageTotal];
                        else if(this.pageIndex>this.pageTotal-4)
                            arr = [1,"...",this.pageTotal-4,this.pageTotal-3,this.pageTotal-2,this.pageTotal-1,this.pageTotal];
                        else
                            arr = [1,"...",this.pageIndex-1,this.pageIndex,this.pageIndex+1,"...",this.pageTotal]

                    }
                    return arr;
                },
            },
            methods:{
                numClick(a){
                    if(a!="...")
                        this.pageIndex = a;
                },
                sizeClick(){
                    this.sizeActive = true;
                    this.$refs.sizeArr.focus();
                },
                sizeArrBlur(){
                    this.sizeActive = false;
                },
                sizeSel(s){
                    this.size = s;
                    this.$refs.sizeArr.blur();
                },
                pagePN(i){
                    if((this.pageIndex<this.pageTotal && i==1)||(this.pageIndex>1&&i==-1))
                        this.pageIndex += i;
                },
            },
            watch : {
                pageTotal(v){
                    if(this.pageIndex>v&&v>0)
                        this.pageIndex = v;
                },
                show(v){
                    this.$emit('change',this.list.slice(...this.show));
                    immediate: true;
                }
            },
            mounted(){
                this.$emit('change',this.list.slice(...this.show));
            }
        });
        }
    </script>
</component>