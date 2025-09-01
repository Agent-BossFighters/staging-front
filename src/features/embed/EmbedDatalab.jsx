import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DatalabTabs from "../dashboard/datalab/datalab-tabs";

export default function EmbedDatalab() {
  const [sp] = useSearchParams();
  const defaultTab = sp.get("tab") || "Slot";
  const rootRef = useRef(null);

  // Auto-height: envoie la hauteur au parent
  useEffect(() => {
    const sendHeight = () => {
      const h = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "EMBED_HEIGHT", id: "datalab", height: h }, "*");
    };
    sendHeight();
    const ro = new ResizeObserver(sendHeight);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen w-full bg-transparent">
      <DatalabTabs defaultTab={defaultTab} />
    </div>
  );
}
