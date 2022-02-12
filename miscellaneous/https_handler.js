"use strict";

const https = require('https');

function Get(info, callback, timeout) {
  const options = {
    host: info.host,
    port: info.port || 443,
    path: info.path || "/",
    method: 'GET'
  }

  request(options, callback, timeout);
}

function Post(info, data, callback, timeout) {
  const options = {
    host: info.host,
    port: info.port || 443,
    path: info.path || "/",
    method: 'POST',
    headers: info.header || {}
  }

  request(options, callback, JSON.stringify(data), timeout);
}

function request(options, callback, ...info) {
  let result = "";
  const data = options.method === 'POST' ? info[0] : undefined;
  const timeout = options.method === 'GET' ? info[0] : info[1];

  const req = https.request(options, res => {

    if(timeout) {
      var timeoutFunc = setTimeout(() => callback({err:"Timeout"}), timeout);
    }

    res.on('data', d => {
      result += d.toString();
    });
    
    res.on('end', ()=> {
      timeoutFunc ? clearTimeout(timeoutFunc) : null;
      try {
        try {
          result = JSON.parse(result);
          callback({
            url:options.path,
            content:result,
            headers:res.headers,
            status:{
              code:res.statusCode,
              message:res.statusMessage
            }
        });
        }
        catch(e){callback({
          url:options.path,
          content:result,
          headers:res.headers,
          status:{
            code:res.statusCode,
            message:res.statusMessage
          }
        })}
      }
      catch(err) {callback({err});return}
    });
  });

  req.on('error', err => {
    callback({err});
    return;
  });

  data ? req.write(data) : null;
  req.end();
}
module.exports = { Get, Post };
