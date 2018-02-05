# webworker.js-polyfill
用更简单的方式来创建 `Worker`, 支持 IE 10+

## Install 安装

`npm install webworker.js-polyfill`

`yarn add webworker.js-polyfill`

## Webpack
```
{
  module: {
    loaders: [
    {
      test: /worker-blob-helper/,
      loader: 'file-loader'
    },
    ...
    ]
  }
};
```

## Usage 使用方法

```js
import worker from "webworker.js-polyfill";

let sleepEcho = worker((username)=>{
  let start = Date.now();
  while(Date.now() - start < 3000){}
  return `hello ${username}!`;
});
sleepEcho('worker').then(console.log, console.error); // Echo: hello worker!

let thrownError = worker(()=>{
  let start = Date.now();
  while(Date.now() - start < 3000){}
  willThrownError();
});
thrownError().then(console.log, console.error); // Error: "willThrownError is not defined"
```
