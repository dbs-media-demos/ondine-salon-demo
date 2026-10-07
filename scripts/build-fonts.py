"""Ondine: Playfair Display web fonts, OG TTFs, and traced logo/masthead paths."""
# Source TTFs: google/fonts ofl/playfairdisplay (PlayfairDisplay[wght].ttf + Italic). Set FONTS to where they live.
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONTS = Path(r"C:/Users/User/AppData/Local/Temp/claude/C--Dimitrije-Posao-Sevido/c06ac6d6-ad52-4222-976e-2a7711c8f089/scratchpad/fonts")
SITE = Path(r"C:/Dimitrije/Posao/Sevido/DBS Media Portfolio/Demo Websites/salon")
ROMAN, ITALIC = FONTS / "PlayfairDisplay[wght].ttf", FONTS / "PlayfairDisplay-Italic[wght].ttf"

def inst(src, wght):
    f = TTFont(src)
    instancer.instantiateVariableFont(f, {"wght": wght}, inplace=True, updateFontNames=True)
    return f

EXTRA = "00A0 00A9 00AB 00B0 00B7 00BB 00D7 00E0 00E1 00E4 00E7 00E8 00E9 00ED 00F3 00F6 00FA 00FC 0106 0107 010C 010D 0110 0111 0160 0161 017D 017E 2013 2014 2018 2019 201A 201C 201D 201E 2022 2026 2190 2192 20AC"
UNICODES = list(range(0x20, 0x7F)) + [int(u, 16) for u in EXTRA.split()]

def subset_font(font, out, flavor):
    opts = subset.Options()
    opts.flavor = flavor
    opts.layout_features = ["kern", "liga", "ccmp", "locl", "lnum", "pnum", "tnum", "onum", "mark", "mkmk"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    s = subset.Subsetter(opts)
    s.populate(unicodes=UNICODES)
    s.subset(font)
    font.flavor = flavor
    font.save(out)
    print(out.name, out.stat().st_size)

# Web: static 500 roman + italic. OG (Satori needs static TTF): 500 roman, 400 italic.
subset_font(inst(ROMAN, 500), SITE / "src/app/fonts/playfair-display-500.woff2", "woff2")
subset_font(inst(ITALIC, 500), SITE / "src/app/fonts/playfair-display-italic-500.woff2", "woff2")
subset_font(inst(ROMAN, 500), SITE / "src/assets/fonts/PlayfairDisplay-500.ttf", None)
subset_font(inst(ITALIC, 400), SITE / "src/assets/fonts/PlayfairDisplay-Italic-400.ttf", None)

CAP = 1500  # caps are traced at cap height 1500, y flipped (0 = cap line)

def trace(text, wght, tracking):
    """Trace caps at cap height CAP, y down, with the first glyph's ink starting at x=0."""
    f = inst(ROMAN, wght)
    gs, cmap, hmtx = f.getGlyphSet(), f.getBestCmap(), f["hmtx"]
    k = CAP / f["OS/2"].sCapHeight
    bp = BoundsPen(gs); gs[cmap[ord(text[0])]].draw(bp)
    x, parts, boxes = -bp.bounds[0] * k, [], []
    for ch in text:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs, ntos=lambda v: str(round(v)))
        gs[g].draw(TransformPen(pen, (k, 0, 0, -k, x, CAP)))
        bp = BoundsPen(gs); gs[g].draw(bp)
        xmin, ymin, xmax, ymax = bp.bounds
        boxes.append((x + xmin * k, CAP - ymax * k, x + xmax * k, CAP - ymin * k))
        parts.append(pen.getCommands())
        x += hmtx[g][0] * k + tracking
    return parts, boxes

# Logo: O + NDINE, wght 600 so it holds up at header size.
parts, boxes = trace("ONDINE", 600, 210)
o_w = round(boxes[0][2])
logo_w = round(boxes[-1][2])
wave_k = o_w / 1482
wave = "M{} 830 C {} 610, {} 610, {} 760 S {} 915, {} 690".format(*[round(v * wave_k) for v in (-170, 140, 450, 729, 1320, 1630)])
(SITE / "src/components/brand/logo-paths.ts").write_text(f'''// Generated from Playfair Display (wght 600). Units: cap height 1500, y down.
export const LOGO = {{
  /** Serif "O" — the mark. Box: x 0..{o_w}, y {round(boxes[0][1])}..{round(boxes[0][3])}. */
  o: "{parts[0]}",
  oWidth: {o_w},
  /** Hairline wave that crosses the O (stroked). */
  wave: "{wave}",
  /** N D I N E, already positioned after the O. */
  rest: "{' '.join(parts[1:])}",
  width: {logo_w},
}} as const;
''', encoding="utf-8")
print("logo", o_w, logo_w, boxes)

# Masthead: heavy cut, tight.
parts, boxes = trace("ONDINE", 900, 20)
top = round(min(b[1] for b in boxes)); bottom = round(max(b[3] for b in boxes))
i_box = boxes[3]
(SITE / "src/components/brand/hero-paths.ts").write_text(f'''// Generated from Playfair Display (wght 900) for the hero masthead mask.
export const MASTHEAD = {{
  d: "{' '.join(parts)}",
  width: {round(boxes[-1][2])},
  /** y range of the caps (overshoot included). */
  top: {top},
  height: {bottom - top},
  /** Centre of the I stem: the camera flies into this letter on scroll. */
  zoomX: {round((i_box[0] + i_box[2]) / 2)},
  zoomY: 750,
}} as const;
''', encoding="utf-8")
print("masthead", boxes)
