# 🖨 Thermal Task Printer – ESC/POS Ticket Printer

A modern, responsive **React + Tailwind** web app for creating, managing, and printing JIRA-style tasks directly to **ESC/POS thermal printers** over USB or Bluetooth using the **Web Serial API**.

## ✨ Features
- 📝 **Task Management Board** – priorities, statuses, assignees, tags, and due dates  
- 🔍 **Search & Filter** – quickly find tasks by keyword, priority, or status  
- 🖨 **Direct ESC/POS Printing** – 58 mm or 80 mm printers (RawBT-style)  
- ⚡ **No Server Required** – runs entirely in the browser with Web Serial support  
- 💾 **Offline Persistence** – tasks saved in `localStorage`  
- 🎨 **Clean, Responsive UI** – powered by Tailwind CSS  


---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js LTS](https://nodejs.org/) (v18 or newer)
- A **Chromium-based browser** (Chrome, Edge, Brave) with [Web Serial API](https://developer.chrome.com/articles/serial/) enabled
- An **ESC/POS thermal printer** with USB or Bluetooth Serial (SPP) support

---

### 2. Clone and Install
```bash
git clone https://github.com/yourusername/thermal-task-printer.git
cd thermal-task-printer
npm install
