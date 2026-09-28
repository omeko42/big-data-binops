import { runFE } from './fe_exec.mjs';

const cmd = `
docker exec bdb-web node -e '
  const fs = require("fs");

  const c_layout = fs.readFileSync("/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js", "utf8");
  const c_layout_ssr = fs.readFileSync("/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js", "utf8");
  const c_dash = fs.readFileSync("/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js", "utf8");
  const c_35hk = fs.readFileSync("/usr/src/app/.next/static/chunks/35hkjujo3bzza.js", "utf8");
  const c_3def = fs.readFileSync("/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js", "utf8");
  const c_3def_ssr = fs.readFileSync("/usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js", "utf8");
  const c_3pp = fs.readFileSync("/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js", "utf8");

  const results = {
    layout_has_pengumuman_breadcrumb: c_layout.includes("pengumuman:\\\"Kelola feed\\\""),
    layout_ssr_has_pengumuman_breadcrumb: c_layout_ssr.includes("pengumuman:\\\"Kelola feed\\\""),
    dash_has_theme_aware_feed: c_dash.includes("Ruang Kolaborasi Terkini") && c_dash.includes("var(--text-color, #0f172a)"),
    kelola_feed_has_clean_textarea: c_35hk.includes("p-inputtextarea") && c_35hk.includes("var(--surface-input"),
    profile_has_no_linkedin_3200: !c_3def.includes("3.200+ koneksi"),
    profile_has_police_actions: c_3def.includes("Edit Biodata") && c_3def.includes("Keamanan Akun"),
    profile_ssr_has_no_linkedin_3200: !c_3def_ssr.includes("3.200+ koneksi"),
    broadcaster_modal_theme_aware: c_3pp.includes("previewUser.name") && c_3pp.includes("var(--text-color, #0f172a)")
  };

  console.log(JSON.stringify(results, null, 2));
'
`;

console.log(runFE(cmd));
