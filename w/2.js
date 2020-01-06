var mysql = require('mysql')
 
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456', // 密码填写你们自己的
	port: '3306',
	database: 'shuju1', // 填写你们自己的数据库名称
})
 
connection.connect()
 
var sql = 'SELECT * FROM reader'
//查
connection.query(sql, function(err, result) {
	if (err) {
		console.log('[SELECT ERROR] - ', err.message)
		return
	}
 
	console.log('--------------------------SELECT----------------------------')
	console.log(result)
	console.log('------------------------------------------------------------\n\n')
})
 
connection.end()
 
// var addSql = 'INSERT INTO user(Id,name,phone,address,gender) VALUES(0,?,?,?,?)'
// var addSqlParams = ['王思聪', '1865656565', '北京万达广场', '男']
// //增
// connection.query(addSql, addSqlParams, function(err, result) {
// 	if (err) {
// 		console.log('[INSERT ERROR] - ', err.message)
// 		return
// 	}
 
// 	console.log('--------------------------INSERT----------------------------')
// 	//console.log('INSERT ID:',result.insertId);
// 	console.log('INSERT ID:', result)
// 	console.log('-----------------------------------------------------------------\n\n')
// })
 
// connection.end()
 
// var modSql = 'UPDATE user SET name = ?,gender = ? WHERE Id = ?'
// var modSqlParams = ['高圆圆', '女', 1]
// //改
// connection.query(modSql, modSqlParams, function(err, result) {
// 	if (err) {
// 		console.log('[UPDATE ERROR] - ', err.message)
// 		return
// 	}
// 	console.log('--------------------------UPDATE----------------------------')
// 	console.log('UPDATE affectedRows', result.affectedRows)
// 	console.log('-----------------------------------------------------------------\n\n')
// })
 
// connection.end()
 
// var delSql = 'DELETE FROM websites where id=2'
// //删
// connection.query(delSql, function(err, result) {
// 	if (err) {
// 		console.log('[DELETE ERROR] - ', err.message)
// 		return
// 	}
 
// 	console.log('--------------------------DELETE----------------------------')
// 	console.log('DELETE affectedRows', result.affectedRows)
// 	console.log('-----------------------------------------------------------------\n\n')
// })
 

