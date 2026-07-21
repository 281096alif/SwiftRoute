import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser } = useAuth();
    const handelRegistration = (data) => {
        registerUser(data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };
    return (
        <div className='w-full max-w-md mx-auto text-center mt-10 p-6 bg-white rounded-lg shadow-md'>
            <form onSubmit={handleSubmit(handelRegistration)}>
                <fieldset className="fieldset">
                    <label className="label">Email</label>
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    <input type="email" className="input" placeholder="Email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} />
                    <label className="label">Password</label>
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    <input type="password" className="input" placeholder="Password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' }, })} />
                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
                <p>Already have an account? <Link className="link link-hover" to="/login">Login here</Link></p>
            </form>
            <SocialLogin/>
        </div>
    );
};

export default Register;