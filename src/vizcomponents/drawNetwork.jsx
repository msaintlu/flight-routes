export function drawNetwork(ctx, width, height, nodes, links, sizeScale, options) {
  const {colorNode, colorLink} = options;

  ctx.clearRect(0, 0, width, height);

  // Draw the links first
  ctx.globalAlpha = 0.3;

  links.forEach((link) => {
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.strokeStyle = "#BBD5ED";
    ctx.stroke();
  });

  // Draw the nodes
  ctx.globalAlpha = 1;

  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, sizeScale(node.nRoutes), 0, 2 * Math.PI);

    ctx.fillStyle = colorNode;
    ctx.fill();

    ctx.strokeStyle = colorLink;
    //ctx.stroke();
  });
}
