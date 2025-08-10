import { useState, useRef } from "react";
import { SerialPort, Task } from "../types/task";
import { escposPrintTask } from "../utils/printer";

export function usePrinter() {
  const [port, setPort] = useState<SerialPort | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(
    null
  );
  const [baud, setBaud] = useState(9600);
  const [copies, setCopies] = useState(1);
  const [busy, setBusy] = useState(false);

  const connectPrinter = async () => {
    try {
      // @ts-ignore - navigator.serial exists on Chromium
      const p: SerialPort = await navigator.serial.requestPort();
      await p.open({ baudRate: baud });
      const writer = p.writable!.getWriter();
      writerRef.current = writer;
      setPort(p);
    } catch (e) {
      alert("Could not open serial port: " + (e as Error).message);
    }
  };

  const disconnectPrinter = async () => {
    try {
      writerRef.current?.releaseLock();
      writerRef.current = null;
      await port?.close();
      setPort(null);
    } catch (e) {
      console.warn(e);
    }
  };

  const printTask = async (task: Task) => {
    if (!writerRef.current) {
      alert("Printer not connected. Click 'Connect Printer' first.");
      return;
    }
    setBusy(true);
    try {
      await escposPrintTask(writerRef.current, task, { copies });
    } catch (e) {
      alert("Print failed: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return {
    port,
    baud,
    setBaud,
    copies,
    setCopies,
    busy,
    connectPrinter,
    disconnectPrinter,
    printTask,
  };
}
