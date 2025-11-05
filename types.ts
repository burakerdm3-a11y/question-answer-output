
export interface Option {
  id: string;
  text: string;
  targetNodeId: string;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  text: string;
  options: Option[];
}

export interface DraggingNode {
  id: string;
  offsetX: number;
  offsetY: number;
}
