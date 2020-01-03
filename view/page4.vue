<component>
    <style>
        .d3-row{
            height: 50%;
        }
        .d3-r1{
            margin-bottom: 20px;
        }
        .d3-r2{
            margin-top: 12px;
            margin-bottom: 10px;
        }
        .d3-row .box{
            margin: 0 15px;
            display: flex;
            flex-direction: column;
            align-items: stretch
        }
        .sb-title{
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            font-size: 18px;
        }
        .sb-con{
            flex: 1;
            margin: 10px 20px; 
        }
    </style>
    <template>
    <div class="page flex-column">
        <div class="title flex"><span>{{$route.params.title}}</span></div>
        <div class="con flex-column">
            <div class="flex d3-row d3-r1">
                <div class="col4 box">
                    <div class="sb-title">饼图</div>
                    <div class="sb-con"><d3-pie :list="pies"></d3-pie></div>
                </div>
                <div class="col4 box">
                    <div class="sb-title">刻度指针</div>
                    <div class="sb-con">
                        <d3-board :value="board"></d3-board>
                    </div>
                </div>
                <div class="col4 box">
                    <div class="sb-title">雷达图</div>
                    <div class="sb-con"><d3-radar :names="radar.names" :values="radar.values"></d3-radar></div>
                </div>
            </div>
            <div class="flex d3-row d3-r2">
                <div class="col6 box">
                    <div class="sb-title">柱状图</div>
                    <div class="sb-con">
                        <d3-bar :value="bar"></d3-bar>
                    </div>
                </div>
                <div class="col6 box">
                    <div class="sb-title">折线图</div>
                    <div class="sb-con">
                        <d3-polyline :value="polyline"></d3-polyline>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </template>
    <script>    
    NS.Component([
        "page4/d3Pie",
        "page4/d3Board",
        "page4/d3Radar",
        "page4/d3Bar",
        "page4/d3Polyline"
    ])
    function page4(){
        Object.assign(this,{
            data(){
                return {
                    board: 55,
                    pies:[{Name:"type01",Value:30},{Name:"type02",Value:44},{Name:"type03",Value:30},{Name:"type04",Value:30}],
                    radar:{names:["html","css","js","jquery","vue","node","java","cSharp"],values:[[60,58,60,62,64,58,48,36],[70,52,55,28,28,52,80,80]]},
                    bar:{up:[30,50,45,80,44,22,66,74,40,58,70,90],down:[48,28,20,40,88,62,43,56,76,69,47,36]},
                    polyline:[
                                {
                                    key:"red",
                                    val:[4200,2400,1600,4800,4700,2900,3700,5950]
                                },
                                {
                                    key:"yellow",
                                    val:[900,2450,5050,2450,1900,6100,5950,3150]
                                }		
                            ]
                }
            },
            created(){
                setInterval(() => {
                        this.randomBoard();
                    }, 3000);
            },
            methods:{
                randomBoard(){
                    this.board = parseInt(Math.random()*10000)/100;                    
                }
            },
            mounted(){
            }
        })
    }
    </script>
</component>