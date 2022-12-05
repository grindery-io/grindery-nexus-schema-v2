const fs = require("fs");

const index = {};

for (const path of ["web2", "web3"]) {
  const base = `dist/${path}`;
  const files = fs.readdirSync(base);
  for (const file of files) {
    const content = fs.readFileSync(`${base}/${file}`, "utf-8");
    try {
      const data = JSON.parse(content);
      if (!data.key) {
        console.warn(`No key: ${base}/${file}`);
        continue;
      }
      if (data.key + ".json" != file) {
        console.warn(`Invalid key: ${base}/${file}`);
        continue;
      }
      for (const key of ["triggers", "actions"]) {
        if (key in data) {
          data[key].forEach((x) => delete x.operation);
        }
      }
      index[data.key] = data;
    } catch (e) {
      console.warn(`Invalid CDS: ${base}/${file}`);
    }
  }
}
fs.writeFileSync("dist/_index.json", JSON.stringify(index));


