export const shuffleArray = <T>(list: T[]): T[] => {
  // 使用 slice() 方法复制原数组
  const shuffledList = list.slice();

  // 使用 sort() 方法和 Math.random() 对复制后的数组进行随机排序
  for (let i = shuffledList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
  }

  // 返回随机排序后的数组
  return shuffledList;
};
