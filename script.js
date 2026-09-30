const API="https://hybrid-ids-security-monitoring-system.onrender.com";
const dot=document.querySelector("#dot"),statusEl=document.querySelector("#status"),results=document.querySelector("#results"),empty=document.querySelector("#empty"),count=document.querySelector("#count");
let sent=0;

const scenarios={
portscan:{name:"Port Scan",body:{source_ip:"10.10.10.50",destination_ip:"192.168.1.10",protocol:"TCP",source_port:45000,destination_port:22,failed_logins:0,metadata:{unique_ports:15,test:"attack-simulator-port-scan"}}},
bruteforce:{name:"Brute Force",body:{source_ip:"10.20.30.40",destination_ip:"192.168.1.10",protocol:"TCP",source_port:50000,destination_port:22,failed_logins:15,metadata:{test:"attack-simulator-bruteforce"}}},
http:{name:"Suspicious HTTP",body:{source_ip:"10.30.40.50",destination_ip:"192.168.1.20",protocol:"TCP",source_port:51000,destination_port:80,failed_logins:0,event_type:"SUSPICIOUS_HTTP",metadata:{test:"attack-simulator-suspicious-http"}}},
anomaly:{name:"ML Anomaly",body:{source_ip:"172.16.50.77",destination_ip:"192.168.1.200",protocol:"UDP",source_port:62000,destination_port:9999,failed_logins:0,packet_count:5000,byte_count:5000000,metadata:{test:"attack-simulator-ml-anomaly"}}}
};

async function health(){
  dot.className=""; statusEl.textContent="Checking backend…";
  try{const r=await fetch(API+"/api/health",{cache:"no-store"});const d=await r.json();if(!r.ok)throw Error(d.detail||"Health check failed");dot.className="on";statusEl.textContent="Backend online · "+(d.status||"healthy")}
  catch(e){dot.className="off";statusEl.textContent="Backend unavailable · "+e.message}
}
function addResult(name,ok,data){
  empty.style.display="none";
  const el=document.createElement("article");el.className="result";
  const threat=data?.signature_detection?.threat_type||(data?.anomaly_detection?.is_anomaly?"ANOMALY":"NORMAL");
  const risk=data?.risk_score??"—";
  el.innerHTML=`<div class="resulthead"><strong>${name} <span class="pill ${ok?"":"err"}">${ok?"SENT":"ERROR"}</span></strong><span>${new Date().toLocaleTimeString()}</span></div><div class="resultbody">Event ID: ${data?.event_id??"—"} · Detection: ${threat} · Risk: ${risk}<pre></pre></div>`;
  el.querySelector("pre").textContent=JSON.stringify(data,null,2);
  results.prepend(el);
}
async function simulate(key){
  const s=scenarios[key], buttons=document.querySelectorAll("button");buttons.forEach(b=>b.disabled=true);
  try{
    const r=await fetch(API+"/api/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s.body)});
    const text=await r.text();let d;try{d=JSON.parse(text)}catch{d={raw_response:text}};
    if(!r.ok)throw Error(d.detail||d.message||`HTTP ${r.status}`);
    sent++;count.textContent=`${sent} event${sent===1?"":"s"} sent`;addResult(s.name,true,d);
  }catch(e){addResult(s.name,false,{message:e.message})}
  finally{buttons.forEach(b=>b.disabled=false)}
}
document.querySelectorAll("[data-key]").forEach(b=>b.onclick=()=>simulate(b.dataset.key));
document.querySelector("#health").onclick=health;
document.querySelector("#clear").onclick=()=>{results.innerHTML="";empty.style.display="flex";sent=0;count.textContent="0 events sent"};
document.querySelector("#all").onclick=async()=>{const b=document.querySelector("#all");b.disabled=true;for(const k of ["portscan","bruteforce","http","anomaly"]){await simulate(k);await new Promise(r=>setTimeout(r,700))}b.disabled=false};
health();
