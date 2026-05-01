document.addEventListener('DOMContentLoaded', function() {
  function convertCallouts() {
    const blockquotes = document.querySelectorAll('blockquote');
    blockquotes.forEach(blockquote => {
      const firstPara = blockquote.querySelector('p:first-child');
      if (!firstPara) return;
      const text = firstPara.innerText;
      const match = text.match(/^\[!(\w+)\]\s*(.*)/);
      if (!match) return;
      const type = match[1].toLowerCase();
      let combined = match[2]; // 可能包含分隔符和正文
      let title = '';
      let body = '';
      
      // 检查是否有分隔符 【【【
      const separator = '【【【';
      const sepIndex = combined.indexOf(separator);
      if (sepIndex !== -1) {
        title = combined.substring(0, sepIndex).trim();
        body = combined.substring(sepIndex + separator.length).trim();
      } else {
        // 向后兼容：没有分隔符时，将整个作为标题（原有行为）
        title = combined.trim();
        body = '';
      }
      
      if (title === '') {
        const typeMap = { note: 'Note', tip: 'Tip', warning: 'Warning', danger: 'Danger' };
        title = typeMap[type] || type.toUpperCase();
      }
      
      // 构建新结构
      const calloutDiv = document.createElement('div');
      calloutDiv.className = `callout callout-${type}`;
      const titleDiv = document.createElement('div');
      titleDiv.className = 'callout-title';
      titleDiv.innerText = title;
      const contentDiv = document.createElement('div');
      contentDiv.className = 'callout-content';
      
      // 如果有从第一个段落提取的正文内容，添加为段落
      if (body) {
        const bodyPara = document.createElement('p');
        bodyPara.innerText = body;
        contentDiv.appendChild(bodyPara);
      }
      
      // 复制原 blockquote 中除第一个段落外的其他子节点
      const children = Array.from(blockquote.childNodes);
      children.forEach(child => {
        if (child !== firstPara) {
          contentDiv.appendChild(child.cloneNode(true));
        }
      });
      
      calloutDiv.appendChild(titleDiv);
      calloutDiv.appendChild(contentDiv);
      blockquote.parentNode.replaceChild(calloutDiv, blockquote);
    });
  }
  convertCallouts();
  // 监听页面变化（SPA）
  const observer = new MutationObserver(() => convertCallouts());
  observer.observe(document.getElementById('book') || document.body, { childList: true, subtree: true });
});
