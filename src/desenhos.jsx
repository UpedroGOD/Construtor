// Desenho de cada móvel visto de cima, em metros, centrado no móvel. A frente é +y (para baixo na planta).
// Serve tanto para a planta 2D quanto para a miniatura do catálogo. Traço não engrossa com o zoom.
const T = { vectorEffect: 'non-scaling-stroke', strokeWidth: 1 }
const CLARO = 'rgba(255,255,255,.22)'
const ESCURO = 'rgba(0,0,0,.22)'

export function Desenho({ c, opacidade = 1 }) {
  const { l: L, p: P, cor } = c
  const x0 = -L / 2, y0 = -P / 2, m = Math.min(L, P)
  const R = (x, y, w, h, { key, ...extra } = {}) => <rect key={key} x={x} y={y} width={w} height={h} {...T} {...extra} />
  const linha = (x1, y1, x2, y2, k) => <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} {...T} />
  const f = { fill: cor }
  let corpo
  switch (c.forma) {
    case 'sofa': {
      const enc = Math.min(0.22 * P, 0.25), br = Math.min(0.15 * L, 0.2), n = L > 1.8 ? 3 : L > 1.2 ? 2 : 1, w = (L - 2 * br) / n
      corpo = <>{R(x0, y0, L, P, f)}{R(x0, y0, L, enc, { fill: CLARO })}{R(x0, y0, br, P, { fill: CLARO })}{R(-x0 - br, y0, br, P, { fill: CLARO })}
        {Array.from({ length: n - 1 }, (_, i) => linha(x0 + br + w * (i + 1), y0 + enc, x0 + br + w * (i + 1), -y0, i))}</>
      break
    }
    case 'L': {
      const t = m * 0.45
      corpo = <path d={`M${x0} ${y0}H${-x0}V${y0 + t}H${x0 + t}V${-y0}H${x0}Z`} fill={cor} {...T} />
      break
    }
    case 'cadeira':
      corpo = <>{R(x0 + 0.08 * L, y0 + 0.12 * P, 0.84 * L, 0.88 * P, f)}{R(x0, y0, L, 0.18 * P, { fill: cor, rx: 0.03 })}</>
      break
    case 'mesa':
      corpo = <>{R(x0, y0, L, P, { ...f, rx: m * 0.06 })}{R(x0 + 0.07 * L, y0 + 0.07 * P, 0.86 * L, 0.86 * P, { fill: 'none', strokeOpacity: 0.35 })}</>
      break
    case 'jogo':
      corpo = <>{R(x0, y0, L, P, { fill: '#6b4a2f', rx: m * 0.05 })}{R(x0 + 0.08 * m, y0 + 0.08 * m, L - 0.16 * m, P - 0.16 * m, f)}</>
      break
    case 'redondo':
      corpo = <><ellipse rx={L / 2} ry={P / 2} fill={cor} {...T} /><ellipse rx={L * 0.32} ry={P * 0.32} fill="none" strokeOpacity={0.35} {...T} /></>
      break
    case 'cama': {
      const n = L >= 1.2 ? 2 : 1, gap = 0.06, pw = (L - gap * (n + 1)) / n, ph = Math.min(0.35, 0.18 * P)
      corpo = <>{R(x0, y0, L, P, f)}
        {Array.from({ length: n }, (_, i) => R(x0 + gap + i * (pw + gap), y0 + gap, pw, ph, { key: i, fill: CLARO, rx: 0.04 }))}
        {R(x0, y0 + 0.32 * P, L, 0.68 * P, { fill: ESCURO })}{linha(x0, y0 + 0.4 * P, -x0, y0 + 0.4 * P)}</>
      break
    }
    case 'armario': {
      const n = Math.max(1, Math.round(L / 0.5)), w = L / n
      corpo = <>{R(x0, y0, L, P, f)}
        {Array.from({ length: n - 1 }, (_, i) => linha(x0 + w * (i + 1), y0, x0 + w * (i + 1), -y0, i))}
        {Array.from({ length: n }, (_, i) => <circle key={'p' + i} cx={x0 + w * (i + 0.5)} cy={-y0 - Math.min(0.06, P * 0.2)} r={Math.min(0.025, m * 0.1)} fill={ESCURO} />)}</>
      break
    }
    case 'estante': {
      const n = Math.max(1, Math.round(L / 0.4)), w = L / n
      corpo = <>{R(x0, y0, L, P, f)}{Array.from({ length: n - 1 }, (_, i) => linha(x0 + w * (i + 1), y0, x0 + w * (i + 1), -y0, i))}
        {linha(x0, 0, -x0, 0, 'm')}</>
      break
    }
    case 'eletro':
      corpo = <>{R(x0, y0, L, P, { ...f, rx: m * 0.08 })}{R(x0 + 0.12 * L, y0 + 0.12 * P, 0.76 * L, 0.76 * P, { fill: CLARO, rx: m * 0.05 })}</>
      break
    case 'fogao': {
      const cols = L > 0.7 ? 3 : 2, r = Math.min(L / cols, P / 2) * 0.3
      corpo = <>{R(x0, y0, L, P, { ...f, rx: m * 0.05 })}
        {Array.from({ length: cols * 2 }, (_, i) => <circle key={i} cx={x0 + (L / cols) * ((i % cols) + 0.5)} cy={y0 + (P / 2) * (Math.floor(i / cols) + 0.5)} r={r} fill={ESCURO} {...T} />)}</>
      break
    }
    case 'tv':
      corpo = <>{R(x0, y0, L, P, f)}{linha(x0, -y0, -x0, -y0)}</>
      break
    case 'pia':
      corpo = <>{R(x0, y0, L, P, f)}<ellipse cy={P * 0.06} rx={L * 0.3} ry={P * 0.28} fill={CLARO} {...T} /><circle cy={y0 + P * 0.12} r={m * 0.05} fill={ESCURO} /></>
      break
    case 'vaso':
      corpo = <>{R(x0, y0, L, 0.3 * P, { ...f, rx: 0.03 })}<ellipse cy={y0 + 0.64 * P} rx={L * 0.46} ry={0.34 * P} fill={cor} {...T} />
        <ellipse cy={y0 + 0.66 * P} rx={L * 0.28} ry={0.22 * P} fill={CLARO} {...T} /></>
      break
    case 'banheira':
      corpo = <>{R(x0, y0, L, P, { ...f, rx: m * 0.25 })}{R(x0 + 0.08 * m, y0 + 0.08 * m, L - 0.16 * m, P - 0.16 * m, { fill: CLARO, rx: m * 0.2 })}
        <circle cx={x0 + L * 0.15} r={m * 0.04} fill={ESCURO} /></>
      break
    case 'chuveiro':
      corpo = <>{R(x0, y0, L, P, f)}{linha(x0, y0, -x0, -y0, 'a')}{linha(-x0, y0, x0, -y0, 'b')}<circle r={m * 0.06} fill={ESCURO} {...T} /></>
      break
    case 'planta':
      corpo = <>{Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        return <ellipse key={i} cx={Math.cos(a) * L * 0.25} cy={Math.sin(a) * P * 0.25} rx={L * 0.22} ry={P * 0.22} fill={cor} {...T} />
      })}<ellipse rx={L * 0.2} ry={P * 0.2} fill={CLARO} {...T} /></>
      break
    case 'tapete':
      corpo = <>{R(x0, y0, L, P, { fill: cor, fillOpacity: 0.75 })}{R(x0 + 0.06 * m, y0 + 0.06 * m, L - 0.12 * m, P - 0.12 * m, { fill: 'none', strokeOpacity: 0.4 })}</>
      break
    case 'luz':
      corpo = <><circle r={m / 2} fill={cor} {...T} /><circle r={m * 0.18} fill="rgba(255,255,255,.65)" />
        {linha(-m * 0.5, 0, m * 0.5, 0, 'h')}{linha(0, -m * 0.5, 0, m * 0.5, 'v')}</>
      break
    case 'piscina':
      corpo = <>{R(x0, y0, L, P, { ...f, rx: m * 0.15 })}
        {[0.3, 0.55, 0.8].map((k) => <path key={k} d={`M${x0 + L * 0.15} ${y0 + P * k} q${L * 0.12} ${-P * 0.06} ${L * 0.24} 0 t${L * 0.24} 0 t${L * 0.24} 0`} fill="none" stroke="rgba(255,255,255,.5)" {...T} />)}</>
      break
    case 'carro':
      corpo = <>{R(x0, y0, L, P, { ...f, rx: L * 0.25 })}{R(x0 + 0.12 * L, y0 + 0.2 * P, 0.76 * L, 0.13 * P, { fill: '#1d2430', rx: 0.08 })}
        {R(x0 + 0.12 * L, y0 + 0.66 * P, 0.76 * L, 0.1 * P, { fill: '#1d2430', rx: 0.08 })}{R(x0 + 0.15 * L, y0 + 0.35 * P, 0.7 * L, 0.29 * P, { fill: CLARO })}</>
      break
    case 'arvore':
      corpo = <>{[[0, 0, 0.5], [-0.2, -0.15, 0.32], [0.2, -0.12, 0.3], [0.05, 0.22, 0.3]].map(([x, y, r], i) =>
        <circle key={i} cx={x * L} cy={y * P} r={r * m} fill={cor} {...T} />)}</>
      break
    case 'escada':
    case 'rampa': {
      const degraus = c.forma === 'escada' ? Math.max(2, Math.round(P / 0.28)) : 0
      corpo = <>{R(x0, y0, L, P, f)}{Array.from({ length: degraus - 1 }, (_, i) => linha(x0, y0 + (P / degraus) * (i + 1), -x0, y0 + (P / degraus) * (i + 1), i))}
        <path d={`M0 ${P * 0.35} V${-P * 0.35} M${-L * 0.2} ${-P * 0.25} L0 ${-P * 0.35} L${L * 0.2} ${-P * 0.25}`} fill="none" {...T} strokeWidth={1.5} /></>
      break
    }
    case 'cubo': // vista de cima de uma caixa: contorno + face de cima recuada (dá a ideia de volume)
      corpo = <>{R(x0, y0, L, P, f)}{R(x0 + 0.12 * m, y0 + 0.12 * m, L - 0.24 * m, P - 0.24 * m, { fill: CLARO })}
        {linha(x0, y0, x0 + 0.12 * m, y0 + 0.12 * m, 'a')}{linha(-x0, y0, -x0 - 0.12 * m, y0 + 0.12 * m, 'b')}
        {linha(x0, -y0, x0 + 0.12 * m, -y0 - 0.12 * m, 'c')}{linha(-x0, -y0, -x0 - 0.12 * m, -y0 - 0.12 * m, 'd')}</>
      break
    case 'cilindro':
      corpo = <><ellipse rx={L / 2} ry={P / 2} fill={cor} {...T} /><ellipse rx={L * 0.4} ry={P * 0.4} fill={CLARO} {...T} /></>
      break
    case 'esfera':
      corpo = <><ellipse rx={L / 2} ry={P / 2} fill={cor} {...T} /><ellipse cx={-L * 0.15} cy={-P * 0.15} rx={L * 0.15} ry={P * 0.15} fill="rgba(255,255,255,.45)" /></>
      break
    case 'cone':
      corpo = <><ellipse rx={L / 2} ry={P / 2} fill={cor} {...T} />{linha(-L / 2, 0, L / 2, 0, 'h')}{linha(0, -P / 2, 0, P / 2, 'v')}<circle r={m * 0.04} fill={ESCURO} /></>
      break
    case 'piramide':
      corpo = <>{R(x0, y0, L, P, f)}{linha(x0, y0, -x0, -y0, 'a')}{linha(-x0, y0, x0, -y0, 'b')}</>
      break
    case 'prisma':
      corpo = <path d={`M0 ${y0} L${-x0} ${-y0} L${x0} ${-y0}Z`} fill={cor} {...T} />
      break
    default: // geral, deco
      corpo = R(x0, y0, L, P, { ...f, rx: m * 0.1 })
  }
  return <g opacity={opacidade}>{corpo}</g>
}

export function Miniatura({ c, tamanho = 40 }) {
  const lado = Math.max(c.l, c.p) * 1.2
  return (
    <svg width={tamanho} height={tamanho} viewBox={`${-lado / 2} ${-lado / 2} ${lado} ${lado}`} className="miniatura" stroke="#d7dbe1">
      <Desenho c={c} />
    </svg>
  )
}
