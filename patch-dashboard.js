const fs = require('fs');
let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const oldDash = c.indexOf('const Dashboard = () => {');
const exportLine = c.lastIndexOf('export default Dashboard;');
const before = c.slice(0, oldDash);
const after = c.slice(exportLine);

const newDash = `const Dashboard = () => {
  const { authed, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false);
      setUnreadCount(count || 0);
    };
    fetchUnread();
  }, [tab]);

  const toast = (msg, type = 'success') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    if (!loading && !authed) navigate('/');
  }, [authed, loading, navigate]);

  const mainTabs = [
    { key: 'overview',   icon: LayoutDashboard, label: 'Overview' },
    { key: 'admissions', icon: FileText,         label: 'Admissions' },
    { key: 'gallery',    icon: Images,           label: 'Gallery' },
    { key: 'blog',       icon: BookOpen,         label: 'Blog Posts' },
    { key: 'ticker',     icon: Megaphone,        label: 'Ticker' },
    { key: 'messages',   icon: MessageSquare,    label: 'Messages' },
    { key: 'newsletter', icon: Send,             label: 'Newsletter' },
  ];

  const tabLabels = { overview: 'Overview', admissions: 'Admissions', gallery: 'Gallery', blog: 'Blog Posts', ticker: 'Ticker', messages: 'Messages', newsletter: 'Newsletter', password: 'Change Password' };
  const allTabs = [...mainTabs, { key: 'password', icon: KeyRound, label: 'Change Password' }];
  const currentTab = allTabs.find(t => t.key === tab);

  const NavBtn = ({ tabKey, icon: Icon, label, badge }) => (
    <button
      onClick={() => setTab(tabKey)}
      className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all relative \${
        tab === tabKey
          ? 'bg-secondary/10 text-secondary dark:text-red-400'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }\`}
    >
      {tab === tabKey && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-r-full" />}
      <Icon size={16} className={tab === tabKey ? 'text-secondary' : ''} />
      {label}
      {badge > 0 && (
        <span className="ml-auto bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{badge}</span>
      )}
    </button>
  );

  const Sidebar = () => (
    <aside className={\`flex flex-col w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 fixed top-14 bottom-0 left-0 overflow-y-auto z-20 transition-transform duration-300 \${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}\`}>
      {/* Brand */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="flex items-center gap-3">
          <img src="/assets/Badge.jpg" className="w-10 h-10 rounded-xl object-cover shadow-sm ring-2 ring-secondary/20 shrink-0" />
          <div className="min-w-0">
            <p className="font-black text-gray-900 dark:text-white text-[13px] leading-tight truncate">Peter Harvard Int'l</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[11px] text-green-600 dark:text-green-500 font-bold">Admin Panel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-2 pb-2">Menu</p>
        {mainTabs.map(({ key, icon, label }) => (
          <NavBtn key={key} tabKey={key} icon={icon} label={label} badge={key === 'messages' ? unreadCount : 0} />
        ))}
        <div className="pt-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-2">Account</p>
          <NavBtn tabKey="password" icon={KeyRound} label="Change Password" />
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800 space-y-0.5">
        <button
          onClick={() => window.open('/', '_blank')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <Eye size={16} /> View Site
        </button>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">

      {/* Top bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30 h-14 flex items-center px-4 sm:px-6 gap-3">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-gray-400 hidden sm:block">Dashboard</span>
          <span className="text-gray-300 dark:text-gray-700 hidden sm:block">/</span>
          <div className="flex items-center gap-1.5">
            {currentTab && <currentTab.icon size={14} className="text-secondary shrink-0" />}
            <h1 className="font-bold text-gray-900 dark:text-white text-sm truncate">{tabLabels[tab]}</h1>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-400 hover:text-secondary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-secondary transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Eye size={14} /> <span className="hidden sm:inline">View Site</span>
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Body row */}
      <div className="flex flex-1 min-h-0">

        {/* Fixed sidebar */}
        <Sidebar />

        {/* Spacer that pushes content right when sidebar open */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 256 }}
              exit={{ width: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="shrink-0"
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-8 overflow-y-auto min-h-[calc(100vh-3.5rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === 'overview'   && <OverviewTab onNavigate={setTab} />}
              {tab === 'admissions' && <AdmissionsTab toast={toast} />}
              {tab === 'gallery'    && <GalleryTab toast={toast} />}
              {tab === 'blog'       && <BlogTab toast={toast} />}
              {tab === 'ticker'     && <TickerTab toast={toast} />}
              {tab === 'messages'   && <MessagesTab toast={toast} onRead={(n) => setUnreadCount(n)} />}
              {tab === 'newsletter' && <NewsletterTab toast={toast} />}
              {tab === 'password'   && <ChangePasswordTab toast={toast} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {toastMsg && <Toast {...toastMsg} onClose={() => setToastMsg(null)} />}
      </AnimatePresence>
    </div>
  );
};

`;

fs.writeFileSync('src/pages/Dashboard.jsx', before + newDash + after, 'utf8');
console.log('done');
