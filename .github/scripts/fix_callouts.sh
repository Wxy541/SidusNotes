#!/bin/bash
# 在所有 .md 文件中，将连续的 callout 标题行（以 '> [!note]' 开头）和紧随的正文引用行（以 '> ' 开头但不是 '[!note]'）之间插入一个空行

find . -name "*.md" -not -path "./.git/*" -not -path "./_site/*" | while read file; do
  # 使用 awk 处理：当遇到匹配 /^> \[!.*\]/ 的行时，记下；下一行如果是 /^> [^[]/（即不是以 '> [!'] 开头），则在这两行之间输出一个空行
  awk '
    /^> \[!.*\]/ { 
      print $0
      getline nextline
      if (nextline ~ /^> [^[]/ && nextline !~ /^> \[!.*\]/) {
        print ""
        print nextline
      } else {
        print nextline
      }
      next
    }
    { print }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
done
