const initial = [
 ['Afnan','Supremacy Collector’s Edition','A scent I imagine wearing when I want to feel put together. I would describe the mood as bright at first, then deeper and more dressed up. After a few proper wears, I’ll come back to capture the details in my own words.','#86703c'],
 ['Arabiyat Prestige','Marwa','The kind of entry I want to write slowly: a first impression, a second wear, and the little details I missed before. For now, I picture a polished fragrance with a quiet sense of occasion.','#735e49'],
 ['Afnan','9PM Night Out','My starting thought is an evening fragrance with a playful mood. I want to see whether it feels lively, relaxed, or dressed up on my skin, and which part of the scent stays with me.','#5d4b6e'],
 ['Khadlaj','Island Dreams','A name that makes me think of open skies and a slower day. I want this review to capture whether the actual scent gives me that same feeling, from the first spray to the last trace.','#39686b'],
 ['Riffs','Momento','I want to describe the moment this fragrance belongs to: the setting, the mood, and how it makes me feel. A few wears will help me find the words beyond a simple first impression.','#7b5a45'],
 ['Lattafa','Asad Bourbon','For this entry, I’m imagining warmth and a comfortable evening. I’ll edit this after wearing it to describe the actual opening, how it settles, and whether it becomes a regular on my shelf.','#885d31'],
 ['Lattafa','The Kingdom','My starting point is the feeling of being well dressed without trying too hard. I want to explore when this fragrance works for me and which details give it a character of its own.','#6a7351'],
 ['French Avenue','Liquid Brun','A draft for the days when I want a comforting scent close by. I’ll use this space to describe its texture, its changing character, and what I notice after several hours on skin.','#8d6549'],
 ['Velixir','Icarus','This is a blank chapter with a sense of curiosity. I want to learn the fragrance through a few different days and record the impression that lasts after the first excitement fades.','#657386'],
 ['Paris Corner','Rifaaqat','I picture a fragrance with a little drama and a memorable presence. My own review will explore whether that matches the experience, and the moments when I most enjoy wearing it.','#79644f']
,
 ["Afnan", "9PM", "A playful evening mood: crisp apple, a little cinnamon warmth, and a soft vanilla sweetness. I would use this entry to capture how the fresh opening settles on my skin and whether the sweetness feels right for my nights out.", "#745d76"],
 ["Al Rehab", "Officer", "A clean, composed mood built around citrus, a floral heart, and a woody finish. I want to keep track of the little changes between the first spray and the dry down, and the days when I naturally reach for it.", "#4d6267"],
 ["Versace", "Eros Eau de Toilette", "Fresh mint and citrus meet a warmer vanilla-and-woods mood. For this entry, I want to describe how that contrast feels on my skin, when I enjoy wearing it, and the detail I remember after a full day.", "#356d74"]
].map((p,i)=>({id:i,brand:p[0],name:p[1],review:p[2],tone:p[3],opening:'',drydown:'',wear:'',rating:'',reviewed:false}));
const storageKey='brix-fragrance-journal-v1';let entries=initial.map(e=>({...e})),editing=null;
try{const saved=JSON.parse(localStorage.getItem(storageKey));if(Array.isArray(saved))entries=initial.map(e=>{const s=saved.find(x=>x.id===e.id);return s?{...e,...Object.fromEntries(['review','opening','drydown','wear'].filter(k=>typeof s[k]==='string').map(k=>[k,s[k]])),rating:typeof s.rating==='string'&&(!s.rating||(Number(s.rating)>=0&&Number(s.rating)<=10))?s.rating:'',reviewed:s.reviewed===true}:e;});}catch{}
const $=id=>document.getElementById(id);function element(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function makeProductPhoto(entry){
 const photo=element('img','card-photo');photo.src=productPhotos[entry.id].image;photo.alt=entry.name+' by '+entry.brand;photo.loading='lazy';photo.decoding='async';photo.width=240;photo.height=260;
 photo.addEventListener('error',()=>{const fallback=element('div','mini-bottle');photo.replaceWith(fallback);},{once:true});return photo;
}
function makeReviewPeek(entry){
 const peek=element('div','review-peek');peek.setAttribute('aria-hidden','true');
 const text=entry.review||'A new impression is waiting to be written.';
 peek.append(element('p','eyebrow','MY REVIEW'),element('p','',text.length>230?text.slice(0,227).trim()+'…':text));
 if(!entry.reviewed)peek.append(element('small','','Sample text to personalize.'));
 peek.append(element('span','','Open full review & notes ↗'));return peek;
}
function render(){
 const q=$('search').value.toLowerCase().trim();const shown=entries.filter(e=>`${e.brand} ${e.name}`.toLowerCase().includes(q));$('cards').replaceChildren();
 shown.forEach(e=>{
  const card=element('button','card');card.type='button';card.setAttribute('aria-label',`View ${e.name} by ${e.brand}: review, accords and notes`);
  const art=element('div','card-art');art.style.setProperty('--tone',e.tone);art.append(element('span','card-number',String(e.id+1).padStart(2,'0')),makeProductPhoto(e),makeReviewPeek(e));art.setAttribute('aria-hidden','true');
  const body=element('div','card-body');body.append(element('p','card-brand',e.brand.toUpperCase()),element('h3','',e.name),element('p','card-accords',fragranceProfiles[e.id].accords.slice(0,3).join(' · ')));
  const bottom=element('div','card-bottom');bottom.append(element('span','',e.rating?`${e.rating} / 10`:'UNRATED'),element('span','card-action','Read review & notes ↗'));body.append(bottom);card.append(art,body);card.addEventListener('click',()=>openEntry(e.id));$('cards').append(card);
 });
 $('empty').hidden=shown.length>0;$('collection-count').textContent=q?`${shown.length} of ${entries.length} fragrances`:`${entries.length} fragrances`;
 $('feature-excerpt').textContent='Pineapple and bergamot lead into orange blossom, birch, and amber, with a musky, mossy base.';
 $('feature-status').textContent='FRAGRANCE PROFILE';
}
function populateEntry(e){
 const profile=fragranceProfiles[e.id];$('dialog-brand').textContent=e.brand.toUpperCase();$('dialog-title').textContent=e.name;
 $('dialog-photo').src=productPhotos[e.id].image;$('dialog-photo').alt=e.name+' by '+e.brand;$('dialog-photo-source').href=productPhotos[e.id].source;
 $('dialog-accords').replaceChildren(...profile.accords.map(accord=>{const chip=element('span','accord',accord);chip.dataset.family=accord.toLowerCase();return chip;}));
 $('detail-rating').textContent=e.rating?`${e.rating} / 10 · My rating`:'Not yet rated';$('review-copy').textContent=e.review||'No review yet. Select “Edit my review” to add your impressions.';$('sample-note').hidden=e.reviewed||!e.review;
 $('wear-summary').replaceChildren();for(const [key,label] of [['opening','My opening impression'],['drydown','My dry down'],['wear','My wear notes']]){if(e[key]){const item=element('div');item.append(element('dt','',label),element('dd','',e[key]));$('wear-summary').append(item);}}
 $('note-pyramid').replaceChildren();for(const [key,title] of [['top','Top notes'],['middle','Middle notes'],['base','Base notes']]){const tier=element('section','pyramid-tier');tier.append(element('h4','',title.toUpperCase()));const list=element('div','note-list');list.append(...profile[key].map(note=>element('span','',note)));tier.append(list);$('note-pyramid').append(tier);}
 $('notes-source').href=profile.source;$('review-text').value=e.review;for(const k of ['opening','drydown','wear','rating'])$(k).value=e[k];$('reviewed').checked=e.reviewed;
}
function openEntry(id){editing=id;populateEntry(entries.find(x=>x.id===id));$('edit-review').open=false;$('review-dialog').showModal();$('review-dialog').scrollTop=0;}
let toastTimer;function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),4000);}
$('review-form').addEventListener('submit',ev=>{ev.preventDefault();const e=entries.find(x=>x.id===editing);e.review=$('review-text').value.trim();for(const k of ['opening','drydown','wear','rating'])e[k]=$(k).value.trim();e.reviewed=$('reviewed').checked;let saved=true;try{localStorage.setItem(storageKey,JSON.stringify(entries));}catch{saved=false;}render();populateEntry(e);$('edit-review').open=false;$('review-dialog').scrollTop=0;toast(saved?'Your entry is saved.':'Browser storage is unavailable. Export your journal to keep these edits.');});
$('close-dialog').addEventListener('click',()=>$('review-dialog').close());$('feature-open').addEventListener('click',()=>openEntry(0));$('search').addEventListener('input',render);
$('export').addEventListener('click',()=>{const text=entries.map(e=>`## ${e.name}\n${e.brand} · ${e.reviewed?'Personal review':'Illustrative draft'}\n\n${e.review}\n\nOpening: ${e.opening||'To be written'}\nDry down: ${e.drydown||'To be written'}\nWear notes: ${e.wear||'To be written'}\nRating: ${e.rating?e.rating+'/10':'Unrated'}\n`).join('\n---\n\n');const url=URL.createObjectURL(new Blob(["# Brix’s Fragrance Journal\n\n"+text],{type:'text/markdown;charset=utf-8'}));const a=element('a');a.href=url;a.download='brix-fragrance-journal.md';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Journal exported.');});render();

// Reveal each section once; the page stays visible without JavaScript or motion.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let sectionObserver;
function configureMotion(){
 sectionObserver?.disconnect();
 document.querySelectorAll('.reveal-play').forEach(section=>section.classList.remove('reveal-play'));
 if(motionPreference.matches||!('IntersectionObserver' in window))return;
 sectionObserver=new IntersectionObserver(observations=>{
  observations.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('reveal-play');sectionObserver.unobserve(target);}});
 },{threshold:.12});
 document.querySelectorAll('.featured,.section-heading,.collection-tools,.seasonal-grid,.about').forEach(section=>sectionObserver.observe(section));
}
configureMotion();
motionPreference.addEventListener('change',configureMotion);

document.querySelectorAll('[data-season-pick]').forEach(button=>button.addEventListener('click',()=>openEntry(Number(button.dataset.seasonPick))));
