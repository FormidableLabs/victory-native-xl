export type RoundedCorners = {
  topLeft?: number;
  topRight?: number;
  bottomRight?: number;
  bottomLeft?: number;
};

export const createRoundedRectPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  corners: RoundedCorners,
): string => {
  /**
   * We need to clamp the max corner radius to half the width of the bar
   * to prevent it drawing negative and creating a reverse U shape.
   */
  const topLeft = Math.min(Math.ceil(width) / 2, corners.topLeft || 0);
  const topRight = Math.min(Math.ceil(width) / 2, corners.topRight || 0);
  const bottomLeft = Math.min(Math.ceil(width) / 2, corners.bottomLeft || 0);
  const bottomRight = Math.min(Math.ceil(width) / 2, corners.bottomRight || 0);

  return `
    M ${x + topLeft}, ${y} H ${x + width - topRight} Q ${x + width}, ${y}, ${
      x + width
    }, ${y + topRight} V ${y + height - bottomRight} Q ${x + width}, ${
      y + height
    }, ${x + width - bottomRight}, ${y + height} H ${x + bottomLeft} Q ${x}, ${
      y + height
    }, ${x}, ${y + height - bottomLeft} V ${y + topLeft} Q ${x}, ${y}, ${
      x + topLeft
    }, ${y} Z
  `.trim();
};
