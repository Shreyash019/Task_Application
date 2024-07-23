// Example.jsx
import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import DropArea from './DropArea';
import Lottie from 'react-lottie';
import NoData from '../../Lottie/NoData.json';

export default function Example({ tasks }) {
  const { todo, progress, completed } = tasks;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <section className='w-full h-auto rounded-md overflow-auto'>
      <div className='h-auto overflow-auto flex flex-wrap items-start justify-around'>
        {/* Tdo */}
        <div className='w-full lg:w-[32%] h-full p-2 border border-white-input-light shadow-md shadow-white-input-light rounded-md'>
          <h2 className='bg-gradient-to-r from-blue_border to-blue text-white text-xl px-2 py-1 mb-4'>Todo</h2>
          <SortableContext items={todo.map(item => item._id)}>
            {todo.length > 0 && (
              <>
                {todo?.map((data, index) => (
                  <React.Fragment key={data._id}>
                    <TaskCard data={data} listType="todo" />
                  </React.Fragment>
                ))}
                <DropArea index={todo.length} listType="todo" last={true} />
              </>
            )}
            {todo.length < 1 && (
              <>
                <div className='h-auto w-full flex items-center justify-center'>
                  <Lottie
                    options={defaultOptions}
                    height={150}
                    width={150}
                  />
                </div>
                <DropArea index={todo.length} listType="todo" last={true} />
              </>
            )}
          </SortableContext>
        </div>

        {/* Inprogress */}
        <div className='w-full lg:w-[32%] h-full p-2 border border-white-input-light shadow-md shadow-white-input-light rounded-md'>
          <h2 className='bg-gradient-to-r from-blue_border to-blue text-white text-xl px-2 py-1 mb-4'>In Progress</h2>
          <SortableContext items={progress.map(item => item._id)}>
            {progress.length > 0 && (
              <>
                {progress?.map((data, index) => (
                  <React.Fragment key={data._id}>
                    <TaskCard data={data} listType="progress" />
                  </React.Fragment>
                ))}
                <DropArea index={progress.length} listType="progress" last={true} />
              </>
            )}
            {progress.length < 1 && (
              <>
                <div className='h-auto w-full flex items-center justify-center'>
                  <Lottie
                    options={defaultOptions}
                    height={150}
                    width={150}
                  />
                </div>
                <DropArea index={progress.length} listType="progress" last={true} />
              </>
            )}
          </SortableContext>
        </div>

        {/* Completed */}
        <div className='w-full lg:w-[32%] h-full p-2 border border-white-input-light shadow-md shadow-white-input-light rounded-md'>
          <h2 className='bg-gradient-to-r from-blue_border to-blue text-white text-xl px-2 py-1 mb-4'>Completed</h2>
          <SortableContext items={completed.map(item => item._id)}>
            {completed.length > 0 && (
              <>
                {completed?.map((data, index) => (
                  <React.Fragment key={data._id}>
                    <TaskCard data={data} listType="completed" />
                  </React.Fragment>
                ))}
                <DropArea index={completed.length} listType="completed" last={true} />
              </>
            )}
            {completed.length < 1 && (
              <>
                <div className='h-auto w-full flex items-center justify-center'>
                  <Lottie
                    options={defaultOptions}
                    height={150}
                    width={150}
                  />
                </div>
                <DropArea index={completed.length} listType="completed" last={true} />
              </>
            )}
          </SortableContext>
        </div>
      </div>
    </section>
  );
}
