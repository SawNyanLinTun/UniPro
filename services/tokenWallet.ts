import type { TokenWallet } from '../types';

const STORAGE_KEY = 'unipro_token_wallet';
const DEFAULT_BALANCE = 3;

function readWallet(): TokenWallet {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { balance: DEFAULT_BALANCE };
    const parsed = JSON.parse(raw) as TokenWallet;
    if (typeof parsed.balance !== 'number' || parsed.balance < 0) {
      return { balance: DEFAULT_BALANCE };
    }
    return parsed;
  } catch {
    return { balance: DEFAULT_BALANCE };
  }
}

function writeWallet(wallet: TokenWallet): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
}

export function getTokenBalance(): number {
  return readWallet().balance;
}

/** Spend one token. Returns true if successful. */
export function spendToken(cost = 1): boolean {
  const wallet = readWallet();
  if (wallet.balance < cost) return false;
  writeWallet({ balance: wallet.balance - cost });
  return true;
}

export function resetTokenWallet(balance = DEFAULT_BALANCE): void {
  writeWallet({ balance });
}
