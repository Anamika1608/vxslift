"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { useSession } from "next-auth/react";
import axios from "axios";

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [loggedIn , setLoggedIn] = useState(false);
  const navbarRef = useRef(null);
  const pathName = usePathname();
  const navbarToggleHandler = () => {
    setNavbarOpen((prev) => !prev);
  };

  // Close hamburger when clicking outside or on the cross button
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (navbarRef.current && !navbarRef.current.contains(event.target)) {
  //       setNavbarOpen(false);
  //     }
  //   };
  //   window.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     window.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  const { data: session, status } = useSession();
  // if(status == "loading") return (<Loader/>)


  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });


  const url = 'http://localhost:8000'

  useEffect(() => {
    const check = async () => {
      try {
        const response = await axios.post(`${url}/check_auth`, { withCredentials: true });
        console.log(response.data);
        setLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    check();
  }, []);

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const usePathName = usePathname();

  return (
    <>
      <header
        className={`header left-0 top-0 -p-20 z-40 flex w-full items-center ${!sticky
          ? "absolute bg-transparent"
          : " dark:bg-blue-300 dark:shadow-sticky-dark fixed z-[9999] bg-black !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
          }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12 py-8">
              <Link
                href="/"
                className={`header-logo block w-full ${sticky ? "" : ""
                  } `}
              >
                <Image
                  src="/images/logo/logo-2.svg"
                  alt="logo"
                  width={140}
                  height={10}
                  className="w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logo.png"
                  alt="logo"
                  width={110}
                  height={25}
                  className="hidden w-full scale-110 h-[30px] dark:block object-cover"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                {/* <Link
                  style={{ color: "black", fontWeight: "bolder" }}
                  href={status === "authenticated" ? "/my-account" : "/signin"}
                  // onClick={status === "authenticated" ? handleSignOut : null} 
                  className="px-4 py-2 text-base font-medium text-dark hover:opacity-70 dark:text-black block md:hidden"
                >
                  {status === "authenticated" ? "My Account" : "Sign in"}
                </Link> */}
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 text-black block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? " top-[7px] rotate-45" : " "
                      }`}
                  />
                  <span
                    className={`relative my-1.5 dark:text-black block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "opacity-0 " : " "
                      }`}
                  />
                  <span
                    className={`relative my-1.5 dark:text-black block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? " top-[-8px] -rotate-45" : " "
                      }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 duration-300 bg-white dark:border-body-color/20 !dark:text-black lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${navbarOpen ? "visibility top-full opacity-100" : "invisible top-[120%] opacity-0"
                    }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            style={{
                              color:
                                pathName === "/"
                                  ? "black"
                                  : window.innerWidth > 990
                                    ? "white"
                                    : "black",
                              fontWeight: "bolder",
                            }}
                            href={menuItem.path}
                            className="flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 px-6 py-4 sm:text-black text-white"
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${openIndex === index ? "block" : "hidden"
                                }`}
                            >
                              {menuItem.submenu.map((submenuItem, index) => (
                                <Link
                                  href={submenuItem.path}
                                  key={index}
                                  className="block rounded py-2 lg:py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}

                    <li className="group relative block lg:hidden">
                      <Link
                        style={{ color: "black", fontWeight: "bolder" }}
                        href={status === "authenticated" ? "/my-account" : "/signin"}
                        className="flex py-4 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 px-6 py-4 sm:text-black text-white"
                      >
                        {(status === "authenticated" || loggedIn ) ? "My Account" : "Sign in"}
                      </Link>
                    </li>

                  </ul>
                </nav>

              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                <Link
                  style={{ color: pathName === "/" ? "black" : "white", fontWeight: "bolder" }}
                  href={status === "authenticated" ? "/my-account" : "/signin"}
                  // onClick={status === "authenticated" ? handleSignOut : null} 
                  className="hidden px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white lg:block"
                >
                  {(status === "authenticated" || loggedIn) ? "My Account" : "Sign in"}
                </Link>
                {/* <Link
                  style={{ color: pathName === "/" ? "black" : "white", fontWeight: "bolder" }}
                  href="/signup"
                  className="hidden px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white md:block"
                >
                  Sign Up
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;