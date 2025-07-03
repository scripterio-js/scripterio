export const timeStamp = () => Date.now()
export const getPercent = (count, total) =>
  total === 0 ? 0 : Math.round((count / total) * 100)
