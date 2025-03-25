export const getOffsetFromAngle = (rotateAngle) => {
    if (!rotateAngle)
        return 0;
    return Math.sin((Math.PI / 180) * rotateAngle);
};
