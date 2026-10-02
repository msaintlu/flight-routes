export function drawNetwork(ctx, width, height, nodes, links, sizeScale, options) {
  const {colorNode, colorLink, transform} = options;

  ctx.clearRect(0, 0, width, height);

  // Draw the links first
  ctx.globalAlpha = 0.3;

  links.forEach((link) => {
    // Zoom handling
    ctx.beginPath();
    ctx.moveTo(
      transform.applyX(link.source.x), 
      transform.applyY(link.source.y)
    );
    ctx.lineTo(
      transform.applyX(link.target.x), 
      transform.applyY(link.target.y)
    );
    ctx.strokeStyle = "#BBD5ED";
    ctx.stroke();
  });

  // Draw the nodes
  ctx.globalAlpha = 1;

  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    // Zoom handling
    const x = transform.applyX(node.x);
    const y = transform.applyY(node.y);

    ctx.beginPath();
    ctx.arc(x, y, sizeScale(node.nRoutes), 0, 2 * Math.PI);

    ctx.fillStyle = colorNode;
    ctx.fill();

    ctx.strokeStyle = colorLink;
    //ctx.stroke();
  });
}
