import React from 'react'

const Hero = ({ bg, Title, desc }) => {
  return (
    <section
      className="relative flex items-center justify-start flex-col h-[70vh] gap-3 text-[var(--background-color)] bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})`,
    backgroundPosition: 'contain',
    }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-10"></div>

      {/* Content */}
      <div className="relative z-20 mt-12 text-left px-4">
        <h1 className="font-bold text-3xl">{Title}</h1>
        <p className="text-sm w-1/2 ">{desc}</p>
      </div>
    </section>
  )
}

export default Hero
