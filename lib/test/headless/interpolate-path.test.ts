import { Skia } from "@shopify/react-native-skia";
import { describe, expect, it } from "vitest";
import { interpolatePath } from "../../src/hooks/interpolatePath";

const makeLinePath = (start: number) =>
  Skia.PathBuilder.Make()
    .moveTo(start, start)
    .lineTo(start + 10, start + 10)
    .build();

describe("interpolatePath", () => {
  it("interpolates from the current path to the target path", () => {
    const from = makeLinePath(0);
    const to = makeLinePath(100);

    expect(interpolatePath(from, to, 0)?.toSVGString()).toBe("M0 0L10 10");
    expect(interpolatePath(from, to, 0.25)?.toSVGString()).toBe("M25 25L35 35");
    expect(interpolatePath(from, to, 0.75)?.toSVGString()).toBe("M75 75L85 85");
    expect(interpolatePath(from, to, 1)?.toSVGString()).toBe(
      "M100 100L110 110",
    );
  });
});
