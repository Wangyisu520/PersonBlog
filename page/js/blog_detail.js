var blogDetail = new Vue({
    el: "#blog_detail",
    data: {
        title: "",
        content: "",
        ctime: "",
        tags: "",
        views: ""
    },
    computed: {},
    created: function () {
        var searchUrlPage = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
        if (searchUrlPage == "") {
            return;
        }
        var bid = -1;
        for (var i = 0; i < searchUrlPage.length; i++) {
            if (searchUrlPage[i].split("=")[0] == "id") {
                try {
                    bid = parseInt(searchUrlPage[i].split("=")[1])
                } catch (e) {
                    console.log(e)
                }
            }
        }
        axios({
            method: 'get',
            url: "/queryBlogId?bid=" + bid
        }).then(function (res) {
            var result = res.data.data[0]
            blogDetail.title = result.title
            blogDetail.content = result.content;
            blogDetail.ctime = result.ctime;
            blogDetail.tags = result.tags;
            blogDetail.views = result.views;
        }).catch(function (error) {
            console.log(error)
        })
    }
})

var sendComment = new Vue({
    el: "#send_comment",
    data: {
        vscode: "",
        rightCode: ""
    },
    computed: {
        changeCode: function () {
            return function () {
                axios({
                    method: "get",
                    url: "/queryRandomCode"
                }).then(function (res) {
                    sendComment.vscode = res.data.data.data;
                    sendComment.rightCode = res.data.data.text;
                })
            }
        },
        sendComment: function () {
            return function () {
                var code = document.getElementById("comment_code").value;
                if (code !== sendComment.rightCode) {
                    alert("验证码错误")
                    return
                }
                var searchUrlPage = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                if (searchUrlPage == "") {
                    return;
                }
                var bid = -10;
                for (var i = 0; i < searchUrlPage.length; i++) {
                    if (searchUrlPage[i].split("=")[0] == "id") {
                        try {
                            bid = parseInt(searchUrlPage[i].split("=")[1])
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
                var reply = document.getElementById("comment_reply").value;
                var replyName = document.getElementById("comment_reply_name").value;
                var name = document.getElementById("comment_name").value;
                var email = document.getElementById("comment_email").value;
                var content = document.getElementById("comment_content").value;
                axios({
                    method: "get",
                    url: "/addComment?bid=" + bid + "&parent=" + reply + "&userName=" + name + "&email=" + email + "&content=" + content + "&parentName=" + replyName
                }).then(function (res) {
                    alert(res.data.msg)
                }).catch(function (error) {
                    console.log(error)
                })
            }
        }
    },
    created: function () {
        this.changeCode()
    }
})

var blogComments = new Vue({
    el: "#blog_comments",
    data: {
        total: 100,
        content: []
    },
    computed: {
        reply:function () {
            return function (commentId,userName) {
                document.getElementById("comment_reply").value = commentId;
                document.getElementById("comment_reply_name").value = userName;
                location.href = "#send_comment";
            }
        }
    },
    created: function () {
        var searchUrlPage = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
        if (searchUrlPage == "") {
            return;
        }
        var bid = -10;
        for (var i = 0; i < searchUrlPage.length; i++) {
            if (searchUrlPage[i].split("=")[0] == "id") {
                try {
                    bid = parseInt(searchUrlPage[i].split("=")[1])
                } catch (e) {
                    console.log(e)
                }
            }
        }
        axios({
            method:"get",
            url:"queryCommentsByBlogId?bid=" + bid
        }).then(function (res) {
            blogComments.content = res.data.data
            for(var i = 0; i < blogComments.content.length; i++){
                if(blogComments.content[i].parent > -1){
                    blogComments.content[i].options="回复"+blogComments.content[i].parent_name;
                }
            }
        })
        axios({
            method:"get",
            url:"/queryCommentsCountByBlogId?bid=" + bid
        }).then(function (res) {
            blogComments.total = res.data.data[0].count;
        }).catch(function (error) {
            console.log(error)
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