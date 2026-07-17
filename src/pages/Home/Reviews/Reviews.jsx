import React, { use } from 'react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import ReviewCard from './ReviewCard';

const Reviews = ({ reviewPromise }) => {

    const reviews = use(reviewPromise);

    return (
        <div>
            <h2>Reviews</h2>
            <>
                <Swiper
                    effect="coverflow"
                    grabCursor
                    centeredSlides
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    pagination={{ clickable: true }}
                    modules={[EffectCoverflow, Pagination]}
                >
                    {
                        reviews.map(review =>
                            <SwiperSlide key={review.id}>
                                <ReviewCard review={review}></ReviewCard>
                            </SwiperSlide>
                        )
                    }
                </Swiper>
            </>

        </div>
    );
};

export default Reviews;