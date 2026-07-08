# Regenerates src/lib/pdfFonts.js — the brand fonts embedded in the client-side
# PDF. Subsets each @fontsource woff2 to Latin + the symbols the PDF uses, prunes
# the cmap to the Windows (3,1) format-4 subtable, and saves raw TTF (jsPDF's
# browser build needs both). Run from the project root after `npm install`:
#   pip install fonttools brotli && python3 scripts/gen-pdf-fonts.py
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options
import os, base64
FS="node_modules/@fontsource"
jobs=[
 (f"{FS}/dm-sans/files/dm-sans-latin-300-normal.woff2","DMSans-300","DMSans","light"),
 (f"{FS}/dm-sans/files/dm-sans-latin-400-normal.woff2","DMSans-400","DMSans","normal"),
 (f"{FS}/dm-sans/files/dm-sans-latin-500-normal.woff2","DMSans-500","DMSans","bold"),
 (f"{FS}/playfair-display/files/playfair-display-latin-700-normal.woff2","Playfair-700","Playfair","bold"),
 (f"{FS}/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2","JetBrainsMono-400","JetBrainsMono","normal"),
]
os.makedirs("/tmp/ttf", exist_ok=True)
extra="₂→·—×÷≥≤%°£€–’“”"
uni=list(range(0x20,0x7F))+[ord(c) for c in extra]
lines=["// Auto-generated: subsetted brand fonts (Latin + PDF symbols) as base64",
       "// for embedding in the client-side PDF via jsPDF. cmap pruned to Windows",
       "// (3,1) format 4 only, which the jsPDF browser build requires. Do not edit.",
       "","export const PDF_FONTS = ["]
for src,fname,family,style in jobs:
    t=TTFont(src); o=Options(); o.flavor=None; o.notdef_outline=True; o.recalc_bounds=True
    ss=Subsetter(options=o); ss.populate(unicodes=uni); ss.subset(t)
    # Keep only the Windows Unicode BMP (3,1) format-4 cmap subtable.
    cm=t['cmap']; cm.tables=[s for s in cm.tables if s.platformID==3 and s.platEncID==1 and s.format==4]
    assert cm.tables, f"no (3,1,4) cmap in {fname}"
    t.flavor = None  # force raw TTF (not woff2) for jsPDF
    t.save(f"/tmp/ttf/{fname}.ttf")
    b64=base64.b64encode(open(f"/tmp/ttf/{fname}.ttf",'rb').read()).decode()
    lines.append(f"  {{ vfs: {fname+'.ttf'!r}, family: {family!r}, style: {style!r}, data: {b64!r} }},")
    print(fname, [(s.platformID,s.platEncID,s.format) for s in cm.tables])
lines.append("]")
open("src/lib/pdfFonts.js","w").write("\n".join(lines)+"\n")
print("module KB:", round(os.path.getsize('src/lib/pdfFonts.js')/1024))
