import { useState } from "react";
import OpenAI from "openai";
import "./App.css";

const PROXY_URL = import.meta.env.VITE_PROXY_URL;

const openai = new OpenAI({
  baseURL: `${PROXY_URL}/openai`,
  apiKey: "",
  dangerouslyAllowBrowser: true,
});

const generateMessage = async (userInput: string): Promise<string | null> => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that is here to answer questions.",
      },
      {
        role: "user",
        content: userInput,
      },
    ],
  });

  return completion.choices[0].message.content;
};

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await generateMessage(userInput);
      if (!response) {
        throw new Error("Failed to generate message.");
      }

      setMessage(response);
      setUserInput("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Ask me a question</h1>
      <div className="content">
        {message ? (
          <>
            <p>{message}</p>
            <button className="reset-button" onClick={() => setMessage("")}>
              Ask another question
            </button>
          </>
        ) : (
          <form className="question-form" onSubmit={handleSubmit}>
            <input
              className="input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button className="submit-button" disabled={!userInput || loading}>
              {loading ? "Loading..." : "Ask"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default App;
