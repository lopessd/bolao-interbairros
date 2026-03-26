import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Home as HomeIcon, 
  Trophy, 
  Wallet as WalletIcon, 
  User as UserIcon, 
  History as HistoryIcon,
  Search, 
  Filter, 
  ChevronRight, 
  ArrowLeft, 
  TrendingUp, 
  Shield, 
  Clock, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownLeft,
  X,
  CheckCircle2,
  AlertCircle,
  LogOut,
  PlusCircle,
  QrCode,
  CreditCard,
  Settings,
  Bell,
  Lock,
  HelpCircle,
  Menu,
  Star,
  Zap,
  Crown,
  List,
  Activity,
  Calendar,
  Info,
  Target,
  Ticket,
  XCircle,
  Eye
} from 'lucide-react';
import {
  AppScreen,
  MOCK_MATCHES,
  MOCK_TEAMS,
  MOCK_POOLS,
  CHAMPION_TOTAL_POOL,
  MOCK_TRANSACTIONS,
  MOCK_BETS,
  MOCK_RANKING,
  MOCK_NOTIFICATIONS,
  Match,
  PoolState,
  ChampionTeam,
  AppNotification,
  Transaction,
  Bet
} from './types';
import { calculateEstimatedReturn, calculatePoolPercentages, formatCurrency } from './utils/parimutuel';

// --- Components ---

const Navbar = ({ currentScreen, setScreen }: { currentScreen: AppScreen, setScreen: (s: AppScreen) => void }) => {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Início' },
    { id: 'champion', icon: Crown, label: 'Campeão' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'wallet', icon: WalletIcon, label: 'Carteira' },
    { id: 'profile', icon: UserIcon, label: 'Perfil' },
  ];

  const isHidden = ['login', 'game-details'].includes(currentScreen);
  if (isHidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 z-50 lg:hidden">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as AppScreen)}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentScreen === item.id ? 'text-secondary scale-110' : 'text-on-surface-variant'
            }`}
          >
            <item.icon size={20} strokeWidth={currentScreen === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const DesktopSidebar = ({
  currentScreen,
  setScreen,
  balance,
  isLoggedIn,
}: {
  currentScreen: AppScreen;
  setScreen: (s: AppScreen) => void;
  balance: number;
  isLoggedIn: boolean;
}) => {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Início', requiresAuth: false },
    { id: 'champion', icon: Crown, label: 'Campeão', requiresAuth: false },
    { id: 'ranking', icon: Trophy, label: 'Ranking', requiresAuth: false },
    { id: 'wallet', icon: WalletIcon, label: 'Carteira', requiresAuth: true },
    { id: 'profile', icon: UserIcon, label: 'Perfil', requiresAuth: true },
  ].filter(item => !item.requiresAuth || isLoggedIn);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 bg-surface border-r border-white/5 flex-col z-50">
      <div className="px-5 py-4">
        <img src="/logo-menu.PNG" alt="Desafio Interbairros" className="w-24 h-24 object-contain mx-auto" />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as AppScreen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              currentScreen === item.id || (currentScreen === 'game-details' && item.id === 'home')
                ? 'bg-secondary text-black'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
            }`}
          >
            <item.icon size={18} strokeWidth={currentScreen === item.id ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        {isLoggedIn ? (
          <button
            onClick={() => setScreen('wallet')}
            className="w-full bg-background rounded-2xl p-4 border border-white/5 hover:border-secondary/30 transition-colors text-left"
          >
            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">Saldo disponível</p>
            <div className="flex items-center gap-2">
              <WalletIcon size={14} className="text-secondary" />
              <p className="text-xl font-headline font-bold text-secondary">
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </button>
        ) : (
          <button
            onClick={() => setScreen('login')}
            className="w-full py-3 bg-secondary text-black font-bold rounded-2xl text-sm hover:scale-[1.02] transition-transform"
          >
            Entrar
          </button>
        )}
      </div>
    </aside>
  );
};

const DesktopTopBar = ({
  currentScreen,
  onShowNotifications,
  unreadCount,
  isLoggedIn,
  balance,
  setScreen,
  onBack,
}: {
  currentScreen: AppScreen;
  onShowNotifications: () => void;
  unreadCount: number;
  isLoggedIn: boolean;
  balance: number;
  setScreen: (s: AppScreen) => void;
  onBack?: () => void;
}) => {
  const screenTitles: Record<AppScreen, string> = {
    home: 'Início',
    champion: 'Campeão',
    ranking: 'Ranking',
    wallet: 'Minha Carteira',
    profile: 'Meu Perfil',
    'game-details': 'Detalhes da Partida',
    'how-it-works': 'Como Funciona',
    login: '',
  };

  return (
    <header className="hidden lg:flex fixed top-0 left-60 right-0 h-16 bg-background/90 backdrop-blur-md border-b border-white/5 items-center px-8 justify-between z-40">
      <div className="flex items-center gap-3">
        {currentScreen === 'game-details' && onBack && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
        )}
        <h2 className="font-headline font-bold text-base text-on-surface-variant">{screenTitles[currentScreen]}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar partidas..."
            className="bg-surface border border-white/10 rounded-xl py-2 pl-8 pr-4 text-sm focus:outline-none focus:border-secondary transition-colors w-52"
          />
        </div>

        <button
          onClick={onShowNotifications}
          className="relative p-2 bg-surface rounded-xl border border-white/5 text-on-surface-variant hover:text-secondary transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border border-background" />
          )}
        </button>

        {isLoggedIn ? (
          <>
            <button
              onClick={() => setScreen('wallet')}
              className="flex items-center gap-2 bg-surface border border-white/5 rounded-xl px-3 py-2 hover:border-secondary/30 transition-colors"
            >
              <WalletIcon size={14} className="text-secondary" />
              <span className="text-sm font-bold">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </button>
            <button
              onClick={() => setScreen('profile')}
              className="flex items-center gap-2 bg-surface border border-white/5 rounded-xl px-3 py-2 hover:border-white/20 transition-colors"
            >
              <img src="https://picsum.photos/seed/me/200" alt="Avatar" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
              <span className="text-sm font-semibold">Felipe S.</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setScreen('login')}
            className="text-sm font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-xl hover:bg-secondary/20 transition-colors"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

const Header = ({ title, onBack, rightElement, balance }: { title: string, onBack?: () => void, rightElement?: React.ReactNode, balance?: number }) => (
  <header className="lg:hidden sticky top-0 bg-background/80 backdrop-blur-md z-40 px-6 py-4 flex justify-between items-center border-b border-white/5">
    <div className="flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="text-xl font-headline font-bold tracking-tight">{title}</h1>
    </div>
    <div className="flex items-center gap-4">
      {balance !== undefined && (
        <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-white/5">
          <WalletIcon size={14} className="text-secondary" />
          <span className="text-sm font-bold">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      )}
      {rightElement}
    </div>
  </header>
);

// Toast notification component
const Toast = ({ message, isVisible, type = 'success' }: { message: string, isVisible: boolean, type?: 'success' | 'error' | 'warning' }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%]"
      >
        <div className={`px-5 py-3 rounded-2xl border shadow-xl flex items-center gap-3 ${
          type === 'success' ? 'bg-green-900/90 border-green-500/30 text-green-100' :
          type === 'error' ? 'bg-red-900/90 border-red-500/30 text-red-100' :
          'bg-amber-900/90 border-amber-500/30 text-amber-100'
        }`}>
          {type === 'success' ? <CheckCircle2 size={18} /> : type === 'error' ? <AlertCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-bold">{message}</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const NotificationsOverlay = ({ isOpen, onClose, notifications, onMarkAllAsRead }: { isOpen: boolean, onClose: () => void, notifications: AppNotification[], onMarkAllAsRead: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface rounded-t-[40px] z-[70] max-h-[80vh] overflow-hidden flex flex-col border-t border-white/10"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                  <Bell size={20} />
                </div>
                <h2 className="text-xl font-headline font-bold">Notificações</h2>
              </div>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-on-surface-variant">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 rounded-2xl border transition-all ${notif.read ? 'bg-white/5 border-white/5 opacity-60' : 'bg-secondary/5 border-secondary/20'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold">{notif.title}</h3>
                      <span className="text-[10px] text-on-surface-variant font-medium">{notif.time}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{notif.message}</p>
                    {!notif.read && (
                      <div className="mt-3 flex justify-end">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <Bell size={40} className="mx-auto text-on-surface-variant opacity-20 mb-4" />
                  <p className="text-sm text-on-surface-variant">Você não tem notificações</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/5">
              <button 
                onClick={onMarkAllAsRead}
                disabled={!notifications.some(n => !n.read)}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Marcar todas como lidas
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  type, 
  onConfirm 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  type: 'deposit' | 'withdraw', 
  onConfirm: (amount: number, method: string) => void 
}) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('PIX');

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    onConfirm(numAmount, method);
    setAmount('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface rounded-t-[40px] z-[70] p-8 border-t border-white/10"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-headline font-bold">
                {type === 'deposit' ? 'Depositar Saldo' : 'Sacar Saldo'}
              </h2>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-on-surface-variant">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                  Valor (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">R$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-background border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                  Método
                </label>
                <div className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                    <QrCode size={18} />
                  </div>
                  <span className="font-bold text-sm">PIX (Instantâneo)</span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full py-4 bg-secondary text-black font-bold rounded-2xl editorial-shadow mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Confirmar {type === 'deposit' ? 'Depósito' : 'Saque'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const HelpModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface rounded-t-[40px] z-[70] p-8 border-t border-white/10"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-headline font-bold">Central de Ajuda</h2>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-on-surface-variant">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="font-bold mb-2">Como depositar?</h3>
                <p className="text-sm text-on-surface-variant">Clique no botão "Depositar" e utilize o PIX para transferências instantâneas.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="font-bold mb-2">Suporte 24h</h3>
                <p className="text-sm text-on-surface-variant">Nosso time está disponível via WhatsApp para qualquer dúvida sobre suas apostas.</p>
              </div>
              <button className="w-full py-4 bg-green-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                <span>Falar com Suporte</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const TransactionsOverlay = ({ isOpen, onClose, transactions }: { isOpen: boolean, onClose: () => void, transactions: Transaction[] }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-background z-[90] flex flex-col shadow-2xl"
          >
            <header className="px-6 py-6 border-b border-white/5 flex items-center gap-4">
              <button onClick={onClose} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-headline font-bold tracking-tight">Todas as Transações</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="bg-surface rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {tx.type === 'deposit' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{tx.type === 'deposit' ? 'Depósito' : 'Saque'} via {tx.method}</h4>
                        <p className="text-[10px] text-on-surface-variant">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.type === 'deposit' ? '+' : ''}R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        tx.status === 'pago' ? 'bg-green-500/20 text-green-500' : 
                        tx.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-50">
                  <WalletIcon size={48} className="mx-auto mb-4" />
                  <p className="text-sm">Nenhuma transação encontrada</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Screens ---

const HomeScreen = ({ onSelectMatch, setScreen, onShowNotifications, unreadCount, balance, isLoggedIn, bets }: { onSelectMatch: (m: Match) => void, setScreen: (s: AppScreen) => void, onShowNotifications: () => void, unreadCount: number, balance: number, isLoggedIn: boolean, bets: Bet[] }) => {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredMatches = MOCK_MATCHES.filter(match => {
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.league.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === 'todos') return true;
    if (activeTab === 'ao vivo') return match.status === 'ongoing';
    if (activeTab === 'próximos') return match.status === 'open';
    if (activeTab === 'finalizados') return match.status === 'finished';
    return true;
  });

  const featuredMatch = MOCK_MATCHES.find(m => m.status === 'ongoing') || MOCK_MATCHES.find(m => m.status === 'open') || MOCK_MATCHES[0];

  return (
    <div className="pb-24 lg:pb-8">
      <header className="sticky top-0 lg:hidden bg-background/80 backdrop-blur-md z-40 px-6 py-4 border-b border-white/5">
        <div className="flex justify-between items-center">
          {!isSearching ? (
            <>
              <div className="flex items-center gap-2">
                <img src="/logo-reduzida.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                <h1 className="text-xl font-headline font-bold tracking-tight">Desafio Interbairros</h1>
              </div>
              <div className="flex items-center gap-3">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-white/5">
                    <WalletIcon size={14} className="text-secondary" />
                    <span className="text-sm font-bold">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setScreen('login')} 
                    className="text-sm font-bold text-secondary bg-secondary/10 px-4 py-1.5 rounded-full hover:bg-secondary/20 transition-colors"
                  >
                    Entrar
                  </button>
                )}
                <button 
                  onClick={() => setIsSearching(true)}
                  className="p-2 bg-surface rounded-full text-on-surface-variant hover:text-secondary transition-colors"
                >
                  <Search size={18} />
                </button>
                <button 
                  onClick={onShowNotifications}
                  className="p-2 bg-surface rounded-full text-on-surface-variant hover:text-secondary transition-colors relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border border-background" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Buscar times ou ligas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
              <button 
                onClick={() => {
                  setIsSearching(false);
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-secondary uppercase tracking-widest"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="px-6 mt-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
        {/* Como Funciona */}
        <button
          onClick={() => setScreen('how-it-works')}
          className="w-full text-left bg-surface rounded-2xl px-5 py-4 mb-4 border border-white/5 relative overflow-hidden hover:border-secondary/30 transition-colors"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10"><Info size={56} /></div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Novo por aqui?</h2>
              <p className="text-base font-headline font-bold">Como funciona o Bolão?</p>
            </div>
            <ChevronRight size={20} className="text-secondary shrink-0 ml-4" />
          </div>
        </button>

        {/* Grande Campeão Promo */}
        <button
          onClick={() => setScreen('champion')}
          className="w-full text-left bg-surface rounded-2xl px-5 py-4 mb-6 border border-white/5 relative overflow-hidden hover:border-secondary/30 transition-colors"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10"><Trophy size={56} /></div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Grande Campeão</h2>
              <p className="text-base font-headline font-bold">Quem levará o troféu para casa?</p>
            </div>
            <div className="flex items-center gap-1.5 text-primary font-bold text-sm shrink-0 ml-4">
              <Zap size={14} />
              <span>R$ {formatCurrency(CHAMPION_TOTAL_POOL)}</span>
            </div>
          </div>
        </button>

        {/* Featured Match */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] lg:aspect-[21/7] editorial-shadow mb-8 group cursor-pointer" onClick={() => onSelectMatch(featuredMatch)}>
          <img 
            src="https://picsum.photos/seed/stadium/800/450" 
            alt="Destaque" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-secondary text-black text-[10px] font-bold rounded uppercase tracking-widest">
                {featuredMatch.status === 'ongoing' ? 'Ao Vivo' : 'Destaque'}
              </span>
              <span className="text-white/60 text-xs font-medium">{featuredMatch.time} • {featuredMatch.location}</span>
            </div>
            <h2 className="text-2xl font-headline font-bold text-white mb-4">{featuredMatch.homeTeam.name} vs {featuredMatch.awayTeam.name}</h2>
            {(() => {
              const pool = MOCK_POOLS[featuredMatch.id];
              const pct = pool ? calculatePoolPercentages(pool.outcomes) : { home: 33.3, draw: 33.3, away: 33.3 };
              return (
                <div className="flex gap-3">
                  <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-2 text-center border border-white/10">
                    <p className="text-[10px] text-white/60 uppercase mb-1">Casa</p>
                    <p className="text-secondary font-bold">{pct.home}%</p>
                  </div>
                  <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-2 text-center border border-white/10">
                    <p className="text-[10px] text-white/60 uppercase mb-1">Empate</p>
                    <p className="text-secondary font-bold">{pct.draw}%</p>
                  </div>
                  <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-2 text-center border border-white/10">
                    <p className="text-[10px] text-white/60 uppercase mb-1">Fora</p>
                    <p className="text-secondary font-bold">{pct.away}%</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {[
            { id: 'todos', label: 'Todos', icon: <List size={14} /> },
            { id: 'ao vivo', label: 'Ao Vivo', icon: <Activity size={14} /> },
            { id: 'próximos', label: 'Próximos', icon: <Calendar size={14} /> },
            { id: 'finalizados', label: 'Finalizados', icon: <CheckCircle2 size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeTab === tab.id 
                  ? 'bg-secondary text-black border-secondary shadow-[0_0_15px_rgba(165,125,56,0.2)]' 
                  : 'bg-surface text-on-surface-variant border-white/5 hover:bg-surface-high hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Match List */}
        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onSelectMatch(match)}
                className={`bg-surface rounded-2xl p-4 border cursor-pointer hover:border-secondary/30 transition-colors relative ${
                  match.status === 'ongoing' ? 'border-red-500/30' : match.status === 'finished' ? 'border-white/5 opacity-80' : 'border-white/5'
                }`}
              >
                {/* Badge de palpite */}
                {bets.some(b => b.matchId === match.id) && (
                  <div className="absolute -top-1.5 -right-1.5 z-10 flex items-center gap-1 bg-secondary text-black text-[8px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                    <Ticket size={10} />
                    <span>{bets.filter(b => b.matchId === match.id).length}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{match.league}</span>
                  <div className="flex items-center gap-1.5">
                    {match.status === 'ongoing' && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                    {match.status === 'finished' && <CheckCircle2 size={10} className="text-on-surface-variant" />}
                    <span className={`text-[10px] font-bold uppercase ${match.status === 'ongoing' ? 'text-red-500' : match.status === 'finished' ? 'text-on-surface-variant opacity-60' : 'text-on-surface-variant'}`}>
                      {match.status === 'finished' ? 'Encerrado' : match.status === 'ongoing' ? 'Ao Vivo' : match.time}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-12 h-12 rounded-full bg-background p-1" referrerPolicy="no-referrer" />
                    <span className="text-xs font-bold text-center">{match.homeTeam.name}</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1 px-4">
                    {match.status !== 'open' ? (
                      <div className="text-2xl font-headline font-black tracking-tighter flex gap-3">
                        <span>{match.score?.home}</span>
                        <span className="text-on-surface-variant opacity-30">-</span>
                        <span>{match.score?.away}</span>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-on-surface-variant opacity-50 uppercase tracking-widest italic">VS</div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-12 h-12 rounded-full bg-background p-1" referrerPolicy="no-referrer" />
                    <span className="text-xs font-bold text-center">{match.awayTeam.name}</span>
                  </div>
                </div>

                {(() => {
                  const pool = MOCK_POOLS[match.id];
                  const pct = pool ? calculatePoolPercentages(pool.outcomes) : { home: 33.3, draw: 33.3, away: 33.3 };
                  return (
                    <div className="flex gap-2">
                      <div className="flex-1 bg-background rounded-lg py-2 text-center border border-white/5">
                        <p className="text-[8px] text-on-surface-variant uppercase mb-0.5">Casa</p>
                        <span className="text-secondary font-bold text-sm">{pct.home}%</span>
                      </div>
                      <div className="flex-1 bg-background rounded-lg py-2 text-center border border-white/5">
                        <p className="text-[8px] text-on-surface-variant uppercase mb-0.5">Empate</p>
                        <span className="text-secondary font-bold text-sm">{pct.draw}%</span>
                      </div>
                      <div className="flex-1 bg-background rounded-lg py-2 text-center border border-white/5">
                        <p className="text-[8px] text-on-surface-variant uppercase mb-0.5">Fora</p>
                        <span className="text-secondary font-bold text-sm">{pct.away}%</span>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center">
              <Search size={40} className="mx-auto text-on-surface-variant opacity-20 mb-4" />
              <p className="text-sm text-on-surface-variant">Nenhuma partida encontrada para "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChampionScreen = ({ balance, onPlaceBet, onOpenDeposit, championBets }: { balance: number, onPlaceBet: (amount: number, selection: string, estimatedReturn: number) => void, onOpenDeposit: () => void, championBets: Bet[] }) => {
  const [selectedTeam, setSelectedTeam] = useState<ChampionTeam | null>(null);
  const [betAmount, setBetAmount] = useState('100');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const getEstimatedReturn = () => {
    if (!selectedTeam) return 0;
    const amount = parseFloat(betAmount) || 0;
    const { estimatedReturn } = calculateEstimatedReturn(amount, selectedTeam.poolAmount, CHAMPION_TOTAL_POOL);
    return estimatedReturn;
  };

  const handleBet = () => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      setToastMsg('Insira um valor válido.');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }
    if (amount > balance) {
      onOpenDeposit();
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmBet = () => {
    const amount = parseFloat(betAmount);
    onPlaceBet(amount, `Campeão: ${selectedTeam!.name}`, getEstimatedReturn());
    setShowConfirmModal(false);
    setSelectedTeam(null);
    setToastMsg(`Palpite no ${selectedTeam!.name} confirmado!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="pb-24 lg:pb-8">
      <Header title="Campeão do Torneio" />
      <Toast message={toastMsg} isVisible={!!toastMsg} type={toastMsg.includes('confirmado') ? 'success' : 'error'} />

      <div className="px-6 mt-6">
        <div className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl p-6 border border-secondary/20 mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Crown size={80} /></div>
          <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-2">Campeão Geral</h2>
          <p className="text-2xl font-headline font-bold mb-2">Quem será o grande campeão do Interbairros?</p>
          <p className="text-xs text-on-surface-variant mb-2">Total no Bolão: <span className="text-secondary font-bold">R$ {formatCurrency(CHAMPION_TOTAL_POOL)}</span></p>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-900/30 border border-amber-500/30 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-200 mb-1">Palpite Irrevogável</p>
            <p className="text-xs text-amber-200/70 leading-relaxed">Palpites no campeão NÃO podem ser retirados. Se seu time for eliminado, o valor investido será perdido.</p>
          </div>
        </div>

        {/* Meus Palpites no Campeão */}
        {championBets.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
              <Ticket size={14} className="text-secondary" />
              Meus Palpites no Campeão ({championBets.length})
            </h3>
            <div className="space-y-3">
              {championBets.map((bet) => (
                <div key={bet.id} className="bg-surface rounded-2xl p-4 border border-amber-500/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-amber-500/10 rounded text-amber-400"><Crown size={12} /></div>
                      <span className="text-xs font-bold">{bet.selection}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500">
                      {bet.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-0.5">Investido</p>
                      <p className="text-sm font-bold">R$ {formatCurrency(bet.amount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-0.5">Est. Retorno</p>
                      <p className="text-sm font-bold text-secondary">~R$ {formatCurrency(bet.estimatedReturn)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-amber-400/70 italic flex items-center gap-1"><Lock size={10} /> Irrevogável</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Escolha seu Favorito</h3>

        <div className="grid grid-cols-1 gap-4 mb-8 lg:grid-cols-2">
          {MOCK_TEAMS.map((team) => (
            <button
              key={team.name}
              onClick={() => setSelectedTeam(team)}
              className={`bg-surface rounded-2xl p-4 border transition-all flex items-center justify-between ${
                selectedTeam?.name === team.name ? 'border-secondary bg-secondary/5' : 'border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-full bg-background p-1" referrerPolicy="no-referrer" />
                <div className="text-left">
                  <h4 className="font-bold text-sm">{team.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{team.district}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-on-surface-variant uppercase mb-1">No Bolão</p>
                <p className="text-secondary font-bold text-sm">R$ {formatCurrency(team.poolAmount)}</p>
                <p className="text-[9px] text-on-surface-variant">{team.poolPercentage}%</p>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom sheet spacer */}
        {selectedTeam && <div className="h-80" />}
      </div>

      {/* BetSlip Bottom Sheet */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[55] max-w-md mx-auto lg:max-w-none lg:left-60 lg:mx-0"
          >
            <div className="bg-surface border-t border-white/10 rounded-t-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              <div className="px-6 pb-6 pt-2 lg:max-w-2xl lg:mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-secondary" />
                    <h4 className="text-sm font-bold">Palpite no Campeão</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-on-surface-variant">Saldo: <span className="text-white font-bold">R$ {formatCurrency(balance)}</span></span>
                    <button onClick={() => setSelectedTeam(null)} className="p-1.5 bg-white/5 rounded-full text-on-surface-variant hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Selection tag */}
                <div className="bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary">{selectedTeam.name}</span>
                  <span className="text-[10px] text-on-surface-variant">R$ {formatCurrency(selectedTeam.poolAmount)} neste time ({selectedTeam.poolPercentage}%)</span>
                </div>

                {/* Amount input */}
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">R$</span>
                  <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} className="w-full bg-background border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xl font-bold focus:outline-none focus:border-secondary transition-colors" />
                </div>

                {/* Quick amount buttons */}
                <div className="flex gap-2 mb-4">
                  {[
                    { label: '+50', add: 50 },
                    { label: '+100', add: 100 },
                    { label: '+200', add: 200 },
                    { label: 'MAX', add: Math.max(0, balance - (parseFloat(betAmount || '0'))) }
                  ].map((btn) => (
                    <button key={btn.label} onClick={() => setBetAmount((prev) => (parseFloat(prev || '0') + btn.add).toString())} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors">
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Estimated return */}
                {parseFloat(betAmount) > 0 && (
                  <div className="flex justify-between items-center mb-3 bg-background rounded-xl px-4 py-3 border border-white/5">
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase block">Retorno Estimado</span>
                      <p className="text-[9px] text-on-surface-variant opacity-50 italic">Pode mudar conforme mais palpites entram</p>
                    </div>
                    <span className="text-lg font-headline font-bold text-secondary">~R$ {formatCurrency(getEstimatedReturn())}</span>
                  </div>
                )}

                {/* Irrevocable warning */}
                <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-3 mb-3 flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-400 shrink-0" />
                  <p className="text-[11px] text-amber-200">Palpite irrevogável. Valor NÃO pode ser retirado.</p>
                </div>

                {/* Insufficient balance warning */}
                {parseFloat(betAmount) > balance && (
                  <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3 mb-3 flex items-center gap-2">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <p className="text-[11px] text-red-200">Saldo insuficiente. Deposite via PIX.</p>
                  </div>
                )}

                {/* Confirm button */}
                <button
                  onClick={handleBet}
                  disabled={parseFloat(betAmount || '0') <= 0}
                  className="w-full py-4 bg-secondary text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-secondary/20"
                >
                  <Star size={18} />
                  <span>{parseFloat(betAmount) > balance ? 'Depositar via PIX' : 'Confirmar Palpite'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedTeam && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface rounded-3xl z-[70] p-6 border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={28} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Confirmar Palpite Irrevogável</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Você está investindo <strong className="text-white">R$ {formatCurrency(parseFloat(betAmount))}</strong> no <strong className="text-secondary">{selectedTeam.name}</strong>.
                </p>
                <p className="text-xs text-amber-400 mt-2">Este valor NÃO pode ser retirado. Se o time for eliminado, o valor será perdido.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmBet}
                  className="flex-1 py-3 bg-secondary text-black rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const GameDetailsScreen = ({
  match,
  onBack,
  balance,
  onPlaceBet,
  onOpenDeposit,
  bets: matchBets,
  onCancelBet,
}: {
  match: Match,
  onBack: () => void,
  balance: number,
  onPlaceBet: (amount: number, selection: string, estimatedReturn: number, selectionType: 'result' | 'exact-score') => void,
  onOpenDeposit: () => void,
  bets: Bet[],
  onCancelBet: (betId: string) => void,
}) => {
  const [betAmount, setBetAmount] = useState('50');
  const [selectedMarket, setSelectedMarket] = useState<{ label: string, outcomeKey: string, type: 'result' | 'exact-score' } | null>(null);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [cancelBetId, setCancelBetId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const canBet = match.status === 'open';
  const cancelBet = cancelBetId ? matchBets.find(b => b.id === cancelBetId) : null;

  const pool = MOCK_POOLS[match.id] || { matchId: match.id, outcomes: { home: 0, draw: 0, away: 0 }, exactScores: {}, totalPool: 0 };
  const pct = calculatePoolPercentages(pool.outcomes);

  const getOutcomePool = () => {
    if (!selectedMarket) return 0;
    if (selectedMarket.type === 'result') {
      return pool.outcomes[selectedMarket.outcomeKey as 'home' | 'draw' | 'away'] || 0;
    }
    const exactTotal = Object.values(pool.exactScores).reduce((s, v) => s + v, 0);
    return pool.exactScores[selectedMarket.outcomeKey] || 0;
  };

  const getPoolTotal = () => {
    if (!selectedMarket) return pool.totalPool;
    if (selectedMarket.type === 'exact-score') {
      return Object.values(pool.exactScores).reduce((s, v) => s + v, 0);
    }
    return pool.totalPool;
  };

  const getEstimatedReturn = () => {
    const amount = parseFloat(betAmount) || 0;
    if (!selectedMarket || amount <= 0) return 0;
    const { estimatedReturn } = calculateEstimatedReturn(amount, getOutcomePool(), getPoolTotal());
    return estimatedReturn;
  };

  const handleHomeScoreChange = (val: string) => {
    setHomeScore(val);
    if (val !== '' && awayScore !== '') {
      setSelectedMarket({ label: `Placar Exato: ${val}-${awayScore}`, outcomeKey: `${val}-${awayScore}`, type: 'exact-score' });
    } else if (selectedMarket?.type === 'exact-score') {
      setSelectedMarket(null);
    }
  };

  const handleAwayScoreChange = (val: string) => {
    setAwayScore(val);
    if (homeScore !== '' && val !== '') {
      setSelectedMarket({ label: `Placar Exato: ${homeScore}-${val}`, outcomeKey: `${homeScore}-${val}`, type: 'exact-score' });
    } else if (selectedMarket?.type === 'exact-score') {
      setSelectedMarket(null);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleConfirmBet = () => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Insira um valor válido.', 'error');
      return;
    }
    if (!selectedMarket) {
      showToast('Selecione um resultado.', 'error');
      return;
    }
    if (amount > balance) {
      onOpenDeposit();
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmBetFinal = () => {
    if (!selectedMarket) return;
    const amount = parseFloat(betAmount);
    onPlaceBet(amount, selectedMarket.label, getEstimatedReturn(), selectedMarket.type);
    setShowConfirmModal(false);
    showToast('Palpite confirmado!');
    setSelectedMarket(null);
    setHomeScore('');
    setAwayScore('');
    setBetAmount('50');
  };

  const poolData = [
    { name: `Vitória ${match.homeTeam.name}`, value: pct.home, amount: pool.outcomes.home, color: '#c99b24' },
    { name: 'Empate', value: pct.draw, amount: pool.outcomes.draw, color: '#4a4a4a' },
    { name: `Vitória ${match.awayTeam.name}`, value: pct.away, amount: pool.outcomes.away, color: '#1a1a1a' }
  ];

  const exactScoreEntries = Object.entries(pool.exactScores).sort((a, b) => b[1] - a[1]);
  const exactScoreTotal = exactScoreEntries.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="pb-24 lg:pb-8">
      <Header title="Detalhes da Partida" onBack={onBack} />
      <Toast message={toastMsg} isVisible={!!toastMsg} type={toastType} />

      <div className="px-6 mt-6">
        {/* Scoreboard */}
        <div className="bg-surface rounded-3xl p-6 border border-white/5 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col items-center gap-3 flex-1">
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-16 h-16 rounded-full bg-background p-1" referrerPolicy="no-referrer" />
              <span className="text-sm font-bold text-center">{match.homeTeam.name}</span>
            </div>
            <div className="flex flex-col items-center gap-2 px-6">
              <div className="text-4xl font-headline font-black tracking-tighter flex gap-4">
                <span>{match.score?.home ?? 0}</span>
                <span className="text-on-surface-variant opacity-30">-</span>
                <span>{match.score?.away ?? 0}</span>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                match.status === 'ongoing' ? 'bg-red-500/20 text-red-500' :
                match.status === 'finished' ? 'bg-white/5 text-on-surface-variant opacity-60' :
                'bg-white/5 text-on-surface-variant'
              }`}>
                {match.status === 'finished' ? 'Encerrado' : match.status === 'ongoing' ? 'Ao Vivo' : match.time}
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 flex-1">
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-16 h-16 rounded-full bg-background p-1" referrerPolicy="no-referrer" />
              <span className="text-sm font-bold text-center">{match.awayTeam.name}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] text-on-surface-variant font-medium">
            <MapPin size={12} />
            <span>{match.location}</span>
          </div>
        </div>

        {/* Pool Distribution */}
        <div className="bg-surface rounded-3xl p-6 border border-white/5 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Distribuição do Bolão</h3>
            <span className="text-xs text-secondary font-bold">R$ {formatCurrency(pool.totalPool)} no bolão</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={poolData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {poolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value: number, name: string) => {
                    const item = poolData.find(p => p.name === name);
                    return [`${value}% — R$ ${formatCurrency(item?.amount || 0)}`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {poolData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[11px] font-bold text-on-surface-variant">{entry.name}</span>
                </div>
                <span className="text-[11px] font-bold">R$ {formatCurrency(entry.amount)} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Banner */}
        {!canBet && (
          <div className={`rounded-2xl p-4 mb-8 flex items-center gap-3 ${
            match.status === 'ongoing' ? 'bg-red-900/20 border border-red-500/20' : 'bg-white/5 border border-white/5'
          }`}>
            {match.status === 'ongoing' ? <Activity size={16} className="text-red-400" /> : <CheckCircle2 size={16} className="text-on-surface-variant" />}
            <div>
              <p className={`text-sm font-bold ${match.status === 'ongoing' ? 'text-red-300' : 'text-on-surface-variant'}`}>
                {match.status === 'ongoing' ? 'Partida em andamento' : 'Partida encerrada'}
              </p>
              <p className="text-[10px] text-on-surface-variant">
                {match.status === 'ongoing' ? 'Não é possível fazer novos palpites.' : 'Confira seus resultados abaixo.'}
              </p>
            </div>
          </div>
        )}

        {/* Meus Palpites nesta Partida */}
        {matchBets.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
              <Ticket size={14} className="text-secondary" />
              Meus Palpites ({matchBets.length})
            </h3>
            <div className="space-y-3">
              {matchBets.map((bet) => (
                <div key={bet.id} className={`bg-surface rounded-2xl p-4 border ${
                  bet.status === 'ganhou' ? 'border-green-500/30' : bet.status === 'perdeu' ? 'border-red-500/30' : 'border-white/5'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${
                        bet.selectionType === 'exact-score' ? 'bg-purple-500/10 text-purple-400' : 'bg-secondary/10 text-secondary'
                      }`}>
                        {bet.selectionType === 'exact-score' ? <Target size={12} /> : <TrendingUp size={12} />}
                      </div>
                      <span className="text-xs font-bold">{bet.selection}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      bet.status === 'ganhou' ? 'bg-green-500/20 text-green-500' :
                      bet.status === 'perdeu' ? 'bg-red-500/20 text-red-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {bet.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-0.5">Investido</p>
                      <p className="text-sm font-bold">R$ {formatCurrency(bet.amount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-0.5">
                        {bet.status === 'ganhou' ? 'Retorno' : 'Est. Retorno'}
                      </p>
                      <p className={`text-sm font-bold ${bet.status === 'ganhou' ? 'text-green-500' : 'text-secondary'}`}>
                        {bet.status === 'ganhou' ? '' : '~'}R$ {formatCurrency(bet.actualReturn || bet.estimatedReturn)}
                      </p>
                    </div>
                    {bet.pointsEarned !== undefined && bet.pointsEarned > 0 && (
                      <div className="text-right">
                        <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-0.5">Pontos</p>
                        <p className="text-sm font-bold text-secondary">+{bet.pointsEarned}</p>
                      </div>
                    )}
                    {bet.isRefundable && bet.status === 'pendente' && (
                      <button
                        onClick={() => setCancelBetId(bet.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-bold hover:bg-red-500/20 transition-colors"
                      >
                        <XCircle size={12} />
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Market */}
        <div className={`space-y-8 mb-8 ${!canBet ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              {canBet ? 'Faça seu Palpite — Resultado Final' : 'Resultado Final'}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: `Vitória ${match.homeTeam.name}`, outcomeKey: 'home', short: match.homeTeam.name.split(' ')[0], pctVal: pct.home, poolAmt: pool.outcomes.home },
                { label: 'Empate', outcomeKey: 'draw', short: 'Empate', pctVal: pct.draw, poolAmt: pool.outcomes.draw },
                { label: `Vitória ${match.awayTeam.name}`, outcomeKey: 'away', short: match.awayTeam.name.split(' ')[0], pctVal: pct.away, poolAmt: pool.outcomes.away }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (!canBet) return;
                    setSelectedMarket({ label: item.label, outcomeKey: item.outcomeKey, type: 'result' });
                    setHomeScore('');
                    setAwayScore('');
                  }}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                    selectedMarket?.label === item.label ? 'bg-secondary border-secondary text-black' : 'bg-surface border-white/5 text-on-surface'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase opacity-60">{item.short}</span>
                  <span className="text-lg font-bold">{item.pctVal}%</span>
                  <span className={`text-[9px] ${selectedMarket?.label === item.label ? 'text-black/60' : 'text-on-surface-variant'}`}>R$ {formatCurrency(item.poolAmt)}</span>
                </button>
              ))}
            </div>
            {canBet && (
              <p className="text-[10px] text-on-surface-variant mt-3 text-center italic">Você pode fazer vários palpites em resultados diferentes</p>
            )}
          </div>

          {/* Exact Score */}
          <div>
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Placar Exato</h3>
            <div className={`p-6 rounded-3xl border transition-all ${selectedMarket?.type === 'exact-score' ? 'bg-secondary/5 border-secondary' : 'bg-surface border-white/5'}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex flex-col items-center gap-3">
                  <span className="text-xs font-bold uppercase text-on-surface-variant text-center">{match.homeTeam.name}</span>
                  <input type="number" min="0" value={homeScore} onChange={(e) => handleHomeScoreChange(e.target.value)} disabled={!canBet} className="w-20 h-20 bg-background border border-white/10 rounded-2xl text-center text-3xl font-black focus:outline-none focus:border-secondary transition-colors disabled:opacity-40" />
                </div>
                <span className="text-2xl font-black text-on-surface-variant opacity-30">X</span>
                <div className="flex-1 flex flex-col items-center gap-3">
                  <span className="text-xs font-bold uppercase text-on-surface-variant text-center">{match.awayTeam.name}</span>
                  <input type="number" min="0" value={awayScore} onChange={(e) => handleAwayScoreChange(e.target.value)} disabled={!canBet} className="w-20 h-20 bg-background border border-white/10 rounded-2xl text-center text-3xl font-black focus:outline-none focus:border-secondary transition-colors disabled:opacity-40" />
                </div>
              </div>
              {selectedMarket?.type === 'exact-score' && (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <span className="inline-block px-4 py-2 bg-secondary/20 border border-secondary/30 text-secondary rounded-xl text-sm font-bold">
                    Placar selecionado: {selectedMarket.outcomeKey.replace('-', ' x ')}
                  </span>
                  <button onClick={() => { setHomeScore(''); setAwayScore(''); setSelectedMarket(null); }} className="text-xs text-on-surface-variant underline hover:text-on-surface transition-colors">
                    Limpar placar
                  </button>
                </div>
              )}

              {exactScoreEntries.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/5">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Distribuição por Placar</h4>
                  <div className="space-y-3">
                    {exactScoreEntries.map(([score, amount]) => (
                      <div key={score} className="flex items-center gap-3">
                        <span className="text-sm font-bold w-12">{score.replace('-', 'x')}</span>
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: `${exactScoreTotal > 0 ? (amount / exactScoreTotal * 100) : 0}%` }} />
                        </div>
                        <span className="text-xs text-on-surface-variant w-16 text-right">R$ {formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom sheet spacer */}
        {selectedMarket && <div className="h-80" />}
      </div>

      {/* BetSlip Bottom Sheet */}
      <AnimatePresence>
        {selectedMarket && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[55] max-w-md mx-auto lg:max-w-none lg:left-60 lg:mx-0"
          >
            <div className="bg-surface border-t border-white/10 rounded-t-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              <div className="px-6 pb-6 pt-2 lg:max-w-2xl lg:mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-secondary" />
                    <h4 className="text-sm font-bold">Palpite</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-on-surface-variant">Saldo: <span className="text-white font-bold">R$ {formatCurrency(balance)}</span></span>
                    <button onClick={() => { setSelectedMarket(null); setHomeScore(''); setAwayScore(''); }} className="p-1.5 bg-white/5 rounded-full text-on-surface-variant hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Selection tag */}
                <div className="bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-2 mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary">{selectedMarket.label}</span>
                  <span className="text-[10px] text-on-surface-variant">R$ {formatCurrency(getOutcomePool())} neste resultado</span>
                </div>

                {/* Amount input */}
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">R$</span>
                  <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} className="w-full bg-background border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xl font-bold focus:outline-none focus:border-secondary transition-colors" />
                </div>

                {/* Quick amount buttons */}
                <div className="flex gap-2 mb-4">
                  {[
                    { label: '+10', add: 10 },
                    { label: '+50', add: 50 },
                    { label: '+100', add: 100 },
                    { label: 'MAX', add: Math.max(0, balance - (parseFloat(betAmount || '0'))) }
                  ].map((btn) => (
                    <button key={btn.label} onClick={() => setBetAmount((prev) => (parseFloat(prev || '0') + btn.add).toString())} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors">
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Estimated return */}
                {parseFloat(betAmount) > 0 && (
                  <div className="flex justify-between items-center mb-4 bg-background rounded-xl px-4 py-3 border border-white/5">
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase block">Retorno Estimado</span>
                      <p className="text-[9px] text-on-surface-variant opacity-50 italic">Pode mudar conforme mais palpites entram</p>
                    </div>
                    <span className="text-lg font-headline font-bold text-secondary">~R$ {formatCurrency(getEstimatedReturn())}</span>
                  </div>
                )}

                {/* Insufficient balance warning */}
                {parseFloat(betAmount) > balance && (
                  <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-3 mb-3 flex items-center gap-2">
                    <AlertCircle size={14} className="text-amber-400 shrink-0" />
                    <p className="text-[11px] text-amber-200">Saldo insuficiente. Deposite via PIX.</p>
                  </div>
                )}

                {/* Confirm button */}
                <button
                  onClick={handleConfirmBet}
                  disabled={parseFloat(betAmount || '0') <= 0}
                  className="w-full py-4 bg-secondary text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-secondary/20"
                >
                  <CheckCircle2 size={18} />
                  <span>{parseFloat(betAmount) > balance ? 'Depositar via PIX' : 'Confirmar Palpite'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelBet && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCancelBetId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface rounded-3xl z-[70] p-6 border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={28} className="text-red-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Cancelar Palpite?</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Seu palpite em <strong className="text-white">{cancelBet.selection}</strong> será cancelado e o valor de <strong className="text-secondary">R$ {formatCurrency(cancelBet.amount)}</strong> voltará ao seu saldo.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelBetId(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-colors"
                >
                  Manter
                </button>
                <button
                  onClick={() => {
                    onCancelBet(cancelBet.id);
                    setCancelBetId(null);
                    showToast('Palpite cancelado. Valor reembolsado.');
                  }}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Cancelar Palpite
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm Bet Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedMarket && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface rounded-3xl z-[70] p-6 border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={28} className="text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Confirmar Palpite</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Você está investindo <strong className="text-white">R$ {formatCurrency(parseFloat(betAmount))}</strong> em <strong className="text-secondary">{selectedMarket.label}</strong>.
                </p>
                <div className="mt-3 bg-background rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-on-surface-variant uppercase mb-1">Retorno Estimado</p>
                  <p className="text-lg font-headline font-bold text-secondary">~R$ {formatCurrency(getEstimatedReturn())}</p>
                  <p className="text-[9px] text-on-surface-variant opacity-50 italic mt-1">Pode mudar conforme mais palpites entram</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={confirmBetFinal}
                  className="flex-1 py-3 bg-secondary text-black rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const WalletScreen = ({
  balance,
  transactions,
  bets,
  onOpenTransaction,
  onShowHelp,
  onShowAllTransactions,
  onCancelBet
}: {
  balance: number,
  transactions: Transaction[],
  bets: Bet[],
  onOpenTransaction: (type: 'deposit' | 'withdraw') => void,
  onShowHelp: () => void,
  onShowAllTransactions: () => void,
  onCancelBet: (betId: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'bets'>('wallet');
  const [cancelBetId, setCancelBetId] = useState<string | null>(null);
  const transactionsRef = useRef<HTMLDivElement>(null);
  const cancelBet = cancelBetId ? bets.find(b => b.id === cancelBetId) : null;

  const scrollToTransactions = () => {
    transactionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-24 lg:pb-8">
      <Header title="Minha Carteira" />
      
      <div className="px-6 mt-6">
        {/* Tabs */}
        <div className="flex bg-surface rounded-2xl p-1 border border-white/5 mb-8">
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wallet' ? 'bg-secondary text-black' : 'text-on-surface-variant'
            }`}
          >
            Saldo e Transações
          </button>
          <button 
            onClick={() => setActiveTab('bets')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bets' ? 'bg-secondary text-black' : 'text-on-surface-variant'
            }`}
          >
            Meus Palpites
          </button>
        </div>

        {activeTab === 'wallet' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-surface-high to-surface rounded-3xl p-8 border border-white/10 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><WalletIcon size={120} /></div>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-2">Saldo Disponível</p>
              <h2 className="text-4xl font-headline font-black mb-8">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => onOpenTransaction('deposit')}
                  className="flex-1 bg-secondary text-black py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <PlusCircle size={18} />
                  <span>Depositar</span>
                </button>
                <button 
                  onClick={() => onOpenTransaction('withdraw')}
                  className="flex-1 bg-white/5 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <ArrowDownLeft size={18} />
                  <span>Sacar</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: QrCode, label: 'PIX', onClick: () => onOpenTransaction('deposit') },
                { icon: HistoryIcon, label: 'Histórico', onClick: scrollToTransactions },
                { icon: HelpCircle, label: 'Ajuda', onClick: onShowHelp }
              ].map((item) => (
                <button 
                  key={item.label} 
                  onClick={item.onClick}
                  className="bg-surface rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors"
                >
                  <div className="p-2 bg-white/5 rounded-full text-secondary"><item.icon size={20} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Transactions */}
            <div ref={transactionsRef} className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Transações Recentes</h3>
              <button 
                onClick={onShowAllTransactions}
                className="text-[10px] font-bold text-secondary uppercase tracking-wider hover:underline"
              >
                Ver Tudo
              </button>
            </div>

            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="bg-surface rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {tx.type === 'deposit' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{tx.type === 'deposit' ? 'Depósito' : 'Saque'} via {tx.method}</h4>
                        <p className="text-[10px] text-on-surface-variant">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.type === 'deposit' ? '+' : ''}R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        tx.status === 'pago' ? 'bg-green-500/20 text-green-500' : 
                        tx.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-surface rounded-2xl border border-white/5">
                  <p className="text-sm text-on-surface-variant">Nenhuma transação realizada</p>
                </div>
              )}
            </div>

            {/* Palpites Pendentes */}
            {bets.filter(b => b.status === 'pendente').length > 0 && (
              <>
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-8 mb-4 flex items-center gap-2">
                  <Ticket size={14} className="text-secondary" />
                  Palpites Pendentes
                </h3>
                <div className="space-y-3">
                  {bets.filter(b => b.status === 'pendente').map((bet) => (
                    <div key={bet.id} className="bg-surface rounded-2xl p-4 border border-yellow-500/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-bold mb-0.5">{bet.match}</h4>
                          <p className="text-[10px] text-on-surface-variant">{bet.league} • {bet.date}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500">pendente</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 bg-secondary/10 rounded text-secondary"><TrendingUp size={12} /></div>
                        <span className="text-xs font-bold">{bet.selection}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-0.5">Investido</p>
                          <p className="text-sm font-bold">R$ {formatCurrency(bet.amount)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-0.5">Est. Retorno</p>
                          <p className="text-sm font-bold text-secondary">~R$ {formatCurrency(bet.estimatedReturn)}</p>
                        </div>
                        {bet.isRefundable ? (
                          <button
                            onClick={() => setCancelBetId(bet.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-bold hover:bg-red-500/20 transition-colors"
                          >
                            <XCircle size={12} />
                            Cancelar
                          </button>
                        ) : (
                          <span className="text-[9px] text-amber-400/70 italic flex items-center gap-1">
                            <Lock size={10} />
                            Irrevogável
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: 'Total Investido', val: `R$ ${formatCurrency(bets.reduce((s, b) => s + b.amount, 0))}`, color: 'text-on-surface' },
                { label: 'Total Ganho', val: `R$ ${formatCurrency(bets.filter(b => b.status === 'ganhou').reduce((s, b) => s + (b.actualReturn || 0), 0))}`, color: 'text-green-500' },
                { label: 'Taxa de Acerto', val: bets.filter(b => b.status !== 'pendente').length > 0 ? `${Math.round(bets.filter(b => b.status === 'ganhou').length / bets.filter(b => b.status !== 'pendente').length * 100)}%` : '-', color: 'text-secondary' }
              ].map((stat) => (
                <div key={stat.label} className="bg-surface rounded-2xl p-3 border border-white/5 text-center">
                  <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-1">{stat.label}</p>
                  <p className={`text-sm font-bold ${stat.color}`}>{stat.val}</p>
                </div>
              ))}
            </div>

            {/* Bet List */}
            <div className="space-y-4">
              {bets.length > 0 ? (
                bets.map((bet) => (
                  <div key={bet.id} className={`bg-surface rounded-2xl p-4 border ${
                    bet.status === 'ganhou' ? 'border-green-500/20' : bet.status === 'perdeu' ? 'border-red-500/20' : 'border-white/5'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-bold mb-1">{bet.match}</h4>
                        <p className="text-[10px] text-on-surface-variant font-medium">{bet.league} • {bet.date}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        bet.status === 'ganhou' ? 'bg-green-500/20 text-green-500' :
                        bet.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {bet.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-1 rounded ${
                        bet.selectionType === 'exact-score' ? 'bg-purple-500/10 text-purple-400' :
                        bet.selectionType === 'champion' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-secondary/10 text-secondary'
                      }`}>
                        {bet.selectionType === 'exact-score' ? <Target size={12} /> : bet.selectionType === 'champion' ? <Crown size={12} /> : <TrendingUp size={12} />}
                      </div>
                      <span className="text-xs font-bold">{bet.selection}</span>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-1">Investido</p>
                        <p className="text-sm font-bold">R$ {formatCurrency(bet.amount)}</p>
                      </div>
                      {bet.pointsEarned !== undefined && bet.pointsEarned > 0 && (
                        <div className="text-center">
                          <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-1">Pontos</p>
                          <p className="text-sm font-bold text-secondary">+{bet.pointsEarned}</p>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-1">Retorno</p>
                        <p className={`text-lg font-headline font-bold ${bet.status === 'ganhou' ? 'text-green-500' : bet.status === 'pendente' ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                          {bet.status === 'ganhou' ? `R$ ${formatCurrency(bet.actualReturn || bet.estimatedReturn)}` : bet.status === 'pendente' ? `~R$ ${formatCurrency(bet.estimatedReturn)}` : '-'}
                        </p>
                      </div>
                    </div>
                    {bet.isRefundable && bet.status === 'pendente' && (
                      <button
                        onClick={() => setCancelBetId(bet.id)}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors"
                      >
                        <XCircle size={14} />
                        Cancelar Palpite — Receber R$ {formatCurrency(bet.amount)} de volta
                      </button>
                    )}
                    {!bet.isRefundable && bet.status === 'pendente' && (
                      <div className="mt-3 flex items-center gap-1.5 text-amber-400/70">
                        <Lock size={10} />
                        <span className="text-[9px] italic">{bet.selectionType === 'champion' ? 'Palpite irrevogável' : 'Partida em andamento — cancelamento bloqueado'}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-surface rounded-2xl border border-white/5">
                  <p className="text-sm text-on-surface-variant">Nenhum palpite realizado</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelBet && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCancelBetId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface rounded-3xl z-[70] p-6 border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={28} className="text-red-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Cancelar Palpite?</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Seu palpite em <strong className="text-white">{cancelBet.selection}</strong> será cancelado e o valor de <strong className="text-secondary">R$ {formatCurrency(cancelBet.amount)}</strong> voltará ao seu saldo.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelBetId(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-colors"
                >
                  Manter
                </button>
                <button
                  onClick={() => {
                    onCancelBet(cancelBet.id);
                    setCancelBetId(null);
                  }}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Cancelar Palpite
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const RankingScreen = () => {
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <div className="pb-24 lg:pb-8">
      <Header
        title="Ranking"
        rightElement={
          <button onClick={() => setShowRulesModal(true)} className="p-2 bg-surface rounded-full text-on-surface-variant hover:text-secondary transition-colors">
            <HelpCircle size={18} />
          </button>
        }
      />

      <div className="px-6 mt-6">
        {/* Prizes Banner */}
        <div className="bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl p-4 mb-8 border border-secondary/20">
          <div className="flex items-center gap-3 mb-3">
            <Trophy size={20} className="text-secondary" />
            <h3 className="text-sm font-bold">Premiacao Top 3</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/20 rounded-xl p-2 text-center">
              <p className="text-secondary text-lg font-black">1o</p>
              <p className="text-[9px] text-on-surface-variant uppercase">A definir</p>
            </div>
            <div className="bg-black/20 rounded-xl p-2 text-center">
              <p className="text-slate-400 text-lg font-black">2o</p>
              <p className="text-[9px] text-on-surface-variant uppercase">A definir</p>
            </div>
            <div className="bg-black/20 rounded-xl p-2 text-center">
              <p className="text-amber-700 text-lg font-black">3o</p>
              <p className="text-[9px] text-on-surface-variant uppercase">A definir</p>
            </div>
          </div>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-12 pt-8">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img src={MOCK_RANKING[1].avatar} alt="2nd" className="w-16 h-16 rounded-full border-2 border-slate-400 p-0.5" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">2</div>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] font-bold block">{MOCK_RANKING[1].name}</span>
              <span className="text-[10px] text-secondary font-bold">{MOCK_RANKING[1].points} pts</span>
            </div>
            <div className="h-16 w-12 bg-slate-400/20 rounded-t-lg" />
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-secondary animate-bounce"><Trophy size={24} /></div>
              <img src={MOCK_RANKING[0].avatar} alt="1st" className="w-20 h-20 rounded-full border-2 border-secondary p-0.5" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">1</div>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs font-bold block">{MOCK_RANKING[0].name}</span>
              <span className="text-[10px] text-secondary font-bold">{MOCK_RANKING[0].points} pts</span>
            </div>
            <div className="h-24 w-16 bg-secondary/20 rounded-t-lg" />
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img src={MOCK_RANKING[2].avatar} alt="3rd" className="w-14 h-14 rounded-full border-2 border-amber-700 p-0.5" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">3</div>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] font-bold block">{MOCK_RANKING[2].name}</span>
              <span className="text-[10px] text-secondary font-bold">{MOCK_RANKING[2].points} pts</span>
            </div>
            <div className="h-12 w-10 bg-amber-700/20 rounded-t-lg" />
          </div>
        </div>

        {/* My Rank */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-black text-secondary">#12</span>
            <div>
              <h4 className="text-sm font-bold">Voce (Seu Nome)</h4>
              <p className="text-[10px] text-on-surface-variant">Faltam 20 pts para o Top 10</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">25 pts</p>
            <p className="text-[10px] text-green-500 font-bold">+3 posicoes</p>
          </div>
        </div>

        {/* Full Ranking */}
        <div className="bg-surface rounded-3xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <div className="col-span-1">Pos</div>
            <div className="col-span-5">Participante</div>
            <div className="col-span-3 text-center hidden lg:block">Detalhes</div>
            <div className="col-span-6 lg:col-span-3 text-right">Pontos</div>
          </div>

          <div className="divide-y divide-white/5">
            {MOCK_RANKING.map((user) => (
              <div key={user.pos} className="grid grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-1 font-black text-on-surface-variant">{user.pos}</div>
                <div className="col-span-5 flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="text-xs font-bold">{user.name}</h5>
                    <p className="text-[8px] text-on-surface-variant uppercase">{user.district}</p>
                  </div>
                </div>
                <div className="col-span-3 text-center hidden lg:block">
                  <p className="text-[9px] text-on-surface-variant">
                    {user.breakdown.exactScoreHits} placares | {user.breakdown.resultHits} resultados
                  </p>
                </div>
                <div className="col-span-6 lg:col-span-3 text-right">
                  <p className="text-xs font-bold">{user.points} pts</p>
                  <p className="text-[8px] text-on-surface-variant lg:hidden">
                    {user.breakdown.exactScoreHits}P {user.breakdown.resultHits}R
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRulesModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRulesModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-surface rounded-3xl z-[70] overflow-hidden border border-white/10 shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                  <Trophy size={20} className="text-secondary" />
                  Como funciona a pontuacao?
                </h3>
                <button onClick={() => setShowRulesModal(false)} className="p-2 bg-white/5 rounded-full text-on-surface-variant hover:text-white transition-colors"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0"><CheckCircle2 size={16} className="text-secondary" /></div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Participacao</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Pontos só contam para quem fez palpite no bolão correspondente.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0"><Star size={16} className="text-secondary" /></div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Acertar o Resultado</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Acertou quem vence ou se empata? Ganha <strong className="text-secondary">5 pontos</strong>.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0"><Target size={16} className="text-secondary" /></div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Acertar o Placar Exato</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Acertou o placar? Ganha <strong className="text-secondary">15 pontos</strong> (nao acumula com os 5 do resultado).</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0"><Crown size={16} className="text-secondary" /></div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Acertar o Campeao</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Acertou o campeao do torneio? Ganha <strong className="text-secondary">50 pontos</strong>.</p>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button onClick={() => setShowRulesModal(false)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors text-sm">Entendi</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileScreen = ({ setScreen, balance, onShowHelp, onShowNotifications }: { setScreen: (s: AppScreen) => void, balance: number, onShowHelp: () => void, onShowNotifications: () => void }) => {
  const [activeSubScreen, setActiveSubScreen] = useState<'main' | 'personal' | 'security' | 'privacy' | 'change-password' | '2fa' | 'devices'>('main');
  const [personalData, setPersonalData] = useState({
    name: 'Felipe Soares',
    email: 'felipe.soares@email.com',
    phone: '(62) 99999-9999',
    cpf: '***.***.***-**',
    birthDate: '15/05/1995'
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [devices, setDevices] = useState([
    { id: 1, name: 'iPhone 15 Pro', location: 'Goiânia, Brasil', status: 'Atual', icon: <Settings size={18} /> },
    { id: 2, name: 'MacBook Air M2', location: 'São Paulo, Brasil', status: 'Ativo há 2 horas', icon: <Settings size={18} /> },
    { id: 3, name: 'Windows PC', location: 'Brasília, Brasil', status: 'Ativo há 3 dias', icon: <Settings size={18} /> },
  ]);
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showInRanking: true,
    receiveMessages: false
  });

  const handleBack = () => {
    if (['change-password', '2fa', 'devices'].includes(activeSubScreen)) {
      setActiveSubScreen('security');
    } else {
      setActiveSubScreen('main');
    }
    setEditingField(null);
    setShowSuccess(false);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUpdating(false);
    setEditingField(null);
    alert('Dados salvos com sucesso!');
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert('Preencha todos os campos.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert('As senhas não coincidem.');
      return;
    }
    
    setIsUpdating(true);
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUpdating(false);
    
    setShowSuccess(true);
    setPasswords({ current: '', new: '', confirm: '' });
    
    setTimeout(() => {
      setShowSuccess(false);
      setActiveSubScreen('security');
    }, 2000);
  };

  if (activeSubScreen === 'personal') {
    const fields = [
      { key: 'name', label: 'Nome Completo', value: personalData.name },
      { key: 'email', label: 'E-mail', value: personalData.email },
      { key: 'phone', label: 'Telefone', value: personalData.phone },
      { key: 'cpf', label: 'CPF', value: personalData.cpf },
      { key: 'birthDate', label: 'Data de Nascimento', value: personalData.birthDate },
    ];

    return (
      <div className="pb-24 lg:pb-8">
        <Header title="Dados Pessoais" onBack={handleBack} />
        <div className="px-6 mt-6 space-y-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <img src="https://picsum.photos/seed/me/200" alt="Avatar" className="w-24 h-24 rounded-full border-4 border-surface p-1" referrerPolicy="no-referrer" />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-secondary text-black rounded-full flex items-center justify-center border-4 border-background">
                <PlusCircle size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="bg-surface rounded-2xl p-4 border border-white/5">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{field.label}</p>
                <div className="flex justify-between items-center">
                  {editingField === field.key ? (
                    <input 
                      autoFocus
                      type="text"
                      value={field.value}
                      onChange={(e) => setPersonalData({ ...personalData, [field.key]: e.target.value })}
                      onBlur={() => setEditingField(null)}
                      className="bg-transparent text-sm font-medium focus:outline-none text-white w-full border-b border-secondary/50 pb-1"
                    />
                  ) : (
                    <>
                      <span className="text-sm font-medium">{field.value}</span>
                      <button 
                        onClick={() => setEditingField(field.key)}
                        className="text-secondary text-xs font-bold uppercase"
                      >
                        Editar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-4 bg-secondary text-black font-bold rounded-2xl editorial-shadow mt-8 active:scale-95 transition-transform"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    );
  }

  if (activeSubScreen === 'change-password') {
    return (
      <div className="pb-24 lg:pb-8">
        <Header title="Alterar Senha" onBack={handleBack} />
        <div className="px-6 mt-6 space-y-6">
          {showSuccess ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-green-500 text-black rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">Senha Atualizada!</h3>
              <p className="text-xs text-on-surface-variant">Sua nova senha foi configurada com sucesso.</p>
            </motion.div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Senha Atual</label>
                  <input 
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full bg-surface border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-secondary"
                    placeholder="••••••••"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Nova Senha</label>
                  <input 
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full bg-surface border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-secondary"
                    placeholder="••••••••"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Confirmar Nova Senha</label>
                  <input 
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full bg-surface border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-secondary"
                    placeholder="••••••••"
                    disabled={isUpdating}
                  />
                </div>
              </div>
              <button 
                onClick={handleChangePassword}
                disabled={isUpdating}
                className={`w-full py-4 bg-secondary text-black font-bold rounded-2xl editorial-shadow mt-4 flex items-center justify-center gap-2 ${isUpdating ? 'opacity-70' : ''}`}
              >
                {isUpdating ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Atualizar Senha'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (activeSubScreen === '2fa') {
    return (
      <div className="pb-24 lg:pb-8">
        <Header title="Autenticação em Duas Etapas" onBack={handleBack} />
        <div className="px-6 mt-6 space-y-6">
          <div className="bg-surface rounded-3xl p-6 border border-white/5 text-center">
            <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrCode size={32} />
            </div>
            <h3 className="font-bold mb-2">Proteja sua conta</h3>
            <p className="text-xs text-on-surface-variant mb-6">Adicione uma camada extra de segurança exigindo um código do seu celular ao entrar.</p>
            
            <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-white/5">
              <span className="text-sm font-medium">Status do 2FA</span>
              <button 
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors ${is2FAEnabled ? 'bg-secondary' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${is2FAEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {is2FAEnabled && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BolaoInterbairros2FA" alt="QR Code" className="w-full h-full" />
              </div>
              <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest">Escaneie o código no seu app de autenticação</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSubScreen === 'devices') {
    return (
      <div className="pb-24 lg:pb-8">
        <Header title="Dispositivos Conectados" onBack={handleBack} />
        <div className="px-6 mt-6 space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="bg-surface rounded-2xl p-4 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/5 rounded-xl text-on-surface-variant">
                  {device.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{device.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{device.location} • {device.status}</p>
                </div>
              </div>
              {device.status !== 'Atual' && (
                <button 
                  onClick={() => {
                    setDevices(devices.filter(d => d.id !== device.id));
                    alert('Dispositivo desconectado.');
                  }}
                  className="text-red-500 text-[10px] font-bold uppercase"
                >
                  Sair
                </button>
              )}
            </div>
          ))}
          <button 
            onClick={() => {
              setDevices(devices.filter(d => d.status === 'Atual'));
              alert('Você saiu de todos os outros dispositivos.');
            }}
            className="w-full py-4 text-red-500 text-xs font-bold uppercase tracking-widest mt-4 active:scale-95 transition-transform"
          >
            Sair de todos os dispositivos
          </button>
        </div>
      </div>
    );
  }

  if (activeSubScreen === 'security') {
    return (
      <div className="pb-24 lg:pb-8">
        <Header title="Segurança e Senha" onBack={handleBack} />
        <div className="px-6 mt-6 space-y-4">
          <div className="bg-surface rounded-2xl p-6 border border-white/5 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Shield size={24} /></div>
              <div>
                <h3 className="font-bold">Sua conta está segura</h3>
                <p className="text-xs text-on-surface-variant">Última alteração de senha há 3 meses</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveSubScreen('change-password')}
            className="w-full bg-surface rounded-2xl p-4 border border-white/5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-xl text-on-surface-variant"><Lock size={18} /></div>
              <span className="text-sm font-medium">Alterar Senha</span>
            </div>
            <ChevronRight size={16} className="text-on-surface-variant" />
          </button>

          <button 
            onClick={() => setActiveSubScreen('2fa')}
            className="w-full bg-surface rounded-2xl p-4 border border-white/5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-xl text-on-surface-variant"><QrCode size={18} /></div>
              <span className="text-sm font-medium">Autenticação em Duas Etapas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase ${is2FAEnabled ? 'text-green-500' : 'text-red-500'}`}>
                {is2FAEnabled ? 'Ativo' : 'Inativo'}
              </span>
              <ChevronRight size={16} className="text-on-surface-variant" />
            </div>
          </button>

          <button 
            onClick={() => setActiveSubScreen('devices')}
            className="w-full bg-surface rounded-2xl p-4 border border-white/5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-xl text-on-surface-variant"><Settings size={18} /></div>
              <span className="text-sm font-medium">Dispositivos Conectados</span>
            </div>
            <ChevronRight size={16} className="text-on-surface-variant" />
          </button>
        </div>
      </div>
    );
  }

  if (activeSubScreen === 'privacy') {
    const settings = [
      { key: 'publicProfile', label: 'Perfil Público', desc: 'Permitir que outros vejam suas estatísticas', active: privacySettings.publicProfile },
      { key: 'showInRanking', label: 'Exibir no Ranking', desc: 'Sua posição será visível para todos', active: privacySettings.showInRanking },
      { key: 'receiveMessages', label: 'Receber Mensagens', desc: 'Permitir convites para novos bolões', active: privacySettings.receiveMessages },
    ];

    return (
      <div className="pb-24 lg:pb-8">
        <Header title="Privacidade" onBack={handleBack} />
        <div className="px-6 mt-6 space-y-4">
          {settings.map((item) => (
            <div key={item.key} className="bg-surface rounded-2xl p-4 border border-white/5 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-bold mb-1">{item.label}</h4>
                <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
              </div>
              <button 
                onClick={() => setPrivacySettings({ ...privacySettings, [item.key]: !item.active })}
                className={`w-12 h-6 rounded-full relative transition-colors ${item.active ? 'bg-secondary' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.active ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      <Header 
        title="Meu Perfil" 
        rightElement={<button className="p-2 bg-surface rounded-full text-on-surface-variant"><Settings size={18} /></button>}
      />
      
      <div className="px-6 mt-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img src="https://picsum.photos/seed/me/200" alt="Avatar" className="w-24 h-24 rounded-full border-4 border-surface p-1" referrerPolicy="no-referrer" />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-background rounded-full" />
          </div>
          <h2 className="text-xl font-headline font-bold mb-1">Felipe Soares</h2>
          <p className="text-xs text-on-surface-variant font-medium">Membro desde Outubro 2023</p>
          <div className="mt-3 px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider">Nível Diamante</div>
        </div>

        {/* Balance Summary */}
        <div className="bg-surface rounded-3xl p-6 border border-white/5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Saldo Total</p>
            <h3 className="text-2xl font-headline font-bold">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          </div>
          <button onClick={() => setScreen('wallet')} className="p-3 bg-secondary text-black rounded-2xl"><ChevronRight size={20} /></button>
        </div>

        {/* Menu Options */}
        <div className="space-y-2">
          {[
            { icon: UserIcon, label: 'Dados Pessoais', color: 'text-blue-400', onClick: () => setActiveSubScreen('personal') },
            { icon: Shield, label: 'Segurança e Senha', color: 'text-green-400', onClick: () => setActiveSubScreen('security') },
            { icon: Bell, label: 'Notificações', color: 'text-yellow-400', onClick: onShowNotifications },
            { icon: Lock, label: 'Privacidade', color: 'text-purple-400', onClick: () => setActiveSubScreen('privacy') },
            { icon: HelpCircle, label: 'Central de Ajuda', color: 'text-pink-400', onClick: onShowHelp },
          ].map((item) => (
            <button 
              key={item.label} 
              onClick={item.onClick}
              className="w-full bg-surface rounded-2xl p-4 border border-white/5 flex items-center justify-between group hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 bg-white/5 rounded-xl ${item.color}`}><item.icon size={18} /></div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-on-surface-variant group-hover:text-white transition-colors" />
            </button>
          ))}
          
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="w-full bg-red-500/5 rounded-2xl p-4 border border-red-500/10 flex items-center gap-4 mt-4 text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <div className="p-2 bg-red-500/10 rounded-xl"><LogOut size={18} /></div>
            <span className="text-sm font-bold">Sair da Conta</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowLogoutConfirm(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-surface rounded-[40px] p-8 w-full max-w-sm border border-white/10 text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <LogOut size={32} />
            </div>
            <h3 className="text-xl font-headline font-bold mb-2">Deseja sair?</h3>
            <p className="text-sm text-on-surface-variant mb-8">Você precisará entrar novamente para acessar suas apostas e saldo.</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => setScreen('login')}
                className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl"
              >
                Sim, Sair agora
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-4 bg-white/5 text-white font-bold rounded-2xl"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = () => {
    if (!email) {
      alert('Por favor, insira seu e-mail para recuperar a senha.');
      return;
    }
    setResetSent(true);
    setTimeout(() => setResetSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Desktop: logo panel esquerda */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-surface-low items-center justify-center border-r border-white/5 p-12">
        <div className="text-center">
          <img src="/logo-com-fundo.jpeg" alt="Desafio Interbairros" className="w-64 h-64 rounded-3xl object-cover mx-auto mb-8 editorial-shadow" />
          <h2 className="text-2xl font-headline font-black mb-2">Desafio Interbairros</h2>
          <p className="text-on-surface-variant text-sm">A plataforma oficial do maior bolão de bairros da cidade.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col px-8 pt-16 pb-12 lg:justify-center lg:max-w-md lg:mx-auto lg:w-full">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <img src="/logo-reduzida.png" alt="Logo" className="w-14 h-14 rounded-2xl object-cover editorial-shadow" />
          <div>
            <h1 className="text-2xl font-headline font-black leading-tight">Bem-vindo de volta!</h1>
            <p className="text-xs text-on-surface-variant font-medium">Desafio Interbairros</p>
          </div>
        </div>
        <p className="text-on-surface-variant">Acesse sua conta para continuar apostando nos seus bairros favoritos.</p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">E-mail</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full bg-surface border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Senha</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full bg-surface border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        <div className="text-right">
          {resetSent ? (
            <span className="text-xs font-bold text-green-500">Link de recuperação enviado!</span>
          ) : (
            <button onClick={handleForgotPassword} className="text-xs font-bold text-secondary hover:underline">
              Esqueceu a senha?
            </button>
          )}
        </div>
      </div>

      <button 
        onClick={onLogin}
        className="w-full py-4 bg-secondary text-black font-bold rounded-2xl editorial-shadow mb-8 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Entrar
      </button>

      <div className="mt-auto text-center">
        <p className="text-sm text-on-surface-variant">
          Não tem uma conta? <button onClick={onLogin} className="font-bold text-secondary hover:underline">Criar Agora</button>
        </p>
      </div>
      </div>
    </div>
  );
};

// --- Main App ---

// --- HowItWorksScreen ---

const HowItWorksScreen = ({ onBack }: { onBack: () => void }) => {
  const sections = [
    { icon: <Info size={20} className="text-secondary" />, title: 'O que e o Bolao Interbairros?', text: 'Uma plataforma de palpites esportivos para o Campeonato Interbairros de Nanuque/MG. Faca previsoes sobre os jogos e ganhe com seus acertos!' },
    { icon: <Target size={20} className="text-secondary" />, title: 'Como Fazer um Palpite', text: '1. Escolha um jogo na tela inicial\n2. Selecione o resultado (vitoria, empate ou placar exato)\n3. Insira o valor que deseja investir\n4. Veja o retorno estimado e confirme\n\nO valor e deduzido do seu saldo imediatamente.' },
    { icon: <TrendingUp size={20} className="text-secondary" />, title: 'Sistema de Pool (Parimutuel)', text: 'Todo o dinheiro investido em um jogo vai para um pool coletivo. Quem acerta divide o montante dos que erraram, proporcionalmente ao valor investido.\n\nExemplo: Se R$1.000 foram investidos no total e voce colocou R$100 no resultado correto (que tem R$500), voce ganha 20% do pool dos perdedores (R$500), menos 20% de comissao.' },
    { icon: <Star size={20} className="text-secondary" />, title: 'Retorno Estimado', text: 'Antes de confirmar, voce ve uma estimativa de quanto pode ganhar. Essa estimativa e dinamica e muda conforme mais pessoas fazem palpites.\n\nQuanto menos gente apostar no seu resultado, maior o retorno potencial!' },
    { icon: <Crown size={20} className="text-secondary" />, title: 'Pontuacao e Ranking', text: 'Alem de ganhar dinheiro, voce acumula pontos:\n\n- Acertar o resultado: 5 pontos\n- Acertar o placar exato: 15 pontos\n- Acertar o campeao: 50 pontos\n\nOs Top 3 do ranking serao premiados ao final do campeonato!' },
    { icon: <AlertCircle size={20} className="text-amber-400" />, title: 'Campeao do Torneio', text: 'Voce pode apostar em qual time sera o campeao. ATENCAO: este e o unico palpite irrevogavel. Se o time for eliminado, o valor investido sera perdido.' },
    { icon: <WalletIcon size={20} className="text-secondary" />, title: 'Carteira e PIX', text: 'Deposite via PIX (minimo R$10). Saque a qualquer momento com taxa fixa de R$2,00. Seu saldo e atualizado em tempo real.' },
  ];

  return (
    <div className="pb-24 lg:pb-8">
      <Header title="Como Funciona" onBack={onBack} />
      <div className="px-6 mt-6 space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-surface rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0">{section.icon}</div>
              <h3 className="text-sm font-bold">{section.title}</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line">{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  // Wallet State
  const [balance, setBalance] = useState(1250.00);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [bets, setBets] = useState<Bet[]>(MOCK_BETS);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const openDeposit = () => {
    setTransactionType('deposit');
    setShowTransactionModal(true);
  };

  const handlePlaceBet = (amount: number, selection: string, estimatedReturn: number, selectionType: 'result' | 'exact-score' | 'champion' = 'result') => {
    if (!isLoggedIn) {
      setCurrentScreen('login');
      return;
    }

    const matchName = selectionType === 'champion'
      ? selection.replace('Campeão: ', '')
      : `${selectedMatch?.homeTeam.name} vs ${selectedMatch?.awayTeam.name}`;

    const league = selectionType === 'champion'
      ? 'Campeão do Torneio'
      : selectedMatch?.league || '';

    const matchId = selectionType === 'champion' ? 'champion' : selectedMatch?.id || '';

    const newBet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
      matchId,
      match: matchName,
      league,
      date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      selection,
      selectionType,
      amount,
      estimatedReturn,
      status: 'pendente',
      isRefundable: selectionType !== 'champion',
    };

    setBalance(prev => prev - amount);
    setBets(prev => [newBet, ...prev]);
  };

  const handleCancelBet = (betId: string) => {
    const bet = bets.find(b => b.id === betId);
    if (!bet || !bet.isRefundable || bet.status !== 'pendente') return;
    setBalance(prev => prev + bet.amount);
    setBets(prev => prev.filter(b => b.id !== betId));
  };

  const handleTransaction = (amount: number, method: string) => {
    const isDeposit = transactionType === 'deposit';
    if (!isDeposit && amount > balance) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: transactionType,
      method,
      amount: isDeposit ? amount : -amount,
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' •'),
      status: 'pago'
    };

    setBalance(prev => isDeposit ? prev + amount : prev - amount);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    setCurrentScreen('game-details');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onSelectMatch={handleSelectMatch} setScreen={setCurrentScreen} onShowNotifications={() => setShowNotifications(true)} unreadCount={unreadCount} balance={balance} isLoggedIn={isLoggedIn} bets={bets} />;
      case 'champion':
        return <ChampionScreen balance={balance} onPlaceBet={(a, s, er) => handlePlaceBet(a, s, er, 'champion')} onOpenDeposit={openDeposit} championBets={bets.filter(b => b.matchId === 'champion')} />;
      case 'how-it-works':
        return <HowItWorksScreen onBack={() => setCurrentScreen('home')} />;
      case 'game-details':
        return selectedMatch ? (
          <GameDetailsScreen
            match={selectedMatch}
            onBack={() => setCurrentScreen('home')}
            balance={balance}
            onPlaceBet={handlePlaceBet}
            onOpenDeposit={openDeposit}
            bets={bets.filter(b => b.matchId === selectedMatch.id)}
            onCancelBet={handleCancelBet}
          />
        ) : <HomeScreen onSelectMatch={handleSelectMatch} setScreen={setCurrentScreen} onShowNotifications={() => setShowNotifications(true)} unreadCount={unreadCount} balance={balance} isLoggedIn={isLoggedIn} bets={bets} />;
      case 'wallet':
        return (
          <WalletScreen
            balance={balance}
            transactions={transactions}
            bets={bets}
            onOpenTransaction={(type) => { setTransactionType(type); setShowTransactionModal(true); }}
            onShowHelp={() => setShowHelpModal(true)}
            onShowAllTransactions={() => setShowAllTransactions(true)}
            onCancelBet={handleCancelBet}
          />
        );
      case 'ranking':
        return <RankingScreen />;
      case 'profile':
        return (
          <ProfileScreen
            setScreen={setCurrentScreen}
            balance={balance}
            onShowHelp={() => setShowHelpModal(true)}
            onShowNotifications={() => setShowNotifications(true)}
          />
        );
      case 'login':
        return <LoginScreen onLogin={() => { setIsLoggedIn(true); setCurrentScreen('home'); }} />;
      default:
        return <HomeScreen onSelectMatch={handleSelectMatch} setScreen={setCurrentScreen} onShowNotifications={() => setShowNotifications(true)} unreadCount={unreadCount} balance={balance} isLoggedIn={isLoggedIn} bets={bets} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {currentScreen !== 'login' && (
        <>
          <DesktopSidebar
            currentScreen={currentScreen}
            setScreen={setCurrentScreen}
            balance={balance}
            isLoggedIn={isLoggedIn}
          />
          <DesktopTopBar
            currentScreen={currentScreen}
            onShowNotifications={() => setShowNotifications(true)}
            unreadCount={unreadCount}
            isLoggedIn={isLoggedIn}
            balance={balance}
            setScreen={setCurrentScreen}
            onBack={currentScreen === 'game-details' || currentScreen === 'how-it-works' ? () => setCurrentScreen('home') : undefined}
          />
        </>
      )}

      <div className={
        currentScreen === 'login'
          ? 'min-h-screen'
          : 'max-w-md mx-auto relative shadow-2xl shadow-black overflow-x-hidden lg:max-w-none lg:mx-0 lg:ml-60 lg:shadow-none lg:overflow-x-visible lg:pt-16'
      }>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        <NotificationsOverlay
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          type={transactionType}
          onConfirm={handleTransaction}
        />

        <HelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />

        <TransactionsOverlay
          isOpen={showAllTransactions}
          onClose={() => setShowAllTransactions(false)}
          transactions={transactions}
        />

        {currentScreen !== 'login' && (
          <>
            {currentScreen === 'home' && (
              <button
                onClick={() => setCurrentScreen('ranking')}
                className="fixed bottom-24 right-6 lg:hidden w-14 h-14 bg-secondary text-black rounded-full shadow-lg shadow-black/50 flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all"
              >
                <Trophy size={24} />
              </button>
            )}
            <Navbar currentScreen={currentScreen} setScreen={setCurrentScreen} />
          </>
        )}
      </div>
    </div>
  );
}
