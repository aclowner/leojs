<component>
<style>
.pointer-line{
	stroke: #4ed1b2;
	stroke-width: 2px;
}
.board-number{
	fill:#555;
	font-family: "微软雅黑";
    font-size: 12px;
}
.show-number{
	font-family: "微软雅黑";
	font-size: 22px;
	fill: #fff;
	font-weight: bold;	
}
</style>
<template>
    <svg width="100%" height="100%" id="board" ref="svg" :viewBox="viewbox"></svg>
</template>
<script>
function d3Board(){
    Object.assign(this,{
        name:"d3-board",
        props:["value"],
        data(){
            return {
                id: "#board",
                size:{width:0,height:0},
                number:[0,10,20,30,40,50,60,70,80,90,100],
                arcMin: -Math.PI*3/4,
                arcMax: Math.PI*3/4,
                radius:{},
                arcs:{},
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
                let minr = Math.min(this.size.width-80,this.size.height-80);
                this.radius.out = minr/2;
                this.radius.in = this.radius.out - 20;
                this.radius.center = parseInt(this.radius.out/3);

                this.svg = d3.select(this.id).append("g").attr("transform","translate("+this.size.width/2+","+this.size.height/2+")");

                this.svg.append("g").attr("class","arcBg");
                this.svg.append("g").attr("class","pointer");
                this.svg.append("g").attr("class","arcCenter");
                this.svg.append("g").attr("class","board-number");
                this.svg.append("g").attr("class","number");
                this.svg.append("g").attr("class","title");

                let r = this.radius;
                let arcOut = d3.svg.arc().innerRadius(r.out-2).outerRadius(r.out).startAngle(this.arcMin).endAngle(this.arcMax);
                this.svg.select(".arcBg").append("path")
                    .attr("fill","#9143ff")
                    .attr("d",arcOut);

                let arcIn = d3.svg.arc().innerRadius(r.in-20).outerRadius(r.in).startAngle(this.arcMin).endAngle(this.arcMax);
                this.svg.select(".arcBg").append("path")
                    .attr("fill","#9143ff")
                    .attr("d",arcIn);
                let arcCenter = d3.svg.arc().innerRadius(0).outerRadius(r.center).startAngle(-Math.PI).endAngle(Math.PI);
                this.svg.select(".arcCenter").append("path")
                    .attr("fill","#f696b1")
                    .attr("d",arcCenter);
                
                var pointer = this.svg.select(".pointer").append("line")
                    .attr("class","pointer-line")
                    .attr("x1",0)
                    .attr("y1",0)
                    .attr("x2",0)
                    .attr("y2",-112)
                    .style("transform","rotate("+this.AngleToDeg(0)+"deg)")
                    .transition()
                    .duration(500)

                var boardNumber = this.svg.select(".board-number").selectAll("text")
                    .data(this.number)
                    .enter()
                    .append("text")
                    .attr("class","board-number")
                    .attr("text-anchor","middle")
                    .text((d)=>d)
                    .style("transform",(d,i)=>{
                        var rotate = "rotate("+this.AngleToDeg(d)+"deg)";
                        return rotate +" translate(0,-130px)";
                    });

                var number = this.svg.select(".number").append("text")
                    .attr("class","show-number")
                    .text(this.value)
                    .attr("dy", ".35em")
                    .attr("text-anchor","middle");

                this.updateValue(this.value,0);
            },
            AngleToDeg(data){
                var argle_half = 3/4 * 180 , deg;
                deg = (data-50) / 50 * argle_half;
                return deg;
            },
            updateValue(nv,ov){
                this.svg.select(".pointer")
                    .select("line")
		            .transition()
		            .duration(1000)
		            .styleTween("transform",()=>{
                    let interpolate = d3.interpolate(ov,nv);
                    return (t)=>{
                        return "rotate("+this.AngleToDeg(interpolate(t))+"deg)";
                    }
                });
                this.svg.select(".number").select("text").text(nv)
            }
        },
        watch:{
            value(nv,ov){
                console.log(nv,ov);
                this.updateValue(nv,ov);
            }
        }
    })
}
</script>
</component>