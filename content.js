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
  "Why you're interested": "I’m particularly interested in Jane Street because of its strong emphasis on problem-solving, collaboration, and intellectual curiosity..."
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    // 使用深度搜索逻辑
    fillDeep(document);
    alert("尝试深度填充完成！如果仍有空缺，请手动微调。");
    sendResponse({status: "done"});
  }
});

function fillDeep(root) {
  // 1. 填充常规输入框和文本域
  const inputs = root.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    const labelText = getLabelText(input);
    for (let key in myData) {
      if (labelText.includes(key)) {
        input.value = myData[key];
        // 触发所有可能的事件确保系统监听到输入
        ['input', 'change', 'blur'].forEach(ev => {
          input.dispatchEvent(new Event(ev, { bubbles: true }));
        });
      }
    }
  });

  // 2. 穿透 Shadow DOM (关键：解决“没反应”的问题)
  const allElements = root.querySelectorAll('*');
  allElements.forEach(el => {
    if (el.shadowRoot) {
      fillDeep(el.shadowRoot);
    }
  });
}

function getLabelText(input) {
  // 查找 input 周边的文字标签
  let text = "";
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) text = label.innerText;
  }
  if (!text) {
    text = input.closest('div')?.innerText || "";
  }
  return text;
}
