import React, { useEffect, useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import RecordedBatchesCard from "./Card/RecordedBatchesCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useBatchesStore } from "../Zustand/GetLiveBatches";

const LiveRecordedBatches = () => {
  const { loading, error, batchData, fetchBatches } = useBatchesStore();
  const swiperRef = useRef(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  // ✔ Always guarantee minimum 3 slides
  const preparedSlides = useMemo(() => {
    if (batchData.length >= 3) return batchData;

    const arr = [...batchData];
    while (arr.length < 3) {
      arr.push(...batchData); // duplicate
    }
    return arr.slice(0, 3);
  }, [batchData]);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-lg text-gray-600">
        Loading batches...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-20 text-red-500">{error}</div>
    );

  if (!batchData.length)
    return (
      <div className="flex justify-center py-20 text-gray-500">
        No batches available.
      </div>
    );

  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white relative">
      <h2 className="text-center text-4xl md:text-5xl font-bold mb-12 text-[var(--primary-color)]">
        Live & Recorded Batches
      </h2>

      <div className="max-w-full mx-auto relative px-4">
        <Swiper
          ref={swiperRef}
          modules={[EffectCoverflow, Autoplay, Navigation]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop={true}   // now always works
          speed={900}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 3 },
          }}
          coverflowEffect={{
            rotate: 25,
            stretch: 20,
            depth: 150,
            modifier: 1.5,
            slideShadows: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="px-2"
        >
          {preparedSlides.map((batch, index) => (
            <SwiperSlide
              key={batch._id + index}
              className="flex justify-center items-center !w-auto"
            >
              <RecordedBatchesCard {...batch} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-50px] flex items-center gap-6 z-30">
          <button
            onClick={() => swiperRef.current.swiper.slidePrev()}
            className="bg-[var(--primary-color)] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            aria-label="Previous Slide"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => swiperRef.current.swiper.slideNext()}
            className="bg-[var(--primary-color)] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            aria-label="Next Slide"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveRecordedBatches;
