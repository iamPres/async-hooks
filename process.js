const { enable, parameters, getRootLatency } = require('./async.js')

async function timeoutFn() {
  await setTimeout(() => {
    console.log("Timeout 1 Done.");
    console.log("Timeout 2 Initiated.");
    timeoutFn2();
  }, 200);
}

async function timeoutFn2() {
  setTimeout(() => {
    console.log("Timeout 2 Done.");
    console.log(parameters)

    var node = 1
    console.log("Root latency for "+node+" is "+getRootLatency(node))
  }, 400);
}

async function asyncCall() {
  await timeoutFn();
}

enable();

asyncCall();
console.log("Timeout 1 Initiated.");
