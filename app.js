const grid=document.getElementById('projectGrid');
const filters=document.getElementById('filters');
const cats=['All',...new Set(projects.map(p=>p.category))];
let active='All';
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function render(){
 const list=projects.filter(p=>active==='All'||p.category===active);
 grid.innerHTML=list.map((p,i)=>`<article class="card" style="--delay:${i*55}ms"><a href="project.html?id=${p.number}"><div class="card-media"><img src="${p.image}" alt="${esc(p.title)}" onerror="this.style.display='none'"><span class="scanline"></span><span class="number">${String(p.number).padStart(2,'0')}</span><span class="corner tl"></span><span class="corner br"></span></div><div class="card-body"><span class="tag">${esc(p.category)}</span><h3>${esc(p.title)}</h3><div class="students">${esc(p.students)}</div><p>${esc(p.description)}</p><span class="view">EXPLORE PROJECT <b>→</b></span></div></a></article>`).join('');
 document.getElementById('projectCount').textContent=projects.length;
}
filters.innerHTML=cats.map(c=>`<button class="filter ${c===active?'active':''}">${esc(c)}</button>`).join('');
filters.addEventListener('click',e=>{if(!e.target.classList.contains('filter'))return;active=e.target.textContent;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===e.target));render();});
render();
