import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';

import brand1 from '../../../assets/brands/pngwing.com.png';
import brand2 from '../../../assets/brands/pngwing.com (1).png';
import brand3 from '../../../assets/brands/pngwing.com (2).png';
import brand4 from '../../../assets/brands/pngwing.com (3).png';
import brand5 from '../../../assets/brands/pngwing.com (4).png';
import brand6 from '../../../assets/brands/pngwing.com (5).png';
import brand7 from '../../../assets/brands/pngwing.com (6).png';
import brand8 from '../../../assets/brands/pngwing.com (7).png';
import brand9 from '../../../assets/brands/pngwing.com (8).png';
import brand10 from '../../../assets/brands/pngwing.com (9).png';

const brandLogos = [brand1, brand2, brand3, brand4, brand5, brand6, brand7, brand8, brand9, brand10];

const Brands = () => {
    return (
    <>
      <Swiper
        slidesPerView={4}
        centeredSlides={true}
        spaceBetween={30}
        grabCursor={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
      >
        {brandLogos.map((brand, index) => (
          <SwiperSlide key={index}>
            <img src={brand} alt={`Brand ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>

    );
};

export default Brands;