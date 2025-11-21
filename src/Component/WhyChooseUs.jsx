import React from "react";

const WhyChooseUs = () => {
    const data = [
        { id: "/01.svg", title: "Exam-Specific Content", description: "Study materials, lectures, & tests that are customized for a particular exam" },
        { id: "/02.svg", title: "Rapid Doubt Support", description: "Dedicated feature designed to help students resolve their queries instantly." },
        { id: "/03.svg", title: "Mock Analytics", description: "Accuracy, time, weak-area heatmaps." },
        { id: "/04.svg", title: "Transparent Results", description: "Clear deliverables, fair pricing, verified selections." },
        { id: "/05.svg", title: "4-Step System", description: "Learn → Practice → Analyze → Improve." },
        { id: "/06.svg", title: "Bilingual & Accessible", description: "Hindi + English · App & Web · recordings" },
        { id: "/07.svg", title: "Structured Study Plans", description: "Weekly roadmaps, streaks, accountability." },
        { id: "/08.svg", title: "Audio Notes", description: "On-the-go micro-revision with spaced cues" },
    ];

    const Card = ({ src, title, description }) => (
        <div className="flex items-start gap-6 p-4 ">
            <div className="flex items-center gap-3">
                <img src={src} alt={title} className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <div>

                <span className="font-semibold text-lg md:text-xl text-[var(--primary-color)]">{title}</span>
            <p className="text-[var(--text-color)] text-left  text-sm md:text-base">{description}</p>
            </div>
        </div>
    );

    const SpecialCard = () => (
        <div className="flex h-[25vh] items-center justify-center bg-gradient-to-r from-[#003E68] to-[#98BCD3] text-white font-bold text-lg md:text-4xl rounded-lg p-6 md:p-10 shadow-lg text-center">
            Why Choose Us
            <img src="/star.svg" alt="" className=""/>
        </div>
    );

    return (
        <div className="flex flex-col gap-6  bg-gray-50">
            {/* Top Row: Cards 1-3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-5 gap-6">
                {data.slice(0, 3).map((item) => (
                    <Card key={item.id} src={item.id} title={item.title} description={item.description} />
                ))}
            </div>

            {/* Middle Row: Card 4, SpecialCard, Card 5 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6  p-4 bg-[#EEF6FC] rounded-lg">
                <Card src={data[3].id} title={data[3].title} description={data[3].description} />
                <SpecialCard />
                <Card src={data[4].id} title={data[4].title} description={data[4].description} />
            </div>

            {/* Bottom Row: Cards 6-8 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 p-5 lg:grid-cols-3 gap-6">
                {data.slice(5, 8).map((item) => (
                    <Card key={item.id} src={item.id} title={item.title} description={item.description} />
                ))}
            </div>
        </div>
    );
};

export default WhyChooseUs;
