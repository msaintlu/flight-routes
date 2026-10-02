export const Tooltip = ({interactionData, width, transform}) => {
  if (!interactionData) {
    return null;
  }

  const x = transform.applyX(interactionData.x);
  const y = transform.applyY(interactionData.y);

  const placement = x < width/2 ? "right" : "left"; 

  return (
    <div
      className="tooltip"
      style={{
        position: "absolute", // DO NOT PUT IN THE CSS. It is ignored there, for some reason
        top: y,
        left: placement === "left" ? "auto" : x + 200,
        right: placement === "left" ? width - x + 200 : "auto",
        transform: "translateY(-50%)",
        textAlign: placement === "left" ? "end" : "start",
      }}
    >
      <h3 className="tooltip-title">{interactionData.name}</h3>
      <h4> {interactionData.country} </h4>
      <p> {interactionData.nRoutes + " routes"} </p>
    </div>
  );
};
