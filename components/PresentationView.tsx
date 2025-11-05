
import React from 'react';
import { Node } from '../types';
import { CloseIcon } from './icons';

interface PresentationViewProps {
  nodes: Node[];
  activeNodeId: string | null;
  onSelectOption: (targetNodeId: string) => void;
  onExit: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ nodes, activeNodeId, onSelectOption, onExit }) => {
  if (!activeNodeId) return null;

  const activeNode = nodes.find(node => node.id === activeNodeId);

  if (!activeNode) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Akış Sonu</h1>
        <p className="text-gray-400 mb-8">Bu daldaki sorular bitti veya bir hata oluştu.</p>
        <button 
          onClick={onExit}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Düzenlemeye Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 sm:p-8 text-white transition-opacity duration-300">
      <button 
        onClick={onExit} 
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-white transition-colors"
        title="Sunumdan Çık"
      >
        <CloseIcon className="w-7 h-7 sm:w-8 sm:h-8" />
      </button>

      <div className="text-center max-w-4xl w-full">
        <div className="animate-fade-in-down">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 sm:mb-16 break-words">{activeNode.text}</h1>
        </div>
        <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
          {activeNode.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.targetNodeId)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg text-lg sm:text-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 animate-fade-in-up"
              style={{ animationDelay: `${index * 100 + 300}ms`, opacity: 0 }}
            >
              {option.text}
            </button>
          ))}
          {activeNode.options.length === 0 && (
              <div className="text-gray-400 mt-8 animate-fade-in-up" style={{ animationDelay: '300ms', opacity: 0 }}>
                  <p className="mb-4">Bu akışın sonuna geldiniz.</p>
                  <button onClick={onExit} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg transition-colors">
                      Akışı Bitir
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationView;
