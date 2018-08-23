var searchArray = function(arr, value) {
  // searches an array of objects for an object with value stored under the
  // key "word"
  for (var i=0; i < arr.length; i++) {
    if (arr[i].word == value) {
        return true;
    }
  }
  return false;
}

module.exports = searchArray;
