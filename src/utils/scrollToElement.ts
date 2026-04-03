const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) element.scrollIntoView({ behavior: "auto" });
};

export default scrollToElement;
