import React from 'react';
import one from "../../public/About1.png";
import two from "../../public/About2.png";
import three from "../../public/About3.png";
import four from "../../public/About4.png";
import wave from "../../public/Aboutuswave.png";

export const FourStepSelection = () => {
    const data = [
        {
            num: one,
            title: "Learn",
            desc: "Create a detailed profile highlighting your skills, experience, and career aspirations to attract potential employers."
        },
        {
            num: two,
            title: "Practice",
            desc: "Get matched with job opportunities that align with your profile and career goals through our advanced algorithm."
        },
        {
            num: three,
            title: "Analyze ",
            desc: "Easily schedule interviews with potential employers at your convenience through our integrated scheduling system."
        },
        {
            num: four,
            title: "Improve",
            desc: "Receive, review, and manage job offers seamlessly through our platform, ensuring you make informed career decisions."
        }
    ];

    return (
        <div className='relative min-h-[100vh] z-989 min-w-full -mt-44'>
            <section
                className="absolute h-full flex flex-col p-7 min-w-full items-center bg-white overflow-hidden"
                style={{clipPath: "polygon(15% 0, 87% 0, 100% 18%, 100% 100%, 80% 100%, 20% 100%, 0 100%, 0 18%)" }}
            >
                {/* Heading */}
                <h2 className="text-center py-8 text-2xl md:text-3xl  text-[var(--text-color)]">
                    A Four-step system for{' '}
                    <span className="text-[var(--primary-color)] font-bold">
                        Predictable Selection
                    </span>
                </h2>
            {/* </section>
            <section> */}
                {/* Steps Grid */}
                <div className="grid  grid-cols-1 md:grid-cols-4 gap-8 min-w-full px-4 relative z-10">
                    {data.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col p-4 transition-transform duration-300 ${idx % 2 === 1 ? "translate-y-8 md:translate-y-46" : ""
                                }`}
                        >
                            <div className='flex items-end justify-end'>

                                <img src={item.num} alt={item.title} className="h-16 w-16 mb-4 " />
                            </div>
                            <div className='flex items-start justify-start'>

                                <h3 className="text-[var(--primary-color)] text-left text-3xl font-bold mb-2">{item.title}</h3>
                            </div>
                            <p className="text-[var(--text-color)] text-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Decorative Wave */}
                <img
                    src={wave}
                    alt="Wave decoration"
                    className="absolute hidden md:block px-3 top-1/4  w-full h-auto z-0"
                />
            </section>
        </div>
    );
};
