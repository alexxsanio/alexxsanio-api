import pymupdf

doc = pymupdf.open("document.pdf")
page = doc[0]

blocks = page.get_text("dict")["blocks"]
for block in blocks:
    if block["type"] == 0:  # text block
        for line in block["lines"]:
            for span in line["spans"]:
                print(f"{span['text']!r}  font={span['font']}  size={span['size']:.1f}")