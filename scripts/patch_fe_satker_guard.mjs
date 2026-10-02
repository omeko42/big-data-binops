import fs from 'fs';

const filePath = 'frontend-patch/laporan-filter-perma-a15e28ec2e81.live.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Define isSatkerAllowedForOperator right before function handleApplySatker()
const target1 = 'function handleApplySatker() {';
if (!content.includes(target1)) {
    throw new Error('target1 not found');
}

const isSatkerAllowedFn = `function isSatkerAllowedForOperator(item) {
    if (eV) return true;
    if (!item || !item.id) return true;

    let u = (0, E.getUser)();
    let curSatkerId = Number(u?.satker_id || u?.organisasiId || u?.organisasi_id || u?.scope_satker_id || 0);
    if (Number(item.id) === curSatkerId) return true;

    let uSatkerName = String(u?.satker_nama || u?.satker?.deskripsi || u?.organisasi?.deskripsi || "").toUpperCase();
    let uDomain = String(actorPrimaryDomain || "").toUpperCase();

    let userDomain = "ALL";
    if (/SIBER/.test(uSatkerName) || /SIBER/.test(uDomain)) userDomain = "SIBER";
    else if (/KRIMSUS|TIPIDEKSUS|TIPIDTER|KORTAS|TIPIDKOR/.test(uSatkerName) || /KRIMSUS|TIPIDEKSUS|TIPIDTER|KORTAS|TIPIDKOR/.test(uDomain)) userDomain = "KRIMSUS";
    else if (/NARKOBA/.test(uSatkerName) || /NARKOBA/.test(uDomain)) userDomain = "NARKOBA";
    else if (/KRIMUM|TIPIDUM/.test(uSatkerName) || /KRIMUM|TIPIDUM/.test(uDomain)) userDomain = "KRIMUM";
    else if (/PPA|RENAKTA|PPO/.test(uSatkerName) || /PPA/.test(uDomain)) userDomain = "PPA";

    let targetDesc = String(item.deskripsi || item.name || "").toUpperCase();
    let isTargetDit = targetDesc.startsWith("DIT ") || targetDesc.startsWith("DITTIPID") || targetDesc.includes("DIREKTORAT");

    if (userDomain !== "ALL") {
        if (isTargetDit) {
            let targetDitDomain = "OTHER";
            if (/SIBER/.test(targetDesc)) targetDitDomain = "SIBER";
            else if (/KRIMSUS|TIPIDEKSUS|TIPIDTER|KORTAS|TIPIDKOR/.test(targetDesc)) targetDitDomain = "KRIMSUS";
            else if (/NARKOBA/.test(targetDesc)) targetDitDomain = "NARKOBA";
            else if (/KRIMUM|TIPIDUM/.test(targetDesc)) targetDitDomain = "KRIMUM";
            else if (/PPA|RENAKTA|PPO/.test(targetDesc)) targetDitDomain = "PPA";

            if (targetDitDomain !== userDomain) return false;
        }

        if (item.tipe_satker === "POLDA" && item.depth === 1 && !isTargetDit) {
            return false;
        }

        if (userDomain === "SIBER" && /SAT.*NARKOBA/.test(targetDesc)) {
            return false;
        }
    }

    if (item.jalur && uSatkerName) {
        let poldaMatch = (u?.satker?.jalur || uSatkerName).match(/POLDA\\s+([A-Z]+(?:\\s+[A-Z]+)*)/);
        if (poldaMatch) {
            let pName = poldaMatch[1].trim();
            if (!item.jalur.toUpperCase().includes(pName) && !targetDesc.includes(pName)) {
                return false;
            }
        }
    }

    return true;
}

`;

const replacement1 = isSatkerAllowedFn + `function handleApplySatker() {
    let u = (0, E.getUser)();
    let curSatkerId = Number(u?.satker_id || u?.organisasiId || u?.organisasi_id || u?.scope_satker_id || 0);
    let targetId = satkerDraftTarget?.id ? Number(satkerDraftTarget.id) : null;
    let chosenFD = satkerDraftFD !== undefined ? satkerDraftFD : eFD;
    if (satkerDraftTarget && !isSatkerAllowedForOperator(satkerDraftTarget)) {
        return;
    }`;

const oldApplyBlock = `function handleApplySatker() {
    let u = (0, E.getUser)();
    let curSatkerId = Number(u?.satker_id || u?.organisasiId || u?.organisasi_id || u?.scope_satker_id || 0);
    let targetId = satkerDraftTarget?.id ? Number(satkerDraftTarget.id) : null;
    let chosenFD = satkerDraftFD !== undefined ? satkerDraftFD : eFD;`;

if (!content.includes(oldApplyBlock)) {
    throw new Error('oldApplyBlock not found');
}
content = content.replace(oldApplyBlock, replacement1);

// 2. Guard handleConfirmAck()
const oldAckBlock = `async function handleConfirmAck() {
    if (!ackTarget || !ackChecked || !ackAlasan.trim()) return;`;

const newAckBlock = `async function handleConfirmAck() {
    if (!ackTarget || !ackChecked || !ackAlasan.trim()) return;
    if (!isSatkerAllowedForOperator(ackTarget)) {
        setAckModalOpen(false);
        setAckTarget(null);
        return;
    }`;

if (!content.includes(oldAckBlock)) {
    throw new Error('oldAckBlock not found');
}
content = content.replace(oldAckBlock, newAckBlock);

// 3. Auto-reset effect right after handleResetSatker()
const oldResetBlock = `    eSetAP({
        level: "",
        status: eu,
        model: ed,
        from: em,
        to: eg,
        search: eh.trim(),
        functionDomain: "INTERNAL_RESERSE",
        jenisKejahatanIds: eCrime || "",
        targetSatkerId: ""
    });
}`;

const newResetBlock = `    eSetAP({
        level: "",
        status: eu,
        model: ed,
        from: em,
        to: eg,
        search: eh.trim(),
        functionDomain: "INTERNAL_RESERSE",
        jenisKejahatanIds: eCrime || "",
        targetSatkerId: ""
    });
}
(0,n.useEffect)(()=>{
    if (eTargetSatker && !isSatkerAllowedForOperator(eTargetSatker)) {
        handleResetSatker();
    }
}, [eTargetSatker, actorPrimaryDomain]);`;

if (!content.includes(oldResetBlock)) {
    throw new Error('oldResetBlock not found');
}
content = content.replace(oldResetBlock, newResetBlock);

// 4. Update satker modal list rendering (paged.map)
const oldPagedMapStart = `paged.map(item=>{
                                                let isSelected = satkerDraftTarget?.id === item.id;
                                                return (0,t.jsxs)("div",{
                                                    key:item.id,
                                                    onClick:()=>setSatkerDraftTarget(isSelected ? null : item),
                                                    style:{
                                                        display:"flex",
                                                        alignItems:"center",
                                                        justifyContent:"space-between",
                                                        gap:"0.5rem",
                                                        padding:"0.4rem 0.65rem",
                                                        borderBottom:"1px solid #f1f5f9",
                                                        cursor:"pointer",
                                                        background:isSelected?"#f0fdf4":"transparent",
                                                        transition:"background 0.15s"
                                                    },
                                                    children:[
                                                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",minWidth:0},children:[
                                                            (0,t.jsx)("input",{id:"satker-radio-"+item.id,name:"satker_radio",type:"radio",checked:isSelected,readOnly:!0,style:{cursor:"pointer"}}),
                                                            (0,t.jsx)("label",{htmlFor:"satker-radio-"+item.id,style:{fontSize:"0.8rem",fontWeight:isSelected?700:500,color:isSelected?"#15803d":"#1e293b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"},children:item.deskripsi})
                                                        ]}),`;

const newPagedMapStart = `paged.map(item=>{
                                                let isSelected = satkerDraftTarget?.id === item.id;
                                                let isAllowed = isSatkerAllowedForOperator(item);
                                                return (0,t.jsxs)("div",{
                                                    key:item.id,
                                                    onClick:()=>{
                                                        if (!isAllowed) return;
                                                        setSatkerDraftTarget(isSelected ? null : item);
                                                    },
                                                    title: !isAllowed ? "Satker di luar kewenangan fungsi Anda" : undefined,
                                                    style:{
                                                        display:"flex",
                                                        alignItems:"center",
                                                        justifyContent:"space-between",
                                                        gap:"0.5rem",
                                                        padding:"0.4rem 0.65rem",
                                                        borderBottom:"1px solid #f1f5f9",
                                                        cursor: !isAllowed ? "not-allowed" : "pointer",
                                                        opacity: !isAllowed ? 0.45 : 1,
                                                        background:isSelected?"#f0fdf4":!isAllowed?"#f8fafc":"transparent",
                                                        transition:"background 0.15s"
                                                    },
                                                    children:[
                                                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",minWidth:0},children:[
                                                            (0,t.jsx)("input",{id:"satker-radio-"+item.id,name:"satker_radio",type:"radio",checked:isSelected,disabled:!isAllowed,readOnly:!0,style:{cursor:!isAllowed?"not-allowed":"pointer"}}),
                                                            (0,t.jsx)("label",{htmlFor:"satker-radio-"+item.id,style:{fontSize:"0.8rem",fontWeight:isSelected?700:500,color:!isAllowed?"#94a3b8":isSelected?"#15803d":"#1e293b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:!isAllowed?"not-allowed":"pointer"},children:item.deskripsi})
                                                        ]}),
                                                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem",flexShrink:0},children:[
                                                            !isAllowed && (0,t.jsx)("span",{style:{fontSize:"0.62rem",fontWeight:700,color:"#dc2626",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:4,padding:"0.05rem 0.35rem"},children:"Di Luar Fungsi"}),`;

const oldBadgeContainer = `(()=>{
                                                            let isDit=item.deskripsi&&(item.deskripsi.startsWith("DIT ") || item.deskripsi.startsWith("DITTIPID") || item.deskripsi.includes("DIREKTORAT"));
                                                            let isR=item.deskripsi&&(item.deskripsi.includes("SAT RESKRIM")||item.deskripsi.includes("SATRESKRIM"));
                                                            let isN=item.deskripsi&&(item.deskripsi.includes("SAT NARKOBA")||item.deskripsi.includes("SATRESNARKOBA"));
                                                            let bText=isDit?"DIREKTORAT":isR?"SATRESKRIM":isN?"SATNARKOBA":item.tipe_satker;
                                                            let bBg=isDit?"#ecfdf5":isR?"#eff6ff":isN?"#fdf2f8":item.tipe_satker==="POLDA"?"#f5f3ff":item.tipe_satker==="POLRES"?"#fffbeb":"#f1f5f9";
                                                            let bClr=isDit?"#047857":isR?"#1d4ed8":isN?"#be185d":item.tipe_satker==="POLDA"?"#6d28d9":item.tipe_satker==="POLRES"?"#b45309":"#64748b";
                                                            let bBdr=isDit?"#a7f3d0":isR?"#bfdbfe":isN?"#fbcfe8":item.tipe_satker==="POLDA"?"#ddd6fe":item.tipe_satker==="POLRES"?"#fde68a":"#e2e8f0";
                                                            return bText?(0,t.jsx)("span",{style:{fontSize:"0.65rem",fontWeight:700,color:bClr,background:bBg,border:"1px solid "+bBdr,borderRadius:4,padding:"0.05rem 0.35rem",flexShrink:0},children:bText}):null;
                                                        })()
                                                    ]
                                                });
                                            })`;

const newBadgeContainer = `(()=>{
                                                                let isDit=item.deskripsi&&(item.deskripsi.startsWith("DIT ") || item.deskripsi.startsWith("DITTIPID") || item.deskripsi.includes("DIREKTORAT"));
                                                                let isR=item.deskripsi&&(item.deskripsi.includes("SAT RESKRIM")||item.deskripsi.includes("SATRESKRIM"));
                                                                let isN=item.deskripsi&&(item.deskripsi.includes("SAT NARKOBA")||item.deskripsi.includes("SATRESNARKOBA"));
                                                                let bText=isDit?"DIREKTORAT":isR?"SATRESKRIM":isN?"SATNARKOBA":item.tipe_satker;
                                                                let bBg=isDit?"#ecfdf5":isR?"#eff6ff":isN?"#fdf2f8":item.tipe_satker==="POLDA"?"#f5f3ff":item.tipe_satker==="POLRES"?"#fffbeb":"#f1f5f9";
                                                                let bClr=isDit?"#047857":isR?"#1d4ed8":isN?"#be185d":item.tipe_satker==="POLDA"?"#6d28d9":item.tipe_satker==="POLRES"?"#b45309":"#64748b";
                                                                let bBdr=isDit?"#a7f3d0":isR?"#bfdbfe":isN?"#fbcfe8":item.tipe_satker==="POLDA"?"#ddd6fe":item.tipe_satker==="POLRES"?"#fde68a":"#e2e8f0";
                                                                return bText?(0,t.jsx)("span",{style:{fontSize:"0.65rem",fontWeight:700,color:bClr,background:bBg,border:"1px solid "+bBdr,borderRadius:4,padding:"0.05rem 0.35rem",flexShrink:0},children:bText}):null;
                                                            })()
                                                        ]})
                                                    ]
                                                });
                                            })`;

const fullOldSection = oldPagedMapStart + '\n                                                        ' + oldBadgeContainer;
const fullNewSection = newPagedMapStart + '\n                                                            ' + newBadgeContainer;

if (!content.includes(fullOldSection)) {
    console.log('fullOldSection not found exactly, testing parts...');
    if (!content.includes(oldPagedMapStart)) console.log('oldPagedMapStart not found!');
    if (!content.includes(oldBadgeContainer)) console.log('oldBadgeContainer not found!');
    throw new Error('Section 4 match failed');
}

content = content.replace(fullOldSection, fullNewSection);

fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS: Patched laporan-filter-perma-a15e28ec2e81.live.js successfully!');
