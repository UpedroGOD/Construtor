// Ícones de traço (24×24), mesma grossura em todos, cor = currentColor
const D = {
  selecionar: 'M5 3l13 7-6 1.5L9.5 18z',
  parede: 'M3 15h18M3 9h18M3 9v6M21 9v6',
  retangulo: 'M4 6h16v12H4z',
  formaL: 'M5 4h7v9h7v7H5z',
  formaU: 'M4 5h5v9h6V5h5v15H4z',
  formaT: 'M3 4h18v6h-6v10H9V10H3z',
  poligono: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z',
  elipse: 'M12 6c5 0 9 2.7 9 6s-4 6-9 6-9-2.7-9-6 4-6 9-6z',
  arco: 'M4 18c0-7.7 6.3-14 14-14M18 4v3M4 18h3',
  porta: 'M5 21V4h9M5 4a12 12 0 0 1 12 12M5 21h14',
  janela: 'M4 5h16v14H4zM12 5v14M4 12h16',
  medir: 'M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2',
  desfazer: 'M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10h-2',
  refazer: 'M15 7l5 5-5 5M20 12H9a5 5 0 0 0 0 10h2',
  lixo: 'M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13',
  copiar: 'M8 8h11v12H8zM5 16V4h11',
  planta: 'M3 3h18v18H3zM3 9h18M9 9v12',
  cubo: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12L4 7.5M12 12v9',
  sala: 'M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 11h18v6H3zM5 17v2M19 17v2',
  mais: 'M12 5v14M5 12h14',
  seta: 'M9 6l6 6-6 6',
  painel: 'M3 4h18v16H3zM9 4v16',
  foco: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2v3M12 19v3M2 12h3M19 12h3',
  moveis: 'M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M4 10h16v7H4zM6 17v2M18 17v2',
  arquivo: 'M6 3h8l4 4v14H6zM14 3v4h4',
  camadas: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
}

export function Icone({ nome, tamanho = 18 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ico">
      <path d={D[nome]} />
    </svg>
  )
}
