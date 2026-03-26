const COMMISSION_RATE = 0.20;

export function calculateEstimatedReturn(
  userBet: number,
  currentOutcomePool: number,
  totalPool: number
): { estimatedReturn: number; estimatedProfit: number } {
  if (userBet <= 0) return { estimatedReturn: 0, estimatedProfit: 0 };

  const newOutcomePool = currentOutcomePool + userBet;
  const newTotalPool = totalPool + userBet;
  const losingPool = newTotalPool - newOutcomePool;

  if (losingPool <= 0) return { estimatedReturn: userBet, estimatedProfit: 0 };

  const participation = userBet / newOutcomePool;
  const grossProfit = participation * losingPool;
  const commission = grossProfit * COMMISSION_RATE;
  const netProfit = grossProfit - commission;
  const totalReturn = userBet + netProfit;

  return {
    estimatedReturn: Math.round(totalReturn * 100) / 100,
    estimatedProfit: Math.round(netProfit * 100) / 100,
  };
}

export function calculatePoolPercentages(outcomes: {
  home: number;
  draw: number;
  away: number;
}): { home: number; draw: number; away: number } {
  const total = outcomes.home + outcomes.draw + outcomes.away;
  if (total === 0) return { home: 33.3, draw: 33.3, away: 33.3 };
  return {
    home: Math.round((outcomes.home / total) * 1000) / 10,
    draw: Math.round((outcomes.draw / total) * 1000) / 10,
    away: Math.round((outcomes.away / total) * 1000) / 10,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
