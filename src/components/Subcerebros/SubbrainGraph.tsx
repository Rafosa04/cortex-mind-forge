import React, { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import \* as d3 from "d3";
import { motion } from "framer-motion";

interface GraphNode {
id: string;
label: string;
type: "athena" | "subcerebro" | "projeto" | "habito" | "favorito" | "pensamento";
x?: number;
y?: number;
fx?: number;
fy?: number;
}

interface GraphLink {
source: string | GraphNode;
target: string | GraphNode;
}

interface GraphData {
nodes: GraphNode\[];
links: GraphLink\[];
}

export default function SubbrainGraph() {
const graphRef = useRef\<ForceGraphMethods\<any, any>>(null);
const \[dimensions, setDimensions] = useState({ width: 800, height: 600 });
const \[graphData, setGraphData] = useState<GraphData>({ nodes: \[], links: \[] });

useEffect(() => {
const handleResize = () => {
setDimensions({
width: window\.innerWidth,
height: window\.innerHeight \* 0.85,
});
};
window\.addEventListener("resize", handleResize);
handleResize();
return () => window\.removeEventListener("resize", handleResize);
}, \[]);

useEffect(() => {
const nodes: GraphNode\[] = \[
{ id: "athena", label: "Athena IA", type: "athena" },
{ id: "sub1", label: "Subcérebro 1", type: "subcerebro" },
{ id: "proj1", label: "Projeto Alpha", type: "projeto" },
{ id: "hab1", label: "Meditação", type: "habito" },
{ id: "fav1", label: "Podcast X", type: "favorito" },
{ id: "pens1", label: "Insight X", type: "pensamento" },
];
const links: GraphLink\[] = \[
{ source: "athena", target: "sub1" },
{ source: "sub1", target: "proj1" },
{ source: "sub1", target: "hab1" },
{ source: "proj1", target: "fav1" },
{ source: "hab1", target: "pens1" },
];
setGraphData({ nodes, links });
}, \[]);

const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D) => {
const radius = node.type === "athena" ? 12 : 8;
const colors: Record\<string, string> = {
athena: "#9f7aea",
subcerebro: "#ed64a6",
projeto: "#63b3ed",
habito: "#68d391",
favorito: "#f6e05e",
pensamento: "#cbd5e0",
};
ctx.beginPath();
ctx.arc(node.x || 0, node.y || 0, radius, 0, 2 \* Math.PI, false);
ctx.fillStyle = colors\[node.type];
ctx.shadowBlur = 10;
ctx.shadowColor = colors\[node.type];
ctx.fill();
ctx.shadowBlur = 0;

```
if (node.label) {
  ctx.font = "10px Inter";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#fff";
  ctx.fillText(node.label, node.x || 0, (node.y || 0) + radius + 2);
}
```

}, \[]);

return ( <div className="w-full h-full bg-[#0c0c1c]">
\<ForceGraph2D
ref={graphRef}
graphData={graphData}
width={dimensions.width}
height={dimensions.height}
nodeCanvasObject={nodeCanvasObject}
backgroundColor="#0c0c1c"
linkColor={() => "rgba(255,255,255,0.2)"}
d3VelocityDecay={0.3}
nodeRelSize={6}
enablePointerInteraction={true}
onEngineStop={() => {
if (graphRef.current) {
graphRef.current.zoomToFit(400, 50);
}
}}
/> </div>
);
}
