"""Turn each canvas artboard into a plain HTML page that runs with runtime.js, for local visual checks."""
import re, sys
from pathlib import Path

SRC = Path(sys.argv[1])   # design-draft/canvas
OUT = Path(sys.argv[2])   # design-draft/preview
MEDIA = sys.argv[3] if len(sys.argv) > 3 else "../media/"   # where the built pages find the photos and videos
BLOBS = {
    "03963753ad4feea4c43c038b7e4e2ca4": "../media/hero.mp4",
    "685608b5d6a42dbb4f39260428cd87cf": "../media/wall-blue.webp",
    "10f842f5b3c455fb49dd3bc47b3d91ab": "../media/showreel.mp4",
    "b047282dff9c31b77831971d98221f02": "../media/showreel-poster.webp",
    "59092c77a0d8b7d4bc1783b90cd33a83": "../media/hero-poster.webp",
    "ddaee12b1d02cb40e277077a4e9a76b5": "../media/snm-logo.webp",
    "10a9d5890da064401c5342e90147ab64": "../media/snm-logo-v2.webp",
    "43e824b4c6b12e9f8027592f9786f0a5": "../media/snm-logo-v3.webp",
    "7eaae759c1a76744ae37e0861c5897d7": "../media/favicon-64.png",
    "93a0c92b99ffa8e064234a231ffa0a91": "../media/favicon-180.png",
    "c337d2f2d5033cae7564bf652c1112a8": "../media/cmp-before-v2.webp",
    "6e93d6098c93464bd924811ebd6a6be4": "../media/cmp-before.webp",
    "07e0eb46652808a317ff316c01b0cddb": "../media/cmp-after.webp",
    "01229eb242c0f434ed4b8706f34db641": "../media/step-before.webp",
    "a0a9d9ab9a1b52dc7dd9b89e77dcb7b0": "../media/step-during.webp",
    "18a33541275aad83fcbfcfe3c0ea58ee": "../media/step-after.webp",
    "9b0849c67a375543de2a3ea0157538ae": "../media/table-blue-v2.webp",
    "88e55e2663be0a3058413c3b1172ef09": "../media/table-red-v2.webp",
    "41b8f5a2185621fe193e3d740088cdb6": "../media/resin-bark-v2.webp",
    "99990602ecc04e579e868394633d175c": "../media/install-crew.webp",
    "2373938fb43dadc6e0bd7e3f69535802": "../media/library/ai-pour-team.webp",
    "77a9848682d5e064a04c191260262834": "../media/library/ai-wall-staged.webp",
    "e4017eab663939ac5a98025960688587": "../media/library/ai-fitout-sanding.webp",
    "1cfecb4602b04070270cdfba4a10ee51": "../media/team-site.webp",
    "70884c43f9b445a960e4868c706628bc": "../media/wall-blue-slide.webp",
    "feea8874ee5016a7b870ae2910fdc5ce": "../media/wall-day.webp",
    "b72c6f496010df0062ac6bca9e1ec197": "../media/wall-amber.webp",
    "82e87a578a2c5f0a8af9f26663e44216": "../media/table-blue.webp",
    "86207d1a6f531ed2863316c04efb4d2e": "../media/table-red.webp",
    "426098e6f3da8f4e047089b6fe7db596": "../media/resin-bark.webp",
    "2b8ae7be5c7fe40f4858b904094f27d1": "../media/cad1.webp",
    "340e2fb6c2ca3da1bb98503c569e6663": "../media/cad2.webp",
    "90a69e6b5d9712f0a5c86e6f41109bd7": "../media/cnc1.webp",
    "7d93deaf944dc0b5b09d04ab58cf6651": "../media/fin1.webp",
    "064a77b376a7283bca4afe401ae122e5": "../media/inst1.webp",
    "6cfe3cb1c1e1526408d40e109e231c5a": "../media/inst3.webp",
    "56c65e64119f22c1036fce578f430f59": "../media/kit1.webp",
    "301cccebed344a1d214746fbfdff3600": "../media/kit2.webp",
    "bcb03b9f2bc077430207b1822a9b47ed": "../media/off2.webp",
    "5fb1e1ab698ff996dd5ac01ea0700127": "../media/rec1.webp",
    "3d5fd0436a8f69711ac794c937d30a22": "../media/rec3.webp",
    "1f09c3f746d38a63ab5121a26d928802": "../media/clo1.webp",
    "464837d0ca2c7cb6097cdbc20e56fb21": "../media/clo2.webp",
    "b478bb8ec8360c0cc56bb43710e47e81": "../media/samp1.webp",
    "78eb8fbf0e90225ae7db8f6be7f49bf4": "../media/shop1.webp",
    "6b57fc68f3063576774852f58ad1a0f5": "../media/team1.webp",
    "2196d1f28269268782bb2541c952cb1c": "../media/tv2.webp",
    "7e025c0aaaa0089b58a5c2051c36da55": "../media/van1.webp",
    "a3ee2618fc4e4c646e6a32cb30125d6c": "../media/ret1.webp",
    "f07b9b975e9cf2157a02075fd970ba9f": "../media/res2.webp",
    "dbfe3cb99106b16ba558dabf505f6748": "../media/reno1.webp",
    "90b8c00073b2615e54a7ab42cfb6a110": "../media/snm-logo.png",
    "a1b742ef4b791490a16b482ad7966bb1": "../media/stock/stock-panels.webp",
    "0daf5f0eff0144e303e59e4d1f0bb1b3": "../media/stock/stock-kitchen.webp",
    "abc337c2ade78b55d4d9b24b3b87de07": "../media/stock/stock-planing.webp",
    "1ceebea38541c4608ab46796e284ab77": "../media/stock/stock-plan.webp",
    "da68a6c4c7871129e0015690f34b96ac": "../media/stock/stock-blueprints.webp",
    "e028eb6ad15315c5f2d4b54348666c7c": "../media/stock/stock-samples.webp",
    "36c26f344f8efe4895f600224ca405e0": "../media/stock/stock-cnc.webp",
    "71af046c2f2f771f7a874a52ab3b0eea": "../media/stock/stock-router.webp",
    "b76a204a4ec0c190859eca95dac4e2ec": "../media/stock/stock-workshop.webp",
    "dc23eb92da681f61633f0c3147ac23b9": "../media/stock/stock-office.webp",
    "204f702f17fda3384ffea2e3318a5aab": "../media/stock/stock-ceiling.webp",
    "abbd7837170dfd4505a81ac884099728": "../media/stock/stock-lobby.webp",
    "52aaf7f35961e76032de3aa97c369f0f": "../media/stock/stock-kitchen2.webp",
    "01b9f4ab61c903faff0c21ecfbe81817": "../media/stock/stock-reno.webp",
    "5a80bea6e321baba7ec1841fb8e5f764": "../media/stock/stock-tools.webp",
    "5e1cc3c48f759d9b999b53e118e52e52": "../media/stock/stock-crew.webp",
    "f0196eb0a59edcedfd796814e8b28a1d": "../media/stock/stock-hardhat.webp",
    "0c371e7c0750903c1d705cd2c916685d": "../media/stock/stock-workers.webp",
    "566a4d2a9d99e3c45d61b74cd1b54b75": "../media/k1.jpg", "21022ebd0e4b9f0dfef70f44a1d448db": "../media/k3.jpg",
    "b98ea8c3950b2332e3473c854866e802": "../media/k4.jpg", "89a8ad3ef16736ea907e5fd48a85375b": "../media/c2.jpg",
    "35d91cddad66a7a9292b6ebcac7b6ec6": "../media/o1.jpg", "8fb74e7b3bf5874db9db0d5051524b25": "../media/o2.jpg",
    "e0f04356626cdbc1e0c2fc84abde60c7": "../media/o3.jpg", "9301bd05abbfc66c26aba82303dc41fc": "../media/bar1.jpg",
    "a794da25d022d4671cdf95a503956a05": "../media/bar2.jpg", "9d38fcfc0294fa9a5e7501c5ede0e045": "../media/res1.webp",
    "72ae0b20c27124c73f4bb455d1241fc7": "../media/t1.webp", "37bed8af0af08535e80f397c8374f0dc": "../media/v2.jpg",
    "fd82bb24b826587d78b37a0e8c2e215b": "../media/w1.webp", "4f8461f52eb19f000248a80459b6c3dd": "../media/ws1.jpg",
    "faf9cd1b3c871428ecdd2bf7b9be2641": "../media/ws2.jpg", "9e14a600c1b751ac712fe76f953d8182": "../media/hero.mp4",
    "8f30b34b5892b7bd592280b8b52e80e8": "../media/resin.mp4",
}
PAGES = ["Main", "Home-Slider", "Commercial", "Residential", "Services", "Epoxy", "Millwork", "Design", "FitOut", "Fabrication", "Installation", "Trades", "Quote", "About", "Library", "NotFound", "Projects"]


def unblob(text):
    return re.sub(r"/_blob/([0-9a-f]{32})", lambda m: BLOBS[m.group(1)].replace("../media/", MEDIA), text)


(OUT / "snm.css").write_text(unblob((SRC / "snm.css").read_text()))
for name in PAGES:
    src = (SRC / f"{name}.dc.html").read_text()
    helmet = re.search(r"<helmet>(.*?)</helmet>", src, re.S).group(1)
    head = re.search(r"<head>(.*?)</head>", src, re.S).group(1)
    head_extra = "".join(re.findall(r"<title>.*?</title>|<meta name=\"(?:description|robots)\"[^>]*>|<link rel=\"(?:icon|apple-touch-icon)\"[^>]*>", head))
    body = re.search(r"</helmet>(.*?)</x-dc>", src, re.S).group(1)
    script = re.search(r"<script type=\"text/x-dc\"[^>]*>(.*?)</script>", src, re.S).group(1)
    page = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">{unblob(head_extra)}'
            f'<link rel="stylesheet" href="snm.css">{helmet}<script src="runtime.js"></script><script>{unblob(script)}</script></head>'
            f'<body><template id="tpl">{unblob(body).replace(".dc.html", ".html")}</template><div id="root"></div></body></html>')
    (OUT / f"{name}.html").write_text(page)
    print("built", name)
