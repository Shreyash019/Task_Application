import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { taskStatusUpdate, fetchAllUsersTasks } from '../../globalState/taskSlice';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Example from './Example';
import toast from 'react-hot-toast';
import Loader from '../Navigation/Loader';

const Tasks = () => {
  const dispatch = useDispatch();
  const { allTasks } = useSelector((state) => state.allTask);
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [searchTerm, setSearch] = useState('');
  const [sortFrom, setSortFrom] = useState('recent');
  const [tasks, setTasks] = useState({
    todo: undefined,
    progress: undefined,
    completed: undefined,
    updateValue: undefined
  });

  const fetchTasks = useCallback(async (sort, search) => {
    try {
      await dispatch(fetchAllUsersTasks({token, sort, search} ));
    } catch (error) {
      toast.error('Error fetching tasks!');
    }
  }, [dispatch]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const { fromList, targetId } = active.data.current;
    const { toList, index } = over.data.current;

    if (fromList === toList) {
      const sortedItems = arrayMove(tasks[toList], tasks[toList].findIndex((task) => task._id === targetId), index);
      setTasks((prev) => ({ ...prev, [toList]: sortedItems }));
    } else {
      const draggedItem = tasks[fromList].find((task) => task._id === targetId);
      const updatedFromList = tasks[fromList].filter((task) => task._id !== targetId);
      const updatedToList = [...tasks[toList].slice(0, index), draggedItem, ...tasks[toList].slice(index)];

      setTasks((prev) => ({ ...prev, [fromList]: updatedFromList, [toList]: updatedToList }));
      dispatch(taskStatusUpdate( {token, status: toList, tasks: updatedToList }));
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSortChange = (e) => {
    setSortFrom(e.target.value);
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      if(!searchTerm){
        fetchTasks(sortFrom);
      } else {
        fetchTasks(sortFrom, searchTerm);
      }
    }
  }, [sortFrom, searchTerm, token, isAuthenticated, fetchTasks]);

  useEffect(() => {
    if (allTasks && allTasks.todo && allTasks.progress && allTasks.completed) {
      setTasks({ todo: allTasks.todo, progress: allTasks.progress, completed: allTasks.completed, updateValue: undefined });
    }
  }, [allTasks]);

  return (
    <section className='w-full h-auto md:w-11/12 lg:w-10/12 py-12 md:p-4 lg:p-12'>
      <div className='w-full h-auto my-2 overflow-auto'>
        <Link to='/new-task'>
          <button className='w-40 py-1 h-auto rounded-md bg-blue_border text-white hover:bg-blue_border-hover'>Add Task</button>
        </Link>
        <div className='w-full h-auto my-4 border border-white-input-light shadow-md shadow-gray-light rounded overflow-auto'>
          <div className='w-full lg:w-1/2 h-auto float-left overflow-auto flex items-center justify-center px-4 py-2 lg:py-3'>
            <label htmlFor='search'>Search:&nbsp;</label>
            <input id='search' type="text" name='search' className='w-full h-auto px-2 py-1 font-medium rounded border border-white-input-light' placeholder='Search...' value={searchTerm} onChange={handleSearchChange}></input>
          </div>
          <div className='w-full lg:w-1/2 h-auto float-left overflow-auto flex items-center justify-start lg:justify-end px-4 py-2 lg:py-3'>
            <p className='md:text-sm sm:text-xs'>Sort By:&nbsp;</p>
            <select className='w-auto h-auto px-2 py-1 font-medium rounded outline-none border border-white-input-light md:text-sm sm:text-xs' name="sortBy" id="sort" value={sortFrom} onChange={handleSortChange}>
              <option value="default">Default</option>
              <option value="recent">Recent</option>
            </select>
          </div>
        </div>
        <div className='w-full h-auto my-4 overflow-auto'>
          {tasks.todo && tasks.progress && tasks.completed && (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={tasks?.todo}>
                <Example tasks={tasks} />
              </SortableContext>
            </DndContext>
          )}
          {!tasks.todo && !tasks.progress && !tasks.completed && (
            <>
            <div className='w-full h-auto flex items-center justify-center'><Loader/></div>
            <div className='w-full text-center text-xl font-bold'>
              <span className='text-gradient'>Loading...</span>
            </div>
            </>
          )}
        </div>
      </div>
      <Helmet><title>Task Application | Home</title></Helmet>
    </section>
  );
};

export default Tasks;
