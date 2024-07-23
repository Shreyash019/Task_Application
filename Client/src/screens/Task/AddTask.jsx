import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { createANewTask } from "../../globalState/taskSlice";
import toast from "react-hot-toast";
import { Helmet } from 'react-helmet';

const AddTask = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {token } = useSelector((state) => state.auth);
    const maxLengths = {
        title: 50,
        description: 500 
    };

    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const [remainingChars, setRemainingChars] = useState({
        title: maxLengths.title,
        description: maxLengths.description
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (value.length > maxLengths[name]) {
            toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} can't be more than ${maxLengths[name]} characters`);
        } else {
            setFormData({ ...formData, [name]: value });
            setRemainingChars({ ...remainingChars, [name]: maxLengths[name] - value.length });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!formData.title && !formData.description){
            toast.error("Please fill all the fields");
            return
        }
        dispatch(createANewTask({token, title: formData.title, description: formData.description}))
        .then((data) => {
            if (data.payload) {
                toast.success("Task Created Successfully");
                navigate('/');
            } else {
                toast.error(data.error.message);
            }
        });
    };

    return (
        <section className='w-full h-screen flex items-center justify-center backdrop-blur-sm overflow-auto bg-gray-dark'>
            <div className='w-[94%] md:w-8/12 lg:w-[50%] sm:h-[30rem] h-[75%] float-left bg-white rounded-xl'>
                <div className='w-full h-[85%] float-left overflow-hidden'>
                    <div className='p-4'>
                        <h1 className='text-2xl font-semibold mb-8'>Add Task</h1>
                        <div className='w-full h-auto my-4'>
                            <label htmlFor="task" className='w-full h-auto text-gray-dark'>Title:</label>
                            <input 
                                id='task' 
                                type='text' 
                                className='w-full px-2 py-1 border-b border-gray-light outline-none rounded-sm' 
                                placeholder='Task Name...' 
                                name="title" 
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
                                onChange={handleChange} 
                                maxLength={maxLengths.description} 
                            ></textarea>
                            <small className='text-gray-dark'>{remainingChars.description} characters remaining</small>
                        </div>
                    </div>
                </div>
                <div className='w-full h-[15%] p-2 overflow-auto flex items-center justify-end'>
                    <button 
                        className='w-fit h-auto p-2 mx-1 text-sm bg-gray-light rounded-md text-white hover:bg-blue_border' 
                        onClick={handleSubmit}
                    >Save</button>
                    <Link to='/'>
                        <button className='w-fit h-auto p-2 mx-1 text-sm bg-gray rounded-md text-white hover:bg-blue_border'>Cancel</button>
                    </Link>
                </div>
            </div>
            <Helmet><title>Task Application | New Task</title></Helmet>
        </section>
    );
};

export default AddTask;
