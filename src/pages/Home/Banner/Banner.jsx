import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImage1 from '../../../assets/banner/Banner1.png';
import bannerImage2 from '../../../assets/banner/Banner2.png';
import bannerImage3 from '../../../assets/banner/Banner3.png';
const Banner = () => {
    return (
        <div>
             <Carousel autoPlay infiniteLoop>
                <div>
                    <img src={bannerImage1} />
                </div>
                <div>
                    <img src={bannerImage2} />
                </div>
                <div>
                    <img src={bannerImage3} />
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;