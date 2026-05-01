// 自动转换 Obsidian Callout 为带样式的块
document.addEventListener('DOMContentLoaded', function() {
  // 找到所有 blockquote 元素
  const blockquotes = document.querySelectorAll('blockquote');
  
  blockquotes.forEach(blockquote => {
    // 获取第一个段落的内容
    const firstPara = blockquote.querySelector('p:first-child');
    if (!firstPara) return;
    
    const text = firstPara.innerText;
    // 匹配 [!note]、[!tip]、[!warning]、[!danger] 等
    const match = text.match(/^\[!(\w+)\]\s*(.*)/);
    if (!match) return;
    
    const type = match[1].toLowerCase();
    let title = match[2].trim();
    if (title === '') {
      const titles = { note: 'Note', tip: 'Tip', warning: 'Warning', danger: 'Danger' };
      title = titles[type] || type.toUpperCase();
    }
    
    // 给 blockquote 添加对应的类名，用于 CSS 样式
    blockquote.classList.add('callout', `callout-${type}`);
    
    // 修改第一个段落的内容：移除 [!xxx] 标记，保留标题
    // 找到第一个段落中的文本节点，只删除开头的 "[!note] " 部分
    const newNode = document.createElement('p');
    newNode.innerHTML = `<strong>${escapeHtml(title)}</strong>`;
    // 保留原来的其余内容（标题后面的文本？实际上标题后面可能还有内容，但这里简单处理）
    // 更严谨：将原段落内容分成两部分：标记部分和剩余内容
    const remainingText = text.replace(/^\[!\w+\]\s*/, '');
    if (remainingText && remainingText !== title) {
      // 如果剩余内容不为空且不等于标题，则加到 strong 后面
      newNode.appendChild(document.createTextNode(' ' + remainingText));
    }
    firstPara.parentNode.replaceChild(newNode, firstPara);
  });
  
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }
});
