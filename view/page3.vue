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
        </style>
        <template>
            <div class="page flex-column">
            <div class="title flex"><span>{{$route.params.title}}</span></div>
            <div class="con box">
                <div class="amap" id="amap"></div>
            </div>
            </div>
        </template>
        <script>    
        function page3(){
            Object.assign(this,{
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