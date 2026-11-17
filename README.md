# WhatsApp Chat Widget Generator

A simple web tool to generate customizable WhatsApp chat widget code for your website. Instantly preview, copy, or download the widget code to embed on your site and let visitors contact you via WhatsApp.

**Live Demo:** [whatsappwidgetgenerator.vercel.app](https://whatsappwidgetgenerator.vercel.app)

---

## Features

- **Live Preview:** Instantly see your widget as you customize it.
- **Customizable:** Set your company/website name, WhatsApp number, and choose from a selection of predefined greeting and outer messages.
- **Brand Logo:** Upload your own logo to be displayed as a circular profile picture in the chat widget.
- **Guided Chat:** Turn the widget into a small assistant. Add your own questions and answers (edit, reorder or remove them any time); visitors tap a question and get the answer straight away, with web links made clickable.
- **Leave a Message:** Optionally let visitors type their name and a message in the chat. It then opens WhatsApp with the message already written, ready to send to you.
- **Remembers Your Settings:** Your questions, answers and settings are saved in your browser, so you can come back later and update them.
- **Framework Support:** Generate complete, self-contained code for HTML, React, Vue, Next.js, Vite, and Blazor. Now with improved reliability for all frameworks.
- **Syntax Highlighting:** Code previews are highlighted for better readability.
- **Copy or Download:** Easily copy the generated code snippet, or download a complete, ready-to-use `.zip` package containing the code, CSS, and required images.
- **Responsive Design:** Uses Bootstrap 5 for a clean, responsive layout.
- **No Backend Required:** Everything runs in the browser.

## Getting Started

1. **Clone or Download** this repository.
2. **Open `index.html`** in your web browser.

## Usage

1. **Configure the Widget:**
    - Fill in your Company/Website Name, WhatsApp Phone Number, Greeting Message, and Outer Quick Message.
    - Optional: switch on **Guided chat**, then add questions and answers with **+ Add question**. Use the arrows to reorder and the × to remove one. Tick **Let visitors leave their name and a message** to collect a message that opens in WhatsApp.
2. **Generate Code:**
    - Click **"Generate Code"** to see the live preview and the generated code.
3. **Select Your Framework:**
    - Choose your desired framework (HTML, React, Vue, etc.) from the drop-down menu. The code will update automatically.
4. **Get the Code:**
    - **Option 1: Copy Code:** Click **"Copy Code"** to grab the snippet and paste it into your project. Note that for frameworks other than Vue, you will need to manage the CSS and image assets separately.
    - **Option 2: Download Widget:** Click **"Download Widget"** to get a `.zip` file containing the component code, a `resources` folder with the necessary CSS and images, and clear instructions for use. This is the recommended method for easy integration.
5. **Embed the Widget:**
    - Follow the instructions in the generated code or the downloaded package to add the widget to your website.

## Example

![Screenshot](https://whatsappwidgetgenerator.vercel.app/whatsappWidget.jpg)

## Notes

- The phone number is sanitized to digits only for WhatsApp URLs.
- The widget works on both desktop and mobile (uses appropriate WhatsApp links).
- No backend required; everything runs in the browser.
- With guided chat on, the generated code contains your questions and answers in a config near the top (`config` / `CHAT_CONFIG` / `ConfigJson`), so you can also edit them there directly.
- For Blazor, add `resources/whatsapp-chatbot.js` and `resources/whatsapp-widget.css` from the download to your host page (the component's comment shows the two lines).

## SEO & Social

- Open Graph and Twitter meta tags included for rich sharing.
- SEO keywords and author meta tags included.

## License

MIT License