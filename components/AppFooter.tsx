import { classNames } from "../utils";

interface AppFooterProps {
  isConnected: boolean;
}

export function AppFooter({ isConnected }: AppFooterProps) {
  return (
    <footer className="max-w-7xl mx-auto px-4 pb-8 text-xs text-slate-500">
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span
          className={classNames(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full border",
            isConnected ? "border-green-300 text-green-700" : "border-slate-300"
          )}
        >
          {isConnected ? "Printer connected" : "Printer not connected"}
        </span>
        <span>•</span>
        <span>Web Serial ready in Chromium-based browsers.</span>
      </div>
    </footer>
  );
}
