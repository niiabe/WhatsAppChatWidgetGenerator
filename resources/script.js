(function () {
  var button = document.getElementById("whatswidget-button");
  var conversation = document.getElementById("whatswidget-conversation");
  var convoOuter = document.getElementById("whatswidget-conversation-message-outer");
  var chatOpen = false;

  function openChat() {
    if (!chatOpen) {
      conversation.style.display = "block";
      conversation.style.opacity = 1;
      convoOuter.style.display = "none";
      chatOpen = true;
    } else {
      conversation.style.opacity = 0;
      conversation.style.display = "none";
      chatOpen = false;
    }
  }

  if (button) button.addEventListener("click", openChat);
  if (convoOuter) convoOuter.addEventListener("click", openChat);
})();

// sanitize phone: keep digits only
function sanitizePhone(raw) {
  // remove non digits
  const digits = (raw || '').replace(/\D/g, '');
  return digits;
}

let logoDataUrl = '';

const widgetCss = `
.whatswidget-widget-wrapper {
  font-family: 'DM Serif Display', serif;
  font-size: 16px;
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 1001;
}
.whatswidget-conversation {
  background-color: #e4dcd4;
  background-image: url('resources/wpbg.png');
  background-repeat: repeat;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;
  width: 250px;
  height: 300px;
  border-radius: 15px;
  transition-duration: 0.5s;
  margin-bottom: 80px;
}
.whatswidget-conversation-header {
  background-color: #25D366;
  padding: 10px;
  box-shadow: 0px 1px #00000029;
  font-weight: 600;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
  align-items: center;
}
.whatswidget-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}
.whatswidget-conversation-message {
  line-height: 1.2em;
  background-color: #25D366;
  padding: 10px;
  margin: 10px 15px;
  border-radius: 10px;
  color: white;
}
.whatswidget-conversation-message-outer {
  background-color: #25D366;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.34) 0px 2.5px 10px;
  cursor: pointer;
  animation: nudge 2s linear infinite;
  margin-bottom: 70px;
  color: white;
}
.whatswidget-text-header-outer {
  font-weight: bold;
  font-size: 90%;
}
.whatswidget-text-message-outer {
  font-size: 90%;
}
.whatswidget-conversation-cta {
  border-radius: 30px;
  width: 175px;
  font-size: 110%;
  padding: 10px;
  margin: 0 auto;
  text-align: center;
  background-color: #23b123;
  color: white;
  font-weight: bold;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 2.5px 10px;
  position: absolute;
  top: 62%;
  left: 10%;
  transition: 1s;
}
.whatswidget-conversation-cta:hover {
  transform: scale(1.1);
  filter: brightness(1.3);
}
.whatswidget-cta {
  text-decoration: none;
  color: white;
}
.whatswidget-cta-desktop { display: none; }
.whatswidget-cta-mobile { display: inherit; }
@media (min-width: 768px) {
  .whatswidget-cta-desktop { display: inherit; }
  .whatswidget-cta-mobile { display: none; }
}
.whatswidget-button-wrapper {
  position: fixed;
  bottom: 15px;
  right: 15px;
}
.whatswidget-button {
  background-color: #31d831;
  border-radius: 100%;
  width: 60px;
  height: 60px;
  box-shadow: 2px 1px #0d630d63;
  transition: 1s;
  position: relative;
}
.whatswidget-icon {
  width: 42px;
  height: 42px;
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.whatswidget-button:hover {
  filter: brightness(115%);
  transform: rotate(15deg) scale(1.15);
  cursor: pointer;
}
@keyframes nudge {
  20%, 100% { transform: translate(0, 0); }
  0% { transform: translate(0, 5px) rotate(2deg); }
  10% { transform: translate(0, -5px) rotate(-2deg); }
}
`;

/* ------------------------------------------------------------------------
 * Guided chat
 * The widget can answer common questions itself, then hand the visitor's
 * message to WhatsApp, already typed. whatsAppChatbot() runs the live
 * preview and is copied verbatim into the generated code (via toString), so
 * the preview and the code a user installs always behave the same.
 * It must stay self-contained: no references to anything outside itself.
 * ---------------------------------------------------------------------- */
function whatsAppChatbot(root, config) {
  var log = root.querySelector('.wa-bot-log');
  var actions = root.querySelector('.wa-bot-actions');
  var form = root.querySelector('.wa-bot-input');
  var input = form ? form.querySelector('input') : null;
  if (!log || !actions) return;

  var phone = String(config.phone || '').replace(/\D/g, '');
  var company = config.company || 'us';
  var onAnswer = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Answers are plain text: escaped, with web links made clickable.
  function rich(s) {
    return esc(s).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }
  function say(html, who) {
    var m = document.createElement('div');
    m.className = 'wa-msg ' + (who || 'bot');
    m.innerHTML = html;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }
  function waLink(text) {
    return 'https://wa.me/' + phone + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  function choices(list) {
    actions.innerHTML = '';
    if (form) form.hidden = true;
    list.forEach(function (c) {
      var b = document.createElement(c.href ? 'a' : 'button');
      b.className = 'wa-chip' + (c.style ? ' ' + c.style : '');
      b.textContent = c.label;
      if (c.href) { b.href = c.href; b.target = '_blank'; b.rel = 'noopener'; }
      else { b.type = 'button'; }
      b.addEventListener('click', function () {
        if (c.href) return;
        say(esc(c.label), 'me');
        c.go();
      });
      actions.appendChild(b);
    });
  }
  function ask(question, placeholder, then) {
    say(question);
    actions.innerHTML = '';
    if (!form) return;
    form.hidden = false;
    input.value = '';
    input.placeholder = placeholder || '';
    onAnswer = then;
    input.focus();
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text || !onAnswer) return;
      say(esc(text), 'me');
      var next = onAnswer;
      onAnswer = null;
      next(text);
    });
  }

  function menu(intro) {
    say(rich(intro));
    var list = (config.faqs || []).filter(function (f) { return f && f.question; }).map(function (f) {
      return {
        label: f.question,
        go: function () {
          say(rich(f.answer || ''));
          menu(config.followUp || 'Anything else I can help with?');
        }
      };
    });
    if (config.collectMessage) {
      list.push({ label: config.messageLabel || 'Send us a message', go: leaveMessage });
    }
    list.push({ label: config.whatsappLabel || 'Chat on WhatsApp', style: 'primary', href: waLink('') });
    choices(list);
  }

  function leaveMessage() {
    ask('Great. What is your name?', 'Your name', function (name) {
      ask('Thanks, ' + esc(name.split(' ')[0]) + '. What would you like to tell us?', 'Your message', function (message) {
        var text = 'Hello ' + company + ', I found you on your website.\nName: ' + name + '\nMessage: ' + message;
        say('Thank you! Tap <strong>Send on WhatsApp</strong> and your message opens in WhatsApp, ready to send to us.');
        choices([
          { label: 'Send on WhatsApp', style: 'primary', href: waLink(text) },
          { label: 'Start over', style: 'quiet', go: function () { log.innerHTML = ''; menu(config.greeting || 'How can we help you?'); } }
        ]);
      });
    });
  }

  menu(config.greeting || 'How can we help you?');
}

const chatbotCss = `
.whatswidget-conversation.wa-bot {
  width: 300px;
  max-width: calc(100vw - 40px);
  height: auto;
  max-height: calc(100vh - 130px);
  overflow: hidden;
}
.wa-bot-log {
  padding: 10px 12px 4px;
  max-height: 290px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
}
.wa-msg {
  max-width: 85%;
  padding: 7px 10px;
  border-radius: 9px;
  line-height: 1.35;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12);
  white-space: pre-line;
  animation: wa-rise 0.25s ease both;
}
.wa-msg.bot { background: #fff; color: #222; align-self: flex-start; border-top-left-radius: 2px; }
.wa-msg.me { background: #d9fdd3; color: #222; align-self: flex-end; border-top-right-radius: 2px; }
.wa-msg a { color: #0a7c3e; font-weight: 600; text-decoration: underline; }
.wa-bot-actions { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px 12px 12px; }
.wa-chip {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 11px;
  border-radius: 16px;
  cursor: pointer;
  background: #fff;
  color: #0a7c3e;
  border: 1.5px solid #25D366;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.wa-chip:hover, .wa-chip:focus-visible { background: #25D366; color: #fff; outline: none; }
.wa-chip.primary { background: #25D366; color: #fff; }
.wa-chip.primary:hover { filter: brightness(1.08); }
.wa-chip.quiet { border-color: #c9c4bc; color: #555; }
.wa-bot-input { display: flex; gap: 6px; padding: 0 12px 12px; }
.wa-bot-input[hidden] { display: none; }
.wa-bot-input input {
  flex: 1;
  min-width: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 18px;
  border: 1px solid #d5d0c8;
  background: #fff;
  color: #222;
}
.wa-bot-input input:focus { outline: 2px solid #25D366; border-color: transparent; }
.wa-bot-input button {
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 50%;
  border: 0;
  background: #25D366;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
@keyframes wa-rise {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
`;

// The chat panel's inner markup for guided mode (log, quick replies, text box).
function chatbotPanelHtml() {
  return `<div class="wa-bot-log" aria-live="polite"></div>
      <div class="wa-bot-actions"></div>
      <form class="wa-bot-input" hidden>
        <input type="text" autocomplete="off" aria-label="Type your answer">
        <button type="submit" aria-label="Send">&#10148;</button>
      </form>`;
}

// What the generated widget is told; only what it needs, so no logo data is duplicated.
function chatbotConfig(bot, company, phoneDigits, greeting) {
  return {
    company: company,
    phone: phoneDigits,
    greeting: greeting,
    faqs: bot.faqs,
    collectMessage: bot.collectMessage,
    followUp: 'Anything else I can help with?'
  };
}

function buildHtmlCode(company, phoneDigits, greeting, outerMessage, logo, bot) {
  if (bot) return buildHtmlChatbotCode(company, phoneDigits, greeting, outerMessage, logo, bot);
  const logoHtml = logo ? `<img src="${logo}" alt="Logo" class="whatswidget-logo">` : '';
  return `<!-- WhatsApp Widget (generated) -->
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
<div id="whatswidget-pre-wrapper">
  <div class="whatswidget-widget-wrapper">
    <div id="whatswidget-conversation" class="whatswidget-conversation" style="display:none;opacity:0;">
      <div class="whatswidget-conversation-header">
        ${logoHtml}
        <div id="whatswidget-conversation-title" class="whatswidget-conversation-title text-white">${escapeHtml(company)}</div>
      </div>

      <div id="whatswidget-conversation-message" class="whatswidget-conversation-message">${escapeHtml(greeting)}</div>

      <div class="whatswidget-conversation-cta">
        <a id="whatswidget-phone-desktop" target="_blank" href="https://web.whatsapp.com/send?phone=${phoneDigits}" class="whatswidget-cta whatswidget-cta-desktop">Send message</a>
        <a id="whatswidget-phone-mobile" target="_blank" href="https://wa.me/${phoneDigits}" class="whatswidget-cta whatswidget-cta-mobile">Send message</a>
      </div>
    </div>

    <div id="whatswidget-conversation-message-outer" class="whatswidget-conversation-message-outer">
      <span id="whatswidget-text-header-outer" class="whatswidget-text-header-outer">${escapeHtml(company)}</span><br>
      <div id="whatswidget-text-message-outer" class="whatswidget-text-message-outer">${escapeHtml(outerMessage)}</div>
    </div>

    <div class="whatswidget-button-wrapper">
      <div class="whatswidget-button" id="whatswidget-button">
        <div style="margin:0 auto;width:38.5px;">
          <img class="whatswidget-icon" alt="WhatsappLogo" src="resources/wpwhite.png">
        </div>
      </div>
    </div>
  </div>

  <style>
    ${widgetCss}
  </style>

  <script>
    (function () {
      var button = document.getElementById("whatswidget-button");
      var conversation = document.getElementById("whatswidget-conversation");
      var convoOuter = document.getElementById("whatswidget-conversation-message-outer");
      var chatOpen = false;

      function openChat() {
        if (!chatOpen) {
          conversation.style.display = "block";
          conversation.style.opacity = 1;
          convoOuter.style.display = "none";
          chatOpen = true;
        } else {
          conversation.style.opacity = 0;
          conversation.style.display = "none";
          chatOpen = false;
        }
      }

      if (button) button.addEventListener("click", openChat);
      if (convoOuter) convoOuter.addEventListener("click", openChat);
    })();
  <\/script>
</div>
<!-- End WhatsApp Widget -->`;
}

// JSON that is safe inside a <script> tag: a closing script tag in an answer can't end it early.
function scriptSafeJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
}

function buildHtmlChatbotCode(company, phoneDigits, greeting, outerMessage, logo, bot) {
  const logoHtml = logo ? `<img src="${logo}" alt="Logo" class="whatswidget-logo">` : '';
  const config = chatbotConfig(bot, company, phoneDigits, greeting);
  return `<!-- WhatsApp Widget with guided chat (generated) -->
<!-- To change the questions and answers later, edit "faqs" in the config below. -->
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
<div id="whatswidget-pre-wrapper">
  <div class="whatswidget-widget-wrapper">
    <div id="whatswidget-conversation" class="whatswidget-conversation wa-bot" style="display:none;opacity:0;">
      <div class="whatswidget-conversation-header">
        ${logoHtml}
        <div id="whatswidget-conversation-title" class="whatswidget-conversation-title text-white">${escapeHtml(company)}</div>
      </div>
      ${chatbotPanelHtml()}
    </div>

    <div id="whatswidget-conversation-message-outer" class="whatswidget-conversation-message-outer">
      <span id="whatswidget-text-header-outer" class="whatswidget-text-header-outer">${escapeHtml(company)}</span><br>
      <div id="whatswidget-text-message-outer" class="whatswidget-text-message-outer">${escapeHtml(outerMessage)}</div>
    </div>

    <div class="whatswidget-button-wrapper">
      <div class="whatswidget-button" id="whatswidget-button">
        <div style="margin:0 auto;width:38.5px;">
          <img class="whatswidget-icon" alt="WhatsappLogo" src="resources/wpwhite.png">
        </div>
      </div>
    </div>
  </div>

  <style>
    ${widgetCss}
    ${chatbotCss}
  </style>

  <script>
    (function () {
      var config = ${scriptSafeJson(config)};

      var button = document.getElementById("whatswidget-button");
      var conversation = document.getElementById("whatswidget-conversation");
      var convoOuter = document.getElementById("whatswidget-conversation-message-outer");
      var chatOpen = false;

      function openChat() {
        if (!chatOpen) {
          conversation.style.display = "block";
          conversation.style.opacity = 1;
          convoOuter.style.display = "none";
          chatOpen = true;
        } else {
          conversation.style.opacity = 0;
          conversation.style.display = "none";
          chatOpen = false;
        }
      }

      if (button) button.addEventListener("click", openChat);
      if (convoOuter) convoOuter.addEventListener("click", openChat);

      (${whatsAppChatbot.toString()})(conversation, config);
    })();
  <\/script>
</div>
<!-- End WhatsApp Widget -->`;
}

function buildReactCode(company, phoneDigits, greeting, outerMessage, logo, bot) {
  if (bot) return buildReactChatbotCode(company, phoneDigits, greeting, outerMessage, logo, bot);
  const logoHtml = logo ? `<img src={"${logo}"} alt="Logo" className="whatswidget-logo" />` : '';
  return `// 1. Download the widget package.
// 2. Place the 'resources' folder in your project's public/assets directory.
// 3. Adjust the image and CSS paths in this component if necessary.
// 4. Import and use the component in your app.

import React, { useState } from 'react';
import './resources/whatsapp-widget.css';

const WhatsAppWidget = ({ companyName, phoneNo, greeting, outerMessage, logo }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Use props or default values
  const finalCompanyName = companyName || "${escapeHtml(company)}";
  const finalPhoneNo = phoneNo || "${phoneDigits}";
  const finalGreeting = greeting || "${escapeHtml(greeting)}";
  const finalOuterMessage = outerMessage || "${escapeHtml(outerMessage)}";
  const finalLogo = logo || (logoDataUrl ? "${logoDataUrl}" : null);

  return (
    <div className="whatswidget-widget-wrapper">
      {isOpen && (
        <div className="whatswidget-conversation">
          <div className="whatswidget-conversation-header">
            {finalLogo && <img src={finalLogo} alt="Logo" className="whatswidget-logo" />}
            <div className="whatswidget-conversation-title text-white">{finalCompanyName}</div>
          </div>
          <div className="whatswidget-conversation-message">{finalGreeting}</div>
          <div className="whatswidget-conversation-cta">
            <a href={\`https://web.whatsapp.com/send?phone=${finalPhoneNo}\`} target="_blank" rel="noopener noreferrer" className="whatswidget-cta whatswidget-cta-desktop">Send message</a>
            <a href={\`https://wa.me/${finalPhoneNo}\`} target="_blank" rel="noopener noreferrer" className="whatswidget-cta whatswidget-cta-mobile">Send message</a>
          </div>
        </div>
      )}
      {!isOpen && (
        <div className="whatswidget-conversation-message-outer" onClick={() => setIsOpen(true)}>
          <span className="whatswidget-text-header-outer">{finalCompanyName}</span><br />
          <div className="whatswidget-text-message-outer">{finalOuterMessage}</div>
        </div>
      )}
      <div className="whatswidget-button-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <div className="whatswidget-button">
          <div style={{ margin: '0 auto', width: '38.5px' }}>
            <img className="whatswidget-icon" alt="WhatsappLogo" src="resources/wpwhite.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppWidget;

/*
CSS for WhatsAppWidget.css:
${widgetCss}
*/
`;
}

function buildReactChatbotCode(company, phoneDigits, greeting, outerMessage, logo, bot) {
  const config = chatbotConfig(bot, company, phoneDigits, greeting);
  return `// WhatsApp widget with guided chat.
// 1. Download the widget package.
// 2. Place the 'resources' folder in your project's public/assets directory.
// 3. Adjust the image and CSS paths in this component if necessary.
// 4. Import and use the component in your app. For Next.js, add 'use client' at the top.
// To change the questions and answers later, edit CHAT_CONFIG.faqs below.

import React, { useEffect, useRef, useState } from 'react';
import './resources/whatsapp-widget.css';

const CHAT_CONFIG = ${JSON.stringify(config, null, 2)};

// The guided chat itself (plain JavaScript, shared with the HTML widget).
const whatsAppChatbot = ${whatsAppChatbot.toString()};

const WhatsAppWidget = ({ companyName, logo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panel = useRef(null);
  const finalCompanyName = companyName || CHAT_CONFIG.company;
  const finalLogo = logo || ${logo ? JSON.stringify(logo) : 'null'};

  useEffect(() => {
    // Start the chat once; React leaves the panel's contents to it.
    if (panel.current && !panel.current.dataset.started) {
      panel.current.dataset.started = '1';
      whatsAppChatbot(panel.current, CHAT_CONFIG);
    }
  }, []);

  return (
    <div className="whatswidget-widget-wrapper">
      <div className="whatswidget-conversation wa-bot" ref={panel} style={{ display: isOpen ? 'block' : 'none', opacity: isOpen ? 1 : 0 }}>
        <div className="whatswidget-conversation-header">
          {finalLogo && <img src={finalLogo} alt="Logo" className="whatswidget-logo" />}
          <div className="whatswidget-conversation-title text-white">{finalCompanyName}</div>
        </div>
        <div className="wa-bot-log" aria-live="polite"></div>
        <div className="wa-bot-actions"></div>
        <form className="wa-bot-input" hidden>
          <input type="text" autoComplete="off" aria-label="Type your answer" />
          <button type="submit" aria-label="Send">&#10148;</button>
        </form>
      </div>
      {!isOpen && (
        <div className="whatswidget-conversation-message-outer" onClick={() => setIsOpen(true)}>
          <span className="whatswidget-text-header-outer">{finalCompanyName}</span><br />
          <div className="whatswidget-text-message-outer">{${JSON.stringify(outerMessage)}}</div>
        </div>
      )}
      <div className="whatswidget-button-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <div className="whatswidget-button">
          <div style={{ margin: '0 auto', width: '38.5px' }}>
            <img className="whatswidget-icon" alt="WhatsappLogo" src="resources/wpwhite.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppWidget;

/*
CSS for resources/whatsapp-widget.css (included in the download):
${widgetCss}
${chatbotCss}
*/
`;
}

function buildVueCode(company, phoneDigits, greeting, outerMessage, logo, bot) {
  if (bot) return buildVueChatbotCode(company, phoneDigits, greeting, outerMessage, logo, bot);
  const logoHtml = logo ? `<img :src="finalLogo" alt="Logo" class="whatswidget-logo" v-if="finalLogo">` : '';
  return `<template>
  <div class="whatswidget-widget-wrapper">
    <div v-if="isOpen" class="whatswidget-conversation">
      <div class="whatswidget-conversation-header">
        <img :src="finalLogo" alt="Logo" class="whatswidget-logo" v-if="finalLogo">
        <div class="whatswidget-conversation-title text-white">{{ finalCompanyName }}</div>
      </div>
      <div class="whatswidget-conversation-message">{{ finalGreeting }}</div>
      <div class="whatswidget-conversation-cta">
        <a :href="\`https://web.whatsapp.com/send?phone=${phoneDigits}\`" target="_blank" rel="noopener noreferrer" class="whatswidget-cta whatswidget-cta-desktop">Send message</a>
        <a :href="\`https://wa.me/${phoneDigits}\`" target="_blank" rel="noopener noreferrer" class="whatswidget-cta whatswidget-cta-mobile">Send message</a>
      </div>
    </div>
    <div v-if="!isOpen" class="whatswidget-conversation-message-outer" @click="isOpen = true">
      <span class="whatswidget-text-header-outer">{{ finalCompanyName }}</span><br />
      <div class="whatswidget-text-message-outer">{{ finalOuterMessage }}</div>
    </div>
    <div class="whatswidget-button-wrapper" @click="isOpen = !isOpen">
      <div class="whatswidget-button">
        <div style="margin:0 auto;width:38.5px;">
          <img class="whatswidget-icon" alt="WhatsappLogo" src="resources/wpwhite.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    companyName: {
      type: String,
      default: '${escapeHtml(company)}',
    },
    phoneNo: {
      type: String,
      default: '${phoneDigits}',
    },
    greeting: {
      type: String,
      default: '${escapeHtml(greeting)}',
    },
    outerMessage: {
      type: String,
      default: '${escapeHtml(outerMessage)}',
    },
    logo: {
        type: String,
        default: logoDataUrl ? '${logoDataUrl}' : null
    }
  },
  data() {
    return {
      isOpen: false,
      finalCompanyName: this.companyName,
      finalPhoneNo: this.phoneNo,
      finalGreeting: this.greeting,
      finalOuterMessage: this.outerMessage,
      finalLogo: this.logo,
    };
  },
};
<\/script>

<style scoped>
${widgetCss}
</style>
`;
}

function buildVueChatbotCode(company, phoneDigits, greeting, outerMessage, logo, bot) {
  const config = chatbotConfig(bot, company, phoneDigits, greeting);
  return `<!-- WhatsApp widget with guided chat. To change the questions and answers later, edit CHAT_CONFIG.faqs below. -->
<template>
  <div class="whatswidget-widget-wrapper">
    <div ref="panel" class="whatswidget-conversation wa-bot" :style="{ display: isOpen ? 'block' : 'none', opacity: isOpen ? 1 : 0 }">
      <div class="whatswidget-conversation-header">
        <img v-if="logo" :src="logo" alt="Logo" class="whatswidget-logo">
        <div class="whatswidget-conversation-title text-white">{{ companyName }}</div>
      </div>
      <div class="wa-bot-log" aria-live="polite"></div>
      <div class="wa-bot-actions"></div>
      <form class="wa-bot-input" hidden>
        <input type="text" autocomplete="off" aria-label="Type your answer">
        <button type="submit" aria-label="Send">&#10148;</button>
      </form>
    </div>
    <div v-if="!isOpen" class="whatswidget-conversation-message-outer" @click="isOpen = true">
      <span class="whatswidget-text-header-outer">{{ companyName }}</span><br />
      <div class="whatswidget-text-message-outer">{{ outerMessage }}</div>
    </div>
    <div class="whatswidget-button-wrapper" @click="isOpen = !isOpen">
      <div class="whatswidget-button">
        <div style="margin:0 auto;width:38.5px;">
          <img class="whatswidget-icon" alt="WhatsappLogo" src="resources/wpwhite.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const CHAT_CONFIG = ${JSON.stringify(config, null, 2)};

// The guided chat itself (plain JavaScript, shared with the HTML widget).
const whatsAppChatbot = ${whatsAppChatbot.toString()};

export default {
  props: {
    companyName: { type: String, default: ${JSON.stringify(company)} },
    outerMessage: { type: String, default: ${JSON.stringify(outerMessage)} },
    logo: { type: String, default: ${logo ? JSON.stringify(logo) : 'null'} }
  },
  data() {
    return { isOpen: false };
  },
  mounted() {
    // Vue leaves the chat's own elements to the chat script.
    whatsAppChatbot(this.$refs.panel, CHAT_CONFIG);
  }
};
<\/script>

<style>
${widgetCss}
${chatbotCss}
</style>
`;
}

function buildBlazorCode(company, phoneDigits, greeting, outerMessage, logo, bot) {
  if (bot) return buildBlazorChatbotCode(company, phoneDigits, greeting, outerMessage, logo, bot);
  const logoHtml = logo ? `<img src="@Logo" alt="Logo" class="whatswidget-logo">` : '';
  return `
@*
1. Download the widget package.
2. Place the 'resources' folder in your project's 'wwwroot' directory.
3. Ensure the paths to the CSS and images are correct.
4. Add the component to your page, e.g., <WhatsAppWidget />
*@

<div class="whatswidget-widget-wrapper">
    @if (isOpen)
    {
        <div class="whatswidget-conversation">
            <div class="whatswidget-conversation-header">
                @if (!string.IsNullOrEmpty(Logo))
                {
                    <img src="@Logo" alt="Logo" class="whatswidget-logo">
                }
                <div class="whatswidget-conversation-title text-white">@CompanyName</div>
            </div>
            <div class="whatswidget-conversation-message">@Greeting</div>
            <div class="whatswidget-conversation-cta">
                <a href="https://web.whatsapp.com/send?phone=@PhoneNo" target="_blank" rel="noopener noreferrer" class="whatswidget-cta whatswidget-cta-desktop">Send message</a>
                <a href="https://wa.me/@PhoneNo" target="_blank" rel="noopener noreferrer" class="whatswidget-cta whatswidget-cta-mobile">Send message</a>
            </div>
        </div>
    }
    else
    {
        <div class="whatswidget-conversation-message-outer" @onclick="() => isOpen = true">
            <span class="whatswidget-text-header-outer">@CompanyName</span><br />
            <div class="whatswidget-text-message-outer">@OuterMessage</div>
        </div>
    }
    <div class="whatswidget-button-wrapper" @onclick="() => isOpen = !isOpen">
        <div class="whatswidget-button">
            <div style="margin:0 auto;width:38.5px;">
                <img class="whatswidget-icon" alt="WhatsappLogo" src="resources/wpwhite.png" />
            </div>
        </div>
    </div>
</div>

@code {
    private bool isOpen = false;

    [Parameter]
    public string CompanyName { get; set; } = "${escapeHtml(company)}";

    [Parameter]
    public string PhoneNo { get; set; } = "${phoneDigits}";

    [Parameter]
    public string Greeting { get; set; } = "${escapeHtml(greeting)}";

    [Parameter]
    public string OuterMessage { get; set; } = "${escapeHtml(outerMessage)}";

    [Parameter]
    public string Logo { get; set; } = logoDataUrl ? "${logoDataUrl}" : null;
}

@*
CSS for WhatsAppWidget.razor.css:
${widgetCss}
*@
`;
}

// The standalone chat script Blazor loads (also included in every download).
function chatbotScriptFile() {
  return `// WhatsApp widget guided chat. Used by the Blazor component; plain JavaScript.
window.whatsAppChatbot = ${whatsAppChatbot.toString()};
`;
}

function buildBlazorChatbotCode(company, phoneDigits, greeting, outerMessage, logo, bot) {
  const config = chatbotConfig(bot, company, phoneDigits, greeting);
  // A C# verbatim string: only double quotes need doubling.
  const configLiteral = JSON.stringify(config, null, 2).replace(/"/g, '""');
  return `@*
WhatsApp widget with guided chat.
1. Download the widget package.
2. Place the 'resources' folder in your project's 'wwwroot' directory.
3. Add these to your host page (App.razor, _Host.cshtml or index.html):
     <link rel="stylesheet" href="resources/whatsapp-widget.css" />
     <script src="resources/whatsapp-chatbot.js"><\/script>
4. Add the component to your layout or page: <WhatsAppWidget />
To change the questions and answers later, edit ConfigJson below.
*@
@using System.Text.Json
@inject IJSRuntime JS

<div class="whatswidget-widget-wrapper">
    <div class="whatswidget-conversation wa-bot" @ref="panel" style="display:@(isOpen ? "block" : "none");opacity:@(isOpen ? "1" : "0");">
        <div class="whatswidget-conversation-header">
            @if (!string.IsNullOrEmpty(Logo))
            {
                <img src="@Logo" alt="Logo" class="whatswidget-logo">
            }
            <div class="whatswidget-conversation-title text-white">@CompanyName</div>
        </div>
        <div class="wa-bot-log" aria-live="polite"></div>
        <div class="wa-bot-actions"></div>
        <form class="wa-bot-input" hidden>
            <input type="text" autocomplete="off" aria-label="Type your answer">
            <button type="submit" aria-label="Send">&#10148;</button>
        </form>
    </div>
    @if (!isOpen)
    {
        <div class="whatswidget-conversation-message-outer" @onclick="() => isOpen = true">
            <span class="whatswidget-text-header-outer">@CompanyName</span><br />
            <div class="whatswidget-text-message-outer">@OuterMessage</div>
        </div>
    }
    <div class="whatswidget-button-wrapper" @onclick="() => isOpen = !isOpen">
        <div class="whatswidget-button">
            <div style="margin:0 auto;width:38.5px;">
                <img class="whatswidget-icon" alt="WhatsappLogo" src="resources/wpwhite.png" />
            </div>
        </div>
    </div>
</div>

@code {
    private bool isOpen = false;
    private ElementReference panel;

    private const string ConfigJson = @"${configLiteral}";

    [Parameter]
    public string CompanyName { get; set; } = ${JSON.stringify(company)};

    [Parameter]
    public string OuterMessage { get; set; } = ${JSON.stringify(outerMessage)};

    [Parameter]
    public string? Logo { get; set; } = ${logo ? JSON.stringify(logo) : 'null'};

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        // Start the guided chat once; Blazor leaves the chat's own elements to it.
        if (firstRender)
        {
            await JS.InvokeVoidAsync("whatsAppChatbot", panel, JsonDocument.Parse(ConfigJson).RootElement);
        }
    }
}
`;
}

// small helper to avoid raw HTML injection into generated preview text
function escapeHtml(str) {
  if (!str) return '';
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, function (m) { return map[m]; });
}

// update preview (not by injecting the generated <script>, but by building interactive DOM)
function updatePreview(company, phoneDigits, greeting, outerMessage, logo, bot) {
  const root = document.getElementById('previewArea');
  const logoHtml = logo ? `<img src="${logo}" alt="Logo" class="whatswidget-logo">` : '';
  const panelInner = bot
    ? chatbotPanelHtml()
    : `<div class="whatswidget-conversation-message">${escapeHtml(greeting)}</div>
        <div class="whatswidget-conversation-cta">
          <a target="_blank" href="https://web.whatsapp.com/send?phone=${phoneDigits}" class="whatswidget-cta whatswidget-cta-desktop">Send message</a>
          <a target="_blank" href="https://wa.me/${phoneDigits}" class="whatswidget-cta whatswidget-cta-mobile">Send message</a>
        </div>`;
  root.classList.toggle('preview-bot', !!bot);
  root.innerHTML = `
    <div class="whatswidget-widget-wrapper" style="margin-bottom: -3rem">
      <div class="whatswidget-conversation${bot ? ' wa-bot' : ''}" style="display:none;opacity:0;">
        <div class="whatswidget-conversation-header">
          ${logoHtml}
          <div class="whatswidget-conversation-title text-white">${escapeHtml(company)}</div>
        </div>
        ${panelInner}
      </div>
      <div class="whatswidget-conversation-message-outer">
        <span class="whatswidget-text-header-outer">${escapeHtml(company)}</span><br>
        <div class="whatswidget-text-message-outer">${escapeHtml(outerMessage)}</div>
      </div>
      <div class="whatswidget-button-wrapper">
        <div class="whatswidget-button" id="whatswidget-button">
          <div style="margin:0 auto;width:38.5px;">
            <img class="whatswidget-icon" alt="WhatsappLogo" src="resources/wpwhite.png">
          </div>
        </div>
      </div>
    </div>
  `;

  const button = root.querySelector(".whatswidget-button");
  const conversation = root.querySelector(".whatswidget-conversation");
  const convoOuter = root.querySelector(".whatswidget-conversation-message-outer");
  let chatOpen = false;
  if (bot) whatsAppChatbot(conversation, chatbotConfig(bot, company, phoneDigits, greeting));

  function openChat() {
    if (!chatOpen) {
      conversation.style.display = "block";
      conversation.style.opacity = 1;
      convoOuter.style.display = "none";
      chatOpen = true;
    } else {
      conversation.style.opacity = 0;
      conversation.style.display = "none";
      chatOpen = false;
    }
  }

  root.onclick = (e) => {
    if (e.target.closest('.whatswidget-button') || e.target.closest('.whatswidget-conversation-message-outer')) {
      openChat();
    }
  };
}

// main
document.getElementById('widgetForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const company = document.getElementById('companyName').value.trim() || 'My Company';
  const rawPhone = document.getElementById('phoneNumber').value.trim() || '';
  const greeting = document.getElementById('greeting').value.trim() || 'How can we help you?';
  const outerMessage = document.getElementById('outerMessage').value.trim() || 'Need Help? Chat With Us.';

  const phoneDigits = sanitizePhone(rawPhone);
  if (!phoneDigits) {
    alert('Please enter a valid phone number with country code.');
    return;
  }

  const bot = readChatbotSettings();
  saveSettings();

  // Use data-framework attribute for reliability, fallback to html
  const frameworkBtn = document.getElementById('framework-dropdown');
  const framework = (frameworkBtn.dataset.framework || 'html').toLowerCase();

  let code = '';
  let language = 'html';

  switch (framework) {
    case 'react':
      code = buildReactCode(company, phoneDigits, greeting, outerMessage, logoDataUrl, bot);
      language = 'jsx';
      break;
    case 'vue':
      code = buildVueCode(company, phoneDigits, greeting, outerMessage, logoDataUrl, bot);
      language = 'html';
      break;
    case 'nextjs':
      code = buildReactCode(company, phoneDigits, greeting, outerMessage, logoDataUrl, bot);
      language = 'jsx';
      break;
    case 'vite':
      code = buildReactCode(company, phoneDigits, greeting, outerMessage, logoDataUrl, bot);
      language = 'jsx';
      break;
    case 'blazor':
      code = buildBlazorCode(company, phoneDigits, greeting, outerMessage, logoDataUrl, bot);
      language = 'razor';
      break;
    default:
      code = buildHtmlCode(company, phoneDigits, greeting, outerMessage, logoDataUrl, bot);
      language = 'html';
  }

  const generatedCode = document.getElementById('generated-code');
  generatedCode.textContent = code;
  generatedCode.className = `language-${language}`;

  // update preview
  updatePreview(company, phoneDigits, greeting, outerMessage, logoDataUrl, bot);

  // highlight all
  hljs.highlightAll();
});

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const framework = this.dataset.framework;
    const btn = document.getElementById('framework-dropdown');
    btn.textContent = this.textContent;
    btn.dataset.framework = framework;

    document.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('widgetForm').dispatchEvent(new Event('submit'));
  });
});

// copy code button
document.getElementById('copyBtn').addEventListener('click', function () {
  const code = document.getElementById('generated-code').textContent;
  if (!code) return;
  navigator.clipboard.writeText(code).then(function () {
    const original = document.getElementById('copyBtn').textContent;
    document.getElementById('copyBtn').textContent = 'Copied!';
    setTimeout(() => { document.getElementById('copyBtn').textContent = original; }, 1500);
  }, function (err) {
    alert('Copy failed :(');
  });
});

// download as zip
document.getElementById('downloadBtn').addEventListener('click', function () {
  const code = document.getElementById('generated-code').textContent;
  if (!code) {
    alert('Generate code first');
    return;
  }

  const framework = document.querySelector('#framework-dropdown').textContent.trim().toLowerCase();
  let filename = 'index.html';
  if (framework === 'react' || framework === 'next.js' || framework === 'vite') {
    filename = 'WhatsAppWidget.jsx';
  } else if (framework === 'vue') {
    filename = 'WhatsAppWidget.vue';
  } else if (framework === 'blazor') {
    filename = 'WhatsAppWidget.razor';
  }

  const downloadBtn = document.getElementById('downloadBtn');
  const originalBtnText = downloadBtn.textContent;
  downloadBtn.textContent = 'Preparing...';
  downloadBtn.disabled = true;

  // Fetch images
  Promise.all([
    fetch('resources/wpwhite.png').then(res => res.blob()),
    fetch('resources/wpbg.png').then(res => res.blob())
  ]).then(([wpwhite, wpbg]) => {
    const zip = new JSZip();
    zip.file(filename, code);
    const resources = zip.folder('resources');
    const bot = readChatbotSettings();
    resources.file('whatsapp-widget.css', widgetCss + (bot ? chatbotCss : ''));
    if (bot) resources.file('whatsapp-chatbot.js', chatbotScriptFile());
    resources.file('wpwhite.png', wpwhite);
    resources.file('wpbg.png', wpbg);

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'whatsapp-widget.zip';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
        downloadBtn.textContent = originalBtnText;
        downloadBtn.disabled = false;
      }, 100);
    });
  }).catch(err => {
    console.error('Failed to fetch images or create zip', err);
    alert('Failed to prepare download. Please check the console for errors.');
    downloadBtn.textContent = originalBtnText;
    downloadBtn.disabled = false;
  });
});


/* ------------------------------------------------------------------------
 * Guided chat settings: the question list editor, and remembering settings
 * in this browser so they can be updated later.
 * ---------------------------------------------------------------------- */
const SETTINGS_KEY = 'whatsapp-widget-generator.settings';

const SAMPLE_FAQS = [
  { question: 'Where are you located?', answer: 'You can find us at (your address). Open in maps: https://maps.google.com' },
  { question: 'What are your opening hours?', answer: 'We are open Monday to Friday, 8am to 5pm.' },
  { question: 'How much does it cost?', answer: 'Prices depend on what you need. Leave us a message and we will send you a quote.' }
];

function faqRowHtml(faq) {
  return `<div class="faq-row card p-2 mb-2">
    <div class="d-flex gap-2 align-items-start">
      <div class="flex-grow-1">
        <input class="form-control form-control-sm mb-1 faq-question" placeholder="Question visitors can tap" value="${escapeHtml(faq.question || '')}">
        <textarea class="form-control form-control-sm faq-answer" rows="2" placeholder="The answer the chat gives">${escapeHtml(faq.answer || '')}</textarea>
      </div>
      <div class="btn-group-vertical btn-group-sm">
        <button type="button" class="btn btn-outline-secondary faq-up" title="Move up" aria-label="Move up">&uarr;</button>
        <button type="button" class="btn btn-outline-secondary faq-down" title="Move down" aria-label="Move down">&darr;</button>
        <button type="button" class="btn btn-outline-danger faq-remove" title="Remove" aria-label="Remove">&times;</button>
      </div>
    </div>
  </div>`;
}

function renderFaqs(faqs) {
  document.getElementById('faqList').innerHTML = faqs.map(faqRowHtml).join('');
}

function faqRows() {
  return Array.from(document.querySelectorAll('#faqList .faq-row')).map(row => ({
    question: row.querySelector('.faq-question').value,
    answer: row.querySelector('.faq-answer').value
  }));
}

// null when guided chat is off; otherwise what the chat needs.
function readChatbotSettings() {
  if (!document.getElementById('botEnabled').checked) return null;
  return {
    faqs: faqRows()
      .map(f => ({ question: f.question.trim(), answer: f.answer.trim() }))
      .filter(f => f.question),
    collectMessage: document.getElementById('botCollect').checked
  };
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      company: document.getElementById('companyName').value,
      phone: document.getElementById('phoneNumber').value,
      greeting: document.getElementById('greeting').value,
      outerMessage: document.getElementById('outerMessage').value,
      botEnabled: document.getElementById('botEnabled').checked,
      botCollect: document.getElementById('botCollect').checked,
      faqs: faqRows()
    }));
  } catch (e) {
    // Private browsing or storage turned off: settings just aren't remembered.
  }
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
  } catch (e) {
    return null;
  }
}

function regenerate() {
  document.getElementById('widgetForm').dispatchEvent(new Event('submit'));
}

let regenerateTimer = null;
function regenerateSoon() {
  clearTimeout(regenerateTimer);
  regenerateTimer = setTimeout(regenerate, 400);
}

function syncBotSettingsVisibility() {
  document.getElementById('botSettings').hidden = !document.getElementById('botEnabled').checked;
}

document.getElementById('botEnabled').addEventListener('change', () => { syncBotSettingsVisibility(); regenerate(); });
document.getElementById('botCollect').addEventListener('change', regenerate);
document.getElementById('addFaq').addEventListener('click', () => {
  document.getElementById('faqList').insertAdjacentHTML('beforeend', faqRowHtml({ question: '', answer: '' }));
  const rows = document.querySelectorAll('#faqList .faq-row');
  rows[rows.length - 1].querySelector('.faq-question').focus();
});
document.getElementById('faqList').addEventListener('input', regenerateSoon);
document.getElementById('faqList').addEventListener('click', (e) => {
  const row = e.target.closest('.faq-row');
  if (!row) return;
  if (e.target.closest('.faq-remove')) row.remove();
  else if (e.target.closest('.faq-up') && row.previousElementSibling) row.parentNode.insertBefore(row, row.previousElementSibling);
  else if (e.target.closest('.faq-down') && row.nextElementSibling) row.parentNode.insertBefore(row.nextElementSibling, row);
  else return;
  regenerate();
});

// The chat styles, for the live preview.
document.head.insertAdjacentHTML('beforeend', `<style>${chatbotCss}</style>`);

// initial state: what was saved in this browser, or sample values
const saved = loadSettings();
document.getElementById('companyName').value = (saved && saved.company) || 'Business/Brand Name';
document.getElementById('phoneNumber').value = (saved && saved.phone) || '+233 12 345 6789';
document.getElementById('greeting').value = (saved && saved.greeting) || 'How can we help you?';
document.getElementById('outerMessage').value = (saved && saved.outerMessage) || 'Need Help? Chat With Us.';
document.getElementById('botEnabled').checked = saved ? !!saved.botEnabled : true;
document.getElementById('botCollect').checked = saved ? saved.botCollect !== false : true;
renderFaqs(saved && saved.faqs && saved.faqs.length ? saved.faqs : SAMPLE_FAQS);
syncBotSettingsVisibility();

updatePreview(
  document.getElementById('companyName').value,
  sanitizePhone(document.getElementById('phoneNumber').value),
  document.getElementById('greeting').value,
  document.getElementById('outerMessage').value,
  logoDataUrl,
  readChatbotSettings());

document.getElementById('greeting').addEventListener('change', () => {
  document.getElementById('widgetForm').dispatchEvent(new Event('submit'));
});

document.getElementById('outerMessage').addEventListener('change', () => {
  document.getElementById('widgetForm').dispatchEvent(new Event('submit'));
});

document.getElementById('logoUpload').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      logoDataUrl = e.target.result;
      document.getElementById('widgetForm').dispatchEvent(new Event('submit'));
    };
    reader.readAsDataURL(file);
  }
});