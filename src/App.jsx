import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

const LESSONS = [
  { id:1, cat:"Creator", emoji:"🎬", title:"Viral YouTube Hooks", pro:false, xp:10,
    insight:"Strong hooks create curiosity in the first 3 seconds.",
    lbl:"Enter your topic", ph:"e.g. Fitness for students",
    preview:["Generate 10 viral hooks for [TOPIC].","Use: curiosity · emotion · punchy language"],
    sys:"You are a viral YouTube strategist. Generate exactly 10 high-CTR YouTube hooks. Each hook must be under 12 words. Use curiosity, emotion, strong opening words. Format: bullet list, one hook per line starting with a bullet symbol. No numbering.",
    p:"Generate 10 viral YouTube hooks about: " },
  { id:2, cat:"Creator", emoji:"📸", title:"Instagram Caption Upgrade", pro:false, xp:10,
    insight:"Great captions stop the scroll and make people feel something.",
    lbl:"Paste your boring caption", ph:"e.g. Had a great workout today",
    preview:["Rewrite [CAPTION] into 3 viral versions.","Use: emotion · hooks · CTA"],
    sys:"You are a top Instagram copywriter. Rewrite the caption into 3 viral versions. Strong opening line, emotion, soft CTA. Keep each under 3 lines. Format: Version 1: ... Version 2: ... Version 3: ...",
    p:"Rewrite this into 3 viral Instagram captions: " },
  { id:3, cat:"Creator", emoji:"🎯", title:"TikTok Script Starter", pro:false, xp:10,
    insight:"TikTok hooks must grab attention before the viewer blinks.",
    lbl:"Enter your niche", ph:"e.g. Personal finance for beginners",
    preview:["Write a 30-sec TikTok script for [NICHE].","Use: fast pacing · story · CTA"],
    sys:"You are a viral TikTok scriptwriter. Write a 30-second script. Shocking hook (1 sentence). 3-4 punchy points. Strong CTA. Format: HOOK: / POINTS: / CTA: Under 80 words.",
    p:"Write a 30-second viral TikTok script for: " },
  { id:4, cat:"Creator", emoji:"🧵", title:"Twitter/X Thread Ideas", pro:true, xp:15,
    insight:"Threads build authority and get shared 3x more than single tweets.",
    lbl:"Enter your topic", ph:"e.g. How I made $1000 freelancing",
    preview:["Generate a 7-tweet thread for [TOPIC].","Use: story arc · value · cliffhangers"],
    sys:"You are a viral Twitter/X strategist. Create a 7-tweet thread. Tweet 1: Hook. Tweets 2-6: One value point each. Tweet 7: Strong CTA. Format: Tweet 1: ... Under 280 chars each.",
    p:"Create a viral 7-tweet thread about: " },
  { id:5, cat:"Creator", emoji:"📝", title:"Blog Post Outline", pro:true, xp:15,
    insight:"A great outline makes writing 5x faster.",
    lbl:"Enter your blog topic", ph:"e.g. How to start freelancing",
    preview:["Create a blog outline for [TOPIC].","Use: SEO · hooks · subheadings"],
    sys:"You are an SEO content strategist. Create a blog post outline: 2 title options, intro hook, 5-6 subheadings with bullet points, conclusion CTA. Make it skimmable.",
    p:"Create a complete blog post outline for: " },
  { id:6, cat:"Creator", emoji:"🎙️", title:"Podcast Episode Ideas", pro:true, xp:15,
    insight:"Niche podcast topics create loyal listeners.",
    lbl:"Enter your podcast niche", ph:"e.g. Mindset for entrepreneurs",
    preview:["Generate 10 podcast episode ideas.","Use: controversy · curiosity · stories"],
    sys:"You are a podcast producer. Generate 10 compelling episode ideas. Each: Title + 1-line description. Format: 1. [Title] - [Description]",
    p:"Generate 10 podcast episode ideas for the niche: " },
  { id:7, cat:"Freelancer", emoji:"💼", title:"Client Proposal Writer", pro:false, xp:10,
    insight:"A great proposal speaks to the client's fear of wasting money.",
    lbl:"Enter your skill", ph:"e.g. Logo design for restaurants",
    preview:["Write a short proposal for [SKILL].","Use: confidence · results · clear offer"],
    sys:"You are a freelance coach. Write a short, confident client proposal. 4-5 sentences. Bold value statement, specific result, clear next step. Human, not robotic.",
    p:"Write a short freelance proposal for: " },
  { id:8, cat:"Freelancer", emoji:"💰", title:"Rate Negotiation Script", pro:true, xp:20,
    insight:"Confident negotiation can double your income.",
    lbl:"What is the situation?", ph:"e.g. Client offered $20/hr, I want $40/hr",
    preview:["Write a negotiation message.","Use: confidence · value · no desperation"],
    sys:"You are a freelance negotiation coach. Write a confident rate negotiation message. Under 5 sentences. No apologies. State value clearly. Leave room for counter-offer.",
    p:"Write a freelance rate negotiation message for: " },
  { id:9, cat:"Freelancer", emoji:"⭐", title:"Upwork Profile Bio", pro:true, xp:20,
    insight:"Your bio has 8 seconds to convince a client.",
    lbl:"Enter your skill and experience", ph:"e.g. Video editor, 2 years",
    preview:["Write a winning Upwork bio.","Use: results · personality · CTA"],
    sys:"You are a top Upwork consultant. Write a compelling bio (150-200 words). Bold hook, specific results, personality, clear CTA. First person. No buzzwords.",
    p:"Write a winning Upwork profile bio for: " },
  { id:10, cat:"Freelancer", emoji:"📧", title:"Cold Email to Client", pro:true, xp:20,
    insight:"Cold emails that lead with value get 3x more replies.",
    lbl:"Describe your target client", ph:"e.g. E-commerce stores needing social content",
    preview:["Write a cold email for [TARGET].","Use: personalization · value · short CTA"],
    sys:"You are a B2B copywriter. Write a cold email under 120 words. Subject line + body. Lead with value. Low-friction CTA. Human and specific.",
    p:"Write a cold email targeting: " },
  { id:11, cat:"Productivity", emoji:"⚡", title:"Daily Schedule Builder", pro:false, xp:10,
    insight:"The best schedules protect energy, not just time.",
    lbl:"What is your main goal today?", ph:"e.g. Finish my online course",
    preview:["Build a daily schedule for [GOAL].","Use: time blocks · priorities · breaks"],
    sys:"You are a productivity coach. Create a focused daily schedule. Use time blocks (e.g. 9:00 AM - 10:00 AM). 3-4 deep work blocks and breaks. Format: TIME - TASK.",
    p:"Build a productive daily schedule for: " },
  { id:12, cat:"Productivity", emoji:"🎯", title:"Goal Breakdown System", pro:true, xp:15,
    insight:"Big goals only happen when broken into tiny daily actions.",
    lbl:"What is your big goal?", ph:"e.g. Launch my online store in 3 months",
    preview:["Break [GOAL] into a 30-day plan.","Use: milestones · daily tasks · priorities"],
    sys:"You are a goal-setting coach. Break the goal into a 30-day action plan. Week 1-4 milestones. 3 daily actions per week. Format: Week 1: [Milestone] - Daily: 1. 2. 3.",
    p:"Create a 30-day action plan to achieve: " },
  { id:13, cat:"Productivity", emoji:"🧠", title:"Focus Mode Ritual", pro:true, xp:15,
    insight:"A pre-work ritual trains your brain to enter deep focus.",
    lbl:"Describe your work situation", ph:"e.g. Work from home, easily distracted",
    preview:["Create a focus ritual.","Use: environment · mindset · habits"],
    sys:"You are a deep work expert. Create a 10-minute pre-work focus ritual. Environment setup (2 steps), mindset prep (2 steps), body activation (1 step), work trigger (1 step). Numbered steps.",
    p:"Create a personalized focus ritual for someone who: " },
  { id:14, cat:"Communication", emoji:"✉️", title:"Message Improver", pro:false, xp:10,
    insight:"Clear, warm messages get faster replies and better results.",
    lbl:"Enter your message", ph:"e.g. Can we meet sometime?",
    preview:["Improve [MESSAGE] into 3 versions.","Use: clarity · warmth · professional tone"],
    sys:"You are a communication expert. Improve the message into 3 versions: Professional, Friendly, Direct. Each under 2 sentences. Format: Professional: ... Friendly: ... Direct: ...",
    p:"Improve this message into 3 better versions: " },
  { id:15, cat:"Communication", emoji:"😤", title:"Difficult Conversation", pro:true, xp:20,
    insight:"Scripting hard conversations reduces anxiety and improves outcomes.",
    lbl:"Describe the situation", ph:"e.g. Telling my boss I need a raise",
    preview:["Write a script for [SITUATION].","Use: calm · assertive · empathy"],
    sys:"You are a communication coach. Write a short script: Opening line (disarming), Core message (1-2 sentences), Response to pushback, Desired outcome. Under 100 words. Human.",
    p:"Write a script for this difficult conversation: " },
  { id:16, cat:"Communication", emoji:"🌟", title:"LinkedIn Post Writer", pro:true, xp:15,
    insight:"Personal stories on LinkedIn get 10x more engagement than tips.",
    lbl:"What is your story or lesson?", ph:"e.g. I failed my first business and learned this",
    preview:["Write a viral LinkedIn post.","Use: vulnerability · lesson · inspiration"],
    sys:"You are a LinkedIn strategist. Write a viral post: One-line hook, story in 3-4 short paragraphs, lesson and question for comments. Under 200 words. No hashtag spam.",
    p:"Write a viral LinkedIn post about: " },
  { id:17, cat:"Business", emoji:"💡", title:"Business Idea Validator", pro:true, xp:25,
    insight:"Validating before building saves months of wasted effort.",
    lbl:"Describe your business idea", ph:"e.g. App that helps people find study partners",
    preview:["Validate [BUSINESS IDEA] quickly.","Use: market · competition · monetization"],
    sys:"You are a startup advisor. Analyze: Customer (who exactly), Problem size, Competition, Monetization, Biggest risk, Verdict (Promising/Needs work/Avoid). 1-2 sentences each section.",
    p:"Validate this business idea: " },
  { id:18, cat:"Business", emoji:"📣", title:"Product Launch Copy", pro:true, xp:20,
    insight:"Launch copy that sells the transformation, not the product.",
    lbl:"Describe your product", ph:"e.g. Online course teaching graphic design",
    preview:["Write launch copy for [PRODUCT].","Use: transformation · urgency · benefits"],
    sys:"You are a launch copywriter. Write: Headline (transformation-focused), 3 outcome-focused benefits, Social proof placeholder, Price anchor, CTA. Under 150 words.",
    p:"Write product launch copy for: " },
  { id:19, cat:"Business", emoji:"🔥", title:"Ad Copy Generator", pro:true, xp:20,
    insight:"The best ads make readers feel seen before selling anything.",
    lbl:"Describe your product and audience", ph:"e.g. Productivity app for busy parents",
    preview:["Write 3 ad copy variations.","Use: pain · hook · desire"],
    sys:"You are a performance marketing copywriter. Write 3 ad variations: Pain-focused, Desire-focused, Social proof-focused. Each: Headline (under 8 words) + Body (2-3 sentences). Format with labels.",
    p:"Write 3 ad copy variations for: " },
  { id:20, cat:"Business", emoji:"📊", title:"Pricing Strategy Advisor", pro:true, xp:25,
    insight:"Pricing too low destroys perceived value.",
    lbl:"Describe your service and current price", ph:"e.g. Social media management, $200/month",
    preview:["Advise on pricing for [SERVICE].","Use: value · tiers · psychology"],
    sys:"You are a pricing strategist. Analyze: Current price assessment, Recommended range, 3-tier package (Basic/Pro/Premium with prices), One psychological pricing tip.",
    p:"Advise on pricing strategy for: " },
];

const CHALLENGES = [1,7,11,14,17,3,2];
const TITLES = {
  Creator:["Content Spark","Rising Creator","Content Pro","Viral Architect","Content Legend"],
  Freelancer:["Freelance Starter","Rising Freelancer","Freelance Pro","Client Magnet","Freelance Legend"],
  Productivity:["Focused Beginner","Productivity Builder","Deep Work Pro","Efficiency Master","Productivity Legend"],
  Communication:["Clear Communicator","Message Crafter","Influence Builder","Persuasion Pro","Comms Legend"],
  Business:["Business Explorer","Strategy Builder","Market Tactician","Business Pro","Business Legend"],
};
const getTitle = (xp, cat) => (TITLES[cat]||TITLES.Creator)[Math.min(Math.floor(xp/100),4)];
const getFav = (hist) => {
  if (!hist||!hist.length) return "Creator";
  const c={};
  hist.forEach(h=>{ c[h.cat]=(c[h.cat]||0)+1; });
  return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];
};
const COLORS = {
  Creator:{light:"#FFF0EB",text:"#FF6B35",g1:"#FF6B35",g2:"#FF8C42"},
  Freelancer:{light:"#F3EEFF",text:"#7C3AED",g1:"#7C3AED",g2:"#9F5CF7"},
  Productivity:{light:"#ECFDF5",text:"#059669",g1:"#059669",g2:"#10B981"},
  Communication:{light:"#F0F9FF",text:"#0EA5E9",g1:"#0EA5E9",g2:"#38BDF8"},
  Business:{light:"#FFFBEB",text:"#D97706",g1:"#F59E0B",g2:"#FBBF24"},
};
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

@keyframes bounce{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-7px)}
}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(14px)}
  to{opacity:1;transform:translateY(0)}
}

@keyframes popIn{
  from{opacity:0;transform:scale(.88)}
  to{opacity:1;transform:scale(1)}
}

@keyframes glow{
  0%,100%{box-shadow:0 0 20px rgba(99,102,241,.35)}
  50%{box-shadow:0 0 40px rgba(99,102,241,.7)}
}

@keyframes slideUp{
  from{transform:translateY(100%)}
  to{transform:translateY(0)}
}

*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
}

html,body,#root{
  margin:0;
  padding:0;
  width:100%;
  min-height:100%;
  overflow-x:hidden;
  background:#f7f7fc;
}

body,input,textarea,button{
  font-family:'Plus Jakarta Sans',sans-serif;
}

::-webkit-scrollbar{
  display:none;
}

/* APP LAYOUT */

.app-shell{
  width:100%;
  display:flex;
  justify-content:center;
  padding:0;
}

.app-container{
  width:100%;
  max-width:1200px;
  min-height:100vh;
  background:#f7f7fc;
}

/* AUTH */

.auth-page{
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:20px;
  background:linear-gradient(160deg,#0f0c29,#302b63,#24243e);
}

.auth-card{
  width:100%;
  max-width:420px;
  background:white;
  padding:32px;
  border-radius:24px;
  box-shadow:0 10px 40px rgba(0,0,0,.2);
}

.logo{
  margin:0;
  font-size:34px;
  text-align:center;
  color:#111827;
}

.subtitle{
  text-align:center;
  color:#6b7280;
  margin-bottom:28px;
}

.auth-input{
  width:100%;
  padding:14px;
  border-radius:14px;
  border:1px solid #ddd;
  margin-bottom:16px;
  font-size:16px;
  outline:none;
}

.auth-btn{
  width:100%;
  padding:14px;
  border:none;
  border-radius:14px;
  background:#4f46e5;
  color:white;
  font-size:16px;
  font-weight:600;
  cursor:pointer;
  margin-bottom:12px;
}

.auth-btn.secondary{
  background:#111827;
}

.loading-screen{
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:22px;
  font-weight:700;
}

/* RESPONSIVE */

@media(max-width:768px){

  .app-container{
    max-width:100%;
  }

  .auth-card{
    padding:24px;
    border-radius:20px;
  }

  .logo{
    font-size:28px;
  }

}

`;

// ── store ─────────────────────────────────────────────────────────────────────
let _U=null,_D=null,_H=[];
function useStore(){
  const [user,setUser]=useState(_U);
  const [ud,setUd]=useState(_D);
  const [hist,setHist]=useState(_H);
  const mkD=(email,name)=>({name:name||email.split("@")[0],email,isPro:false,streak:0,lastUsed:null,dailyCount:0,dailyReset:Date.now(),totalGens:0,doneDays:[],joined:new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}),xp:0,level:1});
  const signUp=(email,name)=>{const u={uid:"u"+Date.now(),email,name:name||email.split("@")[0]};const d=mkD(email,name);_U=u;_D=d;_H=[];setUser(u);setUd(d);setHist([]);return u;};
  const signIn=(email)=>{if(_U&&_U.email===email){setUser(_U);setUd(_D);setHist(_H);return _U;}return signUp(email);};
  const signOut=()=>{_U=null;_D=null;_H=[];setUser(null);setUd(null);setHist([]);};
  const upd=(x)=>{const d={..._D,...x};_D=d;setUd(d);};
  const upgrade=()=>upd({isPro:true});
  const saveOut=(lesson,input,output)=>{const item={id:Date.now(),lid:lesson.id,title:lesson.title,cat:lesson.cat,emoji:lesson.emoji,input,output,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})};const h=[item,..._H].slice(0,50);_H=h;setHist(h);};
  const delOut=(id)=>{const h=_H.filter(x=>x.id!==id);_H=h;setHist(h);};
  const track=(lesson,isChallenge)=>{
    const now=Date.now(),d=_D,day=86400000;
    const isNew=!d.dailyReset||(now-d.dailyReset)>day;
    const today=new Date().toDateString();
    const last=d.lastUsed?new Date(d.lastUsed).toDateString():null;
    const yest=new Date(now-day).toDateString();
    const streak=last===yest?(d.streak||0)+1:last===today?d.streak:1;
    const bonus=isChallenge&&!d.doneDays?.includes(today)?50:0;
    const xp=(d.xp||0)+(lesson.xp||10)+bonus;
    upd({dailyCount:isNew?1:(d.dailyCount||0)+1,dailyReset:isNew?now:d.dailyReset,lastUsed:now,streak,totalGens:(d.totalGens||0)+1,xp,level:Math.floor(xp/100)+1,doneDays:bonus?[...(d.doneDays||[]),today]:(d.doneDays||[])});
    return {xpGain:(lesson.xp||10)+bonus};
  };
  return {user,ud,hist,signIn,signUp,signOut,upgrade,saveOut,delOut,track};
}

// ── mini components ───────────────────────────────────────────────────────────
function Dots(){
  return (
    <div style={{display:"flex",gap:6,justifyContent:"center",padding:"24px 0"}}>
      {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#6366f1",animation:`bounce 1.2s ease ${i*.2}s infinite`}}/>)}
    </div>
  );
}
function XPBar({xp,level}){
  const p=xp%100;
  return (
    <div style={{marginTop:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:11,color:"#a5b4fc",fontWeight:600}}>Level {level}</span>
        <span style={{fontSize:11,color:"#a5b4fc"}}>{p}/100 XP</span>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,.12)",borderRadius:4}}>
        <div style={{height:"100%",width:`${p}%`,background:"linear-gradient(90deg,#818cf8,#c084fc)",borderRadius:4,transition:"width .6s"}}/>
      </div>
    </div>
  );
}
function Toast({msg,vis}){
  if(!vis) return null;
  return <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",padding:"10px 20px",borderRadius:20,fontSize:13,fontWeight:700,zIndex:200,animation:"popIn .3s ease",whiteSpace:"nowrap"}}>{msg}</div>;
}
function ResultCard({text}){
  const lines=text.split("\n").filter(l=>l.trim());
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {lines.map((line,i)=>{
        const clean=line.replace(/^[•\-\*]\s*/,"").replace(/^\d+\.\s*/,"");
        if(!clean.trim()) return null;
        const isLbl=line.includes(":")&&line.split(":")[0].length<25;
        return (
          <div key={i} style={{background:isLbl?"#f8f7ff":"#fff",border:`1.5px solid ${isLbl?"#e0e7ff":"#f0f0f8"}`,borderRadius:12,padding:"12px 16px",fontSize:14,lineHeight:1.6,color:isLbl?"#4338ca":"#1e1e2e",fontWeight:isLbl?600:400,animation:`fadeUp .3s ease ${i*.04}s both`}}>
            {isLbl ? <><span style={{color:"#818cf8",marginRight:6}}>✦</span>{clean}</> : <><span style={{color:"#a5b4fc",marginRight:8}}>→</span>{clean}</>}
          </div>
        );
      })}
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthScreen({onAuth}){
  const [mode,setMode]=useState("signup");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);
  const {signUp,signIn}=useStore();
  const go = async () => {

  if (!email.trim()) return;

  setLoading(true);

  if (mode === "signup") {

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Magic link sent to your email.");
    }

  } else {

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login link sent to your email.");
    }

  }

  setLoading(false);
};
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f0c29,#302b63,#24243e)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:380,animation:"fadeUp .5s ease"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:52,marginBottom:12}}>⚡</div>
          <h1 style={{color:"#fff",fontSize:28,fontWeight:800,margin:"0 0 8px"}}>AI Superpowers</h1>
          <p style={{color:"#94a3b8",fontSize:14,margin:0}}>Fast AI outcomes. Every day.</p>
        </div>
        <div style={{background:"rgba(255,255,255,.05)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:24,padding:28}}>
          <div style={{display:"flex",background:"rgba(0,0,0,.2)",borderRadius:12,padding:4,marginBottom:24}}>
            {["signup","signin"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:10,border:"none",borderRadius:10,background:mode===m?"#6366f1":"transparent",color:mode===m?"#fff":"#94a3b8",fontWeight:600,fontSize:13,cursor:"pointer"}}>
                {m==="signup"?"Get Started":"Sign In"}
              </button>
            ))}
          </div>
          {mode==="signup"&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{width:"100%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"14px 16px",color:"#fff",fontSize:15,marginBottom:12,outline:"none"}}/>}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" onKeyDown={e=>e.key==="Enter"&&go()} style={{width:"100%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"14px 16px",color:"#fff",fontSize:15,marginBottom:20,outline:"none"}}/>
          <button onClick={go} disabled={loading||!email.trim()} style={{width:"100%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:12,padding:16,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",animation:"glow 3s ease infinite"}}>
            {loading?"Loading...":mode==="signup"?"Create Free Account →":"Sign In →"}
          </button>
          <p style={{textAlign:"center",color:"#64748b",fontSize:12,marginTop:16,marginBottom:0}}>3 free lessons/day · No credit card needed</p>
        </div>
      </div>
    </div>
  );
}

// ── PAYWALL ───────────────────────────────────────────────────────────────────
function Paywall({onClose,onUpgrade}){
  const feats=[["⚡","Unlimited generations","No daily limits ever"],["🔓","All 20 premium lessons","Business, Freelancer and more"],["💾","Saved outputs toolkit","Your personal AI library"],["🔥","Streak protection","Never lose your progress"]];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)",zIndex:100,display:"flex",alignItems:"flex-end"}}>
      <div style={{width:"100%",background:"linear-gradient(160deg,#1a1a2e,#16213e)",borderRadius:"24px 24px 0 0",padding:"32px 24px 48px",animation:"slideUp .3s ease"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:44,marginBottom:10}}>👑</div>
          <h2 style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 8px"}}>Go Premium</h2>
          <p style={{color:"#94a3b8",fontSize:14,margin:0}}>Unlock everything. Cancel anytime.</p>
        </div>
        {feats.map(f=>(
          <div key={f[1]} style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(99,102,241,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{f[0]}</div>
            <div><div style={{color:"#fff",fontWeight:600,fontSize:14}}>{f[1]}</div><div style={{color:"#64748b",fontSize:12}}>{f[2]}</div></div>
          </div>
        ))}
        <div style={{background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.3)",borderRadius:16,padding:"14px 20px",marginBottom:20,textAlign:"center"}}>
          <div style={{color:"#a5b4fc",fontSize:12,marginBottom:2}}>Launch Price</div>
          <div style={{color:"#fff",fontSize:30,fontWeight:800}}>$2.99<span style={{fontSize:15,fontWeight:400,color:"#64748b"}}>/month</span></div>
          <div style={{color:"#6ee7b7",fontSize:12,marginTop:2}}>Cancel anytime</div>
        </div>
        <button onClick={onUpgrade} style={{width:"100%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:14,padding:18,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",marginBottom:12}}>Start Premium — $2.99/mo</button>
        <button onClick={onClose} style={{width:"100%",background:"transparent",border:"none",color:"#64748b",fontSize:14,cursor:"pointer"}}>Maybe later</button>
      </div>
    </div>
  );
}

// ── LESSON ────────────────────────────────────────────────────────────────────
function LessonScreen({lesson,ud,onBack,onPaywall,track,saveOut,isChallenge}){
  const [input,setInput]=useState("");
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);
  const [saved,setSaved]=useState(false);
  const [toast,setToast]=useState({msg:"",vis:false});
  const C=COLORS[lesson.cat]||COLORS.Creator;
  const canUse=ud&&(ud.isPro||(ud.dailyCount||0)<3);
  const today=new Date().toDateString();
  const cDone=ud?.doneDays?.includes(today);
  const pop=msg=>{setToast({msg,vis:true});setTimeout(()=>setToast({msg:"",vis:false}),2500);};
  const go=()=>{
    if(!input.trim()) return;
    if(!canUse){onPaywall();return;}
    setLoading(true);setResult("");setSaved(false);
    const {xpGain}=track(lesson,isChallenge&&!cDone);
    fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:lesson.sys,messages:[{role:"user",content:lesson.p + input}]})})
      .then(r=>r.json()).then(data=>{
        const text=data.content?.map(c=>c.text||"").join("\n")||"No result.";
        setResult(text);
        pop(`+${xpGain} XP ⚡${isChallenge&&!cDone?" +50 Challenge Bonus!":""}`);
        setLoading(false);
      }).catch(()=>{setResult("Something went wrong. Please try again.");setLoading(false);});
  };
  const doSave=()=>{saveOut(lesson,input,result);setSaved(true);pop("💾 Saved to your toolkit!");};
  const locked=lesson.pro&&ud&&!ud.isPro;
  return (
    <div style={{minHeight:"100vh",background:"#f7f7fc"}}>
      <Toast msg={toast.msg} vis={toast.vis}/>
      <div style={{background:"#fff",padding:"16px 20px 20px",borderBottom:"1px solid #f0f0f0",position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:14,display:"flex",alignItems:"center",gap:6,padding:0,marginBottom:12}}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:C.light,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{lesson.emoji}</div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1}}>{lesson.cat}</div>
            <div style={{fontSize:18,fontWeight:700,color:"#1e1e2e"}}>{lesson.title}</div>
          </div>
          {isChallenge&&<div style={{marginLeft:"auto",background:"linear-gradient(135deg,#f59e0b,#fbbf24)",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:700,color:"#fff"}}>🔥 +50 XP</div>}
        </div>
      </div>
      <div style={{padding:"20px 20px 40px"}}>
        {isChallenge&&(
          <div style={{background:cDone?"#ecfdf5":"#fffbeb",border:`1.5px solid ${cDone?"#6ee7b7":"#fcd34d"}`,borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:20}}>{cDone?"✅":"🔥"}</span>
            <div style={{fontSize:13,fontWeight:700,color:cDone?"#059669":"#d97706"}}>{cDone?"Challenge completed! Come back tomorrow.":"Daily Challenge: Complete for +50 bonus XP!"}</div>
          </div>
        )}
        <div style={{background:`linear-gradient(135deg,${C.g1},${C.g2})`,borderRadius:16,padding:"16px 20px",marginBottom:16,color:"#fff"}}>
          <div style={{fontSize:11,fontWeight:600,opacity:.8,marginBottom:4,letterSpacing:1}}>QUICK INSIGHT</div>
          <div style={{fontSize:15,lineHeight:1.5,fontWeight:500}}>{lesson.insight}</div>
        </div>
        <div style={{background:"#fff",borderRadius:16,padding:18,border:"1.5px solid #e8e8f0",marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"#a0a0b0",letterSpacing:1,marginBottom:10,textTransform:"uppercase"}}>PROMPT TEMPLATE</div>
          {lesson.preview.map((l,i)=>(
            <div key={i} style={{fontSize:14,color:i===0?"#1e1e2e":"#6366f1",fontWeight:i===0?600:500,lineHeight:1.6,marginBottom:i===0?6:0}}>{l}</div>
          ))}
        </div>
        {locked?(
          <div style={{background:"linear-gradient(135deg,#1a1a2e,#302b63)",borderRadius:16,padding:24,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:8}}>👑</div>
            <div style={{color:"#fff",fontWeight:700,fontSize:16,marginBottom:6}}>Premium Lesson</div>
            <div style={{color:"#94a3b8",fontSize:13,marginBottom:20}}>Upgrade to unlock all 20 premium lessons</div>
            <button onClick={onPaywall} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:12,padding:"14px 28px",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>Unlock — $2.99/mo</button>
          </div>
        ):(
          <>
            <div style={{background:"#fff",borderRadius:16,padding:18,border:"1.5px solid #e8e8f0",marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:10}}>{lesson.lbl}</label>
              <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={lesson.ph} rows={3} style={{width:"100%",border:"1.5px solid #e8e8f0",borderRadius:12,padding:"12px 14px",fontSize:14,resize:"none",outline:"none",color:"#1e1e2e",background:"#fafafa"}} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e8e8f0"}/>
              {ud&&!ud.isPro&&<div style={{fontSize:12,color:"#9ca3af",marginTop:6}}>{Math.max(0,3-(ud.dailyCount||0))} free uses left today</div>}
              <button onClick={go} disabled={!input.trim()||loading} style={{width:"100%",marginTop:12,background:input.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#e5e7eb",color:input.trim()?"#fff":"#9ca3af",border:"none",borderRadius:12,padding:14,fontSize:15,fontWeight:700,cursor:input.trim()?"pointer":"not-allowed"}}>
                {loading?"Generating...":"Generate Now ✦"}
              </button>
            </div>
            {(loading||result)&&(
              <div style={{background:"#fff",borderRadius:16,padding:18,border:"1.5px solid #e8e8f0",animation:"fadeUp .3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#6366f1",letterSpacing:1,textTransform:"uppercase"}}>✦ YOUR RESULTS</div>
                  {result&&!loading&&<button onClick={doSave} disabled={saved} style={{background:saved?"#ecfdf5":"#f8f7ff",border:`1.5px solid ${saved?"#6ee7b7":"#e0e7ff"}`,borderRadius:10,padding:"6px 14px",color:saved?"#059669":"#6366f1",fontWeight:600,fontSize:12,cursor:saved?"default":"pointer"}}>{saved?"✓ Saved":"💾 Save"}</button>}
                </div>
                {loading?<Dots/>:<ResultCard text={result}/>}
                {result&&!loading&&<button onClick={()=>{setResult("");setInput("");setSaved(false);}} style={{marginTop:14,width:"100%",background:"#f8f7ff",border:"1.5px solid #e0e7ff",borderRadius:12,padding:12,color:"#6366f1",fontWeight:600,fontSize:13,cursor:"pointer"}}>Try Again ↻</button>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── HISTORY ───────────────────────────────────────────────────────────────────
function HistoryScreen({hist,onBack,onReuse,delOut}){
  const [filter,setFilter]=useState("All");
  const cats=["All",...new Set(hist.map(h=>h.cat))];
  const shown=filter==="All"?hist:hist.filter(h=>h.cat===filter);
  return (
    <div style={{minHeight:"100vh",background:"#f7f7fc"}}>
      <div style={{background:"#fff",padding:"16px 20px 20px",borderBottom:"1px solid #f0f0f0",position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:14,display:"flex",alignItems:"center",gap:6,padding:0,marginBottom:12}}>← Back</button>
        <div style={{fontSize:20,fontWeight:800,color:"#1e1e2e"}}>💾 Saved Toolkit</div>
        <div style={{fontSize:13,color:"#9ca3af",marginTop:2}}>{hist.length} saved outputs</div>
      </div>
      {!hist.length?(
        <div style={{textAlign:"center",padding:"60px 24px"}}>
          <div style={{fontSize:48,marginBottom:12}}>📂</div>
          <div style={{fontSize:16,fontWeight:700,color:"#374151",marginBottom:8}}>No saved outputs yet</div>
          <div style={{fontSize:14,color:"#9ca3af"}}>Generate something and tap Save to build your toolkit</div>
        </div>
      ):(
        <>
          <div style={{padding:"12px 20px 0",overflowX:"auto"}}>
            <div style={{display:"flex",gap:8,width:"max-content"}}>
              {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"7px 14px",borderRadius:20,border:"1.5px solid",borderColor:filter===c?"#6366f1":"#e8e8f0",background:filter===c?"#6366f1":"#fff",color:filter===c?"#fff":"#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{c}</button>)}
            </div>
          </div>
          <div style={{padding:"12px 20px 40px",display:"flex",flexDirection:"column",gap:12}}>
            {shown.map((item,i)=>(
              <div key={item.id} style={{background:"#fff",borderRadius:16,padding:16,border:"1.5px solid #f0f0f8",animation:`fadeUp .3s ease ${i*.04}s both`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:20}}>{item.emoji}</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#1e1e2e"}}>{item.title}</div>
                      <div style={{fontSize:11,color:"#9ca3af"}}>{item.date}</div>
                    </div>
                  </div>
                  <button onClick={()=>delOut(item.id)} style={{background:"#fff0f0",border:"none",borderRadius:8,padding:"4px 8px",color:"#ef4444",fontSize:11,cursor:"pointer",fontWeight:600}}>Delete</button>
                </div>
                <div style={{background:"#f8f7ff",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                  <div style={{fontSize:11,color:"#818cf8",fontWeight:600,marginBottom:3}}>YOUR INPUT</div>
                  <div style={{fontSize:13,color:"#374151"}}>{item.input}</div>
                </div>
                <div style={{fontSize:12,color:"#9ca3af",lineHeight:1.5,maxHeight:52,overflow:"hidden"}}>{item.output.slice(0,120)}...</div>
                <button onClick={()=>onReuse(item)} style={{marginTop:10,background:"#f8f7ff",border:"1.5px solid #e0e7ff",borderRadius:10,padding:"8px 16px",color:"#6366f1",fontWeight:600,fontSize:12,cursor:"pointer",width:"100%"}}>↗ Reuse This Lesson</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function ProfileScreen({ud,user,hist,onSignOut,onUpgrade}){
  const fav=getFav(hist);
  const C=COLORS[fav]||COLORS.Creator;
  const identity=getTitle(ud?.xp||0,fav);
  return (
    <div style={{minHeight:"100vh",background:"#f7f7fc",paddingBottom:40}}>
      <div style={{background:"linear-gradient(160deg,#0f0c29,#302b63)",padding:"40px 20px 30px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"relative",textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${C.g1},${C.g2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px",fontWeight:700,color:"#fff"}}>
            {(ud?.name||"U")[0].toUpperCase()}
          </div>
          <div style={{color:"#fff",fontSize:20,fontWeight:800}}>{ud?.name}</div>
          <div style={{color:"#94a3b8",fontSize:12,marginBottom:8}}>{user?.email}</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,borderRadius:20,padding:"6px 14px",marginBottom:12,background:C.text+"22",border:`1px solid ${C.text}44`}}>
            <span style={{color:C.text,fontWeight:700,fontSize:13}}>⚡ {identity}</span>
          </div>
          {ud?.isPro&&<div style={{display:"flex",justifyContent:"center"}}><div style={{background:"linear-gradient(135deg,#F59E0B,#FBBF24)",borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:700,color:"#fff"}}>👑 Premium</div></div>}
          <XPBar xp={ud?.xp||0} level={ud?.level||1}/>
        </div>
      </div>
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {[["🔥",ud?.streak||0,"Streak"],["⚡",ud?.totalGens||0,"Generated"],["💾",hist?.length||0,"Saved"]].map(s=>(
            <div key={s[2]} style={{background:"#fff",borderRadius:14,padding:"14px 10px",textAlign:"center",border:"1.5px solid #f0f0f8"}}>
              <div style={{fontSize:18,marginBottom:4}}>{s[0]}</div>
              <div style={{fontSize:20,fontWeight:800,color:"#1e1e2e"}}>{s[1]}</div>
              <div style={{fontSize:10,color:"#9ca3af",fontWeight:600}}>{s[2]}</div>
            </div>
          ))}
        </div>
        {!ud?.isPro&&(
          <div style={{background:"linear-gradient(135deg,#1a1a2e,#302b63)",borderRadius:20,padding:20,marginBottom:20,textAlign:"center"}}>
            <div style={{color:"#fff",fontWeight:700,fontSize:16,marginBottom:4}}>👑 Go Premium</div>
            <div style={{color:"#94a3b8",fontSize:13,marginBottom:16}}>Unlimited · All lessons · Save outputs · $2.99/mo</div>
            <button onClick={onUpgrade} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:12,padding:"14px 32px",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>Upgrade Now</button>
          </div>
        )}
        <div style={{background:"#fff",borderRadius:16,border:"1.5px solid #f0f0f8",overflow:"hidden",marginBottom:20}}>
          {[["🏆","Identity",identity],["📅","Joined",ud?.joined||"Today"],["⚡","XP",`${ud?.xp||0} XP`],["🔓","Plan",ud?.isPro?"Premium 👑":"Free (3/day)"]].map((r,i,arr)=>(
            <div key={r[1]} style={{display:"flex",alignItems:"center",padding:"14px 20px",borderBottom:i<arr.length-1?"1px solid #f0f0f8":"none"}}>
              <span style={{fontSize:16,marginRight:14}}>{r[0]}</span>
              <span style={{flex:1,color:"#374151",fontSize:14,fontWeight:500}}>{r[1]}</span>
              <span style={{color:"#6b7280",fontSize:13}}>{r[2]}</span>
            </div>
          ))}
        </div>
        <button onClick={onSignOut} style={{width:"100%",background:"#fff",border:"1.5px solid #fee2e2",borderRadius:14,padding:16,color:"#ef4444",fontWeight:600,fontSize:15,cursor:"pointer"}}>Sign Out</button>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App(){
  const store=useStore();
  const [tab,setTab]=useState("home");
  const [lesson,setLesson]=useState(null);
  const [isChallenge,setIsChallenge]=useState(false);
  const [catF,setCatF]=useState("All");
  const [paywall,setPaywall]=useState(false);
  const [showHist,setShowHist]=useState(false);
  const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {

  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
    setLoading(false);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();

}, []);
  
  const dayIdx=new Date().getDate()%CHALLENGES.length;
  const cLid=CHALLENGES[dayIdx];
  const cLesson=LESSONS.find(l=>l.id===cLid);
  const today=new Date().toDateString();
  const cDone=store.ud?.doneDays?.includes(today);

  const handleAuth=u=>{if(u)store.signIn(u.email);};
  const open=(l,ch)=>{setLesson(l);setIsChallenge(!!ch);};
  const reuse=item=>{const l=LESSONS.find(x=>x.id===item.lid);if(l){setLesson(l);setIsChallenge(false);setShowHist(false);}};

  if(!user) return <LoginButton />;
  if(showHist) return <HistoryScreen hist={store.hist} onBack={()=>setShowHist(false)} onReuse={reuse} delOut={store.delOut}/>;
  if(lesson) return (
    <>
      <LessonScreen lesson={lesson} ud={store.ud} onBack={()=>setLesson(null)} onPaywall={()=>setPaywall(true)} track={store.track} saveOut={store.saveOut} isChallenge={isChallenge}/>
      {paywall&&<Paywall onClose={()=>setPaywall(false)} onUpgrade={()=>{store.upgrade();setPaywall(false);}}/>}
    </>
  );

  const cats=["All","Creator","Freelancer","Productivity","Communication","Business"];
  const shown=catF==="All"?LESSONS:LESSONS.filter(l=>l.cat===catF);
  const fav=getFav(store.hist);
  const identity=getTitle(store.ud?.xp||0,fav);
  const IC=COLORS[fav]||COLORS.Creator;

  if (loading) {
  return (
    <div className="loading-screen">
      Loading...
    </div>
  )
}

if (!user) {
  return <AuthScreen onAuth={() => {}} />
}
  
  return (
  <div className="app-shell">
    <div className="app-container">

      <style>{CSS}</style>

      <div style={{minHeight:"100vh",background:"#f7f7fc",paddingBottom:80}}>

      {tab==="home"&&(
        <>
          <div style={{background:"linear-gradient(160deg,#0f0c29,#302b63,#24243e)",padding:"32px 20px 24px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,.3) 0%,transparent 70%)"}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div>
                  <div style={{color:"#94a3b8",fontSize:13}}>Welcome back,</div>
                  <div style={{color:"#fff",fontSize:22,fontWeight:800}}>{store.ud?.name} 👋</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:6,borderRadius:20,padding:"4px 10px",marginTop:6,background:IC.text+"22",border:`1px solid ${IC.text}44`}}>
                    <span style={{fontSize:12,color:IC.text,fontWeight:700}}>⚡ {identity}</span>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                  {store.ud?.isPro
                    ?<div style={{background:"linear-gradient(135deg,#F59E0B,#FBBF24)",borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:700,color:"#fff"}}>👑 Premium</div>
                    :<button onClick={()=>setPaywall(true)} style={{background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.4)",borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:700,color:"#a5b4fc",cursor:"pointer"}}>Upgrade ✦</button>}
                  {(store.ud?.streak||0)>0&&<div style={{color:"#fbbf24",fontSize:12,fontWeight:600}}>🔥 {store.ud.streak} day streak</div>}
                  <button onClick={()=>setShowHist(true)} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:600,color:"#94a3b8",cursor:"pointer"}}>💾 {store.hist.length} Saved</button>
                </div>
              </div>
              <XPBar xp={store.ud?.xp||0} level={store.ud?.level||1}/>
            </div>
          </div>

          <div style={{padding:"16px 20px 0"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>⭐ Daily Challenge</div>
            <div onClick={()=>open(cLesson,true)} style={{background:cDone?"linear-gradient(135deg,#0d3320,#1a2e1a)":"linear-gradient(135deg,#1a1a2e,#302b63)",borderRadius:20,padding:18,cursor:"pointer",marginBottom:12,display:"flex",alignItems:"center",gap:16,border:`1px solid ${cDone?"rgba(110,231,183,.3)":"rgba(99,102,241,.3)"}`}}>
              <div style={{width:50,height:50,borderRadius:14,background:cDone?"rgba(5,150,105,.3)":"rgba(99,102,241,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{cDone?"✅":cLesson?.emoji}</div>
              <div style={{flex:1}}>
                <div style={{color:cDone?"#6ee7b7":"#a5b4fc",fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:3}}>{cDone?"COMPLETED TODAY":"TODAY'S CHALLENGE"}</div>
                <div style={{color:"#fff",fontWeight:700,fontSize:15,marginBottom:2}}>{cLesson?.title}</div>
                <div style={{color:cDone?"#6ee7b7":"#fbbf24",fontSize:12,fontWeight:600}}>{cDone?"✓ +50 XP earned!":"🔥 Complete for +50 bonus XP"}</div>
              </div>
              {!cDone&&<div style={{color:"#6366f1",fontSize:18}}>→</div>}
            </div>
            {store.ud&&!store.ud.isPro&&<div style={{fontSize:12,color:"#9ca3af",textAlign:"center",marginBottom:4}}>{Math.max(0,3-(store.ud?.dailyCount||0))} free uses left · <span onClick={()=>setPaywall(true)} style={{color:"#6366f1",cursor:"pointer",fontWeight:600}}>Go unlimited →</span></div>}
          </div>

          <div style={{padding:"12px 20px 0",overflowX:"auto"}}>
            <div style={{display:"flex",gap:8,width:"max-content"}}>
              {cats.map(c=><button key={c} onClick={()=>setCatF(c)} style={{padding:"7px 14px",borderRadius:20,border:"1.5px solid",borderColor:catF===c?"#6366f1":"#e8e8f0",background:catF===c?"#6366f1":"#fff",color:catF===c?"#fff":"#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{c}</button>)}
            </div>
          </div>

          <div style={{padding:"12px 20px 0",display:"flex",flexDirection:"column",gap:10}}>
            {shown.map((l,i)=>{
              const C=COLORS[l.cat]||COLORS.Creator;
              return (
                <div key={l.id} onClick={()=>open(l,false)} style={{background:"#fff",borderRadius:16,padding:16,border:"1.5px solid #f0f0f8",boxShadow:"0 2px 12px rgba(0,0,0,.04)",cursor:"pointer",animation:`fadeUp .3s ease ${i*.04}s both`,display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:46,height:46,borderRadius:12,background:C.light,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,position:"relative"}}>
                    {l.emoji}
                    {l.pro&&store.ud&&!store.ud.isPro&&<div style={{position:"absolute",top:-4,right:-4,fontSize:11}}>🔒</div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <div style={{fontSize:10,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:.8}}>{l.cat}</div>
                      {l.pro&&<div style={{background:"linear-gradient(135deg,#F59E0B,#FBBF24)",borderRadius:6,padding:"1px 6px",fontSize:9,fontWeight:700,color:"#fff"}}>PRO</div>}
                      <div style={{marginLeft:"auto",fontSize:10,color:"#a5b4fc",fontWeight:600}}>+{l.xp} XP</div>
                    </div>
                    <div style={{fontSize:14,fontWeight:700,color:"#1e1e2e",marginBottom:2}}>{l.title}</div>
                    <div style={{fontSize:11,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.insight}</div>
                  </div>
                  <div style={{width:28,height:28,borderRadius:"50%",background:"#f8f7ff",display:"flex",alignItems:"center",justifyContent:"center",color:"#6366f1",fontSize:14,flexShrink:0}}>→</div>
                </div>
              );
            })}
          </div>
          <div style={{textAlign:"center",padding:"16px 20px 0",color:"#c4c4d4",fontSize:12}}>✦ No complexity. Just results.</div>
        </>
      )}
      {tab==="profile"&&<ProfileScreen ud={store.ud} user={store.user} hist={store.hist} onSignOut={store.signOut} onUpgrade={()=>setPaywall(true)}/>}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #f0f0f0",display:"flex",padding:"10px 0 18px",zIndex:50}}>
        {[["home","⚡","Lessons"],["profile","👤","Profile"]].map(([t,e,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{fontSize:20}}>{e}</div>
            <div style={{fontSize:11,fontWeight:600,color:tab===t?"#6366f1":"#9ca3af"}}>{l}</div>
            {tab===t&&<div style={{width:18,height:2,background:"#6366f1",borderRadius:2}}/>}
          </button>
        ))}
      </div>
      {paywall&&<Paywall onClose={()=>setPaywall(false)} onUpgrade={()=>{store.upgrade();setPaywall(false);}}/>}
    </div>
    </div>
  </div>
);
}
