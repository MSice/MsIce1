var app = express();
app.get("/", function(req, res) {
res.send("Hello World");//向前端发送数据
});
app.listen(8081,function() {
console.log("应用实例，访问地址为 http://127.0.0.1:8081");
});