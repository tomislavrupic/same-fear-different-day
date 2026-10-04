from pathlib import Path
import json,re,html,textwrap
out=Path(__file__).resolve().parents[1]/'site'/'stickers'
labels=['TESTED ON HUMANS — RESULTS INCONCLUSIVE','NUANCE SOLD SEPARATELY','PROBABLY FINE','MAY CAUSE ADDITIONAL TRACKS','IN STOCK (UNFORTUNATELY)','VERIFIED ENGAGER','EMOTIONAL SHIPPING INCLUDED','SAME HUMANS. DIFFERENT FEEDS.','IT DEPENDS™','CIRCULAR REFERENCE DETECTED','YOUR FEED HAS BEEN PERSONALIZED','GOOD PEOPLE STILL EXIST','PLEASE STOP REFRESHING THE FEED','MADE WITH QUESTIONABLE JUDGMENT','HUMAN COMPATIBLE','REALITY MAY VARY','TESTED ON HUMANS','MADE WHILE THE OWNER NEEDED MORE COFFEE','DO NOT FEED AFTER DISCOURSE','NOW WITH LESS ABSOLUTE CERTAINTY','THIS OPINION REQUIRES AN UPDATE','CERTIFIED PRE-OVERTHOUGHT','HANDLE WITH EXISTENTIAL CARE','SOME ASSEMBLY OF SELF REQUIRED','BATTERIES AND BOUNDARIES INCLUDED','NO USER SERVICEABLE BELIEFS','APPROVED BY ONE CAT','CONTENTS MAY SETTLE YOUR ARGUMENT','ATTENTION NOT INCLUDED','KEEP OUT OF REACH OF ALGORITHMS','100% ORGANIC SECOND THOUGHTS','NOT A SUBSTITUTE FOR A NAP','FOR RECREATIONAL MEANING ONLY','BEST BEFORE NEXT NEWS CYCLE','VOID WHERE NUANCED','FRAGILE: CONTAINS CONTEXT']
entries=[]
for i,text in enumerate(labels):
 slug=re.sub(r'[^a-z0-9]+','-',text.lower()).strip('-');file=slug+'.svg'
 palette=[('#ffe345','#102d50'),('#ec087b','#ffffff'),('#e5f4ec','#07575a'),('#092e53','#fff7d5')][i%4];bg,fg=palette
 lines=textwrap.wrap(text,width=22);size=21 if len(lines)<3 else 17
 shape=f'<rect x="7" y="7" width="306" height="154" rx="{5 if i%3==0 else 24}" fill="{bg}" stroke="{fg}" stroke-width="3"/>'
 if i%4==2:shape+=f'<rect x="14" y="14" width="292" height="140" rx="18" fill="none" stroke="{fg}" stroke-width="1" stroke-dasharray="4 3"/>'
 texts=''.join(f'<text x="160" y="{73+(j-(len(lines)-1)/2)*(size+4)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="{size}" fill="{fg}">{html.escape(l)}</text>' for j,l in enumerate(lines))
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="168" viewBox="0 0 320 168"><title>{html.escape(text)}</title>{shape}<text x="160" y="30" text-anchor="middle" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="2" fill="{fg}">KITIKAT STUDIOS™</text>{texts}<path d="M145 126 l2 -10 7 4 q6 -3 12 0 l7 -4 2 10 q0 13 -15 13 q-15 0 -15 -13" fill="{fg}"/><circle cx="154" cy="127" r="2" fill="{bg}"/><circle cx="166" cy="127" r="2" fill="{bg}"/><text x="160" y="153" text-anchor="middle" font-family="Arial" font-size="7" letter-spacing="1.5" fill="{fg}">DEPARTMENT OF QUESTIONABLE ASSURANCE · {i+1:03}</text></svg>'
 (out/file).write_text(svg);entries.append({'text':text,'file':file})
(out/'index.json').write_text(json.dumps(entries,indent=2))
print(f'Created {len(labels)} reusable SVG stickers.')
