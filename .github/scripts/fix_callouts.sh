#!/bin/bash
echo "Fixing callout formatting: inserting '>' line between title and body..."
find . -name "*.md" -not -path "./.git/*" -not -path "./_site/*" -exec sed -i '/^> \[!.*\]$/{ N; s/\n\(> [^[]\)/\n>\n\1/; }' {} \;
echo "Done."
