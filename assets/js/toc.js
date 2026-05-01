// 生成浮动目录并实现滚动高亮
(function() {
  // 避免在主页、笔记列表页等非文章页运行
  if (!document.querySelector('.container')) return;

  // 找到文章主体区域（排除导航、页脚、backlinks 等）
  // 策略：获取所有 h2, h3, h4，但排除位于 nav, footer, .backlinks, .callout 内的标题
  const container = document.querySelector('.container');
  if (!container) return;

  // 获取所有标题（h2, h3, h4）
  const headings = Array.from(container.querySelectorAll('h2, h3, h4')).filter(heading => {
    // 排除位于导航、页脚、反向链接、callout 内的标题
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

  // 构建目录 HTML（嵌套结构）
  const tocDiv = document.createElement('nav');
  tocDiv.id = 'toc';
  tocDiv.className = 'floating-toc';
  tocDiv.setAttribute('aria-label', 'Table of Contents');

  // 生成树状结构
  function buildToc(items) {
    const stack = [];
    const root = { children: [] };
    let current = root;
    
    items.forEach(item => {
      const level = parseInt(item.tagName[1]); // 2,3,4
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
      a.textContent = item.element.textContent;
      // 如果标题没有 id，自动添加一个
      if (!item.element.id) {
        item.element.id = `heading-${Date.now()}-${Math.random()}`;
      }
      a.addEventListener('click', (e) => {
        e.preventDefault();
        item.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 更新 URL hash（可选）
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

  const tocTree = buildToc(headings);
  const tocUl = document.createElement('ul');
  renderList(tocTree, tocUl);
  tocDiv.appendChild(tocUl);
  document.body.appendChild(tocDiv);

  // 滚动高亮当前可见标题
  function updateActiveLink() {
    const scrollPos = window.scrollY + 100; // 偏移量
    let activeHeading = null;
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      if (heading.offsetTop <= scrollPos) {
        activeHeading = heading;
        break;
      }
    }
    // 移除所有 active
    tocDiv.querySelectorAll('a').forEach(a => a.classList.remove('active'));
    if (activeHeading) {
      const activeLink = tocDiv.querySelector(`a[href="#${activeHeading.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();
})();
