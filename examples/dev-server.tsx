import React from "react";
import ReactDOM from "react-dom/client";
import BasicExample from "./basic-usage";
import FrameExample from "./frame-usage";
import CombinedExample from "./combined-usage";

const App = () => (
  <div className="examples-container">
    <h1>Bankless Academy SDK Examples</h1>

    <section className="example-section">
      <h2>Basic Usage</h2>
      <BasicExample />
    </section>

    <section className="example-section">
      <h2>Frame Usage</h2>
      <FrameExample />
    </section>

    <section className="example-section">
      <h2>Combined Usage</h2>
      <CombinedExample />
    </section>

    <style>{`
      .examples-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      h1 {
        text-align: center;
        margin-bottom: 3rem;
        color: #2d3748;
      }
      .example-section {
        margin-bottom: 4rem;
        padding: 2rem;
        background: #f7fafc;
        border-radius: 0.5rem;
      }
      h2 {
        color: #4a5568;
        margin-bottom: 1.5rem;
      }
    `}</style>
  </div>
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
