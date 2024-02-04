import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { GraphNode } from "./graph-node";
import { Link } from "./link";

export interface GraphData {
    nodes: GraphNode[];
    links: SimulationLinkDatum<GraphNode>[];
  }