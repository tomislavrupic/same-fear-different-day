from pathlib import Path
import json,subprocess,hashlib
root=Path(__file__).resolve().parents[1]
previous={}
if (root/'site'/'tracks.json').exists(): previous={t['id']:t for t in json.loads((root/'site'/'tracks.json').read_text())}
titles=['AI HATER',"WE CAN'T FATHOM NUANCE",'GOD GAVE ME ANOTHER DAY TO PISS YOU OFF','DELEGATING THINKING TO A SPREADSHEET','THE ALGORITHM SENT ME YOU','MOTHS TO THE LIGHT','I NEED MORE COFFEE']
types=['Deluxe Action Figure','Educational Sorting Game','Morning Workout VHS','Productivity Suite — 12 Floppy Disks','Recommendation Service','Personalized Engagement Lamp','CAFFEINE()™ Cognitive Startup Fluid']
depts=['Creative Resistance','Cognitive Development','Personal Wellness','Workplace Solutions','Human Connection','Attention Management','Cognitive Startup']
conditions=[['Outrage','Creative Block'],['Binary Thinking','Excessive Certainty'],['Outrage','Low Energy'],['Overthinking','Existential Dread'],['Loneliness','Algorithmic Confusion'],['Algorithmic Confusion','Existential Dread'],['Low Energy','Creative Block']]
subtitles=['Show Me on the Doll','An Extremely Nuanced Song About Everyone Being Exactly the Same™','A brighter tomorrow. Anyway.','Now With 30% More Independent Thought!','For Once, It Got Something Right™','Complaining About the Lamp May Attract Additional Lamps.','Now With 40% More Morning™']
descriptions=['Finally, an action figure that says the quiet parts out loud. Fully articulated opinions. Independently movable goalposts.','The educational sorting game for a world with only two boxes. Includes a third box that everyone finds deeply upsetting.','Start your morning with faith, sweat, spite, and a surprisingly healthy boundary. Motivation sold with questionable judgment.','Why have a thought when you could have a cell reference? Twelve floppy disks of professionally formatted uncertainty.','A recommendation service with an alarming amount of personal information and one unexpectedly good suggestion: another human.','A lamp that understands your attention span and intends to keep it. Now with personalized outrage settings.','Boot your brain with cognitive startup fluid. For unfinished albums, recursive creativity, accidental websites, and mornings.']
features=[['5 common arguments included','Advanced goalpost articulation','No batteries. Plenty of energy.'],['TRUE / FALSE / IT DEPENDS sorting','Compatible with changing your mind','Nuance sold separately (included anyway)'],['Haters stretch','Spite cardio','Upper body boundaries'],['12 imaginary floppy disks','Unlimited circular references','False sense of control'],['Human connection protocol','Unexpected kindness included','No subscription to loneliness required'],['Personalized attention harvesting','Infinite refresh compatibility','Warm glow of being perceived'],['Cognitive cold start','Sustained overthinking','May cause additional tracks']]
warnings=['May reveal more about the user than the product.','Choking hazard: deeply held assumptions.','May increase confidence, sarcasm, and overall tolerance for nonsense.','Do not outsource the person operating the spreadsheet.','Good people still exist. Handle with care.','Complaining about the lamp may attract additional lamps.','If creativity persists, you are probably fine.']
quotes=['Finally, a toy that understands me.',"Completely changed an opinion I didn’t have.",'I’m somehow in a better mood and a worse person.','My job has never been this meaningless.',"We met in the comments and now we’re trauma bonded.",'I fucking hate this.','I bought this at 2 AM. It is now a website.']
tracks=[]; manifest=[]
for i,title in enumerate(titles):
 n=i+1; folder=next((p for p in root.iterdir() if p.is_dir() and p.name.strip()==f'{n:02}'),None)
 images=list(folder.glob('*.png')) if folder else []
 if n==3: images=sorted(images,key=lambda p:0 if p.name.startswith('9e92') else 1)
 image=images[0] if images else None
 wav=next(iter(folder.glob('*.wav')),None) if folder else None
 mov=next(iter(folder.glob('*.mov')),None) if folder else None
 if folder and not mov: mov=next(iter(folder.glob('*.mp4')),None)
 if not wav and mov: wav=mov
 slug=f'track-{n:02}'; out=root/'site'/'assets'
 if wav: subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-q:a','2',str(out/f'{slug}.mp3')],check=True)
 metadata=[]
 for f in [wav,mov]:
  if f:
   info=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(f)]))
   metadata.append({'file':str(f.relative_to(root)),'bytes':f.stat().st_size,'sha256':hashlib.file_digest(f.open('rb'),'sha256').hexdigest(),'duration':float(info['format']['duration']),'streams':[{'type':s['codec_type'],'codec':s.get('codec_name'),'width':s.get('width'),'height':s.get('height')} for s in info['streams']]})
 tracks.append(dict(id=slug,trackNumber=n,title=title+'™',subtitle=subtitles[i],productType=types[i],department=depts[i],conditions=conditions[i],coverImage=f'assets/{slug}.webp' if image else 'assets/unavailable.svg',audioFile=f'assets/{slug}.mp3' if wav else None,videoFile=str(mov.relative_to(root)) if mov else None,youtubeId=None,youtubeUrl=None,description=descriptions[i],features=features[i],warnings=[warnings[i]],lyrics=None,instructions=['01. Locate your remaining attention.','02. Press play. Allow the song to finish a thought.','03. Repeat as emotionally indicated.'],reviews=[{'rating':5,'text':quotes[i],'author':'Verified Engager','response':'Thank you for your engagement.'}],badges=[subtitles[i] if n in [4,7] else 'TESTED ON HUMANS'],status='local-media-available' if wav else 'awaiting-media',ratingCount=[124,97,181,143,202,306,87][i],sourceImage=str(image) if image else None))
 manifest.append({'id':slug,'title':title,'description':f'{title}\nFrom SAME FEAR, DIFFERENT DAY™.\nA KitiKat Studios Production.\nConsumer Products for a Dysfunctional Civilization.','thumbnail':f'site/assets/{slug}-thumbnail.jpg' if image else None,'sources':metadata,'youtubeId':None,'youtubeUrl':None,'uploadStatus':'not-uploaded','blocker':'Verify authorized channel and existing uploads before upload' if mov else 'Missing track 01 media and cover','reviewNote':'Video and WAV durations differ by > 1 second; confirm intended final master' if len(metadata)==2 and abs(metadata[0]['duration']-metadata[1]['duration'])>1 else 'Technical metadata verified; editorial finality unconfirmed'})
for t in tracks:
 old=previous.get(t['id'],{})
 for key in ['youtubeId','youtubeUrl','youtubeStatus','lyrics']:
  if key in old: t[key]=old[key]
 if t['trackNumber']==1 and (root/'site'/'assets'/'track-01.webp').exists(): t['coverImage']='assets/track-01.webp'
tracks.extend(t for t in previous.values() if t.get('kind') == 'scanner')
(root/'site'/'tracks.json').write_text(json.dumps(tracks,indent=2,ensure_ascii=False))
(root/'upload-manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
print(f'Prepared {len(tracks)} products, {sum(bool(t["audioFile"]) for t in tracks)} MP3 derivatives, and checksummed manifest.')
