import { useState } from 'react';

export const useTabs = (initialIndex = 0) => {
  const [index, setIndex] = useState(initialIndex);
  const changeTab = (i) => setIndex(i); //호출 시 원하는 탭 번호로 index를 바꿈

  return { index, changeTab };
};
