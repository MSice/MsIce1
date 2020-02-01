       window.onload=function(){
        var isCon = confirm("是否进行游戏？");
         if (isCon) {
             var ran = parseInt(Math.random() * 100);
             var cai
             while (cai != ran) {
                 cai = prompt("请输入100以内的数");
                 if (cai < ran)
                     alert("您这输入的也太小了！！");
                 else if (cai > ran)
                     alert("您这输入的有点大！！");
                 else
                     alert("猜对了，您可真是个小天才！！");
             }
         }
         else {
             alert("不玩就算了吧，");
         }

       }
    // 1!*2!*3!*4!....*10!
    // var sum=0;
    // for(var i=10;i>0;i--)
    // {
    //     var k=1;
    //     for(var j=1;j<=i;j++)
    //     {
    //         k*=j;
    //     }
    //     sum+=k;
    // }
    // document.write(sum);
    // 1.	编写程序．通过用户输入的年龄判断是哪个年龄段的人
    // （儿童：年龄＜14；青少年：14<=年龄＜24；青年：24<年龄＜40;
    //  中年：40＜=年龄＜60; 老年：年龄>=60），并在页面上输出判断结果。
    // for(var i=100;i<1000;i++)
    // {
    //     if(i%4==2&&i%7==3&&i%9==5)
    //         document.write(i+"&nbsp:");

    // }