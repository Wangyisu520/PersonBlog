var everyDay = new Vue({
    el:"#every_day",
    data:{
        content:"adfafkfjalfj"
    },
    computed:{
        getContent: function () {
            return this.content
        }
    },
    created:function(){
        axios({
            method:"get",
            url:"/queryEveryDay",
        }).then(function (res) {
            everyDay.content = res.data.data[0].content

        }).catch(function (error) {
            console.log(error)
        })
    }
})

var articleList= new Vue({
    el:"#article_list",
    data:{
        page: 1,
        pageSize: 5,
        count:100,
        pageNumList :[],
        articleList:[]
    },
    computed:{
        jumpTo:function(){
          return function (page) {
              this.getPage(page,this.pageSize)
          }
        },
        getPage:function () {
            return function (page,pageSize) {
                var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                var tag = "";
                for (var i = 0 ; i < searcheUrlParams.length ; i ++) {
                    if (searcheUrlParams[i].split("=")[0] == "tag") {
                        try {
                            tag = searcheUrlParams[i].split("=")[1];
                        }catch (e) {
                            console.log(e);
                        }
                    }
                }
                if(tag ==""){
                    axios({
                        method:"get",
                        url:"/queryBlogByPage?page=" + (page-1) +"&pageSize=" + pageSize,
                    }).then(function (res) {
                        var result = res.data.data;
                        var list=[]
                        for(var i = 0; i <result.length; i++){
                            var temp ={};
                            temp.title =result[i].title;
                            temp.content = result[i].content;
                            temp.data = result[i].ctime;
                            temp.views = result[i].views;
                            temp.tags = result[i].tags;
                            temp.id = result[i].id;
                            temp.link = "/blog_detail.html?id=" + result[i].id
                            list.push(temp)
                        }
                        articleList.articleList = list
                        articleList.page =page
                    }).catch(function (error) {
                        console.log("请求失败")
                    });
                    axios({
                        method:"get",
                        url:"/queryBlogCount"
                    }).then(function (res) {
                        articleList.count = res.data.data[0].count
                        articleList.generatePageTool
                    })
                }else{
                    axios({
                        method:"get",
                        url:"/queryByTag?page=" + (page-1) +"&pageSize=" + pageSize +"&tag=" + tag,
                    }).then(function (res) {
                        var result = res.data.data;
                        var list=[]
                        for(var i = 0; i <result.length; i++){
                            var temp ={};
                            temp.title =result[i].title;
                            temp.content = result[i].content;
                            temp.data = result[i].ctime;
                            temp.views = result[i].views;
                            temp.tags = result[i].tags;
                            temp.id = result[i].id;
                            temp.link = "/blog_detail.html?id=" + result[i].id
                            list.push(temp)
                        }
                        articleList.articleList = list
                        articleList.page =page
                    }).catch(function (error) {
                        console.log("请求失败")
                    });
                    axios({
                        method:"get",
                        url:"/queryByTagCount?tag=" + tag
                    }).then(function (res) {
                        articleList.count = res.data.data[0].count
                        articleList.generatePageTool
                    })
                }
            }
        },
        generatePageTool:function () {
            var nowPage = this.page;
            var pageSize = this.pageSize;
            var totalCount = this.count;
            var result = [];
            result.push({text:"<<",page:1})
            if(nowPage > 2){
                result.push({text:nowPage-2,page:nowPage-2})
            }
            if(nowPage > 1){
                result.push({text:nowPage-1,page:nowPage-1})
            }
            result.push({text:nowPage,page: nowPage})
            if(nowPage + 1 <=(totalCount+pageSize -1) / pageSize){
                result.push({text:nowPage+1,page: nowPage+1})
            }
            if(nowPage + 2 <=(totalCount+pageSize -1) / pageSize){
                result.push({text:nowPage+2,page: nowPage+2})
            }
            result.push({text:">>",page:parseInt ((totalCount+pageSize -1) / pageSize)})
            this.pageNumList = result
            return result
        }
    },
    created:function () {
        this.getPage(this.page,this.pageSize)
    },
    methods:{
        formatDate(time) {
            let date = new Date(time * 1000);
            let fmt = "yyyy.MM.dd";
            if (/(y+)/.test(fmt)) {
                // 年
                let year = date.getFullYear().toString();
                fmt = fmt.replace(RegExp.$1, year);
            }
            if (/(M+)/.test(fmt)) {
                // 月
                let mouth = date.getMonth() + 1;
                if (mouth < 10) {
                    mouth = "0" + mouth;
                }
                fmt = fmt.replace(RegExp.$1, mouth);
            }
            if (/(d+)/.test(fmt)) {
                // 日
                let mydate = date.getDate();
                if (mydate < 10) {
                    mydate = "0" + mydate;
                }
                fmt = fmt.replace(RegExp.$1, mydate);
            }
            return fmt;
        }
    }
})

var searchBar = new Vue({
    el:"#search_bar",
    data:{
        searchVal:"",
    },
    computed:{
        querySearch:function () {
            return function () {
                axios({
                    method:"get",
                    url:"/querySearchValue?search=" + searchBar.searchVal
                }).then(function (res) {
                    searchBar.searchVal=""

                    var result = res.data.data;
                    var list=[]
                    for(var i = 0; i <result.length; i++){
                        var temp ={};
                        temp.title =result[i].title;
                        temp.content = result[i].content;
                        temp.data = result[i].ctime;
                        temp.views = result[i].views;
                        temp.tags = result[i].tags;
                        temp.id = result[i].id;
                        temp.link = "/blog_detail.html?id=" + result[i].id
                        list.push(temp)
                    }
                    console.log(articleList.articleList)
                    articleList.articleList = list
                })
                axios({
                    method:"get",
                    url:"/querySearchValueCount?search=" + searchBar.searchVal
                }).then(function (res) {
                    articleList.count = res.data.data[0].count
                    articleList.generatePageTool
                })
            }
        }
    }
})