import React from 'react';
import { PiNotepadFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { logout } from "../../globalState/AuthSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    toast.success('Logout Successful')
  }

  return (
    <nav className='w-full h-16 bg-blue_border flex items-center justify-center'>
      <div className='w-2/5 h-auto px-4 flex items-center justify-start'>
        <Link to="/">
          <span className='text-white text-3xl'><PiNotepadFill /></span>
        </Link>
      </div>
      <div className='w-3/5 h-full px-4 flex items-center justify-end overflow-hidden'>
        {!isAuthenticated && (
          <>
            <Link to='/login' className='text-white text-lg font-semibold rounded-md px-4 py-2 border border-white hover:bg-white hover:text-blue-hover'>
              Login
            </Link>&nbsp;&nbsp;
            <Link to='/sign-up' className='text-white text-lg font-semibold rounded-md px-4 py-2 border border-white hover:bg-white hover:text-blue-hover'>
              Signup
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <div className='w-fit flex items-center justify-end h-auto'>
              <div className='w-fil mx-4 flex items-center justify-center overflow-hidden'>
                <img
                  className='w-10 h-10 rounded-full overflow-hidden border border-blue_border hover:border-red'
                  src={user?.profilePicture.url || "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png"}
                  alt={"User"}
                />
              </div>
              <button className='text-white text-lg font-semibold rounded-md bg-gray hover:bg-red-hover px-4 py-2' onClick={userLogout}>Logout</button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Header