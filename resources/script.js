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

const widgetCss = `
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
`;

function buildHtmlCode(company, phoneDigits, greeting, outerMessage) {
  return `<!-- WhatsApp Widget (generated) -->
<div id="whatswidget-pre-wrapper">
  <div class="whatswidget-widget-wrapper">
    <div id="whatswidget-conversation" class="whatswidget-conversation" style="display:none;opacity:0;">
      <div class="whatswidget-conversation-header">
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

function buildReactCode(company, phoneDigits, greeting, outerMessage) {
  return `// 1. Download the widget package.
// 2. Place the 'resources' folder in your project's public/assets directory.
// 3. Adjust the image and CSS paths in this component if necessary.
// 4. Import and use the component in your app.

import React, { useState } from 'react';
import './resources/whatsapp-widget.css';

const WhatsAppWidget = ({ companyName, phoneNo, greeting, outerMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Use props or default values
  const finalCompanyName = companyName || "${escapeHtml(company)}";
  const finalPhoneNo = phoneNo || "${phoneDigits}";
  const finalGreeting = greeting || "${escapeHtml(greeting)}";
  const finalOuterMessage = outerMessage || "${escapeHtml(outerMessage)}";

  return (
    <div className="whatswidget-widget-wrapper">
      {isOpen && (
        <div className="whatswidget-conversation">
          <div className="whatswidget-conversation-header">
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

function buildVueCode(company, phoneDigits, greeting, outerMessage) {
  return `<template>
  <div class="whatswidget-widget-wrapper">
    <div v-if="isOpen" class="whatswidget-conversation">
      <div class="whatswidget-conversation-header">
        <div class="whatswidget-conversation-title text-white">{{ finalCompanyName }}</div>
      </div>
      <div class="whatswidget-conversation-message">{{ finalGreeting }}</div>
      <div class="whatswidget-conversation-cta">
        <a :href="`https://web.whatsapp.com/send?phone=\${finalPhoneNo}`" target="_blank" rel="noopener noreferrer" class="whatswidget-cta whatswidget-cta-desktop">Send message</a>
        <a :href="`https://wa.me/\${finalPhoneNo}`" target="_blank" rel="noopener noreferrer" class="whatswidget-cta whatswidget-cta-mobile">Send message</a>
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
  },
  data() {
    return {
      isOpen: false,
      finalCompanyName: this.companyName,
      finalPhoneNo: this.phoneNo,
      finalGreeting: this.greeting,
      finalOuterMessage: this.outerMessage,
    };
  },
};
<\/script>

<style scoped>
${widgetCss}
</style>
`;
}

function buildBlazorCode(company, phoneDigits, greeting, outerMessage) {
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
}

@*
CSS for WhatsAppWidget.razor.css:
${widgetCss}
*@
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
  return str.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// update preview (not by injecting the generated <script>, but by building interactive DOM)
function updatePreview(company, phoneDigits, greeting, outerMessage) {
  const root = document.getElementById('previewArea');
  root.innerHTML = `
    <div class="whatswidget-widget-wrapper" style="margin-bottom: -3rem">
      <div class="whatswidget-conversation" style="display:none;opacity:0;">
        <div class="whatswidget-conversation-header">
          <div class="whatswidget-conversation-title text-white">${escapeHtml(company)}</div>
        </div>
        <div class="whatswidget-conversation-message">${escapeHtml(greeting)}</div>
        <div class="whatswidget-conversation-cta">
          <a target="_blank" href="https://web.whatsapp.com/send?phone=${phoneDigits}" class="whatswidget-cta whatswidget-cta-desktop">Send message</a>
          <a target="_blank" href="https://wa.me/${phoneDigits}" class="whatswidget-cta whatswidget-cta-mobile">Send message</a>
        </div>
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

  root.addEventListener('click', (e) => {
    if (e.target.closest('.whatswidget-button') || e.target.closest('.whatswidget-conversation-message-outer')) {
      openChat();
    }
  });
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
    case 'blazor':
        code = buildBlazorCode(company, phoneDigits, greeting, outerMessage);
        language = 'razor';
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
    resources.file('whatsapp-widget.css', widgetCss);
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


// initial sample preview
updatePreview('Business/Brand Name', sanitizePhone('+233123456789'), 'How can we help you?', 'Need Help? Chat With Us.');
document.getElementById('companyName').value = 'Business/Brand Name';
document.getElementById('phoneNumber').value = '+233 12 345 6789';
document.getElementById('greeting').value = 'How can we help you?';
document.getElementById('outerMessage').value = 'Need Help? Chat With Us.';