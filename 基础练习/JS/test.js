/*
 * @Author: suqi04
 * @Date: 2023-07-26 15:49:48
 * @LastEditTime: 2023-07-26 16:20:33
 * @LastEditors: suqi04
 * @FilePath: /baidu/MsIce1/基础练习/JS/test.js
 * @Description: 
 */

const crypto = require('crypto');
const hash = crypto.createHash('sha256');
let message = `uuapclient-4-hjAZ4ZcyQeCStsdosfcaPT-885477325929660416-mlpVpDRrhi-uuapST-883657040469348352-8wma7-uuapuuapclient-19-jXlgaCAdEp61DIIvIIzZ169035957297e91a7d4d304c9e9fe46b`
let message2 = `uuapclient-500783054487506944-SbTGb PT-850829308203495424-kC4R8cWw4F-uuap ST-850837598949896193-E0lLv-uuap uuapclient-500783054487506944-SbTG1690275788bd144dc63ce143daa344e1`
hash.update(message);
let res = hash.digest()
let arr = []
let testarr = []
console.log(res);
for (let i = 0; i < res.length; i++) {
    testarr.push(res[i])
    arr.push(parseInt(res[i], 10).toString(16))
}
console.log(testarr);
console.log(arr);
console.log(res);
console.log(res.toString('hex'));
// "appKey" -> "uuapclient-500783054487506944-SbTGb"
// "pToken" -> "PT-850829308203495424-kC4R8cWw4F-uuap"
// "sToken" -> "ST-850837598949896193-E0lLv-uuap"
// "sign" -> "6dc0de4c1ada2f78cada99c05d45039432f73852a472ab00cf91fde2022d3ae6"
// "targetAppKey" -> "uuapclient-500783054487506944-SbTG"
// "timestamp" -> "1690275788"

// 6dc0de4c1ada2f78cada99c05d45039432f73852a472ab00cf91fde2022d3ae6
// 6dc0de4c1ada2f78cada99c05d45039432f73852a472ab00cf91fde2022d3ae