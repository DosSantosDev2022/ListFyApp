// src/theme/colors.ts

// Função auxiliar para converter HSL para string HSL CSS
// Isso garante que você está usando a sintaxe correta 'hsl(h s% l%)'
const toHsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

export const appColors = {
  // Modo Claro (Light Mode)
  light: {
    background: toHsl(226.2, 100, 100),
    foreground: toHsl(226.2, 5, 10),
    card: toHsl(226.2, 50, 100),
    cardForeground: toHsl(226.2, 5, 15),
    popover: toHsl(226.2, 100, 100),
    popoverForeground: toHsl(226.2, 100, 10),
    primary: {
      DEFAULT: toHsl(226.2, 57, 21),
      foreground: toHsl(0, 0, 100),
    },
    secondary: {
      DEFAULT: toHsl(226.2, 30, 90),
      foreground: toHsl(0, 0, 0),
    },
    muted: {
      DEFAULT: toHsl(188.2, 30, 95),
      foreground: toHsl(226.2, 5, 40),
    },
    accent: {
      DEFAULT: toHsl(188.2, 30, 90),
      foreground: toHsl(226.2, 5, 15),
    },
    destructive: {
      DEFAULT: toHsl(0, 100, 50),
      foreground: toHsl(226.2, 5, 100),
    },
    border: toHsl(226.2, 30, 88),
    input: toHsl(226.2, 30, 50),
    ring: toHsl(226.2, 57, 21),
  },

  // Modo Escuro (Dark Mode)
  dark: {
    background: toHsl(226.2, 50, 5),
    foreground: toHsl(226.2, 5, 90),
    card: toHsl(226.2, 50, 0),
    cardForeground: toHsl(226.2, 5, 90),
    popover: toHsl(226.2, 50, 5),
    popoverForeground: toHsl(226.2, 5, 90),
    primary: {
      DEFAULT: toHsl(226.2, 57, 21),
      foreground: toHsl(0, 0, 100),
    },
    secondary: {
      DEFAULT: toHsl(226.2, 30, 10),
      foreground: toHsl(0, 0, 100),
    },
    muted: {
      DEFAULT: toHsl(188.2, 30, 15),
      foreground: toHsl(226.2, 5, 60),
    },
    accent: {
      DEFAULT: toHsl(188.2, 30, 15),
      foreground: toHsl(226.2, 5, 90),
    },
    destructive: {
      DEFAULT: toHsl(0, 100, 30),
      foreground: toHsl(226.2, 5, 90),
    },
    border: toHsl(226.2, 30, 10),
    input: toHsl(226.2, 30, 18),
    ring: toHsl(226.2, 57, 21),
  },
};

// Exporte uma interface para tipos de cor para melhor segurança de tipo
export type ColorScheme = keyof typeof appColors;

export type ThemeColors = typeof appColors.light; // Ou appColors.dark, ambos têm a mesma estrutura