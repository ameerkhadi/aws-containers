import { useState, useEffect, useRef } from "react";

const S = {
  bg:"#050D1A",bg2:"#071320",bg3:"#0A1929",bg4:"#0D2137",
  teal:"#00D4AA",teal2:"#00B894",tdim:"rgba(0,212,170,.13)",
  orange:"#FF9900",odim:"rgba(255,153,0,.12)",
  blue:"#4FC3F7",red:"#FF6B6B",green:"#69F0AE",purple:"#A78BFA",
  text:"#E8F4FD",text2:"#A8C8E8",text3:"#5A8AAA",
  bdr:"rgba(0,212,170,.18)",bdr2:"rgba(255,153,0,.18)",
  card:"rgba(10,25,41,.9)",card2:"rgba(7,19,32,.95)"
};

const css = (obj)=>Object.entries(obj).map(([k,v])=>`${k.replace(/([A-Z])/g,"-$1").toLowerCase()}:${v}`).join(";");

/* ─── tiny helpers ─── */
const Badge=({children,color=S.teal})=>(
  <span style={{display:"inline-block",background:`${color}22`,border:`1px solid ${color}55`,
    borderRadius:20,padding:"2px 12px",fontSize:13,color,fontWeight:600,marginRight:6,marginBottom:4}}>
    {children}
  </span>
);
const InfoBox=({type="tip",children})=>{
  const [icon,col]=type==="tip"?["💡",S.teal]:type==="warn"?["⚠️",S.orange]:["🔑",S.purple];
  return(
    <div style={{background:`${col}11`,border:`1px solid ${col}33`,borderRadius:10,padding:"14px 18px",
      margin:"16px 0",fontSize:16,color:S.text2,display:"flex",gap:12,alignItems:"flex-start"}}>
      <span style={{fontSize:20,flexShrink:0}}>{icon}</span><div>{children}</div>
    </div>
  );
};
const AR=({children})=>(
  <div style={{fontFamily:"'Cairo',sans-serif",direction:"rtl",textAlign:"right",
    color:S.teal,fontSize:17,background:S.tdim,border:`1px solid ${S.bdr}`,
    borderRadius:8,padding:"10px 16px",margin:"10px 0"}}>
    {children}
  </div>
);
const KT=({points})=>(
  <div style={{background:`${S.teal}0D`,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"18px 22px",margin:"24px 0"}}>
    <div style={{color:S.teal,fontWeight:700,fontSize:18,marginBottom:12}}>📌 Key Takeaways</div>
    {points.map((p,i)=>(
      <div key={i} style={{display:"flex",gap:10,marginBottom:8,color:S.text2,fontSize:16}}>
        <span style={{color:S.teal,fontWeight:700,flexShrink:0}}>✓</span><span>{p}</span>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════
   DIAGRAM 1 — Container vs VM
═══════════════════════════════════════════════ */
function DiagramContainerVsVM(){
  const [step,setStep]=useState(-1);
  const [auto,setAuto]=useState(false);
  const timerRef=useRef(null);
  const steps=[
    {title:"Virtual Machine Approach",desc:"Each app runs in its own full VM with a complete OS — wasteful and heavy.",
     highlight:["vm1","vm2","vm3"],dim:["c1","c2","c3","docker","ceng"]},
    {title:"Container Approach",desc:"All 3 apps share ONE guest OS via Docker engine — lightweight, fast startup (milliseconds).",
     highlight:["c1","c2","c3","docker","ceng"],dim:["vm1","vm2","vm3"]},
    {title:"Hypervisor Layer",desc:"VMs rely on a hypervisor (AWS Infrastructure). Each VM needs its own OS — GBs of overhead.",
     highlight:["hyp","hyp2"],dim:[]},
    {title:"Docker Engine",desc:"Docker engine on the guest OS manages containers. Containers share the kernel — much smaller.",
     highlight:["docker","ceng"],dim:["vm1","vm2","vm3"]},
  ];
  useEffect(()=>{
    if(auto){timerRef.current=setInterval(()=>setStep(s=>(s+1)%steps.length),2200);}
    return()=>clearInterval(timerRef.current);
  },[auto]);
  const hl=(id)=>step>=0&&steps[step].highlight.includes(id)?"0 0 0 2px "+S.teal+", 0 0 14px "+S.teal+"66":"none";
  const op=(id)=>step>=0&&steps[step].dim.includes(id)?0.28:1;

  return(
    <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:14,padding:"20px 18px",margin:"24px 0"}}>
      <div style={{color:S.teal,fontWeight:700,fontSize:17,marginBottom:16,textAlign:"center"}}>
        🐳 Container vs Virtual Machine Architecture
      </div>
      <svg width="100%" viewBox="0 0 860 340" style={{display:"block"}}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke={S.teal} strokeWidth="1.5" strokeLinecap="round"/>
          </marker>
        </defs>

        {/* LABELS */}
        <text x="200" y="22" textAnchor="middle" fill={S.text2} fontSize="14" fontWeight="700">VM-Based Deployment</text>
        <text x="640" y="22" textAnchor="middle" fill={S.text2} fontSize="14" fontWeight="700">Container-Based Deployment</text>

        {/* === LEFT: VM side === */}
        {/* AWS Infra / Hypervisor */}
        <g id="hyp" style={{opacity:op("hyp"),transition:"opacity .4s"}}>
          <rect x="30" y="290" width="340" height="34" rx="6" fill="#0D2137" stroke={S.bdr2} strokeWidth="1"/>
          <text x="200" y="312" textAnchor="middle" fill={S.orange} fontSize="13" fontWeight="600">AWS Infrastructure / Hypervisor</text>
        </g>
        {/* 3 VMs */}
        {[0,1,2].map(i=>{
          const x=40+i*112;
          return(
            <g key={i} id={"vm"+i} style={{opacity:op("vm"+i),transition:"opacity .4s",filter:`drop-shadow(${hl("vm"+i)})`}}>
              <rect x={x} y="35" width="100" height="250" rx="8" fill={S.bg4} stroke={S.bdr2} strokeWidth="1"/>
              <rect x={x+2} y="37" width="96" height="32" rx="6" fill={`${S.orange}22`}/>
              <text x={x+50} y="58" textAnchor="middle" fill={S.orange} fontSize="12" fontWeight="700">App {i+1}</text>
              <rect x={x+6} y="76" width="88" height="22" rx="4" fill={`${S.blue}22`}/>
              <text x={x+50} y="92" textAnchor="middle" fill={S.blue} fontSize="11">Bins/Libs</text>
              <rect x={x+6} y="104" width="88" height="40" rx="4" fill={`${S.purple}22`}/>
              <text x={x+50} y="120" textAnchor="middle" fill={S.purple} fontSize="11" fontWeight="600">Guest OS</text>
              <text x={x+50} y="136" textAnchor="middle" fill={S.text3} fontSize="10">(full OS copy)</text>
              <rect x={x+6} y="150" width="88" height="30" rx="4" fill={`${S.green}15`}/>
              <text x={x+50} y="170" textAnchor="middle" fill={S.green} fontSize="11">VM Image</text>
              <text x={x+50} y="218" textAnchor="middle" fill={S.text3} fontSize="10">{["~2 GB","~1.8 GB","~2.2 GB"][i]}</text>
              <text x={x+50} y="234" textAnchor="middle" fill={S.text3} fontSize="10">startup: minutes</text>
              <rect x={x+10} y="242" width="80" height="20" rx="10" fill={S.odim}/>
              <text x={x+50} y="257" textAnchor="middle" fill={S.orange} fontSize="10" fontWeight="600">HEAVY ⚠️</text>
            </g>
          );
        })}

        {/* === RIGHT: Container side === */}
        {/* Single EC2 Instance */}
        <g>
          <rect x="450" y="35" width="380" height="290" rx="10" fill={S.bg4} stroke={S.bdr} strokeWidth="1"/>
          <text x="640" y="56" textAnchor="middle" fill={S.text2} fontSize="12">Single EC2 Instance</text>
        </g>
        {/* Guest OS */}
        <g id="ceng" style={{opacity:op("ceng"),transition:"opacity .4s",filter:`drop-shadow(${hl("ceng")})`}}>
          <rect x="458" y="245" width="364" height="36" rx="6" fill={`${S.purple}22`} stroke={`${S.purple}44`} strokeWidth="1"/>
          <text x="640" y="268" textAnchor="middle" fill={S.purple} fontSize="12" fontWeight="600">Linux Guest OS (kernel shared)</text>
        </g>
        {/* Docker Engine */}
        <g id="docker" style={{opacity:op("docker"),transition:"opacity .4s",filter:`drop-shadow(${hl("docker")})`}}>
          <rect x="458" y="202" width="364" height="36" rx="6" fill={`${S.teal}22`} stroke={S.bdr} strokeWidth="1"/>
          <text x="640" y="225" textAnchor="middle" fill={S.teal} fontSize="12" fontWeight="600">🐳 Docker Engine</text>
        </g>
        {/* 3 Containers */}
        {[0,1,2].map(i=>{
          const x=462+i*124;
          return(
            <g key={i} id={"c"+(i+1)} style={{opacity:op("c"+(i+1)),transition:"opacity .4s",filter:`drop-shadow(${hl("c"+(i+1))})`}}>
              <rect x={x} y="66" width="112" height="128" rx="8" fill={S.bg3} stroke={S.bdr} strokeWidth="1"/>
              <rect x={x+2} y="68" width="108" height="28" rx="6" fill={`${S.orange}22`}/>
              <text x={x+56} y="87" textAnchor="middle" fill={S.orange} fontSize="12" fontWeight="700">App {i+1}</text>
              <rect x={x+6} y="103" width="100" height="22" rx="4" fill={`${S.blue}22`}/>
              <text x={x+56} y="119" textAnchor="middle" fill={S.blue} fontSize="11">Bins/Libs only</text>
              <text x={x+56} y="154" textAnchor="middle" fill={S.text3} fontSize="10">{["~150 MB","~120 MB","~180 MB"][i]}</text>
              <text x={x+56} y="170" textAnchor="middle" fill={S.text3} fontSize="10">startup: ms</text>
              <rect x={x+16} y="178" width="80" height="18" rx="9" fill={S.tdim}/>
              <text x={x+56} y="191" textAnchor="middle" fill={S.teal} fontSize="10" fontWeight="600">LIGHT ✓</text>
            </g>
          );
        })}
        {/* Hypervisor right */}
        <g id="hyp2" style={{opacity:op("hyp2"),transition:"opacity .4s",filter:`drop-shadow(${hl("hyp2")})`}}>
          <rect x="450" y="290" width="380" height="34" rx="6" fill="#0D2137" stroke={S.bdr2} strokeWidth="1"/>
          <text x="640" y="312" textAnchor="middle" fill={S.orange} fontSize="13" fontWeight="600">AWS Infrastructure / Hypervisor</text>
        </g>

        {/* VS divider */}
        <text x="432" y="185" textAnchor="middle" fill={S.text3} fontSize="18" fontWeight="900">VS</text>
        <line x1="432" y1="30" x2="432" y2="330" stroke={S.bdr} strokeWidth="1" strokeDasharray="4 4"/>
      </svg>

      {/* Controls */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginTop:12}}>
        {steps.map((s,i)=>(
          <button key={i} onClick={()=>{setStep(i);setAuto(false);}}
            style={{background:step===i?S.tdim:"transparent",border:`1px solid ${step===i?S.teal:S.bdr}`,
              borderRadius:20,padding:"6px 14px",color:step===i?S.teal:S.text2,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
            ① ② ③ ④[{i}] Step {i+1}
          </button>
        ))}
        <button onClick={()=>setAuto(a=>!a)}
          style={{background:auto?S.odim:"transparent",border:`1px solid ${auto?S.orange:S.bdr}`,
            borderRadius:20,padding:"6px 14px",color:auto?S.orange:S.text2,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
          {auto?"⏹ Stop":"▶ Auto"}
        </button>
        <button onClick={()=>{setStep(-1);setAuto(false);}}
          style={{background:"transparent",border:`1px solid ${S.bdr}`,borderRadius:20,
            padding:"6px 14px",color:S.text2,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>↺ Reset</button>
      </div>
      {step>=0&&(
        <div style={{background:S.bg4,border:`1px solid ${S.bdr}`,borderRadius:10,padding:"14px 18px",marginTop:12}}>
          <div style={{color:S.teal,fontWeight:700,fontSize:16,marginBottom:6}}>Step {step+1}: {steps[step].title}</div>
          <div style={{color:S.text2,fontSize:15}}>{steps[step].desc}</div>
        </div>
      )}
      {step<0&&<div style={{color:S.text3,textAlign:"center",fontSize:14,marginTop:10}}>Click a step to highlight components</div>}
      <div style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:12,justifyContent:"center",fontSize:13,color:S.text3}}>
        <span><span style={{color:S.orange}}>■</span> App</span>
        <span><span style={{color:S.blue}}>■</span> Libraries</span>
        <span><span style={{color:S.purple}}>■</span> OS / Guest OS</span>
        <span><span style={{color:S.teal}}>■</span> Docker Engine</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DIAGRAM 2 — ECS Architecture
═══════════════════════════════════════════════ */
function DiagramECS(){
  const [step,setStep]=useState(-1);
  const steps=[
    {title:"Task Definition",desc:"You write a task definition (JSON) describing which containers to use, ports to open, and memory/CPU needed.",
     hl:["taskdef"],tech:"Max 10 containers per task definition"},
    {title:"ECS Cluster Created",desc:"An ECS Cluster is provisioned — either EC2 instances running the ECS Agent, or managed by Fargate.",
     hl:["cluster"],tech:"Cluster = group of EC2 instances or Fargate"},
    {title:"Tasks Scheduled",desc:"ECS Scheduler places tasks (containers) across the cluster based on resource availability.",
     hl:["task1","task2","task3"],tech:"Scheduler finds best host for each task"},
    {title:"ECR Pulls Image",desc:"Each container pulls its Docker image from Amazon ECR (Elastic Container Registry).",
     hl:["ecr","task1","task2","task3"],tech:"Images transferred via HTTPS, encrypted at rest"},
    {title:"Load Balancer Routes Traffic",desc:"Application Load Balancer routes incoming requests to healthy tasks across the cluster.",
     hl:["alb","task1","task2","task3"],tech:"Supports dynamic port mapping"},
  ];
  const hl=(id)=>step>=0&&steps[step].hl.includes(id);
  const op=(id)=>step<0?1:hl(id)?1:0.25;
  const glow=(id)=>hl(id)?`0 0 0 2px ${S.teal}, 0 0 16px ${S.teal}66`:"none";

  return(
    <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:14,padding:"20px 18px",margin:"24px 0"}}>
      <div style={{color:S.teal,fontWeight:700,fontSize:17,marginBottom:16,textAlign:"center"}}>
        🚀 Amazon ECS Architecture — Step by Step
      </div>
      <svg width="100%" viewBox="0 0 860 400">
        <defs>
          <marker id="arECS" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke={S.teal} strokeWidth="1.8" strokeLinecap="round"/>
          </marker>
        </defs>
        {/* Developer */}
        <g style={{opacity:op("taskdef"),transition:"opacity .4s",filter:`drop-shadow(${glow("taskdef")})`}}>
          <rect x="20" y="160" width="140" height="70" rx="10" fill={S.bg4} stroke={step>=0&&hl("taskdef")?S.teal:S.bdr} strokeWidth={hl("taskdef")?2:1}/>
          <text x="90" y="188" textAnchor="middle" fill={S.text2} fontSize="12" fontWeight="700">📄 Task Definition</text>
          <text x="90" y="205" textAnchor="middle" fill={S.text3} fontSize="10">JSON blueprint</text>
          <text x="90" y="220" textAnchor="middle" fill={S.text3} fontSize="10">max 10 containers</text>
        </g>
        <path d="M160 195 L220 195" stroke={S.teal} strokeWidth="1.5" fill="none" markerEnd="url(#arECS)" strokeDasharray={step>=0?"none":"4 3"}/>

        {/* ECS Cluster box */}
        <g style={{opacity:op("cluster"),transition:"opacity .4s",filter:`drop-shadow(${glow("cluster")})`}}>
          <rect x="220" y="40" width="430" height="330" rx="12" fill={`${S.blue}08`} stroke={step>=0&&hl("cluster")?S.blue:`${S.blue}33`} strokeWidth={hl("cluster")?2:1} strokeDasharray="6 3"/>
          <text x="435" y="68" textAnchor="middle" fill={S.blue} fontSize="13" fontWeight="700">ECS Cluster</text>
          <text x="435" y="86" textAnchor="middle" fill={S.text3} fontSize="11">EC2 instances running ECS Container Agent</text>
        </g>

        {/* 3 EC2 instances inside cluster */}
        {[0,1,2].map(i=>{
          const x=234+i*140, id="task"+(i+1);
          return(
            <g key={i} id={id} style={{opacity:op(id),transition:"opacity .4s",filter:`drop-shadow(${glow(id)})`}}>
              <rect x={x} y="100" width="126" height="240" rx="8" fill={S.bg4} stroke={step>=0&&hl(id)?S.teal:S.bdr} strokeWidth={hl(id)?2:1}/>
              <text x={x+63} y="122" textAnchor="middle" fill={S.text2} fontSize="11" fontWeight="700">EC2 Instance {i+1}</text>
              <text x={x+63} y="138" textAnchor="middle" fill={S.text3} fontSize="10">ECS Agent running</text>
              {/* Task */}
              <rect x={x+8} y="148" width="110" height="60" rx="6" fill={`${S.orange}20`} stroke={`${S.orange}44`} strokeWidth="1"/>
              <text x={x+63} y="168" textAnchor="middle" fill={S.orange} fontSize="11" fontWeight="700">Task</text>
              <text x={x+63} y="183" textAnchor="middle" fill={S.text3} fontSize="10">Container A</text>
              <text x={x+63} y="198" textAnchor="middle" fill={S.text3} fontSize="10">Container B</text>
              {/* Ports */}
              <rect x={x+8} y="220" width="110" height="28" rx="4" fill={`${S.teal}18`}/>
              <text x={x+63} y="239" textAnchor="middle" fill={S.teal} fontSize="10">Port: {8080+i*2}</text>
              {/* CPU/Mem */}
              <text x={x+63} y="272" textAnchor="middle" fill={S.text3} fontSize="10">CPU: {256+i*128} units</text>
              <text x={x+63} y="288" textAnchor="middle" fill={S.text3} fontSize="10">Mem: {512+i*256} MB</text>
              <text x={x+63} y="326" textAnchor="middle" fill={S.green} fontSize="10">● HEALTHY</text>
            </g>
          );
        })}

        {/* ECR */}
        <g style={{opacity:op("ecr"),transition:"opacity .4s",filter:`drop-shadow(${glow("ecr")})`}}>
          <rect x="680" y="100" width="160" height="80" rx="10" fill={S.bg4} stroke={step>=0&&hl("ecr")?S.purple:`${S.purple}44`} strokeWidth={hl("ecr")?2:1}/>
          <text x="760" y="132" textAnchor="middle" fill={S.purple} fontSize="13" fontWeight="700">📦 Amazon ECR</text>
          <text x="760" y="150" textAnchor="middle" fill={S.text3} fontSize="11">Docker Registry</text>
          <text x="760" y="166" textAnchor="middle" fill={S.text3} fontSize="10">Encrypted at rest (S3)</text>
        </g>
        <path d="M680 140 L658 140" stroke={S.purple} strokeWidth="1.5" fill="none" markerEnd="url(#arECS)" strokeDasharray={step>=0&&hl("ecr")?"none":"4 3"}/>

        {/* ALB */}
        <g style={{opacity:op("alb"),transition:"opacity .4s",filter:`drop-shadow(${glow("alb")})`}}>
          <rect x="680" y="220" width="160" height="80" rx="10" fill={S.bg4} stroke={step>=0&&hl("alb")?S.orange:`${S.orange}44`} strokeWidth={hl("alb")?2:1}/>
          <text x="760" y="252" textAnchor="middle" fill={S.orange} fontSize="13" fontWeight="700">⚖️ App Load</text>
          <text x="760" y="270" textAnchor="middle" fill={S.orange} fontSize="13" fontWeight="700">Balancer</text>
          <text x="760" y="288" textAnchor="middle" fill={S.text3} fontSize="10">Routes to healthy tasks</text>
        </g>
        <path d="M680 260 L658 260" stroke={S.orange} strokeWidth="1.5" fill="none" markerEnd="url(#arECS)" strokeDasharray={step>=0&&hl("alb")?"none":"4 3"}/>

        {/* Internet user */}
        <text x="840" y="265" textAnchor="middle" fill={S.text3} fontSize="22">🌐</text>
        <path d="M840 255 L840 248" stroke={S.orange} strokeWidth="1" fill="none"/>
      </svg>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginTop:4}}>
        {steps.map((s,i)=>(
          <button key={i} onClick={()=>setStep(step===i?-1:i)}
            style={{background:step===i?S.tdim:"transparent",border:`1px solid ${step===i?S.teal:S.bdr}`,
              borderRadius:20,padding:"6px 14px",color:step===i?S.teal:S.text2,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
            Step {i+1}
          </button>
        ))}
        <button onClick={()=>setStep(-1)} style={{background:"transparent",border:`1px solid ${S.bdr}`,borderRadius:20,padding:"6px 14px",color:S.text2,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>↺ Reset</button>
      </div>
      {step>=0&&(
        <div style={{background:S.bg4,border:`1px solid ${S.bdr}`,borderRadius:10,padding:"14px 18px",marginTop:10}}>
          <div style={{color:S.teal,fontWeight:700,fontSize:16,marginBottom:4}}>Step {step+1}: {steps[step].title}</div>
          <div style={{color:S.text2,fontSize:15,marginBottom:6}}>{steps[step].desc}</div>
          <code style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:S.orange,background:S.bg2,padding:"4px 10px",borderRadius:6}}>⚙ {steps[step].tech}</code>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DIAGRAM 3 — Fargate vs EC2 Launch Types
═══════════════════════════════════════════════ */
function DiagramLaunchTypes(){
  const [sel,setSel]=useState(null);
  const types=[
    {id:"fargate",icon:"⚡",name:"Fargate Launch Type",color:S.teal,
     you:["Package app in containers","Define CPU & Memory","Set networking & IAM","Launch application"],
     aws:["Provision cluster","Configure servers","Scale cluster","Patch OS & runtime","Manage infrastructure"],
     best:"Focus on app code, not infrastructure"},
    {id:"ec2",icon:"🖥️",name:"EC2 Launch Type",color:S.orange,
     you:["Provision EC2 instances","Install ECS Agent","Manage instance types","Scale cluster manually","Handle OS patches"],
     aws:["Run container agent","Schedule containers"],
     best:"Maximum control over infrastructure"}
  ];
  return(
    <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:14,padding:"20px 18px",margin:"24px 0"}}>
      <div style={{color:S.teal,fontWeight:700,fontSize:17,marginBottom:16,textAlign:"center"}}>
        ⚡ ECS Launch Types — Fargate vs EC2 (Click to explore)
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {types.map(t=>(
          <div key={t.id} onClick={()=>setSel(sel===t.id?null:t.id)}
            style={{background:sel===t.id?`${t.color}15`:S.bg4,border:`2px solid ${sel===t.id?t.color:S.bdr}`,
              borderRadius:12,padding:"18px",cursor:"pointer",transition:"all .25s"}}>
            <div style={{fontSize:28,marginBottom:8}}>{t.icon}</div>
            <div style={{color:t.color,fontWeight:700,fontSize:16,marginBottom:12}}>{t.name}</div>
            <div style={{color:S.text3,fontSize:13,marginBottom:10}}>YOU manage:</div>
            {t.you.map((y,i)=><div key={i} style={{color:S.text2,fontSize:14,marginBottom:4}}>✅ {y}</div>)}
            <div style={{color:S.text3,fontSize:13,margin:"10px 0 6px"}}>AWS manages:</div>
            {t.aws.map((a,i)=><div key={i} style={{color:S.text3,fontSize:14,marginBottom:4}}>🔧 {a}</div>)}
            <div style={{marginTop:12,background:`${t.color}20`,border:`1px solid ${t.color}44`,
              borderRadius:8,padding:"8px 12px",color:t.color,fontSize:13,fontWeight:600}}>
              💡 Best for: {t.best}
            </div>
          </div>
        ))}
      </div>
      <AR>فارجيت: AWS تدير السيرفرات — انت تركّز بس على كود التطبيق. EC2: عندك تحكم كامل بالبنية التحتية.</AR>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DIAGRAM 4 — ECR Flow
═══════════════════════════════════════════════ */
function DiagramECR(){
  const [active,setActive]=useState(null);
  const nodes=[
    {id:"dev",x:60,y:160,w:120,h:60,icon:"👨‍💻",label:"Developer",sub:"Local machine",color:S.blue},
    {id:"ecr",x:310,y:140,w:140,h:80,icon:"📦",label:"Amazon ECR",sub:"Docker Registry",sub2:"HTTPS + S3 encryption",color:S.purple},
    {id:"ecs",x:560,y:100,w:130,h:60,icon:"🚢",label:"Amazon ECS",sub:"Pulls image → runs task",color:S.teal},
    {id:"eks",x:560,y:220,w:130,h:60,icon:"☸️",label:"Amazon EKS",sub:"Compatible via API v2",color:S.orange},
  ];
  const arrows=[
    {x1:182,y1:190,x2:308,y2:180,label:"docker push",col:S.blue},
    {x1:452,y1:165,x2:558,y2:130,label:"pull image",col:S.teal},
    {x1:452,y1:190,x2:558,y2:250,label:"pull image",col:S.orange},
  ];
  return(
    <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:14,padding:"20px 18px",margin:"24px 0"}}>
      <div style={{color:S.purple,fontWeight:700,fontSize:17,marginBottom:16,textAlign:"center"}}>
        📦 Amazon ECR — Image Lifecycle
      </div>
      <svg width="100%" viewBox="0 0 720 320">
        <defs>
          <marker id="arECR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </marker>
        </defs>
        {arrows.map((a,i)=>(
          <g key={i}>
            <path d={`M${a.x1} ${a.y1} Q${(a.x1+a.x2)/2} ${Math.min(a.y1,a.y2)-20} ${a.x2} ${a.y2}`}
              stroke={a.col} strokeWidth="1.5" fill="none" strokeDasharray="5 3"
              markerEnd="url(#arECR)" style={{color:a.col}}/>
            <text x={(a.x1+a.x2)/2} y={Math.min(a.y1,a.y2)-24} textAnchor="middle" fill={a.col} fontSize="11" fontStyle="italic">{a.label}</text>
          </g>
        ))}
        {nodes.map(n=>(
          <g key={n.id} onClick={()=>setActive(active===n.id?null:n.id)} style={{cursor:"pointer"}}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10"
              fill={active===n.id?`${n.color}22`:S.bg4}
              stroke={active===n.id?n.color:S.bdr}
              strokeWidth={active===n.id?2:1}
              style={{filter:active===n.id?`drop-shadow(0 0 10px ${n.color}66)`:"none",transition:"all .25s"}}/>
            <text x={n.x+n.w/2} y={n.y+20} textAnchor="middle" fontSize="16">{n.icon}</text>
            <text x={n.x+n.w/2} y={n.y+38} textAnchor="middle" fill={n.color} fontSize="12" fontWeight="700">{n.label}</text>
            <text x={n.x+n.w/2} y={n.y+52} textAnchor="middle" fill={S.text3} fontSize="10">{n.sub}</text>
            {n.sub2&&<text x={n.x+n.w/2} y={n.y+65} textAnchor="middle" fill={S.text3} fontSize="10">{n.sub2}</text>}
          </g>
        ))}
        {/* docker build step */}
        <rect x="60" y="250" width="120" height="44" rx="8" fill={S.bg4} stroke={S.bdr} strokeWidth="1"/>
        <text x="120" y="270" textAnchor="middle" fill={S.text2} fontSize="11" fontWeight="600">docker build</text>
        <text x="120" y="285" textAnchor="middle" fill={S.text3} fontSize="10">Create image locally</text>
        <path d="M120 250 L120 222" stroke={S.blue} strokeWidth="1.5" fill="none" strokeDasharray="3 3" markerEnd="url(#arECR)" style={{color:S.blue}}/>
      </svg>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center",fontSize:13,color:S.text3,marginTop:4}}>
        <span>🔐 Images encrypted with S3 SSE</span>
        <span>•</span><span>HTTPS transfers only</span>
        <span>•</span><span>Compatible with Docker CLI</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   INTERACTIVE LAB — Drag & Match
═══════════════════════════════════════════════ */
function LabMatch(){
  const items=["Amazon ECS","Amazon EKS","Amazon ECR","AWS Fargate","Docker"];
  const defs=["Orchestrates Docker containers on managed EC2 clusters",
    "Runs managed Kubernetes on AWS",
    "Stores and manages Docker container images",
    "Serverless container compute — no cluster management",
    "Software platform that packages apps into containers"];
  const [answers,setAnswers]=useState({});
  const [checked,setChecked]=useState(false);
  const [selected,setSelected]=useState(null);

  const handleDef=(defIdx)=>{
    if(checked)return;
    if(selected!==null){
      setAnswers(a=>({...a,[selected]:defIdx}));
      setSelected(null);
    }
  };
  const correct=(i)=>answers[i]===i;
  const allDone=Object.keys(answers).length===items.length;

  return(
    <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:14,padding:"20px 18px",margin:"24px 0"}}>
      <div style={{color:S.teal,fontWeight:700,fontSize:17,marginBottom:6}}>🧪 Lab: Match the Service to its Definition</div>
      <div style={{color:S.text3,fontSize:14,marginBottom:16}}>① Click a service name → ② Click its correct definition</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <div style={{color:S.text2,fontWeight:600,fontSize:14,marginBottom:10}}>Services:</div>
          {items.map((item,i)=>(
            <div key={i} onClick={()=>!checked&&setSelected(selected===i?null:i)}
              style={{background:checked?(correct(i)?`${S.green}18`:`${S.red}18`):selected===i?S.tdim:answers[i]!==undefined?`${S.orange}15`:S.bg4,
                border:`1px solid ${checked?(correct(i)?S.green:S.red):selected===i?S.teal:answers[i]!==undefined?S.orange:S.bdr}`,
                borderRadius:8,padding:"10px 14px",marginBottom:8,cursor:"pointer",
                color:selected===i?S.teal:S.text2,fontSize:15,fontWeight:600,transition:"all .2s"}}>
              {checked&&<span style={{marginRight:8}}>{correct(i)?"✅":"❌"}</span>}
              {item}
              {answers[i]!==undefined&&!checked&&<span style={{float:"right",color:S.text3,fontSize:12}}>→ matched</span>}
            </div>
          ))}
        </div>
        <div>
          <div style={{color:S.text2,fontWeight:600,fontSize:14,marginBottom:10}}>Definitions:</div>
          {defs.map((def,i)=>(
            <div key={i} onClick={()=>handleDef(i)}
              style={{background:Object.values(answers).includes(i)&&!checked?`${S.blue}15`:S.bg4,
                border:`1px solid ${Object.values(answers).includes(i)&&!checked?S.blue:S.bdr}`,
                borderRadius:8,padding:"10px 14px",marginBottom:8,cursor:"pointer",
                color:S.text2,fontSize:14,transition:"all .2s",opacity:Object.values(answers).includes(i)&&!checked?0.6:1}}>
              {def}
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
        {!checked&&<button onClick={()=>allDone&&setChecked(true)} disabled={!allDone}
          style={{background:allDone?S.teal:S.bg4,border:"none",borderRadius:8,padding:"10px 20px",
            color:allDone?S.bg:"gray",fontSize:15,cursor:allDone?"pointer":"not-allowed",fontWeight:700,fontFamily:"inherit"}}>
          ✓ Check Answers
        </button>}
        <button onClick={()=>{setAnswers({});setChecked(false);setSelected(null);}}
          style={{background:"transparent",border:`1px solid ${S.bdr}`,borderRadius:8,padding:"10px 20px",
            color:S.text2,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>↺ Reset</button>
      </div>
      {checked&&(
        <div style={{marginTop:12,background:`${S.green}15`,border:`1px solid ${S.green}44`,borderRadius:10,padding:"14px 18px",color:S.text2,fontSize:15}}>
          Score: {items.filter((_,i)=>correct(i)).length}/{items.length} —{" "}
          {items.filter((_,i)=>correct(i)).length===items.length?"🎉 Perfect! All correct!":"Review the highlighted services above."}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FLIP CARDS
═══════════════════════════════════════════════ */
function FlipCards(){
  const cards=[
    {term:"Container",def:"Isolated process with app code + dependencies. Shares OS kernel. Starts in milliseconds. ~100s MB.",color:S.teal},
    {term:"Docker Image",def:"A read-only template with instructions to create a container. Stored in ECR.",color:S.blue},
    {term:"Task Definition",def:"JSON blueprint for ECS — describes containers, ports, CPU/memory, and volumes. Max 10 containers.",color:S.orange},
    {term:"ECS Cluster",def:"Group of EC2 instances (or Fargate) running the ECS container agent to host tasks.",color:S.purple},
    {term:"Fargate",def:"Serverless container runtime. AWS manages all infrastructure. You only define CPU, memory, and networking.",color:S.teal},
    {term:"ECR",def:"Elastic Container Registry — fully managed Docker registry. Images encrypted at rest via S3 SSE.",color:S.purple},
    {term:"Kubernetes Pod",def:"Smallest deployable unit in Kubernetes — one or more containers sharing network/storage with a single IP.",color:S.orange},
    {term:"EKS",def:"Elastic Kubernetes Service — managed Kubernetes on AWS. Certified conformant with upstream Kubernetes.",color:S.blue},
  ];
  const [flipped,setFlipped]=useState({});
  return(
    <div style={{margin:"24px 0"}}>
      <div style={{color:S.text2,fontWeight:700,fontSize:17,marginBottom:16}}>🃏 Flip Cards — Click to Reveal Definition</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
        {cards.map((c,i)=>(
          <div key={i} onClick={()=>setFlipped(f=>({...f,[i]:!f[i]}))} style={{cursor:"pointer",perspective:600}}>
            <div style={{height:130,position:"relative",transformStyle:"preserve-3d",transition:"transform .5s",transform:flipped[i]?"rotateY(180deg)":"rotateY(0)"}}>
              <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:S.bg3,
                border:`1px solid ${c.color}55`,borderRadius:12,display:"flex",alignItems:"center",
                justifyContent:"center",flexDirection:"column",padding:14}}>
                <div style={{color:c.color,fontWeight:700,fontSize:16,textAlign:"center"}}>{c.term}</div>
                <div style={{color:S.text3,fontSize:12,marginTop:6}}>Click to reveal</div>
              </div>
              <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",
                background:`${c.color}15`,border:`1px solid ${c.color}55`,borderRadius:12,
                display:"flex",alignItems:"center",justifyContent:"center",padding:14}}>
                <div style={{color:S.text2,fontSize:13,textAlign:"center",lineHeight:1.5}}>{c.def}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   QUIZ
═══════════════════════════════════════════════ */
function Quiz(){
  const qs=[
    {q:"What is the primary advantage of containers over virtual machines?",
     opts:["Containers include a full OS copy","Containers start in milliseconds and share the OS kernel","Containers require a hypervisor","Containers only work with Linux applications"],
     ans:1,exp:"Containers share the host OS kernel — no full OS copy needed. They start in hundreds of milliseconds and are orders of magnitude smaller than VMs."},
    {q:"What does a Task Definition in Amazon ECS specify?",
     opts:["The AWS Region to deploy in","Which containers to use, ports to open, CPU/memory, and data volumes","The VPC CIDR block","The IAM policies for the entire AWS account"],
     ans:1,exp:"A task definition is a JSON blueprint. It specifies which containers, what ports to expose, memory/CPU requirements, and volumes — up to a maximum of 10 containers per task."},
    {q:"Which ECS launch type removes the need to manage EC2 instances?",
     opts:["EC2 Launch Type","Reserved Launch Type","Fargate Launch Type","Spot Launch Type"],
     ans:2,exp:"AWS Fargate is the serverless option. You only define CPU, memory, networking, and IAM. AWS provisions and manages all cluster infrastructure."},
    {q:"How does Amazon ECR store and protect container images?",
     opts:["On local developer machines","Via FTP transfers, unencrypted","Via HTTPS transfers; images encrypted at rest using Amazon S3 SSE","On EBS volumes attached to EC2 instances"],
     ans:2,exp:"ECR transfers images via HTTPS and automatically encrypts them at rest using Amazon S3 server-side encryption (SSE)."},
    {q:"What is a Kubernetes Pod?",
     opts:["A group of EC2 instances","A Docker image repository","A logical grouping of containers sharing a network namespace and single DNS name","A type of AWS load balancer"],
     ans:2,exp:"A Pod is the smallest deployable unit in Kubernetes. One or more containers share a network namespace (single IP) and DNS name within a pod."},
    {q:"Why does AWS offer both ECS and EKS?",
     opts:["ECS is deprecated and EKS replaces it","They target different geographic regions","To give customers flexible options — ECS for AWS-native, EKS for teams using standard Kubernetes tooling","EKS is only for Windows containers"],
     ans:2,exp:"Both services orchestrate Docker containers but serve different customers. ECS is simpler and AWS-native. EKS is certified Kubernetes conformant — for teams who want standard Kubernetes tooling on AWS."},
    {q:"A container-based deployment runs 3 apps on a SINGLE EC2 instance. What component manages how containers run?",
     opts:["The AWS Hypervisor","The IAM Role","The Docker Engine installed on the guest OS","The Security Group"],
     ans:2,exp:"Docker Engine is installed on the Linux guest OS of the EC2 instance. It manages how containers run, their lifecycle, and isolation from each other."},
    {q:"Which statement about Amazon ECS scheduling is CORRECT?",
     opts:["ECS always places containers on the cheapest instance","ECS task scheduler places tasks based on resource needs (CPU/RAM) and availability requirements","ECS can only schedule one task per cluster","ECS requires manual placement decisions"],
     ans:1,exp:"The ECS task scheduler automatically places tasks across your cluster based on resource requirements (CPU, RAM) and availability requirements you define."},
    {q:"What is the maximum number of containers allowed per ECS Task Definition?",
     opts:["5","10","20","Unlimited"],
     ans:1,exp:"An ECS Task Definition can describe up to a maximum of 10 containers that form your application."},
    {q:"Which Docker command pushes a local image to Amazon ECR?",
     opts:["docker pull","docker run","docker push","docker commit"],
     ans:2,exp:"'docker push' uploads a local Docker image to a registry. Amazon ECR supports the Docker Registry HTTP API v2, so standard Docker CLI commands (including push) work seamlessly."},
    {q:"Amazon EKS automatically manages which of the following?",
     opts:["Your application's business logic","Availability and scalability of Kubernetes control plane nodes","The source code of your containers","Billing and Cost Management"],
     ans:1,exp:"Amazon EKS automatically manages the availability and scalability of the Kubernetes cluster control plane nodes — including detecting and replacing unhealthy nodes."},
    {q:"Containers are described as 'infrastructure-agnostic.' What does this mean?",
     opts:["They only run on AWS infrastructure","They run on any Linux OS with Docker daemon and kernel support — laptop, VM, EC2, or bare metal","They require a dedicated physical server","They are compatible only with Windows"],
     ans:1,exp:"Because containers share the host OS kernel via Docker, they run on any compatible Linux host — a developer's laptop, an on-premises VM, an EC2 instance, or bare metal — without modification."},
    {q:"Which of the following is NOT a feature of Amazon ECS?",
     opts:["Launch up to tens of thousands of Docker containers in seconds","Monitor container deployment","Schedule containers using built-in or third-party schedulers","Provide a managed Kubernetes control plane"],
     ans:3,exp:"Amazon EKS (not ECS) provides a managed Kubernetes control plane. ECS uses its own proprietary scheduler and can integrate with third-party schedulers like Apache Mesos."},
    {q:"When you choose the EC2 launch type for an ECS cluster, you can use which pricing models?",
     opts:["Only On-Demand Instances","Only Spot Instances","Both On-Demand Instances and Spot Instances","Only Reserved Instances"],
     ans:2,exp:"Amazon ECS clusters with the EC2 launch type support both On-Demand and Spot Instances. This gives you cost optimization flexibility."},
    {q:"What AWS service integrates with Amazon EKS for pod networking?",
     opts:["AWS Direct Connect","Amazon VPC","AWS CloudFormation","Amazon Route 53"],
     ans:1,exp:"Amazon EKS uses Amazon VPC for pod networking. It also integrates with Application Load Balancers for traffic distribution and IAM for role-based access control."},
  ];
  const [sel,setSel]=useState({});
  const [shown,setShown]=useState({});
  const [score,setScore]=useState(null);

  const check=()=>{
    let s=0;
    qs.forEach((_,i)=>{if(sel[i]===qs[i].ans)s++;});
    setScore(s);
    setShown(Object.fromEntries(qs.map((_,i)=>[i,true])));
  };
  const reset=()=>{setSel({});setShown({});setScore(null);};

  return(
    <div style={{margin:"24px 0"}}>
      <div style={{color:S.teal,fontWeight:700,fontSize:22,marginBottom:8}}>📝 Assessment Quiz — 15 Questions</div>
      <div style={{color:S.text3,fontSize:14,marginBottom:20}}>Container Services — Hard level 🔴</div>
      {score!==null&&(
        <div style={{background:score>=12?`${S.green}18`:`${S.orange}18`,border:`1px solid ${score>=12?S.green:S.orange}44`,
          borderRadius:12,padding:"18px 22px",marginBottom:20,fontSize:18,fontWeight:700,
          color:score>=12?S.green:S.orange,textAlign:"center"}}>
          Score: {score}/{qs.length} — {score>=12?"🎉 Excellent!":score>=9?"👍 Good — Review missed questions":"📖 Study the material and retry"}
        </div>
      )}
      {qs.map((q,qi)=>(
        <div key={qi} style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"20px",marginBottom:16}}>
          <div style={{color:S.text,fontSize:16,fontWeight:600,marginBottom:14}}>
            <span style={{color:S.teal,marginRight:10}}>Q{qi+1}.</span>{q.q}
          </div>
          {q.opts.map((opt,oi)=>{
            const picked=sel[qi]===oi;
            const correct=oi===q.ans;
            let bg=S.bg4, bdr=S.bdr, col=S.text2;
            if(shown[qi]){
              if(correct){bg=`${S.green}20`;bdr=S.green;col=S.green;}
              else if(picked){bg=`${S.red}20`;bdr=S.red;col=S.red;}
            } else if(picked){bg=S.tdim;bdr=S.teal;col=S.teal;}
            return(
              <div key={oi} onClick={()=>!shown[qi]&&setSel(s=>({...s,[qi]:oi}))}
                style={{background:bg,border:`1px solid ${bdr}`,borderRadius:8,padding:"10px 14px",
                  marginBottom:8,cursor:shown[qi]?"default":"pointer",color:col,fontSize:15,
                  display:"flex",gap:10,alignItems:"center",transition:"all .2s"}}>
                <span style={{fontWeight:700,minWidth:22}}>{"ABCD"[oi]}.</span>{opt}
                {shown[qi]&&correct&&<span style={{marginLeft:"auto"}}>✅</span>}
                {shown[qi]&&picked&&!correct&&<span style={{marginLeft:"auto"}}>❌</span>}
              </div>
            );
          })}
          {shown[qi]&&(
            <div style={{background:`${S.blue}15`,border:`1px solid ${S.blue}44`,borderRadius:8,
              padding:"10px 14px",marginTop:10,color:S.text2,fontSize:14}}>
              <span style={{color:S.blue,fontWeight:700}}>💡 Explanation: </span>{q.exp}
            </div>
          )}
        </div>
      ))}
      <div style={{display:"flex",gap:12,marginTop:8}}>
        {score===null&&<button onClick={check} style={{background:S.teal,border:"none",borderRadius:10,
          padding:"12px 28px",color:S.bg,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          ✓ Submit Quiz
        </button>}
        <button onClick={reset} style={{background:"transparent",border:`1px solid ${S.bdr}`,
          borderRadius:10,padding:"12px 28px",color:S.text2,fontSize:16,cursor:"pointer",fontFamily:"inherit"}}>
          ↺ Restart
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION COMPONENTS
═══════════════════════════════════════════════ */
function Sec1(){
  const services=[
    {icon:"📦",name:"Amazon ECS",full:"Elastic Container Service",desc:"Highly scalable container management service that supports Docker. Runs apps on a managed cluster of EC2 instances.",color:S.teal},
    {icon:"☸️",name:"Amazon EKS",full:"Elastic Kubernetes Service",desc:"Managed Kubernetes on AWS. Certified conformant — existing upstream Kubernetes apps work without modification.",color:S.blue},
    {icon:"🗄️",name:"Amazon ECR",full:"Elastic Container Registry",desc:"Fully managed Docker registry. Store, manage, and deploy Docker images. Integrated with ECS and EKS.",color:S.purple},
    {icon:"⚡",name:"AWS Fargate",full:"Serverless Container Compute",desc:"Run containers WITHOUT managing servers or clusters. Define CPU, memory, and networking only.",color:S.orange},
    {icon:"🐳",name:"Docker",full:"Container Platform",desc:"Software platform that packages applications into containers. The foundation of all AWS container services.",color:S.blue},
  ];
  return(
    <div>
      <div style={{color:S.teal,fontWeight:900,fontSize:36,marginBottom:8}}>Section 4</div>
      <div style={{color:S.text,fontWeight:700,fontSize:28,marginBottom:6}}>Container Services</div>
      <AR>الكونتينرز — طريقة حديثة لتشغيل التطبيقات بشكل معزول وسريع، أخف بكثير من الـ Virtual Machines</AR>

      <p style={{color:S.text2,fontSize:18,marginBottom:20,lineHeight:1.8}}>
        Containers are a method of <strong style={{color:S.teal}}>operating system virtualization</strong> that enable you to run
        an application and its dependencies in resource-isolated processes. Unlike VMs, containers share the
        host OS kernel — making them dramatically lighter and faster.
      </p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14,margin:"20px 0"}}>
        {services.map((s,i)=>(
          <div key={i} style={{background:S.bg3,border:`1px solid ${s.color}44`,borderRadius:12,padding:"18px"}}>
            <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
            <div style={{color:s.color,fontWeight:700,fontSize:16}}>{s.name}</div>
            <div style={{color:S.text3,fontSize:12,marginBottom:8}}>{s.full}</div>
            <div style={{color:S.text2,fontSize:14}}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"20px",margin:"20px 0"}}>
        <div style={{color:S.teal,fontWeight:700,fontSize:18,marginBottom:14}}>🆚 Container Advantages</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            ["⚡ Fast Startup","Containers start in hundreds of milliseconds vs minutes for VMs"],
            ["💾 Small Size","Container images are ~100-200 MB vs ~2 GB for VM images"],
            ["🔄 Portability","Run anywhere: laptop, VM, EC2, bare metal — same container"],
            ["📦 Consistency","App code + configs + dependencies packaged as a single object"],
            ["🔧 Efficiency","Multiple containers share ONE OS — better resource utilization"],
            ["🚀 Developer Productivity","Eliminates 'works on my machine' problems"],
          ].map(([t,d],i)=>(
            <div key={i} style={{background:S.bg4,border:`1px solid ${S.bdr}`,borderRadius:8,padding:"12px 14px"}}>
              <div style={{color:S.teal,fontWeight:600,fontSize:14,marginBottom:4}}>{t}</div>
              <div style={{color:S.text2,fontSize:13}}>{d}</div>
            </div>
          ))}
        </div>
      </div>
      <InfoBox type="tip">Containers hold everything the software needs to run: <strong>libraries, system tools, code, and runtime</strong> — but NOT a full OS. This is the key difference from VMs.</InfoBox>
    </div>
  );
}

function Sec2(){
  return(
    <div>
      <div style={{color:S.text,fontWeight:700,fontSize:26,marginBottom:6}}>🐳 What is Docker?</div>
      <AR>دوكر — منصة تحزم التطبيقات داخل كونتينرز، تقدر تنشرها على أي مكان بنفس الطريقة</AR>
      <p style={{color:S.text2,fontSize:18,marginBottom:16}}>
        Docker is a <strong style={{color:S.teal}}>software platform</strong> that packages software (such as applications) into containers.
        Docker is installed on each server that will host containers, and provides simple commands to build, start, and stop containers.
      </p>
      <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"20px",margin:"20px 0"}}>
        <div style={{color:S.teal,fontWeight:700,fontSize:17,marginBottom:14}}>When to use Docker:</div>
        {["Standardize environments across development, staging, and production",
          "Reduce conflicts between language stacks and versions",
          "Use containers as a service (CaaS)",
          "Run microservices using standardized code deployments",
          "Require portability for data processing workloads",
        ].map((p,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:10,color:S.text2,fontSize:16}}>
            <span style={{color:S.teal,fontWeight:700}}>→</span><span>{p}</span>
          </div>
        ))}
      </div>
      <DiagramContainerVsVM/>
      <div style={{background:S.bg3,border:`1px solid ${S.bdr2}`,borderRadius:12,padding:"20px",margin:"20px 0"}}>
        <div style={{color:S.orange,fontWeight:700,fontSize:17,marginBottom:12}}>Key Technical Differences</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <div style={{color:S.orange,fontWeight:600,marginBottom:8}}>Virtual Machines</div>
            {["Run directly on a hypervisor","Each VM has its own full OS","~GB in size","Boot time: minutes","Strong isolation via hypervisor"].map((t,i)=><div key={i} style={{color:S.text2,fontSize:14,marginBottom:6}}>■ {t}</div>)}
          </div>
          <div>
            <div style={{color:S.teal,fontWeight:600,marginBottom:8}}>Containers</div>
            {["Run on any Linux OS + Docker daemon","Share the host OS kernel","~MB in size","Start time: milliseconds","Process isolation via kernel namespaces"].map((t,i)=><div key={i} style={{color:S.text2,fontSize:14,marginBottom:6}}>■ {t}</div>)}
          </div>
        </div>
      </div>
      <InfoBox type="warn">A single large EC2 instance could run <strong>hundreds of containers</strong> simultaneously — far more efficient than running hundreds of VMs.</InfoBox>
    </div>
  );
}

function Sec3(){
  return(
    <div>
      <div style={{color:S.text,fontWeight:700,fontSize:26,marginBottom:6}}>🚢 Amazon ECS</div>
      <div style={{color:S.text2,fontSize:16,marginBottom:4,fontStyle:"italic"}}>Elastic Container Service</div>
      <AR>ECS — خدمة AWS لإدارة وتشغيل الكونتينرز على كلاستر من EC2 أو بدونهم مع Fargate</AR>
      <p style={{color:S.text2,fontSize:18,marginBottom:16}}>
        Amazon ECS is a <strong style={{color:S.teal}}>highly scalable, high-performance container management service</strong> that
        supports Docker. It enables you to easily run applications on a managed cluster of Amazon EC2 instances.
      </p>

      <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"20px",margin:"16px 0"}}>
        <div style={{color:S.teal,fontWeight:700,fontSize:17,marginBottom:12}}>Essential ECS Features:</div>
        {[
          ["⚡","Launch tens of thousands of Docker containers in seconds"],
          ["📊","Monitor container deployment status in real time"],
          ["🔧","Manage the state of the cluster running the containers"],
          ["📅","Schedule containers using built-in scheduler or third-party (Apache Mesos, Blox)"],
          ["💰","Clusters support Spot Instances and Reserved Instances"],
        ].map(([icon,feat],i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:10,color:S.text2,fontSize:16}}>
            <span style={{fontSize:18,flexShrink:0}}>{icon}</span><span>{feat}</span>
          </div>
        ))}
      </div>

      <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"20px",margin:"16px 0"}}>
        <div style={{color:S.orange,fontWeight:700,fontSize:17,marginBottom:12}}>📄 Task Definition</div>
        <p style={{color:S.text2,fontSize:16,marginBottom:12}}>A <strong style={{color:S.orange}}>text file (JSON)</strong> that describes one or more containers (up to 10) that form your application. Think of it as a blueprint.</p>
        <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,background:S.bg2,border:`1px solid ${S.bdr}`,borderRadius:8,padding:"14px",color:S.teal,overflowX:"auto"}}>
{`{
  "family": "my-web-app",
  "containerDefinitions": [
    {
      "name": "web-container",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest",
      "memory": 512,
      "cpu": 256,
      "portMappings": [{ "containerPort": 80 }]
    }
  ]
}`}
        </div>
      </div>

      <DiagramECS/>

      <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"20px",margin:"16px 0"}}>
        <div style={{color:S.teal,fontWeight:700,fontSize:17,marginBottom:12}}>ECS Cluster Options (3 types):</div>
        {[
          {name:"Networking Only (Fargate)",col:S.teal,desc:"AWS manages all servers. You only define app requirements."},
          {name:"EC2 Linux + Networking",col:S.orange,desc:"You control the EC2 instances — choose On-Demand or Spot."},
          {name:"EC2 Windows + Networking",col:S.blue,desc:"Windows containers on EC2 instances you manage."},
        ].map((c,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
            <span style={{color:c.col,fontWeight:700,fontSize:16,minWidth:200}}>{c.name}</span>
            <span style={{color:S.text2,fontSize:15}}>{c.desc}</span>
          </div>
        ))}
      </div>

      <DiagramLaunchTypes/>
    </div>
  );
}

function Sec4(){
  return(
    <div>
      <div style={{color:S.text,fontWeight:700,fontSize:26,marginBottom:6}}>☸️ Kubernetes & Amazon EKS</div>
      <AR>كوبيرنيتس — برنامج مفتوح المصدر لإدارة الكونتينرز على نطاق واسع. EKS هو إصدار AWS المُدار منه.</AR>
      <p style={{color:S.text2,fontSize:18,marginBottom:16}}>
        Kubernetes is <strong style={{color:S.teal}}>open-source software for container orchestration</strong>. It works with Docker and many
        containerization technologies. A large community of developers keep it relevant with new features.
      </p>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,margin:"20px 0"}}>
        <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"18px"}}>
          <div style={{color:S.teal,fontWeight:700,fontSize:16,marginBottom:12}}>☸️ What Kubernetes Does:</div>
          {["Deploy and manage containerized apps at scale",
            "Run containers on a cluster of compute nodes",
            "Place containers based on resource availability",
            "Group containers in logical units called Pods",
            "Give each Pod an IP address and DNS name",
            "Connect services with each other and external traffic",
            "Use same toolset on-premises AND in cloud",
          ].map((p,i)=><div key={i} style={{color:S.text2,fontSize:14,marginBottom:6}}>• {p}</div>)}
        </div>
        <div style={{background:S.bg3,border:`1px solid ${S.blue}44`,borderRadius:12,padding:"18px"}}>
          <div style={{color:S.blue,fontWeight:700,fontSize:16,marginBottom:12}}>🔵 Amazon EKS Features:</div>
          {["Certified Kubernetes conformant",
            "Existing apps work without modification",
            "Auto-manages control plane node availability",
            "Detects and replaces unhealthy nodes",
            "Integrates with ALB, IAM, and VPC",
            "Scales cluster nodes automatically",
            "No need to install/operate/maintain control plane",
          ].map((p,i)=><div key={i} style={{color:S.text2,fontSize:14,marginBottom:6}}>✓ {p}</div>)}
        </div>
      </div>

      <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"20px",margin:"16px 0"}}>
        <div style={{color:S.teal,fontWeight:700,fontSize:17,marginBottom:10}}>📦 Kubernetes Pod — Key Concept</div>
        <p style={{color:S.text2,fontSize:16,marginBottom:10}}>
          Containers run in logical groupings called <strong style={{color:S.teal}}>Pods</strong>. You can run one or many containers together as a Pod.
          Each Pod gets:
        </p>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <div style={{background:S.bg4,border:`1px solid ${S.teal}44`,borderRadius:8,padding:"12px 16px",flex:1,minWidth:160}}>
            <div style={{color:S.teal,fontWeight:700}}>🌐 Single IP Address</div>
            <div style={{color:S.text2,fontSize:14,marginTop:4}}>All containers in a Pod share one IP</div>
          </div>
          <div style={{background:S.bg4,border:`1px solid ${S.teal}44`,borderRadius:8,padding:"12px 16px",flex:1,minWidth:160}}>
            <div style={{color:S.teal,fontWeight:700}}>🔤 Single DNS Name</div>
            <div style={{color:S.text2,fontSize:14,marginTop:4}}>Kubernetes uses for service discovery</div>
          </div>
          <div style={{background:S.bg4,border:`1px solid ${S.teal}44`,borderRadius:8,padding:"12px 16px",flex:1,minWidth:160}}>
            <div style={{color:S.teal,fontWeight:700}}>💾 Shared Storage</div>
            <div style={{color:S.text2,fontSize:14,marginTop:4}}>Containers share network + volumes</div>
          </div>
        </div>
      </div>

      <div style={{background:`${S.orange}12`,border:`1px solid ${S.bdr2}`,borderRadius:12,padding:"20px",margin:"16px 0"}}>
        <div style={{color:S.orange,fontWeight:700,fontSize:17,marginBottom:10}}>🤔 ECS vs EKS — Which to Choose?</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <div style={{color:S.teal,fontWeight:700,marginBottom:8}}>Choose ECS if:</div>
            {["You want a simpler, AWS-native solution","No existing Kubernetes expertise","Faster time to production","AWS-native integrations are sufficient"].map((p,i)=><div key={i} style={{color:S.text2,fontSize:14,marginBottom:6}}>→ {p}</div>)}
          </div>
          <div>
            <div style={{color:S.orange,fontWeight:700,marginBottom:8}}>Choose EKS if:</div>
            {["Your team already uses Kubernetes","You want to migrate from on-premises K8s","Standard Kubernetes tooling required","Multi-cloud portability needed"].map((p,i)=><div key={i} style={{color:S.text2,fontSize:14,marginBottom:6}}>→ {p}</div>)}
          </div>
        </div>
      </div>
      <AR>الفرق الرئيسي: ECS أبسط وخاص بـ AWS — EKS لمن يريد كوبيرنيتس القياسي بيشتغل بنفس الطريقة على AWS وعلى برميس.</AR>
    </div>
  );
}

function Sec5(){
  return(
    <div>
      <DiagramECR/>
      <div style={{color:S.text,fontWeight:700,fontSize:26,marginBottom:6,marginTop:8}}>📦 Amazon ECR</div>
      <div style={{color:S.text2,fontSize:16,marginBottom:4,fontStyle:"italic"}}>Elastic Container Registry</div>
      <AR>ECR هو مستودع صور الدوكر على AWS — تخزن صورك فيه وتسحبها منه مباشرة لـ ECS أو EKS</AR>
      <p style={{color:S.text2,fontSize:18,marginBottom:16}}>
        Amazon ECR is a <strong style={{color:S.purple}}>fully managed Docker container registry</strong> that makes it easy for developers
        to store, manage, and deploy Docker container images. Integrated natively with ECS and EKS.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14,margin:"16px 0"}}>
        {[
          {icon:"🔐",title:"Secure Transfers",desc:"All image transfers via HTTPS only",col:S.teal},
          {icon:"🔒",title:"Encryption at Rest",desc:"Images automatically encrypted using S3 SSE",col:S.purple},
          {icon:"🐳",title:"Docker API v2",desc:"Supports Docker Registry HTTP API v2 — works with docker CLI",col:S.blue},
          {icon:"🔗",title:"ECS Integration",desc:"Specify ECR repo in task definition → ECS pulls automatically",col:S.orange},
          {icon:"☸️",title:"EKS Compatible",desc:"Use ECR images with Amazon EKS clusters",col:S.blue},
          {icon:"💻",title:"Any Environment",desc:"Access from cloud, on-premises, or local machine",col:S.teal},
        ].map((f,i)=>(
          <div key={i} style={{background:S.bg3,border:`1px solid ${f.col}33`,borderRadius:10,padding:"16px"}}>
            <div style={{fontSize:24,marginBottom:6}}>{f.icon}</div>
            <div style={{color:f.col,fontWeight:700,fontSize:15,marginBottom:4}}>{f.title}</div>
            <div style={{color:S.text2,fontSize:14}}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"20px",margin:"16px 0"}}>
        <div style={{color:S.teal,fontWeight:700,fontSize:16,marginBottom:12}}>Typical ECR Workflow:</div>
        {[
          {step:"1",cmd:"docker build -t my-app:v1 .",desc:"Build image locally from Dockerfile"},
          {step:"2",cmd:"aws ecr get-login-password | docker login ...",desc:"Authenticate Docker to ECR"},
          {step:"3",cmd:"docker tag my-app:v1 <account>.dkr.ecr.<region>.amazonaws.com/my-app:v1",desc:"Tag image with ECR URI"},
          {step:"4",cmd:"docker push <account>.dkr.ecr.<region>.amazonaws.com/my-app:v1",desc:"Push to ECR"},
          {step:"5",cmd:"ECS / EKS pulls automatically",desc:"Reference ECR URI in task definition or Pod spec"},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:14,marginBottom:14,alignItems:"flex-start"}}>
            <div style={{background:S.teal,color:S.bg,borderRadius:"50%",width:28,height:28,display:"flex",
              alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>{s.step}</div>
            <div>
              <code style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:S.orange,background:S.bg2,
                padding:"3px 8px",borderRadius:4,display:"block",marginBottom:4}}>{s.cmd}</code>
              <div style={{color:S.text2,fontSize:14}}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <KT points={[
        "Containers hold everything an application needs to run — code, libraries, runtime.",
        "Docker is a software platform that packages software into containers.",
        "A single application can span multiple containers working together.",
        "Amazon ECS orchestrates running Docker containers on a managed cluster.",
        "Kubernetes is open-source container orchestration — EKS runs it managed on AWS.",
        "Amazon ECR stores, manages, and deploys Docker images — HTTPS + S3 encryption.",
        "AWS Fargate eliminates server management — you define requirements, AWS handles the rest.",
      ]}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHORT ANSWER
═══════════════════════════════════════════════ */
function ShortAnswer(){
  const qs2=[
    {q:"Explain in your own words why containers start faster than VMs.",
     ans:"Containers don't boot a full OS — they share the host OS kernel. A container only needs to start the application process itself, which takes milliseconds. A VM must boot a complete guest OS (loading kernel, drivers, services), which takes minutes."},
    {q:"What is the role of the ECS Container Agent?",
     ans:"The ECS Container Agent runs on each EC2 instance in the cluster. It communicates with Amazon ECS to receive task placement instructions, start/stop containers, and report the health and resource availability of the host instance back to ECS."},
    {q:"Describe three scenarios where you would choose AWS Fargate over EC2 launch type.",
     ans:"(1) When your team wants to focus on application code and avoid infrastructure management. (2) When you have unpredictable traffic and don't want to over-provision EC2 instances. (3) When you want to avoid patching/updating the underlying OS of cluster instances."},
    {q:"Why might a company choose Amazon EKS instead of Amazon ECS?",
     ans:"If the company already runs Kubernetes on-premises, EKS lets them use the same tooling and skills in AWS. EKS is certified Kubernetes conformant, so existing manifests and Helm charts work. Companies that need multi-cloud portability also prefer Kubernetes since it runs anywhere."},
    {q:"What information must be included in an ECS Task Definition?",
     ans:"A task definition specifies: which Docker images (container definitions), CPU and memory requirements per container, networking ports to expose (portMappings), data volumes to mount, the IAM role to use, and logging configuration. It can describe up to 10 containers per task."},
    {q:"How does Amazon ECR protect container images?",
     ans:"ECR protects images in two ways: (1) Images are transferred via HTTPS only — never plain HTTP. (2) Images are automatically encrypted at rest using Amazon S3 server-side encryption (SSE). Access is controlled via IAM policies."},
    {q:"What is a Kubernetes Pod and why is the Pod abstraction useful?",
     ans:"A Pod is the smallest deployable unit in Kubernetes — it groups one or more containers that share a network namespace (same IP + DNS name) and optionally storage volumes. The Pod abstraction is useful because it lets tightly coupled containers (like an app + sidecar logging container) be scheduled together on the same node and communicate via localhost."},
    {q:"Compare the resource footprint of a container image vs a VM image and explain why the difference matters.",
     ans:"Container images are typically 100–300 MB while VM images are 1–4 GB (because they include a full OS). This matters for: (1) Speed — smaller images pull faster from ECR. (2) Density — you can run hundreds of containers on one EC2 instance vs far fewer VMs. (3) Cost — less storage, faster scaling, better infrastructure utilization."},
  ];
  const [revealed,setRevealed]=useState({});
  const [answers,setAnswers]=useState({});
  return(
    <div style={{margin:"24px 0"}}>
      <div style={{color:S.teal,fontWeight:700,fontSize:22,marginBottom:8}}>✍️ Short Answer Questions</div>
      <div style={{color:S.text3,fontSize:14,marginBottom:20}}>Write your answer first, then reveal the model answer.</div>
      {qs2.map((q,i)=>(
        <div key={i} style={{background:S.bg3,border:`1px solid ${S.bdr}`,borderRadius:12,padding:"20px",marginBottom:16}}>
          <div style={{color:S.text,fontSize:16,fontWeight:600,marginBottom:14}}>
            <span style={{color:S.teal,marginRight:10}}>Q{i+1}.</span>{q.q}
          </div>
          <textarea value={answers[i]||""} onChange={e=>setAnswers(a=>({...a,[i]:e.target.value}))}
            placeholder="Write your answer here..."
            style={{width:"100%",minHeight:90,background:S.bg4,border:`1px solid ${S.bdr}`,
              borderRadius:8,padding:"12px",color:S.text2,fontSize:15,fontFamily:"inherit",
              resize:"vertical",outline:"none",lineHeight:1.6}}/>
          <button onClick={()=>setRevealed(r=>({...r,[i]:true}))}
            style={{marginTop:10,background:S.bg4,border:`1px solid ${S.teal}`,borderRadius:8,
              padding:"8px 18px",color:S.teal,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
            👁️ Reveal Model Answer
          </button>
          {revealed[i]&&(
            <div style={{background:`${S.teal}10`,border:`1px solid ${S.teal}33`,borderRadius:8,
              padding:"14px 16px",marginTop:12,color:S.text2,fontSize:15,lineHeight:1.7}}>
              <span style={{color:S.teal,fontWeight:700}}>Model Answer: </span>{q.ans}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════ */
const TABS=[
  {id:"overview",label:"📋 Overview"},
  {id:"docker",label:"🐳 Docker & VMs"},
  {id:"ecs",label:"🚢 Amazon ECS"},
  {id:"eks",label:"☸️ Kubernetes/EKS"},
  {id:"ecr",label:"📦 Amazon ECR"},
  {id:"lab",label:"🧪 Lab"},
  {id:"quiz",label:"📝 Quiz"},
];

export default function App(){
  const [tab,setTab]=useState("overview");
  const topRef=useRef(null);

  useEffect(()=>{topRef.current?.scrollTo({top:0,behavior:"smooth"});},[tab]);

  const tabContent={
    overview:<Sec1/>,
    docker:<Sec2/>,
    ecs:<Sec3/>,
    eks:<Sec4/>,
    ecr:<Sec5/>,
    lab:<><FlipCards/><LabMatch/></>,
    quiz:<><Quiz/><ShortAnswer/></>,
  };

  return(
    <div style={{background:S.bg,minHeight:"100vh",color:S.text,fontFamily:"'Outfit',sans-serif"}}>
      {/* Header */}
      <div style={{background:S.bg2,borderBottom:`1px solid ${S.bdr}`,padding:"18px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <div>
            <div style={{color:S.teal,fontSize:13,fontWeight:600}}>AWS Academy · Module 6</div>
            <div style={{color:S.text,fontWeight:900,fontSize:24}}>Section 4: Container Services</div>
            <div style={{fontFamily:"'Cairo',sans-serif",color:S.orange,fontSize:15,direction:"rtl"}}>
              الخدمات القائمة على الحاويات
            </div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap"}}>
            <Badge color={S.teal}>ECS</Badge><Badge color={S.blue}>EKS</Badge>
            <Badge color={S.purple}>ECR</Badge><Badge color={S.orange}>Fargate</Badge>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{background:S.bg2,borderBottom:`1px solid ${S.bdr}`,
        display:"flex",gap:4,padding:"8px 16px",overflowX:"auto",scrollbarWidth:"none"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{background:tab===t.id?S.tdim:"transparent",
              border:`1px solid ${tab===t.id?S.teal:S.bdr}`,
              borderRadius:20,padding:"6px 16px",color:tab===t.id?S.teal:S.text2,
              fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:tab===t.id?700:400,
              whiteSpace:"nowrap",flexShrink:0,transition:"all .2s"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div ref={topRef} style={{maxWidth:960,margin:"0 auto",padding:"32px 24px 80px"}}>
        {tabContent[tab]}
      </div>
    </div>
  );
}
