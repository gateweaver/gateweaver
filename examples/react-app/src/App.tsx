import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

interface GatewayResponse {
  authenticated: boolean;
  token: string;
}

function App() {
  const [gatewayResponse, setGatewayResponse] =
    useState<GatewayResponse | null>(null);

  const handleClick = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_GATEWAY_URL;

      const response = await fetch(`${BASE_URL}/example`);
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const data = await response.json();
      setGatewayResponse(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React App</h1>
      <div className="card">
        <p>
          Click the button below to call the gateway's /example endpoint, which
          sends the request to{" "}
          <a href="https://httpbin.org/#/Auth/get_bearer" target="_blank">
            https://httpbin.org/bearer
          </a>{" "}
          and adds an Authorization header with a bearer token.
        </p>
        <button onClick={handleClick}>Click me</button>

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
