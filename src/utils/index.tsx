export const formatCurrency = (value: number | string): string => {
  if (typeof value === "number") {
    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return value;
};

export const formatNumber = (value: number | string): string => {
  if (typeof value === "number") {
    return value.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  return value;
};

export const formatPercentage = (value: number | string): string => {
  if (typeof value === "number") {
    return `${value.toFixed(2)}%`;
  }
  return value;
};
