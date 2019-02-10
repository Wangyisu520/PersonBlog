var dbutil = require("./DButil")


function insertTag(tag,ctime,wtime,success){
    var insertSql ="insert into tags(`tag`,`ctime`,`wtime`) values (?,?,?)";
    var params = [tag,ctime,wtime];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

function queryTag(tag,success){
    var insertSql ="select * from tags where tag=?;";
    var params = [tag];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

function queryAllTag(success){
    var insertSql ="select * from tags;";
    var params = [];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql,params,function (error,result) {
        if(error == null){
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}

module.exports.insertTag=insertTag
module.exports.queryTag=queryTag
module.exports.queryAllTag = queryAllTag