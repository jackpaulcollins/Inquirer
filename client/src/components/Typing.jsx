import React from 'react';

function Typing() {
  return (
    <div className="p-2 ml-2 rounded-lg bg-blue-200 self-start">
      <div className="mb-1 animate-pulse">Typing...</div>
      <div className="flex space-x-2 items-center">
        <div className="w-3 h-3 rounded-full bg-blue-600" />
        <div className="w-3 h-3 rounded-full bg-blue-600" />
        <div className="w-3 h-3 rounded-full bg-blue-600" />
      </div>
    </div>
  );
}

export default Typing;
