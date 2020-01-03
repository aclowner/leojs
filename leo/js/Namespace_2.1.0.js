/**
 * @name Namespace.js
 * @version 2.1.0
 * @author 天国V5
 * @description 这是一个用于WEB前端代码组织以及动态加载js的框架
 * 详细信息请戳这里https://github.com/fenices/Namespace
 * @email fenices@qq.com
 *
 * 2.0.2
 * 简化相对目录保存实现过程
 * 增加Load('Components/Button')方法
 *
 * 2.0.3
 * 新增Component('Components/Button')方法引用vue组件
 * 原Load('xxx/xxx.json')方法用于文件加载
 *
 * 2.0.4
 * 增加组件局部CSS功能
 *
 * 2.0.5
 * 修改组件文件后缀com为dom
 *
 * 2.0.6
 * 增加dom组件注释标签<comment>注释</comment>
 * 通过并将comment属性增加到组件静态属性通过Component.comment获取注释
 *
 * 2.0.8
 * 增加$Overload方法
 * 该方法可以实现对象的方法重载
 * 嵌入对象/方法前缀改为$Method进行访问
 *
 * 2.0.9
 * 增加Import, Component批量导入
 * 增加less库支持, <style lang='less'>less code</style>
 *
 * 2.1.0
 * 修改dom组件解析，不再dom文件中添加this.template = $template写法，在组件加载阶段会自动添加
 * Vue.Component('name', new Dom());也在加载阶段自动添加
 * dom文件中只需要定义构造函数即可
 */

(function () {
    const mVersion   = '2.1.0';
    const mLogStyles = {
        h1: 'color:#626262;font-size:16px;font-family:微软雅黑;font-weight:bold',
        suc: 'color:white;background:#3cae3f',
        load: 'color:white;background:#28a6d5',
        cache: 'color:white;background:#929292',
        err: 'color:white;background:#d52828',
        warn: 'color:white;background:#FFD982',
        start: 'font-size:12px;font-weight:bold'
    };

    if (Object.is(window.Namespace, undefined) || Object.is(window.NS, undefined)) {
        window.Namespace = {};
        window.NS        = window.Namespace;
        console.log(`%c欢迎使用由天国V5发布的Namespace工具，版本号${mVersion}`, mLogStyles.h1);
    } else {
        return console.error("%cNamespace/NS对象已定义", mLogStyles.err);
    }

    var mStart      = "",
        mLeo        = "";
    var mScriptTags = document.querySelectorAll("script[start]");
    for (var i = 0; i < mScriptTags.length; i++) {
        //获取代码根目录路径
        var script = mScriptTags[i];
        if (script.src.search(/Namespace_/) < 0) {continue;}
        mStart = script.getAttribute("start");
        mLeo = script.getAttribute("leo");
        if (mStart === undefined || mStart === null || mStart.length === 0) {
            console.warn(`%c Start参数错误 `, mLogStyles.err);
            console.dirxml(script);
            return;
        }
    }

    //默认嵌入对象
    var defaultPlugins = {
        "CacheClass": CacheClass,
        "Overload": Overload
    };

    var mClassName   = '';
    var mCachedClass = new Map();
    var mHost        = window.location.host;
    var mRootFiles   = [window.location.pathname];
    /**
     * 用于导入其他类
     * @return (void) 返回值
     * @param file
     */
    Namespace.Import = function NS_Import(file) {
        if (Object.is(file, undefined)) {
            return console.error('文件未定义', mLogStyles.err);
        }
        if (file.constructor == Array) {
            var objs = {};
            for (f of file) {
                mClassName       = f.replace(/.*\//, '');
                objs[mClassName] = Namespace.Import(f);
            }
            return objs;
        }
        mClassName = file.replace(/.*\//, '');
        var src    = TrimPath(mRootFiles[0], file, '.js');
        if (mCachedClass.has(src)) {
            console.log(`%c 重用：${src} `, mLogStyles.cache);
            return mCachedClass.get(src);
        } else {
            mRootFiles.unshift(src);
            DownLoadScript(src);
        }
        return mCachedClass.get(mRootFiles.shift());
    };

    /**
     * 用于导入其他类
     * @return (void) 返回值
     * @param com
     */
    Namespace.Component = function NS_Component(dom) {
        if (Object.is(dom, undefined)) {
            return console.error('组件未定义', mLogStyles.err);
        }
        if (dom.constructor == Array) {
            var objs = {};
            for (d of dom) {
                mClassName       = d.replace(/.*\//, '');
                objs[mClassName] = Namespace.Component(d);
            }
            return objs;
        }
        mClassName = dom.replace(/.*\//, '');
        var src    = TrimPath(mRootFiles[0], dom, '.vue');
        if (mCachedClass.has(src)) {
            console.log(`%c 重用：${src} `, mLogStyles.cache);
            return mCachedClass.get(src);
        } else {
            mRootFiles.unshift(src);
            DownloadComponent(src);
        }
        return mCachedClass.get(mRootFiles.shift());
    };

    Namespace.Load = function NS_Load(file) {
        var type    = mClassName = file.replace(/.*\./, '');
        var src     = TrimPath(mRootFiles[0], file);
        var content = "";
        Request(src,
            suc => {
                content = suc.responseText;
            }, err => {console.error(`%c 运行：${err} \n`, mLogStyles.err, src);}
        );
        switch (type) {
            case 'json':
                return new Function(`return ${content}`)();
            default:
                return content;
        }
    };

    /**
     * 实现对象方法重载
     * @param target 目标对象
     * @param fn 方法
     * @constructor
     */
    function Overload(target, fn) {
        var old         = target[fn.name]; //把前一次添加的方法存在一个临时变量old里面
        target[fn.name] = function () { // 重写了object[name]的方法
            //如果调用object[name]方法时，传入的参数个数跟预期的一致，则直接调用
            if (fn.length === arguments.length) {
                return fn.apply(this, arguments);
                // 否则，判断old是否是函数，如果是，就调用old
            } else if (typeof old === "function") {
                return old.apply(this, arguments);
            }
        };
    }

    var OnCached;

    /**
     * 缓存已导入的类
     * @param cls
     * @constructor
     */
    function CacheClass(fn) {
        var src = mRootFiles[0];
        if (fn !== null) {
            //成功
            console.log(`%c 导入：${src} `, mLogStyles.load);
            mCachedClass.set(src, fn);
            if (Object.is(OnCached, undefined) || OnCached.constructor != Function) {return;}
            OnCached(src, fn);
            OnCached = undefined;
        } else {
            //失败
            console.warn(`%c 导入：${src} `, mLogStyles.warn);
        }
    }

    function TrimPath(rootFile, subFile, type = '') {
        var src    = rootFile.replace(/[^\/]+$/, '') + subFile + type;
        var fileds = src.split('/');
        for (i = 0; i < fileds.length; i++) {
            if (fileds[i] === '..') {
                fileds.splice(i - 1, 2);
                i -= 2;
            }
        }
        return fileds.join('/');
    }

    function DownloadComponent(src) {
        Request(src,
            suc => {
                var doc      = new DOMParser().parseFromString(suc.responseText, 'text/html');
                var styleTag = doc.querySelector('style');
                var style    = styleTag ? styleTag.textContent : "";
                if (styleTag.getAttribute('lang') == 'less') {
                    if (Object.is(less, undefined)) {return console.log('未找到less框架', mLogStyles.err);}
                    less.render(style, (e, o) => {
                        AppendStyle(o.css);
                    });
                } else {
                    AppendStyle(style);
                }

                var script = doc.querySelector('script').textContent;
                var temp   = doc.querySelector('template');

                OnCached = function (src, fn) {
                    if (!Object.is(Vue, undefined)) {
                        var c      = new fn();
                        c.name     = c.name || fn.name.toLowerCase();
                        c.template = temp;
                        mCachedClass.set(src, Vue.component(c.name, c));
                    }
                };
                ExcuteScript({
                    src: src,
                    code: script
                });
            },
            err => {console.error(`%c 运行：${err} \n`, mLogStyles.err, src);});
    }

    var rStyle = document.createElement('style');
    rStyle.id  = 'runtime_style';
    document.head.append(rStyle);

    function AppendStyle(pStyleStr) {
        rStyle.innerText += pStyleStr;
    }

    function ExcuteScript(options) {
        var mPlugins = MergePlugins(options.plugins);
        var srcURL   = `//# sourceURL=http://${mHost}${options.src}`;
        var cmd      = `${srcURL}
     ${mPlugins.text}
     $CacheClass(${mClassName});
        ${options.code}`;
        new Function("plugins", cmd).call(this, mPlugins.command);
    }

    function MergePlugins(plugins) {
        var mergePlugins = Object.assign(defaultPlugins, plugins);
        var pluginsCMD   = "const {";
        Object.keys(mergePlugins).forEach(k => {
            pluginsCMD += k + ":$" + k + ",";
        });
        pluginsCMD = pluginsCMD.slice(0, -1) + "} = plugins;";
        return {text: pluginsCMD, command: mergePlugins};
    }

    /**
     * 下载script代码
     * @param src
     * @constructor
     */
    function DownLoadScript(src) {
        Request(src,
            suc => ExcuteScript({src: src, code: suc.responseText}),
            err => {
                console.error(`%c 下载失败：${err} \n`, mLogStyles.err, src);
            });
    }

    function Request(src, suc, err) {
        var ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    try {suc(ajax);} catch (e) {err(e);}
                } else {
                    err(ajax.statusText);
                }
            }
        };
        ajax.open('GET', src, false);
        ajax.send(null);
    }    

    // 是否引用通用类leo
    if(mLeo){
        window.Leo = new Namespace.Import(mLeo);
        window.leo = new Leo();
    }    
    /**
     * 调用入口函数
     */
    window._Start = new Namespace.Import(mStart);
    window._start = new _Start();
})();
