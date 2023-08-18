import { pipeline } from "node:stream";
import path from "node:path";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import csv from "csv-parser";

const here = new URL(".", import.meta.url).pathname;

const main = async () => {
  let records = [];

  await new Promise((res, rej) => {
    pipeline(
      createReadStream(path.resolve(here, "./TSLA.csv")),
      csv(),
      async function* selectFields(readable) {
        for await (const chunk of readable) {
          records.push({
            date: chunk.Date,
            high: parseFloat(chunk.High),
            low: parseFloat(chunk.Low),
            open: parseFloat(chunk.Open),
            close: parseFloat(chunk.Close),
          });
          yield;
        }
      },
      (err) => (err ? rej(err) : res("Success")),
    );
  });

  await fs.writeFile(
    path.resolve(here, "./tesla_stock.json"),
    JSON.stringify(records),
  );

  process.exit();
};

main();
