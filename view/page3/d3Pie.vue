<component>
    <style>
        .pie-line{
            opacity: .6;
            stroke: #aaa;
            stroke-width: 1px;
            fill: none;
        }
        .pie-line-point{
            fill:#fff;
            opacity: 0.6;
        }
        .pie-text{
            fill:#555;
            font-family: "微软雅黑";
            font-size: 14px;
            font-weight: normal;
        }
    </style>
    <template>
        <svg width="100%" height="100%" id="pie" ref="svg" :viewBox="viewbox">            
        </svg>
    </template>
    <script>
    function d3Pie(){
        Object.assign(this,{
            name:"d3-pie",
            props:["list"],
            data(){
                return {
                    id: "#pie",
                    size:{width:0,height:0},
                    color:["#00db58","#ffba2a","#ff1a56","#00acee"],
                    arc:{},
                }
            },
            computed:{
                viewbox(){
                    return "0 0 "+this.size.width + " " + this.size.height;
                }
            },
            mounted(){
                let elemt = this.$refs.svg;
                this.size.width = elemt.clientWidth;
                this.size.height = elemt.clientHeight;
                this.init();
            },
            methods:{
                init(){
                    this.svg = d3.select(this.id)
                    let svgg = this.svg.append("g").attr("transform","translate("+this.size.width/2+","+this.size.height/2+")");
                    console.log(this.svg);
                    svgg.append("g").attr("class","bg-border")
                    svgg.append("g").attr("class","pies");
                    svgg.append("g").attr("class","labelT");
                    svgg.append("g").attr("class","labelB");
                    svgg.append("g").attr("class","lines");
                    svgg.append("g").attr("class","points");
                    svgg.append("g").attr("class","bg-center");
                    this.cmpArc();
                },
                cmpArc(){
                    //计算画饼所需参数                    
                    let outerRadius = Math.min(this.size.width-240,this.size.height-100)/2;
                    this.arc.arc = d3.svg.arc().innerRadius(0).outerRadius(outerRadius);                    //实际数据饼图
                    this.arc.arcBor = d3.svg.arc().innerRadius(outerRadius).outerRadius(outerRadius+5);       //中心修饰圆
                    this.arc.arcCen = d3.svg.arc().innerRadius(0).outerRadius(parseInt(outerRadius/2.5));      //边框修饰圆
                    this.arc.liArc = d3.svg.arc().innerRadius(outerRadius-15).outerRadius(outerRadius-25);    //折线起点
                    this.arc.loArc = d3.svg.arc().innerRadius(outerRadius+20).outerRadius(outerRadius+20);    //折线拐点

                    this.draw();
                },
                draw(){                    
                    let sum = d3.sum(this.list,(d)=>{return d.Value}),
                        pie = d3.layout.pie().value((d)=>d.Value).sort(null),
                        pieBg = d3.layout.pie().sort(null),
                        pieData = pie(this.list),
                        bgArr=[1];
                    let arcs = this.svg.select(".pies").selectAll("g")
                        .data(pieData)
                        .enter()
                        .append("g")
                        .append("path")
                        .attr("fill",(d,i)=>this.color[i])
                        .transition()
                        .delay((d,i)=>i*300)
                        .duration(300)
                        .ease("linear")
                        .attrTween("d",(d)=>{
                            let i = d3.interpolate(d.startAngle,d.endAngle);
                            return (t)=>{
                                d.endAngle = i(t);
                                return this.arc.arc(d);
                            }
                        });
                    let arcb = this.svg.select(".bg-border").selectAll("path")
                        .data(pieBg(bgArr))
                        .enter()
                        .append("path")
                        .attr("fill","rgba(0,0,0,0.08)")
                        .transition()
                        .delay(200)
                        .duration(1200)
                        .ease("linear")
                        .attrTween('d', (d)=>{
                            let i = d3.interpolate(d.startAngle, d.endAngle);
                            return (t)=>{
                                d.endAngle = i(t);
                                return this.arc.arcBor(d);
                            }
                        });

                    let arcC = this.svg.select(".bg-center").selectAll("path")
                        .data(pieBg(bgArr))
                        .enter()
                        .append("path")
                        .attr("fill","rgba(255,255,255,0.2)")
                        .transition()
                        .delay(200)
                        .duration(1200)
                        .ease("linear")
                        .attrTween('d', (d)=>{
                            var i = d3.interpolate(d.startAngle, d.endAngle);
                            return (t)=>{
                                d.endAngle = i(t);
                                return this.arc.arcCen(d);
                            }
                        });
                    
                    let point = this.svg.select(".points").selectAll("circle")
                        .data(pieData)
                        .enter()
                        .append("circle")
                        .attr("class","pie-line-point")
                        .attr("cx",(d)=>{
                            return this.arc.liArc.centroid(d)[0];
                        })
                        .attr("cy",(d)=>{
                            return this.arc.liArc.centroid(d)[1];
                        })
                        .transition()
                        .delay((d,i)=>{ return i * 200 + 1200; })
                        .duration(200)		
                        .attrTween("r",(d)=>{
                            var interpolate = d3.interpolate(0,4);
                            return (t)=>{
                                return interpolate(t);
                            }
                        });
                    
                    let line = this.svg.select(".lines").selectAll("polyline")
                        .data(pieData)
                        .enter()
                        .append("polyline")
                        .attr("class","pie-line");
                    line.transition()
                        .delay((d,i)=>{ return i * 200 + 1300; })
                        .duration(200)		
                        .attrTween("points",(d)=>{
                            var interpolate = d3.interpolate(0,100);
                            this._current = interpolate(0);
                            return (t)=>{
                                var ex = interpolate(t);
                                var pos = this.arc.loArc.centroid(d);
                                pos[0] += ex*(this.midAngle(d)<Math.PI?1:-1);
                                return [this.arc.liArc.centroid(d), this.arc.loArc.centroid(d), pos]
                            };
                        });

                    var textT = this.svg.select(".labelT").selectAll("text")
					    .data(pieData)
                        .enter()
                        .append("text")
                        .attr("class","pie-text")
                        .attr("dy", "-.6em")
                        .text((d)=>{return d.data.Value+"："+parseInt(d.value/sum*100) + "%";})
                        .attr("transform",(d)=>{
                            var pos = this.arc.loArc.centroid(d);
                            pos[0] += 98*(this.midAngle(d)<Math.PI?1:-1);
                            return "translate("+ pos +")";
                        })
                        .attr("text-anchor",(d)=>{
                            return this.midAngle(d) < Math.PI ? "end":"start";
                        })
                        .attr("opacity",0)
                        .transition()
                        .delay((d, i)=>{ return i * 200 + 1400; })
                        .duration(100)
                        .attrTween("opacity",(d)=>{
                            var interpolate = d3.interpolate(0,1);
                            return (t)=>{
                                return interpolate(t);
                            }
                        });     

	            var textB = this.svg.select(".labelB").selectAll("text")
					.data(pieData)
					.enter()
					.append("text")
					.attr("class","pie-text")
					.attr("dy", "1.3em")
					.text((d)=>{return "数量："+d.value;})
					.attr("transform",(d)=>{
						var pos = this.arc.loArc.centroid(d);
						pos[0] += 98*(this.midAngle(d)<Math.PI?1:-1);
						return "translate("+ pos +")";
					})
					.attr("text-anchor",(d)=>{
						return this.midAngle(d) < Math.PI ? "end":"start";
					})
					.attr("opacity",0)
					.transition()
					.delay((d,i)=>{ return i * 200 + 1400; })
					.duration(100)
					.attrTween("opacity",(d)=>{
						var interpolate = d3.interpolate(0,1);
						return (t)=>{
							return interpolate(t);
						}
					});
                },
                midAngle(d){
                    return d.startAngle + (d.endAngle - d.startAngle) / 2;
                }
            }
        })
    }
</script>
</component>