export const parseStat = (raw = "") => {
  if (!raw) return { num: 0, unit: "" };

  return {
    num: parseFloat(raw.match(/[\d.]+/)?.[0] || 0),
    unit: raw.replace(/[\d.]/g, ""),
  };
};
