import { describe, it, expect } from 'vitest';
import { HAUTE_HOSPITALITY_TOKENS } from '../tokens.js';

describe('Design Tokens - Haute Hospitality (@dotcomandas/ui)', () => {
  it('deve exportar as cores corretas do design system Haute Hospitality', () => {
    expect(HAUTE_HOSPITALITY_TOKENS.colors.surface).toBe('#131313');
    expect(HAUTE_HOSPITALITY_TOKENS.colors.surfaceContainer).toBe('#1f2020');
    expect(HAUTE_HOSPITALITY_TOKENS.colors.surfaceContainerHigh).toBe('#2a2a2a');
    expect(HAUTE_HOSPITALITY_TOKENS.colors.primary).toBe('#c49a6c');
    expect(HAUTE_HOSPITALITY_TOKENS.colors.surfaceLight).toBe('#f7f7f7');
  });

  it('deve definir a geometria com cantos 100% retos (roundedness 0px)', () => {
    expect(HAUTE_HOSPITALITY_TOKENS.geometry.borderRadius).toBe('0px');
  });

  it('deve exportar as familias de fonte Playfair Display e Plus Jakarta Sans', () => {
    expect(HAUTE_HOSPITALITY_TOKENS.typography.fontFamilySerif).toContain('Playfair Display');
    expect(HAUTE_HOSPITALITY_TOKENS.typography.fontFamilySans).toContain('Plus Jakarta Sans');
  });
});
