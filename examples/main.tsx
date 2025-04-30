import React from "react";
import ReactDOM from "react-dom/client";
import BasicExample from "./basic-usage";
import FrameExample from "./frame-usage";
import CombinedExample from "./combined-usage";
import { WagmiWrapper } from "../src/react/WagmiProvider";
import "./index.css";

const App = () => (
  <WagmiWrapper>
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
    </div>
  </WagmiWrapper>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
