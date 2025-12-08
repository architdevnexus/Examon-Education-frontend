import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CiSearch, CiUser } from "react-icons/ci";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useExamStore } from "../../Zustand/GetAllExams";
import HeaderNotification from "../Notification/HeaderNotification";

const GlobalSearchModal = lazy(() => import("../GlobalSearch"));

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /** ------------------ UI States ------------------ **/
  const [menuOpen, setMenuOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  /** ------------------ Zustand Stores ------------------ **/
  const { exams, loading, error, fetchAllExams } = useExamStore();

  /** ------------------ Fetch Exams ------------------ **/
  useEffect(() => {
    if (!exams.length) fetchAllExams();
  }, [exams.length, fetchAllExams]);
  // console.log(exams)

  /** ------------------ Auto-focus Search ------------------ **/
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  /** ------------------ Handlers ------------------ **/
  const handleNavigate = useCallback(
    (path) => {
      setMenuOpen(false);
      setExamOpen(false);
      setIsSearchOpen(false);
      navigate(path);
      // console.log(path)
    },
    [navigate]
  );

  const handleExamClick = useCallback(
    (id) => {
      setExamOpen(false);
      setMenuOpen(false);
      navigate(`/exams/${id}`);
    },
    [navigate]
  );

  /** ------------------ Navigation Links ------------------ **/
  const navLinks = useMemo(
    () => [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Courses", path: "/courses" },
      { label: "Quiz", path: "/quiz" },
      { label: "Study Material", path: "/study-material" },
      { label: "Blog", path: "/blog" },
      { label: "Contact", path: "/contact" },
    ],
    []
  );

  /** ------------------ Framer Motion Variants ------------------ **/
  const dropdownVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -8 },
  };

  const menuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 25 },
    },
    exit: { opacity: 0, x: "100%" },
  };

  const underlineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: { scaleX: 0, opacity: 0 },
  };
  const token = localStorage.getItem('token')
  /** ------------------ JSX ------------------ **/
  return (
    <div className="flex flex-col fixed left-0 top-0 z-[998]  w-full">

      <nav className="bg-white shadow-md  ">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* ----------- Left Section: Logo & Exams Dropdown ----------- */}
          <div className="flex items-center gap-2 md:gap-5">
            <img
              src="/examon_logo.svg"
              alt="Logo"
              className="h-8 sm:h-12 w-auto cursor-pointer select-none"
              onClick={() => handleNavigate("/")}
            />

            <div className="h-12  bg-gray-300" />

            <div className="relative">
              <div className="flex items-center gap-3 md:gap-4">

                <button
                  onClick={() => setExamOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={examOpen}
                  className=" p-1 md:px-2 z-[991] text-xs sm:text-base rounded-md border-2 border-[var(--secondary-color)] text-gray-700 font-medium hover:text-[var(--primary-color)] transition flex items-center gap-1"
                >
                  All Exams ▾
                </button>

                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate("/batches")}
                >
                  {/* Blinking Dot */}
                  {/* <motion.p
                    className="w-1 h-1 bg-red-600 rounded-full"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  /> */}

                  {/* Blinking Text */}
                  {/* <motion.span
                    className="text-red-600 text-xs font-bold"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  >
                    Live Batches
                  </motion.span> */}
                </div>
              </div>

              <AnimatePresence>
                {examOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 max-h-72 overflow-y-auto backdrop-blur-sm"
                  >
                    {/* Loading State */}
                    {loading && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">
                        Loading exams...
                      </p>
                    )}

                    {/* Error State */}
                    {error && (
                      <p className="text-sm text-red-500 p-4 text-center">
                        Failed to load exams
                      </p>
                    )}

                    {/* Exam List */}
                    {!loading &&
                      !error &&
                      exams.map((exam) => (
                        <div
                          key={exam._id}
                          onClick={() => handleExamClick(exam._id)}
                          className="
              px-4 py-3 
              cursor-pointer 
              text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-800 
              transition-all 
              duration-200 
              rounded-lg
              z-[999]
            "
                        >
                          {exam.examDetailsCategory}
                        </div>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* ----------- Center: Desktop Navigation ----------- */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <div key={path} className="relative">
                  <button
                    onClick={() => handleNavigate(path)}
                    className={`text-gray-700 font-medium   cursor-pointer  hover:text-[var(--primary-color)] transition ${isActive ? "text-[var(--primary-color)]" : ""
                      }`}
                  >
                    {label}
                  </button>
                  {isActive && (
                    <motion.div
                      key={path}
                      className="absolute left-0 bottom-[-4px] h-[2px] bg-[var(--primary-color)] w-full origin-left"
                      variants={underlineVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    />
                  )}
                </div>
              );
            })}

            {/* Search Icon */}
            <CiSearch
              className="text-2xl text-gray-600 cursor-pointer hover:text-[var(--primary-color)] transition"
              onClick={() => setIsSearchOpen(true)}
            />

            <div className="h-10 w-px bg-gray-300" />

            {/* ----------- Authenticated User Section ----------- */}
            {token ? (
              <div className="flex items-center gap-3">
                <FiShoppingCart
                  className="text-2xl text-gray-700 cursor-pointer hover:text-[var(--primary-color)] transition"
                  onClick={() => handleNavigate("/cart")}
                />
                <CiUser
                  className="text-2xl text-gray-700 cursor-pointer hover:text-[var(--primary-color)] transition"
                  onClick={() => handleNavigate("/profile")}
                />
              </div>
            ) : (
              <button
                onClick={() => handleNavigate("/login")}
                className="bg-[var(--primary-color)] text-white px-5 py-2 rounded-full hover:brightness-95 transition"
              >
                Login / Signup
              </button>
            )}
          </div>

          {/* ----------- Mobile Menu Button ----------- */}
          <div className="md:hidden flex items-center gap-3">
            <CiSearch
              className="text-xl text-gray-600 cursor-pointer hover:text-[var(--primary-color)] transition"
              onClick={() => setIsSearchOpen(true)}
            />
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-md"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* ----------- Mobile Drawer ----------- */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-[998]"
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-[999] p-5 overflow-y-auto"
              >
                <div className="flex flex-col gap-4 mt-5">
                  {navLinks.map(({ label, path }) => (
                    <button
                      key={path}
                      onClick={() => handleNavigate(path)}
                      className={`text-left border-l-2   cursor-pointer  py-2 px-2 ${location.pathname === path
                        ? "text-[var(--primary-color)] font-semibold"
                        : "text-gray-700"
                        }`}
                    >
                      {label}
                    </button>
                  ))}

                  <div className="border-t my-3" />

                  {token ? (
                    <>
                      <button
                        onClick={() => handleNavigate("/cart")}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
                      >
                        <FiShoppingCart className="text-xl" />
                        <span>Cart</span>
                      </button>
                      <button
                        onClick={() =>
                          handleNavigate(`/profile`)
                        }
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
                      >
                        <CiUser className="text-xl" />
                        <span>Profile</span>
                      </button>

                    </>
                  ) : (
                    <button
                      onClick={() => handleNavigate("/login")}
                      className="mt-3 bg-[var(--primary-color)] text-white py-2 rounded-full font-medium hover:brightness-95 transition"
                    >
                      Login / Sign Up
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* ----------- Global Search Modal ----------- */}
      <Suspense fallback={null}>
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </Suspense>
      <HeaderNotification />
    </div>
  );
};

export default React.memo(Navbar);
