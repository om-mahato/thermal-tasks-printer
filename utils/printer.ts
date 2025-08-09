import { Task } from "../types/task";

// Wrap text to columns for ESC/POS (80mm ~ 42 columns with Font A on many printers).
function wrapText(text: string, cols = 42): string[] {
  const words = text.replace(/\r/g, "").split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (!w) continue;
    if ((line + (line ? " " : "") + w).length > cols) {
      if (line) lines.push(line);
      if (w.length > cols) {
        // break long word
        for (let i = 0; i < w.length; i += cols)
          lines.push(w.slice(i, i + cols));
        line = "";
      } else {
        line = w;
      }
    } else {
      line = line ? line + " " + w : w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Center text within a given width
function centerText(text: string, width = 42): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text;
}

// Create a decorative border
function createBorder(char = "=", width = 42): string {
  return char.repeat(width);
}

// Format priority with ASCII indicators
function formatPriority(priority: string): string {
  const indicators = {
    Low: "* LOW",
    Medium: "** MEDIUM",
    High: "*** HIGH",
    Urgent: "!!! URGENT",
  };
  return indicators[priority as keyof typeof indicators] || priority;
}

// Format status with ASCII indicators
function formatStatus(status: string): string {
  const indicators = {
    Backlog: "[BACKLOG]",
    "To Do": "[TO DO]",
    "In Progress": "[IN PROGRESS]",
    Review: "[REVIEW]",
    Done: "[COMPLETED]",
  };
  return indicators[status as keyof typeof indicators] || status;
}

// ESC/POS helpers
const esc = (...a: number[]) => new Uint8Array(a);
const enc = (s: string) => new TextEncoder().encode(s);

export async function escposPrintTask(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  t: Task,
  opts: { copies: number }
) {
  const write = (u: Uint8Array) => writer.write(u);

  for (let c = 0; c < (opts.copies || 1); c++) {
    await write(esc(0x1b, 0x40)); // init printer
    await write(esc(0x1b, 0x52, 0x00)); // USA charset
    await write(esc(0x1b, 0x74, 0x00)); // character set selection

    // ============= STATUS BANNER (TOP, CENTERED, LARGE) =============
    await write(esc(0x1b, 0x61, 0x01)); // center alignment
    await write(esc(0x1b, 0x21, 0x30)); // double height + width
    await write(esc(0x1b, 0x45, 0x01)); // bold on
    await write(enc(formatStatus(t.status) + "\n"));
    await write(esc(0x1b, 0x45, 0x00)); // bold off
    await write(esc(0x1b, 0x21, 0x00)); // normal size
    await write(esc(0x1b, 0x61, 0x00)); // left alignment
    await write(enc("\n"));

    // // ============= HEADER =============
    // await write(esc(0x1b, 0x61, 0x01)); // center alignment
    // await write(esc(0x1b, 0x21, 0x00)); // normal size

    // // ASCII Art Header
    // await write(enc(createBorder("=") + "\n"));
    // await write(enc("+----------------------------------------+\n"));
    // await write(enc("|          TASK MANAGEMENT              |\n"));
    // await write(enc("|            WORK TICKET                |\n"));
    // await write(enc("+----------------------------------------+\n"));
    // await write(enc(createBorder("=") + "\n"));

    // Task ID Banner
    // await write(esc(0x1b, 0x21, 0x30)); // double height + width
    // await write(enc(centerText(`TASK #${t.id}`) + "\n"));
    // await write(esc(0x1b, 0x21, 0x00)); // normal size
    // await write(enc("\n"));

    // ============= TASK TITLE =============
    // await write(esc(0x1b, 0x61, 0x00)); // left alignment
    // await write(esc(0x1b, 0x45, 0x01)); // bold on
    // await write(esc(0x1b, 0x21, 0x10)); // double height
    // await write(enc("TITLE:\n"));
    // await write(esc(0x1b, 0x21, 0x00)); // normal size
    // await write(esc(0x1b, 0x45, 0x00)); // bold off

    // Title content with border
    await write(enc("+" + "-".repeat(40) + "+\n"));
    await write(esc(0x1b, 0x45, 0x01));
    for (const line of wrapText(t.title, 38)) {
      await write(enc(`| ${line.padEnd(38)} |\n`));
    }
    await write(esc(0x1b, 0x45, 0x00));
    await write(enc("+" + "-".repeat(40) + "+\n\n"));

    if (t.description && t.description.trim()) {
      await write(enc("+" + "-".repeat(40) + "+\n"));
      for (const line of wrapText(t.description, 38)) {
        await write(enc(`| ${line.padEnd(38)} |\n`));
      }
      await write(enc("+" + "-".repeat(40) + "+\n\n"));
    }

    // ============= TASK DETAILS SECTION =============
    // await write(esc(0x1b, 0x45, 0x01)); // bold on
    // await write(enc("TASK DETAILS:\n"));
    // await write(esc(0x1b, 0x45, 0x00)); // bold off
    // await write(enc(createBorder("-", 42) + "\n"));

    // // Priority
    // await write(esc(0x1b, 0x45, 0x01)); // bold on
    // await write(enc("Priority: "));
    // await write(esc(0x1b, 0x45, 0x00)); // bold off
    // await write(enc(formatPriority(t.priority) + "\n"));

    // // Assignee
    // if (t.assignee) {
    //   await write(esc(0x1b, 0x45, 0x01)); // bold on
    //   await write(enc("Assignee: "));
    //   await write(esc(0x1b, 0x45, 0x00)); // bold off
    //   await write(enc(`${t.assignee}\n`));
    // }

    // Due Date
    if (t.due) {
      await write(esc(0x1b, 0x45, 0x01)); // bold on
      await write(enc("Due Date: "));
      await write(esc(0x1b, 0x45, 0x00)); // bold off
      await write(enc(`${new Date(t.due).toLocaleDateString()}\n`));
    }

    // Creation Date
    await write(esc(0x1b, 0x45, 0x01)); // bold on
    // await write(enc("Created:  "));
    const createdDate = new Date(t.createdAt);
    await write(
      enc(
        `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}\n`
      )
    );
    await write(esc(0x1b, 0x45, 0x00)); // bold off

    await write(enc("\n"));

    // ============= TAGS SECTION =============
    if (t.tags?.length) {
      await write(esc(0x1b, 0x45, 0x01)); // bold on
      await write(enc("TAGS:\n"));
      await write(esc(0x1b, 0x45, 0x00)); // bold off

      const tagText = t.tags.map((tag) => `#${tag}`).join(" ");
      for (const line of wrapText(tagText, 42)) {
        await write(enc(`    ${line}\n`));
      }
      await write(enc("\n"));
    }

    // ============= FINAL SPACING AND CUT =============
    // await write(enc("\n\n"));
    await write(esc(0x1b, 0x64, 0x04)); // feed 4 lines
    await write(esc(0x1d, 0x56, 0x01)); // partial cut

    // Add extra spacing between copies
    // if (c < opts.copies - 1) {
    //   await write(enc("\n\n"));
    // }
  }
}
