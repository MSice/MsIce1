#!/usr/bin/env node
const cprocess = require('child_process');
const cmd = require('commander');
const shell = require('shelljs');
const options = require('./config');
const request = require('./request');
const cheerio = require('cheerio');
const Dateformat = require("dateformat");
const { time } = require('console');
const version = '1.0.0';
const endReg = /.*\.(jpg|css|js|png|jpeg|xml|)$/
const mainRoute = shell.pwd().split('craw-web')[0] + 'craw-web';
let urlList = [`0_${options.feedfile}`];
let getedList = [];
let num = 0;
let runTime = Dateformat(new Date(), "yyyy-mm-dd HH:MM:ss");
options.nowdepth = 0;

cmd
    .version(version)
    .on('--help', help)
    .option('-r, --run', 'run main function', run)
    .option('-c, --config <op> <args>', 'set config').action(config);
function run () {
    if (num === 0) {
        cprocess.exec(`echo "\n\n[${runTime}]" >> ${options.result}`);
    }
    let timer = setTimeout(async () => {
        let times = urlList[0].split('_')[0];
        let url = urlList[0].split('_').slice(1,).join('_');
        await main(url, times);
        if (urlList.length === 0 && times >= options.max_depth - 1) {
          console.log(`\n\n执行开始时间为 ${runTime} 本次已爬取${num}个链接,\n已保存至  ${options.result}`);
          console.log(`爬取错误详情已保存至  ${mainRoute}/err/log`);
        }
        clearTimeout(timer);
    }, options.crawl_interval * 1000);
}

async function main (url, times) {
    console.log(`[${Dateformat(new Date(), "yyyy-mm-dd HH:MM:ss")}] 开始爬取 ${url}`);
    if (getedList.includes(url)) {
        urlList.shift();
        if (urlList.length > 0) {
            run();
        }
        console.log(`\t该网页已爬取完成...`);
        return;
    }
    times++;
    await get(url).then(ret => {
        if (ret) {
            let body = ret;
            let $ = cheerio.load(body);
            let result = [];
            let attrs = ['href', 'src'];
            attrs.forEach(attr => {
                result = [...new Set([...result, ...getTagInfo(attr, $, url, times)])];
            });
            let str = `echo "以下链接从该网页爬取  ${url}" >> ${options.result}`;
            cprocess.exec(str);
            if (result.length > 0) {
                num += result.length;
                str = `echo "    [${Dateformat(new Date(), "yyyy-mm-dd HH:MM:ss")}] ` +
                    `${result.join(`\n    [${Dateformat(new Date(), "yyyy-mm-dd HH:MM:ss")}] `)}"` +
                    ` >> ${options.result}`;
            } else {
                str = '无链接';
            }
            cprocess.exec(str);
            console.log(`    ${url} 爬取成功, 已保存至结果文件.`);
            urlList.shift();
            getedList.push(url);
            if (times < options.max_depth) {
                result.forEach(rurl => {
                    if (!endReg.test(rurl)) {
                        urlList.push(rurl);
                    }
                });
            }
            if (urlList.length > 0) {
                run();
            }
        } else {
            console.log(`    ${url} 获取结果为空, 已保存至结果文件.`);
            urlList.shift();
            getedList.push(url);
            if (urlList.length > 0) {
                run();
            }
        }
    }).catch(err => {
        console.log(`    ${url} 获取错误, 已保存至错误输出文件.`);
        urlList.shift();
        getedList.push(url);
        if (urlList.length > 0) {
            run();
        }
        shell.cd(mainRoute);
        let str = `echo "[${Dateformat(new Date(), "yyyy-mm-dd HH:MM:ss")}] ${url}" >> err/log`;
        cprocess.exec(str);
        str = `echo "    ${err}" >> err/log`;
        cprocess.exec(str);
    })
}

function get (url) {
    return request({
        method: "get",
        url: url,
        timeout: options.crawl_timeout * 1000
    });
}

function getTagInfo (attr, $, url, times) {
    let result = [];
    Object.values($(`[${attr}]`)).forEach(tag => {
        let turl = sliceUrl('href', tag.attribs);
        let patt = /^http(s)?:\/\/.+/;
        if (turl === url || result.includes(turl) || !turl) {
            return
        }
        if (patt.test(turl)) {
            result.push(`${times}_${turl}`);
        } else {
            result.push(`${times}_${reSetUrl(url, turl)}`);
        }
    });
    return result;
}

function sliceUrl (attr, data) {
    if (data) {
        return data[attr];
    } else {
        return false;
    }

}

function reSetUrl (opurl, geturl) {
    return new URL(geturl, opurl).href;
}

function config (op, args) {
    if (op.run) {
        return;
    }
    let key = ['feedfile', 'result', 'max_depth', 'crawl_interval', 'crawl_timeout'];
    let val = args.rawArgs.slice(3,);
    let option = {};
    let run = false;
    if (val.length > key.length) {
        console.log(val);
        console.log('参数超限');
        return;
    }
    val.forEach((value, index) => {
        option[key[index]] = value;
        if (['feedfile', 'result'].includes(key[index]) && find(option.result)) {
            console.log(key[index], '文件已存在, 请设置新的输出文件后重试');
            run = true;
            return;
        }
    });
    if (run) {
        return;
    } else {
        Object.keys(option).forEach(key => {
            if (option[key]) {
                let reg = new RegExp(`${key}: \\'.*\\'`, 'g');
                console.log(reg);
                shell.cd(mainRoute);
                shell.sed('-i', reg, `${key}: '${option[key]}'`, 'config.js');
            }
            if (key === 'result' && option.result) {
                let file = option.result.split('/').pop();
                let dir = option.result.replace(`/${file}`, '');
                shell.mkdir('-p', dir);
                shell.cd(dir);
                shell.touch(file);
                let rou = shell.pwd();
                shell.cd(mainRoute);
                let reg = new RegExp(`result: \\'.*\\'`, 'g');
                shell.sed('-i', reg, `result: '${rou}/${file}'`, 'config.js');
            }
        })
    }
    console.log('参数配置成功，配置文件位于', `${mainRoute}/config.js`);
}

function find (file) {
    if (!file) {
        return false;
    }
    let find = shell.find(file).stdout;
    if (find) {
        return true;
    } else {
        return false;
    }
}

function help () {
    console.log('┌───────────────────────────────────────┬───────────────────────────────────────────────────────────────┐');
    console.log('│命令\t\t\t\t\t│解释\t\t\t\t\t\t\t\t│');
    console.log('├───────────────────────────────────────┼───────────────────────────────────────────────────────────────┤');
    console.log('│-h  \t\t\t\t\t│ 查看帮助       \t\t\t\t\t\t│');
    console.log('├───────────────────────────────────────┼───────────────────────────────────────────────────────────────┤');
    console.log('│-V  \t\t\t\t\t│ 查看版本\t\t\t\t\t\t\t│');
    console.log('├───────────────────────────────────────┼───────────────────────────────────────────────────────────────┤');
    console.log('│-r  \t\t\t\t\t│ 执行程序\t\t\t\t\t\t\t│');
    console.log('├───────────────────────────────────────┼───────────────────────────────────────────────────────────────┤');
    console.log('│-c + 参数  \t\t\t\t│ 指定配置文件\t\t\t\t\t\t\t│');
    console.log('├───────────────────────────────────────┴───────────────────────────────────────────────────────────────┤');
    console.log('│ 以下为可选参数\t\t\t\t\t\t\t\t\t\t\t│');
    console.log('├───────────────┬───────────────────────────────────────────────────┬───────────────────────────────────┤');
    console.log('│参数\t\t│\t解释\t\t\t\t\t    │\t示例\t\t\t\t│');
    console.log('├───────────────┼───────────────────────────────────────────────────┼───────────────────────────────────┤');
    console.log('│feedfile\t│\t种子文件路径\t\t\t\t    │\thttp://cup.baidu.com/spider/    │');
    console.log('├───────────────┼───────────────────────────────────────────────────┼───────────────────────────────────┤');
    console.log('│result  \t│\t抓取结果存储文件路径\t\t\t    │\t./output/result.txt\t\t│');
    console.log('├───────────────┼───────────────────────────────────────────────────┼───────────────────────────────────┤');
    console.log('│max_depth \t│\t最大抓取深度（种子为0级）\t\t    │\t3\t\t\t\t│');
    console.log('├───────────────┼───────────────────────────────────────────────────┼───────────────────────────────────┤');
    console.log('│crawl_interval\t│\t抓取间隔，单位：秒  \t\t\t    │\t3\t\t\t\t│');
    console.log('├───────────────┼───────────────────────────────────────────────────┼───────────────────────────────────┤');
    console.log('│crawl_timeout \t│\t抓取超时时间，单位：秒  \t\t    │\t6\t\t\t\t│');
    console.log('├───────────────┴───────────────────────────────────────────────────┴───────────────────────────────────┤');
    console.log('│指定配置文件示例：\t\t\t\t\t\t\t\t\t\t\t│');
    console.log('│craw -c http://cup.baidu.com/spider/ ./output/urls/xxx 3 3 6    \t\t\t\t\t│');
    console.log('└───────────────────────────────────────────────────────────────────────────────────────────────────────┘')
}

cmd.parse(process.argv)
