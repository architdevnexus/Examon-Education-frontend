import React from "react";

const Mobile = React.memo(() => {
  return (
    <section className="mx-auto max-w-7xl w-full px-4 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-[#0E4B6C] px-6 py-10 md:px-12 md:py-14">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">

          {/* LEFT : Mobile Image */}
          <div className="relative flex justify-center md:justify-start">
            {/* Glow / Decorative background */}
            <div className="absolute -top-6 h-64 w-64 rounded-full bg-[#1E78A6]/40 blur-3xl md:h-80 md:w-80" />

            <img
              src="/mobile.svg"
              alt="Examon Education mobile app preview"
              loading="lazy"
              className="
                relative z-10
                w-[220px]
                sm:w-[260px]
                md:w-[300px]
                lg:w-[340px]
                xl:w-[360px]
              "
            />
          </div>

          {/* RIGHT : Content */}
          <div className="flex flex-col items-start gap-4 text-white">
            <span className="text-sm font-medium opacity-90">
              Learn anytime, anywhere with the
            </span>

            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Examon Education App
            </h2>

            <p className="max-w-md text-sm leading-relaxed opacity-90 sm:text-base">
              Attend live classes, watch recorded lectures, practice quizzes,
              and stay exam-ready — all from one powerful app.
            </p>

            <a
              href="https://play.google.com/store/apps/details?id=co.diy17.hcdeq"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Examon Education App from Google Play"
              className="mt-4 inline-flex transition-transform hover:scale-105 focus:scale-105"
            >
              <img
                src="/googleplay.svg"
                alt="Get it on Google Play"
                loading="lazy"
                className="h-12 sm:h-14"
              />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
});

export default Mobile;
