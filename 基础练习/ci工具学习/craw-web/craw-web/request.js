/*
 * @Author: suqi04
 * @Date: 2021-10-13 16:17:22
 * @LastEditTime: 2021-10-22 18:27:00
 * @LastEditors: suqi04
 * @FilePath: /baidu/MsIce1/基础练习/ci工具学习/baidu/good-coder/craw-web/request.js
 */
const axios = require('axios');

const service = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

module.exports = service;
