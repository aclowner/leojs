<component>
<style>
.webs polygon
{
	fill: #ddd;
	fill-opacity: 0.5;
	stroke: gray;
	stroke-dasharray: 10 5;
}
.lines line
{
	stroke: gray;
	stroke-dasharray: 10 5;
}
.texts text
{
	font-size: 14px;
	fill: #555;
}
.areas polygon
{
	fill-opacity: 0.8;
}
</style>
<template>
    <svg width="100%" height="100%" id="radar" ref="svg" :viewBox="viewbox"></svg>
</template>
<script>
function d3Radar(){
    Object.assign(this,{
        props:{
            names:{default:()=>{return []}},
            values:{default:()=>{return []}}
        },
        name:"d3-radar",
        data(){
            return {
                id: "#radar",
                size:{width:0,height:0},
                level:4
            }
        },
        computed:{
            viewbox(){
                return "0 0 "+this.size.width + " " + this.size.height;
            }
        },
        methods:{
            init(){                
                this.svg = d3.select(this.id).append("g").attr('transform', "translate(" + this.size.width/2 + ',' + this.size.height/2 + ')');                
                this.draw();
            },
            draw(){
                let radius = (Math.min(this.size.width,this.size.height) - 100)/2,
                    total = this.names.length,
                    arc = 2*Math.PI,
                    onePiece = arc/total,
                    polygons = {webs:[],webPoints:[]};

                for(let k=this.level;k>0;k--){
                    let webs = "",
                        webPoints = [],
                        r = radius/this.level*k;
                    for(let i=0;i<total;i++){
                        let x = r*Math.sin(i*onePiece),
                            y = r*Math.cos(i*onePiece);
                        webs += x+","+y+" ";
                        webPoints.push({x:x,y:y}); 
                    }
                    polygons.webs.push(webs);
                    polygons.webPoints.push(webPoints);
                }

                //绘制网轴
                let webs = this.svg.append("g").classed("webs",true);
                webs.selectAll("polygon").data(polygons.webs)
                    .enter()
                    .append("polygon")
                    .attr("points",(d)=>{return d});
                //绘制纵轴
                let lines = this.svg.append("g").classed("lines",true);
                lines.selectAll("line").data(polygons.webPoints[0])
                    .enter()
                    .append("line")
                    .attr("x1",0)
                    .attr("y1",0)
                    .attr("x2",(d)=>d.x)
                    .attr("y2",(d)=>d.y);
                
                var rScale = d3.scale.linear().domain([0,100]).range([0,radius]);
                var areasData = [];
                var values = this.values;
                for(var i = 0 ;i<values.length;i++)
                {
                    var value = values[i], area = '', points = [];
                    for(var k=0;k<total;k++)
                    {
                        var r = rScale(value[k]);
                        var x = r*Math.sin(k*onePiece),
                        y = r *Math.cos(k*onePiece);
                        area += x + "," +y + " ";
                        points.push({x:x,y:y});
                    }		
                    areasData.push({polygon:area,points:points});
                }
                console.log(areasData);
                var areas = this.svg.append('g').classed("areas",true);
                areas.selectAll("g")
                    .data(areasData)
                    .enter()
                    .append('g')
                    .attr("class",(d,i)=>{return 'area'+(i+1);});

                for(var i=0;i<areasData.length;i++)	{
                    var area = areas.select('.area'+(i+1)), 
                        areaData = areasData[i];
                    area.append('polygon')
                        .attr('points',areaData.polygon)
                        .attr('stroke',(d,index)=>{return this.getColor(i);})
                        .attr("fill",(d,index)=>{return this.getColor(i)});                
                }

                var textPoints = [];
                var textRadius = radius +30;
                for(var i=0;i<total;i++)
                {
                    var x = textRadius*Math.sin(i*onePiece);
                    var y = textRadius*Math.cos(i*onePiece);
                    textPoints.push({x:x,y:y})
                }
                var texts = this.svg.append('g').classed("texts",true);
                texts.selectAll("text").data(textPoints)
                    .enter()
                    .append('text')
                    .attr('x',(d)=>{return d.x})
                    .attr('y',(d)=>{return d.y})
                    .attr('dx','-1em')
                    .attr('dy',(d)=>{return d.y>=4?"0":"0.5em"})
                    .text((d,i)=>{return this.names[i]});
            },
            getColor(idx){
                var palette = [
                '#f9f90a', '#f61b78','#5ab1ef', '#ffb980', '#d87a80',
                '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ]
                return palette[idx % palette.length];
            }
        },
        mounted(){
            let elemt = this.$refs.svg;
            this.size.width = elemt.clientWidth;
            this.size.height = elemt.clientHeight;
            this.init();
        }
    });
}
</script>
</component>