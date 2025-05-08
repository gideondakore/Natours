module.exports = function getPrototypeChains(obj) {
  const chain = [];
  let currentProto = Object.getPrototypeOf(obj);
  while (currentProto) {
    chain.push(currentProto.constructor.name);
    currentProto = Object.getPrototypeOf(currentProto);
  }
  return chain;
};
