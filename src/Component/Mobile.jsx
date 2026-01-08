import React from "react";

const Mobile = React.memo(() => {
  const handleLink = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=co.diy17.hcdeq",
      "_blank"
    );
  };

  return (
    <>
      {/* ================= DESKTOP / BIG DEVICE ================= */}
      <section
        onClick={handleLink}
        className="
          hidden
          lg:flex
          max-w-6xl
          mx-auto
          mt-8
          cursor-pointer
          items-center
          justify-center
        "
      >
        <img
          src="/examonappbanner.png"
          alt="Examon App Banner"
          loading="lazy"
          className="
            w-full
            rounded-2xl
            shadow-lg
           
          "
        />
      </section>

      {/* ================= MOBILE / SMALL DEVICE ================= */}
      <section
        onClick={handleLink}
        className="
          lg:hidden
          mx-auto
          cursor-pointer
          max-w-7xl
          px-4
          mt-6
        "
      >
        <div className="relative rounded-[32px] bg-[#0E4B6C] overflow-hidden">

          {/* Right angled shade (tablet only) */}
          <div className="absolute inset-y-0 right-0 hidden md:block w-[42%] bg-[#2E6386] clip-diagonal rounded-r-[32px]" />

          <div
            className="
              relative
              grid
              grid-cols-1
              gap-8
              min-h-[260px]
              md:min-h-[300px]
              px-6
              py-8
              md:px-16
            "
          >
            {/* IMAGE */}
            <div
              className="
                relative
                flex
                justify-center
                md:absolute
                md:left-10
                md:top-1/2
                md:-translate-y-1/2
                z-20
              "
            >
              {/* Glow */}
              <div
                className="
                  hidden
                  md:block
                  absolute
                  -left-12
                  top-1/2
                  -translate-y-1/2
                  h-[300px]
                  w-[300px]
                  rounded-full
                  bg-[#2BA4E6]
                  opacity-80
                  blur-3xl
                  -z-10
                "
              />

              <img
                src="/mobile.svg"
                alt="Examon Education App"
                loading="lazy"
                className="
                  w-[220px]
                  sm:w-[240px]
                  md:w-[280px]
                  drop-shadow-2xl
                "
              />
            </div>

            {/* TEXT */}
            <div
              className="
                text-white
                text-center
                md:text-left
                md:ml-[260px]
              "
            >
              <span className="text-sm opacity-90">
                Learn anytime, anywhere with the
              </span>

              <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold">
                Examon Education App
              </h2>

              <p className="mt-3 max-w-md mx-auto md:mx-0 text-sm sm:text-base opacity-90">
                Attend live classes, watch recorded lectures, practice quizzes,
                and stay exam-ready — all from one powerful app.
              </p>

              <div className="mt-5 flex justify-center md:justify-start">
                <img
                  src="/googleplay.svg"
                  alt="Get it on Google Play"
                  className="h-11 sm:h-12 transition-transform hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clip Path */}
        <style>
          {`
            .clip-diagonal {
              clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
            }
          `}
        </style>
      </section>
    </>
  );
});

export default Mobile;
