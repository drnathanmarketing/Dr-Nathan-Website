const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "auto" });
  } else {
    // If we're on a different route (like /blog), redirect to home with hash
    window.location.href = `/#${id}`;
  }
};

export default scrollToElement;
