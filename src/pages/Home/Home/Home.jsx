import React from 'react';
import Banner from '../Banner/Banner';
import Brands from '../Brands/Brands';
import Reviews from '../Reviews/Reviews';

const reviewPromise = fetch('/reviews.json')
    .then(response => response.json());

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Brands></Brands>
            <Reviews reviewPromise={reviewPromise}></Reviews>
        </div>
    );
};

export default Home;