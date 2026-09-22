(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,11699,e=>{"use strict";var a=e.i(43476),t=e.i(71645),l=e.i(17580),r=e.i(24718),n=e.i(53729),s=e.i(44080),i=e.i(68242),o=e.i(54858),authPT=e.i(38036);const PT_SUMMARY_CACHE_PREFIX="bdb-pihak-summary-v4:",PT_SUMMARY_TTL=24e4;function ptSummaryCacheKey(e){try{let a=(0,authPT.getUser)();if(!a)return null;let t=String(a?.id??"").trim(),l=String(a?.email||"").trim();if(!t&&!l)return null;let r=(0,authPT.deriveRoles)(a);return PT_SUMMARY_CACHE_PREFIX+JSON.stringify({user:`${t}|${l}`,role:String(r?.label||""),filter:{search:e.search||"",sumber:e.sumber||"ALL",from:e.from||"",to:e.to||"",kejahatan:e.kejahatan||"",area:e.area||"",satker_id:e.satker_id??null}})}catch{return null}}const PT_LIST_CACHE_PREFIX="bdb-pihak-list-v4:",PT_LIST_TTL=24e4;function ptListCacheKey(e,a,t){try{let l=(0,authPT.getUser)();if(!l)return null;let r=String(l?.id??"").trim(),n=String(l?.email||"").trim();if(!r&&!n)return null;let s=(0,authPT.deriveRoles)(l);return PT_LIST_CACHE_PREFIX+JSON.stringify({user:`${r}|${n}`,role:String(s?.label||""),page:Number(a||1),row:Number(t||25),filter:{search:e.search||"",keterlibatan:e.keterlibatan||"ALL",sumber:e.sumber||"ALL",status:e.status||"ALL",from:e.from||"",to:e.to||"",kejahatan:e.kejahatan||"",area:e.area||"",satker_id:e.satker_id??null}})}catch{return null}}function u(e){let a=(e.unit_satker_nama||"").trim();return a||[e.unit_nama,e.satker_nama].map((e=>(e||"").trim())).filter(Boolean).join(" ")||"—"}function z(e){let a=e?.response?.data?.message||e?.message;return Array.isArray(a)?a.join("; "):String(a||"Data gagal dimuat. Coba persempit filter lalu klik Terapkan kembali.")}let d=[{label:"Semua Keterlibatan",value:"ALL"},{label:"Saksi",value:"SAKSI"},{label:"Terlapor",value:"TERLAPOR"},{label:"Korban",value:"KORBAN"},{label:"Pelapor",value:"PELAPOR"},{label:"Ahli",value:"AHLI"},{label:"Tersangka",value:"TERSANGKA"},{label:"DPO",value:"DPO"}],m=[{label:"Semua Sumber",value:"ALL"},{label:"DORS",value:"DORS"},{label:"Dokumen",value:"DOKUMEN"},{label:"Manual",value:"MANUAL"}],q=[{key:"semua",label:"Semua",keterlibatan:"ALL",status:"ALL"},{key:"lidik",label:"Lidik",keterlibatan:"ALL",status:"LIDIK"},{key:"korban",label:"Korban",keterlibatan:"KORBAN",status:"ALL"},{key:"saksi",label:"Saksi",keterlibatan:"SAKSI",status:"ALL"},{key:"pelapor",label:"Pelapor",keterlibatan:"PELAPOR",status:"ALL"},{key:"terlapor",label:"Terlapor",keterlibatan:"TERLAPOR",status:"ALL"},{key:"tersangka",label:"Tersangka",keterlibatan:"TERSANGKA",status:"ALL"},{key:"dpo",label:"DPO",keterlibatan:"DPO",status:"ALL"}];let qSering=[{key:"semua",label:"Semua",peran:"ALL"},{key:"dpo",label:"DPO",peran:"DPO"},{key:"tersangka",label:"Tersangka",peran:"TERSANGKA"},{key:"terlapor",label:"Terlapor",peran:"TERLAPOR"},{key:"saksi",label:"Saksi",peran:"SAKSI"},{key:"korban",label:"Korban",peran:"KORBAN"},{key:"pelapor",label:"Pelapor",peran:"PELAPOR"}];function b(e){if(!e)return"—";let a=String(e).slice(0,10),t=new Date(a);return isNaN(t.getTime())?a:t.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}

function ptDefaultPeriod(){
  let now=new Date(),
      year=now.getFullYear();

  return{
    from:`${year}-01-01`,
    to:`${year}-12-31`,
    month:"01",
    year:String(year),
    label:"Tahun "+year
  }
}

function ptMonthRange(year,month){
  let y=Number(year),
      m=Number(month),
      first=new Date(y,m-1,1),
      last=new Date(y,m,0),
      mm=String(m).padStart(2,"0"),
      dd=String(last.getDate()).padStart(2,"0");

  return{
    from:`${y}-${mm}-01`,
    to:`${y}-${mm}-${dd}`,
    month:mm,
    year:String(y),
    label:first.toLocaleDateString(
      "id-ID",
      {
        month:"long",
        year:"numeric"
      }
    )
  }
}

function ptDateLabel(value){
  if(!value)return"";

  let d=new Date(value+"T00:00:00");

  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString(
        "id-ID",
        {
          day:"2-digit",
          month:"short",
          year:"numeric"
        }
      )
}

function ptDescribePeriod(from,to){
  let valid=/^\d{4}-\d{2}-\d{2}$/;

  if(
    valid.test(from||"") &&
    valid.test(to||"")
  ){
    let year=from.slice(0,4),
        month=from.slice(5,7);if(from===year+"-01-01"&&to===year+"-12-31"){return{mode:"year",month,year,customFrom:from,customTo:to,label:"Tahun "+year}}let 
        full=ptMonthRange(year,month);

    if(
      full.from===from &&
      full.to===to
    ){
      return{
        mode:"month",
        month,
        year,
        customFrom:from,
        customTo:to,
        label:full.label
      }
    }

    return{
      mode:"custom",
      month,
      year,
      customFrom:from,
      customTo:to,
      label:
        ptDateLabel(from)+
        " s.d. "+
        ptDateLabel(to)
    }
  }

  let d=ptDefaultPeriod();

  return{
    mode:"month",
    month:d.month,
    year:d.year,
    customFrom:d.from,
    customTo:d.to,
    label:d.label
  }
}

function ptMonthOptions(){
  return Array.from(
    {length:12},
    (_,idx)=>{
      let value=
        String(idx+1).padStart(2,"0");

      return{
        value,
        label:new Date(
          2026,
          idx,
          1
        ).toLocaleDateString(
          "id-ID",
          {month:"long"}
        )
      }
    }
  )
}

function ptYearOptions(){
  let current=
    new Date().getFullYear();

  return Array.from(
    {length:10},
    (_,idx)=>{
      let year=
        String(current-idx);

      return{
        label:year,
        value:year
      }
    }
  )
}
if(typeof window!=="undefined"&&!window.__cas_route_listener){window.__cas_route_listener=true;let wrap=function(m){let o=history[m];history[m]=function(){let r=o.apply(this,arguments);window.dispatchEvent(new Event("cas_route_change"));return r}};wrap("pushState");wrap("replaceState")};e.s(["default",0,function(){let[currPath,setCurrPath]=(0,t.useState)(()=>"undefined"!==typeof window?window.location.pathname:"");(0,t.useEffect)(()=>{let chk=()=>{if("undefined"!==typeof window&&window.location.pathname!==currPath){setCurrPath(window.location.pathname)}};let tId=setInterval(chk,200);window.addEventListener("popstate",chk);window.addEventListener("cas_route_change",chk);return()=>{clearInterval(tId);window.removeEventListener("popstate",chk);window.removeEventListener("cas_route_change",chk)}},[currPath]);let isSering="undefined"!==typeof window&&(currPath.includes("pihak-sering")||(window.location&&window.location.search.includes("mode=sering")));let decPt=function(t){try{let b=t.replace(/-/g,"+").replace(/_/g,"/");while(b.length%4)b+="=";let s=atob(b);let k="cas_pt_enc_2026_bareskrim";let r="";for(let i=0;i<s.length;i++){r+=String.fromCharCode(s.charCodeAt(i)^k.charCodeAt(i%k.length))}let p=JSON.parse(r);return p.s||""}catch(e){return null}};let getPtTok=function(){if("undefined"===typeof window)return"";let p=window.location.pathname||"";if(p.startsWith("/cms/laporan/rekap-pihak-terlibat/")){let seg=p.split("/").filter(Boolean);if(seg.length>3)return seg[seg.length-1]}let q=new URLSearchParams(window.location.search);return q.get("token")||q.get("id")||q.get("ref")||""};let initTok=getPtTok();let initDec=initTok?decPt(initTok):null;let initSearch=initDec||(("undefined"!==typeof window&&new URLSearchParams(window.location.search).get("search")))||"";let[e,h]=(0,t.useState)([]),[c,p]=(0,t.useState)(0),[g,S]=(0,t.useState)(!0),[A,v]=(0,t.useState)(1),[f,y]=(0,t.useState)(25),[x,j]=(0,t.useState)({semua:0,lidik:0,korban:0,saksi:0,pelapor:0,terlapor:0,tersangka:0,dpo:0}),[k,L]=(0,t.useState)(initSearch),[w,R]=(0,t.useState)("ALL"),[T,N]=(0,t.useState)("ALL"),[D,O]=(0,t.useState)("ALL"),[P,I]=(0,t.useState)(()=>ptDefaultPeriod().from),[M,U]=(0,t.useState)(()=>ptDefaultPeriod().to),[ptPeriodOpen,setPtPeriodOpen]=(0,t.useState)(!1),[ptPeriodMode,setPtPeriodMode]=(0,t.useState)("year"),[ptPeriodMonth,setPtPeriodMonth]=(0,t.useState)(()=>ptDefaultPeriod().month),[ptPeriodYear,setPtPeriodYear]=(0,t.useState)(()=>ptDefaultPeriod().year),[ptCustomFrom,setPtCustomFrom]=(0,t.useState)(P),[ptCustomTo,setPtCustomTo]=(0,t.useState)(M),[ptPeriodLabel,setPtPeriodLabel]=(0,t.useState)(()=>ptDescribePeriod(P,M).label),[ptPeriodError,setPtPeriodError]=(0,t.useState)(""),[F,H]=(0,t.useState)(""),[crimeOptsPT,setCrimeOptsPT]=(0,t.useState)([]),[B,G]=(0,t.useState)(""),[scopeOptsPT,setScopeOptsPT]=(0,t.useState)([]),[scopeSatkerPT,setScopeSatkerPT]=(0,t.useState)(13),[V,E]=(0,t.useState)({search:initSearch,keterlibatan:"ALL",sumber:"ALL",status:"ALL",from:ptDefaultPeriod().from,to:ptDefaultPeriod().to,kejahatan:"",area:"",satker_id:13}),[Q,Z]=(0,t.useState)(""),[Y,J]=(0,t.useState)("");(0,t.useEffect)((()=>{let jump=null;try{let raw=sessionStorage.getItem("cas_pt_jump");if(raw){jump=JSON.parse(raw);sessionStorage.removeItem("cas_pt_jump")}}catch(o){}let tok=getPtTok();let dec=tok?decPt(tok):null;let qSearch=dec||("undefined"!==typeof window&&new URLSearchParams(window.location.search).get("search"))||jump?.search||"";let isNat=Boolean(dec)||(jump?.scope==="national")||("undefined"!==typeof window&&(window.location.search.includes("scope=national")||Boolean(tok)));L(qSearch);if(isNat){setScopeSatkerPT(null);E(a=>({...a,search:qSearch,satker_id:null}))}else{let defSat=13;setScopeSatkerPT(defSat);E(a=>({...a,search:qSearch,satker_id:defSat}))}h([]);S(!0)}),[currPath]),(0,t.useEffect)(()=>{o.apiAuth.get("/bdb/kinerja-perkara/meta/jenis-kejahatan").then(e=>{let a=Array.isArray(e.data?.data)?e.data.data:[],r=[...new Set(a.map(e=>String(e?.keterangan||"").trim()).filter(Boolean))];setCrimeOptsPT(r.map(e=>({label:e,value:e})))}).catch(()=>setCrimeOptsPT([]));o.apiAuth.get("/bdb/kinerja-perkara/meta/scope-options").then(e=>{let a=e.data?.data||{},r=Array.isArray(a.options)?a.options:[];let tok=getPtTok();let isNat=Boolean(tok)||("undefined"!=typeof window&&window.location.search.includes("scope=national"));let n=isNat?null:(a.defaultRegionId!=null?Number(a.defaultRegionId):13);setScopeOptsPT(r);if(!isNat&&n!=null){setScopeSatkerPT(n);E(p=>({...p,satker_id:n}))}}).catch(()=>setScopeOptsPT([]))},[]);let C=(0,t.useCallback)((async()=>{S(!0),Z("");if(isSering){j({semua:0,dpo:0,tersangka:0,terlapor:0,saksi:0,korban:0,pelapor:0});try{let a=(await o.apiAuth.get("/bdb/pihak-terlibat/ranking",{params:{master:"1",peran:w,page:A,row:f,...V.search?{search:V.search}:{},...V.from?{from:V.from}:{},...V.to?{to:V.to}:{}}})).data,d=a?.data||[],m=a?.pagination||{},s=a?.meta?.summary;h(d),p(Number(m.total||d.length));if(s)j(s)}catch(e){Z(z(e))}finally{S(!1)}return}let e=ptListCacheKey(V,A,f);if(e)try{let a=sessionStorage.getItem(e);if(a){let t=JSON.parse(a);if(t&&Number(t.expiresAt)>Date.now()&&Array.isArray(t.data)&&Number.isFinite(Number(t.total))){h(t.data),p(Number(t.total)),S(!1);return}sessionStorage.removeItem(e)}}catch{}try{let a=(await o.apiAuth.get("/bdb/pihak-terlibat",{params:{page:A,row:f,...V.search?{search:V.search}:{},..."ALL"!==V.keterlibatan?{keterlibatan:V.keterlibatan}:{},..."ALL"!==V.sumber?{sumber:V.sumber}:{},..."ALL"!==V.status?{status:V.status}:{},...V.from?{from:V.from}:{},...V.to?{to:V.to}:{},...V.kejahatan?{kejahatan:V.kejahatan}:{},...V.area?{area:V.area}:{},...V.satker_id?{satker_id:V.satker_id}:{}}})).data,d=a?.data||[],m=a?.meta||{},u=null!=m.total?Number(m.total):(A-1)*f+d.length+(m.hasNext?1:0);h(d),p(u);if(e)try{sessionStorage.setItem(e,JSON.stringify({expiresAt:Date.now()+PT_LIST_TTL,data:d,total:u}))}catch{}}catch(e){Z(z(e))}finally{S(!1)}}),[A,f,V,currPath,w]);(0,t.useEffect)((()=>{C()}),[C]);(0,t.useEffect)((()=>{if(isSering)return;j({semua:0,lidik:0,korban:0,saksi:0,pelapor:0,terlapor:0,tersangka:0,dpo:0});let e=!1;J("");let a=ptSummaryCacheKey(V);if(a)try{let t=sessionStorage.getItem(a);if(t){let l=JSON.parse(t);if(l&&Number(l.expiresAt)>Date.now()&&l.data&&"object"==typeof l.data){j(l.data);return()=>{e=!0}}sessionStorage.removeItem(a)}}catch{}(async()=>{try{let t=(await o.apiAuth.get("/bdb/pihak-terlibat",{params:{summary_only:1,...V.search?{search:V.search}:{},..."ALL"!==V.sumber?{sumber:V.sumber}:{},...V.from?{from:V.from}:{},...V.to?{to:V.to}:{},...V.kejahatan?{kejahatan:V.kejahatan}:{},...V.area?{area:V.area}:{},...V.satker_id?{satker_id:V.satker_id}:{}}})).data,l=t?.meta?.summary||{};if(!e){j(l);if(a)try{sessionStorage.setItem(a,JSON.stringify({expiresAt:Date.now()+PT_SUMMARY_TTL,data:l}))}catch{}}}catch(a){e||(j({}),J(z(a)))}})();return()=>{e=!0}}),[currPath,V.search,V.sumber,V.from,V.to,V.kejahatan,V.area,V.satker_id]);

function ptTogglePeriodPanel(){
  if(ptPeriodOpen){
    setPtPeriodOpen(!1);
    return
  }

  let period=
    ptDescribePeriod(P,M);

  setPtPeriodMode(period.mode);
  setPtPeriodMonth(period.month);
  setPtPeriodYear(period.year);
  setPtCustomFrom(period.customFrom);
  setPtCustomTo(period.customTo);
  setPtPeriodLabel(period.label);
  setPtPeriodError("");
  setPtPeriodOpen(!0)
}

function ptApplyPeriod(){
  let from="",
      to="",
      label="";

  if("year"===ptPeriodMode){from=`${ptPeriodYear}-01-01`;to=`${ptPeriodYear}-12-31`;label="Tahun "+ptPeriodYear}else if("month"===ptPeriodMode){
    let period=
      ptMonthRange(
        ptPeriodYear,
        ptPeriodMonth
      );

    from=period.from;
    to=period.to;
    label=period.label
  }else{
    from=ptCustomFrom;
    to=ptCustomTo;

    if(!from||!to){
      setPtPeriodError(
        "Tanggal awal dan akhir wajib dipilih."
      );
      return
    }

    if(from>to){
      setPtPeriodError(
        "Tanggal awal tidak boleh melewati tanggal akhir."
      );
      return
    }

    let start=
      new Date(from+"T00:00:00Z"),
        end=
      new Date(to+"T00:00:00Z"),
        days=
      Math.floor(
        (
          end.getTime()-
          start.getTime()
        )/86400000
      )+1;

    if(
      !Number.isFinite(days) ||
      days<1
    ){
      setPtPeriodError(
        "Periode tidak valid."
      );
      return
    }

    if(days>31){
      setPtPeriodError(
        "Periode maksimal 31 hari."
      );
      return
    }

    label=
      ptDateLabel(from)+
      " s.d. "+
      ptDateLabel(to)
  }

  /*
    DRAFT ONLY.
    Fetch tetap hanya ketika Terapkan utama.
  */
  I(from);
  U(to);
  setPtPeriodLabel(label);
  setPtPeriodError("");
  setPtPeriodOpen(!1)
}

function ptResetPeriod(){
  let period=
    ptDefaultPeriod();

  /*
    Tetap default bulan sebelumnya.
    Jangan membuat query all-time.
  */
  I(period.from);
  U(period.to);

  setPtPeriodMode("month");
  setPtPeriodMonth(period.month);
  setPtPeriodYear(period.year);
  setPtCustomFrom(period.from);
  setPtCustomTo(period.to);
  setPtPeriodLabel(period.label);
  setPtPeriodError("");
  setPtPeriodOpen(!1)
}

let K=()=>{v(1),E({search:k.trim(),keterlibatan:w,sumber:T,status:D,from:P,to:M,kejahatan:F.trim(),area:"",satker_id:scopeSatkerPT})},W=()=>{L(""),R("ALL"),N("ALL"),O("ALL"),I((()=>{let d=new Date(),p=new Date(d.getFullYear(),d.getMonth()-1,1),y=p.getFullYear(),m=String(p.getMonth()+1).padStart(2,"0");return `${y}-${m}-01`})()),U((()=>{let d=new Date(),p=new Date(d.getFullYear(),d.getMonth(),0),y=p.getFullYear(),m=String(p.getMonth()+1).padStart(2,"0"),x=String(p.getDate()).padStart(2,"0");return `${y}-${m}-${x}`})()),H(""),G(""),setScopeSatkerPT(13),setPtPeriodLabel(ptDefaultPeriod().label),v(1),E({search:"",keterlibatan:"ALL",sumber:"ALL",status:"ALL",from:ptDefaultPeriod().from,to:ptDefaultPeriod().to,kejahatan:"",area:"",satker_id:13})};if(isSering){return(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"cms-page-title",children:"Pihak Paling Sering Terlibat"}),(0,a.jsx)("p",{className:"cms-page-sub",children:"Peringkat pihak yang paling sering terlibat dalam Laporan Polisi (Kasta Tertinggi, Lintas Wilayah, Total LP > 1)."}),(0,a.jsx)("div",{className:"lp-status-cards",style:{margin:"0 0 0.85rem",gridTemplateColumns:"repeat(auto-fit,minmax(7.5rem,1fr))"},children:qSering.map(sc=>{let isActive=w===sc.peran,val=x?.[sc.key];return(0,a.jsxs)("button",{type:"button",onClick:()=>{R(sc.peran),v(1),E(prev=>({...prev,keterlibatan:sc.peran}))},className:"lp-stat "+(sc.key==="semua"?"total":"ct")+(isActive?" active":""),children:[(0,a.jsx)("div",{className:"n",children:null==val?"—":Number(val).toLocaleString("id-ID")}),(0,a.jsx)("div",{className:"l",children:sc.label})]},sc.key)})}),(0,a.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden"},children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap",padding:"0.75rem 1rem",width:"100%"},children:[(0,a.jsx)(s.InputText,{value:k,onChange:ev=>L(ev.target.value),onKeyDown:ev=>{"Enter"===ev.key&&K()},placeholder:"Cari nama / NIK…",style:{flex:"1 1 14rem",minWidth:"12rem"}}),(0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flex:"0 0 auto",marginLeft:"auto"},children:[(0,a.jsx)("button",{type:"button",onClick:K,className:"att-btn primary",children:"Terapkan"}),(0,a.jsx)("button",{type:"button",onClick:()=>{L(""),R("ALL"),v(1),E({search:"",keterlibatan:"ALL"})},className:"att-btn",children:"Reset"})]})]}),Q?(0,a.jsx)("div",{role:"alert",style:{margin:"0.75rem",padding:"0.7rem 0.85rem",border:"1px solid #fecaca",borderRadius:"8px",background:"#fef2f2",color:"#b91c1c",fontWeight:600},children:Q}):null,(0,a.jsxs)(l.DataTable,{value:e,loading:g,lazy:!0,paginator:!0,first:(A-1)*f,rows:f,rowsPerPageOptions:[10,25,50],paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",totalRecords:c,onPage:ev=>{v(Math.floor((ev.first||0)/(ev.rows||f))+1),y(ev.rows||f)},stripedRows:!0,size:"small",emptyMessage:"Tidak ada data pihak sering terlibat.",children:[(0,a.jsx)(r.Column,{header:"No",body:(row,opt)=>opt.rowIndex+1,style:{width:"3.5rem"}}),(0,a.jsx)(r.Column,{header:"Nama & Identitas",body:row=>(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{fontWeight:700,color:"#0f172a"},children:row.nama||"Tanpa Nama"}),(0,a.jsx)("div",{style:{fontSize:"0.75rem",color:"#64748b"},children:row.nik||"—"})]}),style:{minWidth:"11rem"}}),(0,a.jsx)(r.Column,{header:"Kasta Tertinggi",body:row=>{let kst=row.kasta||row.keterlibatan||"PIHAK",sev="info";if(kst==="DPO"||kst==="TERSANGKA")sev="danger";else if(kst==="TERLAPOR")sev="warning";else if(kst==="KORBAN")sev="success";else if(kst==="PELAPOR")sev="contrast";return(0,a.jsx)(n.Tag,{value:kst,severity:sev,style:{fontWeight:700,fontSize:"0.75rem"}})},style:{width:"8.5rem",textAlign:"center"}}),(0,a.jsx)(r.Column,{header:"Cakupan Wilayah",body:row=>(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.2rem"},children:[row.is_lintas_wilayah?(0,a.jsx)(n.Tag,{value:"Lintas Wilayah",severity:"warning",style:{fontSize:"0.68rem",width:"fit-content"}}):null,(0,a.jsxs)("span",{style:{fontSize:"0.75rem",color:"#334155"},children:[row.satker_nama||"Mabes Polri",(0,a.jsx)("span",{style:{color:"#94a3b8",marginLeft:"0.3rem"},children:"("+String(row.jumlah_satker_unik||1)+" Satker)"})]})]}),style:{minWidth:"13rem"}}),(0,a.jsx)(r.Column,{header:"Total LP",body:row=>(0,a.jsx)(n.Tag,{value:String(row.total_lp||row.jumlah_lp||0)+" LP",severity:"danger",style:{fontWeight:700}}),style:{width:"6.5rem",textAlign:"center"}}),(0,a.jsx)(r.Column,{header:"Rincian Peran",body:row=>(0,a.jsxs)("div",{style:{display:"flex",flexWrap:"wrap",gap:"0.3rem"},children:[row.count_dpo>0?(0,a.jsx)(n.Tag,{value:"DPO: "+row.count_dpo,severity:"danger"}):null,row.count_tersangka>0?(0,a.jsx)(n.Tag,{value:"TSK: "+row.count_tersangka,severity:"danger"}):null,row.count_terlapor>0?(0,a.jsx)(n.Tag,{value:"TLP: "+row.count_terlapor,severity:"warning"}):null,row.count_saksi>0?(0,a.jsx)(n.Tag,{value:"Saksi: "+row.count_saksi,severity:"info"}):null,row.count_korban>0?(0,a.jsx)(n.Tag,{value:"Korban: "+row.count_korban,severity:"success"}):null,row.count_pelapor>0?(0,a.jsx)(n.Tag,{value:"Pelapor: "+row.count_pelapor}):null]}),style:{minWidth:"14rem"}}),(0,a.jsx)(r.Column,{header:"Terakhir Terlibat",body:row=>b(row.last_seen),style:{width:"8.5rem"}})]})]})]})}return(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"cms-page-title",children:"Register Pihak Terlibat"}),(0,a.jsx)("p",{className:"cms-page-sub",children:"Register pihak per LP dari DORS, Surat Penetapan Tersangka, dan entri manual."}),(0,a.jsx)("div",{className:"lp-status-cards",style:{margin:"0 0 0.85rem",gridTemplateColumns:"repeat(auto-fit,minmax(7.5rem,1fr))"},children:q.map((e=>{let t=w===e.keterlibatan&&D===e.status,n=x?.[e.key];return(0,a.jsxs)("button",{type:"button",onClick:()=>{R(e.keterlibatan),O(e.status)},className:`lp-stat ${"semua"===e.key?"total":"ct"}${t?" active":""}`,children:[(0,a.jsx)("div",{className:"n",children:null==n?"—":Number(n).toLocaleString("id-ID")}),(0,a.jsx)("div",{className:"l",children:e.label})]},e.key)}))}),(0,a.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden"},children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap",padding:"0.75rem 1rem",width:"100%"},children:[(0,a.jsx)(s.InputText,{value:k,onChange:e=>L(e.target.value),onKeyDown:e=>{"Enter"===e.key&&K()},placeholder:"Cari nama / NIK / nomor laporan…",style:{flex:"1.15 1 11rem",minWidth:"10rem"}}),(0,a.jsxs)("div",{style:{position:"relative",flex:"0 1 14.5rem",minWidth:"12rem"},children:[

(0,a.jsxs)("button",{type:"button",className:"att-btn",onClick:ptTogglePeriodPanel,title:"Pilih periode",style:{width:"100%",display:"inline-flex",alignItems:"center",gap:"0.45rem",justifyContent:"flex-start",whiteSpace:"nowrap"},children:[
  (0,a.jsx)("i",{className:"pi pi-calendar",style:{fontSize:"0.85rem"}}),
  (0,a.jsx)("span",{style:{fontSize:"0.72rem",color:"#64748b"},children:"Periode"}),
  (0,a.jsx)("strong",{children:ptPeriodLabel}),
  (0,a.jsx)("i",{className:"pi pi-chevron-down",style:{fontSize:"0.65rem",marginLeft:"auto"}})
]}),

ptPeriodOpen&&(0,a.jsxs)("div",{className:"pt-period-popover",style:{position:"absolute",right:0,top:"calc(100% + 0.45rem)",zIndex:50,width:"25rem",maxWidth:"calc(100vw - 2rem)",background:"#fff",border:"1px solid #dbe3ee",borderRadius:10,boxShadow:"0 14px 36px rgba(15,23,42,.16)",padding:"0.85rem"},children:[

  (0,a.jsx)("div",{style:{fontWeight:800,color:"#0f172a",marginBottom:"0.7rem"},children:"Pilih Periode"}),

  (0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem",marginBottom:"0.75rem"},children:[

    (0,a.jsx)("button",{type:"button",className:"att-btn",onClick:()=>{setPtPeriodMode("year"),setPtPeriodError("")},style:{background:"year"===ptPeriodMode?"#eff6ff":"#fff",borderColor:"year"===ptPeriodMode?"#93c5fd":"#dbe3ee",color:"year"===ptPeriodMode?"#1d4ed8":"#334155"},children:"Tahun"}),

    (0,a.jsx)("button",{type:"button",className:"att-btn",onClick:()=>{setPtPeriodMode("month"),setPtPeriodError("")},style:{background:"month"===ptPeriodMode?"#eff6ff":"#fff",borderColor:"month"===ptPeriodMode?"#93c5fd":"#dbe3ee",color:"month"===ptPeriodMode?"#1d4ed8":"#334155"},children:"Bulan"}),

    (0,a.jsx)("button",{type:"button",className:"att-btn",onClick:()=>{setPtPeriodMode("custom"),setPtPeriodError("")},style:{background:"custom"===ptPeriodMode?"#eff6ff":"#fff",borderColor:"custom"===ptPeriodMode?"#93c5fd":"#dbe3ee",color:"custom"===ptPeriodMode?"#1d4ed8":"#334155"},children:"Custom"})

  ]}),

  "year"===ptPeriodMode&&(0,a.jsx)("div",{style:{marginBottom:"0.55rem"},children:(0,a.jsx)(i.Dropdown,{value:ptPeriodYear,options:ptYearOptions(),onChange:e=>setPtPeriodYear(e.value),placeholder:"Pilih Tahun",style:{width:"100%"}})}),"month"===ptPeriodMode&&(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.55rem"},children:[

    (0,a.jsx)(i.Dropdown,{value:ptPeriodMonth,options:ptMonthOptions(),onChange:e=>setPtPeriodMonth(e.value),placeholder:"Bulan",style:{width:"100%"}}),

    (0,a.jsx)(i.Dropdown,{value:ptPeriodYear,options:ptYearOptions(),onChange:e=>setPtPeriodYear(e.value),placeholder:"Tahun",style:{width:"100%"}})

  ]}),

  "custom"===ptPeriodMode&&(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:"0.45rem"},children:[

    (0,a.jsx)(s.InputText,{type:"date",value:ptCustomFrom,onChange:e=>setPtCustomFrom(e.target.value),style:{width:"100%"}}),

    (0,a.jsx)("span",{style:{color:"#94a3b8"},children:"–"}),

    (0,a.jsx)(s.InputText,{type:"date",value:ptCustomTo,onChange:e=>setPtCustomTo(e.target.value),style:{width:"100%"}})

  ]}),

  ptPeriodError&&(0,a.jsx)("div",{role:"alert",style:{marginTop:"0.65rem",color:"#b91c1c",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"0.5rem 0.65rem",fontSize:"0.72rem",fontWeight:600},children:ptPeriodError}),

  (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",gap:"0.5rem",marginTop:"0.85rem",paddingTop:"0.7rem",borderTop:"1px solid #e2e8f0"},children:[

    (0,a.jsx)("button",{type:"button",className:"att-btn",onClick:ptResetPeriod,children:"Reset"}),

    (0,a.jsx)("button",{type:"button",className:"att-btn",onClick:ptApplyPeriod,style:{background:"#2563eb",borderColor:"#2563eb",color:"#fff"},children:"Terapkan"})

  ]})

]})

]}),(0,a.jsx)(i.Dropdown,{value:F,options:[{label:"Semua Jenis Kejahatan",value:""},...crimeOptsPT],onChange:e=>H(e.value||""),placeholder:"Jenis kejahatan…",filter:!0,valueTemplate:e=>(0,a.jsx)("span",{title:e?.label||"",style:{display:"block",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e?.label||"Jenis kejahatan…"}),itemTemplate:e=>(0,a.jsx)("span",{title:e?.label||"",style:{display:"block",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e?.label||""}),panelStyle:{width:"20rem",maxWidth:"calc(100vw - 2rem)"},style:{flex:"1 1 10rem",minWidth:"9rem",maxWidth:"15rem"}}),(0,a.jsx)(i.Dropdown,{value:scopeSatkerPT,options:[{label:"Semua Satker",value:null},...scopeOptsPT],onChange:e=>setScopeSatkerPT(e.value==null?null:Number(e.value)),placeholder:"Satker…",filter:!0,style:{flex:"1.35 1 14rem",minWidth:"13rem"}}),(0,a.jsx)(i.Dropdown,{value:T,options:m,onChange:e=>N(e.value),placeholder:"Sumber",style:{flex:"0.7 1 9rem",minWidth:"8rem"}}),(0,a.jsx)(i.Dropdown,{value:w,options:d,onChange:e=>{R(e.value),O("ALL")},placeholder:"Keterlibatan",style:{flex:"0.85 1 10rem",minWidth:"9rem"}}),(0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flex:"0 0 auto",marginLeft:"auto"},children:[(0,a.jsx)("button",{type:"button",onClick:K,className:"att-btn primary",children:"Terapkan"}),(0,a.jsx)("button",{type:"button",onClick:W,className:"att-btn",children:"Reset"})]})]}),[Y,Q].filter(Boolean).map(((e,t)=>(0,a.jsx)("div",{role:"alert",style:{margin:"0.75rem",padding:"0.7rem 0.85rem",border:"1px solid #fecaca",borderRadius:"8px",background:"#fef2f2",color:"#b91c1c",fontWeight:600},children:e},t))),(0,a.jsxs)(l.DataTable,{value:e,loading:g,lazy:!0,paginator:!0,first:(A-1)*f,rows:f,rowsPerPageOptions:[25,50,100],paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",totalRecords:c,onPage:e=>{v(Math.floor((e.first||0)/(e.rows||f))+1),y(e.rows||f)},stripedRows:!0,size:"small",emptyMessage:"Tidak ada data.",children:[(0,a.jsx)(r.Column,{header:"No",body:(e,a)=>a.rowIndex+1,style:{width:"3.5rem"}}),(0,a.jsx)(r.Column,{field:"nama",header:"Nama"}),(0,a.jsx)(r.Column,{field:"nik",header:"NIK",body:e=>e.nik||"—",style:{width:"9rem"}}),(0,a.jsx)(r.Column,{field:"keterlibatan",header:"Keterlibatan",body:e=>(0,a.jsx)(n.Tag,{value:e.keterlibatan,severity:"DPO"===e.keterlibatan||"TERSANGKA"===e.keterlibatan?"danger":"SAKSI"===e.keterlibatan||"AHLI"===e.keterlibatan?"info":"TERLAPOR"===e.keterlibatan?"warning":void 0}),style:{width:"8rem"}}),(0,a.jsx)(r.Column,{header:"Sumber",body:e=>(0,a.jsx)(n.Tag,{value:"DORS"===e.sumber?"DORS":"DOKUMEN"===e.sumber?"Dokumen":"Manual",severity:"DORS"===e.sumber?void 0:"DOKUMEN"===e.sumber?"warning":"success"}),style:{width:"7rem"}}),(0,a.jsx)(r.Column,{header:"Dokumen",body:e=>"MANUAL"===e.sumber&&"SAKSI"===e.keterlibatan?`BAP ${b(e.bap_tanggal)}`:("MANUAL"===e.sumber||"DOKUMEN"===e.sumber)&&"TERSANGKA"===e.keterlibatan?`${e.nomor_dokumen||"—"} · ${b(e.tanggal_dokumen)}`:"—"}),(0,a.jsx)(r.Column,{field:"no_laporan",header:"Nomor LP",body:e=>e.no_laporan||"—"}),(0,a.jsx)(r.Column,{field:"kejahatan",header:"Kejahatan",body:e=>e.kejahatan||"—"}),(0,a.jsx)(r.Column,{header:"Satker",body:u})]})]})]})}])}]);
