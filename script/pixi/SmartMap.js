const {Application, Container, Sprite, Graphics, utils, Point} = PIXI;

const   Event = utils.EventEmitter,
        V2 = NS.Import('Vector2');

function SmartMap(option){
    Event.call(this);
    let options = {
            antialias:true,
            transparent:true,
        },
        mapDiv = option.div;
    Object.assign(options,option);

    let app = new Application(options);
    window.onresize = app.resize();

    let scene = app.stage.addChild(new Container());
    scene.interactive = true;
    scene.name = "Scene";
    //scene.position.set(app.view.width/2, app.view.height/2);

    let screen = app.stage.addChild(new Container());
    screenTop.name = "Screen";

    this.mapDiv    = mapDiv;
    this.app       = app;
    this.view      = app.view;
    this.scene     = scene;
    this.screen    = screen;    
    this.isPlaying = true;

    BindZoomAndPan(this);
    mapDiv.appendChild(app.view);
}

var dampingFlag = null;
var dampCount   = 0;
function BindZoomAndPan(map){
    let {mapDiv, scene} = map;

    let dMove = V2.zero;

    mapDiv.onmousedown = (ev) => {
        if(dampingFlag!=null){
            clearTimeout(dampingFlag);
            dampCount = 0;
            dampingFlag = null;
        }
        dMove.Set(0,0);
        let dp = {
            x: scene.x - ev.offsetX,
            y: scene.y - ev.offsetY
        };

        mapDiv.onmousemove = (ev)=>{
            scene.x = ev.offsetX + dp.x;
            scene.y = ev.offsetY + dp.y;
        }
    };

    mapDiv.onmouseup = (ev)=>{
        if(dMove.magnitude > 5){
            dampingFlag = setTimeout(DampingMove,0, ...[scene,dMove]);
        }
        mapDiv.onmousemove = null;
        //map.emit("MoveEnd");
    }

    mapDiv.onwheel = (ev)=>{
        let s = 0.15*ev.wheelDelta/Math.abs(ev.wheelDelta),
            dx = s * (ev.offsetX - scene.x),
            dy = s * (ev.offsetY - scene.y);
        
        scene.x -= dx;
        scene.y -= dy;
        scene.scale.x *= 1+s;
        scene.scale.y *= 1+s;        
    };

}

function DampingMove(scene,dMove){
    if (dampCount > 50) {
        dampingFlag = null;
        dampCount   = 0;
        clearTimeout(dampingFlag);
        return;
    }
    scene.x += dMove.x;
    scene.y += dMove.y;
    //todo:限制Map拖动区域
    // scene.x = Math.clamp(scene.x+dMove.x, 0, mapObj.view.width);
    // scene.y = Math.clamp(scene.y+dMove.y, 0, mapObj.view.height);
    dampCount++;
    dMove       = dMove.Mul(1 - dampCount ** 2 / 2500);
    dampingFlag = setTimeout(DampingMove, 15, ...[scene, dMove]);

}