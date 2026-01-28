/**
 * Formats solar power in Watts or milliWatts for better readability.
 * @param {number} powerW - Power in Watts
 * @returns {{ value: string, unit: "W" | "mW" }}
 */
export const formatPower = (powerW) => {
    if (powerW === 0) {
        return { value: "0", unit: "W" };
    }

    if (!powerW && powerW !== 0) {
        return { value: "0", unit: "W" };
    }

    const absPower = Math.abs(powerW);
    const sign = powerW < 0 ? "-" : "";

    if (absPower < 1) {
        const mW = absPower * 1000;
        if (mW >= 10) {
            return { value: sign + mW.toFixed(0), unit: "mW" };
        } else {
            return { value: sign + mW.toFixed(1), unit: "mW" };
        }
    } else {
        if (absPower < 10) {
            return { value: sign + absPower.toFixed(2), unit: "W" };
        } else {
            return { value: sign + absPower.toFixed(1), unit: "W" };
        }
    }
};

export default formatPower;
