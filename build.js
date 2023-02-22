"use strict";

const fs = require("fs");

const index = {};

const humanize = (data) => {
  const result = data // "__ToGetYourGEDInTimeASongAboutThe26ABCsIsOfTheEssenceButAPersonalIDCardForUser_456InRoom26AContainingABC26TimesIsNotAsEasyAs123ForC3POOrR2D2Or2R2D"
    .replace(/(_)+/g, " ") // " ToGetYourGEDInTimeASongAboutThe26ABCsIsOfTheEssenceButAPersonalIDCardForUser 456InRoom26AContainingABC26TimesIsNotAsEasyAs123ForC3POOrR2D2Or2R2D"
    .replace(/([a-z])([A-Z][a-z])/g, "$1 $2") // " To Get YourGEDIn TimeASong About The26ABCs IsOf The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times IsNot AsEasy As123ForC3POOrR2D2Or2R2D"
    .replace(/([A-Z][a-z])([A-Z])/g, "$1 $2") // " To Get YourGEDIn TimeASong About The26ABCs Is Of The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
    .replace(/([a-z])([A-Z]+[a-z])/g, "$1 $2") // " To Get Your GEDIn Time ASong About The26ABCs Is Of The Essence But APersonal IDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
    .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, "$1 $2") // " To Get Your GEDIn Time A Song About The26ABCs Is Of The Essence But A Personal ID Card For User456In Room26A ContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
    .replace(/([a-z]+)([A-Z0-9]+)/g, "$1 $2") // " To Get Your GEDIn Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3POOr R2D2Or 2R2D"

    // Note: the next regex includes a special case to exclude plurals of acronyms, e.g. "ABCs"
    .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, "$1 $2") // " To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"
    .replace(/([0-9])([A-Z][a-z]+)/g, "$1 $2") // " To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC 26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"

    // Note: the next two regexes use {2,} instead of + to add space on phrases like Room26A and 26ABCs but not on phrases like R2D2 and C3PO"
    .replace(/([A-Z]{2,})([0-9]{2,})/g, "$1 $2") // " To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
    .replace(/([0-9]{2,})([A-Z]{2,})/g, "$1 $2") // " To Get Your GED In Time A Song About The 26 ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
    .trim(); // "To Get Your GED In Time A Song About The 26 ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
  // capitalize the first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
};

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
        for (const item of data[key] || []) {
          item.outputFields = item.outputFields || [];
          if (!item.outputFields.length) {
            for (const [key, value] of Object.entries(item.sample || {})) {
              const type = typeof value;
              if (["string", "number", "boolean"].indexOf(type) === -1) {
                continue;
              }
              item.outputFields.push({
                key,
                label: humanize(key),
                type,
              });
            }
          }
        }
      }
      fs.writeFileSync(`${base}/${file}`, JSON.stringify(data));
      fs.writeFileSync(`dist/${file}`, JSON.stringify(data));
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

const chains = [];
const chainFiles = fs.readdirSync(`dist/chains`);

for (const file of chainFiles) {
  const content = fs.readFileSync(`dist/chains/${file}`, "utf-8");
  try {
    const data = JSON.parse(content);
    if (!Array.isArray(data)) {
      console.warn(`Not an array: dist/chains/${file}`);
      continue;
    }
    if (data.length < 1) {
      console.warn(`Empty list: dist/chains/${file}`);
      continue;
    }
    data.forEach((chain) => {
      chains.push(chain);
    });
  } catch (e) {
    console.warn(`Invalid chains list: dist/chains/${file}`);
  }
}
fs.writeFileSync("dist/chains/_index.json", JSON.stringify(chains));
