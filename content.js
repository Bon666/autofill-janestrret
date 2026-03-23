const myData = {
  "first name": "Bonde Bo Lin",
  "last name": "Zhang",
  "preferred name": "Bonde Bo Lin",
  "email": "bondezhang66@gmail.com",
  "phone": "6044018229",
  "linkedin": "https://www.linkedin.com/in/bonde-zhang",
  "employer": "Quantitative Risk Intern",
  "university": "University of British Columbia",
  "major": "Mathematics",
  "school email": "bzhang65@student.ubc.ca",
  "degree": "Undergraduate",
  "interest": "I’m particularly interested in Jane Street because of its strong emphasis on problem-solving, collaboration, and intellectual curiosity."
};

function forceFill() {
  // 获取当前文档（包括可能存在的 iframe 内部文档）
  const allInputs = document.querySelectorAll('input, textarea, [contenteditable="true"]');
  
  allInputs.forEach(input => {
    // 获取输入框周围的文字提示
    const outerText = (input.closest('div')?.innerText || "").toLowerCase();
    const placeholder = (input.placeholder || "").toLowerCase();
    const label = (document.querySelector(`label[for="${input.id}"]`)?.innerText || "").toLowerCase();
    const context = outerText + placeholder + label;

    for (let key in myData) {
      if (context.includes(key)) {
        // 强制赋值
        input.value = myData[key];
        if (input.contentEditable === "true") input.innerText = myData[key];

        // 触发所有能想到的事件，确保网页 JS 框架能抓到数据
        ['click', 'focus', 'input', 'change', 'blur'].forEach(type => {
          input.dispatchEvent(new Event(type, { bubbles: true }));
        });
      }
    }
  });

  // 自动勾选代词 (he/him/his)
  document.querySelectorAll('label, span').forEach(el => {
    if (el.innerText.toLowerCase().includes("he/him/his")) {
      el.click();
    }
  });
}

// 监听来自 popup 的点击
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "fillForm") {
    forceFill();
    // 针对延迟加载的情况，1秒后再跑一次
    setTimeout(forceFill, 1000);
  }
});
