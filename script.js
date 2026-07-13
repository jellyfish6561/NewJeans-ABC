const BASE = new URL('./', window.location.href);
const asset = p => new URL(p, BASE).href;
const cards=[['A','Attention'],['B','Bubble Gum'],['C','Cool With You'],['D','Ditto'],['E','ETA'],['F','Fashion Week'],['G','GODS'],['H','Hurt'],['I','Idol'],['J','Jeans'],['K','K-Pop'],['L','Lollapalooza'],['M','Min Hee Jin'],['N','New Jeans'],['O','OMG'],['P','Pit Spot'],['Q','Quality'],['R','Right Now'],['S','Super Shy'],['T','Tokki'],['U','UCLA'],['V','Vogue'],['W','W KOREA'],['X','Xmas'],['Y','Y2K'],['Z','Zero']].map((x,i)=>({letter:x[0],word:x[1],img:asset(`./images/${String(i+1).padStart(2,'0')}.jpg`)}));
const $=id=>document.getElementById(id);let current=0,viewed=new Set(JSON.parse(localStorage.njabc_v4_viewed||'[]')),favorites=new Set(JSON.parse(localStorage.njabc_v4_favorites||'[]'));
function save(){localStorage.njabc_v4_viewed=JSON.stringify([...viewed]);localStorage.njabc_v4_favorites=JSON.stringify([...favorites])}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active')}
function pair(i){return Math.floor(i/2)}function side(i){return i%2}
function setImg(img, src){
  const box=img.closest('.loading')||img.parentElement;
  img.loading = img.loading || 'lazy'; img.decoding='async';
  let tried=0;
  const load=()=>{ if(box) box.classList.add('loaded'); };
  const err=()=>{ if(tried<2){ tried++; setTimeout(()=>{ img.src = src + (src.includes('?')?'&':'?') + 'retry=' + Date.now(); }, 450*tried);} else { if(box){box.classList.add('loaded'); box.insertAdjacentHTML('beforeend','<div class="errorText">圖片載入失敗，請重新整理頁面</div>');}} };
  img.onload=load; img.onerror=err; img.src=src;
}
function setupLazy(){
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const img=e.target;setImg(img,img.dataset.src);io.unobserve(img)}})},{rootMargin:'360px'}) : null;
  document.querySelectorAll('img[data-src]').forEach(img=> io ? io.observe(img) : setImg(img,img.dataset.src));
}
function preloadAround(i){[i-2,i-1,i,i+1,i+2].forEach(n=>{n=(n+26)%26;const im=new Image();im.src=cards[n].img})}
function openLetter(i){current=(i+26)%26;let p=pair(current),f=p*2,b=f+1;$('bigCard').classList.remove('loaded');setImg($('frontImg'),cards[f].img);setImg($('backImg'),cards[b].img);$('frontImg').alt=`${cards[f].letter} ${cards[f].word}`;$('backImg').alt=`${cards[b].letter} ${cards[b].word}`;$('bigCard').classList.toggle('flipped',side(current)===1);$('letterTitle').textContent=`${cards[current].letter} · ${cards[current].word}`;$('favBtn').classList.toggle('on',favorites.has(current));$('favBtn').textContent=favorites.has(current)?'❤️':'♡';viewed.add(current);save();preloadAround(current);if(viewed.size===26&&!localStorage.njabc_v4_master){localStorage.njabc_v4_master='yes';setTimeout(()=>achievement(true),600)}show('viewer')}
function moveTo(i){i=(i+26)%26;const same=pair(i)===pair(current);if(same){openLetter(i);return}const big=$('bigCard');big.classList.add(i>current?'swapLeft':'swapRight');setTimeout(()=>{big.classList.remove('swapLeft','swapRight');openLetter(i)},260)}
function speak(t){if(!('speechSynthesis' in window))return alert('此瀏覽器不支援發音');speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.82;u.pitch=1.05;speechSynthesis.speak(u)}
function search(q){q=q.trim().toLowerCase();if(!q)return;let i=cards.findIndex(c=>c.letter.toLowerCase()===q);if(i<0)i=cards.findIndex(c=>c.word.toLowerCase()===q||c.word.toLowerCase().includes(q));if(i>=0)openLetter(i);else{ $('searchInput').value='找不到，請輸入 A-Z 或單字';$('searchInput').select();}}
function modal(html){$('modalContent').innerHTML=html;$('modal').showModal()}
function favModal(){let a=[...favorites].sort((a,b)=>a-b);modal(`<h2>⭐ 我的收藏</h2>${a.length?`<div class="favList">${a.map(i=>`<button onclick="document.getElementById('modal').close();openLetter(${i})">${cards[i].letter} · ${cards[i].word}</button>`).join('')}</div>`:'<p>尚未收藏。打開卡片後點 ♡ 可收藏。</p>'}`)}
function achievement(done=false){let master=localStorage.njabc_v4_master==='yes';modal(`<div style="text-align:center"><img src="${asset('./assets/abc-master-badge.png')}" alt="ABC Master" style="width:120px;max-width:40vw"><h2>${done?'Great Job!':'我的成就'}</h2><p><b>${master?'ABC Master':'ABC Explorer'}</b></p><p>完成：${viewed.size}/26</p></div>`)}
function getShareData(){
  const title='NewJeans一起學ABC';
  const url=location.href.split('#')[0];
  const text='NewJeans一起學ABC｜互動英文海報與 A-Z 英文圖卡';
  const message=`${text}\n${url}`;
  return {title,text,url,message};
}
async function nativeShare(){
  const data=getShareData();
  if(navigator.share){try{await navigator.share({title:data.title,text:data.text,url:data.url});return true}catch(e){return false}}
  return false;
}
async function copyShare(label='已複製連結'){
  const d=getShareData();
  try{await navigator.clipboard.writeText(d.url); toast(label);}
  catch(e){prompt('請複製連結：',d.url)}
}
function toast(msg){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}
  t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);
}
function shareModal(){
  modal(`<h2>🔗 分享</h2><p class="small">請用手機系統分享，或複製連結後貼到 LINE、IG、Threads、FB、Messenger。</p><div class="shareGrid">
    <button onclick="nativeShare() || copyShare()">手機系統分享</button>
    <button onclick="copyShare()">複製連結</button>
  </div>`);
}
function init(){
 setupLazy();
 const coords=[];let rows=[[0,6,7],[7,13,7],[14,20,7],[21,25,5]];rows.forEach((r,ri)=>{let [s,e,n]=r;for(let i=s;i<=e;i++){let col=i-s;let x=(ri<3?4.3+col*13.7:4.4+col*17.7);let y=[18.8,42.1,65.2,85.5][ri];coords[i]=[x,y]}});cards.forEach((c,i)=>{let h=document.createElement('button');h.className='hot';h.title=`${c.letter} ${c.word}`;h.style.left=coords[i][0]+'%';h.style.top=coords[i][1]+'%';h.onclick=e=>{e.stopPropagation();openLetter(i)};$('posterHotspots').appendChild(h)});
 const pos=[['0%','2%','-8deg'],['36%','0%','6deg'],['64%','5%','-5deg'],['18%','26%','7deg'],['51%','24%','-8deg'],['76%','29%','6deg'],['4%','51%','-5deg'],['35%','48%','8deg'],['65%','52%','-7deg'],['18%','74%','7deg'],['47%','72%','-5deg'],['72%','76%','5deg'],['36%','100%','-8deg']];for(let p=0;p<13;p++){let b=document.createElement('button');b.className='miniCard loading';b.style.setProperty('--x',pos[p][0]);b.style.setProperty('--y',pos[p][1]);b.style.setProperty('--r',pos[p][2]);b.style.setProperty('--d',p*.04+'s');b.innerHTML=`<img data-src="${cards[p*2].img}" loading="lazy" alt="${cards[p*2].letter}/${cards[p*2+1].letter}">`;b.onclick=()=>openLetter(p*2);$('pile').appendChild(b)}setupLazy();
 $('randomBtn').onclick=()=>openLetter(Math.floor(Math.random()*26));$('favoritesBtn').onclick=favModal;$('achievementBtn').onclick=()=>achievement(false);$('shareBtn').onclick=()=>shareModal();$('homeBtn').onclick=()=>show('deskScene');$('prevBtn').onclick=()=>moveTo(current-1);$('nextBtn').onclick=()=>moveTo(current+1);$('flipBtn').onclick=()=>moveTo(pair(current)*2+(side(current)?0:1));$('bigCard').onclick=$('flipBtn').onclick;$('letterSoundBtn').onclick=()=>speak(cards[current].letter);$('wordSoundBtn').onclick=()=>speak(cards[current].word);$('favBtn').onclick=()=>{favorites.has(current)?favorites.delete(current):favorites.add(current);save();openLetter(current)};$('searchInput').onkeydown=e=>{if(e.key==='Enter')search(e.target.value)};$('searchInput').oninput=e=>{let v=e.target.value.trim();if(/^[a-z]$/i.test(v))search(v)};$('closeModal').onclick=()=>$('modal').close();document.onkeydown=e=>{if($('viewer').classList.contains('active')){if(e.key==='ArrowRight')moveTo(current+1);if(e.key==='ArrowLeft')moveTo(current-1);if(e.key===' ')e.preventDefault(),$('flipBtn').click();if(e.key==='Escape')show('deskScene')}}
}
init();
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
