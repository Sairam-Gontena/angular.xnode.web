import { SimulationNodeDatum } from "d3";

export interface GraphNode extends SimulationNodeDatum {
    id: string;
    label: string;
    type: string;    
  }
