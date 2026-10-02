export const Tooltip = ({interactionData, width}) => {
  if (!interactionData) {
    return null;
  }

  const placement = interactionData.x < width/2 ? "right" : "left"; 

  return (
    <div
      className="tooltip"
      style={{
        position: "absolute", // DO NOT PUT IN THE CSS. It is ignored there, for some reason
        left: interactionData.x,
        top: interactionData.y,
        transform: 
          placement === "left" 
          ? "translate(calc(-100% - 200px),-50%)" 
          : "translate(200px,-50%)",
        textAlign: placement === "left" ? "end" : "start",
      }}
    >
      <h3 className="tooltip-title">{interactionData.name}</h3>
      <h4> {interactionData.country} </h4>
      <p> {interactionData.nRoutes + " routes"} </p>
    </div>
  );
};
