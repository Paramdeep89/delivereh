import { useState } from "react";
import { getContracts } from "../contracts";

export default function CargoHistory({ provider }) {
  const [cargoId, setCargoId] = useState("");
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");

  const fetchHistory = async () => {
    try {
      if (!cargoId) {
        setStatus("❌ Please enter a Cargo ID.");
        setHistory([]);
        return;
      }

      const { secureChain } = getContracts(provider);
      const events = await secureChain.getCargoHistory(cargoId);
      setHistory(events);
      setStatus(`✅ Fetched ${events.length} event(s).`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Could not fetch cargo history. Check the ID.");
      setHistory([]);
    }
  };

  return (
    <section>
      <div>
        <h2>📜 View Cargo History</h2>
        <input
          type="text"
          placeholder="Enter Cargo ID"
          value={cargoId}
          onChange={(e) => setCargoId(e.target.value)}
        />
        <button onClick={fetchHistory}>Fetch History</button>
        <p
          className={
            status.includes("✅")
              ? "status-success"
              : status.includes("❌")
              ? "status-error"
              : "status-warning"
          }
        >
          {status}
        </p>

        {history.length > 0 && (
          <ul>
            {history.map((event, idx) => (
              <li key={idx}>
                <strong>{event.description}</strong> – by{" "}
                <code>{event.recordedBy}</code> at{" "}
                {new Date(Number(event.timestamp) * 1000).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
