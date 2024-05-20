function capitalizeStr (str) {
  let result = str.charAt(0).toUpperCase() + str.slice(1);
  return result
}

module.exports = { capitalizeStr };