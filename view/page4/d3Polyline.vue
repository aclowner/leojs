<component>
<style>
.split
{
	stroke: #ddd;
	stroke-width:1;
}
.axis-y path
{
	display: none;
}
.axis-y text
{
	fill:#bbb;
	font-size: 0.8em;
}
.axis-x text
{
	fill:#666;
	font-size: 0.8em;
}
.axis-x text.xAxis-h
{
	fill:#fff;
	font-size: 1em;
}
.hover-box
{
	fill: url(#rect1);
}
.overlay
{
	fill:none;
	pointer-events: all;
}
.htext text
{
	text-anchor: middle;  /* 文本水平居中 */
    dominant-baseline: middle; /* 文本垂直居中 */
    fill: #ccc;
    font-size: 1em;
}
.htext text.tnum
{
	font-size: 2em;
	fill: #fff;
}

.polyline{
	stroke-dasharray: 1000;             /* //设置虚线的间隔长度 */
    stroke-dashoffset: 1000;             /* 设置线段偏移长度 */
    animation: dash 2.5s ease-in-out forwards;
}
@keyframes dash {	
	0%{
		stroke-dashoffset: 1000;
	}
	100%{
	    stroke-dashoffset: 0;
	}
}
</style>
<template>
    <svg width="100%" height="100%" id="polyline" ref="svg" :viewBox="viewbox">
        <g class="split"></g>
        <g class="polyline"></g>
        <g class="axis-y"></g>
        <g class="axis-x"></g>
        <g class="hover"></g>
        <rect class="overlay" @mousemove="overlayMove($event)"></rect>
        <defs> 
            <linearGradient id="linear0" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ef0d76"/> <stop offset="100%" stop-color="#fcfb0c"/>
            </linearGradient>
            <linearGradient id="linear1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f7f809"/> <stop offset="100%" stop-color="#31fde0"/>
            </linearGradient>
            <linearGradient id="rect1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#8876f9" stop-opacity=".8"/> <stop offset="100%" stop-color="#7685f8" stop-opacity=".9"/>
            </linearGradient>           
            <filter id="f1">
                <feColorMatrix tpye="matrix" result="color" values="
                0 0 0 0.73 0
                0 0 0 0.3 0
                0 0 0 0.97 0
                0 0 0 0.8 0
                "></feColorMatrix>
                <feGaussianBlur in="color" stdDeviation="4" result="blur"></feGaussianBlur>
                <feOffset in="blur"  dx="0" dy="0" result="offset"></feOffset>
                <feMerge>
                    <feMergeNode in="offset"></feMergeNode>
                    <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>							     
            </filter>
        </defs>
    </svg>
</template>
<script>
function d3Polyline(){
    Object.assign(this,{
        name:"d3-polyline",
        props:["value"],
        data(){
            return {
                id: "#polyline",
                size:{width:0,height:0},
                week:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
                config:{left:50,bottom:60,}
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
                this.draw();
            },
            draw(){
                let maxValue = 0;
                for(let i=0;i<this.value.length;i++)
                {
                    let tm = d3.max(this.value[i].val);
                    maxValue = maxValue > tm ? maxValue : tm;
                }

                let yScale = d3.scale.linear().domain([0,maxValue*1.1]).range([this.size.height-this.config.bottom,0]),
                    xScale = d3.scale.linear().domain([0,7]).range([1,this.size.width-1]);

                this.xScale = xScale;
                    
                let splits = this.svg.select(".split").selectAll('line').data(this.value[0].val)
                .enter()
                .append('line')
                .attr('x1',(d,i)=>xScale(i))
                .attr('y1',0)
                .attr('x2',(d,i)=>xScale(i))
                .attr('y2',this.size.height)
                .attr('class',(d,i)=>{return i==0||i==this.config.length-1 ? 'ln' : 'ls'});
                
                let linePath = d3.svg.line()
                    .x((d,i)=>xScale(i))
                    .y((d)=>yScale(d))
                    .interpolate("basis");
                this.svg.select(".polyline")
                    .selectAll('path').data(this.value)
                    .enter()
                    .append('path')
                    .attr('class','polyline')
                    .attr('d',(d)=>linePath(d.val))
                    .attr("fill","none")
                    .attr("stroke-width","3px")
                    .attr("stroke",(d,i)=>"url(#linear"+i+")")
                    .attr('filter','url(#f1)');

                let yAxis = d3.svg.axis().scale(yScale).orient("left");
                this.svg.select(".axis-y")
                    .attr("transform","translate("+this.config.left+",0)")
                    .call(yAxis);

                let step = this.size.width / 7;
                this.step = step;
                let xAxis = this.svg.select(".axis-x")
                    .attr("transform","translate(0,"+(this.size.height-this.config.bottom/2)+")")
                    .selectAll("text").data(this.week)
                    .enter()
                    .append("text")
                    .text(d=>d)
                    .attr('x',(d,i)=>{return step/2 + step*i})
                    .attr('dx','-2em')
                    .attr('dy','1em');

                let hg = this.svg.select(".hover").style('display','none');
                let hb = hg.append("rect").classed('hover-box',true)
                    .attr('width',step)
                    .attr('height',this.size.height+10);

                let vs = this.size.height/4,	
                    t1 = hg.append('g').classed('t1',true).classed('htext',true),
                    t2 = hg.append('g').classed('t2',true).classed('htext',true).attr('transform','translate(0,'+vs+')'),
                    t3 = hg.append('g').classed('tt',true).classed('htext',true).attr('transform','translate(0,'+vs*2+')');
                t1.append('text').text(this.value[0].key).attr('x',step/2).attr('y',vs);
                t2.append('text').text(this.value[1].key).attr('x',step/2).attr('y',vs);
                t3.append('text').text('Total').attr('x',step/2).attr('y',vs);	
                let v1t = t1.append('text').classed('tnum',true).text(this.value[0].key).attr('x',step/2).attr('y',vs*0.7),
                    v2t = t2.append('text').classed('tnum',true).text(this.value[1].key).attr('x',step/2).attr('y',vs*0.7),
                    vtt = t3.append('text').classed('tnum',true).text('Total').attr('x',step/2).attr('y',vs*0.7);
                this.v1t = v1t;
                this.v2t = v2t;
                this.vtt = vtt;
                
                this.svg.select(".overlay")
                .attr("x",0)
                .attr("y",0)
                .attr("width",this.size.width)
                .attr("height",this.size.height)
                .on("mouseover",()=>{hg.style("display",null)})
                .on("mouseout",()=>{
                    hg.style("display","none");
                    d3.selectAll(splits[0]).attr('stroke','#2c2a4f');
                    d3.selectAll(xAxis[0]).classed('xAxis-h',false);
                });
            },
            overlayMove(ev){
                console.log(ev);
                let mouseX = ev.offsetX;

                let x0 = this.xScale.invert(mouseX),
                    index = Math.floor(x0);
                this.svg.select(".hover").attr('transform','translate('+this.step*index+',-10)');

                this.v1t.text(this.value[0].val[index+1]);
                this.v2t.text(this.value[1].val[index+1]);
                this.vtt.text(this.value[0].val[index+1]+this.value[1].val[index+1]);
            }
        }
    })
}
</script>
</component>