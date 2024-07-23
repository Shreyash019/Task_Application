import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

const SingleTask = () => {
  const [task, setTask] = useState();
  const { tid } = useParams();
  const {token } = useSelector((state) => state.auth);

  const fetchSingleTask = async () => {
    try {
      const response = await axios.get(`https://task-application-rt3q.onrender.com/task/${tid}`,{
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        withCredentials: true, // Include credentials if needed
      });
      if (response.data.success) {
        setTask(response.data.task)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchSingleTask()
  }, [])
  return (
    <section className='w-full h-screen flex items-center justify-center backdrop-blur-sm overflow-auto bg-gray-dark'>
      <div className='w-[94%] md:w-8/12 lg:w-2/5 h-4/5 float-left bg-white rounded-xl'>
        <div className='w-full h-[85%] float-left overflow-hidden'>
          <div className='h-full p-4'>
            <div className='w-auto h-1/5'>
              <h1 className='text-2xl font-semibold mb-4'>Task Details</h1>
              <div className='w-full h-auto my-4'>
                <p className='text-lg'><span className="text-gray-dark">Title: &nbsp;</span>{task?.title}</p>
              </div>
            </div>
            <div className='w-full h-3/5 my-4 p-2 overflow-hidden'>
              <div className='w-full h-full overflow-auto break-all'><span className='text-gray-dark'>Description:&nbsp;</span>{task?.description}</div>
            </div>
            <div className='w-auto h-1/5'>
            <p className='text-[0.65rem] my-2 text-gray'>Creates at:&nbsp;{new Date(task?.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className='w-full h-[15%] p-2 overflow-auto flex items-center justify-end'>
          <Link to='/'>
            <button className='w-fit h-auto p-2 mx-1 text-sm bg-gray-light rounded-md text-white hover:bg-blue_border'>Close</button>
          </Link>
        </div>
      </div>
      <Helmet><title>Task Application | Task Detail</title></Helmet>
    </section>
  )
}

export default SingleTask