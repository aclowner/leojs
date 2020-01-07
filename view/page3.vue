<component>
        <style>
            .amap{
                width: 100p%;
                height: 100%;
            }
            .a_marker{
                width: 22px;
                height: 32px;
                background: url("../image/amap-icon.png");
                text-align: center;
                line-height: 22px;
                color: #fff;
            }
            .pro-add{
                padding: 20px 300px 020px 54px;
            }
            .ssq{
                margin: 0 40px;
            }
        </style>
        <template>
            <div class="page flex-column">
            <div class="title flex">
                <span>{{$route.params.title}}</span>
                <div class="ope">
                    <button v-if="type==2" class="btn green mr" @click="add()">添加项目</button>
                    <template v-if="type==1"><button class="btn blue mr" @click="save">保存</button><button class="btn" @click="cancle">取消</button></template>
                </div>
            </div>
            <div class="con box">
                <div class="amap" id="amap" v-show="type==2"></div> 
                <scroll v-show="type==1">
                    <div class="pro-add">
                        <row name="项目名称：" class="must"><input type="text" v-model="data.XMMC"></row>
                        <row name="项目简称：" class="must"><input type="text" v-model="data.XMJC"></row>
                        <div class="flex">
                            <div class="col6"><row name="开始日期：" ><leo-date :value="data.KSRQ"></leo-date></row></div>
                            <div class="col6"><row name="结束日期：" ><leo-date :value="data.JSRQ"></leo-date></row></div>
                        </div>
                        <row name="项目负责人：" class="must"><input type="text" v-model="data.XMJC"></row>
                        <row name="项目所属区域：">
                            <div class="flex">
                                <div class="col4 "><leo-select placeholder="省" li-type="5" :list="sss" :value.sync="data.XMSSS" @change="()=>{data.XMSSQ='';data.XMSSX='';}"></leo-select></div>
                                <div class="col4 ssq"><leo-select placeholder="市" li-type="5" :list="ssq" :value.sync="data.XMSSQ" @change="()=>{data.XMSSX='';}"></leo-select></div>
                                <div class="col4 "><leo-select placeholder="区县" li-type="5" :list="ssx" :value.sync="data.XMSSX"></leo-select></div>                            
                            </div>
                        </row>
                        <row name="具体地址：">
                            <input-filter></input-filter>
                        </row>
                        <row name="项目描述：">
                            <textarea v-model="data.XMMS"></textarea>
                        </row>
                    </div>                    
                </scroll>               
            </div>
            </div>
        </template>
        <script>    
        NS.Component(["components/inputFilter"]);
        function page3(){
            Object.assign(this,{
                data(){
                    return {
                        type:2,
                        data:{XMMC:"",XMJC:"",KSRQ:"",JSRQ:"",XMSSS:"",XMSSQ:"",XMSSX:""},
                        sss:[],
                    }
                },
                created(){
                    this.sss = NS.Load("../resource/city.json")
                },
                computed:{
                    ssq(){
                        if(!this.data.XMSSS || this.sss.length==0)
                            return [];
                        let sssItem = this.sss.find(o=>o.Name==this.data.XMSSS);
                        return sssItem.City;
                    },
                    ssx(){
                        if(!this.data.XMSSQ || this.ssq.length==0)
                            return [];
                        let ssqItem = this.ssq.find(o=>o.Name==this.data.XMSSQ);
                        return ssqItem.County;
                    }
                },
                methods:{
                    add(){
                        this.type = 1;
                    },
                    save(){

                    },
                    cancle(){
                        this.type = 2;
                    }
                },
                mounted(){
                    var map = new AMap.Map('amap',{
                        center:[121.487899486, 31.249161717],
                        zoom: 10, 
                    });
                    map.setMapStyle('amap://styles/c8e398d02d6a946431e38b3bc2906ecc');  
                    map.on('complete', function(){
                        // 地图图块加载完成后触发
                        let pros = NS.Load("../resource/project.json"),
                            markers = [];
                        console.log(pros);
                        for(let i=0;i<pros.length;i++){
                            let item = pros[i];
                            let marker = new AMap.Marker({
                                position: [item.Lng, item.Lat],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                                offset: new AMap.Pixel(-11, -32),
                                content: '<div class="a_marker">'+(i+1)+'</div>',
                            });
                            markers.push(marker)
                        };
                        console.log(markers);
                        map.add(markers);
                        map.setFitView(markers);

                    });
                   
                }
            })
        }
        </script>
    </component>