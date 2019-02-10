
var randomTags = new Vue({
    el: "#random_tags",
    data: {
        tags: []
    },
    computed: {
        randomColor: function () {
            return function () {
                var red = Math.random() * 255;
                var green = Math.random() * 255;
                var blue = Math.random() * 255;
                return "rgb(" + red + "," + green + "," + blue + ")"
            }
        },
        randomSize: function () {
            return function () {
                var size = (Math.random() * 20 + 12) + "px";
                return size;
            }
        }
    },
    created: function () {
        axios({
            method:"get",
            url:"queryRandomTags"
        }).then(function (res) {
           var result = [];
           for(var i = 0; i < res.data.data.length; i++){
               result.push({text:res.data.data[i].tag,link:"/?tag="+res.data.data[i].tag})
           }
           randomTags.tags = result
        })
    }
})

var newHot = new Vue({
    el: "#new_hot",
    data: {
        titleList: []
    },
    created:function () {
        axios({
            method: "get",
            url:"/queryHotBlog"
        }).then(function (res) {
            var result =[]
            for(var i = 0; i < res.data.data.length; i++){
                var temp ={}
                temp.title = res.data.data[i].title;
                temp.link= "/blog_detail.html?id="+ res.data.data[i].id
                result.push(temp)
            }
            newHot.titleList = result
        })
    }
})

var newComments = new Vue({
    el:"#new_comments",
    data:{
        commentList: []
    },
    created:function () {
        axios({
            method:"get",
            url:"/queryNewComments"
        }).then(function (res) {
            var result = []
            for(var i = 0 ; i < res.data.data.length; i++){
                var temp ={}
                temp.name = res.data.data[i].user_name;
                temp.data = res.data.data[i].ctime
                temp.comment = res.data.data[i].comments
                result.push(temp)
            }
            newComments.commentList = result
        })
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
