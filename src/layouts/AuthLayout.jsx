import React from 'react';
import { Outlet } from 'react-router';

import authImage from '../assets/authimage.jpg';

const AuthLayout = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            {/* logo */}
            <div className='flex justify-center items-center gap-10'>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
                <div className='flex-1'>
                    <img className='max-w-1/2 h-auto' src={authImage} alt="auth" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;