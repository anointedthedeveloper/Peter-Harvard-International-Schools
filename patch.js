const fs = require('fs');
let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// 1. Add imports
c = c.replace(
  "GripVertical, Menu, ArrowRight, MessageSquare, Mail, MailOpen, Send, Users,\r\n} from 'lucide-react';",
  "GripVertical, Menu, ArrowRight, MessageSquare, Mail, MailOpen, Send, Users,\r\n  RefreshCw, KeyRound,\r\n} from 'lucide-react';"
);

// 2. Insert ChangePasswordTab before const Dashboard
const cpTab = `\r\n// ── Change Password Tab ──────────────────────────────────────────────────────\r\nconst ChangePasswordTab = ({ toast }) => {\r\n  const [form, setForm] = useState({ newPass: '', confirm: '' });\r\n  const [loading, setLoading] = useState(false);\r\n  const handleSubmit = async (e) => {\r\n    e.preventDefault();\r\n    if (form.newPass !== form.confirm) return toast('Passwords do not match', 'error');\r\n    if (form.newPass.length < 6) return toast('Password must be at least 6 characters', 'error');\r\n    setLoading(true);\r\n    const { error } = await supabase.auth.updateUser({ password: form.newPass });\r\n    if (error) toast(error.message, 'error');\r\n    else { toast('Password updated successfully!', 'success'); setForm({ newPass: '', confirm: '' }); }\r\n    setLoading(false);\r\n  };\r\n  return (\r\n    <div className="max-w-md">\r\n      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">\r\n        <div className="flex items-center gap-3 mb-6">\r\n          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">\r\n            <KeyRound size={18} className="text-secondary" />\r\n          </div>\r\n          <div>\r\n            <h3 className="font-bold text-gray-900 dark:text-white">Change Password</h3>\r\n            <p className="text-xs text-gray-400">Update your admin account password</p>\r\n          </div>\r\n        </div>\r\n        <form onSubmit={handleSubmit} className="space-y-4">\r\n          <div className="space-y-1.5">\r\n            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>\r\n            <input type="password" value={form.newPass} onChange={e => setForm({ ...form, newPass: e.target.value })} required minLength={6} placeholder="Min. 6 characters" className={inputClass} />\r\n          </div>\r\n          <div className="space-y-1.5">\r\n            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>\r\n            <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required placeholder="Repeat new password" className={inputClass} />\r\n          </div>\r\n          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}\r\n            className="w-full bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-red-500/20">\r\n            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><KeyRound size={15} /> Update Password</>}\r\n          </motion.button>\r\n        </form>\r\n      </div>\r\n    </div>\r\n  );\r\n};\r\n\r\n`;

c = c.replace('const Dashboard = () => {', cpTab + 'const Dashboard = () => {');

// 3. Add password tab to tabs array - find exact spacing
const nlKey = c.indexOf("{ key: 'newsletter'");
const nlEnd = c.indexOf('\n', nlKey);
const nlLine = c.slice(nlKey, nlEnd);
c = c.replace(nlLine, nlLine + "\r\n    { key: 'password',   icon: KeyRound,         label: 'Change Password' },");

// 4. tabLabels
c = c.replace("newsletter: 'Newsletter' };", "newsletter: 'Newsletter', password: 'Change Password' };");

// 5. Reload button in header - find the ml-auto div
c = c.replace(
  '<div className="ml-auto flex items-center gap-2">',
  '<div className="ml-auto flex items-center gap-2">\r\n          <button onClick={() => window.location.reload()} className="p-1.5 text-gray-400 hover:text-secondary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" title="Reload page"><RefreshCw size={14} /></button>'
);

// 6. Render password tab
c = c.replace(
  "{tab === 'newsletter' && <NewsletterTab toast={toast} />}",
  "{tab === 'newsletter' && <NewsletterTab toast={toast} />}\r\n              {tab === 'password'   && <ChangePasswordTab toast={toast} />}"
);

// 7. Clear send history - replace the h3 with flex header + clear button
c = c.replace(
  '<h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Send History</h3>',
  '<div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-900 dark:text-white text-sm">Send History</h3>{sends.length > 0 && (<button onClick={async () => { await supabase.from(\'newsletter_sends\').delete().gt(\'id\', 0); toast(\'Send history cleared\', \'success\'); fetchData(); }} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={12} /> Clear History</button>)}</div>'
);

fs.writeFileSync('src/pages/Dashboard.jsx', c, 'utf8');

// verify
const checks = [
  ['RefreshCw import', c.includes('RefreshCw, KeyRound')],
  ['ChangePasswordTab', c.includes('ChangePasswordTab')],
  ['password tab key', c.includes("key: 'password'")],
  ['reload button', c.includes('window.location.reload')],
  ['Clear History', c.includes('Clear History')],
  ['password render', c.includes("tab === 'password'")],
];
checks.forEach(([k,v]) => process.stdout.write(k + ': ' + v + '\n'));
