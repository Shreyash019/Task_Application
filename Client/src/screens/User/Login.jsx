import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserSignIn } from '../../globalState/AuthSlice';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, isAuthenticated, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email address.');
      return;
    }
    if (!formData.password) {
      toast.error('Please enter your password.');
      return;
    }    
    function isValidEmail(email) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    }
    const mailValid = isValidEmail(formData.email)
    if (!mailValid) {
      toast.error('Please enter a valid email');
      return
    }
    dispatch(UserSignIn(formData))
      .catch((err) => {
        console.log(err)
        toast.error(err.toString())
      });
  };
  const handleGoogleSignIn = () => {
    window.location.href = `https://task-application-rt3q.onrender.com/user/auth/google`;
  };

  useEffect(() => {
    if (status === 'succeeded' && isAuthenticated) {
      toast.success('Login Successful')
      navigate('/');
    }
  }, [status]);
  return (
    <section className='w-full lg:w-2/5 h-auto'>
      <h1 className='text-4xl font-extrabold text-blue_border my-4'>Login</h1>
      <div className='p-4 border-2 border-blue_border rounded-md'>
        <form className='w-full h-auto' onSubmit={handleSubmit}>
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
            placeholder='password'
            name="password"
            onChange={handleChange}
            required
          />
          <button className='w-full h-auto p-2 my-2 bg-blue_border hover:bg-blue_border-hover text-white text-center rounded-sm' >Login</button>
        </form>
        <p className='text-center text-sm my-2'>Don't have an account?&nbsp;<Link to='/sign-up'><span className='text-blue_border hover:text-blue_border-hover'>Signup</span></Link></p>
        <div className='w-full h-auto my-4 flex items-center justify-center'>
          <button className='p-2 bg-blue_border hover:bg-blue_border-hover text-white rounded-md' onClick={handleGoogleSignIn}>Login with Google</button>
        </div>
      </div>
      <Helmet><title>Task Application | Login</title></Helmet>
    </section>
  )
}

export default Login