const fs = require("fs");
const path = require("path");

let en_raw = fs.readFileSync("en/common.json");
let en = JSON.parse(en_raw);
// console.log(en);

let il_raw = fs.readFileSync(path.join(__dirname, "il/common.json"));
let il = JSON.parse(il_raw);
//console.log(il);

let mergedEN = mergeByKeys(il, en);

function mergeByKeys(first, second) {
  let merged = {};
  Object.keys(first).forEach(key => {
    merged[key] = second[key] ? second[key] : first[key];
  });

  Object.keys(second).forEach(key => {
    if (!merged[key]) {
      merged[key] = second[key];
      console.log(key);
    }
  });

  return merged;
}

fs.writeFile("./mergedEN.json", JSON.stringify(mergedEN, null, 4), err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("File has been created");
  //console.log('Done.')
  console.log(mergedEN);
});
