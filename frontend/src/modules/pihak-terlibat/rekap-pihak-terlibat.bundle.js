(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,11699,e=>{"use strict";var a=e.i(43476),t=e.i(71645),l=e.i(17580),r=e.i(24718),n=e.i(53729),s=e.i(44080),i=e.i(68242),o=e.i(54858),authPT=e.i(38036);const PT_SUMMARY_CACHE_PREFIX="bdb-pihak-summary-v6:",PT_SUMMARY_TTL=24e4;function ptSummaryCacheKey(e){try{let a=(0,authPT.getUser)();if(!a)return null;let t=String(a?.id??"").trim(),l=String(a?.email||"").trim();if(!t&&!l)return null;let r=(0,authPT.deriveRoles)(a);return PT_SUMMARY_CACHE_PREFIX+JSON.stringify({user:`${t}|${l}`,role:String(r?.label||""),filter:{search:e.search||"",sumber:e.sumber||"ALL",from:e.from||"",to:e.to||"",kejahatan:e.kejahatan||"",area:e.area||"",satker_id:e.satker_id??null}})}catch{return null}}const PT_LIST_CACHE_PREFIX="bdb-pihak-list-v6:",PT_LIST_TTL=24e4;function ptResolveTotal(sum,filter,metaTotal,page,row,dataLen,hasNext){if(metaTotal!=null&&Number.isFinite(Number(metaTotal))&&Number(metaTotal)>=0){return Number(metaTotal)}if(sum&&typeof sum==="object"){let st=String(filter?.status||"ALL").toUpperCase(),kt=String(filter?.keterlibatan||"ALL").toUpperCase(),val=null;if(st==="LIDIK")val=sum.lidik;else if(kt==="KORBAN")val=sum.korban;else if(kt==="SAKSI")val=sum.saksi;else if(kt==="PELAPOR")val=sum.pelapor;else if(kt==="TERLAPOR")val=sum.terlapor;else if(kt==="TERSANGKA")val=sum.tersangka;else if(kt==="DPO")val=sum.dpo;else val=sum.semua;if(val!=null&&Number.isFinite(Number(val))){return Number(val)}}return(Number(page||1)-1)*Number(row||25)+(Number(dataLen)||0)+(hasNext?1:0)}function ptListCacheKey(e,a,t){try{let l=(0,authPT.getUser)();if(!l)return null;let r=String(l?.id??"").trim(),n=String(l?.email||"").trim();if(!r&&!n)return null;let s=(0,authPT.deriveRoles)(l);return PT_LIST_CACHE_PREFIX+JSON.stringify({user:`${r}|${n}`,role:String(s?.label||""),page:Number(a||1),row:Number(t||25),filter:{search:e.search||"",keterlibatan:e.keterlibatan||"ALL",sumber:e.sumber||"ALL",status:e.status||"ALL",from:e.from||"",to:e.to||"",kejahatan:e.kejahatan||"",area:e.area||"",satker_id:e.satker_id??null}})}catch{return null}}function u(e){let a=(e.unit_satker_nama||"").trim();return a||[e.unit_nama,e.satker_nama].map((e=>(e||"").trim())).filter(Boolean).join(" ")||"—"}function z(e){let a=e?.response?.data?.message||e?.message;return Array.isArray(a)?a.join("; "):String(a||"Data gagal dimuat. Coba persempit filter lalu klik Terapkan kembali.")}let d=[{label:"Semua Keterlibatan",value:"ALL"},{label:"Saksi",value:"SAKSI"},{label:"Terlapor",value:"TERLAPOR"},{label:"Korban",value:"KORBAN"},{label:"Pelapor",value:"PELAPOR"},{label:"Ahli",value:"AHLI"},{label:"Tersangka",value:"TERSANGKA"},{label:"DPO",value:"DPO"}],m=[{label:"Semua Sumber",value:"ALL"},{label:"DORS",value:"DORS"},{label:"Dokumen",value:"DOKUMEN"},{label:"Manual",value:"MANUAL"}],q=[{key:"semua",label:"Semua",keterlibatan:"ALL",status:"ALL"},{key:"lidik",label:"Lidik",keterlibatan:"ALL",status:"LIDIK"},{key:"korban",label:"Korban",keterlibatan:"KORBAN",status:"ALL"},{key:"saksi",label:"Saksi",keterlibatan:"SAKSI",status:"ALL"},{key:"pelapor",label:"Pelapor",keterlibatan:"PELAPOR",status:"ALL"},{key:"terlapor",label:"Terlapor",keterlibatan:"TERLAPOR",status:"ALL"},{key:"tersangka",label:"Tersangka",keterlibatan:"TERSANGKA",status:"ALL"},{key:"dpo",label:"DPO",keterlibatan:"DPO",status:"ALL"}];let qSering=[{key:"semua",label:"Semua",peran:"ALL"},{key:"lintas_wilayah",label:"Lintas Wilayah",peran:"LINTAS_WILAYAH"},{key:"dpo",label:"DPO",peran:"DPO"},{key:"tersangka",label:"Tersangka",peran:"TERSANGKA"},{key:"terlapor",label:"Terlapor",peran:"TERLAPOR"},{key:"saksi",label:"Saksi",peran:"SAKSI"},{key:"korban",label:"Korban",peran:"KORBAN"},{key:"pelapor",label:"Pelapor",peran:"PELAPOR"}];function b(e){if(!e)return"—";let a=String(e).slice(0,10),t=new Date(a);return isNaN(t.getTime())?a:t.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}

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
    new Date().getFullYear(),
    out=[];
  for(let y=current;y>=2000;y--)
    out.push({label:String(y),value:String(y)});
  return out
}
if(typeof window!=="undefined"&&!window.__cas_route_listener){window.__cas_route_listener=true;let wrap=function(m){let o=history[m];history[m]=function(){let r=o.apply(this,arguments);window.dispatchEvent(new Event("cas_route_change"));return r}};wrap("pushState");wrap("replaceState")};e.s(["default",0,function(){let[currPath,setCurrPath]=(0,t.useState)(()=>"undefined"!==typeof window?window.location.pathname:"");let reqSeqRef=(0,t.useRef)(0),sumSeqRef=(0,t.useRef)(0);let checkSering=function(){if("undefined"===typeof window)return false;let p=window.location.pathname||"",s=window.location.search||"";return p.includes("pihak-sering")||currPath.includes("pihak-sering")||s.includes("mode=sering")};(0,t.useEffect)(()=>{let chk=()=>{if("undefined"!==typeof window&&window.location.pathname!==currPath){let wasSering=currPath.includes("pihak-sering"),nowSering=window.location.pathname.includes("pihak-sering");setCurrPath(window.location.pathname);if(wasSering!==nowSering){h([]);S(!0)}}};let tId=setInterval(chk,300);window.addEventListener("popstate",chk);window.addEventListener("cas_route_change",chk);return()=>{clearInterval(tId);window.removeEventListener("popstate",chk);window.removeEventListener("cas_route_change",chk)}},[currPath]);let isSering=checkSering();let getPtJump=function(){if(typeof window==="undefined")return null;try{let raw=sessionStorage.getItem("cas_pt_jump");if(raw)return JSON.parse(raw)}catch(e){}return null};let initJump=getPtJump();let initSearch=(initJump&&initJump.search)?String(initJump.search).trim():(("undefined"!==typeof window&&new URLSearchParams(window.location.search).get("search"))||"");let initIsNat=Boolean((initJump&&initJump.scope==="national")||(initJump&&initJump.search)||initSearch||("undefined"!==typeof window&&window.location.search.includes("scope=national")));let initSatker=initIsNat?null:13;let jumpToRegister=function(val){let t=String(val||"").trim();if(!t)return;try{sessionStorage.setItem("cas_pt_jump",JSON.stringify({search:t,scope:"national"}))}catch(e){}window.location.href="/cms/laporan/rekap-pihak-terlibat"};let[e,h]=(0,t.useState)([]),[c,p]=(0,t.useState)(0),[g,S]=(0,t.useState)(!0),[A,v]=(0,t.useState)(1),[f,y]=(0,t.useState)(25),[x,j]=(0,t.useState)({semua:0,lidik:0,korban:0,saksi:0,pelapor:0,terlapor:0,tersangka:0,dpo:0}),[k,L]=(0,t.useState)(initSearch),[w,R]=(0,t.useState)("ALL"),[T,N]=(0,t.useState)("ALL"),[D,O]=(0,t.useState)("ALL"),[P,I]=(0,t.useState)(()=>ptDefaultPeriod().from),[M,U]=(0,t.useState)(()=>ptDefaultPeriod().to),[ptPeriodOpen,setPtPeriodOpen]=(0,t.useState)(!1),[ptPeriodMode,setPtPeriodMode]=(0,t.useState)("year"),[ptPeriodMonth,setPtPeriodMonth]=(0,t.useState)(()=>ptDefaultPeriod().month),[ptPeriodYear,setPtPeriodYear]=(0,t.useState)(()=>ptDefaultPeriod().year),[ptCustomFrom,setPtCustomFrom]=(0,t.useState)(P),[ptCustomTo,setPtCustomTo]=(0,t.useState)(M),[ptPeriodLabel,setPtPeriodLabel]=(0,t.useState)(()=>ptDescribePeriod(P,M).label),[ptPeriodError,setPtPeriodError]=(0,t.useState)(""),[F,H]=(0,t.useState)(""),[crimeOptsPT,setCrimeOptsPT]=(0,t.useState)([]),[B,G]=(0,t.useState)(""),[scopeOptsPT,setScopeOptsPT]=(0,t.useState)([]),[scopeSatkerPT,setScopeSatkerPT]=(0,t.useState)(initSatker),[V,E]=(0,t.useState)({search:initSearch,keterlibatan:"ALL",sumber:"ALL",status:"ALL",from:ptDefaultPeriod().from,to:ptDefaultPeriod().to,kejahatan:"",area:"",satker_id:initSatker}),[Q,Z]=(0,t.useState)(""),[Y,J]=(0,t.useState)("");let cleanCrime=function(val){if(!val)return"—";let str=String(val).replace(/<[^>]*>/g,"").replace(/^[-\—_:=\s]+/,"").replace(/[-\—_:=\s]+$/,"").trim();return str||"—"};let cleanTkp=function(val){if(!val||val==="—")return null;let str=String(val).replace(/<[^>]*>/g,"").replace(/^[-\—_:=\s]+/,"").trim();return str||null};let [arsipModalDoc,setArsipModalDoc]=(0,t.useState)(null),[arsipModalTab,setArsipModalTab]=(0,t.useState)("doc"),[arsipModalMax,setArsipModalMax]=(0,t.useState)(!1),[satkerModalParty,setSatkerModalParty]=(0,t.useState)(null),[satkerModalData,setSatkerModalData]=(0,t.useState)([]),[satkerModalLoading,setSatkerModalLoading]=(0,t.useState)(!1),[satkerModalMax,setSatkerModalMax]=(0,t.useState)(!1),[lpModalParty,setLpModalParty]=(0,t.useState)(null),[lpModalData,setLpModalData]=(0,t.useState)([]),[lpModalLoading,setLpModalLoading]=(0,t.useState)(!1),[lpModalTab,setLpModalTab]=(0,t.useState)("period"),[lpModalMax,setLpModalMax]=(0,t.useState)(!1);let openSatkerModal=function(row){setSatkerModalMax(!1);setSatkerModalParty(row),setSatkerModalData([]),setSatkerModalLoading(!0);let nik=String(row?.nik||"").trim();if(!nik){setSatkerModalLoading(!1);return}o.apiAuth.get("/bdb/pihak-terlibat/laporan-by-nik/"+encodeURIComponent(nik)).then(res=>{let raw=res?.data?.data||res?.data;setSatkerModalData(Array.isArray(raw)?raw:[]),setSatkerModalLoading(!1)}).catch(()=>{setSatkerModalData([]),setSatkerModalLoading(!1)})};let openLpModal=function(row){setLpModalMax(!1);setLpModalParty(row),setLpModalData([]),setLpModalLoading(!0),setLpModalTab("period");let nik=String(row?.nik||"").trim();if(!nik){setLpModalLoading(!1);return}let q="?from="+encodeURIComponent(V.from||"")+"&to="+encodeURIComponent(V.to||"");o.apiAuth.get("/bdb/pihak-terlibat/laporan-by-nik/"+encodeURIComponent(nik)+q).then(res=>{let raw=res?.data?.data||res?.data;setLpModalData(Array.isArray(raw)?raw:[]),setLpModalLoading(!1)}).catch(()=>{setLpModalData([]),setLpModalLoading(!1)})};(0,t.useEffect)(()=>{setTimeout(()=>{try{sessionStorage.removeItem("cas_pt_jump")}catch(e){}},1500)},[]);(0,t.useEffect)(()=>{o.apiAuth.get("/bdb/kinerja-perkara/meta/jenis-kejahatan").then(e=>{let a=Array.isArray(e.data?.data)?e.data.data:[],r=[...new Set(a.map(e=>String(e?.keterangan||"").trim()).filter(Boolean))];setCrimeOptsPT(r.map(e=>({label:e,value:e})))}).catch(()=>setCrimeOptsPT([]));o.apiAuth.get("/bdb/kinerja-perkara/meta/scope-options").then(e=>{let a=e.data?.data||{},r=Array.isArray(a.options)?a.options:[];let jm=getPtJump();let isNat=Boolean((jm&&jm.scope==="national")||(jm&&jm.search)||initSearch||("undefined"!=typeof window&&window.location.search.includes("scope=national")));let n=isNat?null:(a.defaultRegionId!=null?Number(a.defaultRegionId):13);setScopeOptsPT(r);if(!isNat&&n!=null){setScopeSatkerPT(n);E(p=>({...p,satker_id:n}))}}).catch(()=>setScopeOptsPT([]))},[]);let C=(0,t.useCallback)((async()=>{let mySeq=++reqSeqRef.current;let curSering=checkSering();S(!0),Z("");if(curSering){j({semua:0,dpo:0,tersangka:0,terlapor:0,saksi:0,korban:0,pelapor:0});try{let a=(await o.apiAuth.get("/bdb/pihak-terlibat/ranking",{params:{master:"1",scope:"national",peran:w,page:A,row:f,...V.subjek&&V.subjek!=="ALL"?{subjek:V.subjek}:{},...V.search?{search:V.search}:{},...V.from?{from:V.from}:{},...V.to?{to:V.to}:{}}})).data;if(mySeq!==reqSeqRef.current||!checkSering())return;let d=a?.data||[],m=a?.pagination||{},s=a?.meta?.summary;h(d),p(Number(m.total||d.length));if(s)j(s)}catch(e){if(mySeq===reqSeqRef.current&&checkSering())Z(z(e))}finally{if(mySeq===reqSeqRef.current&&checkSering())S(!1)}return}let e=ptListCacheKey(V,A,f);if(e)try{let a=sessionStorage.getItem(e);if(a){let t=JSON.parse(a);if(t&&Number(t.expiresAt)>Date.now()&&Array.isArray(t.data)){if(mySeq!==reqSeqRef.current||checkSering())return;let curSum=x;if(!curSum||!curSum.semua){let sk=ptSummaryCacheKey(V);if(sk)try{let raw=sessionStorage.getItem(sk);if(raw){let parsed=JSON.parse(raw);if(parsed?.data)curSum=parsed.data}}catch{}}let finalTot=ptResolveTotal(curSum,V,null,A,f,t.data.length,false);if(finalTot<=0&&Number.isFinite(Number(t.total)))finalTot=Number(t.total);h(t.data),p(finalTot),S(!1);return}sessionStorage.removeItem(e)}}catch{}try{let a=(await o.apiAuth.get("/bdb/pihak-terlibat",{params:{page:A,row:f,...V.search?{search:V.search}:{},..."ALL"!==V.keterlibatan?{keterlibatan:V.keterlibatan}:{},..."ALL"!==V.sumber?{sumber:V.sumber}:{},..."ALL"!==V.status?{status:V.status}:{},...V.from?{from:V.from}:{},...V.to?{to:V.to}:{},...V.kejahatan?{kejahatan:V.kejahatan}:{},...V.area?{area:V.area}:{},...V.satker_id?{satker_id:V.satker_id}:{}}})).data;if(mySeq!==reqSeqRef.current||checkSering())return;let d=a?.data||[],m=a?.meta||{},curSum=x;if(!curSum||!curSum.semua){let sk=ptSummaryCacheKey(V);if(sk)try{let raw=sessionStorage.getItem(sk);if(raw){let parsed=JSON.parse(raw);if(parsed?.data)curSum=parsed.data}}catch{}}let u=ptResolveTotal(curSum,V,m.total,A,f,d.length,m.hasNext);h(d),p(u);if(e)try{sessionStorage.setItem(e,JSON.stringify({expiresAt:Date.now()+PT_LIST_TTL,data:d,total:u}))}catch{}}catch(e){if(mySeq===reqSeqRef.current&&!checkSering())Z(z(e))}finally{if(mySeq===reqSeqRef.current&&!checkSering())S(!1)}}),[A,f,V,currPath,w]);(0,t.useEffect)((()=>{C()}),[C]);(0,t.useEffect)((()=>{let mySumSeq=++sumSeqRef.current;if(checkSering())return;j({semua:0,lidik:0,korban:0,saksi:0,pelapor:0,terlapor:0,tersangka:0,dpo:0});let e=!1;J("");let a=ptSummaryCacheKey(V);if(a)try{let t=sessionStorage.getItem(a);if(t){let l=JSON.parse(t);if(l&&Number(l.expiresAt)>Date.now()&&l.data&&"object"==typeof l.data){if(!e&&mySumSeq===sumSeqRef.current&&!checkSering()){j(l.data);let resolved=ptResolveTotal(l.data,V,null,A,f,0,false);if(resolved>0)p(resolved)}return()=>{e=!0}}sessionStorage.removeItem(a)}}catch{}(async()=>{try{let t=(await o.apiAuth.get("/bdb/pihak-terlibat",{params:{summary_only:1,...V.search?{search:V.search}:{},..."ALL"!==V.sumber?{sumber:V.sumber}:{},...V.from?{from:V.from}:{},...V.to?{to:V.to}:{},...V.kejahatan?{kejahatan:V.kejahatan}:{},...V.area?{area:V.area}:{},...V.satker_id?{satker_id:V.satker_id}:{}}})).data,l=t?.meta?.summary||{};if(!e&&mySumSeq===sumSeqRef.current&&!checkSering()){j(l);let resolved=ptResolveTotal(l,V,null,A,f,0,false);if(resolved>0)p(resolved);if(a)try{sessionStorage.setItem(a,JSON.stringify({expiresAt:Date.now()+PT_SUMMARY_TTL,data:l}))}catch{}}}catch(a){if(!e&&mySumSeq===sumSeqRef.current&&!checkSering()){j({});J(z(a))}}})();return()=>{e=!0}}),[currPath,V.search,V.sumber,V.from,V.to,V.kejahatan,V.area,V.satker_id]);

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

let K=()=>{v(1),E({search:k.trim(),keterlibatan:w,sumber:T,status:D,from:P,to:M,kejahatan:F.trim(),area:"",satker_id:scopeSatkerPT})},W=()=>{try{sessionStorage.removeItem("cas_pt_jump")}catch(e){}L(""),R("ALL"),N("ALL"),O("ALL"),I((()=>{let d=new Date(),p=new Date(d.getFullYear(),d.getMonth()-1,1),y=p.getFullYear(),m=String(p.getMonth()+1).padStart(2,"0");return `${y}-${m}-01`})()),U((()=>{let d=new Date(),p=new Date(d.getFullYear(),d.getMonth(),0),y=p.getFullYear(),m=String(p.getMonth()+1).padStart(2,"0"),x=String(p.getDate()).padStart(2,"0");return `${y}-${m}-${x}`})()),H(""),G(""),setScopeSatkerPT(13),setPtPeriodLabel(ptDefaultPeriod().label),v(1),E({search:"",keterlibatan:"ALL",sumber:"ALL",status:"ALL",from:ptDefaultPeriod().from,to:ptDefaultPeriod().to,kejahatan:"",area:"",satker_id:13})};if(isSering){return(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"cms-page-title",children:"Pihak Paling Sering Terlibat"}),(0,a.jsx)("p",{className:"cms-page-sub",children:"Peringkat pihak yang paling sering terlibat dalam Laporan Polisi (Kasta Tertinggi, Lintas Wilayah, Total LP > 1)."}),(0,a.jsx)("div",{className:"lp-status-cards",style:{margin:"0 0 0.85rem",gridTemplateColumns:"repeat(auto-fit,minmax(7.5rem,1fr))"},children:qSering.map(sc=>{let isActive=w===sc.peran,val=x?.[sc.key];return(0,a.jsxs)("button",{type:"button",onClick:()=>{R(sc.peran),v(1),E(prev=>({...prev,keterlibatan:sc.peran}))},className:"lp-stat "+(sc.key==="semua"?"total":"ct")+(isActive?" active":""),children:[(0,a.jsx)("div",{className:"n",children:null==val?"—":Number(val).toLocaleString("id-ID")}),(0,a.jsx)("div",{className:"l",children:sc.label})]},sc.key)})}),(0,a.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden"},children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap",padding:"0.75rem 1rem",width:"100%"},children:[(0,a.jsxs)("div",{style:{display:"inline-flex",borderRadius:"8px",border:"1px solid #cbd5e1",overflow:"hidden",background:"#f8fafc",fontSize:"0.78rem"},children:[(0,a.jsx)("button",{type:"button",onClick:()=>{v(1),E(prev=>({...prev,subjek:"ALL"}))},style:{padding:"0.35rem 0.65rem",border:"none",background:(V.subjek||"ALL")==="ALL"?"#0284c7":"transparent",color:(V.subjek||"ALL")==="ALL"?"#fff":"#475569",fontWeight:(V.subjek||"ALL")==="ALL"?700:500,cursor:"pointer"},children:"Semua Subjek"}),(0,a.jsx)("button",{type:"button",onClick:()=>{v(1),E(prev=>({...prev,subjek:"PERORANGAN"}))},style:{padding:"0.35rem 0.65rem",border:"none",borderLeft:"1px solid #cbd5e1",background:V.subjek==="PERORANGAN"?"#0284c7":"transparent",color:V.subjek==="PERORANGAN"?"#fff":"#475569",fontWeight:V.subjek==="PERORANGAN"?700:500,cursor:"pointer"},children:"Perorangan"}),(0,a.jsx)("button",{type:"button",onClick:()=>{v(1),E(prev=>({...prev,subjek:"KORPORASI"}))},style:{padding:"0.35rem 0.65rem",border:"none",borderLeft:"1px solid #cbd5e1",background:V.subjek==="KORPORASI"?"#0284c7":"transparent",color:V.subjek==="KORPORASI"?"#fff":"#475569",fontWeight:V.subjek==="KORPORASI"?700:500,cursor:"pointer"},children:"🏢 Korporasi"})]}),(0,a.jsx)(s.InputText,{id:"pt-search-korporasi",name:"search_korporasi",value:k,onChange:ev=>L(ev.target.value),onKeyDown:ev=>{"Enter"===ev.key&&K()},placeholder:"Cari nama / NIK / Korporasi…",style:{flex:"1 1 14rem",minWidth:"12rem"}}),(0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flex:"0 0 auto",marginLeft:"auto"},children:[(0,a.jsx)("button",{type:"button",onClick:K,className:"att-btn primary",children:"Terapkan"}),(0,a.jsx)("button",{type:"button",onClick:()=>{L(""),R("ALL"),v(1),E(prev=>({...prev,search:"",keterlibatan:"ALL",subjek:"ALL"}))},className:"att-btn",children:"Reset"})]})]}),Q?(0,a.jsx)("div",{role:"alert",style:{margin:"0.75rem",padding:"0.7rem 0.85rem",border:"1px solid #fecaca",borderRadius:"8px",background:"#fef2f2",color:"#b91c1c",fontWeight:600},children:Q}):null,(0,a.jsxs)(l.DataTable,{value:e,loading:g,lazy:!0,paginator:!0,first:(A-1)*f,rows:f,rowsPerPageOptions:[25,50,100],paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",currentPageReportTemplate:"Menampilkan {first} s.d. {last} dari {totalRecords} pihak",totalRecords:c,onPage:ev=>{v(Math.floor((ev.first||0)/(ev.rows||f))+1),y(ev.rows||f)},stripedRows:!0,size:"small",emptyMessage:"Tidak ada data pihak sering terlibat.",children:[(0,a.jsx)(r.Column,{header:"No",body:(row,opt)=>opt.rowIndex+1,style:{width:"3.5rem"}}),(0,a.jsx)(r.Column,{header:"Nama & Identitas",body:row=>{let isCorp=row.tipe_subjek==="KORPORASI"||(row.nik&&String(row.nik).startsWith("KORP:"));return (0,a.jsxs)("div",{onClick:()=>openLpModal(row),title:"Klik untuk melihat rincian LP",style:{cursor:"pointer"},children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem"},children:[(0,a.jsx)("span",{style:{fontWeight:700,color:"#0284c7"},children:row.nama||"Tanpa Nama"}),isCorp?(0,a.jsx)(n.Tag,{value:"KORPORASI",severity:"warning",style:{fontSize:"0.62rem",fontWeight:700,padding:"0.1rem 0.35rem"}}):null]}),(0,a.jsx)("div",{style:{fontSize:"0.75rem",color:"#64748b"},children:isCorp?"Badan Hukum / Korporasi":(row.tipe_identitas&&row.tipe_identitas!=="NIK"?(row.tipe_identitas+": "+row.nik):(row.nik||"—"))})]});},style:{minWidth:"12.5rem"}}),(0,a.jsx)(r.Column,{header:"Kasta Tertinggi",body:row=>{let kst=row.kasta||row.keterlibatan||"PIHAK",sev="info";if(kst==="DPO"||kst==="TERSANGKA")sev="danger";else if(kst==="TERLAPOR")sev="warning";else if(kst==="KORBAN")sev="success";else if(kst==="PELAPOR")sev="contrast";return(0,a.jsx)(n.Tag,{value:kst,severity:sev,style:{fontWeight:700,fontSize:"0.75rem"}})},style:{width:"8.5rem",textAlign:"center"}}),(0,a.jsx)(r.Column,{header:"Cakupan Wilayah",body:row=>{let count=row.jumlah_satker_unik||1;return(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",flexWrap:"nowrap"},children:[(row.is_lintas_wilayah&&Number(row.jumlah_polda_unik)>1)?(0,a.jsx)(n.Tag,{value:"Lintas Wilayah",severity:"warning",style:{fontSize:"0.7rem",padding:"0.15rem 0.45rem"}}):null,(0,a.jsxs)("button",{type:"button",onClick:()=>openSatkerModal(row),style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"0.2rem 0.5rem",fontSize:"0.75rem",fontWeight:600,color:"#0284c7",cursor:"pointer"},title:"Klik untuk melihat daftar seluruh satker & tempus keterlibatan",children:[(0,a.jsx)("i",{className:"pi pi-eye",style:{fontSize:"0.75rem"}}),(0,a.jsx)("span",{children:count+" Satker"})]})]})},style:{minWidth:"10rem"}}),(0,a.jsx)(r.Column,{header:"Total LP",body:row=>(0,a.jsx)(n.Tag,{value:String(row.total_lp||row.jumlah_lp||0)+" LP",severity:"danger",style:{fontWeight:700,fontSize:"0.78rem",padding:"0.25rem 0.6rem"}}),style:{width:"6.5rem",textAlign:"center"}}),(0,a.jsx)(r.Column,{header:"Rincian Peran",body:row=>(0,a.jsxs)("div",{style:{display:"flex",flexWrap:"wrap",gap:"0.3rem"},children:[row.count_dpo>0?(0,a.jsx)(n.Tag,{value:"DPO: "+row.count_dpo,severity:"danger"}):null,row.count_tersangka>0?(0,a.jsx)(n.Tag,{value:"TSK: "+row.count_tersangka,severity:"danger"}):null,row.count_terlapor>0?(0,a.jsx)(n.Tag,{value:"TLP: "+row.count_terlapor,severity:"warning"}):null,row.count_saksi>0?(0,a.jsx)(n.Tag,{value:"Saksi: "+row.count_saksi,severity:"info"}):null,row.count_korban>0?(0,a.jsx)(n.Tag,{value:"Korban: "+row.count_korban,severity:"success"}):null,row.count_pelapor>0?(0,a.jsx)(n.Tag,{value:"Pelapor: "+row.count_pelapor}):null]}),style:{minWidth:"14rem"}}),(0,a.jsx)(r.Column,{header:"Terakhir Terlibat",body:row=>b(row.last_seen),style:{width:"8.5rem"}}),(0,a.jsx)(r.Column,{header:"Aksi",body:row=>{let val=row.nik&&!String(row.nik).startsWith("KORP:")?row.nik:(row.nama||"");return (0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",justifyContent:"center"},children:[(0,a.jsxs)("button",{type:"button",onClick:()=>openLpModal(row),title:"Lihat Rincian Laporan Polisi & Tempus",className:"att-btn primary",style:{padding:"0.25rem 0.5rem",fontSize:"0.74rem",display:"inline-flex",alignItems:"center",gap:"0.25rem",cursor:"pointer",fontWeight:600},children:[(0,a.jsx)("i",{className:"pi pi-file-o",style:{fontSize:"0.72rem"}}),(0,a.jsx)("span",{children:"Rincian"})]}),(0,a.jsxs)("button",{type:"button",onClick:()=>jumpToRegister(val),title:"Buka di Register Pihak Terlibat",className:"att-btn",style:{padding:"0.25rem 0.5rem",fontSize:"0.74rem",display:"inline-flex",alignItems:"center",gap:"0.25rem",cursor:"pointer",fontWeight:600,color:"#0284c7"},children:[(0,a.jsx)("i",{className:"pi pi-search",style:{fontSize:"0.72rem"}}),(0,a.jsx)("span",{children:"Register"})]})]});},style:{width:"11.5rem",textAlign:"center"}})]})]}),satkerModalParty?(0,a.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(15,23,42,0.65)",backdropFilter:"blur(3px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:satkerModalMax?"0":"1rem"},onClick:()=>setSatkerModalParty(null),children:(0,a.jsxs)("div",{style:{backgroundColor:"#ffffff",borderRadius:satkerModalMax?"0px":"12px",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)",width:satkerModalMax?"100vw":"100%",maxWidth:satkerModalMax?"100vw":"58rem",height:satkerModalMax?"100vh":"auto",maxHeight:satkerModalMax?"100vh":"88vh",display:"flex",flexDirection:"column",overflow:"hidden",transition:"all 0.18s ease-in-out"},onClick:ev=>ev.stopPropagation(),children:[
  (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.9rem 1.25rem",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"},children:[
    (0,a.jsxs)("div",{children:[
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
        (0,a.jsx)("div",{style:{fontWeight:700,fontSize:"1.05rem",color:"#0f172a"},children:"Daftar Satker Terkait & Tempus"}),
        (satkerModalParty.is_lintas_wilayah&&Number(satkerModalParty.jumlah_polda_unik)>1)?(0,a.jsx)(n.Tag,{value:"Lintas Wilayah ("+satkerModalParty.jumlah_polda_unik+" Polda)",severity:"warning",style:{fontSize:"0.7rem",padding:"0.15rem 0.45rem"}}):(0,a.jsx)(n.Tag,{value:"Satu Wilayah",severity:"info",style:{fontSize:"0.7rem",padding:"0.15rem 0.45rem"}})
      ]}),
      (0,a.jsxs)("div",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.15rem"},children:[satkerModalParty.nama||"Tanpa Nama"," (",satkerModalParty.nik?.startsWith("KORP:")?"Badan Hukum / Korporasi":("NIK: "+(satkerModalParty.nik||"—")),")"]})
    ]}),
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem"},children:[
      (0,a.jsx)("button",{type:"button",onClick:()=>setSatkerModalMax(!satkerModalMax),title:satkerModalMax?"Perkecil Tampilan":"Perbesar / Maksimalkan Layar",style:{background:satkerModalMax?"#eff6ff":"#f8fafc",border:"1px solid "+(satkerModalMax?"#93c5fd":"#cbd5e1"),fontSize:"0.95rem",cursor:"pointer",color:satkerModalMax?"#2563eb":"#475569",padding:"0.3rem 0.55rem",borderRadius:"6px",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:(0,a.jsx)("i",{className:satkerModalMax?"pi pi-window-minimize":"pi pi-window-maximize"})}),
      (0,a.jsx)("button",{type:"button",onClick:()=>{setSatkerModalParty(null);setSatkerModalMax(!1);},style:{background:"none",border:"none",fontSize:"1.25rem",cursor:"pointer",color:"#64748b",padding:"0.25rem 0.5rem"},children:"✕"})
    ]})
  ]}),
  (()=>{
    if(satkerModalLoading){
      return (0,a.jsxs)("div",{style:{padding:"2.5rem",textAlign:"center",color:"#64748b"},children:[
        (0,a.jsx)("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"1.75rem",color:"#0284c7",marginBottom:"0.5rem"}}),
        (0,a.jsx)("div",{style:{fontSize:"0.85rem",fontWeight:600},children:"Memuat seluruh riwayat Satker dan Tempus keterlibatan..."})
      ]});
    }
    let grpMap={};
    if(satkerModalData&&satkerModalData.length>0){
      for(let item of satkerModalData){
        let sName=item.satker_nama||"POLRI";
        if(!grpMap[sName]){
          grpMap[sName]={name:sName,wilayah:item.wilayah_nama||"",lps:[],perans:new Set()};
        }
        grpMap[sName].lps.push(item);
        if(item.peran)grpMap[sName].perans.add(item.peran);
      }
    }
    let grpList=Object.values(grpMap);
    let totalUnik=grpList.length>0?grpList.length:(satkerModalParty.jumlah_satker_unik||1);
    let totalLpAll=satkerModalData.length>0?satkerModalData.length:(satkerModalParty.total_lp||1);

    return (0,a.jsxs)("div",{style:{padding:"1.25rem",overflowY:"auto",flex:"1 1 auto",maxHeight:satkerModalMax?"calc(100vh - 125px)":"65vh",display:"flex",flexDirection:"column",gap:"0.75rem"},children:[
      (0,a.jsxs)("div",{style:{fontSize:"0.85rem",fontWeight:600,color:"#334155",display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.25rem"},children:[
        (0,a.jsx)("i",{className:"pi pi-building",style:{color:"#0284c7"}}),
        (0,a.jsxs)("span",{children:["Tercatat pada ",(0,a.jsx)("strong",{style:{color:"#0f172a"},children:totalUnik})," Satuan Kerja (Total ",(0,a.jsx)("strong",{style:{color:"#b91c1c"},children:totalLpAll})," LP All-Time):"]})
      ]}),
      (0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:satkerModalMax?"repeat(auto-fill,minmax(28rem,1fr))":"1fr",gap:"0.75rem"},children:
        grpList.length>0?grpList.map((g,sIdx)=>(
          (0,a.jsxs)("div",{style:{borderRadius:"8px",border:"1px solid #e2e8f0",background:"#ffffff",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[
            (0,a.jsxs)("div",{style:{padding:"0.6rem 0.85rem",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.4rem"},children:[
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
                (0,a.jsx)("span",{style:{background:"#0284c7",color:"#ffffff",width:"1.35rem",height:"1.35rem",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700},children:sIdx+1}),
                (0,a.jsxs)("div",{children:[
                  (0,a.jsx)("div",{style:{fontWeight:700,fontSize:"0.84rem",color:"#0f172a"},children:g.name}),
                  g.wilayah&&g.wilayah!=="POLRI"?(0,a.jsx)("div",{style:{fontSize:"0.7rem",color:"#64748b"},children:"Induk: "+g.wilayah}):null
                ]})
              ]}),
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem"},children:[
                Array.from(g.perans).map(pr=>{
                  let sev="info";
                  if(pr==="TERSANGKA"||pr==="DPO")sev="danger";
                  else if(pr==="TERLAPOR")sev="warning";
                  else if(pr==="KORBAN")sev="success";
                  return (0,a.jsx)(n.Tag,{value:pr,severity:sev,style:{fontSize:"0.68rem",padding:"0.1rem 0.35rem"}},pr);
                }),
                (0,a.jsx)(n.Tag,{value:g.lps.length+" LP",severity:"contrast",style:{fontSize:"0.68rem",padding:"0.1rem 0.4rem"}})
              ]})
            ]}),
            (0,a.jsx)("div",{style:{padding:"0.6rem 0.85rem",display:"flex",flexDirection:"column",gap:"0.6rem",background:"#ffffff"},children:
              g.lps.map((lp,lIdx)=>{
                let cCrime=cleanCrime(lp.kejahatan);
                let cTkp=cleanTkp(lp.tempat_kejadian);
                return (0,a.jsxs)("div",{style:{padding:"0.6rem 0.75rem",background:"#f8fafc",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"0.76rem",display:"flex",flexDirection:"column",gap:"0.35rem"},children:[
                  (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.35rem"},children:[
                    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                      (0,a.jsx)("span",{style:{fontWeight:700,color:"#0f172a",fontSize:"0.82rem"},children:lp.no_laporan||"LP Tanpa Nomor"}),
                      (0,a.jsx)(n.Tag,{value:lp.status_lp||"PROSES",severity:lp.status_lp==="SELESAI"?"success":(lp.status_lp==="BARU"?"info":"warning"),style:{fontSize:"0.65rem",padding:"0.1rem 0.35rem",fontWeight:700}})
                    ]}),
                    (0,a.jsxs)("div",{style:{color:"#64748b",fontSize:"0.72rem"},children:["Tgl LP: ",(0,a.jsx)("strong",{style:{color:"#334155"},children:lp.tgl_laporan||"—"})]})
                  ]}),
                  (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[
                    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.35rem",color:"#b45309",background:"#fffbeb",padding:"0.25rem 0.45rem",borderRadius:"5px",border:"1px solid #fde68a"},children:[
                      (0,a.jsx)("i",{className:"pi pi-calendar-clock",style:{fontSize:"0.75rem",marginTop:"0.1rem"}}),
                      (0,a.jsxs)("span",{children:[(0,a.jsx)("strong",{children:"Tempus Kejadian: "}),lp.waktu_kejadian||"—"]})
                    ]}),
                    cTkp?(0,a.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.35rem",color:"#334155",background:"#f1f5f9",padding:"0.25rem 0.45rem",borderRadius:"5px",border:"1px solid #e2e8f0",fontSize:"0.73rem"},children:[
                      (0,a.jsx)("i",{className:"pi pi-map-marker",style:{fontSize:"0.75rem",color:"#ef4444",marginTop:"0.1rem"}}),
                      (0,a.jsxs)("span",{children:[(0,a.jsx)("strong",{children:"TKP: "}),cTkp]})
                    ]}):null,
                    (0,a.jsxs)("div",{style:{color:"#0f172a",fontSize:"0.74rem",padding:"0.15rem 0.2rem"},children:[
                      (0,a.jsx)("strong",{children:"Kejahatan: "}),
                      (0,a.jsx)("span",{style:{color:"#b91c1c",fontWeight:600},children:cCrime})
                    ]}),
                    lp.uraian_kejadian&&lp.uraian_kejadian!=="—"?(0,a.jsxs)("div",{style:{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:"6px",padding:"0.4rem 0.55rem",color:"#334155",fontSize:"0.73rem",lineHeight:"1.4"},children:[
                      (0,a.jsx)("div",{style:{fontWeight:700,color:"#475569",marginBottom:"0.15rem",display:"flex",alignItems:"center",gap:"0.3rem"},children:[(0,a.jsx)("i",{className:"pi pi-align-left",style:{fontSize:"0.7rem"}}),"Uraian Kejadian:"]}),
                      (0,a.jsx)("div",{style:{color:"#1e293b",whiteSpace:"pre-wrap"},children:lp.uraian_kejadian})
                    ]}):null
                  ]})
                ]},lIdx);
              })
            })
          ]},sIdx)
        )):((satkerModalParty.daftar_satker||satkerModalParty.satker_nama||"Mabes Polri").split(",").map((stk,idx)=>(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.5rem 0.75rem",background:"#f1f5f9",borderRadius:"6px",border:"1px solid #e2e8f0"},children:[(0,a.jsx)("span",{style:{background:"#0284c7",color:"#ffffff",width:"1.4rem",height:"1.4rem",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,flexShrink:0},children:idx+1}),(0,a.jsx)("span",{style:{fontWeight:600,fontSize:"0.82rem",color:"#1e293b"},children:stk.trim()})]},idx)))
      })
    ]});
  })(),
  (0,a.jsxs)("div",{style:{padding:"0.75rem 1.25rem",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",flexWrap:"wrap",gap:"0.5rem"},children:[
    (0,a.jsxs)("button",{type:"button",onClick:()=>{let val=satkerModalParty?.nik&&!String(satkerModalParty.nik).startsWith("KORP:")?satkerModalParty.nik:(satkerModalParty?.nama||"");jumpToRegister(val);},className:"att-btn",style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.78rem",fontWeight:600,color:"#0284c7"},children:[(0,a.jsx)("i",{className:"pi pi-search"}),(0,a.jsx)("span",{children:"Buka di Register Pihak Terlibat"})]}),
    (0,a.jsx)("button",{type:"button",onClick:()=>{setSatkerModalParty(null);setSatkerModalMax(!1);},className:"att-btn primary",children:"Tutup"})
  ]})
]})}):null,lpModalParty?(0,a.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(15,23,42,0.65)",backdropFilter:"blur(3px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:lpModalMax?"0":"1rem"},onClick:()=>setLpModalParty(null),children:(()=>{
  let pRows=lpModalData.filter(x=>x.in_period);
  let actRows=lpModalTab==="period"?(pRows.length>0?pRows:lpModalData):lpModalData;
  let pCount=pRows.length>0?pRows.length:(lpModalParty?.total_lp||0);
  let isCorp=lpModalParty?.nik?.startsWith("KORP:");
  return (0,a.jsxs)("div",{style:{backgroundColor:"#ffffff",borderRadius:lpModalMax?"0px":"12px",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)",width:lpModalMax?"100vw":"100%",maxWidth:lpModalMax?"100vw":"76rem",height:lpModalMax?"100vh":"auto",maxHeight:lpModalMax?"100vh":"90vh",display:"flex",flexDirection:"column",overflow:"hidden",transition:"all 0.18s ease-in-out"},onClick:ev=>ev.stopPropagation(),children:[
    (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"1rem 1.25rem",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"},children:[
      (0,a.jsxs)("div",{children:[
        (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,a.jsx)("div",{style:{fontWeight:700,fontSize:"1.05rem",color:"#0f172a"},children:"Daftar Laporan Polisi"}),
          (0,a.jsx)(n.Tag,{value:(lpModalLoading?(lpModalParty?.total_lp||"..."):actRows.length)+" LP",severity:"danger",style:{fontWeight:700,fontSize:"0.75rem"}})
        ]}),
        (0,a.jsxs)("div",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.15rem"},children:[
          lpModalParty.nama||"Tanpa Nama",
          " (",
          isCorp?"Badan Hukum / Korporasi":("NIK: "+(lpModalParty.nik||"—")),
          ")"
        ]}),
        (0,a.jsxs)("div",{style:{display:"flex",gap:"0.4rem",marginTop:"0.5rem"},children:[
          (0,a.jsxs)("button",{type:"button",onClick:()=>setLpModalTab("period"),style:{padding:"0.22rem 0.65rem",borderRadius:"6px",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",border:lpModalTab==="period"?"1px solid #0284c7":"1px solid #cbd5e1",background:lpModalTab==="period"?"#0284c7":"#ffffff",color:lpModalTab==="period"?"#ffffff":"#475569"},children:["Periode Terpilih (",lpModalLoading?(lpModalParty?.total_lp||"..."):pCount," LP)"]}),
          (0,a.jsxs)("button",{type:"button",onClick:()=>setLpModalTab("all"),style:{padding:"0.22rem 0.65rem",borderRadius:"6px",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",border:lpModalTab==="all"?"1px solid #0284c7":"1px solid #cbd5e1",background:lpModalTab==="all"?"#0284c7":"#ffffff",color:lpModalTab==="all"?"#ffffff":"#475569"},children:["Semua Riwayat (",lpModalLoading?"...":lpModalData.length," LP)"]})
        ]})
      ]}),
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem"},children:[
        (0,a.jsx)("button",{type:"button",onClick:()=>setLpModalMax(!lpModalMax),title:lpModalMax?"Perkecil Tampilan":"Perbesar / Maksimalkan Layar",style:{background:lpModalMax?"#eff6ff":"#f8fafc",border:"1px solid "+(lpModalMax?"#93c5fd":"#cbd5e1"),fontSize:"0.95rem",cursor:"pointer",color:lpModalMax?"#2563eb":"#475569",padding:"0.3rem 0.55rem",borderRadius:"6px",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:(0,a.jsx)("i",{className:lpModalMax?"pi pi-window-minimize":"pi pi-window-maximize"})}),
        (0,a.jsx)("button",{type:"button",onClick:()=>{setLpModalParty(null);setLpModalMax(!1);},style:{background:"none",border:"none",fontSize:"1.25rem",cursor:"pointer",color:"#64748b",padding:"0.25rem 0.5rem"},children:"✕"})
      ]})
    ]}),
    (0,a.jsx)("div",{style:{padding:"0.75rem 1rem",overflowY:"auto",flex:"1 1 auto",maxHeight:lpModalMax?"calc(100vh - 135px)":"68vh"},children:
      (0,a.jsxs)(l.DataTable,{
        value:actRows,
        loading:lpModalLoading,
        paginator:actRows.length>(lpModalMax?20:5),
        rows:lpModalMax?20:5,
        rowsPerPageOptions:[5,10,25,50],
        paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
        currentPageReportTemplate:"Menampilkan {first} - {last} dari {totalRecords} LP",
        size:"small",
        stripedRows:!0,
        emptyMessage:lpModalLoading?"Memuat rincian laporan polisi...":"Tidak ada rincian laporan polisi untuk pihak ini.",
        children:[
          (0,a.jsx)(r.Column,{header:"No",body:(row,opt)=>opt.rowIndex+1,style:{width:"3.2rem",textAlign:"center"}}),
          (0,a.jsx)(r.Column,{header:"Nomor LP & Status",body:row=>(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.2rem"},children:[
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"},children:[
              (0,a.jsx)("span",{style:{fontWeight:700,color:"#0f172a",fontSize:"0.8rem",lineHeight:"1.3",wordBreak:"break-word"},children:row.no_laporan||"LP Tanpa Nomor"}),
              (0,a.jsx)(n.Tag,{value:row.status_lp||"PROSES",severity:row.status_lp==="SELESAI"?"success":(row.status_lp==="BARU"?"info":"warning"),style:{fontSize:"0.65rem",padding:"0.1rem 0.35rem",fontWeight:700}})
            ]}),
            (0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b",display:"flex",alignItems:"center",gap:"0.3rem"},children:[
              (0,a.jsx)("span",{children:row.tgl_laporan||"—"}),
              row.tahun&&row.tahun!=="2026"?(0,a.jsx)(n.Tag,{value:"Thn "+row.tahun,severity:"secondary",style:{fontSize:"0.65rem",padding:"0.1rem 0.3rem"}}):null
            ]})
          ]}),style:{minWidth:"14rem"}}),
          (0,a.jsx)(r.Column,{header:"Kejahatan",body:row=>{
            let cText=cleanCrime(row.kejahatan);
            return (0,a.jsx)("div",{style:{fontSize:"0.76rem",fontWeight:600,color:"#b91c1c",lineHeight:"1.35",background:"#fef2f2",padding:"0.35rem 0.5rem",borderRadius:"6px",border:"1px solid #fee2e2",wordBreak:"break-word"},children:cText});
          },style:{minWidth:"12rem"}}),
          (0,a.jsx)(r.Column,{header:"Tempus & TKP",body:row=>{
            let tkp=cleanTkp(row.tempat_kejadian);
            return (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem",fontWeight:700,fontSize:"0.74rem",color:"#b45309",background:"#fffbeb",padding:"0.2rem 0.4rem",borderRadius:"5px",border:"1px solid #fde68a"},children:[
                (0,a.jsx)("i",{className:"pi pi-calendar-clock",style:{fontSize:"0.72rem",flexShrink:0}}),
                (0,a.jsx)("span",{children:row.waktu_kejadian||"—"})
              ]}),
              tkp?(0,a.jsxs)("div",{style:{fontSize:"0.7rem",color:"#475569",display:"flex",alignItems:"flex-start",gap:"0.25rem",lineHeight:"1.3",wordBreak:"break-word"},children:[
                (0,a.jsx)("i",{className:"pi pi-map-marker",style:{fontSize:"0.72rem",color:"#ef4444",marginTop:"0.1rem",flexShrink:0}}),
                (0,a.jsx)("span",{children:tkp})
              ]}):null
            ]});
          },style:{minWidth:"14rem"}}),
          (0,a.jsx)(r.Column,{header:"Uraian Kejadian",body:row=>(0,a.jsx)("div",{style:{maxHeight:lpModalMax?"10rem":"6rem",overflowY:"auto",fontSize:"0.74rem",lineHeight:"1.45",color:"#334155",background:"#f8fafc",padding:"0.4rem 0.6rem",borderRadius:"6px",border:"1px solid #e2e8f0",wordBreak:"break-word",whiteSpace:"pre-wrap"},children:row.uraian_kejadian||"—"}),style:{minWidth:"18rem"}}),
          (0,a.jsx)(r.Column,{header:"Satker",body:row=>(0,a.jsxs)("div",{children:[
            (0,a.jsx)("div",{style:{fontWeight:600,color:"#0f172a",fontSize:"0.75rem",lineHeight:"1.3"},children:row.satker_nama||"POLRI"}),
            row.wilayah_nama&&row.wilayah_nama!=="POLRI"?(0,a.jsx)("div",{style:{fontSize:"0.68rem",color:"#64748b"},children:row.wilayah_nama}):null
          ]}),style:{minWidth:"10rem"}}),
          (0,a.jsx)(r.Column,{header:"Peran",body:row=>{
            let p=(row.peran||"PIHAK").toUpperCase(),sev="info";
            if(p==="TERSANGKA"||p==="DPO")sev="danger";
            else if(p==="TERLAPOR")sev="warning";
            else if(p==="KORBAN")sev="success";
            else if(p==="PELAPOR")sev="contrast";
            return(0,a.jsx)(n.Tag,{value:p,severity:sev,style:{fontWeight:700,fontSize:"0.72rem"}});
          },style:{width:"6.5rem",textAlign:"center"}})
        ]
      })
    }),
    (0,a.jsxs)("div",{style:{padding:"0.75rem 1.25rem",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",flexWrap:"wrap",gap:"0.5rem"},children:[
      (0,a.jsxs)("button",{type:"button",onClick:()=>{let val=lpModalParty?.nik&&!String(lpModalParty.nik).startsWith("KORP:")?lpModalParty.nik:(lpModalParty?.nama||"");jumpToRegister(val);},className:"att-btn",style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.78rem",fontWeight:600,color:"#0284c7"},children:[(0,a.jsx)("i",{className:"pi pi-search"}),(0,a.jsx)("span",{children:"Buka di Register Pihak Terlibat"})]}),
      (0,a.jsx)("button",{type:"button",onClick:()=>{setLpModalParty(null);setLpModalMax(!1);},className:"att-btn primary",children:"Tutup"})
    ]})
  ]});
})()}):null]})} return(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"cms-page-title",children:"Register Pihak Terlibat"}),(0,a.jsx)("p",{className:"cms-page-sub",children:"Register pihak per LP dari DORS, Surat Penetapan Tersangka, dan entri manual."}),(0,a.jsx)("div",{className:"lp-status-cards",style:{margin:"0 0 0.85rem",gridTemplateColumns:"repeat(auto-fit,minmax(7.5rem,1fr))"},children:q.map((e=>{let t=w===e.keterlibatan&&D===e.status,n=x?.[e.key];return(0,a.jsxs)("button",{type:"button",onClick:()=>{R(e.keterlibatan),O(e.status)},className:`lp-stat ${"semua"===e.key?"total":"ct"}${t?" active":""}`,children:[(0,a.jsx)("div",{className:"n",children:null==n?"—":Number(n).toLocaleString("id-ID")}),(0,a.jsx)("div",{className:"l",children:e.label})]},e.key)}))}),(0,a.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden"},children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap",padding:"0.75rem 1rem",width:"100%"},children:[(0,a.jsx)(s.InputText,{id:"pt-search-lp",name:"search_lp",value:k,onChange:e=>L(e.target.value),onKeyDown:e=>{"Enter"===e.key&&K()},placeholder:"Cari nama / NIK / nomor laporan…",style:{flex:"1.15 1 11rem",minWidth:"10rem"}}),(0,a.jsxs)("div",{style:{position:"relative",flex:"0 1 14.5rem",minWidth:"12rem"},children:[

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

  "year"===ptPeriodMode&&(0,a.jsx)("div",{style:{marginBottom:"0.55rem"},children:(0,a.jsx)(i.Dropdown,{id:"pt-period-year-single",inputId:"pt-period-year-single-select",name:"period_year_single",value:ptPeriodYear,options:ptYearOptions(),onChange:e=>setPtPeriodYear(e.value),placeholder:"Pilih Tahun",style:{width:"100%"}})}),"month"===ptPeriodMode&&(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.55rem"},children:[

    (0,a.jsx)(i.Dropdown,{id:"pt-period-month",inputId:"pt-period-month-select",name:"period_month",value:ptPeriodMonth,options:ptMonthOptions(),onChange:e=>setPtPeriodMonth(e.value),placeholder:"Bulan",style:{width:"100%"}}),

    (0,a.jsx)(i.Dropdown,{id:"pt-period-year",inputId:"pt-period-year-select",name:"period_year",value:ptPeriodYear,options:ptYearOptions(),onChange:e=>setPtPeriodYear(e.value),placeholder:"Tahun",style:{width:"100%"}})

  ]}),

  "custom"===ptPeriodMode&&(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:"0.45rem"},children:[

    (0,a.jsx)(s.InputText,{id:"pt-custom-from",name:"date_from",type:"date",value:ptCustomFrom,onChange:e=>setPtCustomFrom(e.target.value),style:{width:"100%"}}),

    (0,a.jsx)("span",{style:{color:"#94a3b8"},children:"–"}),

    (0,a.jsx)(s.InputText,{id:"pt-custom-to",name:"date_to",type:"date",value:ptCustomTo,onChange:e=>setPtCustomTo(e.target.value),style:{width:"100%"}})

  ]}),

  ptPeriodError&&(0,a.jsx)("div",{role:"alert",style:{marginTop:"0.65rem",color:"#b91c1c",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"0.5rem 0.65rem",fontSize:"0.72rem",fontWeight:600},children:ptPeriodError}),

  (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",gap:"0.5rem",marginTop:"0.85rem",paddingTop:"0.7rem",borderTop:"1px solid #e2e8f0"},children:[

    (0,a.jsx)("button",{type:"button",className:"att-btn",onClick:ptResetPeriod,children:"Reset"}),

    (0,a.jsx)("button",{type:"button",className:"att-btn",onClick:ptApplyPeriod,style:{background:"#2563eb",borderColor:"#2563eb",color:"#fff"},children:"Terapkan"})

  ]})

]})

]}),(0,a.jsx)(i.Dropdown,{id:"pt-filter-crime",inputId:"pt-filter-crime-select",name:"filter_crime",value:F,options:[{label:"Semua Jenis Kejahatan",value:""},...crimeOptsPT],onChange:e=>H(e.value||""),placeholder:"Jenis kejahatan…",filter:!0,valueTemplate:e=>(0,a.jsx)("span",{title:e?.label||"",style:{display:"block",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e?.label||"Jenis kejahatan…"}),itemTemplate:e=>(0,a.jsx)("span",{title:e?.label||"",style:{display:"block",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e?.label||""}),panelStyle:{width:"20rem",maxWidth:"calc(100vw - 2rem)"},style:{flex:"1 1 10rem",minWidth:"9rem",maxWidth:"15rem"}}),(0,a.jsx)(i.Dropdown,{id:"pt-filter-satker",inputId:"pt-filter-satker-select",name:"filter_satker",value:scopeSatkerPT,options:[{label:"Semua Satker",value:null},...scopeOptsPT],onChange:e=>setScopeSatkerPT(e.value==null?null:Number(e.value)),placeholder:"Satker…",filter:!0,style:{flex:"1.35 1 14rem",minWidth:"13rem"}}),(0,a.jsx)(i.Dropdown,{id:"pt-filter-sumber",inputId:"pt-filter-sumber-select",name:"filter_sumber",value:T,options:m,onChange:e=>N(e.value),placeholder:"Sumber",style:{flex:"0.7 1 9rem",minWidth:"8rem"}}),(0,a.jsx)(i.Dropdown,{id:"pt-filter-keterlibatan",inputId:"pt-filter-keterlibatan-select",name:"filter_keterlibatan",value:w,options:d,onChange:e=>{R(e.value),O("ALL")},placeholder:"Keterlibatan",style:{flex:"0.85 1 10rem",minWidth:"9rem"}}),(0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flex:"0 0 auto",marginLeft:"auto"},children:[(0,a.jsx)("button",{type:"button",onClick:K,className:"att-btn primary",children:"Terapkan"}),(0,a.jsx)("button",{type:"button",onClick:W,className:"att-btn",children:"Reset"})]})]}),[Y,Q].filter(Boolean).map(((e,t)=>(0,a.jsx)("div",{role:"alert",style:{margin:"0.75rem",padding:"0.7rem 0.85rem",border:"1px solid #fecaca",borderRadius:"8px",background:"#fef2f2",color:"#b91c1c",fontWeight:600},children:e},t))),(0,a.jsxs)(l.DataTable,{value:e,loading:g,lazy:!0,paginator:!0,first:(A-1)*f,rows:f,rowsPerPageOptions:[25,50,100],paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",totalRecords:c,onPage:e=>{v(Math.floor((e.first||0)/(e.rows||f))+1),y(e.rows||f)},stripedRows:!0,size:"small",emptyMessage:"Tidak ada data.",children:[(0,a.jsx)(r.Column,{header:"No",body:(e,a)=>a.rowIndex+1,style:{width:"3.5rem"}}),(0,a.jsx)(r.Column,{field:"nama",header:"Nama"}),(0,a.jsx)(r.Column,{field:"nik",header:"NIK",body:e=>e.nik||"—",style:{width:"9rem"}}),(0,a.jsx)(r.Column,{field:"keterlibatan",header:"Keterlibatan",body:e=>(0,a.jsx)(n.Tag,{value:e.keterlibatan,severity:"DPO"===e.keterlibatan||"TERSANGKA"===e.keterlibatan?"danger":"SAKSI"===e.keterlibatan||"AHLI"===e.keterlibatan?"info":"TERLAPOR"===e.keterlibatan?"warning":void 0}),style:{width:"8rem"}}),(0,a.jsx)(r.Column,{header:"Sumber",body:e=>(0,a.jsx)(n.Tag,{value:"DORS"===e.sumber?"DORS":"DOKUMEN"===e.sumber?"Dokumen":"Manual",severity:"DORS"===e.sumber?void 0:"DOKUMEN"===e.sumber?"warning":"success"}),style:{width:"7rem"}}),(0,a.jsx)(r.Column,{header:"Dokumen",body:e=>"MANUAL"===e.sumber&&"SAKSI"===e.keterlibatan?`BAP ${b(e.bap_tanggal)}`:("MANUAL"===e.sumber||"DOKUMEN"===e.sumber)&&"TERSANGKA"===e.keterlibatan?`${e.nomor_dokumen||"—"} · ${b(e.tanggal_dokumen)}`:"DPO"===e.keterlibatan?(e.nomor_dokumen?`${e.nomor_dokumen}${e.tanggal_dokumen?` · ${b(e.tanggal_dokumen)}`:""}`:"DPO Aktif"):"—"}),(0,a.jsx)(r.Column,{field:"no_laporan",header:"Nomor LP",body:e=>e.no_laporan||"—"}),(0,a.jsx)(r.Column,{field:"kejahatan",header:"Kejahatan",body:e=>e.kejahatan||"—"}),(0,a.jsx)(r.Column,{header:"Satker",body:u}),(0,a.jsx)(r.Column,{header:"Aksi / Arsip",style:{width:"6.5rem",textAlign:"center"},body:e=>(e.scan_dokumen_url||e.lampiran_url||e.foto_dpo_url||e.foto_url)?(0,a.jsx)("button",{type:"button",onClick:()=>{setArsipModalTab("doc");setArsipModalDoc(e)},title:"Lihat Dokumen / Arsip DPO",style:{border:"none",background:"#eff6ff",color:"#2563eb",borderRadius:"6px",padding:"4px 8px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px",fontSize:"12px",fontWeight:600},children:[(0,a.jsx)("i",{className:"pi pi-eye",style:{fontSize:"13px"}}),(0,a.jsx)("span",{children:"Arsip"})]}):"—"})]}),arsipModalDoc?(()=>{let dpoId=arsipModalDoc.id||arsipModalDoc.dpo_id||(arsipModalDoc.row_id?arsipModalDoc.row_id.replace("dpo:",""):"");let docUrl="/api/bdb/pihak-terlibat/dpo/"+dpoId+"/arsip";let fotoUrl="/api/bdb/pihak-terlibat/dpo/"+dpoId+"/foto";let activeUrl=(arsipModalTab==="foto")?fotoUrl:docUrl;let embedSrc=activeUrl;return (0,a.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(15,23,42,0.75)",backdropFilter:"blur(3px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99999,padding:arsipModalMax?"0":"1rem"},onClick:()=>setArsipModalDoc(null),children:(0,a.jsxs)("div",{style:{backgroundColor:"#ffffff",borderRadius:arsipModalMax?"0px":"14px",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.35)",width:arsipModalMax?"100vw":"95vw",maxWidth:arsipModalMax?"100vw":"1150px",height:arsipModalMax?"100vh":"90vh",display:"flex",flexDirection:"column",overflow:"hidden",border:arsipModalMax?"none":"1px solid #cbd5e1"},onClick:ev=>ev.stopPropagation(),children:[(0,a.jsxs)("div",{style:{padding:"0.85rem 1.25rem",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#f8fafc"},children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[(0,a.jsx)("div",{style:{width:"36px",height:"36px",borderRadius:"8px",background:"#eff6ff",color:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"},children:(0,a.jsx)("i",{className:"pi pi-file"})}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[(0,a.jsx)("span",{style:{fontWeight:800,fontSize:"1rem",color:"#0f172a"},children:"Dokumen Arsip DPO Resmi"}),(0,a.jsx)(n.Tag,{value:"STATUS DPO: AKTIF",severity:"danger",style:{fontWeight:700,fontSize:"0.7rem",padding:"0.15rem 0.45rem"}})]}),(0,a.jsxs)("div",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.1rem"},children:[arsipModalDoc.nomor_dokumen?("["+arsipModalDoc.nomor_dokumen+"] "):"",arsipModalDoc.nama||"Tanpa Nama",arsipModalDoc.satker_nama?(" - "+arsipModalDoc.satker_nama):""]})]})]}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[(0,a.jsx)("button",{type:"button",onClick:()=>setArsipModalMax(!arsipModalMax),title:arsipModalMax?"Perkecil Tampilan":"Perbesar / Layar Penuh",style:{padding:"0.35rem 0.65rem",borderRadius:"6px",fontSize:"0.75rem",fontWeight:700,border:"1px solid "+(arsipModalMax?"#93c5fd":"#cbd5e1"),background:arsipModalMax?"#eff6ff":"#ffffff",color:arsipModalMax?"#2563eb":"#334155",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,a.jsx)("i",{className:arsipModalMax?"pi pi-window-minimize":"pi pi-window-maximize",style:{fontSize:"11px"}}),(0,a.jsx)("span",{children:arsipModalMax?"Perkecil":"Layar Penuh"})]}),(0,a.jsxs)("button",{type:"button",onClick:()=>window.open(activeUrl,"_blank"),title:"Buka dokumen di tab baru",style:{padding:"0.35rem 0.75rem",borderRadius:"6px",fontSize:"0.75rem",fontWeight:600,border:"1px solid #cbd5e1",background:"#ffffff",color:"#334155",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,a.jsx)("i",{className:"pi pi-external-link",style:{fontSize:"11px"}}),(0,a.jsx)("span",{children:"Buka di Tab Baru"})]}),(0,a.jsxs)("button",{type:"button",onClick:()=>{setArsipModalDoc(null);setArsipModalMax(!1);},style:{padding:"0.35rem 0.75rem",borderRadius:"6px",fontSize:"0.75rem",fontWeight:700,border:"none",background:"#f1f5f9",color:"#475569",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,a.jsx)("i",{className:"pi pi-times",style:{fontSize:"11px"}}),(0,a.jsx)("span",{children:"Tutup"})]})]})]}),(0,a.jsxs)("div",{style:{padding:"0.4rem 1.25rem",background:"#f1f5f9",borderBottom:"1px solid #e2e8f0",display:"flex",gap:"0.5rem"},children:[(0,a.jsxs)("button",{type:"button",onClick:()=>setArsipModalTab("doc"),style:{padding:"0.3rem 0.75rem",borderRadius:"6px",fontSize:"0.8rem",fontWeight:600,border:"none",cursor:"pointer",background:arsipModalTab==="doc"?"#ffffff":"transparent",color:arsipModalTab==="doc"?"#1e40af":"#64748b",boxShadow:arsipModalTab==="doc"?"0 1px 3px rgba(0,0,0,0.1)":"none"},children:[(0,a.jsx)("i",{className:"pi pi-file-pdf",style:{marginRight:"0.35rem"}}),(0,a.jsx)("span",{children:"Dokumen Penetapan DPO (Arsip Internal)"})]}),(0,a.jsxs)("button",{type:"button",onClick:()=>setArsipModalTab("foto"),style:{padding:"0.3rem 0.75rem",borderRadius:"6px",fontSize:"0.8rem",fontWeight:600,border:"none",cursor:"pointer",background:arsipModalTab==="foto"?"#ffffff":"transparent",color:arsipModalTab==="foto"?"#1e40af":"#64748b",boxShadow:arsipModalTab==="foto"?"0 1px 3px rgba(0,0,0,0.1)":"none"},children:[(0,a.jsx)("i",{className:"pi pi-image",style:{marginRight:"0.35rem"}}),(0,a.jsx)("span",{children:"Foto Profil DPO"})]})]}),(0,a.jsx)("div",{style:{flex:1,width:"100%",height:"100%",backgroundColor:"#f8fafc",position:"relative"},children:(0,a.jsx)("iframe",{src:embedSrc,style:{width:"100%",height:"100%",border:"none"},allow:"autoplay"})})]})})})():null]})]})}])}]);