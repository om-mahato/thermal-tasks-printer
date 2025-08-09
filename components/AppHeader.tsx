// Fallback typings if your TS doesn't include Serial types
interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  readable?: ReadableStream<Uint8Array>;
  writable?: WritableStream<Uint8Array>;
  close(): Promise<void>;
}
interface Navigator {
  serial: {
    requestPort: () => Promise<SerialPort>;
    getPorts: () => Promise<SerialPort[]>;
  };
}

interface AppHeaderProps {
  baud: number;
  setBaud: (baud: number) => void;
  copies: number;
  setCopies: (copies: number) => void;
  port: SerialPort | null;
  connectPrinter: () => Promise<void>;
  disconnectPrinter: () => Promise<void>;
}

export function AppHeader({
  baud,
  setBaud,
  copies,
  setCopies,
  port,
  connectPrinter,
  disconnectPrinter,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-black text-white grid place-items-center font-bold">
            TM
          </div>
          <div>
            <div className="text-lg font-semibold">Thermal Task Manager</div>
            <div className="text-xs text-slate-500">
              Create, track, and print JIRA-style tickets
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600">Baud</label>
            <select
              value={baud}
              onChange={(e) => setBaud(parseInt(e.target.value))}
              className="px-2 py-1 text-sm rounded-xl border border-slate-300 bg-white"
            >
              {[9600, 19200, 38400, 57600, 115200].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <label className="text-xs text-slate-600">Copies</label>
            <input
              type="number"
              min={1}
              max={5}
              value={copies}
              onChange={(e) => setCopies(parseInt(e.target.value || "1"))}
              className="w-14 px-2 py-1 text-sm rounded-xl border border-slate-300 bg-white"
            />
          </div>
          {!port ? (
            <button
              onClick={connectPrinter}
              className="rounded-xl bg-black text-white px-3 py-2 text-sm hover:opacity-90"
            >
              Connect Printer
            </button>
          ) : (
            <button
              onClick={disconnectPrinter}
              className="rounded-xl bg-white border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
