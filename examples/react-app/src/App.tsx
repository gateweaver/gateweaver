import { useState } from "react";
import "./App.css";

interface ProxyResponse {
  authenticated: boolean;
  token: string;
}

function App() {
  const [proxyResponse, setProxyResponse] = useState<ProxyResponse | null>(
    null,
  );

  const handleClick = async () => {
    if (proxyResponse) {
      setProxyResponse(null);
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_PROXY_URL;

      const response = await fetch(`${BASE_URL}/example`);

      if (!response.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const data = await response.json();

      setProxyResponse(data);
    } catch (error) {
      console.error(error);
    }
  };

  const buttonText = proxyResponse ? "Clear" : "Fetch data";

  return (
    <>
      <h1>React App</h1>
      <div className="card">
        <button onClick={handleClick}>{buttonText}</button>

        {proxyResponse && (
          <>
            <h4>Response from Proxy:</h4>
            <pre>{JSON.stringify(proxyResponse, null, 2)}</pre>
          </>
        )}
      </div>
    </>
  );
}

export default App;
