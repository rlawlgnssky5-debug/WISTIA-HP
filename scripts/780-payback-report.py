from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, html

root=Path(__file__).resolve().parents[1]
out=root/'output/780-payback-20261021'
before=json.loads((out/'before-measurements.json').read_text(encoding='utf-8'))
after=json.loads((out/'after-measurements.json').read_text(encoding='utf-8'))
font=ImageFont.truetype('C:/Windows/Fonts/malgun.ttf',18)
checks=[]
sections=[]
for new in after['results']:
    old=next(r for r in before['results'] if (r['route'],r['width'],r['mode'])==(new['route'],new['width'],new['mode']))
    slug='home' if new['route']=='/' else new['route'][1:].replace('/','-')
    name=f"{slug}-{new['width']}-{new['mode']}"
    a=Image.open(out/'before'/f'{name}.jpg').convert('RGB')
    b=Image.open(out/'after'/f'{name}.jpg').convert('RGB')
    canvas=Image.new('RGB',(a.width+b.width+24,max(a.height,b.height)+42),'#eeeeee')
    draw=ImageDraw.Draw(canvas);draw.text((8,8),'BEFORE',font=font,fill='#333333');draw.text((a.width+32,8),'AFTER',font=font,fill='#333333')
    canvas.paste(a,(0,42));canvas.paste(b,(a.width+24,42));canvas.save(out/f'{name}-comparison.jpg',quality=78)
    details=[]
    if new['mode']=='direct' and old['images']:
        details=[{'src':n['src'],'same':all(abs(n[k]-o[k])<1 for k in ('x','y','width','height'))} for o,n in zip(old['images'],new['images'])]
    checks.append({'name':name,'overflow':new['overflow'],'direct_image_geometry_unchanged':all(d['same'] for d in details),'images':details})
    sections.append(f'<section><h2>{html.escape(new["route"])} · {new["width"]}px · {new["mode"]}</h2><p>body {old["bodyBackground"]} → {new["bodyBackground"]} / 가로 넘침 {new["overflow"]}px</p><a href="{name}-comparison.jpg"><img loading="lazy" src="{name}-comparison.jpg" alt="수정 전후 전체 캡처"></a></section>')
(out/'geometry-comparison.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2),encoding='utf-8')
(out/'index.html').write_text('<!doctype html><html lang="ko"><meta charset="utf-8"><title>위스티아 A·B 수정 전후 비교 보고서</title><style>body{margin:24px;font-family:Malgun Gothic,sans-serif;background:#f5f5f5;color:#222}h1{font-size:24px}section{background:white;padding:16px;margin:24px 0;border-radius:8px}h2{font-size:18px}img{max-width:100%;max-height:1000px;display:block;object-fit:contain;object-position:top left}p{line-height:1.7}a{color:#65424c}</style><h1>위스티아 A·B 수정 전후 비교 보고서</h1><p>이 화면은 홈페이지가 아닌 검수 보고서입니다<br>왼쪽 BEFORE / 오른쪽 AFTER · 이미지를 누르면 원본 전체 캡처를 확인할 수 있습니다<br>9개 경로 × 2개 화면 폭 × 직접 진입·소개 페이지 경유 = 36개 비교</p><p><a href="REPORT.md">전체 변경 및 검증 보고서</a></p>'+''.join(sections),encoding='utf-8')
ocr=json.loads((out/'image-ocr.json').read_text(encoding='utf-8-sig'))
for batch in range(0,len(ocr),10):
    items=ocr[batch:batch+10];sheet=Image.new('RGB',(1750,1100),'white');d=ImageDraw.Draw(sheet)
    for i,item in enumerate(items):
        im=Image.open(root/item['file']).convert('RGB');im.thumbnail((330,490))
        x=(i%5)*350;y=(i//5)*550
        d.text((x+6,y+2),Path(item['file']).name,font=font,fill='black');sheet.paste(im,(x+6,y+36))
    sheet.save(out/f'image-audit-{batch//10+1}.jpg',quality=86)
print('36 before/after comparisons and image-audit sheets generated')
for name in ['home-1280-direct','detail-solo-390-spa']:
    a=Image.open(out/'before'/f'{name}.jpg').convert('RGB');b=Image.open(out/'after'/f'{name}.jpg').convert('RGB')
    height=800 if '1280' in name else 1500
    a=a.crop((0,0,a.width,height));b=b.crop((0,0,b.width,height))
    sheet=Image.new('RGB',(a.width+b.width+24,height+42),'#eeeeee');d=ImageDraw.Draw(sheet)
    d.text((8,8),'BEFORE',font=font,fill='#333333');d.text((a.width+32,8),'AFTER',font=font,fill='#333333')
    sheet.paste(a,(0,42));sheet.paste(b,(a.width+24,42));sheet.save(out/f'{name}-top-comparison.jpg',quality=88)
for product in ['solo','duo']:
    for width in [1280,390]:
        name=f'detail-{product}-{width}-expanded';a_path=out/'before'/f'{name}.jpg';b_path=out/'after'/f'{name}.jpg'
        if not a_path.exists() or not b_path.exists():continue
        a=Image.open(a_path).convert('RGB');b=Image.open(b_path).convert('RGB')
        sheet=Image.new('RGB',(a.width+b.width+24,max(a.height,b.height)+42),'#eeeeee');d=ImageDraw.Draw(sheet)
        d.text((8,8),'BEFORE',font=font,fill='#333333');d.text((a.width+32,8),'AFTER',font=font,fill='#333333')
        sheet.paste(a,(0,42));sheet.paste(b,(a.width+24,42));sheet.save(out/f'{name}-comparison.jpg',quality=88)
