# RTL Fix for AI Chat Interfaces

🚀 Automatically fixes RTL (Right-to-Left) text issues in modern AI chat platforms like ChatGPT, Claude, Gemini, Copilot, and more.

---

## ✨ Overview

Many AI chat platforms do not properly support RTL languages like Persian (Farsi) and Arabic.
This extension intelligently detects RTL text and fixes layout, alignment, and direction issues in real-time — without breaking code blocks or English content.

---

## 🔥 Features

* 🧠 Smart RTL detection (Persian & Arabic)
* ⚡ Real-time DOM processing (works instantly on new messages)
* 💻 Keeps code blocks and technical content in LTR
* ✍️ Auto-adjusts input fields while typing
* 🎯 Works only on supported AI chat websites
* 🎛 Toggle button (RTL ON / OFF)
* 🪶 Lightweight and fast (no performance issues)

---

## 🌐 Supported Websites

* Claude.ai
* Gemini (Google AI)
* DeepSeek
* Microsoft Copilot
* Poe
* Duck.ai

---

## 🛠 How It Works

The extension:

* Scans page content
* Detects RTL vs LTR text using character analysis
* Applies direction dynamically
* Observes DOM changes using MutationObserver
* Keeps code blocks untouched

---

## 📦 Installation (Manual)

1. Download this repository (Code → Download ZIP)
2. Extract the ZIP file
3. Open Chrome and go to:

   ```
   chrome://extensions/
   ```
4. Enable **Developer Mode**
5. Click **Load unpacked**
6. Select the project folder

---

## 🎛 Usage

* The extension runs automatically on supported websites
* A floating button appears:

  * ✅ RTL ON → Enable RTL fixing
  * ❌ RTL OFF → Disable it anytime

---

## 💡 Why This Extension?

Most AI chat interfaces are optimized for English (LTR), which causes:

* Broken Persian/Arabic text layout
* Incorrect alignment
* Hard-to-read conversations

This extension fixes all of that — instantly.

---

## ⚙️ Tech Highlights

* Vanilla JavaScript (no dependencies)
* MutationObserver for dynamic updates
* Smart regex-based RTL detection
* DOM tree processing
* Chrome Storage API for state persistence

---

## 🚧 Future Plans

* Chrome Web Store release
* More site support
* Performance optimizations
* Custom settings panel

---

## 🤝 Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests.

---

## 📄 License

MIT License
