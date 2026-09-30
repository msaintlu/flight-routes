export const RADIUS = 10;

export const drawNetwork = ({ctx, width, height, nodes, links}) => {
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
    ctx.fillStyle = '#cb1dd1';
    ctx.fill();
  });
};