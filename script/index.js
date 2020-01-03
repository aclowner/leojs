

let menus = [
    {"Id":1,"Name":"系统管理",page:""},
    {"Id":2,"Name":"权限管理",page:"/page2"},
    {"Id":3,"Name":"项目管理",page:"/page3"},
    {"Id":4,"Name":"D3可视化",page:"/page4"},
    {"Id":5,"Name":"WebGl",page:"/page5"},
];

const {page1, page2, page3, page4, page5} = NS.Component(['../view/page1','../view/page2','../view/page3','../view/page4','../view/page5']);

function index(){
    
    let rounts=[
        {
            path:'/',
            component:page1
        },
        {
            path:'/:title',
            component:page1
        },
        {
            path:'/page2/:title',
            component:page2
        },
        {
            path:'/page3/:title',
            component:page3
        },
        {
            path:'/page4/:title',
            component:page4
        }
        ,
        {
            path:'/page5/:title',
            component:page5
        }
    ];

    let router=new VueRouter({
        routes:rounts
    });

    this.vue = new Vue({
        el:"#vue",
        router:router,
        data:{
            menus:menus,
            active:0
        },
        created(){
            
        },
        methods:{
        }
    
    })
    
}