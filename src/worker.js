/**
 * webworker.js
 *
 * 用更简单的方式来创建 `Worker`
 */
import workerBlobHelperURL from './worker-blob-helper'; // IE 10

let workerBlobSupported = false;
try{
  new Worker(URL.createObjectURL(new Blob())).terminate();
  workerBlobSupported = true;
} catch(e){
}
module.exports = function(func) {
  const blobContent = `
onmessage=(
  function(func){
    return function(event){
      try{
        postMessage({data: func.apply(null, event.data)});
      } catch(e){
        postMessage({error: {name: e.name, message: e.message, stack: e.stack}});
      }
    };
  }
)(${func})`;
  const url = workerBlobSupported?URL.createObjectURL(new Blob([blobContent])):workerBlobHelperURL;
  return function() {
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function(resolve, reject) {
      var worker = new Worker(url);
      if(!workerBlobSupported){
        worker.postMessage(blobContent);
      }
      worker.onmessage = function(event){
        if(event.data.error){
          reject(event.data.error);
        } else{
          resolve(event.data.data);
        }
        worker.terminate();
      };
      worker.postMessage(args);
    });
  };
};
