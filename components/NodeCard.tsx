import React from 'react';
import { Node } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface NodeCardProps {
  node: Node;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onUpdateNodeText: (nodeId: string, text: string) => void;
  onAddOption: (nodeId: string) => void;
  onUpdateOptionText: (nodeId: string, optionId: string, text: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteOption: (nodeId: string, optionId: string) => void;
}

const NodeCard: React.FC<NodeCardProps> = ({
  node,
  onMouseDown,
  onUpdateNodeText,
  onAddOption,
  onUpdateOptionText,
  onDeleteNode,
  onDeleteOption,
}) => {
  return (
    <div
      className="absolute bg-white rounded-lg shadow-xl border border-gray-200 w-64 cursor-grab active:cursor-grabbing z-10 select-none flex flex-col"
      style={{ top: node.y, left: node.x }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      <div className="bg-gray-100 rounded-t-lg px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-700">Soru</p>
        <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(node.id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Bu soruyu ve dallarını sil"
        >
            <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 flex-grow">
        <textarea
            value={node.text}
            onChange={(e) => onUpdateNodeText(node.id, e.target.value)}
            placeholder="Sorunuzu buraya yazın..."
            className="w-full p-2 border rounded-md resize-none text-gray-800 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            rows={4}
        />
      </div>

      <div className="px-4 pb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Cevaplar</h4>
        <div className="space-y-2">
          {node.options.map((option) => (
            <div key={option.id} className="group flex items-center gap-2">
                <input
                    type="text"
                    value={option.text}
                    onChange={(e) => onUpdateOptionText(node.id, option.id, e.target.value)}
                    placeholder="Cevap metni..."
                    className="flex-grow w-full p-2 border rounded-md text-sm text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteOption(node.id, option.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Cevabı sil"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddOption(node.id);
          }}
          className="mt-3 w-full flex items-center justify-center gap-2 p-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border-2 border-dashed border-gray-300 hover:border-indigo-400"
        >
          <PlusIcon className="w-4 h-4" /> Cevap Ekle
        </button>
      </div>
    </div>
  );
};

export default NodeCard;
