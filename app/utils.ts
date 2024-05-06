export const hexRandomColor = (): string => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

export const roundTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};
