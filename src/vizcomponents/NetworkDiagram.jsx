import * as d3 from "d3";
import { useEffect, useRef, useMemo } from 'react';

export const RADIUS = 2;
const BUBBLE_MIN_SIZE = 1;
const BUBBLE_MAX_SIZE = 10;

export const NetworkDiagram = ({width, height, data}) => {
  const canvasRef = useRef(null);

  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3
  const links = data.links.map((d) => ({ ...d }));
  const nodes = data.nodes.map((d) => ({ ...d }));

  const [min, max] = d3.extent(nodes.map((node) => node.nRoutes));
  //console.log(min, max)
  const sizeScale = d3.scaleSqrt()
    .domain([min, max])
    .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE]);

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
      .force(
        "collide",
        d3
          .forceCollide()
          .radius(BUBBLE_MAX_SIZE)
          .strength(0.2)
      ) // Force #2: avoid node overlaps
      .force("charge", d3.forceManyBody().strength(-4)) // Force #3: attraction or repulsion between nodes
      .force("center", d3.forceCenter(width / 2, height / 2)) // Force #4: nodes are attracted by the center of the chart area
      // at each iteration of the simulation, draw the network diagram with the new node positions
      .force("x", d3.forceX(width / 2).strength(0.02))
      .force("y", d3.forceY(height / 2).strength(0.06))
      .on("tick", () => {
        //  drawNetwork(ctx, width, height, nodes, links);
        //});
        ctx.clearRect(0, 0, width, height);

        // Draw the links first
        ctx.globalAlpha = 0.1;
        links.forEach((link) => {
          ctx.beginPath();
          ctx.moveTo(link.source.x, link.source.y);
          ctx.lineTo(link.target.x, link.target.y);
          ctx.strokeStyle = "grey";
          ctx.stroke();
        });

        // Draw the nodes
        ctx.globalAlpha = 1;
        nodes.forEach((node) => {
          if (!node.x || !node.y) {
            return;
          }

          ctx.beginPath();
          ctx.moveTo(
            node.x + sizeScale(node.nRoutes),
            node.y + sizeScale(node.nRoutes)
          );
          ctx.arc(node.x, node.y, sizeScale(node.nRoutes), 0, 2 * Math.PI);
          ctx.fillStyle = "orchid";
          ctx.fill();
          ctx.strokeStyle = "#cb1dd1";
          ctx.stroke();

        });
      });

  }, [width, height, data]);

  //console.log(nodes)


  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};