import * as d3 from "d3";
import { useEffect, useRef, useState, useMemo } from 'react';
import { drawNetwork } from "./drawNetwork";

const RADIUS = 2;
const BUBBLE_MIN_SIZE = 1;
const BUBBLE_MAX_SIZE = 10;
const COLOR_NODE = "#467599";

export const NetworkDiagram = ({width, height, data}) => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [interactionData, setInteractionData] = useState(null);

  const drawNode = (ctx, node, sizeScale, COLOR_NODE) => {
    ctx.fillStyle = COLOR_NODE;
    ctx.beginPath();
    ctx.arc(node.x, node.y, sizeScale(node.nRoutes), 0, 2 * Math.PI);
    ctx.fill();
  };

  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3
  const links = useMemo(() => data.links.map((d) => ({ ...d })), [data.links]);
  const nodes = useMemo(() => data.nodes.map((d) => ({ ...d })), [data.nodes]);


  const sizeScale = useMemo(() => {
    const [min, max] = d3.extent(nodes, (node) => node.nRoutes);

    return d3
      .scaleSqrt()
      .domain([min, max])
      .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE]);
  }, [nodes]);

  // Layer 1: simulation and network drawing, run once
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) {
      return;
    }

    // d3-force to find the position of nodes on the canvas
    const simulation = d3.forceSimulation(nodes) // apply the simulation to our array of nodes
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      ) // Force #1: links between nodes
      .force("collide", d3.forceCollide().radius(BUBBLE_MAX_SIZE).strength(0.2)) // Force #2: avoid node overlaps
      .force("charge", d3.forceManyBody().strength(-4)) // Force #3: attraction or repulsion between nodes
      .force("center", d3.forceCenter(width / 2, height / 2)) // Force #4: nodes are attracted by the center of the chart area
      // at each iteration of the simulation, draw the network diagram with the new node positions
      .force("x", d3.forceX(width / 2).strength(0.03))
      .force("y", d3.forceY(height / 2).strength(0.06))
      .on("tick", () => {
        drawNetwork(ctx, width, height, nodes, links, sizeScale);
      });

    return () => {
      simulation.stop();
    };
  }, [width, height, data]);

  // Layer 2: only the hovered row + column, redrawn on hover.
  useEffect(() => {
    const ctx = overlayRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    if (!interactionData) return;

    drawNode(ctx, interactionData, sizeScale, COLOR_NODE);
  }, [data, interactionData, width, height, sizeScale, COLOR_NODE]);

  // One listener on the canvas, then we find the circle ourselves.
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const found = nodes.find(
      (node) => Math.hypot(node.x - mx, node.y - my) <= sizeScale(node.nRoutes)
    );
    setInteractionData(found ?? null);
  };

  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          opacity: interactionData ? 0.35 : 1,
          transition: "opacity 0.05s",
        }}
      />
      <canvas
        ref={overlayRef}
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
        }}
        onMouseMove={handleMove}
        onMouseLeave={() => setInteractionData(null)}
      />
    </div>
  );
};