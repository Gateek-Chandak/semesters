import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login, logout } from '../redux/slices//authSlice'; // Path to your authSlice
import { setData } from '@/redux/slices/dataSlice';
import axios from 'axios';
import { RootState } from '../redux/store'; // Path to your store

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true); // Loading state to wait for authentication check
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SITE_URL}/api/auth/verify`, {
          withCredentials: true,
        });

        if (response.data.isAuthenticated) {
          const id = await response.data.user.id
          const name = await response.data.user.name
          const email = await response.data.user.email
          const userResponse = await axios.post(`${import.meta.env.VITE_SITE_URL}/api/term-database/get-term-data`, { googleId: id })

          if (userResponse.data.exists) {
            dispatch(setData(userResponse.data.user.term_data))
          } else {
            const newUserData = await axios.post(`${import.meta.env.VITE_SITE_URL}/api/term-database/create-new-user`, { googleId: id, name: name, email: email });
            dispatch(setData(newUserData.data.user.term_data))
            console.log('created new user', newUserData.data.user)
          }

          dispatch(login(response.data.user));
        } else {
          dispatch(logout())
        }
      } catch {
        // console.error('Authentication verification failed', error);
        dispatch(logout())
      } finally {
        setLoading(false); // Set loading to false once verification is done
      }
    };

    verifyAuth();
  }, [dispatch]);

  // If still loading, show a loading indicator or nothing
  if (loading) {
    return (
      <div className='w-full h-dvh bg-[#f7f7f7] flex flex-row justify-center items-start gap-4 pt-60'>
        <img src="/Objects/SemesterLogo.svg" className='bg-[#f7f7f7] h-10 w-10' alt="Semester Logo" />
        <h1 className='bg-[#f7f7f7] text-4xl'>Loading</h1>
      </div>
    )
  }

  // If authenticated, show the children (HomePage); otherwise, redirect to login
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
