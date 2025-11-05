
import React from 'react';
import { PlusIcon, PlayIcon } from './icons';

interface ToolbarProps {
  onAddNode: () => void;
  onRun: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddNode, onRun }) => {
  return (
    <div className="absolute top-4 left-4 z-20 bg-white p-2 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center gap-2">
      <div className="flex flex-col items-center">
        <button
          onClick={onAddNode}
          className="flex items-center justify-center p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          title="Yeni Soru Ekle"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
         <div className="text-center text-xs text-gray-500 mt-1">Soru Ekle</div>
      </div>
       <div className="w-full border-t border-gray-200 my-1"></div>
      <div className="flex flex-col items-center">
         <button
            onClick={onRun}
            className="flex items-center justify-center p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            title="Akışı Çalıştır"
          >
            <PlayIcon className="h-5 w-5" />
        </button>
        <div className="text-center text-xs text-gray-500 mt-1">Çalıştır</div>
      </div>
    </div>
  );
};

export default Toolbar;
