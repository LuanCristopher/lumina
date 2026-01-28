/**
 * Formats solar power in Watts or milliWatts for better readability.
 * Rules:
 * - Clamps negative values to 0.
 * - Noise reduction: values < 0.5 mW are shown as "0.0 mW".
 * - Values < 1W are shown in mW (0 decimals if >= 10, 1 decimal if < 10).
 * - Values >= 1W are shown in W (2 decimals if < 10, 1 decimal if >= 10).
 *
 * @param {number} powerW - Power in Watts
 * @returns {{ value: string, unit: "W" | "mW" }}
 */
export const formatPower = (powerW) => {
    // 1. Clamp to 0 and handle non-numeric values
    let p = (powerW < 0 || typeof powerW !== 'number') ? 0 : powerW;

    // 2. Dead zone / Noise reduction
    const mW = p * 1000;
    if (mW < 0.5) {
        return { value: "0.0", unit: "mW" };
    }

    // 3. Display logic
    if (p < 1) {
        // MilliWatts range
        if (mW >= 10) {
            return { value: mW.toFixed(0), unit: "mW" };
        } else {
            return { value: mW.toFixed(1), unit: "mW" };
        }
    } else {
        // Watts range
        if (p < 10) {
            return { value: p.toFixed(2), unit: "W" };
        } else {
            return { value: p.toFixed(1), unit: "W" };
        }
    }
};

export default formatPower;
