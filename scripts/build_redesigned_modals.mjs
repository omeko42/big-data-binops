import fs from 'fs';
import { execSync } from 'child_process';

const original = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

// 1. Locate openMutateDialog span
const s1 = original.indexOf('async function openMutateDialog(user){');
const e1 = original.indexOf('async function handleMutateSubmit(){', s1);

if (s1 === -1 || e1 === -1) {
    throw new Error('Could not find openMutateDialog span');
}

// 2. Locate Mutasi Dialog span
const sMut = 56122; // ,(0,a.jsx)(d.Dialog,{ header: mutUser ?
const eMut = 67258;

// 3. Locate Review Dialog span
const sRev = 82444;
const eRev = 88983;

console.log('Spans:');
console.log('  openMutateDialog:', s1, 'to', e1);
console.log('  Mutasi Dialog:', sMut, 'to', eMut);
console.log('  Review Dialog:', sRev, 'to', eRev);

const code1 = `function formatIndoDateStr(d) {
    if (!d) return "-";
    try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return String(d);
        return dt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch(e) {
        return String(d);
    }
}
function formatIndoTimeStr(d) {
    if (!d) return "";
    try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return "";
        return dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    } catch(e) {
        return "";
    }
}
function renderUserMiniCard(u) {
    if (!u) return null;
    const initial = (u.name || "?").trim().charAt(0).toUpperCase();
    const isAktif = (u.status || "").toUpperCase() === "AKTIF";
    const roleColor = Q[u.role_bdb] || "secondary";
    return (0,a.jsxs)("div", {
        style: {
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            padding: "0.75rem 0.9rem",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "10px"
        },
        children: [
            (0,a.jsxs)("div", {
                style: { position: "relative", flexShrink: 0 },
                children: [
                    u.photo_url ? (0,a.jsx)("img", {
                        src: u.photo_url,
                        alt: u.name,
                        style: { width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255, 255, 255, 0.15)" }
                    }) : (0,a.jsx)("div", {
                        style: {
                            width: "46px",
                            height: "46px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            boxShadow: "0 2px 8px rgba(2, 132, 199, 0.3)"
                        },
                        children: initial
                    }),
                    (0,a.jsx)("span", {
                        style: {
                            position: "absolute",
                            bottom: "0px",
                            right: "0px",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: isAktif ? "#16a34a" : "#dc2626",
                            border: "2px solid #0f172a"
                        },
                        title: isAktif ? "Status: AKTIF" : "Status: NONAKTIF"
                    })
                ]
            }),
            (0,a.jsxs)("div", {
                style: { display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0, flex: 1 },
                children: [
                    (0,a.jsxs)("div", {
                        style: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
                        children: [
                            (0,a.jsx)("span", { style: { fontWeight: 700, fontSize: "0.95rem", color: "var(--cas-text, #f8fafc)" }, children: u.name }),
                            (0,a.jsx)(t.Tag, { value: u.role_bdb || "viewer", severity: roleColor, style: { fontSize: "0.7rem", padding: "0.1rem 0.45rem" } })
                        ]
                    }),
                    (0,a.jsxs)("div", {
                        style: { display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap", fontSize: "0.76rem", color: "var(--cas-subtle, #94a3b8)" },
                        children: [
                            (0,a.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: "0.25rem" }, children: [(0,a.jsx)("i", { className: "pi pi-building", style: { fontSize: "0.72rem", color: "#38bdf8" } }), u.scope_satker_name || "Nasional"] }),
                            (u.nrp || u.username) ? (0,a.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: "0.25rem" }, children: [(0,a.jsx)("i", { className: "pi pi-id-card", style: { fontSize: "0.72rem", color: "#a855f7" } }), "NRP/ID: " + (u.nrp || u.username)] }) : null,
                            (0,a.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: "0.25rem" }, children: [(0,a.jsx)("i", { className: "pi pi-envelope", style: { fontSize: "0.72rem", color: "#f59e0b" } }), u.email_polri || u.email] })
                        ]
                    })
                ]
            })
        ]
    });
}
async function openMutateDialog(user){
    setMutUser(user);
    const rawReason = (user.deactivation_reason || "").trim();
    let effDate = new Date().toISOString().slice(0, 10);
    if (user.deactivated_at) {
        try {
            const dt = new Date(user.deactivated_at);
            if (!isNaN(dt.getTime())) effDate = dt.toISOString().slice(0, 10);
        } catch(e){}
    }
    const isOutOfRes = user.approval_status === "REQUEST_MUTASI_KELUAR" ||
        /keluar.*reserse|non.*reskrim|luar.*reskrim|sabhara|lantas|binmas|propam|polsek|samapta/i.test(rawReason);
    let sprin = "";
    const sprinMatch = rawReason.match(/(?:ST|Sprint|Sprin|SK|Kep|No\.?|Nomor)[\\s/:]*([A-Za-z0-9\\/\\.\\-]+)/i);
    if (sprinMatch && sprinMatch[1]) {
        sprin = sprinMatch[0].trim();
    }
    let nonReserseName = "";
    if (isOutOfRes) {
        const destMatch = rawReason.match(/(?:ke|tujuan|di)\\s+([A-Za-z0-9\\s\\.\\/\\(\\)]+?)(?:\\s*\\(|;|\\.|\\$)/i);
        if (destMatch && destMatch[1]) {
            nonReserseName = destMatch[1].trim();
        }
    }
    setMutData({
        to_satker_id: user.requested_scope_satker_id ? Number(user.requested_scope_satker_id) : (user.scope_satker_id ? Number(user.scope_satker_id) : null),
        to_satker_key: user.requested_scope_satker_key || user.scope_satker_key || "",
        to_satker_name: user.scope_satker_name || "",
        to_role: user.requested_role_bdb || user.role_bdb || "operator",
        nomor_surat: sprin,
        tanggal_efektif: effDate,
        keterangan: rawReason,
        is_keluar_reserse: isOutOfRes,
        satker_non_reserse: nonReserseName
    });
    setMutHistory([]);
    setMutHistoryLoading(!0);
    try {
        let res = await L.apiAuth.get('/user/' + user.id + '/mutations');
        let list = res.data?.data || res.data || [];
        setMutHistory(Array.isArray(list) ? list : []);
        const pending = Array.isArray(list) ? list.find(m => m.status === 'PENDING') : null;
        if (pending) {
            setMutData(prev => ({
                ...prev,
                to_satker_id: pending.to_satker_id ? Number(pending.to_satker_id) : prev.to_satker_id,
                to_satker_key: pending.to_satker_key || prev.to_satker_key,
                to_satker_name: pending.to_satker_name || prev.to_satker_name,
                to_role: pending.to_role || prev.to_role,
                nomor_surat: pending.nomor_surat || prev.nomor_surat,
                tanggal_efektif: pending.tanggal_efektif ? new Date(pending.tanggal_efektif).toISOString().slice(0, 10) : prev.tanggal_efektif,
                keterangan: pending.keterangan || prev.keterangan,
                is_keluar_reserse: Boolean(pending.is_keluar_reserse),
                satker_non_reserse: pending.is_keluar_reserse ? (pending.to_satker_name || prev.satker_non_reserse) : prev.satker_non_reserse
            }));
        }
    } catch(err) {
        console.error("Gagal mengambil histori mutasi:", err);
    } finally {
        setMutHistoryLoading(!1);
    }
}
`;

const codeMut = `,(0,a.jsx)(d.Dialog,{
    header:mutUser ? (ed.isOperator ? "Ajukan Usulan Mutasi Personil" : (mutUser.approval_status?.startsWith("REQUEST_") ? "Tinjau & Proses Usulan Mutasi Personil" : ("Mutasi Satker Personil — " + mutUser.name))) : "Mutasi Satker",
    visible:!!mutUser,
    onHide:()=>setMutUser(null),
    style:{width:"46rem",maxWidth:"96vw"},
    modal:!0,
    dismissableMask:!0,
    footer:(0,a.jsxs)("div",{
        style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",gap:"0.5rem",flexWrap:"wrap"},
        children:[
            (0,a.jsx)(o.Button,{label:"Batal",text:!0,disabled:mutLoading,onClick:()=>setMutUser(null)}),
            (0,a.jsxs)("div",{
                style:{display:"flex",alignItems:"center",gap:"0.5rem"},
                children:[
                    (!ed.isOperator && mutUser?.approval_status?.startsWith("REQUEST_")) ? (0,a.jsx)(o.Button,{
                        label:"Tolak Usulan",
                        severity:"secondary",
                        icon:"pi pi-times",
                        disabled:mutLoading,
                        onClick:async ()=>{
                            let target = mutUser;
                            setMutUser(null);
                            eh(target);
                            await asSuperadminReview("REJECT");
                        }
                    }) : null,
                    (0,a.jsx)(o.Button,{
                        label:ed.isOperator ? "Kirim Usulan Mutasi ke Superadmin" : "Eksekusi Mutasi Personil",
                        icon:ed.isOperator ? "pi pi-send" : "pi pi-check",
                        severity:"info",
                        loading:mutLoading,
                        onClick:handleMutateSubmit
                    })
                ]
            })
        ]
    }),
    children:mutUser && (0,a.jsxs)("div",{
        style:{display:"flex",flexDirection:"column",gap:"0.9rem"},
        children:[
            /* Proposal Banner if any proposal note or requested */
            ((mutUser.deactivation_reason || "").trim() || mutUser.approval_status?.startsWith("REQUEST_") || mutHistory.some(m => m.status === 'PENDING')) ? (0,a.jsxs)("div",{
                style:{
                    background:"linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(14, 165, 233, 0.05) 100%)",
                    border:"1px solid rgba(56, 189, 248, 0.35)",
                    borderRadius:"10px",
                    padding:"0.85rem 1rem",
                    display:"flex",
                    flexDirection:"column",
                    gap:"0.45rem"
                },
                children:[
                    (0,a.jsxs)("div",{
                        style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem"},
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",gap:"0.5rem"},
                                children:[
                                    (0,a.jsx)("span",{
                                        style:{
                                            background:"#0284c7",
                                            color:"#ffffff",
                                            borderRadius:"6px",
                                            padding:"0.2rem 0.55rem",
                                            fontSize:"0.72rem",
                                            fontWeight:700,
                                            textTransform:"uppercase",
                                            letterSpacing:"0.03em"
                                        },
                                        children:"📋 Usulan Mutasi Operator"
                                    }),
                                    mutUser.deactivated_at ? (0,a.jsxs)("span",{
                                        style:{fontSize:"0.75rem",color:"var(--cas-subtle, #94a3b8)",display:"inline-flex",alignItems:"center",gap:"0.3rem"},
                                        children:[
                                            (0,a.jsx)("i",{className:"pi pi-calendar",style:{fontSize:"0.7rem",color:"#38bdf8"}}),
                                            "Diajukan: " + formatIndoDateStr(mutUser.deactivated_at) + (formatIndoTimeStr(mutUser.deactivated_at) ? " " + formatIndoTimeStr(mutUser.deactivated_at) : "")
                                        ]
                                    }) : null
                                ]
                            }),
                            (0,a.jsx)("span",{
                                style:{fontSize:"0.72rem",color:"#38bdf8",fontWeight:600},
                                children:"✓ Data usulan otomatis dimuat ke formulir"
                            })
                        ]
                    }),
                    ((mutUser.deactivation_reason || "").trim() || mutHistory.find(m => m.status === 'PENDING')?.keterangan) ? (0,a.jsxs)("div",{
                        style:{
                            background:"rgba(0, 0, 0, 0.16)",
                            borderLeft:"3px solid #38bdf8",
                            padding:"0.5rem 0.75rem",
                            borderRadius:"0 6px 6px 0",
                            fontSize:"0.82rem",
                            color:"var(--cas-text, #f1f5f9)",
                            lineHeight:1.5,
                            fontStyle:"italic"
                        },
                        children:[
                            (0,a.jsx)("span",{style:{fontWeight:600,fontStyle:"normal",color:"#93c5fd",marginRight:"0.35rem"},children:"Alasan/Catatan Operator:"}),
                            mutUser.deactivation_reason || mutHistory.find(m => m.status === 'PENDING')?.keterangan
                        ]
                    }) : null
                ]
            }) : null,

            /* Rich Personnel Card */
            renderUserMiniCard(mutUser),

            /* Policy notice */
            (0,a.jsxs)("div",{
                style:{
                    background:"rgba(2, 132, 199, 0.08)",
                    border:"1px dashed rgba(56, 189, 248, 0.3)",
                    borderRadius:"8px",
                    padding:"0.5rem 0.75rem",
                    display:"flex",
                    alignItems:"center",
                    gap:"0.45rem",
                    fontSize:"0.75rem",
                    color:"#38bdf8"
                },
                children:[
                    (0,a.jsx)("i",{className:"pi pi-shield",style:{fontSize:"0.85rem",flexShrink:0}}),
                    "Ketentuan CAS Bareskrim: Seluruh histori dan administrasi LP personil di satker asal tetap tersimpan aman dan terarsip."
                ]
            }),

            /* Mutasi Type Selector (Cards) */
            (0,a.jsxs)("div",{
                style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},
                children:[
                    (0,a.jsxs)("div",{
                        onClick:()=>setMutData(prev=>({...prev,is_keluar_reserse:false})),
                        style:{
                            cursor:"pointer",
                            padding:"0.75rem 0.85rem",
                            borderRadius:"8px",
                            border:!mutData.is_keluar_reserse?"2px solid #0284c7":"1px solid rgba(255, 255, 255, 0.1)",
                            background:!mutData.is_keluar_reserse?"rgba(2, 132, 199, 0.12)":"rgba(255, 255, 255, 0.02)",
                            transition:"all 0.15s ease"
                        },
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",gap:"0.45rem",fontWeight:700,fontSize:"0.84rem",color:!mutData.is_keluar_reserse?"#38bdf8":"var(--cas-text, #f8fafc)"},
                                children:[
                                    (0,a.jsx)("i",{className:"pi pi-building",style:{fontSize:"0.9rem"}}),
                                    "Mutasi Internal Reskrim"
                                ]
                            }),
                            (0,a.jsx)("div",{
                                style:{fontSize:"0.72rem",color:"var(--cas-subtle, #94a3b8)",marginTop:"0.25rem"},
                                children:"Pindah satker / unit lain di jajaran Reserse POLRI."
                            })
                        ]
                    }),
                    (0,a.jsxs)("div",{
                        onClick:()=>setMutData(prev=>({...prev,is_keluar_reserse:true})),
                        style:{
                            cursor:"pointer",
                            padding:"0.75rem 0.85rem",
                            borderRadius:"8px",
                            border:mutData.is_keluar_reserse?"2px solid #f59e0b":"1px solid rgba(255, 255, 255, 0.1)",
                            background:mutData.is_keluar_reserse?"rgba(245, 158, 11, 0.12)":"rgba(255, 255, 255, 0.02)",
                            transition:"all 0.15s ease"
                        },
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",gap:"0.45rem",fontWeight:700,fontSize:"0.84rem",color:mutData.is_keluar_reserse?"#fbbf24":"var(--cas-text, #f8fafc)"},
                                children:[
                                    (0,a.jsx)("i",{className:"pi pi-sign-out",style:{fontSize:"0.9rem"}}),
                                    "Mutasi Keluar Reserse"
                                ]
                            }),
                            (0,a.jsx)("div",{
                                style:{fontSize:"0.72rem",color:"var(--cas-subtle, #94a3b8)",marginTop:"0.25rem"},
                                children:"Dinas luar fungsi Reskrim (Sabhara, Lantas, dll)."
                            })
                        ]
                    })
                ]
            }),

            mutData.is_keluar_reserse ? (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{background:"rgba(245, 158, 11, 0.1)",border:"1px solid rgba(245, 158, 11, 0.3)",borderRadius:"8px",padding:"0.65rem 0.85rem",display:"flex",flexDirection:"column",gap:"0.25rem"},
                        children:[
                            (0,a.jsxs)("div",{style:{fontWeight:600,fontSize:"0.82rem",color:"#fbbf24",display:"flex",alignItems:"center",gap:"0.35rem"},children:[(0,a.jsx)("i",{className:"pi pi-info-circle"}),"Penonaktifan Akses Sementara"]}),
                            (0,a.jsx)("div",{style:{fontSize:"0.75rem",color:"#fef3c7",lineHeight:1.45},children:"Personil yang mutasi keluar fungsi Reserse akan dinonaktifkan dari akses CAS Reskrim, namun SELURUH REKAM JEJAK & HISTORI LP TETAP TERSIMPAN UTUH. Jika kelak personil kembali ke jajaran Reserse, akun dapat dimutasikan kembali dan langsung tersambung."})
                        ]
                    }),
                    (0,a.jsx)(ee,{
                        label:"Satuan Kerja / Fungsi Baru (Luar Reskrim) *",
                        hint:"Nama kesatuan baru dinas luar Reskrim",
                        children:(0,a.jsx)(l.InputText,{
                            value:mutData.satker_non_reserse || "",
                            placeholder:"Contoh: Sat Sabhara Polres Bone / Ditlantas Polda Sulsel / Bagops",
                            onChange:e=>setMutData(prev=>({...prev,satker_non_reserse:e.target.value})),
                            style:{width:"100%"}
                        })
                    })
                ]
            }) : (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsx)(ee,{
                        label:"Satker Tujuan Mutasi *",
                        hint:mutData.to_satker_name ? mutData.to_satker_name : "Pilih satuan kerja baru",
                        children:(0,a.jsxs)("div",{
                            style:{display:"flex",flexDirection:"column",gap:"0.45rem",background:"rgba(255,255,255,0.03)",padding:"0.65rem 0.8rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.08)"},
                            children:[
                                (0,a.jsxs)("div",{
                                    style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"},
                                    children:[
                                        (0,a.jsxs)("div",{
                                            style:{display:"flex",alignItems:"center",gap:"0.45rem",minWidth:0,flex:1},
                                            children:[
                                                (0,a.jsx)(P.Building2,{size:16,style:{color:"#38bdf8",flexShrink:0}}),
                                                (0,a.jsx)("div",{style:{fontSize:"0.84rem",fontWeight:600,color:mutData.to_satker_name?"#f8fafc":"#94a3b8",wordBreak:"break-word"},children:mutData.to_satker_name||"— Belum Memilih Satker Tujuan —"})
                                            ]
                                        }),
                                        (0,a.jsx)(o.Button,{
                                            type:"button",
                                            label:mutData.to_satker_id?"Ubah Satker":"Pilih Satker Berjenjang",
                                            icon:"pi pi-sitemap",
                                            className:"p-button-sm p-button-outlined",
                                            onClick:()=>openSatkerPicker("mutasi"),
                                            style:{fontSize:"0.75rem",padding:"0.3rem 0.6rem"}
                                        })
                                    ]
                                }),
                                mutData.to_satker_key ? (0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b",fontFamily:"monospace"},children:["Kode: ",mutData.to_satker_key]}) : null
                            ]
                        })
                    }),
                    (0,a.jsx)(ee,{
                        label:"Role Penugasan Baru *",
                        children:(0,a.jsx)(u.Dropdown,{
                            value:mutData.to_role,
                            options:[
                                {label:"Operator (Input & Kelola LP)",value:"operator"},
                                {label:"Viewer (Hanya Lihat Laporan)",value:"viewer"}
                            ],
                            onChange:e=>setMutData(prev=>({...prev,to_role:e.value})),
                            style:{width:"100%"}
                        })
                    })
                ]
            }),

            /* Sprint and Effective Date */
            (0,a.jsxs)("div",{
                style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},
                children:[
                    (0,a.jsx)(ee,{
                        label:"Nomor Surat Keputusan / Sprint *",
                        hint:"Dasar hukum telegram mutasi",
                        children:(0,a.jsx)(l.InputText,{
                            value:mutData.nomor_surat,
                            placeholder:"Contoh: ST/01/IX/KEP./2026/RO-SDM",
                            onChange:e=>setMutData(prev=>({...prev,nomor_surat:e.target.value})),
                            style:{width:"100%"}
                        })
                    }),
                    (0,a.jsx)(ee,{
                        label:"Tanggal Efektif Mutasi *",
                        hint:mutUser.deactivated_at ? ("Tgl diajukan: " + formatIndoDateStr(mutUser.deactivated_at)) : "Tanggal mulai penugasan",
                        children:(0,a.jsx)("input",{
                            type:"date",
                            className:"p-inputtext p-component",
                            style:{width:"100%",padding:"0.45rem 0.6rem"},
                            value:mutData.tanggal_efektif,
                            onChange:e=>setMutData(prev=>({...prev,tanggal_efektif:e.target.value}))
                        })
                    })
                ]
            }),

            (0,a.jsx)(ee,{
                label:"Keterangan / Catatan Penugasan",
                hint:"Opsional (bisa disesuaikan dari usulan operator)",
                children:(0,a.jsx)(l.InputText,{
                    value:mutData.keterangan,
                    placeholder:"Contoh: Mutasi rotasi dinas sesuai sprin kapolda",
                    onChange:e=>setMutData(prev=>({...prev,keterangan:e.target.value})),
                    style:{width:"100%"}
                })
            }),

            /* Riwayat Mutasi Terdahulu */
            mutHistory && mutHistory.length > 0 ? (0,a.jsxs)("div",{
                style:{marginTop:"0.4rem"},
                children:[
                    (0,a.jsx)("div",{style:{fontSize:"0.82rem",fontWeight:700,color:"#94a3b8",marginBottom:"0.35rem"},children:"Riwayat Mutasi Personil Terdahulu"}),
                    (0,a.jsx)("div",{
                        style:{maxHeight:"8.5rem",overflowY:"auto",border:"1px solid rgba(255, 255, 255, 0.1)",borderRadius:"6px"},
                        children:(0,a.jsxs)("table",{
                            style:{width:"100%",borderCollapse:"collapse",fontSize:"0.75rem"},
                            children:[
                                (0,a.jsx)("thead",{
                                    style:{background:"rgba(255, 255, 255, 0.05)",borderBottom:"1px solid rgba(255, 255, 255, 0.1)"},
                                    children:(0,a.jsxs)("tr",{
                                        children:[
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"Tgl Efektif"}),
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"Dari Satker"}),
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"Ke Satker"}),
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"No. Surat"}),
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"Dimutasi Oleh"})
                                        ]
                                    })
                                }),
                                (0,a.jsx)("tbody",{
                                    children:mutHistory.map((m,idx)=>(0,a.jsxs)("tr",{
                                        key:m.id||idx,
                                        style:{borderBottom:"1px solid rgba(255, 255, 255, 0.05)"},
                                        children:[
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem"},children:m.tanggal_efektif ? new Date(m.tanggal_efektif).toLocaleDateString("id-ID") : "-"}),
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem",color:"#94a3b8"},children:m.from_satker_name || "-"}),
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem",fontWeight:600,color:"#38bdf8"},children:m.to_satker_name || "-"}),
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem"},children:m.nomor_surat || "-"}),
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem",color:"#94a3b8"},children:m.mutated_by_name || m.mutated_by || "-"})
                                        ]
                                    }))
                                })
                            ]
                        })
                    })
                ]
            }) : null
        ]
    })
})`;

const codeRev = `,(0,a.jsx)(d.Dialog,{
    header:ed.isOperator ? "Ajukan Penonaktifan / Penghapusan Akun" : (
        eb?.approval_status === "REQUEST_DEACTIVATE" ? "Tinjau Permohonan Penonaktifan Akun" :
        eb?.approval_status === "REQUEST_DELETE" ? "Tinjau Permohonan Hapus Permanen" :
        eb?.approval_status?.startsWith("REQUEST_") ? "Tinjau Permohonan Akun Pengguna" :
        "Hapus Paksa Akun Pengguna"
    ),
    visible:!!eb,
    onHide:()=>eh(null),
    style:{width:"40rem",maxWidth:"96vw"},
    modal:!0,
    footer:eb && (0,a.jsxs)("div",{
        style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:"0.5rem",flexWrap:"wrap"},
        children:[
            (0,a.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>eh(null),disabled:ey}),
            (0,a.jsxs)("div",{
                style:{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},
                children:[
                    ed.isOperator ? (0,a.jsx)(o.Button,{
                        label:"Kirim Permohonan",
                        icon:"pi pi-send",
                        severity:eDelType==="HAPUS"?"danger":"warning",
                        onClick:asOperatorRequest,
                        loading:ey,
                        disabled:!eDelReason.trim()
                    }) : (eb.approval_status?.startsWith("REQUEST_") ? (0,a.jsxs)(a.Fragment,{
                        children:[
                            (0,a.jsx)(o.Button,{label:"Tolak (Aktifkan)",severity:"secondary",onClick:()=>asSuperadminReview("REJECT"),loading:ey}),
                            (0,a.jsx)(o.Button,{
                                label:"Alihkan ke Mutasi",
                                icon:"pi pi-sync",
                                severity:"info",
                                onClick:()=>{
                                    let target = eb;
                                    eh(null);
                                    openMutateDialog(target);
                                }
                            }),
                            (0,a.jsx)(o.Button,{
                                label:eb.approval_status === "REQUEST_DELETE" ? "Setujui Hapus Permanen" : "Setujui Nonaktifkan",
                                severity:eb.approval_status === "REQUEST_DELETE" ? "danger" : "warning",
                                icon:eb.approval_status === "REQUEST_DELETE" ? "pi pi-trash" : "pi pi-power-off",
                                onClick:()=>asSuperadminReview(eb.approval_status === "REQUEST_DELETE" ? "APPROVE_DELETE" : "APPROVE_DEACTIVATE"),
                                loading:ey
                            })
                        ]
                    }) : (0,a.jsx)(o.Button,{
                        label:"Hapus Permanen",
                        icon:"pi pi-trash",
                        severity:"danger",
                        onClick:as,
                        loading:ey,
                        disabled:ef.trim().toLowerCase() !== (eb.email || "").trim().toLowerCase()
                    }))
                ]
            })
        ]
    }),
    children:eb && (0,a.jsxs)("div",{
        style:{display:"flex",flexDirection:"column",gap:"0.85rem"},
        children:[
            /* Render Personnel Mini Card */
            renderUserMiniCard(eb),

            /* Content based on Mode */
            ed.isOperator ? (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{
                            display:"flex",
                            gap:"0.6rem",
                            alignItems:"flex-start",
                            background:"rgba(239, 68, 68, 0.1)",
                            border:"1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius:8,
                            padding:"0.75rem 0.9rem"
                        },
                        children:[
                            (0,a.jsx)(A.ShieldAlert,{size:20,style:{color:"#ef4444",flex:"0 0 auto",marginTop:"0.1rem"}}),
                            (0,a.jsxs)("div",{
                                style:{fontSize:"0.82rem",color:"#fca5a5",lineHeight:1.45},
                                children:[
                                    "Sebagai Operator, tindakan ini akan mengajukan permohonan ke Superadmin untuk akun ",
                                    (0,a.jsx)("strong",{style:{color:"#ffffff"},children:eb.name}),
                                    ". ",
                                    (0,a.jsx)("strong",{style:{color:"#ffffff"},children:"Akun akan langsung dibekukan (nonaktif) sementara"}),
                                    " demi keamanan."
                                ]
                            })
                        ]
                    }),
                    (0,a.jsx)(ee,{
                        label:"Jenis Permohonan",
                        children:(0,a.jsx)(u.Dropdown,{
                            value:eDelType,
                            options:[
                                {label:"Ajukan Penonaktifan Akun (Disarankan jika mutasi luar reskrim, cuti, dinas lain)",value:"NONAKTIF"},
                                {label:"Ajukan Penghapusan Permanen (Hanya jika salah buat akun / duplikat)",value:"HAPUS"}
                            ],
                            onChange:e=>eDelTypeSet(e.value),
                            style:{width:"100%"}
                        })
                    }),
                    (0,a.jsx)(ee,{
                        label:"Alasan / Keterangan Pengajuan (wajib) *",
                        children:(0,a.jsx)(n.InputTextarea,{
                            value:eDelReason,
                            onChange:e=>eDelReasonSet(e.target.value),
                            rows:3,
                            style:{width:"100%"},
                            placeholder:"Tuliskan alasan lengkap, misal: personil mutasi dinas keluar jajaran Reserse, pensiun, dsb.",
                            autoFocus:!0
                        })
                    }),
                    eDelReason.toLowerCase().includes("mutasi") ? (0,a.jsxs)("div",{
                        style:{
                            background:"rgba(2, 132, 199, 0.12)",
                            border:"1px solid rgba(56, 189, 248, 0.35)",
                            borderRadius:8,
                            padding:"0.65rem 0.85rem",
                            fontSize:"0.78rem",
                            color:"#38bdf8",
                            display:"flex",
                            flexDirection:"column",
                            gap:"0.35rem"
                        },
                        children:[
                            (0,a.jsx)("div",{style:{fontWeight:700},children:"💡 Terdeteksi Alasan Mutasi Penugasan"}),
                            (0,a.jsx)("div",{children:"Jika personil berpindah satker atau keluar fungsi Reskrim, disarankan menggunakan fitur Mutasi Satker agar historical LP personil tetap aman dan akun tidak terhapus."}),
                            (0,a.jsx)(o.Button,{
                                label:"Beralih ke Form Mutasi Satker",
                                icon:"pi pi-sync",
                                size:"small",
                                severity:"info",
                                style:{alignSelf:"flex-start"},
                                onClick:()=>{
                                    let target = eb;
                                    eh(null);
                                    openMutateDialog(target);
                                }
                            })
                        ]
                    }) : null
                ]
            }) : (eb.approval_status === "REQUEST_DEACTIVATE" ? (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{
                            display:"flex",
                            gap:"0.6rem",
                            alignItems:"flex-start",
                            background:"rgba(245, 158, 11, 0.12)",
                            border:"1px solid rgba(245, 158, 11, 0.35)",
                            borderRadius:8,
                            padding:"0.75rem 0.9rem"
                        },
                        children:[
                            (0,a.jsx)("i",{className:"pi pi-power-off",style:{fontSize:"1.1rem",color:"#f59e0b",flex:"0 0 auto",marginTop:"0.15rem"}}),
                            (0,a.jsxs)("div",{
                                style:{fontSize:"0.82rem",color:"#fef3c7",lineHeight:1.45},
                                children:[
                                    "Operator telah mengajukan permohonan ",
                                    (0,a.jsx)("strong",{style:{color:"#fbbf24"},children:"PENONAKTIFAN AKUN"}),
                                    " untuk ",
                                    (0,a.jsx)("strong",{style:{color:"#ffffff"},children:eb.name}),
                                    ". Akun telah dibekukan sementara menunggu persetujuan Anda."
                                ]
                            })
                        ]
                    }),
                    (0,a.jsxs)("div",{
                        style:{
                            padding:"0.75rem 0.9rem",
                            background:"rgba(255, 255, 255, 0.03)",
                            borderRadius:8,
                            border:"1px solid rgba(255, 255, 255, 0.08)",
                            fontSize:"0.82rem"
                        },
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.35rem"},
                                children:[
                                    (0,a.jsx)("div",{style:{fontWeight:700,color:"#cbd5e1"},children:"Catatan / Alasan dari Pengaju:"}),
                                    eb.deactivated_at ? (0,a.jsxs)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[(0,a.jsx)("i",{className:"pi pi-calendar",style:{fontSize:"0.7rem"}}),formatIndoDateStr(eb.deactivated_at)]}) : null
                                ]
                            }),
                            (0,a.jsx)("div",{
                                style:{
                                    color:"var(--cas-text, #f8fafc)",
                                    background:"rgba(0, 0, 0, 0.15)",
                                    borderLeft:"3px solid #f59e0b",
                                    padding:"0.5rem 0.75rem",
                                    borderRadius:"0 6px 6px 0",
                                    lineHeight:1.5,
                                    whiteSpace:"pre-wrap"
                                },
                                children:eb.deactivation_reason || "Tidak ada keterangan tertulis."
                            }),
                            (0,a.jsxs)("div",{
                                style:{
                                    marginTop:"0.65rem",
                                    padding:"0.65rem 0.85rem",
                                    background:"rgba(2, 132, 199, 0.1)",
                                    borderRadius:8,
                                    border:"1px solid rgba(56, 189, 248, 0.3)",
                                    display:"flex",
                                    flexDirection:"column",
                                    gap:"0.45rem"
                                },
                                children:[
                                    (0,a.jsxs)("div",{
                                        style:{fontSize:"0.78rem",color:"#38bdf8",lineHeight:1.45},
                                        children:[
                                            (0,a.jsx)("strong",{children:"💡 Opsi Alihkan ke Mutasi: "}),
                                            "Jika personil ini pindah tugas atau mutasi kesatuan kerja, alihkan langsung ke proses Mutasi Satker agar data usulan terisi otomatis dan historical LP tetap terjaga."
                                        ]
                                    }),
                                    (0,a.jsx)(o.Button,{
                                        label:"Alihkan ke Form Mutasi Satker",
                                        icon:"pi pi-sync",
                                        size:"small",
                                        severity:"info",
                                        style:{alignSelf:"flex-start",whiteSpace:"nowrap"},
                                        onClick:()=>{
                                            let target = eb;
                                            eh(null);
                                            openMutateDialog(target);
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }) : (eb.approval_status === "REQUEST_DELETE" ? (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{
                            display:"flex",
                            gap:"0.6rem",
                            alignItems:"flex-start",
                            background:"rgba(239, 68, 68, 0.12)",
                            border:"1px solid rgba(239, 68, 68, 0.4)",
                            borderRadius:8,
                            padding:"0.75rem 0.9rem"
                        },
                        children:[
                            (0,a.jsx)(A.ShieldAlert,{size:22,style:{color:"#ef4444",flex:"0 0 auto",marginTop:"0.1rem"}}),
                            (0,a.jsxs)("div",{
                                style:{fontSize:"0.82rem",color:"#fca5a5",lineHeight:1.45},
                                children:[
                                    "Operator telah mengajukan ",
                                    (0,a.jsx)("strong",{style:{color:"#ef4444"},children:"PENGHAPUSAN PERMANEN"}),
                                    " untuk akun ",
                                    (0,a.jsx)("strong",{style:{color:"#ffffff"},children:eb.name}),
                                    ". Jika disetujui, akun ini akan dihapus permanen dari sistem dan seluruh datanya tidak dapat dikembalikan."
                                ]
                            })
                        ]
                    }),
                    (0,a.jsxs)("div",{
                        style:{
                            padding:"0.75rem 0.9rem",
                            background:"rgba(255, 255, 255, 0.03)",
                            borderRadius:8,
                            border:"1px solid rgba(255, 255, 255, 0.08)",
                            fontSize:"0.82rem"
                        },
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.35rem"},
                                children:[
                                    (0,a.jsx)("div",{style:{fontWeight:700,color:"#cbd5e1"},children:"Alasan Pengajuan Hapus:"}),
                                    eb.deactivated_at ? (0,a.jsxs)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[(0,a.jsx)("i",{className:"pi pi-calendar",style:{fontSize:"0.7rem"}}),formatIndoDateStr(eb.deactivated_at)]}) : null
                                ]
                            }),
                            (0,a.jsx)("div",{
                                style:{
                                    color:"var(--cas-text, #f8fafc)",
                                    background:"rgba(0, 0, 0, 0.15)",
                                    borderLeft:"3px solid #ef4444",
                                    padding:"0.5rem 0.75rem",
                                    borderRadius:"0 6px 6px 0",
                                    lineHeight:1.5,
                                    whiteSpace:"pre-wrap"
                                },
                                children:eb.deactivation_reason || "Tidak ada keterangan tertulis."
                            }),
                            (0,a.jsxs)("div",{
                                style:{
                                    marginTop:"0.65rem",
                                    padding:"0.65rem 0.85rem",
                                    background:"rgba(2, 132, 199, 0.1)",
                                    borderRadius:8,
                                    border:"1px solid rgba(56, 189, 248, 0.3)",
                                    display:"flex",
                                    flexDirection:"column",
                                    gap:"0.45rem"
                                },
                                children:[
                                    (0,a.jsxs)("div",{
                                        style:{fontSize:"0.78rem",color:"#38bdf8",lineHeight:1.45},
                                        children:[
                                            (0,a.jsx)("strong",{children:"💡 Alasan Terkait Mutasi / Alih Tugas? "}),
                                            "Jika personil hanya pindah dinas atau rotasi, jangan dihapus permanen! Alihkan ke Mutasi Satker agar arsip LP personil tetap aman."
                                        ]
                                    }),
                                    (0,a.jsx)(o.Button,{
                                        label:"Alihkan ke Form Mutasi Satker",
                                        icon:"pi pi-sync",
                                        size:"small",
                                        severity:"info",
                                        style:{alignSelf:"flex-start",whiteSpace:"nowrap"},
                                        onClick:()=>{
                                            let target = eb;
                                            eh(null);
                                            openMutateDialog(target);
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }) : (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{
                            display:"flex",
                            gap:"0.6rem",
                            alignItems:"flex-start",
                            background:"rgba(239, 68, 68, 0.12)",
                            border:"1px solid rgba(239, 68, 68, 0.35)",
                            borderRadius:8,
                            padding:"0.75rem 0.9rem"
                        },
                        children:[
                            (0,a.jsx)(A.ShieldAlert,{size:20,style:{color:"#ef4444",flex:"0 0 auto",marginTop:"0.1rem"}}),
                            (0,a.jsxs)("div",{
                                style:{fontSize:"0.82rem",color:"#fca5a5"},
                                children:[
                                    "Akun ",
                                    (0,a.jsx)("strong",{style:{color:"#ffffff"},children:eb.name}),
                                    " (",
                                    eb.email,
                                    ") akan ",
                                    (0,a.jsx)("strong",{style:{color:"#ffffff"},children:"dihapus permanen"}),
                                    " dari database sistem. Tindakan ini tidak dapat dibatalkan atau dipulihkan."
                                ]
                            })
                        ]
                    }),
                    (0,a.jsx)(ee,{
                        label:("Ketik email akun untuk konfirmasi: " + eb.email),
                        children:(0,a.jsx)(l.InputText,{
                            id:"user-edit-email",
                            name:"edit_email",
                            value:ef,
                            onChange:e=>ek(e.target.value),
                            style:{width:"100%"},
                            placeholder:eb.email,
                            autoFocus:!0
                        })
                    })
                ]
            })))
        ]
    })
})`;

// Assemble in reverse order so indexes don't shift!
// 1. Replace Review Dialog (sRev to eRev)
let patched = original.substring(0, sRev) + codeRev + original.substring(eRev);

// 2. Replace Mutasi Dialog (sMut to eMut)
patched = patched.substring(0, sMut) + codeMut + patched.substring(eMut);

// 3. Replace openMutateDialog (s1 to e1)
patched = patched.substring(0, s1) + code1 + patched.substring(e1);

fs.writeFileSync('scratch/test_user_page.js', patched, 'utf8');
console.log('Saved to scratch/test_user_page.js, running node --check...');

try {
    execSync('node --check scratch/test_user_page.js', { stdio: 'inherit' });
    console.log('>>> SYNTAX CHECK PASSED! <<<');
} catch (err) {
    console.error('>>> SYNTAX CHECK FAILED! <<<', err);
    process.exit(1);
}
