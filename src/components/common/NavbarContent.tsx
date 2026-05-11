import { useEffect, useState } from "react";
import scrollToElement from "src/utils/scrollToElement.ts";

const NavbarContent = () => {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const onLinkClick = (link: string) => {
    return () => scrollToElement(link);
  };

  const getPageClass = (path: string) => {
    const isActive = path === "/" ? currentPath === "/" : currentPath.startsWith(path);
    return `font-helvetica text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer no-underline ${
      isActive ? "text-primary-600" : "text-inherit"
    }`;
  };

  return (
    <>
      <a href="/" className={getPageClass("/")}>
        Home
      </a>
      <a href="/about" className={getPageClass("/about")}>
        About Us
      </a>
      <p
        className="font-helvetica text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer text-inherit"
        onClick={onLinkClick("service")}
      >
        Services
      </p>
      <a href="/life" className={getPageClass("/life")}>
        Life at Dr. Nathan
      </a>
      <a href="/blog" className={getPageClass("/blog")}>
        Blog
      </a>
      <p
        className="font-helvetica text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer text-inherit"
        onClick={onLinkClick("contact_us")}
      >
        Contact Us
      </p>
    </>
  );
};

export default NavbarContent;
