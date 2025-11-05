
import React, { useState, useCallback, useRef, MouseEvent } from 'react';
import { Node, Option, DraggingNode } from './types';
import NodeCard from './components/NodeCard';
import Toolbar from './components/Toolbar';
import Edge from './components/Edge';
import PresentationView from './components/PresentationView';

const NODE_WIDTH = 256; // 16rem
const NODE_HEIGHT_BASE = 250; // Aprox height
const NODE_SPAWN_OFFSET = 300;

const App: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'node-1',
      x: 100,
      y: 100,
      text: 'İlk sorunuz nedir?',
      options: [],
    },
  ]);
  const [draggingNode, setDraggingNode] = useState<DraggingNode | null>(null);
  const flowCanvasRef = useRef<HTMLDivElement>(null);

  const [isPresenting, setIsPresenting] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: generateId(),
      x: 50,
      y: 50,
      text: 'Yeni Soru',
      options: [],
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  }, []);

  const deleteNode = useCallback((nodeIdToDelete: string) => {
    setNodes(prevNodes => {
      const nodesToKeep = new Set<string>();
      const initialNode = prevNodes.find(n => n.id === nodeIdToDelete);
      if (!initialNode) return prevNodes;

      if (prevNodes.length === 1 && initialNode.id === prevNodes[0].id) {
          alert("Kalan son düğüm silinemez.");
          return prevNodes;
      }

      prevNodes.forEach(n => nodesToKeep.add(n.id));
      
      const queue = [nodeIdToDelete];
      const visited = new Set<string>();

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (visited.has(currentId)) continue;
        visited.add(currentId);

        nodesToKeep.delete(currentId);
        
        const node = prevNodes.find(n => n.id === currentId);
        node?.options.forEach(opt => {
          if (opt.targetNodeId && !visited.has(opt.targetNodeId)) {
            queue.push(opt.targetNodeId);
          }
        });
      }

      return prevNodes
        .filter(n => nodesToKeep.has(n.id))
        .map(n => ({
          ...n,
          options: n.options.filter(opt => opt.targetNodeId && nodesToKeep.has(opt.targetNodeId)),
        }));
    });
  }, []);


  const updateNodeText = useCallback((nodeId: string, text: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, text } : node
      )
    );
  }, []);

  const addOption = useCallback((nodeId: string) => {
    setNodes((prevNodes) => {
      const sourceNode = prevNodes.find((n) => n.id === nodeId);
      if (!sourceNode) return prevNodes;

      const newEffectNode: Node = {
        id: generateId(),
        x: sourceNode.x + NODE_SPAWN_OFFSET,
        y: sourceNode.y + sourceNode.options.length * 60,
        text: 'Yeni Cevap/Durum',
        options: [],
      };

      const newOption: Option = {
        id: generateId(),
        text: `Seçenek ${sourceNode.options.length + 1}`,
        targetNodeId: newEffectNode.id,
      };

      const updatedNodes = prevNodes.map((node) =>
        node.id === nodeId
          ? { ...node, options: [...node.options, newOption] }
          : node
      );

      return [...updatedNodes, newEffectNode];
    });
  }, []);

  const updateOptionText = useCallback((nodeId: string, optionId: string, text: string) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              options: node.options.map((opt) =>
                opt.id === optionId ? { ...opt, text } : opt
              ),
            };
          }
          return node;
        })
      );
    }, []);

  const deleteOption = useCallback((nodeId: string, optionId: string) => {
    let targetNodeIdToDelete: string | null = null;

    setNodes(prevNodes => {
      const nextNodes = [...prevNodes];
      const sourceNode = nextNodes.find(n => n.id === nodeId);
      if(sourceNode) {
          const option = sourceNode.options.find(o => o.id === optionId);
          if(option) targetNodeIdToDelete = option.targetNodeId;
          sourceNode.options = sourceNode.options.filter(o => o.id !== optionId);
      }
      return nextNodes;
    });

    if(targetNodeIdToDelete) {
        deleteNode(targetNodeIdToDelete);
    }

  }, [deleteNode]);

  const handleMouseDown = useCallback((e: MouseEvent, nodeId: string) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !flowCanvasRef.current) return;

    const canvasRect = flowCanvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - canvasRect.left - node.x;
    const offsetY = e.clientY - canvasRect.top - node.y;

    setDraggingNode({ id: nodeId, offsetX, offsetY });
  }, [nodes]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingNode || !flowCanvasRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const node = nodes.find((n) => n.id === draggingNode.id);
    if (!node) return;

    const canvasRect = flowCanvasRef.current.getBoundingClientRect();
    let newX = e.clientX - canvasRect.left - draggingNode.offsetX;
    let newY = e.clientY - canvasRect.top - draggingNode.offsetY;

    const nodeHeight = NODE_HEIGHT_BASE + node.options.length * 44;

    newX = Math.max(0, Math.min(newX, canvasRect.width - NODE_WIDTH));
    newY = Math.max(0, Math.min(newY, canvasRect.height - nodeHeight));

    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === draggingNode.id ? { ...n, x: newX, y: newY } : n
      )
    );
  }, [draggingNode, nodes]);

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
  }, []);

  const handleRun = () => {
    if (nodes.length > 0) {
      setActiveNodeId(nodes[0].id);
      setIsPresenting(true);
    } else {
      alert("Çalıştırmak için önce en az bir soru ekleyin.");
    }
  };

  const handleExitPresentation = () => {
    setIsPresenting(false);
    setActiveNodeId(null);
  };

  const handleSelectOption = (targetNodeId: string) => {
    const targetNode = nodes.find(n => n.id === targetNodeId);
    if (targetNode) {
        setActiveNodeId(targetNodeId);
    } else {
        alert("Bu dalın sonuna ulaştınız.");
        handleExitPresentation();
    }
  };


  return (
    <div className="w-screen h-screen overflow-hidden font-sans relative bg-gray-50">
      {isPresenting ? (
        <PresentationView 
          nodes={nodes}
          activeNodeId={activeNodeId}
          onSelectOption={handleSelectOption}
          onExit={handleExitPresentation}
        />
      ) : (
        <>
          <div className="absolute top-0 left-0 p-4 z-30 bg-white/80 backdrop-blur-sm rounded-br-xl">
            <h1 className="text-xl font-bold text-gray-800">Soru-Cevap Akış Tasarımı</h1>
            <p className="text-sm text-gray-500">Etkileşimli iletişim akışları oluşturun.</p>
          </div>
          <Toolbar onAddNode={addNode} onRun={handleRun} />
          <div
            ref={flowCanvasRef}
            className="w-full h-full relative overflow-auto bg-dots"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" style={{ minWidth: '200vw', minHeight: '200vh' }}>
              {nodes.map((sourceNode) =>
                sourceNode.options.map((option, index) => {
                  const targetNode = nodes.find(n => n.id === option.targetNodeId);
                  if (!targetNode) return null;
                  
                  const sourceY = sourceNode.y + 215 + (index * 46);
                  const sourceX = sourceNode.x + NODE_WIDTH;
                  const targetY = targetNode.y + 21; // Middle of header
                  const targetX = targetNode.x;

                  return (
                    <Edge
                      key={option.id}
                      sourceX={sourceX}
                      sourceY={sourceY}
                      targetX={targetX}
                      targetY={targetY}
                    />
                  );
                })
              )}
            </svg>

            {nodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                onMouseDown={handleMouseDown}
                onUpdateNodeText={updateNodeText}
                onAddOption={addOption}
                onUpdateOptionText={updateOptionText}
                onDeleteNode={deleteNode}
                onDeleteOption={deleteOption}
              />
            ))}
          </div>
        </>
      )}
       <style>{`
          .bg-dots {
            background-color: #f9fafb;
            background-image: radial-gradient(#d1d5db 1px, transparent 1px);
            background-size: 20px 20px;
          }
           @keyframes fade-in-down {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.5s ease-out forwards;
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
          }
      `}</style>
    </div>
  );
};

export default App;
