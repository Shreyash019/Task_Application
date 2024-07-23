import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserSignUp } from '../../globalState/AuthSlice';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, isAuthenticated, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    function isValidEmail(email) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    }
    function isValidPassword(password) {
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,}$/;
      return pattern.test(password);
    }
    if(!formData.firstName){
      toast.error('Please enter your first name');
      return;
    }
    if(!formData.lastName){
      toast.error('Please enter your last name');
      return;
    }
    if(!formData.email){
      toast.error('Please enter your email address.');
      return;
    }
    if(!formData.password){
      toast.error('Please enter your password.');
      return;
    }
    const mailValid = isValidEmail(formData.email)
    const passwordValid = isValidPassword(formData.password)
    if (!mailValid) {
      toast.error('Please enter a valid email');
      return
    }
    if (!passwordValid) {
      toast.error('Invalid password!');
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password and Confirm Password does not match');
      return
    }
    dispatch(UserSignUp(formData));
  };

  const handleGoogleSignUp = () => {
    window.location.href = `https://task-application-rt3q.onrender.com/user/auth/google`;
  };

  useEffect(() => {
    if (status === 'succeeded' && isAuthenticated) {
      toast.success('Sign Up Successful')
      navigate('/');
    }
  }, [status, isAuthenticated, error, navigate, dispatch]);

  return (
    <section className='w-[98%] md:w-[70%] lg:w-2/5 h-auto'>
      <h1 className='text-4xl font-extrabold text-blue_border my-4'>Sign Up</h1>
      <div className='p-4 border-2 border-blue_border rounded-md'>
        <form className='w-full h-auto' onSubmit={handleSubmit}>
          <input
            type="text"
            className='w-full h-auto border border-gray-light p-2 my-2'
            placeholder='First Name'
            name="firstName"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            className='w-full h-auto border border-gray-light p-2 my-2'
            placeholder='Last Name'
            name="lastName"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className='w-full h-auto border border-gray-light p-2 my-2'
            placeholder='Email'
            name="email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            className='w-full h-auto border border-gray-light p-2 my-2'
            placeholder='Password'
            name="password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className='w-full h-auto border border-gray-light p-2 my-2'
            placeholder='Confirm Password'
            name="confirmPassword"
            onChange={handleChange}
            required
          />
          <button className='w-full h-auto p-2 my-2 bg-blue_border hover:bg-blue_border-hover text-white text-center rounded-sm' >Signup</button>
        </form>
        <p className='text-center text-sm my-2'>Already have an account?&nbsp;<Link to='/login'><span className='text-blue_border hover:text-blue_border-hover'>Login</span></Link></p>
        <div className='w-full h-auto my-4 flex items-center justify-center'>
          <button onClick={handleGoogleSignUp} className='p-2 bg-blue_border hover:bg-blue_border-hover text-white rounded-md'>
            Signup with Google
          </button>
        </div>
      </div>
      <Helmet><title>Task Application | Sign Up</title></Helmet>
    </section>
  )
}

export default SignUp