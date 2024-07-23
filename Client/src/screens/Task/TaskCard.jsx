import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserTask, fetchAllUsersTasks } from '../../globalState/taskSlice';
import toast from 'react-hot-toast';
import { IoMdMove } from "react-icons/io";

const TaskCard = ({ data, listType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {token } = useSelector((state) => state.auth);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: data._id,
    data: { fromList: listType, targetId: data._id },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    pointerEvents: isDragging ? 'none' : 'auto',
  };

  const taskDeleteFunction = async (e) => {
    e.stopPropagation();
    try {
      const result = await dispatch(deleteUserTask({token, id: data._id}));
      if (result.payload) {
        toast.success("Task Deleted Successfully");
      } else {
        toast.error(result.error.message);
      }
      dispatch(fetchAllUsersTasks({token, sort: "default", search: ""}));
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  const singleTaskDetails = (e) => {
    e.stopPropagation();
    navigate(`/single-task/${data._id}`);
  };

  const editTaskDetails = (e) => {
    e.stopPropagation();
    navigate(`/edit-task/${data._id}`);
  };

  return (
    <>
      <section
        className="w-full h-40 rounded-md bg-card my-2"
      >
        <div className="w-full h-auto">
          <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
          >
            <div className="h-28 p-2">
              <div className="w-full flex items-start -translate-y-2 translate-x-2 justify-end">
                <span className='w-fit h-fit rounded-full p-0.5 overflow-hidden text-[0.6rem] bg-white text-red'><IoMdMove/></span>
              </div>
              <p className="w-full h-auto font-bold overflow-hidden line-clamp-1 break-all">{data?.title}</p>
              <p className="h-auto text-sm line-clamp-2 break-all overflow-hidden">{data?.description}</p>
            </div>
            <p className="text-[0.65rem] text-gray-dark h-4 px-2">Created At: {new Date(data?.createdAt).toLocaleString()}</p>
          </div>
          <div className="w-full h-8 flex items-center justify-end py-2">
            <button
              className="text-xs bg-red hover:bg-red-hover text-white px-2 py-0.5 rounded-md mx-1"
              onClick={taskDeleteFunction}
              onTouchStart={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              Delete
            </button>
            <button
              className="text-xs bg-blue hover:bg-blue-hover text-white px-2 py-0.5 rounded-md mx-1"
              onClick={editTaskDetails}
              onTouchStart={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              Edit
            </button>
            <button
              className="text-xs bg-blue_border hover:bg-blue_border-hover text-white px-2 py-0.5 rounded-md mx-1"
              onClick={singleTaskDetails}
              onTouchStart={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              View Details
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default TaskCard;
