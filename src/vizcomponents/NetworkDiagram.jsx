import * as d3 from "d3";
import { quadtree } from "d3";
import { useEffect, useRef, useState, useMemo } from 'react';
import { drawNetwork } from "./drawNetwork";
import { drawHoveredNode } from "./drawHoveredNode";

//const RADIUS = 2;
const BUBBLE_MIN_SIZE = 1;
const BUBBLE_MAX_SIZE = 10;
const COLOR_NODE = "#467599";
const COLOR_LINK = "#BBD5ED";//"#D2D6EF";//

// Throttling function; Run fn at most once every 'wait' ms.
function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

export const NetworkDiagram = ({width, height, data}) => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [interactionData, setInteractionData] = useState(null);
  const quadtreeRef = useRef(null); // don't want to trigger a re render when quadtree is updated

  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3
  const links = useMemo(() => data.links.map((d) => ({ ...d })), [data.links]); // useMemo important because of the hovering. React reredenders on every hover, so without useMemo it recomputes nodes and links so they won't have .x and .y anymore
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
    const simulation = d3
      .forceSimulation(nodes) // apply the simulation to our array of nodes
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
        drawNetwork(ctx, width, height, nodes, links, sizeScale, {colorNode: COLOR_NODE, colorLink: COLOR_LINK});
      });

    return () => {
      simulation.stop();
    };
  }, [width, height, data]);

  // Layer 2: only the hovered node and links sourcing from the hovered node.

  // Build the quadtree (to detect closest hovered point) every 50 ms when the simulation is running
  useEffect(() => {
    const interval = setInterval(() => {
      quadtreeRef.current = d3.quadtree(
        nodes,
        (d) => d.x,
        (d) => d.y
      );
    }, 50);

    return () => clearInterval(interval);
  }, [nodes]);

  // layer 2
  useEffect(() => {
    const ctx = overlayRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    if (!interactionData) return;

    drawHoveredNode(ctx, interactionData, links, sizeScale, { colorNode: COLOR_NODE });
  }, [data, interactionData, width, height, sizeScale, COLOR_NODE]);

  // Mouse move handler

  // One listener on the canvas, then we find the circle ourselves.
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const found = quadtreeRef.current?.find(mx, my, 30);
    setInteractionData(found ?? null);
  };

  // Build the throttled function
  const throttledHandleMove = useMemo(() => throttle(handleMove, 100), [
    quadtreeRef,
  ]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
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