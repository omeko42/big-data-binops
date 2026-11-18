(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CoserseChatModule = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var DISCLAIMER =
        'Coserse dapat melakukan kesalahan. Hanya untuk internal dan tolong periksa ulang hasil pekerjaan.';

    var POWERED_BY_NOTE = 'Powered by Qwen 2.5';
    var STORAGE_KEY = 'coserse_sessions_v3';
    var PREFS_KEY = 'coserse_prefs_v1';

    var TIER_OPTIONS = [
        { id: 'low', label: 'Low', modelId: 'coserse:0.5b-sandbox' },
        { id: 'medium', label: 'Medium', modelId: 'coserse:1.5b-balance' },
        { id: 'high', label: 'High', modelId: 'coserse:1.0' }
    ];

    var MODEL_OPTIONS = [
        {
            id: 'coserse:1.0',
            label: 'Coserse 1.0',
            pillLabel: 'Coserse 1.0',
            badge: 'Server Engine'
        }
    ];

    var DOC_TYPE_OPTIONS = [
        { code: 'SP_LIDIK', label: 'Sprin Penyelidikan (SP_LIDIK -> LIDIK)', status: 'LIDIK' },
        { code: 'SPDP', label: 'SPDP (SPDP -> SPDP)', status: 'SPDP' },
        { code: 'SP_SIDIK', label: 'Sprin Penyidikan (SP_SIDIK -> SIDIK)', status: 'SIDIK' },
        { code: 'TAHAP_1', label: 'Berkas Tahap I (TAHAP_1 -> TAHAP_I)', status: 'TAHAP_I' },
        { code: 'P21', label: 'Pemberitahuan Lengkap P-21 (P21 -> P21)', status: 'P21' },
        { code: 'TAHAP_2', label: 'Tahap II Tersangka & BB (TAHAP_2 -> TAHAP_II / CC)', status: 'TAHAP_II' },
        { code: 'SP3', label: 'Penghentian Penyidikan SP3 (SP3 -> SP3 / CC)', status: 'SP3' },
        { code: 'SP2_LIDIK', label: 'Penghentian Penyelidikan (SP2_LIDIK -> SP2_LID / CC)', status: 'SP2_LID' }
    ];

    // Standar Iconing Profesional: 100% SVG Outline Minimalis (Zero Emoji Alay)
    var ICONS = {
        bdbMonogram:
            '<svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M24 4L40 10.5V22.5C40 32.8 33.1 40.9 24 44C14.9 40.9 8 32.8 8 22.5V10.5L24 4Z" />' +
            '<path d="M24 14L26.6 21.4L34 24L26.6 26.6L24 34L21.4 26.6L14 24L21.4 21.4L24 14Z" />' +
            '</svg>',
        spark:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3z" />' +
            '</svg>',
        newChat:
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 20h9" />' +
            '<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />' +
            '</svg>',
        trash:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="3 6 5 6 21 6" />' +
            '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />' +
            '</svg>',
        paperclip:
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />' +
            '</svg>',
        arrowUp:
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="12" y1="19" x2="12" y2="5" />' +
            '<polyline points="5 12 12 5 19 12" />' +
            '</svg>',
        arrowRight:
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="5" y1="12" x2="19" y2="12" />' +
            '<polyline points="12 5 19 12 12 19" />' +
            '</svg>',
        settings:
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="12" cy="12" r="3" />' +
            '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />' +
            '</svg>',
        menu:
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="3" y1="6" x2="21" y2="6" />' +
            '<line x1="3" y1="12" x2="21" y2="12" />' +
            '<line x1="3" y1="18" x2="21" y2="18" />' +
            '</svg>',
        chevronDown:
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="6 9 12 15 18 9" />' +
            '</svg>',
        chevronRight:
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="9 18 15 12 9 6" />' +
            '</svg>',
        check:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="20 6 9 17 4 12" />' +
            '</svg>',
        usageClock:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="12" cy="12" r="9" />' +
            '<polyline points="12 7 12 12 15 14" />' +
            '</svg>',
        fileText:
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />' +
            '<polyline points="14 2 14 8 20 8" />' +
            '<line x1="16" y1="13" x2="8" y2="13" />' +
            '<line x1="16" y1="17" x2="8" y2="17" />' +
            '</svg>',
        search:
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="11" cy="11" r="8" />' +
            '<line x1="21" y1="21" x2="16.65" y2="16.65" />' +
            '</svg>',
        scale:
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 3v18" />' +
            '<path d="M5 7h14" />' +
            '<path d="M3 14l2-7 2 7a2 2 0 0 1-4 0z" />' +
            '<path d="M17 14l2-7 2 7a2 2 0 0 1-4 0z" />' +
            '</svg>',
        edit:
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 20h9" />' +
            '<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />' +
            '</svg>',
        close:
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="18" y1="6" x2="6" y2="18" />' +
            '<line x1="6" y1="6" x2="18" y2="18" />' +
            '</svg>',
        uploadCloud:
            '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="16 16 12 12 8 16" />' +
            '<line x1="12" y1="12" x2="12" y2="21" />' +
            '<path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />' +
            '</svg>',
        radioOn:
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="12" cy="12" r="9" />' +
            '<circle cx="12" cy="12" r="4" fill="currentColor" />' +
            '</svg>',
        radioOff:
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="12" cy="12" r="9" />' +
            '</svg>',
        sliders:
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />' +
            '<line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />' +
            '<line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />' +
            '<line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />' +
            '</svg>',
        cpu:
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />' +
            '<line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />' +
            '<line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />' +
            '<line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />' +
            '<line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />' +
            '</svg>',
        shieldLock:
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />' +
            '</svg>',
        bookOpen:
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />' +
            '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />' +
            '</svg>',
        alertTriangle:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />' +
            '<line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />' +
            '</svg>',
        pin:
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 17v5" />' +
            '<path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />' +
            '</svg>',
        moreVertical:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />' +
            '</svg>',
        copy:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />' +
            '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />' +
            '</svg>',
        archive:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="21 8 21 21 3 21 3 8" />' +
            '<rect x="1" y="3" width="22" height="5" />' +
            '<line x1="10" y1="12" x2="14" y2="12" />' +
            '</svg>',
        thumbsUp:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />' +
            '</svg>',
        thumbsDown:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />' +
            '</svg>',
        stopSquare:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">' +
            '<rect x="6" y="6" width="12" height="12" rx="2.5" />' +
            '</svg>',
        refresh:
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="23 4 23 10 17 10" />' +
            '<polyline points="1 20 1 14 7 14" />' +
            '<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />' +
            '</svg>',
        arrowDown:
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="12" y1="5" x2="12" y2="19" />' +
            '<polyline points="19 12 12 19 5 12" />' +
            '</svg>'
    };

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function stripTrailingDisclaimer(text) {
        var s = String(text || '').trim();
        if (!s) return '';
        var escaped = DISCLAIMER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var anyRe = new RegExp('(?:\\n|>|\\s|_|-)*' + escaped + '(?:\\s|_)*', 'gi');
        return s.replace(anyRe, '').trim();
    }

    function formatRelativeTimeId(ts) {
        if (!ts) return 'Baru saja';
        var diffMs = Date.now() - Number(ts);
        if (!isFinite(diffMs) || diffMs < 60000) return 'Baru saja';
        var mins = Math.floor(diffMs / 60000);
        if (mins < 60) return mins + ' mnt lalu';
        var hours = Math.floor(mins / 60);
        if (hours < 24) return hours + ' jam lalu';
        var days = Math.floor(hours / 24);
        return days + ' hari lalu';
    }

    function formatInlineMarkdown(escapedLine) {
        var s = String(escapedLine || '');
        s = s.replace(/`([^`]+)`/g, '<code class="cs-inline-code">$1</code>');
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
        return s;
    }

    function stabilizeStreamingMarkdown(text, isFinal) {
        var s = String(text || '');
        if (isFinal || !s) return s;
        var fenceMatches = s.match(/```/g);
        if (fenceMatches && fenceMatches.length % 2 === 1) {
            s += '\n```';
            return s;
        }
        var boldMatches = s.match(/\*\*/g);
        if (boldMatches && boldMatches.length % 2 === 1) {
            s += '**';
        }
        var lastLine = s.split(/\r?\n/).pop() || '';
        var inlineTicks = lastLine.match(/`/g);
        if (inlineTicks && inlineTicks.length % 2 === 1) {
            s += '`';
        }
        return s;
    }

    function formatSimpleMarkdown(text) {
        var raw = String(text || '');
        if (!raw.trim()) return '';
        var codeBlocks = [];
        var withTokens = raw.replace(/```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g, function (_m, lang, code) {
            var idx = codeBlocks.length;
            var langLabel = escapeHtml((lang || 'kode').trim().toUpperCase());
            var safeCode = escapeHtml(String(code || '').replace(/\r?\n$/, ''));
            codeBlocks.push(
                '<div class="cs-code-block">' +
                    '<div class="cs-code-head">' +
                    '<span class="cs-code-lang">' + langLabel + '</span>' +
                    '<button type="button" class="cs-code-copy-btn" data-code-copy="true" title="Salin kode">' +
                    ICONS.copy +
                    '<span>Salin</span></button>' +
                    '</div>' +
                    '<pre class="cs-code-pre"><code>' + safeCode + '</code></pre>' +
                    '</div>'
            );
            return '@@CS_CODE_BLOCK_' + idx + '@@';
        });

        var isTableSep = function (ln) {
            var t = String(ln || '').trim();
            return /^\|[\s|:-]*-{2,}[\s|:-]*$/.test(t) && t.indexOf('|') !== -1;
        };
        var isTableRow = function (ln) {
            var t = String(ln || '').trim();
            if (!t || t.charAt(0) !== '|') return false;
            return t.split('|').length >= 3;
        };
        var parseTableCells = function (ln) {
            var t = String(ln || '').trim();
            if (t.charAt(0) === '|') t = t.slice(1);
            if (t.slice(-1) === '|') t = t.slice(0, -1);
            return t.split('|').map(function (c) {
                return formatInlineMarkdown(escapeHtml(c.trim()));
            });
        };

        var lines = withTokens.split(/\r?\n/);
        var out = [];
        var i = 0;
        while (i < lines.length) {
            var line = lines[i];
            var trimmed = line.trim();

            if (/^@@CS_CODE_BLOCK_(\d+)@@$/.test(trimmed)) {
                var mCode = trimmed.match(/^@@CS_CODE_BLOCK_(\d+)@@$/);
                out.push(codeBlocks[Number(mCode[1])] || '');
                i++;
                continue;
            }

            if (!trimmed) {
                i++;
                continue;
            }

            if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
                out.push('<hr class="cs-md-hr" />');
                i++;
                continue;
            }

            if (/^#{2,4}\s+/.test(trimmed)) {
                var hMatch = trimmed.match(/^(#{2,4})\s+(.*)$/);
                var hLevel = hMatch[1].length;
                var hText = formatInlineMarkdown(escapeHtml(hMatch[2]));
                out.push('<h' + hLevel + ' class="cs-md-h' + hLevel + '">' + hText + '</h' + hLevel + '>');
                i++;
                continue;
            }

            if (
                isTableRow(trimmed) &&
                i + 1 < lines.length &&
                isTableSep(lines[i + 1])
            ) {
                var headerCells = parseTableCells(trimmed);
                i += 2;
                var bodyRows = [];
                while (i < lines.length) {
                    var rTrim = lines[i].trim();
                    if (!isTableRow(rTrim) || isTableSep(rTrim)) break;
                    bodyRows.push(parseTableCells(rTrim));
                    i++;
                }
                var tblHtml =
                    '<div class="cs-md-table-wrap"><table class="cs-md-table"><thead><tr>' +
                    headerCells
                        .map(function (hc) {
                            return '<th>' + hc + '</th>';
                        })
                        .join('') +
                    '</tr></thead><tbody>' +
                    bodyRows
                        .map(function (row) {
                            return (
                                '<tr>' +
                                headerCells
                                    .map(function (_hc, ci) {
                                        return '<td>' + (row[ci] != null ? row[ci] : '') + '</td>';
                                    })
                                    .join('') +
                                '</tr>'
                            );
                        })
                        .join('') +
                    '</tbody></table></div>';
                out.push(tblHtml);
                continue;
            }

            if (/^>\s?/.test(trimmed)) {
                var quoteLines = [];
                while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
                    quoteLines.push(formatInlineMarkdown(escapeHtml(lines[i].trim().replace(/^>\s?/, ''))));
                    i++;
                }
                out.push('<blockquote class="cs-md-quote">' + quoteLines.join('<br/>') + '</blockquote>');
                continue;
            }

            if (/^[-*•]\s+/.test(trimmed)) {
                var ulItems = [];
                while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
                    ulItems.push('<li>' + formatInlineMarkdown(escapeHtml(lines[i].trim().replace(/^[-*•]\s+/, ''))) + '</li>');
                    i++;
                }
                out.push('<ul class="cs-md-list cs-md-ul">' + ulItems.join('') + '</ul>');
                continue;
            }

            if (/^\d+[.)]\s+/.test(trimmed)) {
                var olItems = [];
                while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
                    olItems.push('<li>' + formatInlineMarkdown(escapeHtml(lines[i].trim().replace(/^\d+[.)]\s+/, ''))) + '</li>');
                    i++;
                }
                out.push('<ol class="cs-md-list cs-md-ol">' + olItems.join('') + '</ol>');
                continue;
            }

            var paraLines = [];
            while (
                i < lines.length &&
                lines[i].trim() &&
                !/^@@CS_CODE_BLOCK_(\d+)@@$/.test(lines[i].trim()) &&
                !/^#{2,4}\s+/.test(lines[i].trim()) &&
                !/^[-*•]\s+/.test(lines[i].trim()) &&
                !/^\d+[.)]\s+/.test(lines[i].trim()) &&
                !/^>\s?/.test(lines[i].trim()) &&
                !/^---+$/.test(lines[i].trim()) &&
                !(
                    isTableRow(lines[i]) &&
                    i + 1 < lines.length &&
                    isTableSep(lines[i + 1])
                )
            ) {
                var lnEsc = formatInlineMarkdown(escapeHtml(lines[i]));
                lnEsc = lnEsc.replace(/@@CS_CODE_BLOCK_(\d+)@@/g, function (_m, cIdx) {
                    return codeBlocks[Number(cIdx)] || '';
                });
                paraLines.push(lnEsc);
                i++;
            }
            if (paraLines.length) {
                out.push('<p class="cs-md-p">' + paraLines.join('<br/>') + '</p>');
            }
        }
        return out.join('');
    }

    function createRingSvg(percentRemaining, colorHex, trackColor) {
        var pct = Math.max(0, Math.min(100, Number(percentRemaining) || 0));
        var r = 8;
        var c = 2 * Math.PI * r;
        var offset = c - (pct / 100) * c;
        return (
            '<svg class="cs-ring" width="22" height="22" viewBox="0 0 20 20">' +
            '  <circle cx="10" cy="10" r="' +
            r +
            '" fill="none" stroke="' +
            (trackColor || 'rgba(255,255,255,0.16)') +
            '" stroke-width="2.4"/>' +
            '  <circle cx="10" cy="10" r="' +
            r +
            '" fill="none" stroke="' +
            colorHex +
            '" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="' +
            c.toFixed(2) +
            '" stroke-dashoffset="' +
            offset.toFixed(2) +
            '" transform="rotate(-90 10 10)"/>' +
            '</svg>'
        );
    }

    function makeSessionId() {
        return 'sess-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    }

    function parseHandoverFromUrl() {
        try {
            if (typeof window === 'undefined' || !window.location || !window.location.search) return null;
            var sp = new URLSearchParams(window.location.search);
            var prompt = sp.get('task_prompt') || sp.get('init_prompt') || sp.get('prompt') || '';
            var taskRef = sp.get('task_ref') || '';
            prompt = String(prompt || '').trim();
            if (!prompt) return null;
            return { prompt: prompt, taskRef: String(taskRef || '').trim() };
        } catch (_e) {
            return null;
        }
    }

    function clearHandoverQueryParams() {
        try {
            if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
                var url = new URL(window.location.href);
                url.searchParams.delete('task_prompt');
                url.searchParams.delete('init_prompt');
                url.searchParams.delete('prompt');
                url.searchParams.delete('task_ref');
                window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
            }
        } catch (_e) {
            // ignore
        }
    }

    function mountCoserseChat(container, opts) {
        if (!container) return null;
        var config = opts || {};
        var apiBase = String(config.apiBase || '/api/bdb/coserse').replace(/\/$/, '');
        var activeUser = config.user || { username: 'personel', role_bdb: 'operator' };
        var activeRole = String(
            activeUser.role_bdb || (activeUser.role && (activeUser.role.role_name || activeUser.role.name)) || 'operator'
        )
            .trim()
            .toLowerCase();
        var isTestingReadOnly = Boolean(config.readOnly) || activeRole === 'testing';
        var isCompactViewport = function () {
            return typeof window !== 'undefined' && window.innerWidth <= 992;
        };

        function currentHandle() {
            return '@' + String(activeUser.username || 'personel').replace(/^@+/, '');
        }

        function buildSeededHistory() {
            return [
                {
                    id: String(config.sessionId || makeSessionId()),
                    title: 'Obrolan Baru',
                    updatedAt: Date.now(),
                    messages: [],
                    messagesLoaded: true
                }
            ];
        }

        function loadInitialSessions() {
            try {
                if (typeof localStorage !== 'undefined') {
                    var raw = localStorage.getItem(STORAGE_KEY);
                    if (raw) {
                        var parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) {
                            var cleaned = parsed.filter(function (s) {
                                return s && s.id && s.id !== 'sample-hist-nik' && s.id !== 'sample-hist-lp';
                            });
                            if (cleaned.length > 0) return cleaned;
                        }
                    }
                }
            } catch (_e) {
                // fallback
            }
            return buildSeededHistory();
        }

        function loadInitialPrefs() {
            var defaults = { responseStyle: 'tactical', sendOnEnter: true, showQuickPrompts: true, selectedTier: 'low' };
            try {
                if (typeof localStorage !== 'undefined') {
                    var raw = localStorage.getItem(PREFS_KEY);
                    if (raw) {
                        var parsed = JSON.parse(raw);
                        return Object.assign(defaults, parsed || {});
                    }
                }
            } catch (_e) {
                // ignore
            }
            return defaults;
        }

        function savePrefs(prefs) {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
                }
            } catch (_e) {
                // ignore
            }
        }

        var initialPrefs = loadInitialPrefs();
        var initialTier =
            TIER_OPTIONS.find(function (t) {
                return t.id === initialPrefs.selectedTier;
            }) || TIER_OPTIONS[0];

        var handover = parseHandoverFromUrl();
        var sessions = loadInitialSessions();

        if (handover && handover.prompt) {
            var handoverSess = {
                id: makeSessionId(),
                title: handover.prompt.slice(0, 28) + (handover.prompt.length > 28 ? '...' : ''),
                updatedAt: Date.now(),
                handoverRef: handover.taskRef || 'obrolan-cepat',
                messages: []
            };
            sessions.unshift(handoverSess);
        }

        var state = {
            sessions: sessions,
            activeSessionId: sessions[0].id,
            selectedModel: MODEL_OPTIONS[0],
            selectedTier: initialTier,
            quota: null,
            health: null,
            desktopSidebarOpen: true,
            mobileDrawerOpen: false,
            popoverOpen: false,
            tierFlyoutOpen: false,
            usageFlyoutOpen: false,
            settingsOpen: false,
            settingsTab: 'general',
            openMenuSessionId: null,
            editingSessionId: null,
            showArchived: false,
            pendingConfirmAction: null,
            prefs: initialPrefs,
            pendingAttachment: null,
            activeJobs: {},
            loadingTimer: null
        };

        function getActiveJob(sessionId) {
            var sid = sessionId || state.activeSessionId;
            return (sid && state.activeJobs && state.activeJobs[sid]) || null;
        }

        function isSessionBusy(sessionId) {
            var job = getActiveJob(sessionId);
            return Boolean(job && (job.busy || job.streaming));
        }

        function beginSessionJob(sessionId, opts) {
            if (!sessionId) return null;
            var o = opts || {};
            var job = {
                sessionId: sessionId,
                busy: o.busy !== false,
                streaming: Boolean(o.streaming),
                queueStatusText: o.queueStatusText || null,
                startedAt: Date.now(),
                elapsedSec: 0,
                abortController: o.abortController || null,
                streamRafId: 0,
                lastStreamRenderAt: 0,
                pendingStreamMsg: null
            };
            state.activeJobs[sessionId] = job;
            ensureLoadingTimerRunning();
            return job;
        }

        function endSessionJob(sessionId) {
            var job = state.activeJobs[sessionId];
            if (job && job.streamRafId && typeof cancelAnimationFrame === 'function') {
                try { cancelAnimationFrame(job.streamRafId); } catch (_e) {}
            }
            delete state.activeJobs[sessionId];
            maybeStopLoadingTimer();
        }

        function persistSessions() {
            try {
                if (typeof localStorage !== 'undefined') {
                    var lean = state.sessions.slice(0, 30).map(function (s) {
                        return {
                            id: s.id,
                            title: s.title,
                            updatedAt: s.updatedAt,
                            pinned: Boolean(s.pinned),
                            archived: Boolean(s.archived),
                            handoverRef: s.handoverRef || undefined,
                            messages: (s.messages || []).slice(-30).map(function (m) {
                                var copy = Object.assign({}, m);
                                if (copy.imagePreview && copy.imagePreview.length > 60000) {
                                    copy.imagePreview = null;
                                }
                                return copy;
                            })
                        };
                    });
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(lean));
                }
            } catch (_e) {
                // ignore quota errors
            }
        }

        function getActiveSession() {
            var found = state.sessions.find(function (s) {
                return s.id === state.activeSessionId;
            });
            if (!found) {
                found = state.sessions[0];
                if (found) state.activeSessionId = found.id;
            }
            return found;
        }

        function getHeaders(isJson) {
            var h = {};
            if (isJson) h['Content-Type'] = 'application/json';
            if (activeUser && activeUser.id) h['x-sandbox-user-id'] = String(activeUser.id);
            if (activeUser && activeUser.role_bdb) h['x-sandbox-role'] = String(activeUser.role_bdb);
            var token = config.getToken
                ? config.getToken()
                : (function () {
                    if (typeof localStorage === 'undefined') return '';
                    var t = localStorage.getItem('auth.access_token') || localStorage.getItem('token') || '';
                    if (!t) {
                        try {
                            var authObj = JSON.parse(localStorage.getItem('auth') || 'null');
                            if (authObj && authObj.access_token) t = authObj.access_token;
                        } catch (_e) {}
                    }
                    return t;
                })();
            if (token) h['Authorization'] = 'Bearer ' + token;
            return h;
        }

        container.innerHTML =
            '<div class="cs-app" id="cs-app"' +
            (isTestingReadOnly ? ' data-readonly="true"' : '') +
            '>' +
            '  <div class="cs-drawer-backdrop" id="cs-drawer-backdrop"></div>' +
            '  <aside class="cs-history-sidebar" id="cs-history-sidebar">' +
            '    <div class="cs-sidebar-top">' +
            '      <button type="button" class="cs-new-chat-btn" id="cs-new-chat-btn">' +
            ICONS.newChat +
            '        <span>New Conversation</span>' +
            '      </button>' +
            '    </div>' +
            '    <div class="cs-session-list" id="cs-session-list"></div>' +
            '    <div class="cs-sidebar-bottom">' +
            '      <button type="button" class="cs-settings-btn" id="cs-settings-btn">' +
            ICONS.settings +
            '        <span>Settings</span>' +
            '      </button>' +
            '    </div>' +
            '  </aside>' +
            '  <section class="cs-workspace" id="cs-dropzone">' +
            '    <div class="cs-drop-overlay" id="cs-drop-overlay">' +
            '      <div class="cs-drop-box">' +
            '        <div class="cs-drop-ico">' +
            ICONS.uploadCloud +
            '</div>' +
            '        <div><strong>Lepaskan berkas untuk dianalisis Coserse 1.0</strong></div>' +
            '        <div class="cs-drop-sub">Word (.docx), PDF (.pdf), atau gambar screenshot (RAM Sandbox, zero disk residue)</div>' +
            '      </div>' +
            '    </div>' +
            '    <div class="cs-ws-bar">' +
            '      <div class="cs-ws-left">' +
            '        <button type="button" class="cs-icon-btn" id="cs-toggle-sidebar" title="Buka/Tutup Riwayat Percakapan">' +
            ICONS.menu +
            '</button>' +
            '        <span class="cs-ws-title" id="cs-ws-title">Obrolan Baru</span>' +
            '      </div>' +
            '      <div class="cs-ws-right">' +
            (isTestingReadOnly
                ? '        <span class="cs-readonly-badge" title="Role Testing hanya dapat melihat tanpa input/output atau perubahan data">Mode Lihat (Read-Only) • Role Testing</span>'
                : '') +
            '        <span class="cs-engine-status" id="cs-engine-chip"><span class="cs-dot"></span><span>Menghubungkan</span></span>' +
            '      </div>' +
            '    </div>' +
            '    <div class="cs-banner" id="cs-banner" style="display:none"></div>' +
            '    <div class="cs-thread-scroll" id="cs-thread-scroll">' +
            '      <div class="cs-empty-state" id="cs-empty-state" style="display:none">' +
            '        <div class="cs-empty-logo">' +
            '          <img src="' +
            escapeHtml(config.emblemUrl || '/coserse-assets/logo-reserse-bareskrim.png') +
            '" alt="Reserse Polri" class="cs-empty-emblem" />' +
            '        </div>' +
            '        <h1 class="cs-empty-title" id="cs-empty-title">Halo, ' +
            escapeHtml(currentHandle()) +
            '.</h1>' +
            '        <p class="cs-empty-sub">Mulai chat dengan Copilot Ai untuk anggota Serse kamu</p>' +
            '        <div class="cs-starter-grid" id="cs-starter-grid">' +
            '          <button type="button" class="cs-starter-card" data-starter-prompt="Tolong profiling lengkap dan rangkum keterlibatan lintas LP untuk NIK 3171012345670001">' +
            '            <div class="cs-starter-icon">' + ICONS.search + '</div>' +
            '            <div class="cs-starter-body">' +
            '              <div class="cs-starter-title">Profiling Pihak &amp; NIK</div>' +
            '              <div class="cs-starter-desc">Lacak rekam jejak terlapor, saksi, atau korban lintas Laporan Polisi &amp; Satker.</div>' +
            '            </div>' +
            '          </button>' +
            '          <button type="button" class="cs-starter-card" data-starter-prompt="Bantu analisis LP nyasar, duplikasi perkara, atau ketidaksesuaian satker pada data terbaru">' +
            '            <div class="cs-starter-icon">' + ICONS.alertTriangle + '</div>' +
            '            <div class="cs-starter-body">' +
            '              <div class="cs-starter-title">Audit LP &amp; Anomali Satker</div>' +
            '              <div class="cs-starter-desc">Deteksi LP nyasar, keterlambatan SPDP, atau perkara tunggakan prioritas.</div>' +
            '            </div>' +
            '          </button>' +
            '          <button type="button" class="cs-starter-card" data-starter-action="upload">' +
            '            <div class="cs-starter-icon">' + ICONS.fileText + '</div>' +
            '            <div class="cs-starter-body">' +
            '              <div class="cs-starter-title">Ekstraksi Berkas Mindik</div>' +
            '              <div class="cs-starter-desc">Unggah draf SPDP, Tahap I, Tahap II, atau SP3 (.docx/.pdf) untuk ekstraksi otomatis.</div>' +
            '            </div>' +
            '          </button>' +
            '          <button type="button" class="cs-starter-card" data-starter-prompt="Jelaskan ringkas syarat formil &amp; materiil SPDP, Tahap I, dan Tahap II sesuai Perkap 6/2019 serta konstruksi pasal KUHP Baru (UU 1/2023)">' +
            '            <div class="cs-starter-icon">' + ICONS.scale + '</div>' +
            '            <div class="cs-starter-body">' +
            '              <div class="cs-starter-title">Konsultasi KUHP Baru &amp; Wassidik</div>' +
            '              <div class="cs-starter-desc">Padanan pasal UU 1/2023, SOP administrasi penyidikan, dan gelar perkara.</div>' +
            '            </div>' +
            '          </button>' +
            '        </div>' +
            '      </div>' +
            '      <div class="cs-thread-inner" id="cs-thread"></div>' +
            '    </div>' +
            '    <button type="button" class="cs-scroll-bottom-btn" id="cs-scroll-bottom-btn" title="Gulir ke pesan terbaru" style="display:none">' +
            ICONS.arrowDown +
            '      <span>Ke Bawah</span>' +
            '    </button>' +
            '    <div class="cs-dock">' +
            '      <div class="cs-dock-inner">' +
            '        <div class="cs-pills-row" id="cs-pills">' +
            '          <button type="button" class="cs-pill" data-action="prompt" data-prompt="Tolong profiling dan rangkum keterlibatan NIK 3171012345670001">' +
            ICONS.search +
            '<span>Profiling NIK</span></button>' +
            '          <button type="button" class="cs-pill" data-action="prompt" data-prompt="Bantu analisis LP nyasar atau ketidaksesuaian satker pada data terbaru">' +
            ICONS.search +
            '<span>Analisis LP Nyasar</span></button>' +
            '          <button type="button" class="cs-pill" data-action="upload">' +
            ICONS.fileText +
            '<span>Upload Berkas Mindik</span></button>' +
            '          <button type="button" class="cs-pill" data-action="prompt" data-prompt="Cek status perkara dan riwayat No HP 081299887766">' +
            ICONS.fileText +
            '<span>Cek Status Perkara</span></button>' +
            '          <button type="button" class="cs-pill" data-action="prompt" data-prompt="Jelaskan ringkas syarat alur SPDP, Tahap I, dan Tahap II sesuai Perkap 6/2019">' +
            ICONS.scale +
            '<span>Konsultasi Pasal UU 1/2023</span></button>' +
            '        </div>' +
            '        <div class="cs-attach-chip" id="cs-attach-preview" style="display:none"></div>' +
            '        <div class="cs-capsule">' +
            '          <input type="file" id="cs-file-input" accept=".docx,.pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.xlsx,.xls" style="display:none" />' +
            '          <div class="cs-capsule-input-wrap">' +
            '            <textarea id="cs-input" rows="1" placeholder="Tanya apa saja, tempel tabel/gambar (Ctrl+V), atau seret .docx / .pdf / .csv / .xlsx..."></textarea>' +
            '          </div>' +
            '          <div class="cs-capsule-actions">' +
            '            <div class="cs-capsule-left">' +
            '              <button type="button" class="cs-plus-btn" id="cs-clip-btn" title="Lampirkan Word (.docx), PDF, CSV, Excel (.xlsx), atau screenshot">' +
            ICONS.paperclip +
            '</button>' +
            '              <div class="cs-model-anchor">' +
            '                <button type="button" class="cs-model-pill" id="cs-model-pill">' +
            '                  <span class="cs-spark">' +
            ICONS.spark +
            '</span>' +
            '                  <span id="cs-model-pill-label">Coserse 1.0</span>' +
            '                  <span class="cs-chev">' +
            ICONS.chevronDown +
            '</span>' +
            '                </button>' +
            '                <div class="cs-sheet-backdrop" id="cs-sheet-backdrop" style="display:none"></div>' +
            '                <div class="cs-popover" id="cs-popover" style="display:none">' +
            '                  <div class="cs-model-card" id="cs-model-card">' +
            '                    <div class="cs-pop-heading">Model</div>' +
            '                    <div id="cs-model-list"></div>' +
            '                    <div class="cs-pop-divider"></div>' +
            '                    <button type="button" class="cs-usage-trigger" id="cs-usage-trigger">' +
            '                      <span class="cs-usage-lbl">' +
            ICONS.usageClock +
            '<span>View Usage</span></span>' +
            ICONS.chevronRight +
            '                    </button>' +
            '                    <div class="cs-pop-footer">' +
            escapeHtml(POWERED_BY_NOTE) +
            '</div>' +
            '                  </div>' +
            '                  <div class="cs-usage-card" id="cs-pop-usage" style="display:none"></div>' +
            '                  <div class="cs-tier-card" id="cs-pop-tier" style="display:none"></div>' +
            '                </div>' +
            '              </div>' +
            '            </div>' +
            '            <div class="cs-capsule-right">' +
            '              <button type="button" class="cs-send-btn" id="cs-send-btn" title="Kirim pesan">' +
            ICONS.arrowUp +
            '</button>' +
            '            </div>' +
            '          </div>' +
            '        </div>' +
            '        <div class="cs-dock-disclaimer">' +
            escapeHtml(DISCLAIMER) +
            '</div>' +
            '      </div>' +
            '    </div>' +
            '  </section>' +
            '  <div class="cs-modal-backdrop" id="cs-settings-modal" style="display:none">' +
            '    <div class="cs-modal">' +
            '      <nav class="cs-settings-nav" id="cs-settings-tabs">' +
            '        <div class="cs-settings-nav-label">Pengaturan</div>' +
            '        <button type="button" class="cs-set-nav-item active" data-tab="general">' +
            '<span class="cs-set-nav-ico">' + ICONS.sliders + '</span><span>Umum</span></button>' +
            '        <button type="button" class="cs-set-nav-item" data-tab="models">' +
            '<span class="cs-set-nav-ico">' + ICONS.cpu + '</span><span>Model &amp; Kuota</span></button>' +
            '        <button type="button" class="cs-set-nav-item" data-tab="privacy">' +
            '<span class="cs-set-nav-ico">' + ICONS.shieldLock + '</span><span>Riwayat &amp; Privasi</span></button>' +
            '        <button type="button" class="cs-set-nav-item" data-tab="guide">' +
            '<span class="cs-set-nav-ico">' + ICONS.bookOpen + '</span><span>Panduan &amp; Ketentuan</span></button>' +
            '      </nav>' +
            '      <div class="cs-settings-main">' +
            '        <div class="cs-modal-head">' +
            '          <div class="cs-modal-title-wrap">' +
            '            <div class="cs-modal-title" id="cs-settings-title">Umum</div>' +
            '            <div class="cs-modal-sub" id="cs-settings-subtitle">Atur cara Coserse menjawab dan kenyamanan mengetik.</div>' +
            '          </div>' +
            '          <button type="button" class="cs-modal-close" id="cs-settings-close" aria-label="Tutup">' +
            ICONS.close +
            '</button>' +
            '        </div>' +
            '        <div class="cs-modal-body" id="cs-settings-body"></div>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '  <div class="cs-sess-menu" id="cs-sess-menu" style="display:none"></div>' +
            '  <div class="cs-modal-backdrop" id="cs-confirm-modal" style="display:none">' +
            '    <div class="cs-confirm-modal" role="dialog" aria-modal="true">' +
            '      <div class="cs-confirm-head">' +
            '        <span class="cs-confirm-ico">' + ICONS.alertTriangle + '</span>' +
            '        <div>' +
            '          <h3 class="cs-confirm-title" id="cs-confirm-title">Hapus percakapan ini?</h3>' +
            '          <p class="cs-confirm-msg" id="cs-confirm-msg">Seluruh isi obrolan dan memori di sesi ini akan dihapus permanen.</p>' +
            '        </div>' +
            '      </div>' +
            '      <div class="cs-confirm-actions">' +
            '        <button type="button" class="cs-btn-secondary" id="cs-confirm-cancel">Batal</button>' +
            '        <button type="button" class="cs-btn-danger-solid" id="cs-confirm-ok">Ya, Hapus</button>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>';

        var appEl = container.querySelector('#cs-app');
        var sidebarEl = container.querySelector('#cs-history-sidebar');
        var drawerBackdropEl = container.querySelector('#cs-drawer-backdrop');
        var sessionListEl = container.querySelector('#cs-session-list');
        var newChatBtn = container.querySelector('#cs-new-chat-btn');
        var toggleSidebarBtn = container.querySelector('#cs-toggle-sidebar');
        var wsTitleEl = container.querySelector('#cs-ws-title');
        var engineChipEl = container.querySelector('#cs-engine-chip');
        var bannerEl = container.querySelector('#cs-banner');
        var threadScrollEl = container.querySelector('#cs-thread-scroll');
        var emptyStateEl = container.querySelector('#cs-empty-state');
        var threadEl = container.querySelector('#cs-thread');
        var dropZone = container.querySelector('#cs-dropzone');
        var dropOverlay = container.querySelector('#cs-drop-overlay');
        var inputEl = container.querySelector('#cs-input');
        var sendBtn = container.querySelector('#cs-send-btn');
        var fileInput = container.querySelector('#cs-file-input');
        var clipBtn = container.querySelector('#cs-clip-btn');
        var attachPreview = container.querySelector('#cs-attach-preview');
        var modelPill = container.querySelector('#cs-model-pill');
        var modelPillLabel = container.querySelector('#cs-model-pill-label');
        var sheetBackdropEl = container.querySelector('#cs-sheet-backdrop');
        var popoverEl = container.querySelector('#cs-popover');
        var modelListEl = container.querySelector('#cs-model-list');
        var usageTriggerEl = container.querySelector('#cs-usage-trigger');
        var popTierEl = container.querySelector('#cs-pop-tier');
        var popUsageEl = container.querySelector('#cs-pop-usage');
        var settingsBtn = container.querySelector('#cs-settings-btn');
        var settingsModal = container.querySelector('#cs-settings-modal');
        var settingsClose = container.querySelector('#cs-settings-close');
        var settingsTabsEl = container.querySelector('#cs-settings-tabs');
        var settingsTitleEl = container.querySelector('#cs-settings-title');
        var settingsSubtitleEl = container.querySelector('#cs-settings-subtitle');
        var settingsBody = container.querySelector('#cs-settings-body');
        var pillsRowEl = container.querySelector('#cs-pills');
        var sessMenuEl = container.querySelector('#cs-sess-menu');
        var confirmModalEl = container.querySelector('#cs-confirm-modal');
        var confirmTitleEl = container.querySelector('#cs-confirm-title');
        var confirmMsgEl = container.querySelector('#cs-confirm-msg');
        var confirmCancelBtn = container.querySelector('#cs-confirm-cancel');
        var confirmOkBtn = container.querySelector('#cs-confirm-ok');
        var scrollBottomBtn = container.querySelector('#cs-scroll-bottom-btn');
        var starterGridEl = container.querySelector('#cs-starter-grid');

        function updateScrollBottomVisibility() {
            if (!scrollBottomBtn || !threadScrollEl) return;
            var dist = threadScrollEl.scrollHeight - threadScrollEl.scrollTop - threadScrollEl.clientHeight;
            var active = getActiveSession();
            var hasMsgs = active && active.messages && active.messages.length > 0;
            scrollBottomBtn.style.display = hasMsgs && dist > 120 ? 'inline-flex' : 'none';
        }

        function syncSendButtonState() {
            if (!sendBtn) return;
            if (isTestingReadOnly) {
                sendBtn.disabled = true;
                sendBtn.classList.remove('is-stop', 'ready');
                sendBtn.innerHTML = ICONS.arrowUp;
                sendBtn.title = 'Mode Lihat (Read-Only)';
                return;
            }
            if (isSessionBusy(state.activeSessionId)) {
                sendBtn.disabled = false;
                sendBtn.classList.add('is-stop', 'ready');
                sendBtn.innerHTML = ICONS.stopSquare;
                sendBtn.title = 'Hentikan respons (Stop)';
                return;
            }
            sendBtn.classList.remove('is-stop');
            sendBtn.innerHTML = ICONS.arrowUp;
            sendBtn.title = 'Kirim pesan';
            var hasPayload = Boolean(String(inputEl.value || '').trim() || state.pendingAttachment);
            sendBtn.disabled = false;
            sendBtn.classList.toggle('ready', hasPayload);
        }

        function formatTypingLabelText(job) {
            if (!job) return 'Coserse sedang menganalisis...';
            var baseTxt = job.queueStatusText || 'Coserse sedang menganalisis...';
            return job.elapsedSec > 0 ? baseTxt + ' (' + job.elapsedSec + ' dtk)' : baseTxt;
        }

        function ensureLoadingTimerRunning() {
            if (state.loadingTimer) return;
            state.loadingTimer = setInterval(function () {
                var jobKeys = Object.keys(state.activeJobs || {});
                if (!jobKeys.length) {
                    maybeStopLoadingTimer();
                    return;
                }
                var now = Date.now();
                for (var i = 0; i < jobKeys.length; i++) {
                    var j = state.activeJobs[jobKeys[i]];
                    if (j && (j.busy || j.streaming) && j.startedAt) {
                        j.elapsedSec = Math.max(0, Math.floor((now - j.startedAt) / 1000));
                    }
                }
                var activeJob = getActiveJob(state.activeSessionId);
                if (activeJob && activeJob.busy && threadEl) {
                    var lbl = threadEl.querySelector('.cs-typing-label');
                    if (lbl) {
                        lbl.textContent = formatTypingLabelText(activeJob);
                    }
                }
            }, 1000);
        }

        function maybeStopLoadingTimer() {
            var jobKeys = Object.keys(state.activeJobs || {});
            if (jobKeys.length > 0) return;
            if (state.loadingTimer) {
                clearInterval(state.loadingTimer);
                state.loadingTimer = null;
            }
        }

        function stopActiveStream(sessionId) {
            var sid = sessionId || state.activeSessionId;
            var job = getActiveJob(sid);
            if (job && job.abortController) {
                try {
                    job.abortController.abort();
                } catch (_e) {}
                job.abortController = null;
            }
        }

        function autoResizeInput() {
            inputEl.style.height = 'auto';
            inputEl.style.height = Math.min(136, Math.max(24, inputEl.scrollHeight)) + 'px';
            syncSendButtonState();
        }

        function showBanner(msg, type) {
            bannerEl.textContent = msg;
            bannerEl.className = 'cs-banner ' + (type || 'info');
            bannerEl.style.display = 'block';
            setTimeout(function () {
                if (bannerEl.textContent === msg) bannerEl.style.display = 'none';
            }, 6000);
        }

        function applyQuickPromptsVisibility() {
            if (pillsRowEl) {
                pillsRowEl.style.display = state.prefs.showQuickPrompts === false ? 'none' : 'flex';
            }
        }

        function closeSessionMenu() {
            if (state.openMenuSessionId) {
                state.openMenuSessionId = null;
                if (sessMenuEl) sessMenuEl.style.display = 'none';
                renderSidebar();
            } else if (sessMenuEl) {
                sessMenuEl.style.display = 'none';
            }
        }

        function openConfirmModal(optsConfirm) {
            state.pendingConfirmAction = optsConfirm.onConfirm || null;
            if (confirmTitleEl) confirmTitleEl.textContent = optsConfirm.title || 'Hapus percakapan ini?';
            if (confirmMsgEl) {
                confirmMsgEl.textContent =
                    optsConfirm.message ||
                    'Seluruh isi obrolan dan memori di sesi ini akan dihapus permanen.';
            }
            if (confirmOkBtn) confirmOkBtn.textContent = optsConfirm.confirmLabel || 'Ya, Hapus';
            if (confirmModalEl) confirmModalEl.style.display = 'flex';
        }

        function closeConfirmModal() {
            state.pendingConfirmAction = null;
            if (confirmModalEl) confirmModalEl.style.display = 'none';
        }

        async function deleteSessionById(delId) {
            if (isSessionBusy(delId)) {
                stopActiveStream(delId);
            }
            try {
                await fetch(apiBase + '/session?session_id=' + encodeURIComponent(delId), {
                    method: 'DELETE',
                    headers: getHeaders(false)
                });
            } catch (_err) {
                // ignore
            }
            state.sessions = state.sessions.filter(function (s) {
                return s.id !== delId;
            });
            var activeList = state.sessions.filter(function (s) {
                return !s.archived;
            });
            if (activeList.length === 0) {
                var fresh = {
                    id: makeSessionId(),
                    title: 'Obrolan Baru',
                    updatedAt: Date.now(),
                    messages: []
                };
                state.sessions.unshift(fresh);
                state.activeSessionId = fresh.id;
            } else if (state.activeSessionId === delId) {
                state.activeSessionId = activeList[0].id;
            }
            renderMessages();
            refreshQuota();
            showBanner('Percakapan dihapus dan memori sesi dibersihkan.', 'ok');
        }

        function renderSessionRow(s) {
            var isActive = s.id === state.activeSessionId;
            var isEditing = state.editingSessionId === s.id;
            var isMenuOpen = state.openMenuSessionId === s.id;
            var isRunning = isSessionBusy(s.id);
            var runningDot = isRunning
                ? '<span class="cs-session-running-dot" title="Coserse sedang memproses..." aria-label="Sedang memproses"></span>'
                : '';
            var titleCell = isEditing
                ? '<input type="text" class="cs-rename-input" data-rename-input="' +
                  escapeHtml(s.id) +
                  '" value="' +
                  escapeHtml(s.title) +
                  '" />'
                : runningDot + '<span class="cs-session-title">' + escapeHtml(s.title) + '</span>';

            return (
                '<div class="cs-session-item' +
                (isActive ? ' active' : '') +
                (s.pinned ? ' pinned' : '') +
                (isMenuOpen ? ' menu-open' : '') +
                (isRunning ? ' is-running' : '') +
                '" data-session-id="' +
                escapeHtml(s.id) +
                '">' +
                titleCell +
                (isEditing
                    ? ''
                    : '<div class="cs-session-actions">' +
                      '  <button type="button" class="cs-sess-act-btn' +
                      (s.pinned ? ' pinned' : '') +
                      '" data-quick-pin="' +
                      escapeHtml(s.id) +
                      '" title="' +
                      (s.pinned ? 'Lepas Sematan' : 'Sematkan') +
                      '">' +
                      ICONS.pin +
                      '</button>' +
                      '  <button type="button" class="cs-sess-act-btn" data-menu-session="' +
                      escapeHtml(s.id) +
                      '" title="Opsi percakapan">' +
                      ICONS.moreVertical +
                      '</button>' +
                      '</div>') +
                '</div>'
            );
        }

        function renderSidebar() {
            var compact = isCompactViewport();
            if (compact) {
                sidebarEl.classList.toggle('mobile-open', state.mobileDrawerOpen);
                sidebarEl.classList.remove('collapsed');
                appEl.classList.toggle('mobile-drawer-open', state.mobileDrawerOpen);
                drawerBackdropEl.classList.toggle('active', state.mobileDrawerOpen);
            } else {
                sidebarEl.classList.remove('mobile-open');
                appEl.classList.remove('mobile-drawer-open');
                drawerBackdropEl.classList.remove('active');
                sidebarEl.classList.toggle('collapsed', !state.desktopSidebarOpen);
                appEl.classList.toggle('sidebar-collapsed', !state.desktopSidebarOpen);
            }

            var active = getActiveSession();
            if (wsTitleEl && active) wsTitleEl.textContent = active.title;

            var pinnedList = state.sessions.filter(function (s) {
                return Boolean(s.pinned) && !s.archived;
            });
            var regularList = state.sessions.filter(function (s) {
                return !s.pinned && !s.archived;
            });
            var archivedList = state.sessions.filter(function (s) {
                return Boolean(s.archived);
            });

            var html = '';
            if (pinnedList.length > 0) {
                html += '<div class="cs-sidebar-label">Disematkan</div>';
                html += pinnedList.map(renderSessionRow).join('');
            }
            html += '<div class="cs-sidebar-label">Riwayat Percakapan</div>';
            html += regularList.map(renderSessionRow).join('');

            if (archivedList.length > 0) {
                html +=
                    '<button type="button" class="cs-archive-toggle" id="cs-archive-toggle">' +
                    '<span>Arsip (' +
                    archivedList.length +
                    ')</span>' +
                    (state.showArchived ? ICONS.chevronDown : ICONS.chevronRight) +
                    '</button>';
                if (state.showArchived) {
                    html += archivedList.map(renderSessionRow).join('');
                }
            }

            sessionListEl.innerHTML = html;

            if (state.editingSessionId) {
                var renameEl = sessionListEl.querySelector('[data-rename-input]');
                if (renameEl) {
                    renameEl.focus();
                    renameEl.select();
                }
            }
        }

        function openSessionMenu(sessionId, triggerBtn) {
            var sess = state.sessions.find(function (s) {
                return s.id === sessionId;
            });
            if (!sess || !sessMenuEl) return;
            if (state.openMenuSessionId === sessionId) {
                closeSessionMenu();
                return;
            }
            state.openMenuSessionId = sessionId;
            renderSidebar();

            var freshTrigger = sessionListEl.querySelector('[data-menu-session="' + sessionId + '"]') || triggerBtn;
            var rect = freshTrigger.getBoundingClientRect();

            sessMenuEl.innerHTML =
                '<button type="button" class="cs-sess-menu-item" data-sess-act="rename">' +
                ICONS.edit +
                '<span>Ubah Nama</span></button>' +
                '<button type="button" class="cs-sess-menu-item" data-sess-act="pin">' +
                ICONS.pin +
                '<span>' +
                (sess.pinned ? 'Lepas Sematan' : 'Sematkan') +
                '</span></button>' +
                '<button type="button" class="cs-sess-menu-item" data-sess-act="copy">' +
                ICONS.copy +
                '<span>Salin Percakapan</span></button>' +
                '<button type="button" class="cs-sess-menu-item" data-sess-act="archive">' +
                ICONS.archive +
                '<span>' +
                (sess.archived ? 'Pulihkan dari Arsip' : 'Arsipkan') +
                '</span></button>' +
                '<div class="cs-pop-divider"></div>' +
                '<button type="button" class="cs-sess-menu-item danger" data-sess-act="delete">' +
                ICONS.trash +
                '<span>Hapus</span></button>';

            sessMenuEl.style.display = 'flex';
            var menuW = 196;
            var menuH = sessMenuEl.offsetHeight || 205;
            var left = Math.min(window.innerWidth - menuW - 10, Math.max(8, rect.right + 6));
            if (rect.right + menuW + 14 > window.innerWidth) {
                left = Math.max(8, rect.left - menuW + 24);
            }
            var top = rect.top;
            if (top + menuH + 10 > window.innerHeight) {
                top = Math.max(8, window.innerHeight - menuH - 10);
            }
            sessMenuEl.style.left = left + 'px';
            sessMenuEl.style.top = top + 'px';
        }

        function setPopoverOpen(open) {
            state.popoverOpen = Boolean(open);
            if (!state.popoverOpen) {
                state.tierFlyoutOpen = false;
                state.usageFlyoutOpen = false;
            }
            popoverEl.style.display = state.popoverOpen ? 'block' : 'none';
            sheetBackdropEl.style.display = state.popoverOpen && isCompactViewport() ? 'block' : 'none';
            renderPopoverContent();
            if (state.popoverOpen) refreshQuota();
        }

        function getQuotaSnapshot() {
            if (state.quota) return state.quota;
            var role = String(activeUser.role_bdb || 'operator').toLowerCase();
            var isSuper = role === 'superadmin';
            var isBinops = role === 'admin_binops';
            return {
                role: role,
                is_unlimited: isSuper,
                can_train_model: isSuper,
                model_readonly: !isSuper,
                memory: { used_mb: 0, limit_mb: isBinops || isSuper ? 50 : 10, usage_percent: 0 },
                tokens: {
                    five_hour_used: 0,
                    five_hour_effective_limit: isSuper ? 0 : isBinops ? 60000 : 20000,
                    five_hour_remaining: isSuper ? 0 : isBinops ? 60000 : 20000,
                    five_hour_reset_at: isSuper ? 'Tanpa Batas' : '-',
                    five_hour_reset_in_text: isSuper
                        ? 'Akses Superadmin • Kuota Tanpa Batas'
                        : 'Reset dalam 5 Jam lagi',
                    weekly_used: 0,
                    weekly_effective_limit: isSuper ? 0 : isBinops ? 500000 : 100000,
                    weekly_remaining: isSuper ? 0 : isBinops ? 500000 : 100000,
                    weekly_reset_at: isSuper ? 'Tanpa Batas' : '-',
                    weekly_reset_in_text: isSuper
                        ? 'Akses Superadmin • Kuota Tanpa Batas'
                        : 'Reset dalam 7 Hari lagi'
                }
            };
        }

        function renderPopoverContent() {
            modelPillLabel.textContent = state.selectedModel.pillLabel + ' ' + state.selectedTier.label;
            var q = getQuotaSnapshot();

            modelListEl.innerHTML =
                '<button type="button" class="cs-pop-item selected' +
                (state.tierFlyoutOpen ? ' active' : '') +
                '" id="cs-model-tier-trigger">' +
                '  <span class="cs-model-row-inline">' +
                '    <span class="cs-model-row-name">' +
                escapeHtml(state.selectedModel.label) +
                '</span>' +
                '    <span class="cs-model-row-tier" id="cs-model-row-tier">' +
                escapeHtml(state.selectedTier.label) +
                '</span>' +
                '  </span>' +
                ICONS.chevronRight +
                '</button>';

            popoverEl.classList.toggle('tier-open', state.tierFlyoutOpen);
            popTierEl.style.display = state.tierFlyoutOpen ? 'flex' : 'none';
            popTierEl.innerHTML =
                '<div class="cs-usage-mobile-head">' +
                '  <button type="button" class="cs-usage-back-btn" id="cs-tier-back"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg><span>Kembali ke Model</span></button>' +
                '</div>' +
                TIER_OPTIONS.map(function (t) {
                    var activeTier = t.id === state.selectedTier.id;
                    return (
                        '<button type="button" class="cs-tier-item' +
                        (activeTier ? ' selected' : '') +
                        '" data-tier-id="' +
                        escapeHtml(t.id) +
                        '">' +
                        '  <span class="cs-tier-left">' +
                        '    <span class="cs-pop-radio">' +
                        (activeTier ? ICONS.radioOn : ICONS.radioOff) +
                        '</span>' +
                        '    <span>' +
                        escapeHtml(t.label) +
                        '</span>' +
                        '  </span>' +
                        (activeTier ? '<span class="cs-check">' + ICONS.check + '</span>' : '') +
                        '</button>'
                    );
                }).join('');

            usageTriggerEl.classList.toggle('active', state.usageFlyoutOpen);
            popoverEl.classList.toggle('usage-open', state.usageFlyoutOpen);
            popUsageEl.style.display = state.usageFlyoutOpen ? 'block' : 'none';

            var mobileBackHead =
                '<div class="cs-usage-mobile-head">' +
                '  <button type="button" class="cs-usage-back-btn" id="cs-usage-back"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg><span>Kembali ke Model</span></button>' +
                '</div>' +
                '<div class="cs-pop-heading">Pemakaian Kuota</div>';

            if (q.is_unlimited) {
                popUsageEl.innerHTML =
                    mobileBackHead +
                    '<div class="cs-unlimited-box">' +
                    '  <div class="cs-unlimited-title">Akses Superadmin • Kuota Tanpa Batas</div>' +
                    '  <div class="cs-unlimited-sub">Kapasitas token 5 jam, mingguan, dan memori sesi aktif penuh tanpa pembatasan.</div>' +
                    '</div>';
                return;
            }

            var wkEff = Math.max(1, q.tokens.weekly_effective_limit || 100000);
            var h5Eff = Math.max(1, q.tokens.five_hour_effective_limit || 20000);
            var wkLeftPct = Math.round(((q.tokens.weekly_remaining || 0) / wkEff) * 100);
            var h5LeftPct = Math.round(((q.tokens.five_hour_remaining || 0) / h5Eff) * 100);
            var memUsedPct = Math.min(100, Math.round(q.memory.usage_percent || 0));
            var memFreePct = Math.max(0, 100 - memUsedPct);

            var colorFor = function (pctLeft) {
                if (pctLeft <= 15) return '#dc2626';
                if (pctLeft <= 40) return '#d97706';
                return '#16a34a';
            };

            popUsageEl.innerHTML =
                mobileBackHead +
                '<div class="cs-usage-row">' +
                '  <div><div class="cs-u-name">Weekly limit</div><div class="cs-u-sub">' +
                escapeHtml(q.tokens.weekly_reset_in_text || 'Reset dalam -') +
                '</div></div>' +
                '  <div class="cs-u-metric"><span>' +
                wkLeftPct +
                '% tersisa</span>' +
                createRingSvg(wkLeftPct, colorFor(wkLeftPct), '#e2e8f0') +
                '</div>' +
                '</div>' +
                '<div class="cs-usage-row">' +
                '  <div><div class="cs-u-name">5h limit</div><div class="cs-u-sub">' +
                escapeHtml(q.tokens.five_hour_reset_in_text || 'Reset dalam -') +
                '</div></div>' +
                '  <div class="cs-u-metric"><span>' +
                h5LeftPct +
                '% tersisa</span>' +
                createRingSvg(h5LeftPct, colorFor(h5LeftPct), '#e2e8f0') +
                '</div>' +
                '</div>' +
                '<div class="cs-usage-group" style="margin-top:8px;">MEMORI</div>' +
                '<div class="cs-usage-row cs-usage-row-last">' +
                '  <div><div class="cs-u-name">Session Memory</div><div class="cs-u-sub">' +
                q.memory.used_mb.toFixed(3) +
                ' MB / ' +
                q.memory.limit_mb +
                ' MB terpakai</div></div>' +
                '  <div class="cs-u-metric"><span>' +
                memFreePct +
                '% tersisa</span>' +
                createRingSvg(memFreePct, colorFor(memFreePct), '#e2e8f0') +
                '</div>' +
                '</div>';
        }

        function renderReviewCardHtml(msg) {
            var card = msg.reviewCard;
            var statusState = msg.cardStatus || 'PENDING';
            var badgeText =
                statusState === 'APPROVED'
                    ? 'Tersimpan Resmi'
                    : statusState === 'CANCELLED'
                      ? 'Dibatalkan'
                      : statusState === 'EDITING'
                        ? 'Mode Koreksi'
                        : 'Menunggu Persetujuan';

            var pillCls =
                statusState === 'APPROVED'
                    ? 'pill-ok'
                    : statusState === 'CANCELLED'
                      ? 'pill-cancel'
                      : 'pill-wait';

            var isEditing = statusState === 'EDITING';
            var isDone = statusState === 'APPROVED' || statusState === 'CANCELLED';
            var tersangkaText = Array.isArray(card.tersangka) ? card.tersangka.join(', ') : String(card.tersangka || '');

            var thumbHtml = msg.imagePreview
                ? '<div class="cs-card-thumb"><img src="' +
                  escapeHtml(msg.imagePreview) +
                  '" alt="Pratinjau Screenshot"/><span>Tangkapan Layar (RAM Sandbox)</span></div>'
                : '';

            var docOptionsHtml = DOC_TYPE_OPTIONS.map(function (opt) {
                return (
                    '<option value="' +
                    opt.code +
                    '"' +
                    (card.doc_type_code === opt.code ? ' selected' : '') +
                    '>' +
                    escapeHtml(opt.label) +
                    '</option>'
                );
            }).join('');

            var bodyTable = isEditing
                ? '<div class="cs-edit-grid">' +
                  '  <label>Nomor LP Terkait<input type="text" data-field="nomor_lp" value="' + escapeHtml(card.nomor_lp) + '"/></label>' +
                  '  <label>Jenis Dokumen<select data-field="doc_type_code">' + docOptionsHtml + '</select></label>' +
                  '  <label>Nomor Surat / Dokumen<input type="text" data-field="nomor_dokumen" value="' + escapeHtml(card.nomor_dokumen) + '"/></label>' +
                  '  <label>Tanggal Dokumen<input type="text" data-field="tanggal_dokumen" value="' + escapeHtml(card.tanggal_dokumen) + '"/></label>' +
                  '  <label>Tersangka<input type="text" data-field="tersangka" value="' + escapeHtml(tersangkaText) + '"/></label>' +
                  '  <label>Kejaksaan Tujuan<input type="text" data-field="kejaksaan_tujuan" value="' + escapeHtml(card.kejaksaan_tujuan) + '"/></label>' +
                  '</div>'
                : '<table class="cs-review-table">' +
                  '  <tr><td>Nomor LP Terkait</td><td><strong>' + escapeHtml(card.nomor_lp || '-') + '</strong>' + (card.satker_nama && card.satker_nama !== '-' ? ' <span class="cs-tag">' + escapeHtml(card.satker_nama) + '</span>' : '') + '</td></tr>' +
                  '  <tr><td>Jenis Dokumen</td><td>' + escapeHtml(card.doc_type_nama || card.doc_type_code) + '</td></tr>' +
                  '  <tr><td>Nomor Dokumen</td><td><strong>' + escapeHtml(card.nomor_dokumen || '-') + '</strong></td></tr>' +
                  '  <tr><td>Tanggal Dokumen</td><td>' + escapeHtml(card.tanggal_dokumen || '-') + '</td></tr>' +
                  '  <tr><td>Tersangka</td><td>' + escapeHtml(tersangkaText || '-') + '</td></tr>' +
                  '  <tr><td>Kejaksaan Tujuan</td><td>' + escapeHtml(card.kejaksaan_tujuan || '-') + '</td></tr>' +
                  '  <tr><td>Perubahan Status</td><td><span class="cs-st-old">' + escapeHtml(card.current_status_code || '-') + '</span> &nbsp;&rarr;&nbsp; <span class="cs-st-new">' + escapeHtml(card.target_status_code || 'SIDIK') + (card.is_crime_clearance ? ' (CC)' : '') + '</span></td></tr>' +
                  '</table>';

            var actions = isDone
                ? '<div class="cs-card-done">' + escapeHtml(msg.commitMessage || badgeText) + '</div>'
                : '<div class="cs-card-actions">' +
                  '  <button type="button" class="cs-btn-approve" data-card-action="approve" data-msg-id="' + escapeHtml(msg.id) + '">' + ICONS.check + '<span>Setujui &amp; Simpan</span></button>' +
                  '  <button type="button" class="cs-btn-edit" data-card-action="toggle-edit" data-msg-id="' + escapeHtml(msg.id) + '">' + ICONS.edit + '<span>' + (isEditing ? 'Selesai Koreksi' : 'Koreksi') + '</span></button>' +
                  '  <button type="button" class="cs-btn-cancel" data-card-action="cancel" data-msg-id="' + escapeHtml(msg.id) + '">' + ICONS.close + '<span>Batal</span></button>' +
                  '</div>';

            return (
                '<div class="cs-review-card ' +
                pillCls +
                '" data-msg-id="' +
                escapeHtml(msg.id) +
                '">' +
                '  <div class="cs-review-head">' +
                '    <div class="cs-review-title">' + ICONS.fileText + '<strong>Draf Dokumen Mindik</strong> <span class="cs-tag">' + escapeHtml(card.draft_id) + '</span></div>' +
                '    <span class="cs-review-badge">' + escapeHtml(badgeText) + '</span>' +
                '  </div>' +
                thumbHtml +
                bodyTable +
                '  <div class="cs-ram-note">Berkas hanya diproses sementara dan tidak tersimpan di server.</div>' +
                actions +
                '</div>'
            );
        }

        function buildBotActionsHtml(msg, isLastBot) {
            var timeLabel = formatRelativeTimeId(msg.createdAt);
            var durBadge = msg.durationSec
                ? ' &bull; <span class="cs-msg-dur">Selesai dalam ' +
                  escapeHtml(String(msg.durationSec).replace('.', ',')) +
                  ' dtk</span>'
                : '';
            var likeCls = msg.feedback === 'up' ? ' active-up' : '';
            var dislikeCls = msg.feedback === 'down' ? ' active-down' : '';
            return (
                '      <span class="cs-msg-time">' +
                escapeHtml(timeLabel) +
                durBadge +
                '</span>' +
                (isTestingReadOnly
                    ? ''
                    : '      <button type="button" class="cs-msg-act-btn" data-msg-action="copy" data-msg-id="' +
                      escapeHtml(msg.id) +
                      '" title="Salin jawaban">' +
                      ICONS.copy +
                      '</button>' +
                      (isLastBot
                          ? '      <button type="button" class="cs-msg-act-btn" data-msg-action="regenerate" data-msg-id="' +
                            escapeHtml(msg.id) +
                            '" title="Ulangi jawaban (Regenerate)">' +
                            ICONS.refresh +
                            '</button>'
                          : '') +
                      '      <button type="button" class="cs-msg-act-btn' +
                      likeCls +
                      '" data-msg-action="like" data-msg-id="' +
                      escapeHtml(msg.id) +
                      '" aria-pressed="' +
                      (msg.feedback === 'up' ? 'true' : 'false') +
                      '" title="Jawaban membantu">' +
                      ICONS.thumbsUp +
                      '</button>' +
                      '      <button type="button" class="cs-msg-act-btn' +
                      dislikeCls +
                      '" data-msg-action="dislike" data-msg-id="' +
                      escapeHtml(msg.id) +
                      '" aria-pressed="' +
                      (msg.feedback === 'down' ? 'true' : 'false') +
                      '" title="Jawaban kurang tepat">' +
                      ICONS.thumbsDown +
                      '</button>')
            );
        }

        function renderBatchReviewCardHtml(msg) {
            var card = msg.batchReviewCard;
            if (!card) return '';
            var items = Array.isArray(card.items) ? card.items : [];
            var statusState = msg.cardStatus || 'PENDING';
            var isDone = statusState === 'APPROVED' || statusState === 'CANCELLED';
            var readyCount = items.filter(function (i) { return i.action === 'UPDATE'; }).length;
            var skipCount = items.length - readyCount;
            var selectedCount = items.filter(function (i) { return i.action === 'UPDATE' && i.selected !== false; }).length;
            var pillCls = statusState === 'APPROVED' ? 'pill-ok' : statusState === 'CANCELLED' ? 'pill-cancel' : 'pill-wait';
            var badgeText = statusState === 'APPROVED' ? 'Tersimpan Resmi' : statusState === 'CANCELLED' ? 'Dibatalkan' : 'Menunggu Persetujuan';

            var rowsHtml = items.map(function (it, idx) {
                var isUpdate = it.action === 'UPDATE';
                var checked = isUpdate && it.selected !== false ? ' checked' : '';
                var dis = !isUpdate || isDone || isTestingReadOnly ? ' disabled' : '';
                var statusCell = isUpdate
                    ? '<span class="cs-batch-st-old">' + escapeHtml(it.status_lama || 'BARU') + '</span> &rarr; <span class="cs-batch-st-new">' + escapeHtml(it.status_baru) + '</span>' +
                      (it.alasan ? '<div class="cs-batch-alasan">' + escapeHtml(it.alasan) + '</div>' : '')
                    : '<span class="cs-batch-st-new">' + escapeHtml(it.status_baru) + '</span>';
                var badgeCell = isUpdate
                    ? '<span class="cs-batch-badge-ok">Siap Update</span>'
                    : '<span class="cs-batch-badge-skip" title="' + escapeHtml(it.skip_reason || 'Tidak ditemukan') + '">Dilewati</span>';
                return (
                    '<tr class="' + (isUpdate ? 'is-ready' : 'is-skip') + '">' +
                    '  <td class="cs-batch-col-chk"><input type="checkbox" data-batch-msg-id="' + escapeHtml(msg.id) + '" data-batch-row-idx="' + idx + '"' + checked + dis + ' /></td>' +
                    '  <td>' + (idx + 1) + '</td>' +
                    '  <td class="cs-batch-col-lp"><strong>' + escapeHtml(it.no_laporan_db || it.nomor_lp) + '</strong>' +
                    (it.satker_nama ? '<div class="cs-batch-satker">' + escapeHtml(it.satker_nama) + '</div>' : '') + '</td>' +
                    '  <td>' + statusCell + '</td>' +
                    '  <td>' + escapeHtml(it.tanggal_selra || '—') + '</td>' +
                    '  <td>' + badgeCell + '</td>' +
                    '</tr>'
                );
            }).join('');

            var footerHtml = isDone
                ? '<div class="cs-card-footer done-msg">' + escapeHtml(msg.commitMessage || 'Batch selesai diproses.') + '</div>'
                : '<div class="cs-card-footer">' +
                  '  <button type="button" class="cs-btn-primary" data-batch-action="approve-batch" data-msg-id="' + escapeHtml(msg.id) + '"' +
                  (selectedCount === 0 || isTestingReadOnly ? ' disabled' : '') + '>' +
                  ICONS.check + '<span>Terapkan Update Massal (' + selectedCount + ' LP)</span></button>' +
                  '  <button type="button" class="cs-btn-danger" data-batch-action="cancel-batch" data-msg-id="' + escapeHtml(msg.id) + '"' +
                  (isTestingReadOnly ? ' disabled' : '') + '>Batal</button>' +
                  '</div>';

            return (
                '<div class="cs-review-card cs-batch-card" data-msg-id="' + escapeHtml(msg.id) + '">' +
                '  <div class="cs-card-head">' +
                '    <div><strong>Batch Update Status LP</strong><div class="cs-batch-summary">' +
                readyCount + ' LP Siap Diupdate &middot; ' + skipCount + ' LP Dilewati (Tidak Ditemukan)</div></div>' +
                '    <span class="cs-card-pill ' + pillCls + '">' + badgeText + '</span>' +
                '  </div>' +
                '  <div class="cs-batch-table-wrap">' +
                '    <table class="cs-batch-table"><thead><tr><th></th><th>#</th><th>Nomor LP</th><th>Status Lama &rarr; Baru</th><th>Tanggal Selra</th><th>Status</th></tr></thead>' +
                '    <tbody>' + rowsHtml + '</tbody></table>' +
                '  </div>' +
                footerHtml +
                '</div>'
            );
        }

        function renderExportFileCardHtml(msg) {
            var card = msg && (msg.exportFileCard || msg.export_file_card);
            if (isTestingReadOnly || !msg || msg.streaming || !card || !card.download_url) {
                return '';
            }
            var fmtLabel = String(card.format_label || card.format || 'PDF').toUpperCase();
            var fmtLower = String(card.format || 'pdf').toLowerCase();
            var rawUrl = String(card.download_url || '');
            var altFormats = [
                { id: 'pdf', label: 'PDF' },
                { id: 'docx', label: 'Word (.docx)' },
                { id: 'pptx', label: 'PPT (.pptx)' },
                { id: 'xlsx', label: 'Excel (.xlsx)' }
            ];
            var buildFormatUrl = function (targetFmt) {
                if (rawUrl.indexOf('format=') !== -1) {
                    return rawUrl.replace(/format=[a-z0-9]+/i, 'format=' + encodeURIComponent(targetFmt));
                }
                return rawUrl + (rawUrl.indexOf('?') === -1 ? '?' : '&') + 'format=' + encodeURIComponent(targetFmt);
            };
            var buildFormatName = function (targetFmt) {
                return String(card.filename || 'CAS_Coserse_Export.' + fmtLower).replace(/\.[a-z0-9]+$/i, '.' + targetFmt);
            };
            var switchButtonsHtml = altFormats
                .filter(function (f) { return f.id !== fmtLower; })
                .map(function (f) {
                    return (
                        '<button type="button" class="cs-export-alt-btn" data-export-download="1" data-export-url="' +
                        escapeHtml(buildFormatUrl(f.id)) +
                        '" data-export-filename="' +
                        escapeHtml(buildFormatName(f.id)) +
                        '">' +
                        escapeHtml(f.label) +
                        '</button>'
                    );
                })
                .join('');

            return (
                '<div class="cs-export-card" data-msg-id="' + escapeHtml(msg.id) + '">' +
                '  <div class="cs-export-card-head">' +
                '    <span class="cs-export-badge">' + escapeHtml(fmtLabel) + '</span>' +
                '    <div class="cs-export-info">' +
                '      <div class="cs-export-title">' + escapeHtml(card.filename || 'Laporan_Coserse.' + fmtLower) + '</div>' +
                '      <div class="cs-export-meta">' +
                escapeHtml(card.group_label || 'Semua Kelompok Data') +
                ' &bull; ' + escapeHtml(String(card.total_records || 0)) + ' data' +
                (card.size_text ? ' &bull; ' + escapeHtml(card.size_text) : '') +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '  <div class="cs-export-card-actions">' +
                '    <button type="button" class="cs-export-download-btn" data-export-download="1" data-export-url="' +
                escapeHtml(rawUrl) +
                '" data-export-filename="' +
                escapeHtml(card.filename || 'Laporan_Coserse.' + fmtLower) +
                '">⬇️ Download File ' + escapeHtml(card.format_label || fmtLabel) + '</button>' +
                (switchButtonsHtml ? '<span class="cs-export-alt-group">' + switchButtonsHtml + '</span>' : '') +
                '  </div>' +
                '</div>'
            );
        }

        function renderFollowUpChipsHtml(msg) {
            if (isTestingReadOnly || !msg || msg.streaming || !Array.isArray(msg.followUpActions) || !msg.followUpActions.length) {
                return '';
            }
            return (
                '<div class="cs-followup-chips">' +
                msg.followUpActions
                    .map(function (act) {
                        var label = String(act && act.label ? act.label : '').trim();
                        var prompt = String(act && act.prompt ? act.prompt : label).trim();
                        if (!label || !prompt) return '';
                        return (
                            '<button type="button" class="cs-followup-chip" data-followup-prompt="' +
                            escapeHtml(prompt) +
                            '">' +
                            escapeHtml(label) +
                            '</button>'
                        );
                    })
                    .join('') +
                '</div>'
            );
        }

        function applyStreamDomUpdate(msg, isFinal, sessionId) {
            if (!threadEl || !msg) return false;
            if (sessionId && sessionId !== state.activeSessionId) return false;
            var msgEl = threadEl.querySelector('.cs-msg-loading') || threadEl.querySelector('[data-bot-msg-id="' + msg.id + '"]');
            if (!msgEl) return false;

            if (msgEl.classList.contains('cs-msg-loading')) {
                msgEl.classList.remove('cs-msg-loading', 'cs-msg-entering');
                msgEl.removeAttribute('aria-live');
                msgEl.setAttribute('data-bot-msg-id', msg.id);
                var contentEl = msgEl.querySelector('.cs-bot-content');
                if (contentEl) {
                    contentEl.innerHTML =
                        '<div class="cs-bot-text"></div>' +
                        '<div class="cs-msg-actions" style="display:none"></div>';
                }
            } else {
                msgEl.setAttribute('data-bot-msg-id', msg.id);
            }

            msgEl.classList.toggle('is-streaming', !isFinal);
            var textEl = msgEl.querySelector('.cs-bot-text');
            if (textEl) {
                var cleanText = stripTrailingDisclaimer(msg.text);
                var renderedMd = isFinal ? cleanText : stabilizeStreamingMarkdown(cleanText, false);
                textEl.innerHTML = formatSimpleMarkdown(renderedMd);
            }

            var actionsEl = msgEl.querySelector('.cs-msg-actions');
            if (isFinal) {
                var contentParent = msgEl.querySelector('.cs-bot-content');
                if (contentParent && actionsEl) {
                    contentParent.querySelectorAll('.cs-review-card, .cs-batch-card, .cs-export-card, .cs-followup-chips').forEach(function (el) { el.remove(); });
                    var cardHtml =
                        (msg.reviewCard ? renderReviewCardHtml(msg) : '') +
                        (msg.batchReviewCard ? renderBatchReviewCardHtml(msg) : '') +
                        renderExportFileCardHtml(msg) +
                        renderFollowUpChipsHtml(msg);
                    if (cardHtml) actionsEl.insertAdjacentHTML('beforebegin', cardHtml);
                }
            }
            if (actionsEl) {
                if (isFinal) {
                    // Remove regenerate button from previous bot messages in-place
                    threadEl.querySelectorAll('[data-msg-action="regenerate"]').forEach(function (oldReg) {
                        oldReg.parentNode && oldReg.parentNode.removeChild(oldReg);
                    });
                    actionsEl.innerHTML = buildBotActionsHtml(msg, true);
                    actionsEl.style.display = '';
                } else {
                    actionsEl.style.display = 'none';
                }
            }

            if (threadScrollEl) {
                var distFromBottom = threadScrollEl.scrollHeight - threadScrollEl.scrollTop - threadScrollEl.clientHeight;
                if (distFromBottom < 180 || !isFinal) {
                    threadScrollEl.scrollTop = threadScrollEl.scrollHeight;
                }
            }
            updateScrollBottomVisibility();
            return true;
        }

        function updateStreamBubbleInPlace(msg, isFinal, sessionId) {
            if (!threadEl || !msg) return false;
            var targetSid = sessionId || state.activeSessionId;
            if (targetSid !== state.activeSessionId) return false;
            var job = getActiveJob(targetSid);
            if (isFinal) {
                if (job && job.streamRafId && typeof cancelAnimationFrame === 'function') {
                    cancelAnimationFrame(job.streamRafId);
                    job.streamRafId = 0;
                }
                if (job) job.pendingStreamMsg = null;
                return applyStreamDomUpdate(msg, true, targetSid);
            }
            if (!threadEl.querySelector('.cs-msg-loading') && !threadEl.querySelector('[data-bot-msg-id="' + msg.id + '"]')) {
                return false;
            }
            if (!job) return applyStreamDomUpdate(msg, false, targetSid);
            job.pendingStreamMsg = msg;
            if (job.streamRafId) return true;
            var rafFn = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : function (cb) { return setTimeout(cb, 40); };
            job.streamRafId = rafFn(function () {
                var now = Date.now();
                if (job.lastStreamRenderAt && now - job.lastStreamRenderAt < 40 && job.pendingStreamMsg) {
                    job.streamRafId = rafFn(function () {
                        job.streamRafId = 0;
                        job.lastStreamRenderAt = Date.now();
                        if (job.pendingStreamMsg) applyStreamDomUpdate(job.pendingStreamMsg, false, targetSid);
                    });
                    return;
                }
                job.streamRafId = 0;
                job.lastStreamRenderAt = now;
                if (job.pendingStreamMsg) applyStreamDomUpdate(job.pendingStreamMsg, false, targetSid);
            });
            return true;
        }

        function renderMessages() {
            var active = getActiveSession();
            if (!active) return;
            var activeJob = getActiveJob(active.id);
            var activeBusy = Boolean(activeJob && activeJob.busy);
            var activeStreaming = Boolean(activeJob && activeJob.streaming);
            renderSidebar();

            var msgs = active.messages || [];
            var isEmpty = msgs.length === 0 && !activeBusy;
            emptyStateEl.style.display = isEmpty ? 'flex' : 'none';
            threadEl.style.display = isEmpty ? 'none' : 'flex';

            if (!isEmpty) {
                var handoverBanner = active.handoverRef
                    ? '<div class="cs-handover-tag">' +
                      ICONS.spark +
                      '<span>Dilanjutkan otomatis dari Obrolan Cepat (@cosersebot) &bull; Ref: ' +
                      escapeHtml(active.handoverRef) +
                      '</span></div>'
                    : '';

                var lastBotIdx = -1;
                for (var bi = msgs.length - 1; bi >= 0; bi--) {
                    if (msgs[bi].role !== 'user') {
                        lastBotIdx = bi;
                        break;
                    }
                }

                threadEl.innerHTML =
                    handoverBanner +
                    msgs
                        .map(function (msg, msgIdx) {
                            if (msg.role === 'user') {
                                return (
                                    '<div class="cs-msg cs-msg-user">' +
                                    '  <div class="cs-user-bubble">' +
                                    formatSimpleMarkdown(msg.text) +
                                    '  </div>' +
                                    '</div>'
                                );
                            }
                            var cleanText = stripTrailingDisclaimer(msg.text);
                            var isLastBot = msgIdx === lastBotIdx && !activeBusy && !activeStreaming;
                            var renderedBody = msg.streaming ? stabilizeStreamingMarkdown(cleanText, false) : cleanText;
                            return (
                                '<div class="cs-msg cs-msg-bot' +
                                (msg.streaming ? ' is-streaming' : '') +
                                '" data-bot-msg-id="' +
                                escapeHtml(msg.id) +
                                '">' +
                                '  <div class="cs-bot-monogram" title="Coserse 1.0">' +
                                ICONS.spark +
                                '</div>' +
                                '  <div class="cs-bot-content">' +
                                '    <div class="cs-bot-text">' +
                                formatSimpleMarkdown(renderedBody) +
                                '</div>' +
                                (msg.reviewCard ? renderReviewCardHtml(msg) : '') +
                (msg.batchReviewCard ? renderBatchReviewCardHtml(msg) : '') +
                                renderExportFileCardHtml(msg) +
                                renderFollowUpChipsHtml(msg) +
                                '    <div class="cs-msg-actions"' +
                                (msg.streaming ? ' style="display:none"' : '') +
                                '>' +
                                buildBotActionsHtml(msg, isLastBot) +
                                '    </div>' +
                                '  </div>' +
                                '</div>'
                            );
                        })
                        .join('') +
                    (activeBusy
                        ? '<div class="cs-msg cs-msg-bot cs-msg-loading" aria-live="polite">' +
                          '  <div class="cs-bot-monogram" title="Coserse 1.0">' +
                          ICONS.spark +
                          '</div>' +
                          '  <div class="cs-bot-content">' +
                          '    <div class="cs-typing-wrap">' +
                          '      <span class="cs-typing-dots" aria-hidden="true"><span></span><span></span><span></span></span>' +
                          '      <span class="cs-typing-label">' +
                          escapeHtml(formatTypingLabelText(activeJob)) +
                          '</span>' +
                          '    </div>' +
                          '  </div>' +
                          '</div>'
                        : '');
                threadScrollEl.scrollTop = threadScrollEl.scrollHeight;
            }
            syncSendButtonState();
            updateScrollBottomVisibility();
            persistSessions();
        }

        async function refreshHealth() {
            try {
                var r = await fetch(apiBase + '/health', { headers: getHeaders(false) });
                var d = await r.json();
                state.health = d;
                if (d.runtime && d.runtime.engine_reachable) {
                    engineChipEl.innerHTML = '<span class="cs-dot ok"></span><span>Server Engine Aktif</span>';
                } else if (d.runtime && d.runtime.offline_fallback_enabled) {
                    engineChipEl.innerHTML = '<span class="cs-dot warn"></span><span>Sandbox Lokal</span>';
                } else {
                    engineChipEl.innerHTML = '<span class="cs-dot off"></span><span>Offline</span>';
                }
            } catch (_e) {
                engineChipEl.innerHTML = '<span class="cs-dot off"></span><span>Offline</span>';
            }
        }

        async function refreshQuota() {
            try {
                var r = await fetch(apiBase + '/quota?session_id=' + encodeURIComponent(state.activeSessionId), {
                    headers: getHeaders(false)
                });
                var d = await r.json();
                if (d && d.quota) {
                    state.quota = d.quota;
                    renderPopoverContent();
                }
            } catch (_e) {
                // ignore
            }
        }

        async function loadSessionMessagesFromServer(sessionId) {
            if (!sessionId || isSessionBusy(sessionId)) return;
            try {
                var r = await fetch(apiBase + '/sessions/' + encodeURIComponent(sessionId) + '/messages', {
                    headers: getHeaders(false)
                });
                if (!r.ok) return;
                var d = await r.json();
                if (!d || !Array.isArray(d.messages)) return;
                var target = state.sessions.find(function (s) {
                    return s.id === sessionId;
                });
                if (!target) return;
                if (d.session && d.session.title) {
                    target.title = d.session.title;
                }
                target.messages = d.messages.map(function (m) {
                    var meta = m.meta_json && typeof m.meta_json === 'object' ? m.meta_json : {};
                    return {
                        id: m.id,
                        role: m.role === 'assistant' ? 'assistant' : 'user',
                        text: m.content || '',
                        createdAt: m.created_at ? new Date(m.created_at).getTime() : Date.now(),
                        feedback: meta.feedback || null,
                        exportFileCard: meta.exportFileCard || null,
                        followUpActions: Array.isArray(meta.followUpActions) ? meta.followUpActions : null
                    };
                });
                target.messagesLoaded = true;
                renderMessages();
            } catch (_e) {
                // ignore
            }
        }

        async function loadSessionsFromServer() {
            try {
                var r = await fetch(apiBase + '/sessions', {
                    headers: getHeaders(false)
                });
                if (!r.ok) return;
                var d = await r.json();
                if (!d || !Array.isArray(d.sessions)) return;

                var localMap = {};
                (state.sessions || []).forEach(function (s) {
                    if (s && s.id) localMap[s.id] = s;
                });

                if (d.sessions.length === 0) {
                    var handoverOnly = (state.sessions || []).filter(function (s) {
                        return Boolean(s && s.handoverRef);
                    });
                    if (handoverOnly.length > 0) {
                        state.sessions = handoverOnly;
                    } else {
                        state.sessions = buildSeededHistory();
                    }
                    state.activeSessionId = state.sessions[0].id;
                    renderMessages();
                    return;
                }

                var serverSessions = d.sessions.map(function (row) {
                    var cached = localMap[row.id];
                    return {
                        id: row.id,
                        title: row.title || (cached && cached.title) || 'Obrolan Baru',
                        updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
                        pinned: cached ? Boolean(cached.pinned) : false,
                        archived: cached ? Boolean(cached.archived) : false,
                        messages: cached && Array.isArray(cached.messages) ? cached.messages : [],
                        messagesLoaded: false
                    };
                });

                (state.sessions || []).forEach(function (s) {
                    if (s && s.handoverRef && !serverSessions.some(function (x) { return x.id === s.id; })) {
                        serverSessions.unshift(s);
                    }
                });

                state.sessions = serverSessions;
                if (!state.sessions.some(function (s) { return s.id === state.activeSessionId; })) {
                    state.activeSessionId = state.sessions[0].id;
                }
                renderMessages();
                await loadSessionMessagesFromServer(state.activeSessionId);
            } catch (_e) {
                // ignore
            }
        }

        async function purgeCurrentSession(resetToEmpty) {
            try {
                var targetId = state.activeSessionId;
                var res = await fetch(apiBase + '/session?session_id=' + encodeURIComponent(targetId), {
                    method: 'DELETE',
                    headers: getHeaders(false)
                });
                var data = await res.json();
                if (data && data.quota) {
                    state.quota = data.quota;
                    renderPopoverContent();
                }
                if (resetToEmpty) {
                    state.sessions = state.sessions.filter(function (s) {
                        return s.id !== targetId;
                    });
                    if (state.sessions.length === 0) {
                        state.sessions = buildSeededHistory();
                    }
                    state.activeSessionId = state.sessions[0].id;
                    renderMessages();
                }
                if (data && data.message) showBanner(data.message, 'ok');
            } catch (e) {
                showBanner('Gagal membersihkan memori sesi: ' + (e.message || e), 'error');
            }
        }

        async function purgeAllConversations() {
            try {
                var res = await fetch(apiBase + '/sessions', {
                    method: 'DELETE',
                    headers: getHeaders(false)
                });
                var data = null;
                try {
                    data = await res.json();
                } catch (_je) {
                    data = null;
                }
                if (data && data.quota) {
                    state.quota = data.quota;
                    renderPopoverContent();
                }
            } catch (_err) {
                // ignore
            }
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch (_le) {
                // ignore
            }
            var fresh = {
                id: makeSessionId(),
                title: 'Obrolan Baru',
                updatedAt: Date.now(),
                messages: [],
                messagesLoaded: true
            };
            state.sessions = [fresh];
            state.activeSessionId = fresh.id;
            renderMessages();
            refreshQuota();
            showBanner('Seluruh riwayat percakapan dan memori sesi dibersihkan (0 MB).', 'ok');
        }

        async function uploadFileToRamSandbox(file, hintText) {
            if (!file) return;
            var active = getActiveSession();
            if (!active) return;

            if (active.title === 'Obrolan Baru') {
                active.title = 'Dokumen: ' + file.name.slice(0, 24);
            }
            active.updatedAt = Date.now();
            active.messages.push({
                id: 'u-' + Date.now(),
                role: 'user',
                text:
                    'Analisis dokumen: **' +
                    file.name +
                    '** (' +
                    (file.size / 1024).toFixed(1) +
                    ' KB)' +
                    (hintText ? '\n' + hintText : '')
            });
            renderMessages();

            var localImageUrl = null;
            if (file.type && file.type.indexOf('image/') === 0) {
                localImageUrl = await new Promise(function (resolve) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        resolve(null);
                    };
                    reader.readAsDataURL(file);
                });
            }

            var uploadSid = active.id;
            var fd = new FormData();
            fd.append('file', file, file.name);
            fd.append('session_id', uploadSid);
            if (hintText) fd.append('hint', hintText);

            beginSessionJob(uploadSid, { busy: true, streaming: false, queueStatusText: 'Coserse sedang membaca dokumen...' });
            try {
                var res = await fetch(apiBase + '/document/parse', {
                    method: 'POST',
                    headers: getHeaders(false),
                    body: fd
                });
                var data = await res.json();
                if (!res.ok) {
                    active.messages.push({
                        id: 'b-' + Date.now(),
                        role: 'assistant',
                        createdAt: Date.now(),
                        text:
                            'Maaf ' +
                            currentHandle() +
                            ', berkas tidak dapat diproses: `' +
                            (data.message || 'Berkas tidak valid') +
                            '`.'
                    });
                } else {
                    active.messages.push({
                        id: 'b-' + Date.now(),
                        role: 'assistant',
                        createdAt: Date.now(),
                        text: data.assistant_message || data.assistant_summary || '',
                        reviewCard: data.review_card || data.draft || null,
                        batchReviewCard: data.batch_review_card || null,
                        cardStatus: 'PENDING',
                        imagePreview: localImageUrl
                    });
                }
            } catch (err) {
                active.messages.push({
                    id: 'b-' + Date.now(),
                    role: 'assistant',
                    createdAt: Date.now(),
                    text: 'Terjadi gangguan jaringan saat memproses dokumen: ' + (err.message || err)
                });
            } finally {
                endSessionJob(uploadSid);
                renderMessages();
                refreshQuota();
            }
        }

        function setPendingAttachment(file) {
            if (!file) {
                state.pendingAttachment = null;
                attachPreview.style.display = 'none';
                attachPreview.innerHTML = '';
                autoResizeInput();
                return;
            }
            state.pendingAttachment = file;
            var reader = new FileReader();
            reader.onload = function () {
                attachPreview.style.display = 'flex';
                attachPreview.innerHTML =
                    (file.type.indexOf('image/') === 0
                        ? '<img src="' + reader.result + '" class="cs-paste-thumb" alt="Paste"/>'
                        : '<span class="cs-att-ico">' + ICONS.fileText + '</span>') +
                    '<div class="cs-attach-info"><strong>' +
                    escapeHtml(file.name) +
                    '</strong> &bull; ' +
                    (file.size / 1024).toFixed(1) +
                    ' KB (siap diproses di RAM sandbox)</div>' +
                    '<button type="button" class="cs-clear-att" id="cs-clear-att" title="Hapus lampiran">' +
                    ICONS.close +
                    '</button>';
                attachPreview.querySelector('#cs-clear-att').addEventListener('click', function () {
                    setPendingAttachment(null);
                });
                autoResizeInput();
            };
            reader.readAsDataURL(file);
        }

        async function sendChatMessage(overrideText) {
            if (isTestingReadOnly) {
                showBanner('Mode Read-Only (Role Testing): tidak dapat mengirim pesan atau mengubah data.', 'warn');
                return;
            }
            if (isSessionBusy(state.activeSessionId)) return;
            var text = String(overrideText != null ? overrideText : inputEl.value || '').trim();
            var pending = state.pendingAttachment;

            if (pending) {
                if (overrideText == null) inputEl.value = '';
                autoResizeInput();
                setPendingAttachment(null);
                await uploadFileToRamSandbox(pending, text);
                return;
            }

            if (!text) return;
            var active = getActiveSession();
            if (!active) return;
            var jobSid = active.id;

            if (active.title === 'Obrolan Baru') {
                active.title = text.slice(0, 28) + (text.length > 28 ? '...' : '');
            }
            active.updatedAt = Date.now();
            active.messages.push({ id: 'u-' + Date.now(), role: 'user', text: text });
            if (overrideText == null) inputEl.value = '';

            var reqStartedAt = Date.now();
            var abortCtrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
            var job = beginSessionJob(jobSid, { busy: true, streaming: true, abortController: abortCtrl });
            syncSendButtonState();
            renderMessages();

            // Render ulang hanya jika sesi job ini sedang dibuka; selain itu cukup refresh sidebar.
            function rerenderIfVisible() {
                if (state.activeSessionId === jobSid) {
                    renderMessages();
                } else {
                    renderSidebar();
                    persistSessions();
                }
            }

            var streamMsg = null;
            var didInlineFinalize = false;
            function ensureStreamMessage() {
                if (!streamMsg) {
                    job.busy = false;
                    streamMsg = {
                        id: 'b-' + Date.now(),
                        role: 'assistant',
                        createdAt: Date.now(),
                        streaming: true,
                        text: ''
                    };
                    active.messages.push(streamMsg);
                }
                return streamMsg;
            }

            try {
                var res = await fetch(apiBase + '/ask/stream', {
                    method: 'POST',
                    headers: getHeaders(true),
                    signal: abortCtrl ? abortCtrl.signal : undefined,
                    body: JSON.stringify({
                        message: text,
                        session_id: jobSid,
                        model: state.selectedModel.id,
                        tier: state.selectedTier.id,
                        response_style: state.prefs && state.prefs.responseStyle === 'detailed' ? 'detail' : 'ringkas'
                    })
                });

                var contentType = String(res.headers.get('content-type') || '').toLowerCase();
                if (!res.ok || contentType.indexOf('text/event-stream') === -1 || !res.body || typeof res.body.getReader !== 'function') {
                    var data = null;
                    try {
                        data = await res.json();
                    } catch (_je) {
                        data = null;
                    }
                    if (data && data.quota) {
                        state.quota = data.quota;
                        renderPopoverContent();
                    }
                    job.busy = false;
                    active.messages.push({
                        id: 'b-' + Date.now(),
                        role: 'assistant',
                        createdAt: Date.now(),
                        exportFileCard: !isTestingReadOnly && data ? data.exportFileCard || data.export_file_card || null : null,
                        followUpActions: !isTestingReadOnly && data && Array.isArray(data.followUpActions) ? data.followUpActions : null,
                        text: !res.ok
                            ? (data && data.message) || 'Gagal memproses permintaan (' + res.status + ').'
                            : (data && data.reply) || 'Gagal membaca respons layanan Coserse.'
                    });
                } else {
                    var reader = res.body.getReader();
                    var decoder = new TextDecoder('utf-8');
                    var sseBuffer = '';

                    function updateTypingLabelInPlace(txt) {
                        job.queueStatusText = txt;
                        if (state.activeSessionId !== jobSid) {
                            return;
                        }
                        var lbl = threadEl ? threadEl.querySelector('.cs-typing-label') : null;
                        if (lbl) {
                            lbl.textContent = formatTypingLabelText(job);
                        }
                    }

                    function processSseBlock(block) {
                        var lines = block.split(/\r?\n/);
                        var eventName = 'message';
                        var dataLines = [];
                        for (var li = 0; li < lines.length; li++) {
                            var line = lines[li];
                            if (!line || line.charAt(0) === ':') continue;
                            if (line.indexOf('event:') === 0) {
                                eventName = line.slice(6).trim();
                            } else if (line.indexOf('data:') === 0) {
                                dataLines.push(line.slice(5).trim());
                            }
                        }
                        if (!dataLines.length) return;
                        var rawPayload = dataLines.join('\n');
                        var payload = null;
                        try {
                            payload = JSON.parse(rawPayload);
                        } catch (_pe) {
                            return;
                        }

                        if (eventName === 'queue') {
                            if (payload && payload.message) {
                                updateTypingLabelInPlace(payload.message);
                            }
                        } else if (eventName === 'status') {
                            if (payload && payload.phase === 'analyzing') {
                                updateTypingLabelInPlace('Coserse sedang menganalisis...');
                            }
                        } else if (eventName === 'token') {
                            var delta = payload && typeof payload.token === 'string' ? payload.token : '';
                            if (delta) {
                                job.queueStatusText = null;
                                var targetMsg = ensureStreamMessage();
                                targetMsg.text += delta;
                                // Sesi lain sedang dibuka: data tetap terakumulasi di sesi job, tanpa menyentuh DOM thread.
                                if (state.activeSessionId === jobSid && !updateStreamBubbleInPlace(targetMsg, false, jobSid)) {
                                    renderMessages();
                                }
                            }
                        } else if (eventName === 'batch_review_card') {
                            if (!isTestingReadOnly && payload && Array.isArray(payload.items)) {
                                var batchTarget = ensureStreamMessage();
                                batchTarget.batchReviewCard = payload;
                                batchTarget.cardStatus = 'PENDING';
                            }
                        } else if (eventName === 'review_card') {
                            if (!isTestingReadOnly && payload && (payload.lp_id || payload.nomor_lp || payload.draft_id)) {
                                var cardTarget = ensureStreamMessage();
                                cardTarget.reviewCard = payload;
                                cardTarget.cardStatus = payload.cardStatus || 'PENDING';
                            }
                        } else if (eventName === 'export_file_card') {
                            if (!isTestingReadOnly && payload && payload.download_url) {
                                var expTarget = ensureStreamMessage();
                                expTarget.exportFileCard = payload;
                            }
                        } else if (eventName === 'done') {
                            if (payload && payload.quota) {
                                state.quota = payload.quota;
                                renderPopoverContent();
                            }
                            if (payload && payload.title && (!active.title || active.title === 'Obrolan Baru')) {
                                active.title = payload.title;
                                renderSidebar();
                            }
                            active.messagesLoaded = true;
                            var finalMsg = ensureStreamMessage();
                            finalMsg.streaming = false;
                            finalMsg.durationSec = Math.max(0.1, Math.round(((Date.now() - reqStartedAt) / 1000) * 10) / 10);
                            if (payload && payload.message_id) {
                                finalMsg.id = payload.message_id;
                            }
                            if (payload && typeof payload.reply === 'string' && payload.reply.trim()) {
                                finalMsg.text = payload.reply;
                            }
                            if (!isTestingReadOnly && payload && payload.review_card && !finalMsg.reviewCard) {
                                finalMsg.reviewCard = payload.review_card;
                                finalMsg.cardStatus = payload.review_card.cardStatus || 'PENDING';
                            }
                            if (!isTestingReadOnly && payload && payload.batch_review_card && !finalMsg.batchReviewCard) {
                                finalMsg.batchReviewCard = payload.batch_review_card;
                                finalMsg.cardStatus = 'PENDING';
                            }
                            if (!isTestingReadOnly && payload && (payload.exportFileCard || payload.export_file_card)) {
                                finalMsg.exportFileCard = payload.exportFileCard || payload.export_file_card;
                            }
                            if (!isTestingReadOnly && payload && Array.isArray(payload.followUpActions)) {
                                finalMsg.followUpActions = payload.followUpActions;
                            }
                            job.busy = false;
                            job.streaming = false;
                            didInlineFinalize = state.activeSessionId === jobSid && updateStreamBubbleInPlace(finalMsg, true, jobSid);
                            endSessionJob(jobSid);
                            if (!didInlineFinalize) {
                                rerenderIfVisible();
                            } else {
                                renderSidebar();
                                syncSendButtonState();
                                persistSessions();
                            }
                        } else if (eventName === 'error') {
                            var errTarget = ensureStreamMessage();
                            errTarget.streaming = false;
                            var errText = (payload && payload.message) || 'Terjadi gangguan saat streaming jawaban Coserse.';
                            errTarget.text = errTarget.text ? errTarget.text + '\n\n' + errText : errText;
                            job.busy = false;
                            job.streaming = false;
                            didInlineFinalize = state.activeSessionId === jobSid && updateStreamBubbleInPlace(errTarget, true, jobSid);
                            endSessionJob(jobSid);
                            if (!didInlineFinalize) {
                                rerenderIfVisible();
                            } else {
                                renderSidebar();
                                syncSendButtonState();
                                persistSessions();
                            }
                        }
                    }

                    while (true) {
                        var step = await reader.read();
                        if (step.done) break;
                        sseBuffer += decoder.decode(step.value, { stream: true });
                        var parts = sseBuffer.split(/\r?\n\r?\n/);
                        sseBuffer = parts.pop() || '';
                        for (var pi = 0; pi < parts.length; pi++) {
                            if (parts[pi].trim()) {
                                processSseBlock(parts[pi]);
                            }
                        }
                    }
                    sseBuffer += decoder.decode();
                    if (sseBuffer.trim()) {
                        processSseBlock(sseBuffer);
                    }
                }
            } catch (err) {
                job.busy = false;
                var isAborted = err && (err.name === 'AbortError' || String(err.message || '').toLowerCase().indexOf('abort') !== -1);
                if (isAborted) {
                    if (streamMsg && streamMsg.text) {
                        streamMsg.streaming = false;
                        streamMsg.durationSec = Math.max(0.1, Math.round(((Date.now() - reqStartedAt) / 1000) * 10) / 10);
                        streamMsg.text += '\n\n*(Respons dihentikan oleh pengguna)*';
                    } else {
                        active.messages.push({
                            id: 'b-' + Date.now(),
                            role: 'assistant',
                            createdAt: Date.now(),
                            text: '*(Respons dihentikan oleh pengguna)*'
                        });
                    }
                } else if (streamMsg && streamMsg.text) {
                    streamMsg.streaming = false;
                    streamMsg.text += '\n\n*(Koneksi streaming terputus: ' + (err.message || err) + ')*';
                } else {
                    active.messages.push({
                        id: 'b-' + Date.now(),
                        role: 'assistant',
                        createdAt: Date.now(),
                        text: 'Koneksi ke layanan Coserse terputus: ' + (err.message || err)
                    });
                }
            } finally {
                if (streamMsg) streamMsg.streaming = false;
                endSessionJob(jobSid);
                if (!didInlineFinalize) {
                    rerenderIfVisible();
                } else {
                    renderSidebar();
                    persistSessions();
                }
                syncSendButtonState();
                refreshQuota();
            }
        }

        function saveCardEditInputs(cardEl, msg) {
            cardEl.querySelectorAll('[data-field]').forEach(function (el) {
                var key = el.getAttribute('data-field');
                if (key === 'tersangka') {
                    msg.reviewCard.tersangka = String(el.value || '')
                        .split(',')
                        .map(function (x) {
                            return x.trim();
                        })
                        .filter(Boolean);
                } else if (key === 'doc_type_code') {
                    var found = DOC_TYPE_OPTIONS.find(function (o) {
                        return o.code === el.value;
                    });
                    msg.reviewCard.doc_type_code = el.value;
                    if (found) {
                        msg.reviewCard.doc_type_nama = found.label;
                        msg.reviewCard.target_status_code = found.status;
                    }
                } else {
                    msg.reviewCard[key] = el.value;
                }
            });
        }

        var SETTINGS_META = {
            general: {
                title: 'Umum',
                subtitle: 'Atur cara Coserse menjawab dan kenyamanan penggunaan sehari-hari.'
            },
            models: {
                title: 'Model & Kuota',
                subtitle: 'Pantau status asisten aktif, hak pelatihan model, dan sisa kuota Anda.'
            },
            privacy: {
                title: 'Riwayat & Privasi',
                subtitle: 'Kelola keamanan berkas sementara dan pembersihan riwayat percakapan.'
            },
            guide: {
                title: 'Panduan & Ketentuan',
                subtitle: 'Ringkasan tata kelola dinas penggunaan Coserse dan penafian resmi.'
            }
        };

        function renderSettingsBody() {
            var q = getQuotaSnapshot();
            var active = getActiveSession();
            var tabKey = SETTINGS_META[state.settingsTab] ? state.settingsTab : 'general';
            state.settingsTab = tabKey;

            settingsTabsEl.querySelectorAll('.cs-set-nav-item').forEach(function (btn) {
                btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
            });
            if (settingsTitleEl) settingsTitleEl.textContent = SETTINGS_META[tabKey].title;
            if (settingsSubtitleEl) settingsSubtitleEl.textContent = SETTINGS_META[tabKey].subtitle;

            if (tabKey === 'general') {
                var isTactical = state.prefs.responseStyle !== 'detailed';
                var sendEnterOn = state.prefs.sendOnEnter !== false;
                var quickPromptsOn = state.prefs.showQuickPrompts !== false;
                settingsBody.innerHTML =
                    '<div class="cs-set-section">' +
                    '  <div class="cs-set-title">Gaya Jawaban</div>' +
                    '  <div class="cs-set-rows">' +
                    '    <div class="cs-set-row">' +
                    '      <div class="cs-set-row-info">' +
                    '        <div class="cs-set-row-title">Cara Coserse Menjawab</div>' +
                    '        <div class="cs-set-row-desc">Pilih ringkasan singkat untuk respon cepat atau uraian lengkap untuk telaah perkara.</div>' +
                    '      </div>' +
                    '      <div class="cs-seg-ctrl" role="group" aria-label="Cara Coserse menjawab">' +
                    '        <button type="button" class="cs-seg-btn' + (isTactical ? ' active' : '') + '" data-pref-style="tactical">Ringkas &amp; Padat</button>' +
                    '        <button type="button" class="cs-seg-btn' + (!isTactical ? ' active' : '') + '" data-pref-style="detailed">Lengkap &amp; Detail</button>' +
                    '      </div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>' +
                    '<div class="cs-set-section">' +
                    '  <div class="cs-set-title">Kenyamanan Mengetik &amp; Tampilan</div>' +
                    '  <div class="cs-set-rows">' +
                    '    <div class="cs-set-row">' +
                    '      <div class="cs-set-row-info">' +
                    '        <div class="cs-set-row-title">Kirim Pesan dengan Enter</div>' +
                    '        <div class="cs-set-row-desc">Jika dimatikan, tombol Enter membuat baris baru dan pesan dikirim memakai tombol Kirim.</div>' +
                    '      </div>' +
                    '      <button type="button" class="cs-switch' + (sendEnterOn ? ' on' : '') + '" id="cs-pref-enter-switch" aria-pressed="' + (sendEnterOn ? 'true' : 'false') + '"><span class="cs-switch-knob"></span></button>' +
                    '    </div>' +
                    '    <div class="cs-set-row">' +
                    '      <div class="cs-set-row-info">' +
                    '        <div class="cs-set-row-title">Tampilkan Saran Pertanyaan Cepat</div>' +
                    '        <div class="cs-set-row-desc">Menampilkan atau menyembunyikan tombol pintasan contoh perintah di atas kolom ketik.</div>' +
                    '      </div>' +
                    '      <button type="button" class="cs-switch' + (quickPromptsOn ? ' on' : '') + '" id="cs-pref-prompts-switch" aria-pressed="' + (quickPromptsOn ? 'true' : 'false') + '"><span class="cs-switch-knob"></span></button>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';

                settingsBody.querySelectorAll('[data-pref-style]').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        state.prefs.responseStyle = btn.getAttribute('data-pref-style') || 'tactical';
                        savePrefs(state.prefs);
                        renderSettingsBody();
                    });
                });
                var enterSwitch = settingsBody.querySelector('#cs-pref-enter-switch');
                if (enterSwitch) {
                    enterSwitch.addEventListener('click', function () {
                        state.prefs.sendOnEnter = !(state.prefs.sendOnEnter !== false);
                        savePrefs(state.prefs);
                        renderSettingsBody();
                    });
                }
                var promptsSwitch = settingsBody.querySelector('#cs-pref-prompts-switch');
                if (promptsSwitch) {
                    promptsSwitch.addEventListener('click', function () {
                        if (isTestingReadOnly) return;
                        state.prefs.showQuickPrompts = !(state.prefs.showQuickPrompts !== false);
                        savePrefs(state.prefs);
                        applyQuickPromptsVisibility();
                        renderSettingsBody();
                    });
                }
                return;
            }

            if (tabKey === 'models') {
                var wkEff = Math.max(1, q.tokens.weekly_effective_limit || 100000);
                var h5Eff = Math.max(1, q.tokens.five_hour_effective_limit || 20000);
                var wkLeftPct = Math.round(((q.tokens.weekly_remaining || 0) / wkEff) * 100);
                var h5LeftPct = Math.round(((q.tokens.five_hour_remaining || 0) / h5Eff) * 100);
                var memFreePct = Math.max(0, 100 - Math.min(100, Math.round(q.memory.usage_percent || 0)));

                var ringColor = function (pct) {
                    if (pct <= 15) return '#dc2626';
                    if (pct <= 40) return '#d97706';
                    return '#16a34a';
                };

                var authBadge = q.can_train_model
                    ? '<span class="cs-status-pill info">Aktif - Superadmin</span>'
                    : '<span class="cs-status-pill muted">Hanya Pakai</span>';

                var quotaBlockHtml = q.is_unlimited
                    ? '<div class="cs-unlimited-box">' +
                      '  <div class="cs-unlimited-title">Akses Superadmin • Kuota Tanpa Batas</div>' +
                      '  <div class="cs-unlimited-sub">Kapasitas penggunaan harian, mingguan, dan memori percakapan aktif penuh tanpa batas.</div>' +
                      '</div>'
                    : '<div class="cs-modal-quota-list">' +
                      '  <div class="cs-mq-row">' +
                      '    <div><div class="cs-mq-name">Batas Mingguan</div><div class="cs-mq-sub">' + escapeHtml(q.tokens.weekly_reset_in_text || '-') + '</div></div>' +
                      '    <div class="cs-mq-val"><span>' + wkLeftPct + '% tersisa</span>' + createRingSvg(wkLeftPct, ringColor(wkLeftPct), '#e2e8f0') + '</div>' +
                      '  </div>' +
                      '  <div class="cs-mq-row">' +
                      '    <div><div class="cs-mq-name">Batas 5 Jam</div><div class="cs-mq-sub">' + escapeHtml(q.tokens.five_hour_reset_in_text || '-') + '</div></div>' +
                      '    <div class="cs-mq-val"><span>' + h5LeftPct + '% tersisa</span>' + createRingSvg(h5LeftPct, ringColor(h5LeftPct), '#e2e8f0') + '</div>' +
                      '  </div>' +
                      '  <div class="cs-mq-row">' +
                      '    <div><div class="cs-mq-name">Memori Percakapan</div><div class="cs-mq-sub">' + q.memory.used_mb.toFixed(2) + ' MB / ' + q.memory.limit_mb + ' MB terpakai</div></div>' +
                      '    <div class="cs-mq-val"><span>' + memFreePct + '% tersisa</span>' + createRingSvg(memFreePct, ringColor(memFreePct), '#e2e8f0') + '</div>' +
                      '  </div>' +
                      '</div>';

                settingsBody.innerHTML =
                    '<div class="cs-set-section">' +
                    '  <div class="cs-set-title">Status Asisten &amp; Wewenang</div>' +
                    '  <div class="cs-set-rows">' +
                    '    <div class="cs-set-row">' +
                    '      <div class="cs-set-row-info">' +
                    '        <div class="cs-set-row-title">Asisten Aktif</div>' +
                    '        <div class="cs-set-row-desc">Coserse 1.0 (Aktif) &bull; Tingkat Respons: ' + escapeHtml(state.selectedTier.label) + '</div>' +
                    '      </div>' +
                    '      <span class="cs-status-pill ok"><span>Siap Digunakan</span></span>' +
                    '    </div>' +
                    '    <div class="cs-set-row">' +
                    '      <div class="cs-set-row-info">' +
                    '        <div class="cs-set-row-title">Hak Pelatihan Model</div>' +
                    '        <div class="cs-set-row-desc">Penyesuaian dan pelatihan model asisten dikelola secara terpusat oleh Superadmin.</div>' +
                    '      </div>' +
                    authBadge +
                    '    </div>' +
                    '  </div>' +
                    '</div>' +
                    '<div class="cs-set-section">' +
                    '  <div class="cs-set-title">Sisa Kuota (' + escapeHtml(q.tier_label || 'Standar') + ')</div>' +
                    quotaBlockHtml +
                    '</div>';
                return;
            }

            if (tabKey === 'privacy') {
                var memStatus = q.is_unlimited
                    ? 'Akses Superadmin • Kuota Tanpa Batas'
                    : q.memory.used_mb.toFixed(2) + ' MB / ' + q.memory.limit_mb + ' MB terpakai';
                settingsBody.innerHTML =
                    '<div class="cs-set-section">' +
                    '  <div class="cs-set-title">Keamanan &amp; Penanganan Berkas</div>' +
                    '  <div class="cs-set-rows">' +
                    '    <div class="cs-set-row">' +
                    '      <div class="cs-set-row-info">' +
                    '        <div class="cs-set-row-title">Keamanan Berkas Sementara</div>' +
                    '        <div class="cs-set-row-desc">Berkas Word, PDF, maupun tangkapan layar hanya dibaca sementara untuk diperiksa dan langsung dihapus otomatis, tidak tersimpan permanen di server.</div>' +
                    '      </div>' +
                    '      <span class="cs-status-pill ok"><span>Otomatis Dihapus</span></span>' +
                    '    </div>' +
                    '    <div class="cs-set-row">' +
                    '      <div class="cs-set-row-info">' +
                    '        <div class="cs-set-row-title">Percakapan Aktif Saat Ini</div>' +
                    '        <div class="cs-set-row-desc">' + escapeHtml(active ? active.title : 'Obrolan Baru') + ' &bull; ' + escapeHtml(memStatus) + '</div>' +
                    '      </div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>' +
                    '<div class="cs-set-section">' +
                    '  <div class="cs-set-title">Pembersihan Riwayat Obrolan</div>' +
                    '  <div class="cs-set-rows">' +
                    '    <div class="cs-set-row">' +
                    '      <div class="cs-set-row-info">' +
                    '        <div class="cs-set-row-title">Bersihkan Memori Percakapan Ini</div>' +
                    '        <div class="cs-set-row-desc">Mengosongkan pesan pada obrolan aktif ini agar kembali bersih.</div>' +
                    '      </div>' +
                    '      <button type="button" class="cs-btn-secondary" id="cs-modal-purge-btn">' + ICONS.trash + '<span>Bersihkan Memori Percakapan Ini</span></button>' +
                    '    </div>' +
                    '    <div class="cs-set-row">' +
                    '      <div class="cs-set-row-info">' +
                    '        <div class="cs-set-row-title">Hapus Semua Riwayat Obrolan</div>' +
                    '        <div class="cs-set-row-desc">Menghapus seluruh daftar percakapan yang tersimpan pada perangkat Anda.</div>' +
                    '      </div>' +
                    '      <button type="button" class="cs-btn-danger-solid" id="cs-modal-purge-all-btn">' + ICONS.alertTriangle + '<span>Hapus Semua Riwayat Obrolan</span></button>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';

                settingsBody.querySelector('#cs-modal-purge-btn').addEventListener('click', function () {
                    openConfirmModal({
                        title: 'Bersihkan memori percakapan ini?',
                        message: 'Seluruh isi obrolan dan memori di sesi ini akan dihapus permanen.',
                        confirmLabel: 'Ya, Hapus',
                        onConfirm: async function () {
                            await purgeCurrentSession(true);
                            settingsModal.style.display = 'none';
                        }
                    });
                });
                settingsBody.querySelector('#cs-modal-purge-all-btn').addEventListener('click', function () {
                    openConfirmModal({
                        title: 'Hapus semua riwayat obrolan?',
                        message: 'Seluruh daftar percakapan dan memori di semua sesi akan dihapus permanen.',
                        confirmLabel: 'Ya, Hapus',
                        onConfirm: async function () {
                            await purgeAllConversations();
                            settingsModal.style.display = 'none';
                        }
                    });
                });
                return;
            }

            settingsBody.innerHTML =
                '<div class="cs-set-section">' +
                '  <div class="cs-set-title">Tata Kelola Penggunaan Berkas &amp; Data Perkara</div>' +
                '  <ul class="cs-guide-list">' +
                '    <li><strong>Pemeriksaan Dokumen Mindik (SPDP, Tahap I, Tahap II):</strong> Unggahan dokumen Word, PDF, maupun tangkapan layar hanya diproses sementara untuk membantu penyusunan usulan data dan otomatis terhapus setelah selesai.</li>' +
                '    <li><strong>Wajib Pemeriksaan &amp; Persetujuan Petugas:</strong> Coserse tidak pernah mengubah data resmi Laporan Polisi secara otomatis. Setiap usulan pembaruan wajib diperiksa dan disetujui langsung oleh petugas melalui kartu konfirmasi.</li>' +
                '    <li><strong>Batasan Wilayah &amp; Tertib Administrasi:</strong> Penelusuran data hanya menampilkan perkara sesuai kewenangan satuan kerja masing-masing dan tercatat dalam riwayat aktivitas dinas.</li>' +
                '  </ul>' +
                '</div>' +
                '<div class="cs-set-section cs-disclaimer-box">' +
                '  <div class="cs-set-title">Penafian Resmi</div>' +
                '  <p class="cs-guide-disclaimer">' +
                escapeHtml(DISCLAIMER) +
                '</p>' +
                '</div>';
        }

        function openSettingsModal() {
            renderSettingsBody();
            settingsModal.style.display = 'flex';
        }

        // Event bindings
        newChatBtn.addEventListener('click', function () {
            var newSess = {
                id: makeSessionId(),
                title: 'Obrolan Baru',
                updatedAt: Date.now(),
                messages: []
            };
            state.sessions.unshift(newSess);
            state.activeSessionId = newSess.id;
            if (isCompactViewport()) state.mobileDrawerOpen = false;
            renderMessages();
            refreshQuota();
            inputEl.focus();
        });

        sessionListEl.addEventListener('click', function (e) {
            if (e.target.closest('#cs-archive-toggle')) {
                state.showArchived = !state.showArchived;
                renderSidebar();
                return;
            }
            if (e.target.closest('[data-rename-input]')) {
                e.stopPropagation();
                return;
            }

            var pinBtn = e.target.closest('[data-quick-pin]');
            if (pinBtn) {
                e.stopPropagation();
                var pinId = pinBtn.getAttribute('data-quick-pin');
                var pinSess = state.sessions.find(function (s) {
                    return s.id === pinId;
                });
                if (pinSess) {
                    pinSess.pinned = !pinSess.pinned;
                    pinSess.archived = false;
                    persistSessions();
                    renderSidebar();
                }
                return;
            }

            var menuBtn = e.target.closest('[data-menu-session]');
            if (menuBtn) {
                e.stopPropagation();
                openSessionMenu(menuBtn.getAttribute('data-menu-session'), menuBtn);
                return;
            }

            var item = e.target.closest('[data-session-id]');
            if (item) {
                closeSessionMenu();
                var selectedSid = item.getAttribute('data-session-id');
                state.activeSessionId = selectedSid;
                if (isCompactViewport()) state.mobileDrawerOpen = false;
                renderMessages();
                refreshQuota();
                var selectedSess = state.sessions.find(function (s) {
                    return s.id === selectedSid;
                });
                if (selectedSess && (!selectedSess.messagesLoaded || !selectedSess.messages || selectedSess.messages.length === 0)) {
                    loadSessionMessagesFromServer(selectedSid);
                }
            }
        });

        function commitInlineRename(sessionId, newValue) {
            var cleaned = String(newValue || '').trim();
            var target = state.sessions.find(function (s) {
                return s.id === sessionId;
            });
            state.editingSessionId = null;
            if (target && cleaned) {
                target.title = cleaned.slice(0, 80);
                persistSessions();
            }
            renderSidebar();
        }

        sessionListEl.addEventListener('keydown', function (e) {
            var inp = e.target.closest('[data-rename-input]');
            if (!inp) return;
            var sid = inp.getAttribute('data-rename-input');
            if (e.key === 'Enter') {
                e.preventDefault();
                commitInlineRename(sid, inp.value);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                state.editingSessionId = null;
                renderSidebar();
            }
        });

        sessionListEl.addEventListener('focusout', function (e) {
            var inp = e.target.closest('[data-rename-input]');
            if (!inp || !state.editingSessionId) return;
            commitInlineRename(inp.getAttribute('data-rename-input'), inp.value);
        });

        if (sessMenuEl) {
            sessMenuEl.addEventListener('click', async function (e) {
                e.stopPropagation();
                var actBtn = e.target.closest('[data-sess-act]');
                if (!actBtn) return;
                var action = actBtn.getAttribute('data-sess-act');
                var targetId = state.openMenuSessionId;
                var target = state.sessions.find(function (s) {
                    return s.id === targetId;
                });
                closeSessionMenu();
                if (!target) return;

                if (action === 'rename') {
                    state.editingSessionId = target.id;
                    renderSidebar();
                    return;
                }
                if (action === 'pin') {
                    target.pinned = !target.pinned;
                    target.archived = false;
                    persistSessions();
                    renderSidebar();
                    return;
                }
                if (action === 'copy') {
                    var transcript = (target.messages || [])
                        .map(function (m) {
                            return (m.role === 'user' ? 'Petugas' : 'Coserse') + ':\n' + (m.text || '');
                        })
                        .join('\n\n');
                    var copyText = transcript || target.title || 'Obrolan Baru';
                    try {
                        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(copyText);
                        } else {
                            var ta = document.createElement('textarea');
                            ta.value = copyText;
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand('copy');
                            document.body.removeChild(ta);
                        }
                        showBanner('Isi percakapan berhasil disalin.', 'ok');
                    } catch (_err) {
                        showBanner('Tidak dapat menyalin percakapan ke clipboard.', 'error');
                    }
                    return;
                }
                if (action === 'archive') {
                    target.archived = !target.archived;
                    if (target.archived) target.pinned = false;
                    var nonArchived = state.sessions.filter(function (s) {
                        return !s.archived;
                    });
                    if (nonArchived.length === 0) {
                        var fresh = {
                            id: makeSessionId(),
                            title: 'Obrolan Baru',
                            updatedAt: Date.now(),
                            messages: []
                        };
                        state.sessions.unshift(fresh);
                        state.activeSessionId = fresh.id;
                    } else if (state.activeSessionId === target.id && target.archived) {
                        state.activeSessionId = nonArchived[0].id;
                    }
                    persistSessions();
                    renderMessages();
                    showBanner(
                        target.archived ? 'Percakapan dipindahkan ke Arsip.' : 'Percakapan dipulihkan dari Arsip.',
                        'ok'
                    );
                    return;
                }
                if (action === 'delete') {
                    openConfirmModal({
                        title: 'Hapus percakapan ini?',
                        message: 'Seluruh isi obrolan dan memori di sesi ini akan dihapus permanen.',
                        confirmLabel: 'Ya, Hapus',
                        onConfirm: async function () {
                            await deleteSessionById(target.id);
                        }
                    });
                }
            });
        }

        if (confirmCancelBtn) {
            confirmCancelBtn.addEventListener('click', closeConfirmModal);
        }
        if (confirmModalEl) {
            confirmModalEl.addEventListener('click', function (e) {
                if (e.target === confirmModalEl) closeConfirmModal();
            });
        }
        if (confirmOkBtn) {
            confirmOkBtn.addEventListener('click', async function () {
                var fn = state.pendingConfirmAction;
                closeConfirmModal();
                if (typeof fn === 'function') await fn();
            });
        }

        toggleSidebarBtn.addEventListener('click', function () {
            if (isCompactViewport()) {
                state.mobileDrawerOpen = !state.mobileDrawerOpen;
            } else {
                state.desktopSidebarOpen = !state.desktopSidebarOpen;
            }
            renderSidebar();
        });

        drawerBackdropEl.addEventListener('click', function () {
            state.mobileDrawerOpen = false;
            renderSidebar();
        });

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', function () {
                if (!isCompactViewport()) state.mobileDrawerOpen = false;
                renderSidebar();
            });
        }

        modelPill.addEventListener('click', function (e) {
            e.stopPropagation();
            setPopoverOpen(!state.popoverOpen);
        });

        sheetBackdropEl.addEventListener('click', function (e) {
            e.stopPropagation();
            setPopoverOpen(false);
        });

        usageTriggerEl.addEventListener('mouseenter', function () {
            if (!isCompactViewport() && state.popoverOpen && !state.usageFlyoutOpen) {
                state.tierFlyoutOpen = false;
                state.usageFlyoutOpen = true;
                renderPopoverContent();
            }
        });

        popoverEl.addEventListener('mouseover', function (e) {
            if (isCompactViewport() || !state.popoverOpen) return;
            if (e.target.closest('#cs-model-tier-trigger') && (!state.tierFlyoutOpen || state.usageFlyoutOpen)) {
                state.tierFlyoutOpen = true;
                state.usageFlyoutOpen = false;
                renderPopoverContent();
            }
        });

        popoverEl.addEventListener('click', function (e) {
            e.stopPropagation();
            if (e.target.closest('#cs-model-tier-trigger')) {
                state.usageFlyoutOpen = false;
                state.tierFlyoutOpen = isCompactViewport() ? true : !state.tierFlyoutOpen;
                renderPopoverContent();
                return;
            }
            var tierBtn = e.target.closest('[data-tier-id]');
            if (tierBtn) {
                var tid = tierBtn.getAttribute('data-tier-id');
                var foundTier = TIER_OPTIONS.find(function (t) {
                    return t.id === tid;
                });
                if (foundTier) {
                    state.selectedTier = foundTier;
                    state.prefs.selectedTier = foundTier.id;
                    savePrefs(state.prefs);
                    renderPopoverContent();
                }
                return;
            }
            if (e.target.closest('#cs-tier-back')) {
                state.tierFlyoutOpen = false;
                renderPopoverContent();
                return;
            }
            if (e.target.closest('#cs-usage-trigger')) {
                state.tierFlyoutOpen = false;
                state.usageFlyoutOpen = isCompactViewport() ? true : !state.usageFlyoutOpen;
                renderPopoverContent();
                return;
            }
            if (e.target.closest('#cs-usage-back')) {
                state.usageFlyoutOpen = false;
                renderPopoverContent();
                return;
            }
        });

        document.addEventListener('click', function () {
            if (state.popoverOpen) setPopoverOpen(false);
            if (state.openMenuSessionId) closeSessionMenu();
        });

        settingsBtn.addEventListener('click', openSettingsModal);
        settingsClose.addEventListener('click', function () {
            settingsModal.style.display = 'none';
        });
        settingsModal.addEventListener('click', function (e) {
            if (e.target === settingsModal) settingsModal.style.display = 'none';
        });
        settingsTabsEl.addEventListener('click', function (e) {
            var tabBtn = e.target.closest('[data-tab]');
            if (!tabBtn) return;
            state.settingsTab = tabBtn.getAttribute('data-tab') || 'general';
            renderSettingsBody();
        });

        threadEl.addEventListener('change', function (e) {
            var chk = e.target.closest('input[data-batch-row-idx]');
            if (!chk || isTestingReadOnly) return;
            var active = getActiveSession();
            if (!active) return;
            var msgId = chk.getAttribute('data-batch-msg-id');
            var idx = Number(chk.getAttribute('data-batch-row-idx'));
            var msg = active.messages.find(function (m) { return m.id === msgId; });
            if (!msg || !msg.batchReviewCard || !msg.batchReviewCard.items[idx]) return;
            msg.batchReviewCard.items[idx].selected = Boolean(chk.checked);
            var selCount = msg.batchReviewCard.items.filter(function (i) { return i.action === 'UPDATE' && i.selected !== false; }).length;
            var card = chk.closest('.cs-batch-card');
            var appBtn = card && card.querySelector('[data-batch-action="approve-batch"]');
            if (appBtn) {
                appBtn.disabled = selCount === 0;
                var span = appBtn.querySelector('span');
                if (span) span.textContent = 'Terapkan Update Massal (' + selCount + ' LP)';
            }
        });

        threadEl.addEventListener('click', async function (e) {
            var batchBtn = e.target.closest('button[data-batch-action]');
            if (batchBtn) {
                if (isTestingReadOnly) return;
                var bAction = batchBtn.getAttribute('data-batch-action');
                var bMsgId = batchBtn.getAttribute('data-msg-id');
                var bActive = getActiveSession();
                if (!bActive) return;
                var bMsg = bActive.messages.find(function (m) { return m.id === bMsgId; });
                if (!bMsg || !bMsg.batchReviewCard) return;
                if (bAction === 'cancel-batch') {
                    bMsg.cardStatus = 'CANCELLED';
                    bMsg.commitMessage = 'Batch update dibatalkan oleh operator. Tidak ada perubahan pada database.';
                    renderMessages();
                    return;
                }
                if (bAction === 'approve-batch') {
                    var selectedItems = (bMsg.batchReviewCard.items || []).filter(function (it) {
                        return it.action === 'UPDATE' && it.selected !== false && it.lp_id;
                    }).map(function (it) {
                        return {
                            lp_id: it.lp_id,
                            nomor_lp: it.no_laporan_db || it.nomor_lp,
                            status_baru: it.status_baru,
                            tanggal_selra: it.tanggal_selra,
                            alasan: it.alasan
                        };
                    });
                    if (!selectedItems.length) return;
                    batchBtn.disabled = true;
                    batchBtn.textContent = 'Menyimpan (' + selectedItems.length + ' LP)...';
                    try {
                        var bRes = await fetch(apiBase + '/document/commit-batch', {
                            method: 'POST',
                            headers: getHeaders(true),
                            body: JSON.stringify({
                                batch_id: bMsg.batchReviewCard.batch_id,
                                operator_confirmed: true,
                                items: selectedItems
                            })
                        });
                        var bData = await bRes.json();
                        if (!bRes.ok) {
                            batchBtn.disabled = false;
                            batchBtn.innerHTML = ICONS.check + '<span>Terapkan Update Massal (' + selectedItems.length + ' LP)</span>';
                            showBanner(bData.message || 'Gagal menerapkan batch update LP.', 'error');
                            return;
                        }
                        var bPayload = (bData && bData.data) ? bData.data : (bData || {});
                        var bUpdCount = bPayload.updated_count !== undefined ? bPayload.updated_count : selectedItems.length;
                        bMsg.cardStatus = 'APPROVED';
                        bMsg.commitMessage =
                            'Tersimpan Resmi (' +
                            bUpdCount +
                            ' LP diperbarui, ' +
                            (bMsg.batchReviewCard.skip_count || 0) +
                            ' dilewati) • Audit: AI_BATCH_LP_UPDATE_APPROVED';
                        showBanner(bPayload.message || ('Berhasil memperbarui ' + bUpdCount + ' LP.'), 'ok');
                        renderMessages();
                    } catch (err) {
                        batchBtn.disabled = false;
                        showBanner('Error menyimpan batch update: ' + (err.message || err), 'error');
                    }
                }
                return;
            }
            var expBtn = e.target.closest('[data-export-download]');
            if (expBtn) {
                if (isTestingReadOnly) {
                    showBanner('Mode Lihat (Read-Only): Role Testing tidak diizinkan mengunduh file ekspor.', 'warn');
                    return;
                }
                var dlUrl = expBtn.getAttribute('data-export-url');
                var dlName = expBtn.getAttribute('data-export-filename') || 'Coserse_Export.pdf';
                if (!dlUrl) return;
                var origText = expBtn.innerHTML;
                expBtn.disabled = true;
                expBtn.textContent = 'Mengunduh...';
                try {
                    var dlRes = await fetch(dlUrl, { method: 'GET', headers: getHeaders(false) });
                    if (!dlRes.ok) {
                        var dlErr = null;
                        try { dlErr = await dlRes.json(); } catch (_ee) {}
                        throw new Error((dlErr && dlErr.message) || 'Gagal mengunduh file (' + dlRes.status + ').');
                    }
                    var dlBlob = await dlRes.blob();
                    var objUrl = URL.createObjectURL(dlBlob);
                    var aEl = document.createElement('a');
                    aEl.href = objUrl;
                    aEl.download = dlName;
                    document.body.appendChild(aEl);
                    aEl.click();
                    document.body.removeChild(aEl);
                    setTimeout(function () { URL.revokeObjectURL(objUrl); }, 5000);
                    showBanner('File berhasil diunduh: ' + dlName, 'ok');
                } catch (errExp) {
                    showBanner('Gagal unduh file: ' + (errExp.message || errExp), 'error');
                } finally {
                    expBtn.disabled = false;
                    expBtn.innerHTML = origText;
                }
                return;
            }
            var followChip = e.target.closest('[data-followup-prompt]');
            if (followChip) {
                if (isTestingReadOnly || isSessionBusy(state.activeSessionId)) return;
                var fp = followChip.getAttribute('data-followup-prompt');
                if (fp) sendChatMessage(fp);
                return;
            }
            var codeCopyBtn = e.target.closest('[data-code-copy]');
            if (codeCopyBtn) {
                var codeBlock = codeCopyBtn.closest('.cs-code-block');
                var codeEl = codeBlock ? codeBlock.querySelector('code') : null;
                var rawCode = codeEl ? codeEl.textContent || '' : '';
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(rawCode);
                    } else {
                        var taC = document.createElement('textarea');
                        taC.value = rawCode;
                        taC.style.position = 'fixed';
                        taC.style.opacity = '0';
                        document.body.appendChild(taC);
                        taC.select();
                        document.execCommand('copy');
                        document.body.removeChild(taC);
                    }
                    codeCopyBtn.innerHTML = ICONS.check + '<span>Tersalin</span>';
                    setTimeout(function () {
                        codeCopyBtn.innerHTML = ICONS.copy + '<span>Salin</span>';
                    }, 1500);
                } catch (_ce) {
                    showBanner('Gagal menyalin blok kode.', 'error');
                }
                return;
            }

            var msgActBtn = e.target.closest('[data-msg-action]');
            if (msgActBtn) {
                var msgAction = msgActBtn.getAttribute('data-msg-action');
                var targetMsgId = msgActBtn.getAttribute('data-msg-id');
                var activeSess = getActiveSession();
                if (!activeSess) return;
                var targetMsg = (activeSess.messages || []).find(function (m) {
                    return m.id === targetMsgId;
                });
                if (!targetMsg) return;

                if (msgAction === 'regenerate') {
                    if (isTestingReadOnly || isSessionBusy(state.activeSessionId)) return;
                    var msgsArr = activeSess.messages || [];
                    var lastUserText = '';
                    for (var ui = msgsArr.length - 1; ui >= 0; ui--) {
                        if (msgsArr[ui].role === 'user' && String(msgsArr[ui].text || '').trim()) {
                            lastUserText = String(msgsArr[ui].text).trim();
                            break;
                        }
                    }
                    if (!lastUserText) return;
                    if (msgsArr.length && msgsArr[msgsArr.length - 1].id === targetMsgId) {
                        msgsArr.pop();
                    }
                    if (msgsArr.length && msgsArr[msgsArr.length - 1].role === 'user') {
                        msgsArr.pop();
                    }
                    sendChatMessage(lastUserText);
                    return;
                }

                if (msgAction === 'copy') {
                    var plain = stripTrailingDisclaimer(targetMsg.text);
                    try {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(plain);
                        } else {
                            var taCopy = document.createElement('textarea');
                            taCopy.value = plain;
                            taCopy.style.position = 'fixed';
                            taCopy.style.opacity = '0';
                            document.body.appendChild(taCopy);
                            taCopy.select();
                            document.execCommand('copy');
                            document.body.removeChild(taCopy);
                        }
                        msgActBtn.classList.add('copied');
                        msgActBtn.innerHTML = ICONS.check;
                        setTimeout(function () {
                            msgActBtn.classList.remove('copied');
                            msgActBtn.innerHTML = ICONS.copy;
                        }, 1500);
                    } catch (_e) {
                        showBanner('Gagal menyalin jawaban ke clipboard.', 'error');
                    }
                    return;
                }

                if (msgAction === 'like' || msgAction === 'dislike') {
                    var nextVal = msgAction === 'like' ? 'up' : 'down';
                    targetMsg.feedback = targetMsg.feedback === nextVal ? null : nextVal;
                    persistSessions();

                    var actionsWrap = msgActBtn.closest('.cs-msg-actions');
                    if (actionsWrap) {
                        var upBtn = actionsWrap.querySelector('[data-msg-action="like"]');
                        var downBtn = actionsWrap.querySelector('[data-msg-action="dislike"]');
                        if (upBtn) {
                            upBtn.classList.toggle('active-up', targetMsg.feedback === 'up');
                            upBtn.setAttribute('aria-pressed', targetMsg.feedback === 'up' ? 'true' : 'false');
                        }
                        if (downBtn) {
                            downBtn.classList.toggle('active-down', targetMsg.feedback === 'down');
                            downBtn.setAttribute('aria-pressed', targetMsg.feedback === 'down' ? 'true' : 'false');
                        }
                    }

                    fetch(apiBase + '/feedback', {
                        method: 'POST',
                        headers: getHeaders(true),
                        body: JSON.stringify({
                            session_id: state.activeSessionId,
                            message_id: targetMsg.id,
                            rating: targetMsg.feedback || 'clear'
                        })
                    }).catch(function () {});
                    return;
                }
            }

            var btn = e.target.closest('[data-card-action]');
            if (!btn) return;
            var action = btn.getAttribute('data-card-action');
            var msgId = btn.getAttribute('data-msg-id');
            var active = getActiveSession();
            if (!active) return;
            var msg = active.messages.find(function (m) {
                return m.id === msgId;
            });
            if (!msg || !msg.reviewCard) return;

            var cardEl = btn.closest('.cs-review-card');

            if (action === 'toggle-edit') {
                if (msg.cardStatus === 'EDITING') {
                    saveCardEditInputs(cardEl, msg);
                    msg.cardStatus = 'PENDING';
                } else {
                    msg.cardStatus = 'EDITING';
                }
                renderMessages();
                return;
            }

            if (action === 'cancel') {
                msg.cardStatus = 'CANCELLED';
                msg.commitMessage = 'Draf dibatalkan oleh operator. Tidak ada perubahan pada database.';
                renderMessages();
                return;
            }

            if (action === 'approve') {
                if (msg.cardStatus === 'EDITING' && cardEl) saveCardEditInputs(cardEl, msg);
                btn.disabled = true;
                btn.textContent = 'Menyimpan...';
                try {
                    var res = await fetch(apiBase + '/document/commit', {
                        method: 'POST',
                        headers: getHeaders(true),
                        body: JSON.stringify({
                            draft_id: msg.reviewCard.draft_id,
                            lp_id: msg.reviewCard.lp_id,
                            nomor_lp: msg.reviewCard.nomor_lp,
                            doc_type_code: msg.reviewCard.doc_type_code,
                            target_status_code: msg.reviewCard.target_status_code,
                            nomor_dokumen: msg.reviewCard.nomor_dokumen,
                            tanggal_dokumen: msg.reviewCard.tanggal_dokumen,
                            tanggal_dokumen_iso: msg.reviewCard.tanggal_dokumen_iso,
                            tersangka: msg.reviewCard.tersangka,
                            kejaksaan_tujuan: msg.reviewCard.kejaksaan_tujuan,
                            alasan_penghentian: msg.reviewCard.alasan_penghentian,
                            source_filename: msg.reviewCard.source_filename,
                            operator_confirmed: true
                        })
                    });
                    var data = await res.json();
                    if (!res.ok) {
                        btn.disabled = false;
                        btn.innerHTML = ICONS.check + '<span>Setujui &amp; Simpan</span>';
                        showBanner(data.message || 'Gagal menyimpan draf dokumen.', 'error');
                        return;
                    }
                    msg.cardStatus = 'APPROVED';
                    msg.commitMessage =
                        'Dokumen #' +
                        (data.dokumen_id || '-') +
                        ' tersimpan resmi (' +
                        data.previous_status +
                        ' -> ' +
                        data.new_status +
                        ') • Audit: AI_DOC_INPUT_APPROVED';
                    showBanner(
                        'Berkas LP nomor ' +
                            data.no_laporan +
                            ' berhasil diperbarui ke status ' +
                            data.new_status +
                            '.',
                        'ok'
                    );
                    renderMessages();
                } catch (err) {
                    btn.disabled = false;
                    showBanner('Error menyimpan draf: ' + (err.message || err), 'error');
                }
            }
        });

        container.querySelector('#cs-pills').addEventListener('click', function (e) {
            if (isTestingReadOnly) return;
            var pill = e.target.closest('.cs-pill');
            if (!pill) return;
            if (pill.getAttribute('data-action') === 'upload') {
                fileInput.click();
                return;
            }
            inputEl.value = pill.getAttribute('data-prompt') || '';
            autoResizeInput();
            inputEl.focus();
        });

        clipBtn.addEventListener('click', function () {
            if (isTestingReadOnly) return;
            fileInput.click();
        });
        fileInput.addEventListener('change', function () {
            if (isTestingReadOnly) {
                fileInput.value = '';
                return;
            }
            if (fileInput.files && fileInput.files[0]) {
                uploadFileToRamSandbox(fileInput.files[0]);
                fileInput.value = '';
            }
        });

        dropZone.addEventListener('dragover', function (e) {
            if (isTestingReadOnly) return;
            e.preventDefault();
            dropOverlay.classList.add('active');
        });
        dropZone.addEventListener('dragleave', function (e) {
            if (e.target === dropOverlay) dropOverlay.classList.remove('active');
        });
        dropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            dropOverlay.classList.remove('active');
            if (isTestingReadOnly) return;
            var files = e.dataTransfer && e.dataTransfer.files;
            if (files && files[0]) uploadFileToRamSandbox(files[0]);
        });

        container.addEventListener('paste', function (e) {
            if (isTestingReadOnly) return;
            var items = e.clipboardData && e.clipboardData.items;
            if (!items) return;
            for (var i = 0; i < items.length; i++) {
                if (items[i].type && items[i].type.indexOf('image/') === 0) {
                    var blob = items[i].getAsFile();
                    if (blob) {
                        e.preventDefault();
                        setPendingAttachment(new File([blob], 'screenshot-' + Date.now() + '.png', { type: blob.type }));
                        break;
                    }
                }
            }
        });

        threadScrollEl.addEventListener('scroll', function () {
            updateScrollBottomVisibility();
        });
        if (scrollBottomBtn) {
            scrollBottomBtn.addEventListener('click', function () {
                threadScrollEl.scrollTo({ top: threadScrollEl.scrollHeight, behavior: 'smooth' });
            });
        }
        if (starterGridEl) {
            starterGridEl.addEventListener('click', function (e) {
                if (isTestingReadOnly) {
                    showBanner('Mode Lihat (Read-Only): Role Testing tidak dapat menjalankan prompt.', 'warn');
                    return;
                }
                var card = e.target.closest('.cs-starter-card');
                if (!card) return;
                if (card.getAttribute('data-starter-action') === 'upload') {
                    fileInput.click();
                    return;
                }
                var starterPrompt = card.getAttribute('data-starter-prompt') || '';
                if (starterPrompt) {
                    sendChatMessage(starterPrompt);
                }
            });
        }

        inputEl.addEventListener('input', autoResizeInput);
        inputEl.addEventListener('keydown', function (e) {
            var enterSends = state.prefs.sendOnEnter !== false;
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || (enterSends && !e.shiftKey))) {
                e.preventDefault();
                if (isSessionBusy(state.activeSessionId)) return;
                sendChatMessage();
            }
        });
        sendBtn.addEventListener('click', function () {
            if (isSessionBusy(state.activeSessionId)) {
                stopActiveStream();
                return;
            }
            sendChatMessage();
        });

        if (isTestingReadOnly) {
            inputEl.disabled = true;
            inputEl.placeholder = 'Mode Lihat (Read-Only) • Role Testing tidak dapat mengirim pesan atau mengubah data.';
            sendBtn.disabled = true;
            clipBtn.disabled = true;
            newChatBtn.disabled = true;
            modelPill.disabled = true;
            showBanner('Mode Lihat (Read-Only): Akun dengan role Testing hanya dapat melihat tampilan tanpa input/output atau mutasi data.', 'info');
        }

        applyQuickPromptsVisibility();
        renderMessages();
        renderPopoverContent();
        autoResizeInput();
        refreshHealth();
        refreshQuota();
        loadSessionsFromServer();

        // Auto-resume Smart Handover (?task_prompt= / ?init_prompt=) without user retyping
        if (handover && handover.prompt) {
            clearHandoverQueryParams();
            setTimeout(function () {
                sendChatMessage(handover.prompt);
            }, 80);
        }

        return { refreshHealth: refreshHealth, refreshQuota: refreshQuota };
    }

    return { mountCoserseChat: mountCoserseChat };
});
