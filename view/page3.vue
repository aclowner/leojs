<component>
<style>
    .pro-list, .amap{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .a_marker, .map_marker{
        width: 22px;
        height: 32px;
        background: url("../image/amap-icon.png");
        text-align: center;
        line-height: 22px;
        color: #fff;
    }    
    .map_marker{
        position: relative;
    }
    .map_marker>span{
        position: absolute;
        padding: 0 14px;
        background: var(--blue);
        border-radius: 3px;
        bottom: 35px;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        font-size: 12px;
        display: none;
        white-space: nowrap;
    }
    .active .a_marker, .map_marker.active{
        background-position: -22px 0;
    }
    .map_marker.active>span{
        display: block;
    }

    .pro-search, .lists{
        position: absolute;
        left: 20px;
    }            
    .pro-search{
        height: 40px;
        top: 30px;
        width: 420px;
        background: #fff;
        display: flex;
        align-items: center;
        box-shadow: 0 1px 4px 1px rgba(0,0,0,0.2);
    }
    .lists{                
        width: 360px;
        top: 85px;
        bottom: 20px;                
        overflow: hidden;
        pointer-events: none;                
    }
    .pro-search input{
        border: none;
        background: transparent;
        flex: 1;
    }
    .pro-search .ps-clear{
        height: 28px;
        width: 43px;
        border-left: solid 1px #ddd;
        background: url("../image/map-clear.png") no-repeat center center;
    }
    .pro-search .ps-sear{
        width: 60px;
        height: 40px;
        background: url("../image/map-search.png") no-repeat center center var(--blue);
    }
    .m-list-item{
        height: 164px;
        padding: 20px 16px 0 16px;
        cursor: pointer;
    }
    .m-list-item:hover{
        background: #f3f3f3;
    }
    .m-list-item.active{
        background: #eff5fd;
    }
    .m-list-title{
        justify-content: space-between;
        line-height: 24px;
    }
    .m-list-title .a_marker{
        margin-right: 12px;
    }
    .m-list-title .s-state{
        width: 60px;
        height: 20px;
        background: rgba(57, 129, 227, .1);
        border-radius: 1px;
        line-height: 20px;
        text-align: center;
        color: var(--blue);
        font-size: 14px;
        margin-top: 1px;
        margin-left: 14px;
    }
    .m-list-title .s-nn{
        flex: 1;
        overflow: hidden;
    }
    .m-list-title .s-name{
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .info-text{
        width: 223px;
        padding: 14px;
        line-height: 28px;
    }
    .info-img{
        width: 95px;
        height: 72px;
        border: solid 1px #dfe2e6;
        background: #eff0f2;
        border-radius: 1px;
        margin-top: 20px;
    }
    .list-con{
        background: #fff;
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
        <loading v-if="loaded==false"></loading>
    <div class="title flex">
        <span>{{$route.params.title}}</span>
        <div class="ope">
            <button v-if="type==2" class="btn green mr" @click="add()">添加项目</button>
            <template v-if="type==1"><button class="btn blue mr" @click="save">保存</button><button class="btn" @click="cancle">取消</button></template>
        </div>
    </div>
    <div class="con box">
        
        <div class="pro-list" v-show="type==2">
            <div class="amap" id="amap" ></div>
            <div class="pro-search">
                <input type="text" v-model="proSearch"><a class="ps-clear" v-show="proSearch.length>0"></a><a class="ps-sear"></a>
            </div>
            <div class="lists"><scroll>
                <div class="list-con">
                <div :class="['m-list-item',{active:mi.Id==active}]" v-for="(mi,i) in listShow" @click="proClick(mi,i)">
                    <div class="m-list-title flex">
                        <span class="flex s-nn"><span class="a_marker">{{(i+1)||"--"}}</span><span class="s-name">{{mi.XMMC||"--"}}</span></span>                                
                    </div>
                    <div class="m-list-info flex">
                        <div class="info-text">
                            <div>项目负责人：{{mi.XMFZR||"--"}}</div>
                            <div>开工日期：{{mi.KGRQ||"--"}}</div>
                            <div>竣工日期：{{mi.JGRQ||"--"}}</div>
                        </div>
                        <div class="info-img"></div>
                    </div>
                </div>
                </div>
            </scroll>                        
            </div>
        </div> 
        <scroll v-show="type==1">
            <div class="pro-add">
                <form-row name="项目名称：" class="must"><input type="text" v-model="data.XMMC"></form-row>
                <form-row name="项目简称：" ><input type="text" v-model="data.XMJC"></form-row>
                <div class="flex">
                    <div class="col6"><form-row name="开始日期：" ><leo-date :value="data.KSRQ"></leo-date></form-row></div>
                    <div class="col6"><form-row name="结束日期：" ><leo-date :value="data.JSRQ"></leo-date></form-row></div>
                </div>
                <form-row name="项目负责人："><input type="text" v-model="data.XMJC"></form-row>
                <form-row name="项目所属区域：">
                    <div class="flex">
                        <div class="col4 "><leo-select placeholder="省" type="2" :list="sss" :value.sync="data.XMSSS" @change="()=>{data.XMSSQ='';data.XMSSX='';}"></leo-select></div>
                        <div class="col4 ssq"><leo-select placeholder="市" type="2" :list="ssq" :value.sync="data.XMSSQ" @change="()=>{data.XMSSX='';}"></leo-select></div>
                        <div class="col4 "><leo-select placeholder="区县" type="2" :list="ssx" :value.sync="data.XMSSX"></leo-select></div>                            
                    </div>
                </form-row>
                <form-row name="具体地址：">
                    <input-filter @change="addressFilter" :value.sync="data.JTDZ" :filters="addressSels" @fclick="addressClick"></input-filter>
                </form-row>
                <form-row name="项目描述：">
                    <textarea v-model="data.XMMS" ></textarea>
                </form-row>
            </div>                    
        </scroll>               
    </div>

    <popup ref="popup" ></popup>
    </div>
</template>
<script>    
NS.Component(["components/inputFilter"]);
let editObj = {XMMC:"",XMJC:"",KSRQ:"",JSRQ:"",XMSSS:"",XMSSQ:"",XMSSX:"",JTDZ:"",Lng:"",Lat:""};
function page3(){
    Object.assign(this,{
        data(){
            return {
                loaded:false,
                list:[],
                type:2,
                data:JSON.parse(JSON.stringify(editObj)),
                sss:[],
                addressSels:[],
                proSearch:"",
                active:0,
            }
        },
        created(){
            this.sss = NS.Load("../resource/city.json")
        },
        computed:{
            listShow(){
                if(this.proSearch.length==0)
                    return this.list;
                return this.list.filter(o=>o.XMMC.indexOf(this.proSearch)>=0);
            },
            ssq(){ 
                //省市区 -- 市
                if(!this.data.XMSSS || this.sss.length==0)
                    return [];
                let sssItem = this.sss.find(o=>o.Name==this.data.XMSSS);
                return sssItem.City;
            },
            ssx(){
                //省市区 -- 区
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
                if(!this.data.XMMC){
                    this.$refs.popup.alert("请填写项目名称，如需查看地图请填写正确地址！");
                    return;
                }                            
                this.type = 2;
                this.data.Id = this.list.length + 1;
                this.list.push(this.data);                        
                this.data = JSON.parse(JSON.stringify(editObj));
            },
            cancle(){
                this.type = 2;
            },
            addressFilter(nv){       
                //地址改变先清空经纬度
                this.data.Lat = "";
                this.data.Lng = "";
                let ssqQ = this.data.XMSSQ,
                    ssqX = this.data.XMSSX;
                //有地级市、具体地址 开始匹配地址
                if(nv.length==0||ssqQ.length==0){
                    this.addressSels = [];
                    return;
                }   
                AMap.service('AMap.PlaceSearch',()=>{
                    var placeSearch = new AMap.PlaceSearch({
                        // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
                        city: ssqX||ssqQ
                    });                  
                    placeSearch.search(nv, (status, result)=>{
                        // 查询成功时，result即对应匹配的POI信息
                        if(status=="complete")
                            this.addressSels = result.poiList.pois.map(o=>{
                                return {Id:o.id,Name:o.name,Lat:o.location.lat,Lng:o.location.lng}
                            });
                    })
                });
            },
            addressClick(da){   //地址筛选点击选择，赋值金纬度
                this.data.Lat = da.Lat;
                this.data.Lng = da.Lng;
            },
            proClick(mi,i){
                this.active = mi.Id;
                let marker = this.markers[i];
                if(marker){
                    marker.setTop();
                    marker.setAnimation("AMAP_ANIMATION_DROP");

                    if(this.labelMarker)
                        this.layer.remove(this.labelMarker); 

                    console.log(mi);
                    this.map.setCenter([mi.Lng,mi.Lat]);

                    let elems = document.querySelectorAll(".map_marker");
                    for(let i=0;i<elems.length;i++){
                        let el = elems[i];
                        if(el.getAttribute("did")==mi.Id)
                            el.classList.add("active");
                        else
                            el.classList.remove("active");
                    }
                }   
            }
        },
        mounted(){
            //实例化地图
            this.map = new AMap.Map('amap',{
                center:[121.487899486, 31.249161717],
                zoom: 10, 
            });
            this.map.setMapStyle('amap://styles/c8e398d02d6a946431e38b3bc2906ecc');  
            this.map.on('complete', ()=>{
                // 地图图块加载完成后触发
                this.list = NS.Load("../resource/project.json"); 
                this.loaded = true;
            });                   
        },
        watch:{
            listShow(nv){
                this.map.clearMap();
                this.markers = [];
                for(let i=0;i<nv.length;i++){
                    let item = nv[i];
                    let marker = new AMap.Marker({
                        position: [item.Lng, item.Lat],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        offset: new AMap.Pixel(-11, -32),
                        content: "<div class='map_marker' did="+item.Id+">"+(i+1)+"<span>"+item.XMMC+"</span></div>",
                    });
                    this.markers.push(marker);                    
                };
                console.log(this.markers);
                this.map.add(this.markers);
                this.map.setFitView();
            }
        }
    })
}
</script>
</component>