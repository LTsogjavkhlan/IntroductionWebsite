// Shared by content-loader.js and admin.js so the escaping logic has one
// source of truth instead of being copy-pasted into both files.
window.escapeHtml = function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
};
