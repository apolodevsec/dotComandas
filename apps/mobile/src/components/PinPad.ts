export interface PinPadState {
  pin: string; // até 6 dígitos
  erro: boolean;
}

export function adicionarDigitoPin(pinAtual: string, digito: string): string {
  if (pinAtual.length >= 6) return pinAtual;
  if (!/^\d$/.test(digito)) return pinAtual;
  return pinAtual + digito;
}

export function removerUltimoDigitoPin(pinAtual: string): string {
  return pinAtual.slice(0, -1);
}

export function estaPinCompleto(pin: string): boolean {
  return pin.length === 6;
}
