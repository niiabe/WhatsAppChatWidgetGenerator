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

function buildHtmlCode(company, phoneDigits, greeting, outerMessage) {
  return `<!-- WhatsApp Widget (generated) -->
<div id="whatswidget-pre-wrapper">
  <div class="whatswidget-widget-wrapper">
    <div id="whatswidget-conversation" class="whatswidget-conversation" style="display:none;opacity:0;">
      <div class="whatswidget-conversation-header">
        <div id="whatswidget-conversation-title" class="whatswidget-conversation-title text-black">${escapeHtml(company)}</div>
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
    .whatswidget-widget-wrapper {
      font-family: Arial, Helvetica, sans-serif;
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
      padding: 10px 25px;
      box-shadow: 0px 1px #00000029;
      font-weight: 600;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
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

function buildReactCode(company, phoneDigits, greeting, outerMessage) {
  return `// React Component
import React, { useState } from 'react';
import './WhatsAppWidget.css';

const WhatsAppWidget = ({ companyName, phoneNo, greeting, outerMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="whatswidget-widget-wrapper">
      {isOpen && (
        <div className="whatswidget-conversation">
          <div className="whatswidget-conversation-header">
            <div className="whatswidget-conversation-title text-black">{companyName}</div>
          </div>
          <div className="whatswidget-conversation-message">{greeting}</div>
          <div className="whatswidget-conversation-cta">
            <a href={\`https://web.whatsapp.com/send?phone=${phoneDigits}\`} target="_blank" rel="noopener noreferrer" className="whatswidget-cta whatswidget-cta-desktop">Send message</a>
            <a href={\`https://wa.me/${phoneDigits}\`} target="_blank" rel="noopener noreferrer" className="whatswidget-cta whatswidget-cta-mobile">Send message</a>
          </div>
        </div>
      )}
      {!isOpen && (
        <div className="whatswidget-conversation-message-outer" onClick={() => setIsOpen(true)}>
          <span className="whatswidget-text-header-outer">{companyName}</span><br />
          <div className="whatswidget-text-message-outer">{outerMessage}</div>
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
`;
}

function buildVueCode(company, phoneDigits, greeting, outerMessage) {
  return `<template>
  <div class="whatswidget-widget-wrapper">
    <div v-if="isOpen" class="whatswidget-conversation">
      <div class="whatswidget-conversation-header">
        <div class="whatswidget-conversation-title text-black">{{ companyName }}</div>
      </div>
      <div class="whatswidget-conversation-message">{{ greeting }}</div>
      <div class="whatswidget-conversation-cta">
        <a :href="\`https://web.whatsapp.com/send?phone=${phoneDigits}\`" target="_blank" rel="noopener noreferrer" class="whatswidget-cta whatswidget-cta-desktop">Send message</a>
        <a :href="\`https://wa.me/${phoneDigits}\`" target="_blank" rel="noopener noreferrer" class="whatswidget-cta whatswidget-cta-mobile">Send message</a>
      </div>
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
export default {
  props: {
    companyName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    greeting: {
      type: String,
      default: 'How can we help you?',
    },
    outerMessage: {
      type: String,
      default: 'Need Help? Chat With Us.',
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
};
<\/script>

<style scoped>
/* Add the CSS from style.css here */
</style>
`;
}

// small helper to avoid raw HTML injection into generated preview text
function escapeHtml(str) {
  if (!str) return '';
  var map = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// update preview (not by injecting the generated <script>, but by building interactive DOM)
 // update preview (not by injecting the generated <script>, but by building interactive DOM)
  function updatePreview(company, phoneDigits, greeting, outerMessage) {
    const root = document.getElementById('previewArea');
    root.innerHTML = '';

    // wrapper
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.height = '160px';
    wrapper.style.overflow = 'hidden';

    // create the small bubble area (outer message)
    const outer = document.createElement('div');
    outer.className = 'whatswidget-conversation-message-outer preview-outer';
    outer.style.position = 'absolute';
    outer.style.right = '15px';
    outer.style.bottom = '60px';
    outer.style.width = '210px';
    outer.style.background = '#25D366';
    outer.style.color = 'white';
    outer.style.padding = '8px';
    outer.style.borderRadius = '6px';
    outer.style.boxShadow = '0 2px 10px rgba(0,0,0,.2)';
    outer.style.cursor = 'pointer';
    outer.innerHTML = `<strong style="display:block">${escapeHtml(company)}</strong><div style="font-size:.9em">${escapeHtml(outerMessage)}</div>`;

    // create the large chat panel (hidden by default)
    const convo = document.createElement('div');
    convo.className = 'preview-conversation';
    convo.style.display = 'none';
    convo.style.position = 'absolute';
    convo.style.right = '15px';
    convo.style.bottom = '60px';
    convo.style.width = '240px';
    convo.style.height = '240px';
    convo.style.borderRadius = '10px';
    convo.style.background = '#e4dcd4';
    convo.style.boxShadow = '0 5px 30px rgba(0,0,0,.15)';
    convo.innerHTML = `
      <div style="background:#25D366;color:#fff;padding:10px;border-top-left-radius:10px;border-top-right-radius:10px;font-weight:600">
        ${escapeHtml(company)}
      </div>
      <div style="padding:12px;color:#fff;background:#25D366;margin:10px;border-radius:6px;">
        ${escapeHtml(greeting)}
      </div>
      <div style="position:absolute; left:10%; top:60%; width:75%; transform:translateY(-10%);">
        <a href="https://wa.me/${phoneDigits}" target="_blank" style="display:block;text-align:center;background:#23b123;color:#fff;padding:10px;border-radius:25px;text-decoration:none;font-weight:700">Send message</a>
      </div>
    `;

    // create floating button
    const btn = document.createElement('div');
    btn.className = 'preview-btn';
    btn.style.position = 'absolute';
    btn.style.right = '15px';
    btn.style.bottom = '15px';
    btn.style.width = '60px';
    btn.style.height = '60px';
    btn.style.borderRadius = '50%';
    btn.style.background = '#31d831';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
    btn.style.cursor = 'pointer';

    const img = document.createElement('img');
    img.src = 'resources/wpwhite.png';
    img.alt = 'W';
    img.style.width = '36px';
    img.style.height = '36px';
    btn.appendChild(img);

    // toggle logic
    btn.addEventListener('click', () => {
      if (convo.style.display === 'none') {
        convo.style.display = 'block';
        outer.style.display = 'none';
      } else {
        convo.style.display = 'none';
        outer.style.display = 'block';
      }
    });
    outer.addEventListener('click', () => {
      convo.style.display = 'block';
      outer.style.display = 'none';
    });

    wrapper.appendChild(convo);
    wrapper.appendChild(outer);
    wrapper.appendChild(btn);
    root.appendChild(wrapper);
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

    const code = buildWidgetCode(company, phoneDigits, greeting, outerMessage);
    document.getElementById('generated').textContent = code;

    // update preview
    updatePreview(company, phoneDigits, greeting, outerMessage);
  });

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

  const framework = document.querySelector('#framework-dropdown').textContent.trim().toLowerCase();
  let code = '';
  let language = 'html';

  switch (framework) {
    case 'react':
      code = buildReactCode(company, phoneDigits, greeting, outerMessage);
      language = 'jsx';
      break;
    case 'vue':
      code = buildVueCode(company, phoneDigits, greeting, outerMessage);
      language = 'html';
      break;
    case 'next.js':
      code = buildReactCode(company, phoneDigits, greeting, outerMessage);
      language = 'jsx';
      break;
    case 'vite':
      code = buildReactCode(company, phoneDigits, greeting, outerMessage);
      language = 'jsx';
      break;
    default:
      code = buildHtmlCode(company, phoneDigits, greeting, outerMessage);
      language = 'html';
  }

  const generatedCode = document.getElementById('generated-code');
  generatedCode.textContent = code;
  generatedCode.className = `language-${language}`;

  // update preview
  updatePreview(company, phoneDigits, greeting, outerMessage);

  // highlight all
  hljs.highlightAll();
});

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const framework = this.dataset.framework;
    document.getElementById('framework-dropdown').textContent = this.textContent;
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

// download as html
document.getElementById('downloadBtn').addEventListener('click', function () {
  const code = document.getElementById('generated-code').textContent;
  if (!code) { alert('Generate code first'); return; }
  const fullHtml = `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>WhatsApp Widget</title>\n</head>\n<body>\n${code}\n</body>\n</html>`;
  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'whatsapp-widget.html';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 100);
});


// initial sample preview
updatePreview('Company/Website Name', sanitizePhone('+233123456789'), 'How can we help you?', 'Need Help? Chat With Us.');
document.getElementById('companyName').value = 'Company/Website Name';
document.getElementById('phoneNumber').value = '+233 12 345 6789';
document.getElementById('greeting').value = 'How can we help you?';
document.getElementById('outerMessage').value = 'Need Help? Chat With Us.';