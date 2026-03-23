#!/usr/bin/env python3
"""Fix wrongly-escaped apostrophes in spells-list.js.

The previous fix_apostrophes.py run created 'bad' sequences like:
  dell'\'Orso  (apostrophe + backslash + apostrophe)
when the correct form for JS single-quoted strings is:
  dell\'Orso   (just backslash + apostrophe)

This script:
1. Replaces all '\'' sequences with just '\''  (removes the extra leading apostrophe)
2. Fixes any remaining unescaped apostrophes (letter'letter -> letter\'letter)
3. Validates no more issues remain
"""
import re, os

path = os.path.join(os.path.dirname(__file__), '../js/data/spells-list.js')
content = open(path).read()

# Step 1: Fix the wrong '\'' -> '\''  patterns
# In file: character sequence is: apostrophe, backslash, apostrophe (3 chars)
# We want: just backslash, apostrophe (2 chars)
# Python strings: bad = chr(39) + chr(92) + chr(39) = "'\'", good = chr(92) + chr(39) = "\'"
bad_pattern = chr(39) + chr(92) + chr(39)   # = '\'  (apostrophe + backslash + apostrophe)
good_escape = chr(92) + chr(39)             # = \'   (backslash + apostrophe)

content_fixed = content.replace(bad_pattern, good_escape)
count_fixed = content.count(bad_pattern)
print(f"Step 1: fixed {count_fixed} wrong apostrophe escapes")

# Step 2: Fix any remaining truly unescaped apostrophes (letter'letter in JS string values)
# These are apostrophes inside JS string values that are:
# - preceded by a word char
# - followed by a word char
# - NOT already preceded by backslash
# Skip the first 200 chars (comment header)
header = content_fixed[:200]
body = content_fixed[200:]

def fix_apos(m):
    # m.group(0) is just the apostrophe (lookbehind/lookahead don't consume chars)
    return good_escape  # replace ' with \'

pattern = r"(?<!\\)(?<=[a-zA-Zàèéìòùç])'(?=[a-zA-Zàèéìòùç])"
body_fixed, remaining_count = re.subn(pattern, fix_apos, body)
print(f"Step 2: fixed {remaining_count} additional unescaped apostrophes")

result = header + body_fixed
open(path, 'w').write(result)

# Verify
final_content = open(path).read()
bad_remaining = final_content[200:].count(bad_pattern)
print(f"Remaining bad '\\'' patterns: {bad_remaining}")
print("Done.")
