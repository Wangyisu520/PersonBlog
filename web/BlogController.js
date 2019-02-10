var blogDao = require("../dao/BlogDao")
var tagsDao = require("../dao/TagsDao");
var tagBlogMappingDao = require("../dao/TagBlogMappingDao");
var timeUtil = require("../util/TimeUtil")
var respUtil = require("../util/RespUtil")
var url = require("url")

var path = new Map()

function querySearchValueCount(request,response) {
    var params = url.parse(request.url,true).query;
    blogDao.querySearchValueCount( params.search,function (res) {
        response.writeHead(200)
        response.write(respUtil.writeResult("success","查询成功",res))
        response.end()
    })
}
path.set("/querySearchValueCount",querySearchValueCount)

function querySearchValue(request,response) {
    var params = url.parse(request.url,true).query;

    blogDao.querySearchValue(params.search,function (res) {
        response.writeHead(200)
        response.write(respUtil.writeResult("success","查询成功",res))
        response.end()
    })
}
path.set("/querySearchValue",querySearchValue)

function queryHotBlog(request,response) {
    ;
    blogDao.queryHotBlog( 5,function (res) {
        response.writeHead(200)
        response.write(respUtil.writeResult("success","查询成功",res))
        response.end()
    })
}
path.set("/queryHotBlog",queryHotBlog)

function queryAllBlog(request,response) {
    ;
    blogDao.queryAllBlog( function (res) {
        response.writeHead(200)
        response.write(respUtil.writeResult("success","查询成功",res))
        response.end()
    })
}
path.set("/queryAllBlog",queryAllBlog)

function queryBlogId(request,response) {
    var params = url.parse(request.url,true).query;
    blogDao.queryBlogId( parseInt(params.bid),function (res) {
        response.writeHead(200)
        response.write(respUtil.writeResult("success","查询成功",res))
        response.end()
        blogDao.addViews(parseInt(params.bid),function (res) {

        })
    })
}
path.set("/queryBlogId",queryBlogId)

function queryBlogCount(request,response) {
    blogDao.queryBlogCount(function (res) {
        response.writeHead(200)
        response.write(respUtil.writeResult("success","查询成功",res))
        response.end()
    })
}
path.set("/queryBlogCount",queryBlogCount)

function queryBlogByPage(request,response) {
    var params = url.parse(request.url,true).query;
    blogDao.queryBlogByPage(parseInt(params.page),parseInt(params.pageSize),function (res) {
        for(var i = 0; i < res.length; i++){
            res[i].content = res[i].content.replace(/<img[\w\W]*">/, "");
            res[i].content = res[i].content.replace(/<[\w\W]{1,5}>/g, "");
            res[i].content = res[i].content.substring(0, 300);
        }
        response.writeHead(200)
        response.write(respUtil.writeResult("success","查询成功",res))
        response.end()
    })
}
path.set("/queryBlogByPage",queryBlogByPage)

function editBlog(request, response) {
    var params = url.parse(request.url, true).query;
    var tags = params.tags.replace(/ /g, "").replace("，", ",");
    request.on("data", function (data) {
        blogDao.insertBlog(params.title, data.toString(),0,tags, timeUtil.getNow(), timeUtil.getNow(), function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "添加成功", null));
            response.end();
            var blogId = result.insertId;
            var tagList = tags.split(",");
            for (var i = 0 ; i < tagList.length ; i ++) {
                if (tagList[i] == "") {
                    continue;
                }
                queryTag(tagList[i], blogId);
            }
        });
    });
}
path.set("/editBlog",editBlog)

function queryTag(tag,blogId) {
    tagsDao.queryTag(tag,function (res) {
        if(res == null || res.length == 0){
            insertTag(tag,blogId)
        }else{
            tagBlogMappingDao.insertTagBlogMapping(res[0].id,blogId,timeUtil.getNow(),timeUtil.getNow(),function (res) {})
        }
    })
}

function insertTag(tag,blogId) {
    tagsDao.insertTag(tag,timeUtil.getNow(),timeUtil.getNow(),function (res) {
        insertTagBlogMapping(res.insertId,blogId)
    })
}

function insertTagBlogMapping(tagId,blogId) {
    tagBlogMappingDao.insertTagBlogMapping(tagId,blogId,timeUtil.getNow(),timeUtil.getNow(),function (res) {

    })
}

module.exports.path = path;