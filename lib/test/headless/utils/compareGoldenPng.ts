import fs from "node:fs";
import path from "node:path";
import blazediff from "@blazediff/core";
import { PNG } from "pngjs";

const PIXEL_TOLERANCE_FRACTION = 0.001;
const DIFF_THRESHOLD = 0.1;

export function compareGoldenPng(
  actual: Buffer,
  goldenPath: string,
  updateGolden = process.env.UPDATE_GOLDEN === "1",
): void {
  if (updateGolden) {
    fs.mkdirSync(path.dirname(goldenPath), { recursive: true });
    fs.writeFileSync(goldenPath, Uint8Array.from(actual));
    return;
  }

  if (!fs.existsSync(goldenPath)) {
    throw new Error(
      `Missing golden PNG at ${goldenPath}. Run yarn test:headless:update-golden to create it.`,
    );
  }

  const expected = PNG.sync.read(fs.readFileSync(goldenPath));
  const received = PNG.sync.read(actual);

  if (
    expected.width !== received.width ||
    expected.height !== received.height
  ) {
    throw new Error(
      `Golden size mismatch for ${goldenPath}: expected ${expected.width}x${expected.height}, got ${received.width}x${received.height}`,
    );
  }

  const diff = new PNG({ width: expected.width, height: expected.height });
  const diffPixels = blazediff(
    Uint8Array.from(expected.data),
    Uint8Array.from(received.data),
    Uint8Array.from(diff.data),
    expected.width,
    expected.height,
    { threshold: DIFF_THRESHOLD },
  );

  const maxDiffPixels = Math.ceil(
    expected.width * expected.height * PIXEL_TOLERANCE_FRACTION,
  );

  if (diffPixels > maxDiffPixels) {
    const diffPath = goldenPath.replace(/\.png$/, ".diff.png");
    fs.writeFileSync(diffPath, Uint8Array.from(PNG.sync.write(diff)));
    throw new Error(
      `${diffPixels} pixels differ from golden (max ${maxDiffPixels}). Diff written to ${diffPath}`,
    );
  }
}
