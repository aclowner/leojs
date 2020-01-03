const {Home, About} = NS.Component(['Home', 'About']);

function RouterMain(){
    var rounts=[
        {
            path:'/:name',
            component:Home
        },
        {
            path:'/about/:name',
            component:About
        }
    ];

    var router=new VueRouter({
        routes:rounts
    });

    var app=new Vue({
        el:'#app',
        router:router
    })
    // app.$router.push('/about');
}