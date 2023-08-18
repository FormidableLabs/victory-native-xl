import { pipeline } from "node:stream";
import path from "node:path";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import csv from "csv-parser";

const here = new URL(".", import.meta.url).pathname;

const main = async () => {
  let records = [];
  console.log(here);

  await new Promise((res, rej) => {
    pipeline(
      createReadStream(path.resolve(here, "./austin_weather.csv")),
      csv(),
      async function* selectFields(readable) {
        for await (const chunk of readable) {
          records.push({
            date: chunk.Date,
            high: parseInt(chunk.TempHighF),
            low: parseInt(chunk.TempLowF),
          });
          yield;
        }
      },
      (err) => (err ? rej(err) : res("Success")),
    );
  });

  await fs.writeFile(
    path.resolve(here, "./austin_weather.json"),
    JSON.stringify(records),
  );

  process.exit();
};

main();
