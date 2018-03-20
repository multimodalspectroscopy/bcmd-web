/** Tranpose a nested array **/
function transposeArray(array){
  var newArray=array[0].map(function(col, i){
    return array.map(function(row){
      return row[i];
    });
  });
  return newArray;
}

/** Convert transposed PapaParse array to JSON **/
function arrayToJSON(array){
  var tsObj = {};
  array.forEach(function(item, idx){
    tsObj[item[0]] = item.slice(1).map(parseFloat).filter(function(x){return !isNaN(x);});
  });
  return tsObj;
}

// Create correct JSON to parse into CSV
function jsonParseToCSV(json){
    var keys = Object.keys(json);
    var outArr = [];
    for (var idx in _.range(json[keys[0]].length)){
        var d = {};
        for (var key of keys){
          d[key] = json[key][idx];
        }
        outArr.push(d);
    }
    var csv = Papa.unparse(outArr);
    return csv;
}
setObject = function(tsObject, headerObject) {
    var obj = {};
    for (var h in headerObject) {
        if (headerObject[h] === true){
          if (tsObject.hasOwnProperty(h)){
            obj[h]=tsObject[h]
          }
        }
    }
    return obj;
}
