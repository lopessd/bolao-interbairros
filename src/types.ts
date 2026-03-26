import {
  Home,
  Trophy,
  Wallet,
  User,
  History,
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
  HelpCircle
} from 'lucide-react';

export type AppScreen = 'home' | 'game-details' | 'wallet' | 'ranking' | 'login' | 'profile' | 'champion' | 'how-it-works';

export interface PoolState {
  matchId: string;
  outcomes: {
    home: number;
    draw: number;
    away: number;
  };
  exactScores: Record<string, number>;
  totalPool: number;
}

export interface BetSlipItem {
  matchId: string;
  matchName: string;
  league: string;
  selection: string;
  selectionType: 'result' | 'exact-score';
  outcomeKey: 'home' | 'draw' | 'away' | string;
  amount: number;
  estimatedReturn: number;
}

export interface Match {
  id: string;
  league: string;
  time: string;
  location: string;
  status: 'open' | 'ongoing' | 'finished';
  homeTeam: {
    name: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    logo: string;
  };
  score?: {
    home: number;
    away: number;
  };
}

export const MOCK_MATCHES: Match[] = [
  // 1ª Rodada
  {
    id: 'r1-1',
    league: '1ª Rodada - Grupo B',
    time: '28/03 (Sáb) – 17:15h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'finished',
    score: { home: 2, away: 1 },
    homeTeam: { name: 'Romilda Ruas', logo: 'https://picsum.photos/seed/romildaruas/100' },
    awayTeam: { name: 'Vila Esperança', logo: 'https://picsum.photos/seed/vilaesperanca/100' },
  },
  {
    id: 'r1-2',
    league: '1ª Rodada - Grupo D',
    time: '28/03 (Sáb) – 19:15h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'ongoing',
    score: { home: 1, away: 1 },
    homeTeam: { name: 'Zarur', logo: 'https://picsum.photos/seed/zarur/100' },
    awayTeam: { name: 'Sete de Setembro', logo: 'https://picsum.photos/seed/setedesetembro/100' },
  },
  {
    id: 'r1-3',
    league: '1ª Rodada - Grupo A',
    time: '29/03 (Dom) – 15:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Reta', logo: 'https://picsum.photos/seed/reta/100' },
    awayTeam: { name: 'Izadélfia Ferraz', logo: 'https://picsum.photos/seed/izadelfiaferraz/100' },
  },
  {
    id: 'r1-4',
    league: '1ª Rodada - Grupo C',
    time: '29/03 (Dom) – 17:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Nova', logo: 'https://picsum.photos/seed/vilanova/100' },
    awayTeam: { name: 'Campinho', logo: 'https://picsum.photos/seed/campinho/100' },
  },
  // 2ª Rodada
  {
    id: 'r2-1',
    league: '2ª Rodada - Grupo C',
    time: '04/04 (Sáb) – 16:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Israel Pinheiro', logo: 'https://picsum.photos/seed/israelpinheiro/100' },
    awayTeam: { name: 'Espírito Santo', logo: 'https://picsum.photos/seed/espiritosanto/100' },
  },
  {
    id: 'r2-2',
    league: '2ª Rodada - Grupo B',
    time: '04/04 (Sáb) – 18:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'UDR', logo: 'https://picsum.photos/seed/udr/100' },
    awayTeam: { name: 'Santa Helena', logo: 'https://picsum.photos/seed/santahelena/100' },
  },
  {
    id: 'r2-3',
    league: '2ª Rodada - Grupo A',
    time: '05/04 (Dom) – 15:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Gabriel Passos', logo: 'https://picsum.photos/seed/vilagabrielpassos/100' },
    awayTeam: { name: 'Vila Pereira', logo: 'https://picsum.photos/seed/vilapereira/100' },
  },
  {
    id: 'r2-4',
    league: '2ª Rodada - Grupo D',
    time: '05/04 (Dom) – 17:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Feirinha', logo: 'https://picsum.photos/seed/feirinha/100' },
    awayTeam: { name: 'Vista Linda', logo: 'https://picsum.photos/seed/vistalinda/100' },
  },
  // 3ª Rodada
  {
    id: 'r3-1',
    league: '3ª Rodada - Grupo C',
    time: '11/04 (Sáb) – 16:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Campinho', logo: 'https://picsum.photos/seed/campinho/100' },
    awayTeam: { name: 'Espírito Santo', logo: 'https://picsum.photos/seed/espiritosanto/100' },
  },
  {
    id: 'r3-2',
    league: '3ª Rodada - Grupo A',
    time: '11/04 (Sáb) – 18:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Gabriel Passos', logo: 'https://picsum.photos/seed/vilagabrielpassos/100' },
    awayTeam: { name: 'Reta', logo: 'https://picsum.photos/seed/reta/100' },
  },
  {
    id: 'r3-3',
    league: '3ª Rodada - Grupo A',
    time: '12/04 (Dom) – 15:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Stella', logo: 'https://picsum.photos/seed/stella/100' },
    awayTeam: { name: 'Vila Pereira', logo: 'https://picsum.photos/seed/vilapereira/100' },
  },
  {
    id: 'r3-4',
    league: '3ª Rodada - Grupo B',
    time: '12/04 (Dom) – 17:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'UDR', logo: 'https://picsum.photos/seed/udr/100' },
    awayTeam: { name: 'Romilda Ruas', logo: 'https://picsum.photos/seed/romildaruas/100' },
  },
  // 4ª Rodada
  {
    id: 'r4-1',
    league: '4ª Rodada - Grupo A',
    time: '18/04 (Sáb) – 16:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Izadélfia Ferraz', logo: 'https://picsum.photos/seed/izadelfiaferraz/100' },
    awayTeam: { name: 'Stella', logo: 'https://picsum.photos/seed/stella/100' },
  },
  {
    id: 'r4-2',
    league: '4ª Rodada - Grupo D',
    time: '18/04 (Sáb) – 18:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Feirinha', logo: 'https://picsum.photos/seed/feirinha/100' },
    awayTeam: { name: 'Sete de Setembro', logo: 'https://picsum.photos/seed/setedesetembro/100' },
  },
  {
    id: 'r4-3',
    league: '4ª Rodada - Grupo B',
    time: '19/04 (Dom) – 15:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Esperança', logo: 'https://picsum.photos/seed/vilaesperanca/100' },
    awayTeam: { name: 'Santa Helena', logo: 'https://picsum.photos/seed/santahelena/100' },
  },
  {
    id: 'r4-4',
    league: '4ª Rodada - Grupo D',
    time: '19/04 (Dom) – 17:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vista Linda', logo: 'https://picsum.photos/seed/vistalinda/100' },
    awayTeam: { name: 'Zarur', logo: 'https://picsum.photos/seed/zarur/100' },
  },
  // 5ª Rodada
  {
    id: 'r5-1',
    league: '5ª Rodada - Grupo A',
    time: '21/04 (Ter) – 15:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Pereira', logo: 'https://picsum.photos/seed/vilapereira/100' },
    awayTeam: { name: 'Izadélfia Ferraz', logo: 'https://picsum.photos/seed/izadelfiaferraz/100' },
  },
  {
    id: 'r5-2',
    league: '5ª Rodada - Grupo A',
    time: '21/04 (Ter) – 17:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Gabriel Passos', logo: 'https://picsum.photos/seed/vilagabrielpassos/100' },
    awayTeam: { name: 'Stella', logo: 'https://picsum.photos/seed/stella/100' },
  },
  // 6ª Rodada
  {
    id: 'r6-1',
    league: '6ª Rodada - Grupo C',
    time: '25/04 (Sáb) – 16:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Nova', logo: 'https://picsum.photos/seed/vilanova/100' },
    awayTeam: { name: 'Israel Pinheiro', logo: 'https://picsum.photos/seed/israelpinheiro/100' },
  },
  {
    id: 'r6-2',
    league: '6ª Rodada - Grupo A',
    time: '25/04 (Sáb) – 18:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Pereira', logo: 'https://picsum.photos/seed/vilapereira/100' },
    awayTeam: { name: 'Reta', logo: 'https://picsum.photos/seed/reta/100' },
  },
  {
    id: 'r6-3',
    league: '6ª Rodada - Grupo A',
    time: '26/04 (Dom) – 15:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Gabriel Passos', logo: 'https://picsum.photos/seed/vilagabrielpassos/100' },
    awayTeam: { name: 'Izadélfia Ferraz', logo: 'https://picsum.photos/seed/izadelfiaferraz/100' },
  },
  {
    id: 'r6-4',
    league: '6ª Rodada - Grupo D',
    time: '26/04 (Dom) – 17:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Sete de Setembro', logo: 'https://picsum.photos/seed/setedesetembro/100' },
    awayTeam: { name: 'Vista Linda', logo: 'https://picsum.photos/seed/vistalinda/100' },
  },
  // 7ª Rodada
  {
    id: 'r7-1',
    league: '7ª Rodada - Grupo A',
    time: '01/05 (Sex) – 15:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Reta', logo: 'https://picsum.photos/seed/reta/100' },
    awayTeam: { name: 'Stella', logo: 'https://picsum.photos/seed/stella/100' },
  },
  {
    id: 'r7-2',
    league: '7ª Rodada - Grupo D',
    time: '01/05 (Sex) – 17:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Feirinha', logo: 'https://picsum.photos/seed/feirinha/100' },
    awayTeam: { name: 'Zarur', logo: 'https://picsum.photos/seed/zarur/100' },
  },
  // 8ª Rodada
  {
    id: 'r8-1',
    league: '8ª Rodada - Grupo C',
    time: '02/05 (Sáb) – 16:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Nova', logo: 'https://picsum.photos/seed/vilanova/100' },
    awayTeam: { name: 'Espírito Santo', logo: 'https://picsum.photos/seed/espiritosanto/100' },
  },
  {
    id: 'r8-2',
    league: '8ª Rodada - Grupo C',
    time: '02/05 (Sáb) – 18:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Israel Pinheiro', logo: 'https://picsum.photos/seed/israelpinheiro/100' },
    awayTeam: { name: 'Campinho', logo: 'https://picsum.photos/seed/campinho/100' },
  },
  {
    id: 'r8-3',
    league: '8ª Rodada - Grupo B',
    time: '03/05 (Dom) – 15:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Santa Helena', logo: 'https://picsum.photos/seed/santahelena/100' },
    awayTeam: { name: 'Romilda Ruas', logo: 'https://picsum.photos/seed/romildaruas/100' },
  },
  {
    id: 'r8-4',
    league: '8ª Rodada - Grupo B',
    time: '03/05 (Dom) – 17:45h',
    location: 'Estádio Municipal Murilo Badaró',
    status: 'open',
    homeTeam: { name: 'Vila Esperança', logo: 'https://picsum.photos/seed/vilaesperanca/100' },
    awayTeam: { name: 'UDR', logo: 'https://picsum.photos/seed/udr/100' },
  }
];

// Pool data for each match (mock)
export const MOCK_POOLS: Record<string, PoolState> = {
  'r1-1': { matchId: 'r1-1', outcomes: { home: 540, draw: 240, away: 420 }, exactScores: { '2-1': 80, '1-0': 120, '1-1': 150, '2-0': 60, '3-1': 40 }, totalPool: 1200 },
  'r1-2': { matchId: 'r1-2', outcomes: { home: 380, draw: 320, away: 500 }, exactScores: { '1-1': 180, '0-1': 90, '2-1': 70, '1-0': 60 }, totalPool: 1200 },
  'r1-3': { matchId: 'r1-3', outcomes: { home: 450, draw: 200, away: 350 }, exactScores: { '1-0': 100, '2-1': 80, '0-0': 70, '1-1': 90 }, totalPool: 1000 },
  'r1-4': { matchId: 'r1-4', outcomes: { home: 600, draw: 180, away: 220 }, exactScores: { '2-0': 110, '1-0': 130, '2-1': 70, '0-0': 50 }, totalPool: 1000 },
  'r2-1': { matchId: 'r2-1', outcomes: { home: 320, draw: 280, away: 400 }, exactScores: { '1-1': 90, '0-1': 70, '1-2': 60 }, totalPool: 1000 },
  'r2-2': { matchId: 'r2-2', outcomes: { home: 280, draw: 220, away: 300 }, exactScores: { '1-0': 80, '0-1': 60, '1-1': 100 }, totalPool: 800 },
  'r2-3': { matchId: 'r2-3', outcomes: { home: 350, draw: 200, away: 250 }, exactScores: { '2-0': 70, '1-0': 90, '1-1': 80 }, totalPool: 800 },
  'r2-4': { matchId: 'r2-4', outcomes: { home: 300, draw: 250, away: 250 }, exactScores: { '1-0': 60, '2-1': 50, '0-0': 70 }, totalPool: 800 },
  'r3-1': { matchId: 'r3-1', outcomes: { home: 260, draw: 200, away: 340 }, exactScores: { '0-1': 80, '1-2': 60, '1-1': 90 }, totalPool: 800 },
  'r3-2': { matchId: 'r3-2', outcomes: { home: 380, draw: 180, away: 240 }, exactScores: { '2-0': 70, '1-0': 100, '1-1': 60 }, totalPool: 800 },
  'r3-3': { matchId: 'r3-3', outcomes: { home: 300, draw: 220, away: 280 }, exactScores: { '1-0': 80, '0-1': 60, '2-1': 50 }, totalPool: 800 },
  'r3-4': { matchId: 'r3-4', outcomes: { home: 200, draw: 180, away: 420 }, exactScores: { '0-2': 70, '1-2': 60, '0-1': 90 }, totalPool: 800 },
  'r4-1': { matchId: 'r4-1', outcomes: { home: 350, draw: 200, away: 250 }, exactScores: { '1-0': 90, '2-1': 60, '0-0': 50 }, totalPool: 800 },
  'r4-2': { matchId: 'r4-2', outcomes: { home: 400, draw: 150, away: 250 }, exactScores: { '2-0': 80, '1-0': 70, '3-1': 40 }, totalPool: 800 },
  'r4-3': { matchId: 'r4-3', outcomes: { home: 320, draw: 230, away: 250 }, exactScores: { '1-0': 60, '2-1': 50, '1-1': 80 }, totalPool: 800 },
  'r4-4': { matchId: 'r4-4', outcomes: { home: 280, draw: 240, away: 280 }, exactScores: { '1-1': 100, '0-0': 60, '1-0': 50 }, totalPool: 800 },
  'r5-1': { matchId: 'r5-1', outcomes: { home: 300, draw: 200, away: 300 }, exactScores: { '1-0': 70, '0-1': 70, '1-1': 90 }, totalPool: 800 },
  'r5-2': { matchId: 'r5-2', outcomes: { home: 360, draw: 180, away: 260 }, exactScores: { '2-0': 80, '1-0': 60, '2-1': 50 }, totalPool: 800 },
  'r6-1': { matchId: 'r6-1', outcomes: { home: 400, draw: 200, away: 200 }, exactScores: { '2-0': 90, '1-0': 80, '3-0': 40 }, totalPool: 800 },
  'r6-2': { matchId: 'r6-2', outcomes: { home: 280, draw: 240, away: 280 }, exactScores: { '1-1': 80, '1-0': 50, '0-1': 60 }, totalPool: 800 },
  'r6-3': { matchId: 'r6-3', outcomes: { home: 420, draw: 160, away: 220 }, exactScores: { '2-0': 70, '1-0': 90, '3-1': 30 }, totalPool: 800 },
  'r6-4': { matchId: 'r6-4', outcomes: { home: 300, draw: 200, away: 300 }, exactScores: { '1-0': 60, '0-1': 60, '2-1': 50 }, totalPool: 800 },
  'r7-1': { matchId: 'r7-1', outcomes: { home: 340, draw: 220, away: 240 }, exactScores: { '1-0': 80, '2-1': 60, '1-1': 70 }, totalPool: 800 },
  'r7-2': { matchId: 'r7-2', outcomes: { home: 320, draw: 200, away: 280 }, exactScores: { '1-0': 70, '2-0': 50, '1-1': 60 }, totalPool: 800 },
  'r8-1': { matchId: 'r8-1', outcomes: { home: 380, draw: 180, away: 240 }, exactScores: { '2-0': 80, '1-0': 70, '2-1': 50 }, totalPool: 800 },
  'r8-2': { matchId: 'r8-2', outcomes: { home: 300, draw: 220, away: 280 }, exactScores: { '1-0': 60, '1-1': 80, '0-1': 50 }, totalPool: 800 },
  'r8-3': { matchId: 'r8-3', outcomes: { home: 260, draw: 200, away: 340 }, exactScores: { '0-1': 90, '1-2': 50, '0-2': 60 }, totalPool: 800 },
  'r8-4': { matchId: 'r8-4', outcomes: { home: 320, draw: 200, away: 280 }, exactScores: { '1-0': 70, '2-1': 50, '1-1': 80 }, totalPool: 800 },
};

export interface ChampionTeam {
  name: string;
  district: string;
  logo: string;
  poolAmount: number;
  poolPercentage: number;
}

export const MOCK_TEAMS: ChampionTeam[] = [
  { name: 'Villa Nova', district: 'Bairro Central', poolAmount: 2520, poolPercentage: 42, logo: 'https://picsum.photos/seed/vn/100' },
  { name: 'Horizonte FC', district: 'Zona Leste', poolAmount: 1680, poolPercentage: 28, logo: 'https://picsum.photos/seed/hfc/100' },
  { name: 'União da Vila', district: 'Vila Esperança', poolAmount: 900, poolPercentage: 15, logo: 'https://picsum.photos/seed/uv/100' },
  { name: 'Sporting Bairro', district: 'Centro Velho', poolAmount: 600, poolPercentage: 10, logo: 'https://picsum.photos/seed/sb/100' },
  { name: 'Romilda Ruas', district: 'Romilda Ruas', poolAmount: 300, poolPercentage: 5, logo: 'https://picsum.photos/seed/romildaruas/100' },
];

export const CHAMPION_TOTAL_POOL = 6000;

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  method: string;
  amount: number;
  date: string;
  status: 'pago' | 'pendente' | 'rejeitado';
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'deposit', method: 'PIX', amount: 500, date: '24 Out, 2023 • 14:20', status: 'pago' },
  { id: '2', type: 'withdraw', method: 'PIX', amount: -1200, date: '22 Out, 2023 • 09:15', status: 'pendente' },
  { id: '3', type: 'deposit', method: 'PIX', amount: 100, date: '20 Out, 2023 • 18:45', status: 'rejeitado' },
];

export interface Bet {
  id: string;
  matchId: string;
  match: string;
  league: string;
  date: string;
  selection: string;
  selectionType: 'result' | 'exact-score' | 'champion';
  amount: number;
  estimatedReturn: number;
  actualReturn?: number;
  status: 'ganhou' | 'perdeu' | 'pendente';
  pointsEarned?: number;
  isRefundable: boolean;
}

export const MOCK_BETS: Bet[] = [
  // Jogo finalizado — user acertou resultado
  { id: '1', matchId: 'r1-1', match: 'Romilda Ruas vs Vila Esperança', league: '1ª Rodada - Grupo B', date: '28/03, 17:15', selection: 'Vitória Romilda Ruas', selectionType: 'result', amount: 100, estimatedReturn: 280, actualReturn: 280, status: 'ganhou', pointsEarned: 5, isRefundable: false },
  // Jogo finalizado — user acertou placar exato
  { id: '3', matchId: 'r1-1', match: 'Romilda Ruas vs Vila Esperança', league: '1ª Rodada - Grupo B', date: '28/03, 17:15', selection: 'Placar Exato: 2-1', selectionType: 'exact-score', amount: 30, estimatedReturn: 420, actualReturn: 420, status: 'ganhou', pointsEarned: 15, isRefundable: false },
  // Jogo em andamento — não pode cancelar
  { id: '2', matchId: 'r1-2', match: 'Zarur vs Sete de Setembro', league: '1ª Rodada - Grupo D', date: '28/03, 19:15', selection: 'Empate', selectionType: 'result', amount: 50, estimatedReturn: 165, status: 'pendente', isRefundable: false },
  { id: '5', matchId: 'r1-2', match: 'Zarur vs Sete de Setembro', league: '1ª Rodada - Grupo D', date: '28/03, 19:15', selection: 'Placar Exato: 1-1', selectionType: 'exact-score', amount: 20, estimatedReturn: 310, status: 'pendente', isRefundable: false },
  // Jogo aberto — user já fez palpites, pode cancelar
  { id: '6', matchId: 'r1-3', match: 'Reta vs Izadélfia Ferraz', league: '1ª Rodada - Grupo A', date: '29/03, 15:45', selection: 'Vitória Reta', selectionType: 'result', amount: 80, estimatedReturn: 195, status: 'pendente', isRefundable: true },
  { id: '7', matchId: 'r1-3', match: 'Reta vs Izadélfia Ferraz', league: '1ª Rodada - Grupo A', date: '29/03, 15:45', selection: 'Placar Exato: 2-0', selectionType: 'exact-score', amount: 25, estimatedReturn: 380, status: 'pendente', isRefundable: true },
  // Campeão — irrevogável
  { id: '4', matchId: 'champion', match: 'Vila Nova', league: 'Campeão do Torneio', date: '25/03, 10:00', selection: 'Vila Nova Campeão', selectionType: 'champion', amount: 200, estimatedReturn: 476, status: 'pendente', isRefundable: false },
];

export interface RankingEntry {
  pos: string;
  name: string;
  district: string;
  avatar: string;
  points: number;
  breakdown: {
    exactScoreHits: number;
    resultHits: number;
    championCorrect: boolean;
  };
  gamesParticipated: number;
}

export const MOCK_RANKING: RankingEntry[] = [
  { pos: '01', name: 'Felipe S.', district: 'Centro', avatar: 'https://picsum.photos/seed/p1/100', points: 135, breakdown: { exactScoreHits: 3, resultHits: 12, championCorrect: false }, gamesParticipated: 18 },
  { pos: '02', name: 'Ricardo M.', district: 'Industrial', avatar: 'https://picsum.photos/seed/p2/100', points: 110, breakdown: { exactScoreHits: 2, resultHits: 10, championCorrect: false }, gamesParticipated: 15 },
  { pos: '03', name: 'Bia Costa', district: 'Jardins', avatar: 'https://picsum.photos/seed/p3/100', points: 95, breakdown: { exactScoreHits: 1, resultHits: 14, championCorrect: false }, gamesParticipated: 20 },
  { pos: '04', name: 'Lucas Lima', district: 'Bela Vista', avatar: 'https://picsum.photos/seed/p4/100', points: 80, breakdown: { exactScoreHits: 2, resultHits: 7, championCorrect: false }, gamesParticipated: 12 },
  { pos: '05', name: 'Ana Paula', district: 'Vila Nova', avatar: 'https://picsum.photos/seed/p5/100', points: 75, breakdown: { exactScoreHits: 1, resultHits: 10, championCorrect: false }, gamesParticipated: 14 },
  { pos: '06', name: 'Carlos M.', district: 'Romilda Ruas', avatar: 'https://picsum.photos/seed/p6/100', points: 60, breakdown: { exactScoreHits: 0, resultHits: 12, championCorrect: false }, gamesParticipated: 16 },
  { pos: '07', name: 'Juliana R.', district: 'Campinho', avatar: 'https://picsum.photos/seed/p7/100', points: 55, breakdown: { exactScoreHits: 1, resultHits: 8, championCorrect: false }, gamesParticipated: 11 },
  { pos: '08', name: 'Pedro H.', district: 'Zarur', avatar: 'https://picsum.photos/seed/p8/100', points: 45, breakdown: { exactScoreHits: 1, resultHits: 6, championCorrect: false }, gamesParticipated: 10 },
];

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: '1', title: 'Palpite Certo!', message: 'Seu palpite em Romilda Ruas vs Vila Esperança foi certeiro. R$ 280,00 adicionados ao seu saldo.', time: '10 min atrás', read: false, type: 'success' },
  { id: '2', title: 'Nova Partida Destaque', message: 'Reta vs Izadélfia Ferraz começa em 2 horas. Faça seu palpite!', time: '1 hora atrás', read: true, type: 'info' },
  { id: '3', title: 'Depósito Confirmado', message: 'Seu depósito de R$ 500,00 via PIX foi processado com sucesso.', time: '3 horas atrás', read: true, type: 'success' },
  { id: '4', title: 'Ranking Atualizado', message: 'Você subiu 2 posições no ranking! Continue assim.', time: 'Ontem', read: true, type: 'ranking' },
];
