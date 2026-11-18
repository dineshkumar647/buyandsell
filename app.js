const KEY="reuse_market_listings_v1";
const seed=[
{id:1,name:"Wireless Headphones",category:"Electronics",price:1200,condition:"Good",description:"Good sound quality. Gently used and working well.",seller:"Arun",phone:"9876543210",emoji:"🎧",image:"",time:Date.now()-100000},
{id:2,name:"Study Table",category:"Furniture",price:1800,condition:"Like new",description:"Compact wooden study table. No major scratches.",seller:"Priya",phone:"9876501234",emoji:"🪑",image:"",time:Date.now()-200000},
{id:3,name:"Engineering Mathematics Book",category:"Books",price:250,condition:"Good",description:"Useful reference book. Pages are in good condition.",seller:"Karthik",phone:"9876512340",emoji:"📚",image:"",time:Date.now()-300000},
{id:4,name:"Mountain Bicycle",category:"Vehicles",price:4500,condition:"Fair",description:"Used bicycle suitable for daily rides.",seller:"Ravi",phone:"9876523450",emoji:"🚲",image:"",time:Date.now()-400000},
{id:5,name:"Denim Jacket",category:"Fashion",price:650,condition:"Like new",description:"Comfortable jacket, used only a few times.",seller:"Meena",phone:"9876534560",emoji:"🧥",image:"",time:Date.now()-500000},
{id:6,name:"Gaming Controller",category:"Others",price:900,condition:"Good",description:"Controller in working condition.",seller:"Vijay",phone:"9876545670",emoji:"🎮",image:"",time:Date.now()-600000}
];
function getListings(){let saved=localStorage.getItem(KEY);if(!saved){localStorage.setItem(KEY,JSON.stringify(seed));return seed}try{return JSON.parse(saved)}catch{return seed}}
function saveListings(items){localStorage.setItem(KEY,JSON.stringify(items))}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function card(p){let visual=p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.display='none';this.parentElement.textContent='${p.emoji||"📦"}'">`:(p.emoji||"📦");return `<article class="product-card"><div class="product-image">${visual}</div><div class="product-body"><div class="product-top"><span class="condition">${esc(p.condition)}</span><span class="category-label">${esc(p.category)}</span></div><h3>${esc(p.name)}</h3><p class="product-desc">${esc(p.description)}</p><div class="price-row"><strong class="price">₹${Number(p.price).toLocaleString("en-IN")}</strong><button class="details-btn" data-contact="${p.id}">View seller</button></div><div class="seller">Listed by ${esc(p.seller)}</div></div></article>`}
function renderHome(){let el=document.getElementById("homeListings");if(el)el.innerHTML=getListings().sort((a,b)=>b.time-a.time).slice(0,3).map(card).join("")}
function renderBuy(){
 let el=document.getElementById("buyListings");if(!el)return;
 let all=getListings(),q=(document.getElementById("searchInput").value||"").toLowerCase(),cat=document.getElementById("categoryFilter").value,sort=document.getElementById("sortFilter").value;
 let items=all.filter(p=>(p.name+" "+p.description+" "+p.category).toLowerCase().includes(q)&&(cat==="All"||p.category===cat));
 if(sort==="low")items.sort((a,b)=>a.price-b.price);else if(sort==="high")items.sort((a,b)=>b.price-a.price);else items.sort((a,b)=>b.time-a.time);
 document.getElementById("listingCount").textContent=items.length+" product(s) found";
 el.innerHTML=items.length?items.map(card).join(""):`<div class="empty">No products found. Try another search or category.</div>`;
}
function toast(msg){let t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
document.addEventListener("click",e=>{let b=e.target.closest("[data-contact]");if(!b)return;let p=getListings().find(x=>x.id==b.dataset.contact);if(p)alert("Product: "+p.name+"\\nPrice: ₹"+p.price+"\\nSeller: "+p.seller+"\\nContact: "+p.phone+"\\n\\nDemo only: contact details are sample data. Do not make payments outside trusted channels.")});
let form=document.getElementById("sellForm");
if(form)form.addEventListener("submit",e=>{e.preventDefault();let d=new FormData(form),items=getListings();let p={id:Date.now(),name:d.get("name").trim(),category:d.get("category"),price:Number(d.get("price")),condition:d.get("condition"),description:d.get("description").trim(),seller:d.get("seller").trim(),phone:d.get("phone"),image:d.get("image").trim(),emoji:({Electronics:"📱",Furniture:"🪑",Books:"📚",Fashion:"👕",Vehicles:"🚲",Others:"📦"})[d.get("category")],time:Date.now()};items.push(p);saveListings(items);form.reset();toast("Product published successfully!");setTimeout(()=>location.href="buy.html",900)});
["searchInput","categoryFilter","sortFilter"].forEach(id=>{let el=document.getElementById(id);if(el)el.addEventListener("input",renderBuy)});
let categoryParam=new URLSearchParams(location.search).get("category");if(categoryParam&&document.getElementById("categoryFilter"))document.getElementById("categoryFilter").value=categoryParam;
renderHome();renderBuy();
