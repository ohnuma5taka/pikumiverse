const getKey = <T, U>(map: Map<T, U>, value: U) =>
  [...map].find(([_, v]) => v === value)![0];

export const mapUtil = { getKey };
