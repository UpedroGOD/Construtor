// Desenhos 2D detalhados para planta baixa - cada objeto tem seu desenho vetorial
// Prioridade máxima: o 2D deve estar perfeito antes do 3D

// Sistema de camadas para desenho 2D
export const LAYER = {
  WALL: 'wall',
  DOOR: 'door',
  WINDOW: 'window',
  FURNITURE: 'furniture',
  DIMENSION: 'dimension',
  TEXT: 'text',
  HATCH: 'hatch'
}

// Desenhos 2D detalhados por categoria
// Cada desenho retorna um objeto com viewBox e elementos SVG
// Coordenadas em metros, centradas na origem (0,0)

// ========= ASSENTOS =========

export function desenhoSofa2(l, p) {
  // Sofá 2 lugares: retângulo com encosto e almofadas
  const w = l / 2;
  const encostoAltura = p * 0.25;

  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Base do sofá
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Encosto
      `<rect x="${-l/2}" y="${-p/2 - encostoAltura/2}" width="${l}" height="${encostoAltura}" fill="none" stroke="#2d3748" stroke-width="2" />`,
      // Almofadas (2)
      `<rect x="${-l/2 + 0.15}" y="${-p/2 + 0.1}" width="${w - 0.3}" height="${p - 0.2}" fill="none" stroke="#718096" stroke-width="1" stroke-dasharray="2,2" />`,
      `<rect x="${l/2 - w + 0.15}" y="${-p/2 + 0.1}" width="${w - 0.3}" height="${p - 0.2}" fill="none" stroke="#718096" stroke-width="1" stroke-dasharray="2,2" />`,
      // Traço da frente
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoSofa3(l, p) {
  const w = l / 3;
  const encostoAltura = p * 0.25;

  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      `<rect x="${-l/2}" y="${-p/2 - encostoAltura/2}" width="${l}" height="${encostoAltura}" fill="none" stroke="#2d3748" stroke-width="2" />`,
      // 3 almofadas
      ...Array(3).map((_, i) => {
        const x = -l/2 + i * w + 0.1;
        return `<rect x="${x}" y="${-p/2 + 0.1}" width="${w - 0.2}" height="${p - 0.2}" fill="none" stroke="#718096" stroke-width="1" stroke-dasharray="2,2" />`;
      }),
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoSofaCanto(l, p) {
  // Sofá em L visto de cima. O recuo usa coordenadas X e Y do próprio móvel;
  // nunca a profundidade como uma coordenada horizontal absoluta.
  const x0 = -l / 2, x1 = l / 2, y0 = -p / 2, y1 = p / 2
  const braco = Math.min(p * 0.28, l * 0.22)
  const assento = Math.min(p * 0.42, l * 0.3)
  const cx = x0 + braco
  const cy = y0 + braco
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Contorno e canto interno do L
      `<path d="M${x0} ${y0}H${x1}V${y1}H${cx}V${cy}H${x0}Z" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Encosto no topo e na lateral esquerda
      `<path d="M${x0} ${y0 + braco}V${y0}H${x1}M${x0} ${y0 + braco}H${cx}" fill="none" stroke="#2d3748" stroke-width="2" />`,
      // Almofadas dos dois braços
      `<rect x="${x0 + braco + 0.06}" y="${y0 + 0.08}" width="${Math.max(0.1, l - braco - 0.14)}" height="${Math.max(0.1, assento - 0.14)}" fill="none" stroke="#718096" stroke-width="1" stroke-dasharray="2,2" />`,
      `<rect x="${x0 + 0.08}" y="${y0 + braco + 0.06}" width="${Math.max(0.1, assento - 0.14)}" height="${Math.max(0.1, p - braco - 0.14)}" fill="none" stroke="#718096" stroke-width="1" stroke-dasharray="2,2" />`,
      // Frente livre do sofá
      `<path d="M${x1} ${y0}V${y1}H${cx}" fill="none" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoPoltrona(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" rx="0.1" />`,
      `<rect x="${-l/2}" y="${-p/2 - p*0.2}" width="${l}" height="${p*0.2}" fill="none" stroke="#2d3748" stroke-width="2" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoCadeira(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Assento
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Encosto
      `<rect x="${-l/2 + l*0.1}" y="${-p/2 - p*0.3}" width="${l*0.8}" height="${p*0.3}" fill="none" stroke="#2d3748" stroke-width="2" />`,
      // Pernas
      `<line x1="${-l/2 + l*0.15}" y1="${p/2}" x2="${-l/2 + l*0.15}" y2="${p/2 + p*0.3}" stroke="#2d3748" stroke-width="2" />`,
      `<line x1="${l/2 - l*0.15}" y1="${p/2}" x2="${l/2 - l*0.15}" y2="${p/2 + p*0.3}" stroke="#2d3748" stroke-width="2" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoBanqueta(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= MESAS =========

export function desenhoMesaQuadrada(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" rx="0.05" />`,
      `<rect x="${-l/2 + l*0.08}" y="${-p/2 + p*0.08}" width="${l - l*0.16}" height="${p - p*0.16}" fill="none" stroke="#a0aec0" stroke-width="1" stroke-dasharray="3,3" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoMesaRedonda(d) {
  const r = d / 2;
  return {
    viewBox: [-r - 0.1, -r - 0.1, d + 0.2, d + 0.2],
    elements: [
      `<ellipse cx="0" cy="0" rx="${r}" ry="${r}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      `<ellipse cx="0" cy="0" rx="${r*0.7}" ry="${r*0.7}" fill="none" stroke="#a0aec0" stroke-width="1" stroke-dasharray="4,4" />`,
      `<line x1="${-r}" y1="${r}" x2="${r}" y2="${r}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoMesaJantar(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2.5" />`,
      `<rect x="${-l/2 + 0.1}" y="${-p/2 + 0.1}" width="${l - 0.2}" height="${p - 0.2}" fill="none" stroke="#a0aec0" stroke-width="1" stroke-dasharray="2,2" />`,
      // Cadeiras ao redor (indicativo)
      `<rect x="${-l/2 - 0.05}" y="${-p/2 - 0.05}" width="${0.1}" height="${p + 0.1}" fill="none" stroke="#e2e8f0" stroke-width="1" opacity="0.5" />`,
      `<rect x="${l/2 - 0.05}" y="${-p/2 - 0.05}" width="${0.1}" height="${p + 0.1}" fill="none" stroke="#e2e8f0" stroke-width="1" opacity="0.5" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoEscrivaninha(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Pés
      `<line x1="${-l/2 + 0.1}" y1="${p/2}" x2="${-l/2 + 0.1}" y2="${p/2 + 0.15}" stroke="#2d3748" stroke-width="2" />`,
      `<line x1="${l/2 - 0.1}" y1="${p/2}" x2="${l/2 - 0.1}" y2="${p/2 + 0.15}" stroke="#2d3748" stroke-width="2" />`,
      // Gavetas
      `<rect x="${-l/2 + 0.2}" y="${-p/2 + p*0.1}" width="${l*0.3}" height="${p*0.3}" fill="none" stroke="#a0aec0" stroke-width="1" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoMesaCentro(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" rx="0.05" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoCriadoMudo(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      `<rect x="${-l/2 + l*0.1}" y="${-p/2 + p*0.1}" width="${l*0.8}" height="${p*0.3}" fill="none" stroke="#a0aec0" stroke-width="1" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoPenteadeira(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Espelho
      `<rect x="${-l/2 + l*0.1}" y="${-p/2 - p*0.3}" width="${l*0.8}" height="${p*0.3}" fill="none" stroke="#a0aec0" stroke-width="1" stroke-dasharray="4,4" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= CAMAS =========

export function desenhoCama(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Colchão
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Travesseiros (2)
      `<rect x="${-l/2 + 0.2}" y="${-p/2 - p*0.15}" width="${l*0.3}" height="${p*0.15}" fill="none" stroke="#a0aec0" stroke-width="1" />`,
      `<rect x="${l/2 - l*0.3 - 0.2}" y="${-p/2 - p*0.15}" width="${l*0.3}" height="${p*0.15}" fill="none" stroke="#a0aec0" stroke-width="1" />`,
      // Cabeceira
      `<line x1="${-l/2}" y1="${-p/2}" x2="${l/2}" y2="${-p/2}" stroke="#2d3748" stroke-width="4" />`,
      // Traço da frente
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="2" />`
    ]
  };
}

export function desenhoBerco(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Grade do berço
      `<line x1="${-l/2}" y1="${-p/2}" x2="${l/2}" y2="${-p/2}" stroke="#2d3748" stroke-width="4" />`,
      ...Array(4).fill(0).map((_, i) => {
        const x = -l/2 + (i + 1) * l/5;
        return `<line x1="${x}" y1="${-p/2}" x2="${x}" y2="${-p/2 + p*0.3}" stroke="#2d3748" stroke-width="2" />`;
      }),
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="2" />`
    ]
  };
}

export function desenhoBeliche(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Cama inferior
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Cama superior (deslocada)
      `<rect x="${-l/2}" y="${-p/2 + p*0.7}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Escada
      `<line x1="${-l/2}" y1="${-p/2}" x2="${-l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="2" />`,
      ...Array(3).fill(0).map((_, i) => {
        const y = -p/2 + (i + 1) * p/4;
        return `<line x1="${-l/2}" y1="${y}" x2="${-l/2 + l*0.2}" y2="${y}" stroke="#2d3748" stroke-width="2" />`;
      }),
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="2" />`
    ]
  };
}

export function desenhoGuardaRoupa(l, p, a) {
  // Guarda-roupa visto de cima: retângulo com portas
  const numPortas = a > 2 ? 3 : 2;
  const larguraPorta = l / numPortas;

  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Divisórias das portas
      ...Array(numPortas - 1).fill(0).map((_, i) => {
        const x = -l/2 + (i + 1) * larguraPorta;
        return `<line x1="${x}" y1="${-p/2}" x2="${x}" y2="${p/2}" stroke="#a0aec0" stroke-width="1" stroke-dasharray="3,3" />`;
      }),
      // Maçanetas
      ...Array(numPortas).fill(0).map((_, i) => {
        const x = -l/2 + (i + 0.5) * larguraPorta;
        return `<circle cx="${x}" cy="${p/2 - p*0.1}" r="0.03" fill="#2d3748" />`;
      }),
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoComoda(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Gavetas
      `<rect x="${-l/2 + 0.1}" y="${-p/2 + 0.1}" width="${l - 0.2}" height="${p - 0.2}" fill="none" stroke="#a0aec0" stroke-width="1" />`,
      ...Array(3).fill(0).map((_, i) => {
        const y = -p/2 + (i + 1) * p/4;
        return `<line x1="${-l/2 + 0.1}" y1="${y}" x2="${l/2 - 0.1}" y2="${y}" stroke="#718096" stroke-width="1" />`;
      }),
      // Maçanetas
      `<circle cx="${-l/2 + 0.2}" cy="${p/2}" r="0.03" fill="#2d3748" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoEspelho(l, p) {
  // Espelho de parede: linha fina
  return {
    viewBox: [-l/2 - 0.05, -p/2 - 0.05, l + 0.1, p + 0.1],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#a0aec0" stroke-width="1" stroke-dasharray="5,5" />`,
      `<text x="0" y="${p/2 + 0.1}" text-anchor="middle" font-size="8" fill="#718096">Espelho</text>`
    ]
  };
}

// ========= ARMAZENAMENTO =========

export function desenhoEstante(l, p) {
  const numPrateleiras = 4;
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      ...Array(numPrateleiras - 1).fill(0).map((_, i) => {
        const y = -p/2 + (i + 1) * p/numPrateleiras;
        return `<line x1="${-l/2}" y1="${y}" x2="${l/2}" y2="${y}" stroke="#a0aec0" stroke-width="1" />`;
      }),
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoRackTV(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Prateleira inferior
      `<rect x="${-l/2 + 0.1}" y="${-p/2 + 0.1}" width="${l - 0.2}" height="${p - 0.2}" fill="none" stroke="#a0aec0" stroke-width="1" />`,
      // Suporte TV
      `<rect x="${-l*0.2}" y="${-p/2}" width="${l*0.4}" height="${p*0.3}" fill="none" stroke="#a0aec0" stroke-width="1" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= COZINHA =========

export function desenhoFogao(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Queimadores (4)
      ...[-0.3, 0.3].map((dx) => [-0.2, 0.2].map((dy) =>
        `<circle cx="${dx}" cy="${dy}" r="0.08" fill="none" stroke="#a0aec0" stroke-width="1" />`
      )),
      // Porta do forno
      `<rect x="${-l/2 + 0.1}" y="${-p/2 + p*0.6}" width="${l - 0.2}" height="${p*0.4}" fill="none" stroke="#a0aec0" stroke-width="1" />`,
      `<circle cx="${l/2 - 0.2}" cy="${-p/2 + p*0.8}" r="0.04" fill="#2d3748" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoGeladeira(l, p) {
  const numPortas = l > 0.8 ? 2 : 1;
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      ...Array(numPortas).fill(0).map((_, i) => {
        const x = -l/2 + i * l/numPortas;
        return `<line x1="${x}" y1="${-p/2}" x2="${x}" y2="${p/2}" stroke="#a0aec0" stroke-width="1" stroke-dasharray="3,3" />`;
      }),
      // Maçaneta
      `<circle cx="${-l/2 + l*0.15}" cy="${p/2 - p*0.1}" r="0.04" fill="#2d3748" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoPia(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Cuba
      `<ellipse cx="0" cy="0" rx="${l*0.25}" ry="${p*0.35}" fill="none" stroke="#a0aec0" stroke-width="2" />`,
      // Torneira
      `<line x1="${-l*0.1}" y1="${p/2}" x2="${-l*0.1}" y2="${p/2 + p*0.3}" stroke="#a0aec0" stroke-width="2" />`,
      `<line x1="${-l*0.1}" y1="${p/2 + p*0.3}" x2="${l*0.1}" y2="${p/2 + p*0.3}" stroke="#a0aec0" stroke-width="2" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= BANHEIRO =========

export function desenhoVaso(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Base do vaso
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p*0.4}" fill="none" stroke="#4a5568" stroke-width="2" rx="0.05" />`,
      // Assento
      `<rect x="${-l/2}" y="${-p/2 + p*0.4}" width="${l}" height="${p*0.1}" fill="none" stroke="#2d3748" stroke-width="3" />`,
      // Tampa
      `<ellipse cx="0" cy="${p/2 - p*0.05}" rx="${l*0.45}" ry="${p*0.15}" fill="none" stroke="#2d3748" stroke-width="2" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoPiaBanheiro(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Cuba
      `<circle cx="0" cy="0" r="${p*0.25}" fill="none" stroke="#a0aec0" stroke-width="2" />`,
      // Gabinete
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p*0.7}" fill="none" stroke="#a0aec0" stroke-width="1" stroke-dasharray="3,3" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoChuveiro(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Box de vidro
      `<line x1="${-l/2}" y1="${-p/2}" x2="${l/2}" y2="${p/2}" stroke="#a0aec0" stroke-width="1" stroke-dasharray="6,6" />`,
      // Chuveiro
      `<circle cx="${l/3}" cy="${p/3}" r="0.05" fill="#a0aec0" />`,
      `<line x1="${l/3}" y1="${p/3}" x2="${l/3}" y2="${p/2 + 0.05}" stroke="#a0aec0" stroke-width="1" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoBanheira(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" rx="0.1" />`,
      `<rect x="${-l/2 + p*0.1}" y="${-p/2 + p*0.1}" width="${l - p*0.2}" height="${p - p*0.2}" fill="none" stroke="#a0aec0" stroke-width="1" stroke-dasharray="4,4" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= ELETRÔNICOS =========

export function desenhoTV(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#2d3748" stroke-width="2" />`,
      `<rect x="${-l/2 + l*0.05}" y="${-p/2 + p*0.05}" width="${l - l*0.1}" height="${p - p*0.1}" fill="none" stroke="#a0aec0" stroke-width="1" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoComputador(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Gabinete
      `<rect x="${-l/2}" y="${-p/2}" width="${l*0.4}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Monitor
      `<rect x="${-l/2 + l*0.45}" y="${-p/2}" width="${l*0.4}" height="${p*0.6}" fill="none" stroke="#2d3748" stroke-width="2" />`,
      `<line x1="${-l/2 + l*0.45}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoNotebook(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Base
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p*0.4}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Tela
      `<rect x="${-l/2}" y="${-p/2 - p*0.4}" width="${l}" height="${p*0.6}" fill="none" stroke="#2d3748" stroke-width="2" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= ILUMINAÇÃO =========

export function desenhoLuminaria(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<circle cx="0" cy="0" r="${l/2}" fill="none" stroke="#ecc94b" stroke-width="2" />`,
      `<circle cx="0" cy="0" r="${l/4}" fill="none" stroke="#f6e05e" stroke-width="1" />`,
      `<line x1="0" y1="${l/2}" x2="0" y2="${l/2 + p*0.5}" stroke="#718096" stroke-width="1" />`,
      `<text x="0" y="${p/2 + 0.1}" text-anchor="middle" font-size="8" fill="#718096">Luz</text>`
    ]
  };
}

export function desenhoAbajur(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Base
      `<rect x="${-l/2}" y="${p/2 - p*0.2}" width="${l}" height="${p*0.2}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Luminária
      `<polygon points="${-l/2},${p/2 - p*0.2} ${l/2},${p/2 - p*0.2} 0,${-p/2}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= DECORAÇÃO =========

export function desenhoQuadro(l, p) {
  // Quadro na parede: linha fina
  return {
    viewBox: [-l/2 - 0.05, -p/2 - 0.05, l + 0.1, p + 0.1],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      `<rect x="${-l/2 + l*0.1}" y="${-p/2 + p*0.1}" width="${l - l*0.2}" height="${p - p*0.2}" fill="none" stroke="#a0aec0" stroke-width="1" stroke-dasharray="3,3" />`,
      `<text x="0" y="${p/2 + 0.1}" text-anchor="middle" font-size="8" fill="#718096">Quadro</text>`
    ]
  };
}

export function desenhoPlanta(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<circle cx="0" cy="0" r="${l/2}" fill="none" stroke="#48bb78" stroke-width="2" />`,
      // Folhas
      ...[-1, 1].map((dx) =>
        `<ellipse cx="${l*dx*0.3}" cy="${-p*0.2}" rx="${l*0.2}" ry="${p*0.3}" fill="none" stroke="#48bb78" stroke-width="2" transform="rotate(${dx*30})" />`
      ),
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoTapete(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="#edf2f7" stroke="#cbd5e0" stroke-width="1" stroke-dasharray="5,5" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= EXTERIOR =========

export function desenhoCarro(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" rx="0.1" />`,
      // Janelas
      `<rect x="${-l/2 + l*0.1}" y="${-p/2 + p*0.1}" width="${l - l*0.2}" height="${p - p*0.2}" fill="none" stroke="#a0aec0" stroke-width="1" stroke-dasharray="4,4" />`,
      // Rodas
      `<circle cx="${-l/4}" cy="${p/2}" r="${p*0.2}" fill="none" stroke="#2d3748" stroke-width="1" />`,
      `<circle cx="${l/4}" cy="${p/2}" r="${p*0.2}" fill="none" stroke="#2d3748" stroke-width="1" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoPiscina(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="#bee3f8" stroke="#3182ce" stroke-width="2" rx="0.1" />`,
      // Borda
      `<rect x="${-l/2 + p*0.05}" y="${-p/2 + p*0.05}" width="${l - p*0.1}" height="${p - p*0.1}" fill="none" stroke="#3182ce" stroke-width="1" stroke-dasharray="4,4" rx="0.1" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= ESCADA =========

export function desenhoEscada(l, p) {
  const degraus = Math.max(3, Math.round(p / 0.3));
  const alturaDegrau = p / degraus;

  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      // Base
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Degraus
      ...Array(degraus).fill(0).map((_, i) => {
        const y = -p/2 + i * alturaDegrau;
        return `<line x1="${-l/2}" y1="${y}" x2="${l/2}" y2="${y}" stroke="#a0aec0" stroke-width="1" />`;
      }),
      // Setas de direção
      `<path d="M0 ${p/2 - p*0.2} L${l*0.1} ${p/2 - p*0.4} L${-l*0.1} ${p/2 - p*0.4} Z" fill="#2d3748" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= ESTRUTURA =========

export function desenhoColuna(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#718096" stroke-width="2" />`,
      `<circle cx="0" cy="0" r="${l*0.3}" fill="none" stroke="#4a5568" stroke-width="1" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

export function desenhoRampa(l, p) {
  return {
    viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
    elements: [
      `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`,
      // Linha inclinada
      `<line x1="${-l/2}" y1="${-p/2}" x2="${l/2}" y2="${p/2}" stroke="#a0aec0" stroke-width="2" />`,
      // Setas
      `<path d="M${l/2} ${p/2} L${l/2 - p*0.1} ${p/2 - p*0.2} L${l/2} ${p/2 - p*0.4} Z" fill="#a0aec0" />`,
      `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
    ]
  };
}

// ========= INDEX DE DESENHOS =========

// Mapeia tipo de objeto para função de desenho 2D
export const DESENHOS_2D = {
  // Assentos
  'sofa': desenhoSofa2,
  'sofa-3-lugares': desenhoSofa3,
  'sofa-de-canto-l': desenhoSofaCanto,
  'poltrona': desenhoPoltrona,
  'cadeira-de-jantar': desenhoCadeira,
  'cadeira-estofada': desenhoCadeira,
  'cadeira-de-cozinha': desenhoCadeira,
  'banqueta-alta-de-bar': desenhoBanqueta,
  'banqueta': desenhoBanqueta,

  // Mesas
  'mesa-de-jantar': desenhoMesaJantar,
  'mesa-de-centro': desenhoMesaCentro,
  'mesa-lateral': desenhoMesaCentro,
  'mesa-de-apoio': desenhoMesaCentro,
  'mesa-de-jantar-4-lugares': desenhoMesaJantar,
  'mesa-de-jantar-6-lugares': desenhoMesaJantar,
  'mesa-de-jantar-8-lugares': desenhoMesaJantar,
  'mesa-redonda': desenhoMesaRedonda,
  'mesa-quadrada': desenhoMesaQuadrada,
  'mesa-de-bar': desenhoMesaCentro,
  'mesa-de-cafe-da-manha': desenhoMesaCentro,
  'escrivaninha': desenhoEscrivaninha,
  'mesa-em-l': desenhoMesaCentro,
  'mesa-gamer': desenhoEscrivaninha,
  'mesa-de-estudos-infantil': desenhoMesaCentro,
  'prancheta-de-desenho': desenhoMesaCentro,
  'aparador': desenhoMesaCentro,
  'buffet': desenhoMesaCentro,
  'criado-mudo-mesa-de-cabecalho': desenhoCriadoMudo,
  'mesa-de-passar': desenhoMesaCentro,
  'mesa-de-jardim': desenhoMesaRedonda,
  'mesa-de-piquenique': desenhoMesaCentro,

  // Camas
  'cama': desenhoCama,
  'cama-de-casal': desenhoCama,
  'cama-de-solteiro': desenhoCama,
  'cama-queen': desenhoCama,
  'cama-king': desenhoCama,
  'cama-box': desenhoCama,
  'cama-com-bau': desenhoCama,
  'bicama': desenhoCama,
  'beliche': desenhoBeliche,
  'treliche': desenhoBeliche,
  'berco': desenhoBerco,
  'mini-berco': desenhoBerco,
  'moises': desenhoBerco,
  'cama-de-cachorro-gato': desenhoCama,

  // Armazenamento
  'guarda-roupa': desenhoGuardaRoupa,
  'guarda-roupa-2-portas': desenhoGuardaRoupa,
  'guarda-roupa-3-portas': desenhoGuardaRoupa,
  'guarda-roupa-4-portas': desenhoGuardaRoupa,
  'estante-de-livros': desenhoEstante,
  'cristaleira': desenhoEstante,
  'rack-de-tv': desenhoRackTV,
  'armario-alto': desenhoGuardaRoupa,
  'armario-baixo': desenhoComoda,
  'cômoda': desenhoComoda,
  'gaveteiro': desenhoComoda,

  // Cozinha
  'fogao-4-bocas': desenhoFogao,
  'fogao-6-bocas': desenhoFogao,
  'geladeira': desenhoGeladeira,
  'geladeira-1-porta': desenhoGeladeira,
  'geladeira-2-portas': desenhoGeladeira,
  'pia-com-gabinete': desenhoPia,

  // Banheiro
  'vaso-sanitario': desenhoVaso,
  'pia-de-banheiro-com-gabinete': desenhoPiaBanheiro,
  'box-com-chuveiro': desenhoChuveiro,
  'banheira': desenhoBanheira,

  // Eletrônicos
  'tv': desenhoTV,
  'tv-32': desenhoTV,
  'tv-50': desenhoTV,
  'tv-65': desenhoTV,
  'computador-de-mesa': desenhoComputador,
  'notebook': desenhoNotebook,
  'monitor': desenhoTV,

  // Iluminação
  'luminaria-de-teto-embutida': desenhoLuminaria,
  'abajur': desenhoAbajur,
  'luminaria-de-mesa': desenhoAbajur,
  'luminaria-de-chao': desenhoAbajur,

  // Decoração
  'quadro': desenhoQuadro,
  'tapete': desenhoTapete,
  'planta-media': desenhoPlanta,
  'planta-grande': desenhoPlanta,
  'planta-pequena': desenhoPlanta,

  // Exterior
  'carro': desenhoCarro,
  'piscina': desenhoPiscina,

  // Escada
  'escada-reta': desenhoEscada,
  'escada-caracol': desenhoEscada,

  // Estrutura
  'coluna-pilar': desenhoColuna,
  'rampa': desenhoRampa,

  // Móveis variados
  'sofa-cama': desenhoSofa2,
  'sofa-retratil-reclinavel': desenhoSofa2,
  'chaise-longue': desenhoSofa2,
  'futon': desenhoSofa2,
  'poltrona-reclinavel': desenhoPoltrona,
  'poltrona-do-papai': desenhoPoltrona,
  'poltrona-de-amamentacao': desenhoPoltrona,
  'poltrona-puff-pera': desenhoPoltrona,
  'puff': desenhoBanqueta,
  'puff-bau': desenhoBanqueta,
  'banqueta': desenhoBanqueta,
  'banco-de-madeira': desenhoMesaCentro,
  'namoradeira': desenhoSofa2,
  'recamier-pe-de-cama': desenhoMesaCentro,
  'cadeira-de-balanca': desenhoCadeira,
  'cadeira-escritorio': desenhoCadeira,
  'cadeira-gamer': desenhoCadeira,
  'cadeira-de-mesa-infantil': desenhoCadeira,
  'mesa-de-passar': desenhoMesaCentro,
  'guarda-roupa-de-correr': desenhoGuardaRoupa,
  'closet-aberto': desenhoEstante,
  'arara-de-roupas': desenhoEstante,
  'cabideiro': desenhoEstante,
  'sapateira': desenhoEstante,
  'trocador-de-bebe': desenhoComoda,
  'biombo': desenhoMesaCentro,
  'prateleira-de-parede': desenhoMesaCentro,
  'nicho': desenhoMesaCentro,
  'prateleira-de-canto': desenhoMesaCentro,
  'painel-de-tv': desenhoMesaCentro,
  'home-theater': desenhoMesaCentro,
  'armario-multiuso': desenhoGuardaRoupa,
  'arquivo-de-gavetas': desenhoComoda,
  'caixa-organizadora': desenhoMesaCentro,
  'cesto': desenhoMesaCentro,
  'bau-de-brinquedos': desenhoComoda,
  'adega': desenhoEstante,
  'carrinho-de-bar': desenhoMesaCentro,
  'porta-chaves': desenhoMesaCentro,
  'porta-casacos-de-entrada': desenhoMesaCentro,
  'banco-de-entrada-com-sapateira': desenhoMesaCentro,
  'geladeira-duplex': desenhoGeladeira,
  'geladeira-side-by-side': desenhoGeladeira,
  'freezer': desenhoGeladeira,
  'frigobar': desenhoGeladeira,
  'coifa': desenhoMesaCentro,
  'depurador': desenhoMesaCentro,
  'cuba': desenhoPia,
  'armario-aereo': desenhoEstante,
  'armario-de-chao': desenhoGuardaRoupa,
  'paneleiro': desenhoEstante,
  'despensa': desenhoEstante,
  'bancada': desenhoMesaCentro,
  'ilha-de-cozinha': desenhoMesaCentro,
  'lava-loucas': desenhoPia,
  'lixeira': desenhoMesaCentro,
  'filtro-de-agua': desenhoMesaCentro,
  'cafeteira': desenhoMesaCentro,
  'liquidificador': desenhoMesaCentro,
  'batedeira': desenhoMesaCentro,
  'air-fryer': desenhoMesaCentro,
  'torradeira': desenhoMesaCentro,
  'chaleira': desenhoMesaCentro,
  'sanduicheira': desenhoMesaCentro,
  'panela-eletrica-de-arroz': desenhoMesaCentro,
  'escorredor-de-louca': desenhoMesaCentro,
  'tabua-de-corte': desenhoMesaCentro,
  'porta-temperos': desenhoMesaCentro,
  'fruteira': desenhoMesaCentro,
  'galheteiro': desenhoMesaCentro,
  'jogo-de-panelas': desenhoMesaCentro,
  'panos-de-prato': desenhoMesaCentro,
  'espelho-de-banheiro': desenhoEspelho,
  'espeleira': desenhoEspelho,
  'chuveiro-aberto': desenhoChuveiro,
  'banheira-de-hidromassagem': desenhoBanheira,
  'ofuro': desenhoBanheira,
  'toalheiro': desenhoMesaCentro,
  'porta-papel': desenhoMesaCentro,
  'cesto-de-roupa-suja': desenhoMesaCentro,
  'tapete-de-banheiro': desenhoTapete,
  'lixeirinha': desenhoMesaCentro,
  'prateleira-de-banho': desenhoEstante,
  'nicho-de-parede': desenhoEstante,
  'maquina-de-lavar': desenhoMesaCentro,
  'lava-e-seca': desenhoMesaCentro,
  'secadora': desenhoMesaCentro,
  'tanque': desenhoPia,
  'varal-de-chao': desenhoMesaCentro,
  'varal-de-teto': desenhoMesaCentro,
  'tabua-de-passar': desenhoMesaCentro,
  'ferro-de-passar': desenhoMesaCentro,
  'armario-de-lavanderia': desenhoGuardaRoupa,
  'balde-e-vassoura': desenhoMesaCentro,
  'aspirador': desenhoMesaCentro,
  'video-game': desenhoMesaCentro,
  'controle-de-videogame': desenhoMesaCentro,
  'impressora': desenhoMesaCentro,
  'roteador': desenhoMesaCentro,
  'caixa-de-som': desenhoMesaCentro,
  'soundbar': desenhoTV,
  'toca-discos': desenhoMesaCentro,
  'aparelho-de-som': desenhoMesaCentro,
  'radio': desenhoMesaCentro,
  'fone-em-suporte': desenhoMesaCentro,
  'despertador': desenhoMesaCentro,
  'relogio-digital': desenhoMesaCentro,
  'ventilador-de-mesa': desenhoLuminaria,
  'ventilador-de-chao': desenhoLuminaria,
  'ventilador-de-teto': desenhoLuminaria,
  'ar-condicionado-split': desenhoMesaCentro,
  'aquecedor': desenhoMesaCentro,
  'umidificador': desenhoMesaCentro,
  'telefone': desenhoMesaCentro,
  'tablet': desenhoMesaCentro,
  'celular-carregando': desenhoMesaCentro,
  'lustre': desenhoLuminaria,
  'pendente': desenhoLuminaria,
  'plafon': desenhoLuminaria,
  'spot-trilho': desenhoLuminaria,
  'arandela': desenhoLuminaria,
  'fita-de-led': desenhoLuminaria,
  'cordao-de-luzinhas': desenhoLuminaria,
  'letreiro-neon': desenhoLuminaria,
  'luz-noturna': desenhoLuminaria,
  'luminaria-de-jardim': desenhoLuminaria,
  'poste-de-luz': desenhoLuminaria,
  'refletor': desenhoLuminaria,
  'lampiao': desenhoLuminaria,
  'planta-pequena-vaso-de-mesa': desenhoPlanta,
  'planta-media-2': desenhoPlanta,
  'planta-grande-de-chao': desenhoPlanta,
  'planta-pendurada': desenhoPlanta,
  'cacto': desenhoPlanta,
  'suculenta': desenhoPlanta,
  'vaso-de-flores': desenhoPlanta,
  'horta-de-temperos': desenhoPlanta,
  'escultura': desenhoMesaCentro,
  'vaso-decorativo': desenhoMesaCentro,
  'vela': desenhoMesaCentro,
  'castiçal': desenhoMesaCentro,
  'livro-decorativo': desenhoMesaCentro,
  'almofada': desenhoMesaCentro,
  'manta': desenhoMesaCentro,
  'porta-retratos': desenhoMesaCentro,
  'globo': desenhoMesaCentro,
  'aquario': desenhoPiscina,
  'gaiola': desenhoMesaCentro,
  'tapete-pequeno': desenhoTapete,
  'tapete-medio': desenhoTapete,
  'tapete-grande': desenhoTapete,
  'tapete-redondo': desenhoTapete,
  'passadeira': desenhoTapete,
  'capacho': desenhoTapete,
  'cortina': desenhoMesaCentro,
  'persiana': desenhoMesaCentro,
  'blackout': desenhoMesaCentro,
  'varao-de-cortina': desenhoMesaCentro,
  'lareira': desenhoMesaCentro,
  'lareira-eletrica': desenhoMesaCentro,
  'lenha': desenhoMesaCentro,
  'livros-empilhados': desenhoMesaCentro,
  'revistas': desenhoMesaCentro,
  'roupas-jogadas': desenhoMesaCentro,
  'sapatos': desenhoMesaCentro,
  'mochila': desenhoMesaCentro,
  'caixas-de-mudanca': desenhoMesaCentro,
  'louca-suja': desenhoMesaCentro,
  'controle-remoto': desenhoMesaCentro,
  'xícara-de-cafe': desenhoMesaCentro,
  'berço-2': desenhoBerco,
  'cama-infantil': desenhoCama,
  'trocador': desenhoComoda,
  'cadeirao-de-comer': desenhoCadeira,
  'cercadinho': desenhoEstante,
  'casinha': desenhoMesaCentro,
  'tenda': desenhoMesaCentro,
  'escorredor-interno': desenhoMesaCentro,
  'mesa-e-cadeirinha-infantil': desenhoMesaCentro,
  'cavalinho-de-balanco': desenhoMesaCentro,
  'ursinho': desenhoMesaCentro,
  'blocos': desenhoMesaCentro,
  'carrinho-de-bebe': desenhoMesaCentro,
  'estante-de-jogos': desenhoEstante,
  'mesa-de-sinuca': desenhoMesaCentro,
  'pebolim': desenhoMesaCentro,
  'pingue-pongue': desenhoMesaCentro,
  'fliperama': desenhoMesaCentro,
  'alvo-de-dardo': desenhoMesaCentro,
  'piano': desenhoMesaCentro,
  'teclado-musical': desenhoMesaCentro,
  'violao-no-suporte': desenhoMesaCentro,
  'bateria': desenhoMesaCentro,
  'cavalete-de-pintura': desenhoMesaCentro,
  'maquina-de-costura': desenhoMesaCentro,
  'telescopio': desenhoMesaCentro,
  'esteira': desenhoMesaCentro,
  'bicicleta-ergometrica': desenhoMesaCentro,
  'banco-de-musculacao': desenhoMesaCentro,
  'saco-de-pancada': desenhoMesaCentro,
  'tapete-de-yoga': desenhoTapete,
  'espelho-de-academia': desenhoEspelho,
  'escritor': desenhoEscrivaninha,
  'quadro-de-avisos': desenhoQuadro,
  'quadro-branco': desenhoQuadro,
  'impressora-2': desenhoMesaCentro,
  'fragmentadora': desenhoMesaCentro,
  'bebedouro': desenhoMesaCentro,
  'cesto-de-lixo': desenhoMesaCentro,
  'divisoria-de-baia': desenhoMesaCentro,
  'mesa-e-cadeiras-de-jardim': desenhoMesaCentro,
  'cadeira-de-jardim': desenhoCadeira,
  'banco-de-jardim': desenhoMesaCentro,
  'espreguiçadeira': desenhoMesaCentro,
  'guarda-sol': desenhoLuminaria,
  'ombrelone': desenhoLuminaria,
  'rede': desenhoTapete,
  'balanco': desenhoMesaCentro,
  'pergolado': desenhoMesaCentro,
  'churrasqueira-de-alvenaria': desenhoMesaCentro,
  'churrasqueira-portatil': desenhoMesaCentro,
  'forno-de-pizza': desenhoMesaCentro,
  'bar-de-piscina': desenhoMesaCentro,
  'borda-de-piscina': desenhoTapete,
  'escada-de-piscina': desenhoEscada,
  'boia': desenhoTapete,
  'hidromassagem-externa': desenhoBanheira,
  'chuveirao': desenhoChuveiro,
  'fonte': desenhoPiscina,
  'lago': desenhoPiscina,
  'arvore': desenhoPlanta,
  'arbusto': desenhoPlanta,
  'cerca-viva': desenhoMesaCentro,
  'flores': desenhoPlanta,
  'grama': desenhoTapete,
  'pedras': desenhoMesaCentro,
  'caminho-de-pedras': desenhoTapete,
  'horta-2': desenhoPlanta,
  'canteiro': desenhoPlanta,
  'casinha-de-cachorro': desenhoMesaCentro,
  'comedouro': desenhoMesaCentro,
  'bicicleta': desenhoMesaCentro,
  'caixa-de-correio': desenhoMesaCentro,
  'lixeiras-de-coleta': desenhoMesaCentro,
  'coluna-pilar-2': desenhoColuna,
  'meia-parede': desenhoMesaCentro,
  'mureta': desenhoMesaCentro,
  'divisoria-de-vidro': desenhoMesaCentro,
  'guarda-corpo': desenhoMesaCentro,
  'escada-de-mao': desenhoEscada,

  // Formas
  'cubo': (l, p) => ({ viewBox: [-l/2, -p/2, l, p], elements: [`<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" />`, `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`] }),
  'cilindro': (l, p) => ({ viewBox: [-l/2, -p/2, l, p], elements: [`<ellipse cx="0" cy="0" rx="${l/2}" ry="${p/2}" fill="none" stroke="#4a5568" stroke-width="2" />`, `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`] }),
  'elipse-2': (l, p) => ({ viewBox: [-l/2, -p/2, l, p], elements: [`<ellipse cx="0" cy="0" rx="${l/2}" ry="${p/2}" fill="none" stroke="#4a5568" stroke-width="2" />`, `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`] }),
  'esfera-2': (l, p) => ({ viewBox: [-l/2, -p/2, l, p], elements: [`<ellipse cx="0" cy="0" rx="${l/2}" ry="${p/2}" fill="none" stroke="#4a5568" stroke-width="2" />`, `<circle cx="${-l*0.2}" cy="${-p*0.2}" r="${l*0.15}" fill="none" stroke="#a0aec0" stroke-width="1" />`, `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`] }),
  'cone': (l, p) => ({ viewBox: [-l/2, -p/2, l, p], elements: [`<path d="M${-l/2} ${p/2} L0 ${-p/2} L${l/2} ${p/2} Z" fill="none" stroke="#4a5568" stroke-width="2" />`, `<ellipse cx="0" cy="${p/2}" rx="${l/2}" ry="${p*0.15}" fill="none" stroke="#a0aec0" stroke-width="1" />`, `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`] }),
  'piramide-2': (l, p) => ({ viewBox: [-l/2, -p/2, l, p], elements: [`<path d="M${-l/2} ${p/2} L0 ${-p/2} L${l/2} ${p/2} M${-l/2} ${p/2} L0 ${p*0.1} L${l/2} ${p/2}" fill="none" stroke="#4a5568" stroke-width="2" />`, `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`] }),
  'prisma': (l, p) => ({ viewBox: [-l/2, -p/2, l, p], elements: [`<path d="M${-l/2} ${p/2} L0 ${-p/2} L${l/2} ${p/2} Z" fill="none" stroke="#4a5568" stroke-width="2" />`, `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`] }),

  // Tipos do catálogo sem chave direta: desenho exato do móvel no plano 2D.
  // Sem estes, renderDesenho2D cai no retângulo genérico e os móveis ficam quadrados.
  'sofa-2-lugares': desenhoSofa2,
  'sofa-retratil': desenhoSofa2,
  'cadeira': desenhoCadeira,
  'cadeira-de-balanco': desenhoCadeira,
  'cadeira-infantil': desenhoCadeira,
  'puff-pera': desenhoPoltrona,
  'mesa': desenhoMesaCentro,
  'mesa-de-jantar-2-lugares': desenhoMesaJantar,
  'mesa-extensivel': desenhoMesaJantar,
  'mesa-de-poquer': desenhoMesaJantar,
  'mesa-dobravel-de-parede': desenhoMesaCentro,
  'mesa-bandeja': desenhoMesaCentro,
  'mesa-nicho': desenhoEstante,
  'penteadeira': desenhoPenteadeira,
  'cama-suspensa-mesa-embaixo': desenhoCama,
  'cama-montessoriana': desenhoCama,
  'colchao-no-chao': desenhoCama,
  'cabeceira': desenhoCama,
  'dossel': desenhoCama,
  'mosquiteiro': desenhoCama,
  'criado-mudo': desenhoCriadoMudo,
  'guardaroupa': desenhoGuardaRoupa,
  'comoda': desenhoComoda,
  'bau': desenhoComoda,
  'espelho-de-chao': desenhoEspelho,
  'espelho-de-parede': desenhoEspelho,
  'espelheira': desenhoEspelho,
  'estante': desenhoEstante,
  'estante-vazada-divisoria': desenhoEstante,
  'cooktop': desenhoFogao,
  'forno-de-embutir': desenhoFogao,
  'micro-ondas': desenhoMesaCentro,
  'bide': desenhoVaso,
  'cuba-de-apoio': desenhoPia,
  'suporte-de-tv-de-parede': desenhoMesaCentro,
  'videogame': desenhoMesaCentro,
  'computador-gabinete': desenhoComputador,
  'fone-no-suporte': desenhoMesaCentro,
  'luminaria-embutida': desenhoLuminaria,
  'luminaria-de-leitura': desenhoLuminaria,
  'poster': desenhoQuadro,
  'moldura-de-fotos': desenhoQuadro,
  'mural-de-cortica': desenhoQuadro,
  'mapa': desenhoQuadro,
  'relogio-de-parede': desenhoQuadro,
  'trofeu': desenhoMesaCentro,
  'prateleira-de-colecionaveis': desenhoEstante,
  'castical': desenhoMesaCentro,
  'xicara-de-cafe': desenhoMesaCentro,
  'casinha-infantil': desenhoMesaCentro,
  'tenda-infantil': desenhoMesaCentro,
  'escorregador': desenhoMesaCentro,
  'blocos-de-brinquedo': desenhoMesaCentro,
  'mesapc': desenhoEscrivaninha,
  'cadeira-de-escritorio': desenhoCadeira,
  'espreguicadeira': desenhoMesaCentro,
  'cadeira-de-praia': desenhoCadeira,
  'balanco-de-varanda': desenhoMesaCentro,
  'horta': desenhoPlanta,
  'bloco': desenhoMesaCentro,
  'placa': desenhoQuadro,
  'coluna-redonda': desenhoColuna,
  'esfera': desenhoMesaRedonda,
  'piramide': desenhoMesaCentro,
  'prisma-triangular': desenhoMesaCentro,

  // Aberturas
  'porta': (l, p) => ({ viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2], elements: [`<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#e53e3e" stroke-width="2" />`, `<path d="M${-l/2} ${p/2} Q0 ${-p/2} ${l/2} ${p/2}" fill="none" stroke="#e53e3e" stroke-width="2" stroke-dasharray="4,4" />`, `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#e53e3e" stroke-width="3" />`] }),
  'janela': (l, p) => ({ viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2], elements: [`<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="#3182ce" stroke-width="2" />`, `<rect x="${-l/2 + l*0.1}" y="${-p/2 + p*0.1}" width="${l - l*0.2}" height="${p - p*0.2}" fill="none" stroke="#bee3f8" stroke-width="1" stroke-dasharray="4,4" />`, `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#3182ce" stroke-width="3" />`] }),
  'rampa': (l, p) => desenhoRampa(l, p)
};

// Blocos arquitetônicos para famílias que antes caíam no mesmo retângulo genérico.
// São símbolos de planta baixa: simples, proporcionais e legíveis em qualquer zoom.
function desenhoCadPorNome(tipo, l, p) {
  const x = -l / 2, y = -p / 2, cx = 0, cy = 0
  const ret = (extra = '') => `<rect x="${x}" y="${y}" width="${l}" height="${p}" fill="none" stroke="#4a5568" stroke-width="2" ${extra}/>`
  const linha = (x1, y1, x2, y2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#718096" stroke-width="1" ${extra}/>`
  const caixa = (elements) => ({ viewBox: [x - .1, y - .1, l + .2, p + .2], elements })

  if (/^(mesa|bancada|ilha|aparador|buffet|carrinho-de-bar|mesa-de-piquenique|teclado-musical|banco-de-musculacao)/.test(tipo)) {
    const borda = Math.min(l, p) * .1
    return caixa([ret('rx="0.04"'), `<rect x="${x + borda}" y="${y + borda}" width="${Math.max(.08, l - borda * 2)}" height="${Math.max(.08, p - borda * 2)}" fill="none" stroke="#718096" stroke-width="1"/>`, linha(x, y + p, x + l, y + p, 'stroke="#2d3748" stroke-width="3"')])
  }
  if (/^(prateleira|nicho|painel|porta-chaves|porta-casacos|suporte-de-tv|quadro|poster|moldura|mural|mapa|varao|persiana|cortina|blackout)/.test(tipo)) {
    const n = Math.max(2, Math.min(6, Math.round(l / Math.max(.18, p))))
    return caixa([ret(), ...Array.from({ length: n - 1 }, (_, i) => linha(x + l * (i + 1) / n, y, x + l * (i + 1) / n, y + p, 'stroke-dasharray="3,3"')), linha(x, y + p, x + l, y + p, 'stroke="#2d3748" stroke-width="3"')])
  }
  if (/^(caixa|cesto|lixeira|balde|livros|revistas|roupas|sapatos|mochila|lenha|louca|panos|tabua|porta-temperos|galheteiro|controle-remoto|xicara)/.test(tipo)) {
    return caixa([ret('rx="0.05"'), `<path d="M${x + l*.18} ${cy}H${x + l*.82}M${cx} ${y + p*.18}V${y + p*.82}" fill="none" stroke="#718096" stroke-width="1"/>`])
  }
  if (/^(telefone|roteador|videogame|impressora|radio|despertador|tablet|celular|micro-ondas|air-fryer|torradeira|cafeteira|batedeira|filtro-de-agua|aquecedor|umidificador)/.test(tipo)) {
    return caixa([ret('rx="0.04"'), `<rect x="${x + l*.15}" y="${y + p*.18}" width="${l*.7}" height="${p*.42}" fill="none" stroke="#718096" stroke-width="1"/>`, `<circle cx="${x + l*.28}" cy="${y + p*.78}" r="${Math.min(l,p)*.07}" fill="none" stroke="#718096" stroke-width="1"/>`, `<circle cx="${x + l*.72}" cy="${y + p*.78}" r="${Math.min(l,p)*.07}" fill="none" stroke="#718096" stroke-width="1"/>`])
  }
  if (/^(maquina-de-lavar|lava-e-seca|secadora|fragmentadora|bebedouro|aspirador|ar-condicionado|caixa-de-som|toca-discos|aparelho-de-som|ferro-de-passar)/.test(tipo)) {
    const r = Math.min(l, p) * .22
    return caixa([ret('rx="0.04"'), `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#718096" stroke-width="1"/>`, `<circle cx="${cx}" cy="${cy}" r="${r*.55}" fill="none" stroke="#718096" stroke-width="1"/>`, linha(x + l*.15, y + p*.14, x + l*.85, y + p*.14)])
  }
  if (/^(mesa-de-sinuca|pebolim|pingue-pongue|mesa-e-cadeirinha|mesa-de-piquenique|banco-de-musculacao|bar-de-piscina)/.test(tipo)) {
    return caixa([ret('rx="0.05"'), linha(x + l*.08, cy, x + l*.92, cy, 'stroke-dasharray="3,2"'), linha(cx, y + p*.08, cx, y + p*.92, 'stroke-dasharray="3,2"')])
  }
  if (/^(piano|fliperama|lareira|churrasqueira|forno-de-pizza|pergolado|casinha|gaiola|caixa-de-correio|comedouro|bebedouro)/.test(tipo)) {
    return caixa([ret('rx="0.06"'), `<path d="M${x+l*.12} ${y+p*.72}H${x+l*.88}M${x+l*.22} ${y+p*.2}V${y+p*.55}M${x+l*.42} ${y+p*.2}V${y+p*.55}M${x+l*.62} ${y+p*.2}V${y+p*.55}" fill="none" stroke="#718096" stroke-width="1"/>`])
  }
  if (/^(trofeu|escultura|vaso-decorativo|vela|castical|globo|alvo-de-dardo|fruteira|chaleira|liquidificador|panela-eletrica|pedras)/.test(tipo)) {
    const r = Math.min(l, p) * .34
    return caixa([`<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r}" fill="none" stroke="#4a5568" stroke-width="2"/>`, `<circle cx="${cx}" cy="${cy}" r="${r*.45}" fill="none" stroke="#718096" stroke-width="1"/>`, linha(cx-r, cy, cx+r, cy)])
  }
  if (/^(biombo|divisoria|guarda-corpo|meia-parede|mureta|cerca-viva|cortina|blackout|balanco-de-varanda|rede)/.test(tipo)) {
    const n = Math.max(2, Math.min(8, Math.round(l / Math.max(.12, p))))
    return caixa([ret(), ...Array.from({ length: n - 1 }, (_, i) => linha(x + l*(i+1)/n, y, x + l*(i+1)/n, y+p))])
  }
  if (/^(espreguicadeira|bicicleta|bicicleta-ergometrica|carrinho-de-bebe|esteira|saco-de-pancada|telescopio|violao|cavalete)/.test(tipo)) {
    return caixa([`<ellipse cx="${x+l*.25}" cy="${y+p*.72}" rx="${l*.16}" ry="${p*.16}" fill="none" stroke="#4a5568" stroke-width="2"/>`, `<ellipse cx="${x+l*.75}" cy="${y+p*.28}" rx="${l*.16}" ry="${p*.16}" fill="none" stroke="#4a5568" stroke-width="2"/>`, `<path d="M${x+l*.25} ${y+p*.72}L${cx} ${cy}L${x+l*.75} ${y+p*.28}" fill="none" stroke="#718096" stroke-width="1"/>`])
  }
  if (/^(cavalete|bicicleta|esteira|varal|escorregador|cercadinho|casinha|tenda|cavalinho|ursinho|blocos|bateria|violao|telescopio|saco-de-pancada)/.test(tipo)) {
    return caixa([ret('rx="0.08"'), `<path d="M${x} ${y + p}L${cx} ${y}L${x + l} ${y + p}M${x} ${y}L${x + l} ${y + p}M${x + l} ${y}L${x} ${y + p}" fill="none" stroke="#718096" stroke-width="1"/>`])
  }
  return null
}

// Função auxiliar para renderizar desenho 2D
export function renderDesenho2D(tipo, l, p, cor = '#4a5568') {
  const blocoCad = desenhoCadPorNome(tipo, l, p)
  if (blocoCad) return blocoCad
  const desenho = DESENHOS_2D[tipo];
  if (!desenho) {
    // Desenho genérico
    return {
      viewBox: [-l/2 - 0.1, -p/2 - 0.1, l + 0.2, p + 0.2],
      elements: [
        `<rect x="${-l/2}" y="${-p/2}" width="${l}" height="${p}" fill="none" stroke="${cor}" stroke-width="2" />`,
        `<line x1="${-l/2}" y1="${p/2}" x2="${l/2}" y2="${p/2}" stroke="#2d3748" stroke-width="3" />`
      ]
    };
  }
  return desenho(l, p);
}
