const unescape = require('unescape');

// let initial_str = '&lt;';

let initial_str = '<mxfile useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/7.8.7 Chrome/58.0.3029.110 Electron/1.7.5 Safari/537.36" version="9.0.0" editor="www.draw.io" type="device"><diagram id="2f228769-b6ea-893d-0ebf-000954d93f45" name="Overview">&lt;mxGraphModel dx=&quot;1144&quot; ';

console.log(unescape(initial_str));
