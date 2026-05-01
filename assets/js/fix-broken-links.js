// 处理失效的双链：将 stale-link 替换为纯文本，并去除 "|" 后面的别名部分
document.addEventListener('DOMContentLoaded', function() {
    // 找到所有失效链接（class 为 stale-link）
    const staleLinks = document.querySelectorAll('a.stale-link');
    staleLinks.forEach(link => {
        // 获取链接的文本内容，例如 "AutoProv|AutoProv"
        let text = link.textContent;
        // 如果包含 "|"，只保留 "|" 前面的部分
        if (text.includes('|')) {
            text = text.split('|')[0];
        }
        // 创建 span 元素，保留文本，不加链接样式
        const span = document.createElement('span');
        span.textContent = text;
        span.className = 'broken-link';
        // 替换原来的 a 标签
        link.parentNode.replaceChild(span, link);
    });
});
