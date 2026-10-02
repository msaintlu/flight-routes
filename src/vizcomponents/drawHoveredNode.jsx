export function drawHoveredNode(ctx, hoveredNode, links, sizeScale, options) {
  const {colorNode} = options;

  // Get routes departing from hovered node
  const hoveredLinks = links.filter(
    (link) => link.source.id === hoveredNode.id
  );

  // draw hovered links
  ctx.globalAlpha = 1;
  ctx.strokeStyle = colorNode;
  hoveredLinks.forEach((link) => {
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.stroke();
  });

  // draw hovered nodes
  ctx.globalAlpha = 1;
  ctx.fillStyle = colorNode;
  ctx.beginPath();
  ctx.arc(
    hoveredNode.x,
    hoveredNode.y,
    sizeScale(hoveredNode.nRoutes),
    0,
    2 * Math.PI
  );
  ctx.fill();
}
