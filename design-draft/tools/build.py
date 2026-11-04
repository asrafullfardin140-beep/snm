"""Turn each canvas artboard into a plain HTML page that runs with runtime.js, for local visual checks."""
import re, sys
from pathlib import Path

SRC = Path(sys.argv[1])   # design-draft/canvas
OUT = Path(sys.argv[2])   # design-draft/preview
BLOBS = {
    "90b8c00073b2615e54a7ab42cfb6a110": "../media/snm-logo.png",
    "566a4d2a9d99e3c45d61b74cd1b54b75": "../media/k1.jpg", "21022ebd0e4b9f0dfef70f44a1d448db": "../media/k3.jpg",
    "b98ea8c3950b2332e3473c854866e802": "../media/k4.jpg", "89a8ad3ef16736ea907e5fd48a85375b": "../media/c2.jpg",
    "35d91cddad66a7a9292b6ebcac7b6ec6": "../media/o1.jpg", "8fb74e7b3bf5874db9db0d5051524b25": "../media/o2.jpg",
    "e0f04356626cdbc1e0c2fc84abde60c7": "../media/o3.jpg", "9301bd05abbfc66c26aba82303dc41fc": "../media/bar1.jpg",
    "a794da25d022d4671cdf95a503956a05": "../media/bar2.jpg", "9d38fcfc0294fa9a5e7501c5ede0e045": "../media/res1.jpg",
    "72ae0b20c27124c73f4bb455d1241fc7": "../media/t1.jpg", "37bed8af0af08535e80f397c8374f0dc": "../media/v2.jpg",
    "fd82bb24b826587d78b37a0e8c2e215b": "../media/w1.jpg", "4f8461f52eb19f000248a80459b6c3dd": "../media/ws1.jpg",
    "faf9cd1b3c871428ecdd2bf7b9be2641": "../media/ws2.jpg", "9e14a600c1b751ac712fe76f953d8182": "../media/hero.mp4",
    "8f30b34b5892b7bd592280b8b52e80e8": "../media/resin.mp4",
}
PAGES = ["Main", "Home-Slider", "Commercial", "Residential", "Services", "Epoxy", "Millwork", "Design", "FitOut", "Quote", "About"]


def unblob(text):
    return re.sub(r"/_blob/([0-9a-f]{32})", lambda m: BLOBS[m.group(1)], text)


(OUT / "snm.css").write_text(unblob((SRC / "snm.css").read_text()))
for name in PAGES:
    src = (SRC / f"{name}.dc.html").read_text()
    helmet = re.search(r"<helmet>(.*?)</helmet>", src, re.S).group(1)
    body = re.search(r"</helmet>(.*?)</x-dc>", src, re.S).group(1)
    script = re.search(r"<script type=\"text/x-dc\"[^>]*>(.*?)</script>", src, re.S).group(1)
    page = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<link rel="stylesheet" href="snm.css">{helmet}<script src="runtime.js"></script><script>{unblob(script)}</script></head>'
            f'<body><template id="tpl">{unblob(body).replace(".dc.html", ".html")}</template><div id="root"></div></body></html>')
    (OUT / f"{name}.html").write_text(page)
    print("built", name)
