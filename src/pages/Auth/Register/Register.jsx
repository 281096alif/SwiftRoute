import React from 'react';
import { useForm } from 'react-hook-form';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const handelRegistration = (data) => {
        console.log(data);
    };
    return (
        <div>
            <form className='w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md' onSubmit={handleSubmit(handelRegistration)}>
                <fieldset className="fieldset">
                    <label className="label">Email</label>
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    <input type="email" className="input" placeholder="Email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} />
                    <label className="label">Password</label>
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    <input type="password" className="input" placeholder="Password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
            </form>
        </div>
    );
};

export default Register;