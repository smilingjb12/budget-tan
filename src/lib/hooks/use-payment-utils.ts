import { RegularPaymentDto } from "~/lib/queries";

export const usePaymentUtils = () => {
  const isPaymentStale = (lastModified?: string) => {
    if (!lastModified) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(lastModified) < thirtyDaysAgo;
  };

  const getTextColor = (value: number, data: RegularPaymentDto[]) => {
    if (!data || data.length === 0) return "hsl(var(--primary))";

    const values = data.map((item: RegularPaymentDto) => item.amount);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    // Normalize the value to a 0-1 scale
    const normalizedValue = range === 0 ? 0.5 : (value - minValue) / range;

    // Define color stops for the gradient
    const colorStops = [
      { point: 0, color: { h: 142, s: 76, l: 36 } }, // Green (low)
      { point: 0.5, color: { h: 35, s: 92, l: 58 } }, // Yellow/Orange (middle)
      { point: 1, color: { h: 0, s: 84, l: 60 } }, // Red (high)
    ];

    // Find the two color stops to interpolate between
    let lowerStop = colorStops[0];
    let upperStop = colorStops[colorStops.length - 1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (
        normalizedValue >= colorStops[i].point &&
        normalizedValue <= colorStops[i + 1].point
      ) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }

    // Calculate how far between the two stops the value is (0 to 1)
    const stopRange = upperStop.point - lowerStop.point;
    const stopFraction =
      stopRange === 0 ? 0 : (normalizedValue - lowerStop.point) / stopRange;

    // Interpolate between the two colors
    const h = Math.round(
      lowerStop.color.h + stopFraction * (upperStop.color.h - lowerStop.color.h)
    );
    const s = Math.round(
      lowerStop.color.s + stopFraction * (upperStop.color.s - lowerStop.color.s)
    );
    const l = Math.round(
      lowerStop.color.l + stopFraction * (upperStop.color.l - lowerStop.color.l)
    );

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  return {
    isPaymentStale,
    getTextColor,
  };
};