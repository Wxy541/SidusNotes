#!/bin/bash
# 在所有 .md 文件中，找到 callout 标题行（以 '> [!xxx]' 开头）
# 在行尾追加特殊分隔符 【【【 （如果还未追加）
find . -name "*.md" -not -path "./.git/*" -not -path "./_site/*" | while read file; do
  # 使用 sed 追加分隔符：匹配以 '> [!xxx]' 开头的行，且该行末尾不包含 【【【（避免重复追加）
  sed -i '/^> \[!.*\]/{
    /【【【/! s/$/【【【/
  }' "$file"
done
