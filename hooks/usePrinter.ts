import { useState, useRef, useEffect } from "react";
import { SerialPort, Task } from "../types/task";
import { escposPrintTask } from "../utils/printer";

// Helper function to check if Web Serial API is available
const isWebSerialSupported = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  // Check if the page is served over HTTPS or localhost
  const isSecureContext =
    window.isSecureContext ||
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost";

  // Check if Web Serial API is available
  const hasSerial = "serial" in navigator;

  return isSecureContext && hasSerial;
};

export function usePrinter() {
  const [port, setPort] = useState<SerialPort | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(
    null
  );
  const [baud, setBaud] = useState(9600);
  const [copies, setCopies] = useState(1);
  const [busy, setBusy] = useState(false);
  const [webSerialSupported, setWebSerialSupported] = useState(false);

  // Check Web Serial API availability on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSecureContext =
        window.isSecureContext ||
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost";
      const hasSerial = "serial" in navigator;
      const supported = isSecureContext && hasSerial;

      setWebSerialSupported(supported);
    }
  }, []);

  const connectPrinter = async () => {
    try {
      // Check if Web Serial API is available
      if (!isWebSerialSupported()) {
        let errorMessage = "Web Serial API is not available. ";

        if (typeof window === "undefined") {
          errorMessage += "This appears to be a server-side environment.";
        } else if (
          !window.isSecureContext &&
          window.location.protocol !== "https:" &&
          window.location.hostname !== "localhost"
        ) {
          errorMessage +=
            "Please use HTTPS or localhost to access serial ports.";
        } else if (!("serial" in navigator)) {
          errorMessage +=
            "Please use a Chromium-based browser (Chrome, Edge, etc.) that supports Web Serial API.";
        }

        throw new Error(errorMessage);
      }

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
    isWebSerialSupported: webSerialSupported,
  };
}
