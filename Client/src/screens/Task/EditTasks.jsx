import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { editATask } from "../../globalState/taskSlice";
import axios from 'axios';
import { Helmet } from 'react-helmet';
import toast from "react-hot-toast";

const EditTasks = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tid } = useParams();
    const {token } = useSelector((state) => state.auth);
    const maxLengths = {
        title: 50,
        description: 500 
    };
    const [task, setTask] = useState({
        title: '',
        description: '',
    });
    const [remainingChars, setRemainingChars] = useState({
        title: maxLengths.title,
        description: maxLengths.description
    });


    const fetchSingleTask = async () => {
        try {
            const response = await axios.get(`https://task-application-rt3q.onrender.com/task/${tid}`, {
                headers: {
                  'Authorization': `Bearer ${token}`, // Include token in headers
                },
                withCredentials: true, // Include credentials if needed
              });
            if (response.data.success) {
                setTask({
                    title: response.data.task.title,
                    description: response.data.task.description
                });
                setRemainingChars({
                    title: maxLengths.title - response.data.task.title.length,
                    description: maxLengths.description - response.data.task.description.length
                });
            }
        } catch (error) {
            console.error('Error fetching task:', error);
            toast.error('Error in fetching task!');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (value.length > maxLengths[name]) {
            toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} can't be more than ${maxLengths[name]} characters`);
        } else {
            setTask({ ...task, [name]: value });
            setRemainingChars({ ...remainingChars, [name]: maxLengths[name] - value.length });
        }
    };

    const handleSubmit = () => {
        if(!tid && !task.title && task.description){
            toast.error('Please fill all the fields!');
            return;
        }
        dispatch(editATask({token, tid, title: task.title, description: task.description}))
            .then((data) => {
                if (data.payload) {
                    toast.success("Task Updated Successfully");
                    navigate('/');
                } else {
                    toast.error(data.error.message);
                }
            });
    };

    useEffect(() => {
        fetchSingleTask();
    }, []);

    return (
        <section className='w-full h-screen flex items-center justify-center backdrop-blur-sm overflow-auto bg-gray-dark'>
            <div className='w-[94%] md:w-8/12 lg:w-2/5 h-4/5 float-left bg-white rounded-xl'>
                <div className='w-full h-[85%] float-left overflow-auto'>
                    <div className='p-4'>
                        <h1 className='text-2xl font-semibold mb-8'>Edit Task</h1>
                        <div className='w-full h-auto my-4'>
                            <label htmlFor="task" className='w-full h-auto text-gray-dark'>Title:</label>
                            <input 
                                id='task' 
                                type='text' 
                                className='w-full px-2 py-1 border-b border-gray-light outline-none rounded-sm' 
                                name="title" 
                                placeholder='Task...' 
                                value={task.title} 
                                onChange={handleChange} 
                                maxLength={maxLengths.title} 
                            />
                            <small className='text-gray-dark'>{remainingChars.title} characters remaining</small>
                        </div>
                        <div className='w-full h-auto my-4'>
                            <label htmlFor="desc" className='w-full h-auto text-gray-dark'>Description:</label>
                            <textarea 
                                id="desc" 
                                className='w-full h-32 outline-none border p-2 border-gray-light' 
                                placeholder='Description...' 
                                name="description" 
                                value={task.description} 
                                onChange={handleChange} 
                                maxLength={maxLengths.description} 
                            ></textarea>
                            <small className='text-gray-dark'>{remainingChars.description} characters remaining</small>
                        </div>
                    </div>
                </div>
                <div className='w-full h-[15%] p-2 overflow-auto flex items-center justify-end'>
                    <button className='w-fit h-auto p-2 mx-1 text-sm bg-gray-light rounded-md text-white hover:bg-blue_border' onClick={handleSubmit}>Save</button>
                    <Link to='/'>
                        <button className='w-fit h-auto p-2 mx-1 text-sm bg-gray-light rounded-md text-white hover:bg-blue_border'>Close</button>
                    </Link>
                </div>
            </div>
            <Helmet><title>Task Application | Edit Task</title></Helmet>
        </section>
    );
}

export default EditTasks;
