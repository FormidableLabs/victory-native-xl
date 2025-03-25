// This function aligns a secondary Y scale's ticks to the primary Y scale's ticks so that the ticks on either side of the chart are drawn on the same lines.
export const normalizeYAxisTicks = (primaryTicks, primaryYScale, yScale) => {
    return primaryTicks.map((tick) => {
        return yScale.invert(primaryYScale(tick));
    });
};
