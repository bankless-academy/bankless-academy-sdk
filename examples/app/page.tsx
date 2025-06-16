import BasicUsage from "./components/BasicUsage";
import FrameUsage from "./components/FrameUsage";
import CombinedUsage from "./components/CombinedUsage";
import WalletConnect from "./components/WalletConnect";

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Bankless Academy SDK Examples</h1>
        <WalletConnect />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
        <BasicUsage />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Frame Usage</h2>
        <FrameUsage />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Combined Usage</h2>
        <CombinedUsage />
      </section>
    </main>
  );
}
