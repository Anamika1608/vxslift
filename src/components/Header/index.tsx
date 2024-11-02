"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import path from "path";
import { toast } from 'react-hot-toast';
import { ChevronDown, LogOut } from 'lucide-react';
import useAppContext from '../../context/authContext.js'
import { useRouter } from "next/navigation";

const Header = () => {
  // Navbar toggle
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(990);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userID, setUserID] = useState("");
  const navbarRef = useRef(null);
  const pathName = usePathname();
  const { loggedIn, setLoggedIn } = useAppContext()
  // const [ loggedIn, setLoggedIn ] =  useState(false); 
  const navbarToggleHandler = () => {
    setNavbarOpen((prev) => !prev);
  };

  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  const { data: session, status } = useSession();
  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  const url = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const check = async () => {
      if (loggedIn) {
        try {
          const response = await axios.get(`${url}/get_user`, {
            withCredentials: true
          })
          if (response.data || status === "authenticated") setLoggedIn(true)
          else setLoggedIn(false)
        } catch (error) {
          console.error('Error checking auth:', error);
        }
      }
    };

    check();
  }, [path]);

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (!session?.user) {
        try {
          const response = await axios.get(`${url}/get_user`, {
            withCredentials: true,
          });
          setUserID(response.data.id);
          setLoggedIn(true);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      } else {
        try {
          const response = await axios.get(`${url}/findUserByMail`, {
            params: { mail: session.user.email },
            withCredentials: true,
          });
          setUserID(response.data.userId);
          setLoggedIn(true);
        } catch (error) {
          console.error('Error fetching user by mail:', error);
        }
      }
    };

    getUser();
  }, [session, url]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    if (session?.user) {
      toast.success('Logged out successfully!');
      setTimeout(() => {
        signOut({
          callbackUrl: '/',
        });
      }, 500);
    }
    else {
      await axios.get(`${url}/logout`);
      setLoggedIn(false);
      toast.success('Logged out successfully!');
      router.push('/')
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
                                  : windowWidth > 990
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
                      {!(status === 'authenticated' || loggedIn) ? (
                        <Link
                          href="/signin"
                          style={{ color: "black", fontWeight: "bolder" }}
                          className="flex py-4 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 px-6 py-4 sm:text-black text-white"
                        >
                          Sign in
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsOpen(!isOpen)}
                            style={{ color: "black", fontWeight: "bolder" }}
                            className="flex items-center py-4 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 px-6 py-4 sm:text-black text-white w-full"
                          >
                            My Account
                            <ChevronDown
                              className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                }`}
                            />
                          </button>

                          {isOpen && (
                            <div className=" px-2">
                              <Link
                                href='/my-account'
                                className="flex items-center text-black font-semibold w-full py-3 bg-neutral-200 hover:bg-neutral-300 px-6 rounded-xl"
                              >
                                Check Plans
                              </Link>
                              <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 mt-2 py-3 text-base text-red-600 w-full font-semibold  bg-neutral-200 hover:bg-neutral-300 px-6  rounded-xl"
                              >
                                <LogOut className="w-4 h-4" />
                                Sign out
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </li>

                  </ul>
                </nav>
              </div>

              <div className="flex items-center justify-end pr-16 lg:pr-0">
                {status === "authenticated" || loggedIn ? (
                  <div className="relative group">
                    <Link
                      href="/my-account"
                      className="hidden px-7 py-3 text-base font-medium hover:opacity-70 lg:flex items-center gap-2"
                      style={{
                        color: pathName === "/" ? "black" : "white",
                        fontWeight: "bolder"
                      }}
                    >
                      My Account
                      <ChevronDown className="w-4 h-4" />
                    </Link>

                    <div className="absolute right-0 mt-2 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="py-1 bg-white rounded-md shadow-lg">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-red-600 font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/signin"
                    className="hidden px-7 py-3 text-base font-medium hover:opacity-70 lg:block"
                    style={{
                      color: pathName === "/" ? "black" : "white",
                      fontWeight: "bolder"
                    }}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;