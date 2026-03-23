const myData = {
  "Legal first name": "Bonde Bo Lin",
  "Preferred first name": "Bonde Bo Lin",
  "Legal last name": "Zhang",
  "Email": "bondezhang66@gmail.com",
  "Email confirmation": "bondezhang66@gmail.com",
  "Phone": "6044018229",
  "LinkedIn profile URL": "www.linkedin.com/in/bonde-zhang",
  "Current or most recent employer": "Quantitative Risk Intern",
  "Major / Field of study": "Mathematics",
  "Your primary college/university/school email": "bzhang65@student.ubc.ca",
  "Why you're interested": "I’m particularly interested in Jane Street because of its strong emphasis on problem-solving, collaboration, and intellectual curiosity. I enjoy tackling challenging quantitative problems, and I’m drawn to environments where decisions are driven by data and clear reasoning. Currently, I am a student at UBC studying mathematics, and I’m actively looking for opportunities to apply my analytical and programming skills in a real-world setting."
};

// 模拟人类输入，这是突破 Workday/React 框架拦截的关键
function simulateTyping(element, value) {
  element.focus();
  element.value = value;
  // 触发一系列事件，骗过前端框架
  const events = ['input', 'change', 'blur'];
  events.forEach(eventType => {
    const event = new Event(eventType, { bubbles: true });
    element.dispatchEvent(event);
  });
}

function processNode(node) {
  // 1. 寻找输入框
  const inputs = node.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    // 获取输入框周围的文本（Label）
    const containerText = input.closest('div')?.innerText || "";
    const ariaLabel = input.getAttribute('aria-label') || "";
    const combinedText = (containerText + " " + ariaLabel).toLowerCase();

    for (let key in myData) {
      if (combinedText.includes(key.toLowerCase())) {
        simulateTyping(input, myData[key]);
      }
    }
  });

  // 2. 递归处理 iframe (Jane Street 经常把表单放在 iframe 里)
  const iframes = node.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      if (iframe.contentDocument) {
        processNode(iframe.contentDocument);
      }
    } catch (e) {
      console.log("跨域 iframe 无法访问，请确保在官方申请域名下使用");
    }
  });

  // 3. 递归处理 Shadow DOM
  const allElements = node.querySelectorAll('*');
  allElements.forEach(el => {
    if (el.shadowRoot) {
      processNode(el.shadowRoot);
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    processNode(document);
    // 特殊处理：he/him/his 勾选框
    const labels = document.querySelectorAll('label');
    labels.forEach(l => {
      if (l.innerText.includes('he/him/his')) l.click();
    });
    sendResponse({status: "Success"});
  }
});
