var blogList = new Vue({
    el:"#blog_list",
    data:{
        blogList:[]
    },
    computed:{
        
    },
    created:function () {
        axios({
            method:"get",
            url:"/queryAllBlog"
        }).then(function (res) {
            for(var i = 0; i < res.data.data.length; i++){
                res.data.data[i].link = "/blog_detail.html?id=" + res.data.data[i].id
            }
            blogList.blogList = res.data.data
        })
    }
})