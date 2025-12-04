import React, { Suspense, lazy, memo } from "react";
import Hero from "../Component/Hero";

// Lazy-load heavy sections for performance
const FourStepSelection = lazy(() =>
  import("../Component/FourStepSelection").then((m) => ({ default: m.FourStepSelection }))
);
const AboutNumber = lazy(() => import("../Component/AboutNumber"));
const MissionVisionValues = lazy(() => import("../Component/MissionVisionValus"));
const ContactSection = lazy(() => import("../Component/ContactSection"));

//  Reusable loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center py-20 text-gray-500 animate-pulse">
    Loading content...
  </div>
);

const Aboutus = () => {
  return (
    <main className="flex flex-col min-h-screen w-full bg-white text-gray-800 overflow-hidden">
      {/*  Hero Section */}
      <Hero
        Title=""
        desc=""
        bg="/AboutUs.png"
      />

      {/*  Async Sections */}
      <Suspense fallback={<LoadingFallback />}>
        {/* Four Step Section */}
        <section className="min-w-full">
          <FourStepSelection />
        </section>

        {/* About Numbers */}
        <section className="min-w-full">
          <AboutNumber />
        </section>

        {/* Mission & Vision Section */}
        <section className="flex flex-col items-center justify-center w-full py-10">
          <MissionVisionValues />
        </section>

        {/* Contact Section */}
        <section className="w-full mb-12">
          <ContactSection />
        </section>
      </Suspense>
    </main>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(Aboutus);
