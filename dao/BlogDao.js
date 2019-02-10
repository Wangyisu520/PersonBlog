var dbutil = require("./DButil")



function insertBlog(title,content,views,tags,ctime,wtime,success){
    var insertSql ="insert into blog (`title`,`content`,`views`,`tags`,`ctime`,`wtime`) values (?,?,?,?,?,?)";
    var params = [title,content,views,tags,ctime,wtime];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryBlogByPage(page,pageSize,success){
    var querySql ="select * from blog order by id desc limit ?,?;";
    var params = [page*pageSize,pageSize]
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

function queryBlogCount(success){
    var querySql ="select count(1) as count from blog ";
    var params = []
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

function queryBlogId(id,success){
    var querySql ="select * from blog where id=?; ";
    var params = [id]
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

function queryAllBlog(success){
    var querySql ="select * from blog order by id desc; ";
    var params = []
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

function addViews(id,success){
    var querySql ="update blog set views = views + 1 where id = ?; ";
    var params = [id]
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

function queryHotBlog(size,success){
    var querySql ="select * from blog order by views desc limit ?; ";
    var params = [size]
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

function querySearchValue(value,success){
    var querySql ="select * from blog where title like ?;";
    var params = ["%"+value+"%"]
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

function querySearchValueCount(value,success){
    var querySql ="select count(1) as count from blog where title like ?;";
    var params = ["%"+value+"%"]
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}



module.exports.insertBlog = insertBlog
module.exports.queryBlogByPage = queryBlogByPage
module.exports.queryBlogCount = queryBlogCount
module.exports.queryBlogId = queryBlogId
module.exports.queryAllBlog = queryAllBlog
module.exports.addViews = addViews
module.exports.queryHotBlog = queryHotBlog
module.exports.querySearchValue = querySearchValue
module.exports.querySearchValueCount = querySearchValueCount
