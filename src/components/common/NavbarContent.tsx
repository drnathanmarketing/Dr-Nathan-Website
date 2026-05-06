import scrollToElement from "src/utils/scrollToElement.ts";

const NavbarContent = () => {
  const onLinkClick = (link: string) => {
    return () => scrollToElement(link);
  };
  return (
    <>
      <a
        href="/"
        className="font-helvetica text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer no-underline text-inherit"
      >
        Home
      </a>
      <a
        href="/about"
        className="font-helvetica text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer no-underline text-inherit"
      >
        About Us
      </a>
      <p
        className="font-helvetica text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer"
        onClick={onLinkClick("service")}
      >
        Services
      </p>
      <p
        className="font-helvetica text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer"
        onClick={onLinkClick("faq")}
      >
        FAQs
      </p>
      <a
        href="/blog"
        className="font-helvetica text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer no-underline text-inherit"
      >
        Blog
      </a>
      <p
        className="font-helvetica text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer"
        onClick={onLinkClick("contact_us")}
      >
        Contact Us
      </p>
    </>
  );
};

export default NavbarContent;
