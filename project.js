const root=document.getElementById('projectPage');
const id=Number(new URLSearchParams(location.search).get('id'));
const p=projects.find(x=>x.number===id);
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const bullets=a=>(a||[]).map(x=>`<li>${esc(x)}</li>`).join('');
if(!p){root.innerHTML='<div class="notice">Project not found. <a href="index.html#projects">Return to projects</a>.</div>'}
else{
 const index=projects.findIndex(x=>x.number===p.number),prev=projects[index-1],next=projects[index+1];
 document.title=`${p.title} | EDUEME × EDIFY Robotics Expo`;
 const tagline=p.tagline||'Young minds. Bold ideas. Smarter tomorrow.';
 root.innerHTML=`
 <div class="project-topbar"><a class="back-link" href="index.html#projects">← BACK TO PROJECTS</a><div><span>PROJECT ${String(p.number).padStart(2,'0')}</span><a href="qr.html">QR CODE ↗</a></div></div>
 <section class="project-hero-new">
   <div class="project-photo-wrap"><span class="photo-corner tl"></span><span class="photo-corner tr"></span><span class="photo-corner bl"></span><span class="photo-corner br"></span><img src="${p.image}" alt="${esc(p.title)}"></div>
   <div class="project-intro"><p class="project-kicker">PROJECT ${String(p.number).padStart(2,'0')} / ${esc(p.category)}</p><h1>${esc(p.title)}</h1><div class="students-line">◉ <strong>${esc(p.students)}</strong> <span>${esc(p.grade)}</span></div><p class="lead">${esc(p.description)}</p><div class="intro-actions"><button class="share-btn" id="shareBtn">↗ SHARE PROJECT</button><a class="share-btn" href="qr.html">⌁ QR CODE</a></div></div>
 </section>
 <section class="project-story">
   <div class="story-main">
    <div class="detail-section"><div class="section-index">01</div><div><p class="eyebrow">THE IDEA</p><h2>Why this project matters</h2><p>${esc(p.problem)}</p><p>${esc(p.why||'This project turns a simple everyday challenge into an opportunity to explore sensing, control, automation and practical engineering.')}</p></div></div>
    <div class="detail-section"><div class="section-index">02</div><div><p class="eyebrow">THE SOLUTION</p><h2>Our approach</h2><p>${esc(p.solution)}</p></div></div>
    <div class="detail-section"><div class="section-index">03</div><div><p class="eyebrow">SYSTEM LOGIC</p><h2>How it works</h2><ol class="working-list">${(p.working||[]).map((x,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span>${esc(x)}</li>`).join('')}</ol></div></div>
   </div>
   <aside class="project-sidebar"><div class="side-module"><p class="eyebrow">BUILD DATA</p><h3>What went into it</h3><ul>${bullets(p.components)}</ul></div><div class="side-module"><p class="eyebrow">MAKING IT</p><h3>How we built it</h3><p>${esc(p.build)}</p></div><div class="side-module"><p class="eyebrow">WHERE IT CAN HELP</p><h3>Applications</h3><ul>${bullets(p.applications)}</ul></div></aside>
 </section>
 <section class="future-section"><div><p class="eyebrow">04 / FUTURE SCOPE</p><h2>Where could it go next?</h2><p>${esc(p.future||'With further development, this prototype could become more accurate, reliable and useful in real-world environments. Students can extend the system with smarter sensing, better automation, improved safety and a more polished user experience.')}</p></div><div class="future-orbit"><span>UPGRADE</span><i>↗</i></div></section>
 <section class="tagline-section"><p class="eyebrow">PROJECT SIGNATURE</p><div class="quote-mark">“</div><h2>${esc(tagline)}</h2><p>Built with curiosity. Shared with pride.</p></section>
 <section class="project-feedback">
   <div class="project-feedback-copy"><p class="eyebrow">VISITOR SIGNAL</p><h2>WHAT DID YOU THINK<br><span>ABOUT THIS PROJECT?</span></h2><p>Your feedback helps our young innovators understand what connected with visitors and where their ideas can grow next.</p></div>
   <div class="project-feedback-form-wrap"><div id="feedbackMount"></div></div>
 </section>
 <div class="project-nav">${prev?`<a href="project.html?id=${prev.number}">← ${esc(prev.title)}</a>`:'<span></span>'}<a href="index.html#projects">ALL PROJECTS</a>${next?`<a href="project.html?id=${next.number}">${esc(next.title)} →</a>`:'<span></span>'}</div>`;
 initFeedbackForm(p.title);
 document.getElementById('shareBtn').addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title:p.title,text:`${p.title} — ${p.students}`,url:location.href});else{await navigator.clipboard.writeText(location.href);alert('Project link copied.')}}catch(e){}});
}
