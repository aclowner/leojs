<component>
<style>
</style>
<template>
    <svg width="100%" height="100%" id="bar" ref="svg" :viewBox="viewbox">
        <defs>
            <linearGradient id="bar1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#70efd1;stop-opacity:1"/>
                <stop offset="100%" style="stop-color:#85dda2;stop-opacity:1"/>
            </linearGradient>
            <linearGradient id="bar2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(145,67,255);stop-opacity:1"/>
                <stop offset="100%" style="stop-color:rgb(246,150,177);stop-opacity:1"/>
            </linearGradient>
        </defs>
    </svg>
</template>
<script>
function d3Bar(){
    Object.assign(this,{
        name:"d3-bar",
        props:["value"],
        data(){
            return {
                id: "#bar",
                size:{width:0,height:0},
                config:{left:20,top:20,barWidth:8}
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
                this.svg = d3.select(this.id);
                this.g1 = this.svg.append("g").classed("bar1",true);
                this.g2 = this.svg.append("g").classed("bar2",true);
                this.barMaxHeight = (this.size.height-50)/2;
                this.draw();
            },
            draw(){
                console.log(this.value);
                if(!this.value.up)
                    return;
                let yScale = d3.scale.linear().domain([0,100]).range([0,this.barMaxHeight]),
                    xScale = d3.scale.linear().domain([1,this.value.up.length]).range([30,this.size.width-40]);

                this.g1.selectAll("rect").data(this.value.up)
                .enter()
                .append("rect")
                .attr('x',(d,i)=>xScale(i+1))
                .attr('width',this.config.barWidth)
                .attr('rx',4)
                .attr('ry',4)
                .attr('fill','url(#bar1)')
                .transition()
                .delay((d,i)=>i*50)
                .duration(500)
                .ease("elastic")
                .attrTween("y",(d)=>{
                    let upBy = this.barMaxHeight + this.config.top;
                    var interpolate = d3.interpolate(upBy,upBy-yScale(d))
                    return (t)=>{
                        return interpolate(t);
                    }
                })
                .delay((d,i)=>i*100)
                .duration(1000)
                .attrTween("height",(d)=>{
                    var interpolate = d3.interpolate(0,yScale(d))
                    return (t)=>{
                        return interpolate(t);
                    }
                });
                
                this.g2.selectAll("rect").data(this.value.down)
                .enter()
                .append("rect")
                .attr('x',(d,i)=>xScale(i+1))
                .attr('y',this.barMaxHeight+30)
                .attr('width',this.config.barWidth)
                .attr('rx',4)
                .attr('ry',4)
                .attr('fill','url(#bar2)')
                .transition()
                .delay((d,i)=>i*100)
                .duration(1000)
                .ease("elastic")
                .attrTween("height",(d)=>{
                    var interpolate = d3.interpolate(0,yScale(d))
                    return (t)=>{
                        return interpolate(t);
                    }
                });
            }
        }
    })
}
</script>
</component>