import React from 'react';
import Lottie from 'react-lottie';
import Error404 from '../../Lottie/404.json';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
const ErrorPage = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: Error404,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    return (

        <div className='h-screen  w-full'>
            <div className='w-full h-auto p-12 flex items-start justify-center'>
                <Lottie
                    options={defaultOptions}
                    height={250}
                    width={400}
                />
            </div>
            <div className='w-full h-auto flex items-center justify-center'>
                <Link to='/'>
                <button className='px-6 py-2 bg-blue_border rounded-lg text-xl font-bold text-white hover:bg-navy'>Home</button>
                </Link>
            </div>
            <Helmet><title>Task Application | Error 404</title></Helmet>
        </div>
    )
}

export default ErrorPage