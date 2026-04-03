import scrollToElement from "src/utils/scrollToElement";

const NavbarContent = () => {
  const onLinkClick = (link: string) => {
    return () => scrollToElement(link);
  };
  return (
    <>
      {/* <p
        className="text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer"
        onClick={onLinkClick("about_us")}
      >
        About Us
      </p> */}
      <p
        className="text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer"
        onClick={onLinkClick("testimonial")}
      >
        Why Us
      </p>
      <p
        className="text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer"
        onClick={onLinkClick("service")}
      >
        Services
      </p>
      <p
        className="text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer"
        onClick={onLinkClick("faq")}
      >
        FAQs
      </p>
      <p
        className="text-base tracking-wide font-semibold hover:text-primary-900 hover:cursor-pointer"
        onClick={onLinkClick("contact_us")}
      >
        Contact Us
      </p>
    </>
  );
};

export default NavbarContent;
