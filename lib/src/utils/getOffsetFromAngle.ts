export const getOffsetFromAngle = (rotateAngle: number) => {
  if (!rotateAngle) return 0;

  return Math.sin((Math.PI / 180) * rotateAngle);
};
