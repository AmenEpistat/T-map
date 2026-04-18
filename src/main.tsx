import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { env } from "@/shared/config/env";

async function enableMocks() {
  if (!env.USE_MOCKS) return;
  const { worker } = await import("@/shared/mocks");
  await worker.start({
    onUnhandledRequest: "bypass", // не ругайся на запросы, которые мы не мокаем
  });
}

enableMocks().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
