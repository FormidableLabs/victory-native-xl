export const massageInputData = (data, xKey, yKeys) => {
    const x = [];
    const y = {};
    const _x = [];
    if (!data.length)
        return { x, y, _x };
    const firstX = data[0][xKey];
    // TODO: Going to need more sophisticated sorting logic for e.g. dates.
    const sortedData = Array.from(data);
    if (typeof firstX === "number") {
        sortedData.sort((a, b) => a[xKey] - b[xKey]);
    }
    // Input data is numbers
    if (typeof firstX === "number") {
        sortedData.forEach((datum) => {
            const xVal = datum[xKey];
            x.push(xVal);
            yKeys.forEach((key) => {
                if (!y[key])
                    y[key] = [];
                y[key].push(datum[key]);
            });
        });
    }
    // Input data is string
    if (typeof firstX === "string") {
        sortedData.forEach((datum, i) => {
            x.push(i);
            _x.push(datum[xKey]);
            yKeys.forEach((key) => {
                if (!y[key])
                    y[key] = [];
                y[key].push(datum[key]);
            });
        });
    }
    // TODO: Drop _x if it's not used?
    return { x, y, _x };
};
export const getMinYFromMassagedData = (data) => {
    return Math.min(...Object.values(data.y).map((arr) => Math.min(...arr)));
};
export const getMaxYFromMassagedData = (data) => {
    return Math.max(...Object.values(data.y).map((arr) => Math.max(...arr)));
};
