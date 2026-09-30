import * as d3 from "d3";
import { useEffect, useRef } from 'react';

export const RADIUS = 10;

export const NetworkDiagram = ({width, height, data}) => {
  const canvasRef = useRef(null);

  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3
  const links = data.links.map((d) => ({ ...d }));
  const nodes = data.nodes.map((d) => ({ ...d }));

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) {
      return;
    }

    // d3-force to find the position of nodes on the canvas
    d3.forceSimulation(nodes) // apply the simulation to our array of nodes
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      ) // Force #1: links between nodes
      .force("collide", d3.forceCollide().radius(RADIUS)) // Force #2: avoid node overlaps
      .force("charge", d3.forceManyBody()) // Force #3: attraction or repulsion between nodes
      .force("center", d3.forceCenter(width / 2, height / 2)); // Force #4: nodes are attracted by the center of the chart area

    // at each iteration of the simulation, draw the network diagram with the new node positions
    //.on('tick', () => {
    //  drawNetwork(ctx, width, height, nodes, links);
    //});

    ctx.clearRect(0, 0, width, height);

    // Draw the links first
    links.forEach((link) => {
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.stroke();
    });

    // Draw the nodes
    nodes.forEach((node) => {
      if (!node.x || !node.y) {
        return;
      }

      ctx.beginPath();
      ctx.moveTo(node.x + RADIUS, node.y);
      ctx.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = "#cb1dd1";
      ctx.fill();
    });

  }, [width, height, data]);

  //console.log(nodes)


  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};