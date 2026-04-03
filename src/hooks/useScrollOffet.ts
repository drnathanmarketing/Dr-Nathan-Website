import { useEffect, useState } from "react";

const useScrollOffset = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const scrollHandler = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return offset;
};

export default useScrollOffset;
