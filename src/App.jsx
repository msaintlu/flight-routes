import { useEffect, useState } from 'react';
import { dataAirports } from "./airports";
import { dataRoutes } from "./routes";
import { NetworkDiagram } from './vizcomponents/NetworkDiagram';

const MAX_AIRPORTS = 10; // <-- filtre temporaire, à supprimer plus tard

const MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Remove routes duplicates
    const uniqueRoutes = new Map(); // Map = Object
    dataRoutes.forEach((route) => {
      if (
        route.source &&
        route.source !== "\\N" &&
        route.target &&
        route.target !== "\\N"
      ) {
        const key = `${route.source}-${route.target}`;

        if (!uniqueRoutes.has(key)) {
          uniqueRoutes.set(key, {
            source: route.source,
            target: route.target,
          });
        }
      }
    });

    // Transforms the object into a routes table
    const links = Array.from(uniqueRoutes.values());

    // Counts unique routes per source airport
    const routeCount = {};
    links.forEach((route) => {
      routeCount[route.source] = (routeCount[route.source] || 0) + 1;
    });

    // Select most connected airports
    const selectedAirports = dataAirports
      .filter(
        (airport) =>
          airport.IATA && airport.IATA !== "\\N" && routeCount[airport.IATA]
      )
      .sort((a, b) => routeCount[b.IATA] - routeCount[a.IATA])
      .slice(0, MAX_AIRPORTS);
    const selectedAirportIds = new Set(
      selectedAirports.map((airport) => airport.IATA)
    );

    // Create nodes
    const nodes = selectedAirports.map((airport) => ({
      id: airport.IATA,
      name: airport.name,
      country: airport.country,
      latitude: airport.latitude,
      longitude: airport.longitude,
      nRoutes: routeCount[airport.IATA],
    }));

    // Filter links on selected airports
    const filteredLinks = links.filter(
      (route) =>
        selectedAirportIds.has(route.source) &&
        selectedAirportIds.has(route.target)
    );

    // Store final data
    setData({
      nodes,
      links: filteredLinks,
    });
  }, []);

  if (!data) return <div style={{ marginLeft: 50 }}> Loading... </div>;
  //console.log(data);
  //console.log(data.nodes);

  return (
    <div className="main-container">
      <div style={{ marginTop: -10, marginBottom: 20 }}>
        <p style={{ fontWeight: "bolder", fontStyle: "italic", fontSize: 32 }}>
          Flight routes
        </p>
      </div>

      <div className="line" />

      <NetworkDiagram width={400} height={400} data={data} />
    </div>
  );
}

export default App
