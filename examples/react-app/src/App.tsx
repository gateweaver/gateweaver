import { useState } from "react";
import "./App.css";

interface GatewayResponse {
  authenticated: boolean;
  token: string;
}

function App() {
  const [gatewayResponse, setGatewayResponse] =
    useState<GatewayResponse | null>(null);

  const handleClick = async () => {
    if (gatewayResponse) {
      setGatewayResponse(null);
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_GATEWAY_URL;

      const response = await fetch(`${BASE_URL}/example`);

      if (!response.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const data = await response.json();

      setGatewayResponse(data);
    } catch (error) {
      console.error(error);
    }
  };

  const buttonText = gatewayResponse ? "Clear" : "Fetch data";

  return (
    <>
      <h1>React App</h1>
      <div className="card">
        <button onClick={handleClick}>{buttonText}</button>

        {gatewayResponse && (
          <>
            <h4>Response from Gateway:</h4>
            <pre>{JSON.stringify(gatewayResponse, null, 2)}</pre>
          </>
        )}
      </div>
    </>
  );
}

export default App;
