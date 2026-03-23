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
  "Why you're interested": "I’m particularly interested in Jane Street because of its strong emphasis on problem-solving, collaboration, and intellectual curiosity. I enjoy tackling challenging quantitative problems, and I’m drawn to environments where decisions are driven by data and clear reasoning..."
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    fillJaneStreetForm();
    sendResponse({status: "done"});
  }
});

function fillJaneStreetForm() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
  
  inputs.forEach(input => {
    // 寻找输入框上方的 Label 文字
    const label = findLabelForInput(input);
    if (!label) return;

    for (let key in myData) {
      if (label.innerText.includes(key)) {
        input.value = myData[key];
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });

  // 处理勾选框 (Pronouns: he/him/his)
  const pronouns = Array.from(document.querySelectorAll('label')).find(el => el.innerText.includes('he/him/his'));
  if (pronouns) pronouns.click();

  alert("基本信息、教育背景和个人陈述已填充完毕！请检查下拉菜单及简历上传。");
}

function findLabelForInput(input) {
  // 向上查找容器，再向下寻找包含文字的 label 或 div
  let container = input.parentElement;
  for (let i = 0; i < 3; i++) {
    if (!container) break;
    const label = container.querySelector('label') || container.previousElementSibling;
    if (label && label.innerText.length > 1) return label;
    container = container.parentElement;
  }
  return null;
}
