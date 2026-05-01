// 生成浮动目录并实现滚动高亮（兼容双链清洗后的文本）
(function() {
  if (!document.querySelector('.container')) return;

  // 清洗标题文本：去除 [[xxx|yyy]] 中的别名部分，去除 [[xxx]] 的括号
  function cleanHeadingText(text) {
    // 处理 [[link|alias]] -> alias，或者 [[link]] -> link
    let cleaned = text.replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (match, link, _, alias) => {
      return alias ? alias : link;
    });
    // 如果还存在多余的 | 分隔符（比如手动写的但没被处理），保留第一部分
    if (cleaned.includes('|')) {
      cleaned = cleaned.split('|')[0];
    }
    return cleaned.trim();
  }

  const container = document.querySelector('.container');
  if (!container) return;

  // 获取所有标题（h2, h3, h4），排除导航、页脚、callout 等区域内的
  const headings = Array.from(container.querySelectorAll('h2, h3, h4')).filter(heading => {
    let parent = heading.parentElement;
    while (parent && parent !== container) {
      if (parent.tagName === 'NAV' || parent.classList.contains('backlinks') ||
          parent.classList.contains('callout') || parent.id === 'toc' ||
          parent.classList.contains('footer') || parent.classList.contains('nav')) {
        return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });

  if (headings.length === 0) return;

  // 为没有 id 的标题自动生成 id
  headings.forEach(heading => {
    if (!heading.id) {
      let baseId = heading.textContent.trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
      heading.id = baseId + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
  });

  // 构建嵌套目录结构
  function buildToc(items) {
    const stack = [];
    const root = { children: [] };
    let current = root;
    items.forEach(item => {
      const level = parseInt(item.tagName[1]);
      const li = { level, element: item, children: [] };
      while (current.level && current.level >= level) {
        current = stack.pop();
      }
      if (!current.children) current.children = [];
      current.children.push(li);
      stack.push(current);
      current = li;
    });
    return root.children;
  }

  function renderList(items, ul) {
    items.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${item.element.id}`;
      // 提取清洗后的文本
      a.textContent = cleanHeadingText(item.element.textContent);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        item.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, `#${item.element.id}`);
      });
      li.appendChild(a);
      if (item.children.length) {
        const subUl = document.createElement('ul');
        renderList(item.children, subUl);
        li.appendChild(subUl);
      }
      ul.appendChild(li);
    });
  }

  const tocDiv = document.createElement('nav');
  tocDiv.id = 'toc';
  tocDiv.className = 'floating-toc';
  tocDiv.setAttribute('aria-label', 'Table of Contents');

  const tocTree = buildToc(headings);
  const tocUl = document.createElement('ul');
  renderList(tocTree, tocUl);
  tocDiv.appendChild(tocUl);
  document.body.appendChild(tocDiv);

  // 滚动高亮当前可见标题
  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;
    let activeHeading = null;
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      if (heading.offsetTop <= scrollPos) {
        activeHeading = heading;
        break;
      }
    }
    const allLinks = tocDiv.querySelectorAll('a');
    allLinks.forEach(link => link.classList.remove('active'));
    if (activeHeading) {
      const activeLink = tocDiv.querySelector(`a[href="#${activeHeading.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();
})();
