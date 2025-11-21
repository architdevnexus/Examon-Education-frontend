import React, { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import CoursesSmallCard from "./Card/CoursesSmallCard";
import { useCourseStore } from "../Zustand/GetAllCourses";
import { motion } from "framer-motion";

const CategoryCourses = ({ category }) => {
    const { data, loading, error, fetchCourses } = useCourseStore();

    // Track screen size for changing swiper direction
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);

        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    useEffect(() => {
        if (!data || data.length === 0) {
            fetchCourses();
        }
    }, [fetchCourses, data]);

    const filteredCourses = useMemo(() => {
        if (!data || !category) return [];
        return data.filter((course) => {
            const courseCat = course?.examCategory?.toLowerCase?.();
            return courseCat === category.toLowerCase();
        });
    }, [data, category]);
    console.log(filteredCourses)
    return (
        <div className="mt-8">
            <motion.h2
                className="text-2xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Courses in <span className="text-[var(--primary-color)]">{category}</span>
            </motion.h2>

            {loading && (
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="w-full h-32 bg-gray-200 animate-pulse rounded-xl"
                        ></div>
                    ))}
                </div>
            )}

            {error && <p className="text-red-600 font-medium">Failed to load courses.</p>}

            {!loading && filteredCourses.length === 0 && (
                <p className="text-gray-500">No courses found in this category.</p>
            )}

            {!loading && filteredCourses.length > 0 && (
                <Swiper
                    direction={isDesktop ? "vertical" : "horizontal"}
                    spaceBetween={20}
                    slidesPerView={isDesktop ? 3 : 2}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: isDesktop ? 3 : 2 },
                        768: { slidesPerView: isDesktop ? 4 : 3 },
                        1024: { slidesPerView: isDesktop ? 5 : 4 },
                    }}
                    modules={[Autoplay]}
                    className="mySwiper w-full h-[400px] lg:h-[600px]" // height for vertical mode
                >
                    {filteredCourses.map((course, index) => (
                        <SwiperSlide key={index}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <CoursesSmallCard
                                    image={course?.img}
                                    courseName={course?.courseDetails}
                                    actualPrice={course?.actualprice}
                                    previousPrice={course?.previousprice}
                                    discount={course?.percent}
                                    courseId={course?.id}
                                />
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default CategoryCourses;
