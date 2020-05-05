const asyncHooks = require("async_hooks");
const fs = require("fs");

let parameters = [];
let hooks = {
  init: (asyncId, type, triggerAsyncId, resource) => {
    initTime = new Date().getTime();
    destroyTime = new Date().getTime();
    totalLatency = 0;
    const value = {
      asyncId,
      type,
      triggerAsyncId,
      resource,
      initTime,
      destroyTime,
      totalLatency,
    };
    parameters[String(asyncId)] = value;
  },
  destroy: (asyncId) => {
    const destroyTime = new Date().getTime();
    parameters[asyncId].destroyTime = destroyTime;
    parameters[asyncId].totalLatency =
      destroyTime - parameters[asyncId].initTime;
  },
};
let asyncHook = asyncHooks.createHook(hooks);

const enable = () => {
  asyncHook.enable();
};

const getRootLatency = (item) => {
  let i = 0;
  let rootLatency = 0
  if (parameters[item]) rootLatency = parameters[item].totalLatency;
  let children = [item];
  while (children.length > 0) {
    let p = 0;
    let data = [];
    let temp = [];
    i += 1;
    for (p = 0; p < children.length; p++) {
      data = check(parameters, children[p]);
      temp.push(data[0]);
      rootLatency += data[1];
    }
    children = temp[0];
  }
  return rootLatency;
};

function check(list, item) {
  let children = [];
  let rootLatency = 0;
  for (i = 0; i < list.length; i++) {
    if (list[i]) {
      if (list[i].triggerAsyncId == item) {
        children.push(list[i].asyncId);
        rootLatency += list[i].totalLatency;
      }
    }
  }
  return [children, rootLatency];
}

exports.enable = enable;
exports.parameters = parameters;
exports.getRootLatency = getRootLatency;
