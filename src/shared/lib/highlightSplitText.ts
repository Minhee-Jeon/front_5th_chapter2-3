export const highlightSplitText = (text: string, highlight: string) => {
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return { regex, parts };
};
