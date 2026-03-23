#!/usr/bin/env python3
"""Fix unescaped Italian apostrophes in JS single-quoted string values."""
import re, os

path = os.path.join(os.path.dirname(__file__), '../js/data/spells-list.js')
content = open(path).read()

# Header comment (first ~200 chars) should be left unmodified
header = content[:200]
body = content[200:]

# Pattern: letter immediately followed by ' then another letter/space (Italian elision)
# NOT already escaped (not preceded by backslash)
# We need to escape these with \'
pattern = r"(?<!\\)(?<=[a-zA-Zàèéìòùçù])'(?=[a-zA-Zàèéìòùç])"

fixed_body = re.sub(pattern, "\\\\'", body)

result = header + fixed_body
open(path, 'w').write(result)

# Count remaining issues
remaining = re.findall(pattern, fixed_body)
print(f"Remaining unescaped apostrophes in body: {len(remaining)}")
print("Done — file written.")
