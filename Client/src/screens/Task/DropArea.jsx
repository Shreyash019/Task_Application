import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DropArea = ({ index, setDragged, listType, last = false }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `${listType}-${index}`,
    data: { toList: listType, index },
  });

  const handleDrop = (e) => {
    e.preventDefault();
    setDragged({ toList: listType, index });
  };

  return (
    <section
      ref={setNodeRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={isOver ? `w-auto ${last ? `h-16` : `h-12`} border border-gray-light rounded-lg flex items-center justify-center text-sm text-gray-light opacity-25` : `w-auto ${last ? `h-20` : `h-6`} opacity-0 z-10`}
      style={{ pointerEvents: 'none' }}
    >
      DropArea
    </section>
  );
};

export default DropArea;
