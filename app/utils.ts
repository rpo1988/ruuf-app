export const hexRandomColor = (): string => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor.padEnd(6, "0")}`;
};

export const roundTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};
