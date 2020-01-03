/**
 * @name leo.js
 * @version 1.0.0
 * @author aclowner
 * @description 前端开发通用、常用数据处理、页面处理类
 * @email 591043660@qq.com
 * 
 * 
 * 1.0.0 (2019/06/01)
 *   
 */

//网络请求路径
const _console = {
    debug: true,
    start: "color:#fff;line-height:32px;padding:0 15px;border-radius:3px;font-size:16px;letter-spacing:5px;font-family:微软雅黑;font-weight:bold;background:linear-gradient(to right bottom, #8876f9, #7685f8)",
    log: "color:#00baff;font-size:14px;",
    warn: "color:#f0a92c;font-size:14px;",
    error: "color:#ff0000;font-weight:bold;font-size:16px;",
},
    path = {
        api: "http://127.0.0.1:8088/",
    };
let _body = document.querySelector("body");
function Leo() {
    //注册滚动条处理事件
    scrollInit();
    console.log("%c欢迎使用Leo_1.0.js由ylong发布", _console.start);
}
//异步请求数据接口（post）
Leo.RequestApi = function (cf) {
    let promise = new Promise((resolve, reject) => {
        RequestPost(path.api + cf.url, cf.data || {}, (re = {}) => {
            console.log(re);
            let result = JSON.parse(re);
            //ResultData.Result==0或者ResultData没有返回或者Result.Data.Result没有返回时认为数据操作成功
            if (!result.state)
                resolve(result.data);
            else {
                //统一处理数据不成功，cf.dataState=true时返回页面自定义处理数据不成功
                !cf.dataState && (Leo.Alert(result.ResultData.ErrMsg))
                reject(result.ResultData.ErrMsg);
            }
        },
            (err) => {
                //统一处理请求不成功，cf.requestState=true是返回页面自定义处理请求不成功
                !cf.requestState && (Leo.Alert(err))
                reject(err)
            });
    });
    return promise;
}
//异步请求数据json
Leo.RequestJson = function (cf) {
    let promise = new Promise((resolve, reject) => {
        RequestGet(cf.url, (suc) => {
            //成功返回数据
            resolve(suc);
        }, (err) => {
            //统一处理请求不成功，cf.requestState=true是返回页面自定义处理请求不成功
            !cf.requestState && (Leo.Alert(err))
            reject(err)
        }, true);
    });
    return promise;
}
//同步请求资源加载
Leo.RequestLoad = function (url) {
    if (!url)
        return;
    let re = "";
    RequestGet(url, (suc) => {
        //成功返回数据
        re = suc;
    }, (err) => {
        console.log(err);
        //统一处理请求不成功，cf.requestState=true是返回页面自定义处理请求不成功
        !cf.requestState && (Leo.Alert(err))
    }, false);
    return re;
}
let _loadDiv = null;
Leo.Loading = function (s) {
    if (s) {
        _loadDiv = document.createElement('div');
        _loadDiv.innerHTML = "<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>";
        _loadDiv.classList.add("loading");
        _body.append(_loadDiv);
    } else {
        if (_loadDiv) {
            _body.removeChild(_loadDiv);
        }
    }
}
//提示框、确认框
Leo.Alert = function (message, cancle, okFn, cancleFn) {
    let _alertDiv = document.createElement('div');
    _alertDiv.innerHTML = `<div class='pp-title'>提示</div>
                            <div class='a-body'>${message}</div>
                            <div class='a-btn'><buttun className="btn blue minw">确定</buttun><buttun className="btn minw">取消</buttun></div>`;
    _alertDiv.classList.add("alert");
    //加载弹出框，给body添加遮罩
    _body.append(_alertDiv);
    _body.classList.add("popuping");
}
//操作短暂提示框，2s后消失
Leo.Hit = function () {
}
//弹出框
Leo.Popup = function (title, html) {
    let uid = "pp-" + guid(),
        _popupDiv = document.createElement('div');
    _popupDiv.innerHTML = "<div class='pp-title'>" + title + "</div><div class='pp-body'><div class='_scroll'><div class='_con'>" + html + "</div></div></div>";
    _popupDiv.classList.add("popup");
    _popupDiv.setAttribute("id", uid);
    _body.append(_popupDiv);

    _body.classList.add("popuping");

    return uid;
}
Leo.PopupClose = function (id) {
    //
    let pp = document.querySelector(id ? ("#" + id) : ".popup");
    pp.remove();
    _body.classList.remove("popuping");
}

//当前日期（yyyy/NM/dd/date/day/dayCn）
Leo.Date = function (t, d, seperator = "-") {
    let date = d ? new Date(d) : new Date(),
        year = date.getFullYear(),
        month = (date.getMonth() + 1).toString().padStart(2, '0'),
        dd = date.getDate().toString().padStart(2, '0');
    var type = typeof (t), arr = [], result = [];
    if (type == "undefined")
        return [year, month, dd].join(seperator);
    else if (type == "string")
        arr.push(t);
    else if (type == "object")
        arr = t;
    $.each(arr, function (i, o) {
        if (o == "yyyy")
            result.push(year);
        else if (o == "MM")
            result.push(month);
        else if (o == "dd")
            result.push(dd);
        else if (o == "date")
            result.push([year, month, dd].join(seperator));
        else if (o == "day")
            result.push(date.getDay());
        else if (o == "dayCn") {
            var week = ["日", "一", "二", "三", "四", "五", "六"];
            result.push(week[date.getDay()]);
        }
    });
    return type == "string" ? result[0] : result;
}
//增加天
Leo.DateAddDay = function (date, days, seperator = "-") {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    var m = d.getMonth() + 1;
    return d.getFullYear() + seperator + m.toString().padStart(2, "0") + seperator + d.getDate().toString().padStart(2, '0');
}
Leo.Guid = function () {
    return guid();
};

//输入对象数据，添加样式
window.log = function () {
    if (!_console.debug)
        return;
    console.log.call(console, '%c' + [].slice.call(arguments).join(" "), _console.log);
}
//输出数据，默认样式
window.logO = function () {
    if (!_console.debug)
        return;
    console.log.apply(console, [].slice.call(arguments));
}
//输出警告信息，添加样式
window.warn = function () {
    console.warn.call(console, '%c' + [].slice.call(arguments).join(" "), _console.warn);
}
//输出错误信息，添加样式
window.error = function () {
    console.error.call(console, '%c' + [].slice.call(arguments).join(" "), _console.error);
}

/**私有函数 */
//http请求
//get请求，默认为异步
function RequestGet(src, suc, err, asyn = false) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                try { suc(ajax.responseText); } catch (e) { err(e); }
            }
        }
    };
    ajax.open('GET', src, asyn);
    ajax.send(null);
}
//post请求
function RequestPost(src, param, suc, err) {
    var ajax = new XMLHttpRequest();    
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                try { suc(ajax.response); } catch (e) { err(e); }
            }
        }
    };
    ajax.open('POST', src, true);
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.send(JSON.stringify(param));
}
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
* 滚动条
*/
//滚动相关class
let _scroll = ["_scroll", "_con", "_bar"],
    _scrollMove = {},
    _sMouseWheel = "mousewheel";
//滚动条事件注册
function scrollInit() {
    //兼容鼠标滚轮事件
    if (!("onmousewheel" in document))
        _sMouseWheel = "DOMMouseScroll";
    //在body上添加事件，通过冒泡找到指定元素处理事件
    _body.addEventListener(_sMouseWheel, function (e) {
        let ev = e || window.event,
            target = ev.target || ev.srcElement;
        while (target !== _body) {
            //当元素为_scroll时触发滚动事件
            if (target.className.includes(_scroll[0])) {
                let con = target.firstElementChild,
                    ch = con.clientHeight,
                    sh = con.scrollHeight,
                    st = con.scrollTop;
                if (sh > ch) {
                    let iWheelDelta = 0;
                    if (ev.wheelDelta) {
                        iWheelDelta = ev.wheelDelta / 120;
                    } else {
                        iWheelDelta = -ev.detail / 3;
                    }
                    con.scrollTop += -1 * 30 * iWheelDelta;
                    target.lastChild.style.top = (con.clientHeight * con.scrollTop / con.scrollHeight) + "px";
                }
                break;
            }
            target = target.parentNode;
        }
    });
    _body.addEventListener("mousedown", function (e) {
        let ev = e || window.event,
            target = ev.target || ev.srcElement;
        while (target !== _body) {
            if(typeof(target.className) != "string")
                return;
            if (target.className.includes(_scroll[2])) {
                let con = target.previousElementSibling;
                _scrollMove.barMove = true;
                _scrollMove.pageY = ev.pageY;
                _scrollMove.maxMove = con.clientHeight - target.clientHeight;
                _scrollMove.barOT = target.offsetTop;
                _scrollMove.bar = target;
                _scrollMove.con = con;
                con.setAttribute("onselectstart", "return false;");  //chrome禁止内容选中
                con.setAttribute("unselectable", "on");              //IE禁止内容选中
                con.classList.add("user-unsel");               //ff禁止内容选中
                _body.addEventListener("mousemove", scrollMouseMove);  //按下滚动条时添加鼠标移动事件，鼠标弹起时移除事件
                _body.addEventListener("mouseup", scrollMouseUp);
            }
            target = target.parentNode;
        }
    });

    //循环监听._scroll元素的变化
    setInterval(scrollWatch, 167);
}
function scrollMouseMove(e) {
    let ev = e || window.event,
        target = ev.target || ev.srcElement;
    if (_scrollMove.barMove) {
        let ot = ev.pageY - _scrollMove.pageY + _scrollMove.barOT;
        ot = ot < 0 ? 0 : ot;
        ot = ot > _scrollMove.maxMove ? _scrollMove.maxMove : ot;
        _scrollMove.bar.style.top = ot + "px";
        var st = ot * _scrollMove.con.scrollHeight / _scrollMove.con.clientHeight;
        _scrollMove.con.scrollTop = st;
    }
}
function scrollMouseUp() {
    if (_scrollMove.barMove) {
        _scrollMove.barMove = false;
        //移除禁止选中
        _scrollMove.con.removeAttribute("onselectstart");
        _scrollMove.con.removeAttribute("unselectable");
        _scrollMove.con.classList.remove("user-unsel");
        _body.removeEventListener("mousemove", scrollMouseMove);
        _body.removeEventListener("mouseup", scrollMouseUp);
    }
}
//滚动条滚动区域监听
function scrollWatch() {
    let sall = document.getElementsByClassName(_scroll[0]);
    for (let i = 0; i < sall.length; i++) {
        let elem = sall[i],
            con = elem.firstElementChild;
        if (con.scrollHeight > con.clientHeight) {
            if (!elem.lastChild.className || !elem.lastChild.className.includes(_scroll[2])) {
                let _bar = document.createElement('div');
                _bar.classList.add(_scroll[2]);
                _bar.classList.add("_v");
                _bar.style.height = (con.clientHeight * con.clientHeight / con.scrollHeight) + "px";
                _bar.style.top = (con.clientHeight * con.scrollTop / con.scrollHeight) + "px";
                elem.append(_bar);
            } else {
                elem.lastChild.style.height = (con.clientHeight * con.clientHeight / con.scrollHeight) + "px";
                elem.lastChild.style.top = (con.clientHeight * con.scrollTop / con.scrollHeight) + "px";
            }
        }
        else {
            //如果不需要滚动，但页面有滚动条，移除掉
            if (elem.lastChild.className && elem.lastChild.className.includes(_scroll[2]))
                elem.removeChild(elem.lastChild);
        }
    }
}


/********************************* 默认vue组件 **********************************/
//自定义指令
Vue.directive("focus", (el, value) => {
    if (value)
        el.focus();
    else
        el.blur();
});
//checkbox选择
Vue.component("checkbox", {
    props: {
        check: { default: false },
        val: { default: "" },
    },
    template: `<a :class="['checkbox',{checked:checked}]" @click="ckClick"></a>`,
    data() {
        return {
            checked: this.check
        }
    },
    methods: {
        ckClick() {
            this.checked = !this.checked;
            this.$emit("change", this.checked, this.val);
        }
    },
    watch: {
        check(v) {
            this.checked = v;
        }
    }
});
//滚动
Vue.component("scroll", {
    template: `<div class="_scroll">
            <div class="_con">
                <slot></slot>
            </div>
        </div>`
});
//
Vue.component("page-tag", {
    props: ["tags"],
    template: `<div class="tag"><i :class="['icon','i-'+tags[1]]"></i><span>{{tags[0]}}</span></div>`,
});
//行
Vue.component("row", {
    props: ["name"],
    template: `<div class="row">
            <div class="key" v-if="name">{{name==0?"":name}}</div>
            <div class="val"><slot></slot></div>
        </div>`,
});
//input tag
Vue.component("input-tag", {
    props: ['before', 'after'],
    template: `<div class="input-tag">
            <span v-if="before" class="before">{{before}}</span>
            <slot></slot>
            <span v-if="after" class="after">{{after}}</span></div>
        </div>`,
});
//tab-btns
Vue.component("tab-btns", {
    props: ["list", "active"],
    template: `<div class="tab-btns">
            <a v-for="(a,i) in list" :class="{active:active==i+1}" @click="change(i)">
                <i :class="['icon','i-'+a.icon]" v-if="a.icon"></i>
                {{a.name}}
            </a>
        </div>`,
    methods: {
        change(i) {
            this.$emit('update:active', i + 1);
        }
    }
});

Vue.component("radio-group", {
    props: {
        'list': Array,
        'type': { default: 1 },
        'value': { default: "" },
        'must': { default: false },//是否必选
    },
    data() {
        return {
            active: this.value
        }
    },
    template: `<div class="radio-group">
            <template v-if="list.length>0"> 
                <template v-if="type==1">
                    <div class="radio-item" v-for="(o,i) in list" ><a :class="['radio',{checked:o.Id==active}]" @click="radioClick(o.Id)"></a>{{o.Name}}</div>
                </template>
                <template v-else-if="type==2">
                    <div class="radio-item" v-for="(o,i) in list" ><a :class="['radio',{checked:o==active}]" @click="radioClick(o)"></a>{{o}}</div>
                </template>
                <template v-else-if="type==3">
                    <div class="radio-item" v-for="(o,i) in list" ><a :class="['radio',{checked:i==active}]" @click="radioClick(i)"></a>{{o}}</div>
                </template>
                <template v-else>
                    <div class="radio-item" v-for="(o,i) in list" ><a :class="['radio',{checked:i==active-1}]" @click="radioClick(i+1)"></a>{{o}}</div>
                </template>
                
            </template>
            <template v-else>暂无可选数据</template>
        </div>`,
    methods: {
        radioClick(v) {
            if (this.active == v) {
                if (!this.must){}
                    this.active = "";
            }
            else {
                this.active = v;                
            }            
            this.$emit("update:value",this.active);
        }
    },
    watch: {
        value(n) {
            this.active = n
        }
    }
});

/********************************* js 扩展 **************************************/
/**
* Number 扩展
*/
//千万分数据处理
Number.prototype.toThousands = function () {
    return (this || 0).toString().toThousands();
}

/**
* String 扩展
*/
//千分位数据处理
String.prototype.toThousands = function () {
    var num = this || "0",
        result = '';
    if (num.indexOf(".") >= 0) {
        let ns = num.split(".");
        num = ns[0];
        result = "." + ns[1];
    }
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}
//驼峰转短横线
String.prototype.transLink = function(link="-"){
    return this.replace(/([A-Z][A-Z][a-z]|[a-z][A-Z])/g,function(x){
        return x[0] + link +x.slice(1);
    }).toLowerCase();
}
/**
* Array 扩展
*/
//list to tree
Array.prototype.listToTree = function (id = "Id", pid = "Pid", child = "child") {
    let r = [],
        hash = {},
        len = this.length;
        arr = JSON.parse(JSON.stringify(this));
    for (let i = 0; i < len; i++) {
        hash[arr[i][id]] = arr[i];
    }
    for (let j = 0; j < len; j++) {
        var aVal = arr[j], hashVP = hash[aVal[pid]];
        if (hashVP) {
            aVal.Pname = hashVP.Name;
            !hashVP[child] && (hashVP[child] = []);
            hashVP[child].push(aVal);
        } else {
            r.push(aVal);
        }
    }
    return r;
}
//tree to list
Array.prototype.treeToList = function (pid=0, id="id", child = "child") {
    var arr = JSON.parse(JSON.stringify(this));
    var result = [], len = arr.length;
    for (var i = 0; i < len; i++) {
        let ai = arr[i];
        ai.pid = pid;
        result.push(ai);
        if (ai[child] && ai[child].length > 0) {
            result = result.concat(ai[child].treeToList(ai[id],id,child));
            delete ai[child];
        }
    }
    return result;
}
Array.prototype.toObject = function(t=1)
{
    let re = {};
    for(let i = 0; i<this.length;i++){
        re[this[i]] = t==1 ? "" : [];
    }
    return re;
}
//根据部分id找出完整父级结构数据
Array.prototype.listFindParents = function(cids,id="id"){
    let arr = JSON.parse(JSON.stringify(this)),
        re = [],
        hash = {};
    for (let i = 0; i < arr.length; i++) {
        hash[arr[i][id]] = arr[i];
    }
    for(let j =0; j<cids.length; j++){
        re = getPIds(hash,cids[j],re,id);
    }
    if(re==[])
        return re;
    else
        return re.listToTree("id","pid","child");
}
function getPIds(da,id,re=[],idStr="id"){
    let item = da[id];
    if(!item)
        return re;
    if(re.filter(o=>o[idStr]==id).length==1)
        return re;
    re.push(item);
    if(item.pid){        
        getPIds(da,item.pid,re,idStr);
    }
    return re;
}

//求和值
Array.prototype.sum = function (k) {
    if (!this || this.length == 0)
        return 0;
    if (k) {
        return this.reduce(function (partial, item) {
            return partial + parseFloat(item[k]);
        }, 0);
    }
    else {
        return this.reduce(function (partial, value) {
            return partial + parseFloat(value);
        }, 0);
    }

};