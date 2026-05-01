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
      let title = match[2].trim();
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
  // 如果你的主题有 SPA 页面切换，需要监听变化（例如使用 MutationObserver）
  const observer = new MutationObserver(() => convertCallouts());
  observer.observe(document.getElementById('book') || document.body, { childList: true, subtree: true });
});
