'use client';

// ===== Style objects ใช้ร่วมกันทุก component =====

export const C  = {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:20};
export const ST = {fontSize:'0.72rem',fontWeight:700,color:'#6B7AA8',textTransform:'uppercase',letterSpacing:'0.09em',marginBottom:12};
export const IN = {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'12px 16px',color:'#F0F4FF',fontFamily:'inherit',fontSize:'1rem',outline:'none',width:'100%',colorScheme:'dark'};

// ===== ชิ้นส่วน UI เล็กๆ =====

export const Sp=()=><span style={{display:'inline-block',width:15,height:15,border:'2px solid rgba(255,255,255,0.25)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .8s linear infinite'}}/>;

export const Fld=({label,children})=><div style={{display:'flex',flexDirection:'column',gap:8}}><label style={{fontSize:'1rem',fontWeight:600,color:'#E8EDFF'}}>{label}</label>{children}</div>;

export const Chips=({opts,val,set})=><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{opts.map(o=><button key={o.v} onClick={()=>set(o.v)} style={{padding:'8px 14px',borderRadius:20,fontFamily:'inherit',fontSize:'0.88rem',cursor:'pointer',border:val===o.v?'1px solid #60A5FA':'1px solid rgba(255,255,255,0.08)',background:val===o.v?'rgba(96,165,250,0.12)':'rgba(255,255,255,0.02)',color:val===o.v?'#60A5FA':'#8B92B8'}}>{o.l}</button>)}</div>;

export const Rem=({items})=><div>{items.map((r,i)=><div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'10px 0',borderBottom:i<items.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}><span style={{display:'flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:'50%',background:'rgba(139,92,246,0.2)',color:'#A78BFA',fontSize:'0.68rem',fontWeight:800,flexShrink:0,marginTop:2}}>{i+1}</span><span style={{fontSize:'0.9rem',lineHeight:1.7,color:'#E8EDFF'}}>{r}</span></div>)}</div>;

export const Err=({msg})=>msg?<p style={{color:'#F87171',fontSize:'0.83rem',textAlign:'center',lineHeight:1.6}}>{msg}</p>:null;

export const RstBtn=({onClick,label})=><button onClick={onClick} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.08)',color:'#6B7AA8',padding:'12px',borderRadius:10,fontFamily:'inherit',fontSize:'0.88rem',cursor:'pointer',width:'100%',marginBottom:8}}>{label}</button>;

export const SubBtn=({onClick,loading,txt,children})=><button onClick={onClick} disabled={loading} style={{background:'linear-gradient(135deg,#1A3370,#1E40AF)',border:'1px solid rgba(96,165,250,0.25)',color:'#fff',padding:'14px',borderRadius:12,fontFamily:'inherit',fontSize:'1rem',fontWeight:700,cursor:'pointer',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:loading?0.7:1}}>{loading?<><Sp/> {txt||'กำลังทำนาย...'}</>:children}</button>;

// ป้ายเล็กบอกว่าเป็นโหมดไม่มี AI
export const FallbackNote=({show})=>show?<p style={{color:'rgba(107,122,168,0.6)',fontSize:'0.7rem',textAlign:'center',marginTop:-6}}>🔌 โหมดไม่มี AI (ยังไม่ได้ตั้งค่า API key) — คำวิเคราะห์มาจากตำราสำเร็จรูป</p>:null;

// ปุ่มรองแบบโปร่ง (แชร์/บันทึก) — เรียงแนวนอนได้
export const GhostBtn=({onClick,children,flex})=><button onClick={onClick} style={{flex:flex?1:'none',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'#C7D0F0',padding:'11px 14px',borderRadius:10,fontFamily:'inherit',fontSize:'0.85rem',fontWeight:600,cursor:'pointer'}}>{children}</button>;

// การ์ดของขลัง/สี/เลขมงคล
export const CharmCard=({charm})=>!charm?null:(
  <div style={{...C,display:'flex',gap:14,alignItems:'center'}}>
    <div style={{fontSize:'1.8rem',flexShrink:0}}>🪬</div>
    <div style={{display:'flex',flexDirection:'column',gap:3}}>
      <p style={{fontSize:'0.68rem',fontWeight:700,color:'#6B7AA8',textTransform:'uppercase',letterSpacing:'0.09em'}}>ของขลัง / สี / เลขมงคลประจำตัว</p>
      <p style={{fontSize:'0.92rem',color:'#E8EDFF',lineHeight:1.6}}>พก <b style={{color:'#A78BFA'}}>{charm.item}</b> · สีมงคล <b style={{color:'#FBBF24'}}>{charm.color}</b> · เลข <b style={{color:'#60A5FA'}}>{charm.number}</b></p>
    </div>
  </div>
);

// Modal overlay กลางจอ
export const Modal=({children,onClose})=>(
  <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(3,6,18,0.78)',backdropFilter:'blur(4px)',zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
    <div onClick={(e)=>e.stopPropagation()} style={{...C,maxWidth:380,width:'100%',maxHeight:'85vh',overflowY:'auto'}}>{children}</div>
  </div>
);
