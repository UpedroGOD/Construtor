import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { porTipo, ABERTURAS, PISOS, medidas, varianteDe, dimsItem } from './catalogo'
import { direcao, seguradas } from './teclas'
import { renderDesenho2D } from './desenhos2d'
import { ESPESSURA, dist, igual, arred, fixar, novoId, moverPontos, projetar, prender, dentro, moverAlvo, paredesInternas, cantosItem, alvoDaSala, encaixarNaParede } from './projeto'

const PX_IMA = 12 // raio do ímã em pixels de tela
const CAIXA = new Set(['retangulo', 'formaL', 'formaU', 'formaT', 'elipse']) // desenhadas de canto a canto
const FORMAS = new Set([...CAIXA, 'poligono'])

// pontos de uma parede curva que passa por a, m e b (arco do círculo pelos 3 pontos)
function pontosArco(a, m, b) {
  const d = 2 * (a[0] * (m[1] - b[1]) + m[0] * (b[1] - a[1]) + b[0] * (a[1] - m[1]))
  if (Math.abs(d) < 1e-9) return [a, b] // os 3 em linha: parede reta
  const q = (p) => p[0] * p[0] + p[1] * p[1]
  const c = [(q(a) * (m[1] - b[1]) + q(m) * (b[1] - a[1]) + q(b) * (a[1] - m[1])) / d, (q(a) * (b[0] - m[0]) + q(m) * (a[0] - b[0]) + q(b) * (m[0] - a[0])) / d]
  const r = dist(a, c), ang = (p) => Math.atan2(p[1] - c[1], p[0] - c[0]), norm = (t) => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  const ta = ang(a)
  let varre = norm(ang(b) - ta)
  if (norm(ang(m) - ta) > varre) varre -= 2 * Math.PI // o ponto do meio está do outro lado: anda no sentido contrário
  const n = Math.min(48, Math.max(6, Math.round((Math.abs(varre) * r) / 0.3)))
  return Array.from({ length: n + 1 }, (_, k) => fixar([c[0] + r * Math.cos(ta + (varre * k) / n), c[1] + r * Math.sin(ta + (varre * k) / n)]))
}
const PASSO_ANG = Math.PI / 12 // 15°
const E = ESPESSURA

function Cota({ a, b, s }) {
  const len = dist(a, b)
  if (len < 0.05 || s < 15) return null
  let ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
  if (ang > 90) ang -= 180 // texto nunca de cabeça para baixo
  if (ang <= -90) ang += 180
  return (
    <text className="cota" fontSize={11 / s} textAnchor="middle"
      transform={`translate(${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2}) rotate(${ang}) translate(0 ${-(E / 2 + 5 / s)})`}>
      {len.toFixed(2)}
    </text>
  )
}

// Porta ou janela desenhada no sistema da parede: x corre ao longo da parede a partir da ponta "a"
export function Abertura({ ab, w, s, sel, fantasma }) {
  const { l } = medidas(ab)
  const L = dist(w.a, w.b)
  if (L < l) return null
  const t = prender(ab.t, l, L)
  const x0 = t - l / 2, x1 = t + l / 2
  const lado = ab.lado || 1, v = varianteDe(ab)
  const ang = (Math.atan2(w.b[1] - w.a[1], w.b[0] - w.a[0]) * 180) / Math.PI
  const cls = `abertura${sel ? ' sel' : ''}${fantasma ? ' fantasma' : ''}`
  const tracejado = `${3 / s} ${3 / s}`
  const folha = (xh, larg, sentido) => ( // folha que gira na dobradiça xh; sentido +1 abre para o lado de x1
    <>
      <line x1={xh} y1={(lado * E) / 2} x2={xh} y2={lado * (E / 2 + larg)} />
      <path d={`M${xh} ${lado * (E / 2 + larg)} A${larg} ${larg} 0 0 ${(lado > 0) === (sentido > 0) ? 0 : 1} ${xh + sentido * larg} ${(lado * E) / 2}`} fill="none" strokeDasharray={tracejado} />
    </>
  )
  const correr = (y) => <><line x1={x0} x2={t + 0.05} y1={-y} y2={-y} /><line x1={t - 0.05} x2={x1} y1={y} y2={y} /></>
  let simbolo
  if (ab.tipo === 'porta') {
    if (v === 'dupla') simbolo = <>{folha(x0, l / 2, 1)}{folha(x1, l / 2, -1)}</>
    else if (v === 'correr') simbolo = correr(E / 5)
    else if (v === 'garagem') simbolo = <line x1={x0} x2={x1} y1={0} y2={0} strokeDasharray={`${8 / s} ${4 / s}`} />
    else if (v === 'arco') simbolo = null
    else simbolo = <>{folha(x0, l, 1)}{v === 'vidro' && <line x1={x0 + 0.03 * lado} y1={(lado * E) / 2} x2={x0 + 0.03 * lado} y2={lado * (E / 2 + l)} />}</>
  } else {
    simbolo = (
      <>
        <rect x={x0} y={-E / 2} width={l} height={E} fill="none" />
        {v === 'correr' || v === 'sacada' ? correr(E / 6) : <line x1={x0} x2={x1} y1={0} y2={0} />}
        {(v === 'basculante' || v === 'maximar') && <path d={`M${x0} ${-E / 2} L${t} ${E / 2} L${x1} ${-E / 2}`} fill="none" strokeDasharray={tracejado} />}
      </>
    )
  }
  return (
    <g transform={`translate(${w.a[0]} ${w.a[1]}) rotate(${ang})`} className={cls} strokeWidth={1.5 / s}>
      <line x1={x0} x2={x1} y1={0} y2={0} className="vao" strokeWidth={E * 1.02} />
      <line x1={x0} x2={x0} y1={-E / 2} y2={E / 2} /><line x1={x1} x2={x1} y1={-E / 2} y2={E / 2} />
      {simbolo}
      {!fantasma && <rect data-tipo="abertura" data-id={ab.id} x={x0} y={-E} width={l} height={E * 2} className="alvo" fill="transparent" stroke="none" />}
    </g>
  )
}

// trecho de reta encosta no retângulo? (amostra pontos; shortcut: 24 amostras bastam para seleção na tela)
const tocaRet = (a, b, r) => Array.from({ length: 25 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / 24, a[1] + ((b[1] - a[1]) * i) / 24]).some(r)

// Cota no estilo AutoCAD: linhas de chamada, linha de cota com tique a 45° e o valor em cima.
// off = distância da linha de cota até o objeto (lado esquerdo de a→b é positivo); ini = onde a linha de chamada começa
export function CotaCAD({ a, b, off = 0, ini = 0, s, texto, classe = 'cota-cad' }) {
  const len = dist(a, b)
  if (len < 0.03 || len * s < 14) return null
  const ux = (b[0] - a[0]) / len, uz = (b[1] - a[1]) / len, nx = -uz, nz = ux
  const A = [a[0] + nx * off, a[1] + nz * off], B = [b[0] + nx * off, b[1] + nz * off]
  const sg = Math.sign(off) || 1, passa = (4 / s) * sg, t = 4 / s
  let ang = (Math.atan2(uz, ux) * 180) / Math.PI
  if (ang > 90) ang -= 180
  if (ang <= -90) ang += 180
  return (
    <g className={classe} strokeWidth={1 / s}>
      {off !== 0 && [a, b].map((q, i) => (
        <line key={'e' + i} x1={q[0] + nx * ini} y1={q[1] + nz * ini} x2={q[0] + nx * off + nx * passa} y2={q[1] + nz * off + nz * passa} />
      ))}
      <line x1={A[0] - ux * t} y1={A[1] - uz * t} x2={B[0] + ux * t} y2={B[1] + uz * t} />
      {[A, B].map((q, i) => <line key={'t' + i} x1={q[0] - (ux - nx) * t} y1={q[1] - (uz - nz) * t} x2={q[0] + (ux - nx) * t} y2={q[1] + (uz - nz) * t} strokeWidth={2 / s} />)}
      <text fontSize={11 / s} textAnchor="middle" className="cota"
        transform={`translate(${(A[0] + B[0]) / 2} ${(A[1] + B[1]) / 2}) rotate(${ang}) translate(0 ${-4 / s})`}>{texto ?? len.toFixed(2)}</text>
    </g>
  )
}

// Distância até a parede mais próxima numa direção (raio saindo do centro do móvel)
function raio(c, d, paredes) {
  let melhor = null
  for (const w of paredes) {
    const ex = w.b[0] - w.a[0], ez = w.b[1] - w.a[1]
    const den = d[0] * ez - d[1] * ex
    if (Math.abs(den) < 1e-9) continue
    const qx = w.a[0] - c[0], qz = w.a[1] - c[1]
    const t = (qx * ez - qz * ex) / den, u = (qx * d[1] - qz * d[0]) / den
    if (t > 0 && u >= 0 && u <= 1 && (!melhor || t < melhor.t)) melhor = { t, esp: w.esp ?? E }
  }
  return melhor
}

// Móvel selecionado: largura, profundidade e a folga até cada parede (para cima, baixo, esquerda, direita)
function CotasItem({ it, c, paredes, s }) {
  const co = Math.abs(Math.cos(it.rot)), se = Math.abs(Math.sin(it.rot))
  const meia = { x: (co * c.l + se * c.p) / 2, z: (se * c.l + co * c.p) / 2 }
  const centro = [it.x, it.z]
  return (
    <>
      <g transform={`translate(${it.x} ${it.z}) rotate(${(-it.rot * 180) / Math.PI})`}>
        <CotaCAD a={[-c.l / 2, -c.p / 2]} b={[c.l / 2, -c.p / 2]} off={-0.25} ini={-0.04} s={s} classe="cota-cad cota-item" />
        <CotaCAD a={[c.l / 2, -c.p / 2]} b={[c.l / 2, c.p / 2]} off={-0.25} ini={-0.04} s={s} classe="cota-cad cota-item" />
      </g>
      {[[1, 0, 'x'], [-1, 0, 'x'], [0, 1, 'z'], [0, -1, 'z']].map(([dx, dz, eixo]) => {
        const r = raio(centro, [dx, dz], paredes)
        if (!r) return null
        const h = meia[eixo], face = r.t - r.esp / 2, folga = face - h
        if (folga < 0.005 || folga > 15) return null
        return <CotaCAD key={dx + ',' + dz} a={[it.x + dx * h, it.z + dz * h]} b={[it.x + dx * face, it.z + dz * face]} s={s} classe="cota-cad cota-folga" />
      })}
    </>
  )
}

// Rosa dos ventos + barra de escala + escala aproximada da tela (96 dpi: 1 px = 0,2646 mm)
function Escala({ s, r = 0, aoNorte }) {
  const alvo = 120 / s
  const L = [0.25, 0.5, 1, 2, 5, 10, 20, 50].find((v) => v >= alvo) || 100
  const px = L * s, n = 4
  return (
    <div className="escala">
      <svg width="34" height="44" viewBox="-17 -22 34 44" className="norte" onClick={aoNorte} style={{ pointerEvents: 'auto', cursor: r ? 'pointer' : 'default' }}>
        <title>{r ? 'Clique para voltar o norte para cima' : 'Norte'}</title>
        <g transform={`rotate(${(r * 180) / Math.PI})`}><path d="M0 -18 L8 10 L0 4 L-8 10Z" /></g><text y="21" textAnchor="middle">N</text>
      </svg>
      <div>
        <svg width={px + 2} height="10" className="barra">
          {Array.from({ length: n }, (_, i) => <rect key={i} x={1 + (px / n) * i} y="1" width={px / n} height="7" className={i % 2 ? 'b' : 'p'} />)}
        </svg>
        <div className="escala-txt"><span>0</span><span>{L} m</span></div>
        <div className="escala-txt">ESC. ≈ 1:{Math.round(1000 / (s * 0.26458))}</div>
      </div>
    </div>
  )
}

const CAMADAS = [['paredes', 'Paredes'], ['aberturas', 'Portas/janelas'], ['moveis', 'Móveis'], ['cotas', 'Cotas'], ['textos', 'Textos'], ['grade', 'Grade']]

export default function Planta2D({ projeto, mudar, marcar, ferramenta, sel, setSel, grupo = [], setGrupo = () => {}, colocando, setColocando, salas = [], abaixo, lados = 8 }) {
  const svgRef = useRef()
  const [vista, setVista] = useState({ x: 400, y: 300, s: 60, r: 0 }) // s = pixels por metro, r = giro da vista (radianos)
  const [tam, setTam] = useState({ w: 800, h: 600 })
  const [mouse, setMouse] = useState(null) // { tela, p, tipo, abertura? }
  const [inicio, setInicio] = useState(null)
  const [primeiro, setPrimeiro] = useState(null)
  const [digitado, setDigitado] = useState('')
  const [cotaIni, setCotaIni] = useState(null) // 1º ponto da cota sendo medida
  const [formaIni, setFormaIni] = useState(null) // 1º clique do retângulo/polígono
  const [formaFim, setFormaFim] = useState(null) // parede curva: 2º clique (a ponta final)
  const [caixa, setCaixa] = useState(null) // janela de seleção { a, b }
  const noGrupo = new Set(grupo.map((g) => g.id))
  const marcado = (id) => sel?.id === id || noGrupo.has(id)
  const [camadas, setCamadas] = useState(() => Object.fromEntries(CAMADAS.map(([k]) => [k, true])))
  const arraste = useRef(null)
  const espaco = useRef(false)
  const { x, y, s } = vista
  const r = vista.r || 0, cosR = Math.cos(r), senR = Math.sin(r)
  const travado = useRef(false) // com móvel/grupo selecionado, Q/E giram ele e não a vista
  travado.current = sel?.tipo === 'item' || sel?.tipo === 'sala' || grupo.length > 0
  const paredesPorId = Object.fromEntries(projeto.paredes.map((w) => [w.id, w]))

  const enquadrar = () => {
    const b = svgRef.current.getBoundingClientRect()
    const pts = [...projeto.paredes.flatMap((w) => [w.a, w.b]), ...projeto.itens.map((i) => [i.x, i.z])]
    if (!pts.length) return setVista((v) => ({ ...v, x: b.width / 2, y: b.height / 2, s: 60 }))
    setVista((v) => { // enquadra já considerando o giro da vista
      const c = Math.cos(v.r || 0), sn = Math.sin(v.r || 0)
      const gir = pts.map(([px, pz]) => [px * c - pz * sn, px * sn + pz * c])
      const xs = gir.map((p) => p[0]), zs = gir.map((p) => p[1])
      const [ax, bx, az, bz] = [Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs)]
      const ns = Math.min(300, b.width / (bx - ax + 3), b.height / (bz - az + 3))
      return { ...v, s: ns, x: b.width / 2 - ((ax + bx) / 2) * ns, y: b.height / 2 - ((az + bz) / 2) * ns }
    })
  }

  useLayoutEffect(() => {
    enquadrar()
    const ro = new ResizeObserver(([e]) => setTam({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(svgRef.current)
    const el = svgRef.current
    const roda = (e) => {
      e.preventDefault()
      const b = el.getBoundingClientRect()
      const mx = e.clientX - b.left, my = e.clientY - b.top
      setVista((v) => {
        const ns = Math.min(800, Math.max(5, v.s * Math.exp(-e.deltaY * 0.0015)))
        const f = ns / v.s
        return { ...v, s: ns, x: mx - (mx - v.x) * f, y: my - (my - v.y) * f } // zoom fixo no cursor
      })
    }
    el.addEventListener('wheel', roda, { passive: false })
    return () => { ro.disconnect(); el.removeEventListener('wheel', roda) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const ima = (raw, origem, livre, ignorar = []) => {
    let melhor = null, md = PX_IMA / s
    for (const w of projeto.paredes)
      for (const q of [w.a, w.b]) {
        if (ignorar.some((i) => igual(i, q))) continue
        const d = dist(q, raw)
        if (d < md) { md = d; melhor = q }
      }
    if (melhor) return { p: melhor, tipo: 'ponta' }
    for (const w of projeto.paredes) {
      const q = fixar([(w.a[0] + w.b[0]) / 2, (w.a[1] + w.b[1]) / 2])
      if (dist(q, raw) < md) { md = dist(q, raw); melhor = q }
    }
    if (melhor) return { p: melhor, tipo: 'meio' }
    let pa
    if (origem && !livre) {
      const ang = arred(Math.atan2(raw[1] - origem[1], raw[0] - origem[0]), PASSO_ANG)
      const len = arred(dist(raw, origem), 0.05)
      pa = fixar([origem[0] + Math.cos(ang) * len, origem[1] + Math.sin(ang) * len])
    } else pa = livre ? fixar(raw) : fixar([arred(raw[0], 0.1), arred(raw[1], 0.1)])
    if (livre) return { p: pa, tipo: 'grade' }
    // guias de alinhamento (rastreamento do AutoCAD): o mouse na mesma linha de uma ponta existente gruda nela
    const tol = 8 / s, refs = [...projeto.paredes.flatMap((w) => [w.a, w.b]), ...(primeiro && !igual(primeiro, origem || [NaN, NaN]) ? [primeiro] : [])]
    let gx = null, gz = null
    for (const q of refs) {
      if (ignorar.some((i) => igual(i, q)) || (origem && igual(q, origem))) continue
      if (!gx && Math.abs(raw[0] - q[0]) < tol) gx = q
      if (!gz && Math.abs(raw[1] - q[1]) < tol) gz = q
    }
    if (origem) { // parede reta continua reta: deitada só aceita guia vertical, em pé só horizontal
      const deitada = Math.abs(pa[1] - origem[1]) < 1e-9, empe = Math.abs(pa[0] - origem[0]) < 1e-9
      if (deitada && gx) return { p: fixar([gx[0], origem[1]]), tipo: 'guia', guias: [gx] }
      if (empe && gz) return { p: fixar([origem[0], gz[1]]), tipo: 'guia', guias: [gz] }
      return { p: pa, tipo: 'angulo' }
    }
    if (gx || gz) return { p: fixar([gx ? gx[0] : pa[0], gz ? gz[1] : pa[1]]), tipo: 'guia', guias: [gx, gz].filter(Boolean) }
    return { p: pa, tipo: 'grade' }
  }

  // Parede mais perto do mouse onde cabe a porta/janela; soParede = arrastando uma que já existe
  const acharVao = (raw, tipo, soParede, l = ABERTURAS[tipo].l) => {
    let melhor = null
    for (const w of projeto.paredes) {
      if (soParede && w.id !== soParede) continue
      const { t, d, L } = projetar(raw, w)
      if (L < l || t < -0.3 || t > L + 0.3) continue
      if (!soParede && d > Math.max(0.4, 20 / s)) continue
      if (!melhor || d < melhor.d) melhor = { parede: w.id, t: +prender(arred(t, 0.05), l, L).toFixed(3), d }
    }
    return melhor
  }

  const encerrar = () => { setInicio(null); setPrimeiro(null); setDigitado(''); setCotaIni(null); setFormaIni(null); setFormaFim(null) }

  // pontos de um retângulo (canto a canto) ou polígono regular (centro → um dos cantos)
  const pontosForma = (a, b, livre) => {
    if (CAIXA.has(ferramenta)) { // formas feitas de canto a canto: o desenho estica para caber no retângulo
      const W = b[0] - a[0], H = b[1] - a[1]
      if (Math.abs(W) < 0.05 || Math.abs(H) < 0.05) return null
      const P = (u, v) => fixar([a[0] + W * u, a[1] + H * v])
      if (ferramenta === 'elipse') return Array.from({ length: 32 }, (_, k) => P(0.5 + 0.5 * Math.cos((2 * Math.PI * k) / 32), 0.5 + 0.5 * Math.sin((2 * Math.PI * k) / 32)))
      return {
        retangulo: [[0, 0], [1, 0], [1, 1], [0, 1]],
        formaL: [[0, 0], [1, 0], [1, 0.5], [0.5, 0.5], [0.5, 1], [0, 1]],
        formaU: [[0, 0], [1, 0], [1, 1], [2 / 3, 1], [2 / 3, 0.5], [1 / 3, 0.5], [1 / 3, 1], [0, 1]],
        formaT: [[0, 0], [1, 0], [1, 0.4], [2 / 3, 0.4], [2 / 3, 1], [1 / 3, 1], [1 / 3, 0.4], [0, 0.4]],
      }[ferramenta].map(([u, v]) => P(u, v))
    }
    const r = dist(a, b)
    if (r < 0.1) return null
    const ang0 = livre ? Math.atan2(b[1] - a[1], b[0] - a[0]) : arred(Math.atan2(b[1] - a[1], b[0] - a[0]), PASSO_ANG)
    return Array.from({ length: lados }, (_, k) => fixar([a[0] + r * Math.cos(ang0 + (2 * Math.PI * k) / lados), a[1] + r * Math.sin(ang0 + (2 * Math.PI * k) / lados)]))
  }
  const criarForma = (pts, aberto) => {
    if (!pts) return
    const n = aberto ? pts.length - 1 : pts.length
    mudar((pr) => ({ ...pr, paredes: [...pr.paredes, ...pts.slice(0, n).map((a, k) => ({ id: novoId(), a, b: pts[(k + 1) % pts.length] }))] }))
    setFormaIni(null); setFormaFim(null); setDigitado('')
  }

  const colocarPonto = (p) => {
    if (!inicio) { setInicio(p); setPrimeiro(p); return }
    if (dist(p, inicio) < 0.05) return
    mudar((pr) => ({ ...pr, paredes: [...pr.paredes, { id: novoId(), a: inicio, b: p }] }))
    setDigitado('')
    if (igual(p, primeiro)) return encerrar() // fechou o cômodo
    setInicio(p)
  }

  useEffect(() => {
    const tecla = (e) => {
      if (e.target.tagName === 'INPUT') return
      if (e.code === 'Space') { espaco.current = e.type === 'keydown'; e.preventDefault(); return }
      if (e.type !== 'keydown') return
      if (e.key === 'Escape') encerrar()
      if ((e.key === 'f' || e.key === 'F') && sel?.tipo !== 'sala') enquadrar() // com cômodo selecionado, F foca no 3D
      if (!inicio && !formaIni) return
      if (/^[0-9.,]$/.test(e.key) || (formaIni && /^[x*]$/i.test(e.key))) setDigitado((d) => d + e.key.replace(',', '.').replace('*', 'x').toLowerCase())
      else if (e.key === 'Backspace') setDigitado((d) => d.slice(0, -1))
      else if (e.key === 'Enter' && mouse && formaIni) { // "4x3" no retângulo, raio no polígono; lado/direção pelo mouse
        const [w, h] = digitado.split('x').map(parseFloat)
        if (!(w > 0)) return
        if (CAIXA.has(ferramenta)) {
          const sx = Math.sign(mouse.p[0] - formaIni[0]) || 1, sz = Math.sign(mouse.p[1] - formaIni[1]) || 1
          criarForma(pontosForma(formaIni, [formaIni[0] + sx * w, formaIni[1] + sz * (h > 0 ? h : w)]))
        } else {
          const ang = Math.atan2(mouse.p[1] - formaIni[1], mouse.p[0] - formaIni[0])
          criarForma(pontosForma(formaIni, [formaIni[0] + w * Math.cos(ang), formaIni[1] + w * Math.sin(ang)]))
        }
      } else if (e.key === 'Enter' && mouse) {
        const len = parseFloat(digitado)
        if (!(len > 0)) return
        const ang = Math.atan2(mouse.p[1] - inicio[1], mouse.p[0] - inicio[0])
        colocarPonto(fixar([inicio[0] + Math.cos(ang) * len, inicio[1] + Math.sin(ang) * len]))
      }
    }
    window.addEventListener('keydown', tecla)
    window.addEventListener('keyup', tecla)
    return () => { window.removeEventListener('keydown', tecla); window.removeEventListener('keyup', tecla) }
  })

  useEffect(() => { if (ferramenta !== 'parede') encerrar() }, [ferramenta])

  // WASD move a planta, na mesma velocidade de tela em qualquer zoom; Shift corre
  useEffect(() => {
    let id, antes = performance.now()
    const passo = (agora) => {
      const dt = Math.min(0.05, (agora - antes) / 1000)
      antes = agora
      const d = direcao()
      if (d.x || d.y) {
        const v = 700 * dt * (d.rapido ? 2.5 : 1)
        setVista((vi) => ({ ...vi, x: vi.x - d.x * v, y: vi.y + d.y * v }))
      }
      // Q/E giram a vista em volta do centro da tela (E = esquerda/anti-horário)
      const q = seguradas.has('q'), e = seguradas.has('e')
      if (q !== e && !travado.current && svgRef.current) {
        const b = svgRef.current.getBoundingClientRect(), cx = b.width / 2, cy = b.height / 2
        const da = (e ? -1 : 1) * 1.6 * dt, c = Math.cos(da), sn = Math.sin(da)
        setVista((vi) => ({ ...vi, r: (vi.r || 0) + da, x: cx + (vi.x - cx) * c - (vi.y - cy) * sn, y: cy + (vi.x - cx) * sn + (vi.y - cy) * c }))
      }
      id = requestAnimationFrame(passo)
    }
    id = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(id)
  }, [])

  const ler = (e) => {
    const b = svgRef.current.getBoundingClientRect()
    const tela = [e.clientX - b.left, e.clientY - b.top]
    const dx = tela[0] - x, dy = tela[1] - y // desfaz o giro da vista para achar o ponto em metros
    return { tela, raw: [(dx * cosR + dy * senR) / s, (-dx * senR + dy * cosR) / s] }
  }

  const vaoTool = ferramenta === 'porta' || ferramenta === 'janela'

  const down = (e) => {
    svgRef.current.setPointerCapture(e.pointerId)
    const { raw } = ler(e)
    if (e.button === 1 || (e.button === 0 && espaco.current)) { arraste.current = { tipo: 'pan', ult: [e.clientX, e.clientY] }; return }
    if (e.button === 2) { arraste.current = { tipo: 'pan', ult: [e.clientX, e.clientY], direito: true }; return } // botão direito: arrastar move, clicar cancela
    if (e.button !== 0) return
    if (colocando) {
      const id = novoId()
      const novo = { id, tipo: colocando, x: arred(raw[0], 0.05), z: arred(raw[1], 0.05), rot: 0 }
      if (!e.altKey) Object.assign(novo, encaixarNaParede(novo, porTipo[colocando], projeto.paredes)) // Alt = solto
      mudar((p) => ({ ...p, itens: [...p.itens, novo] }))
      setSel({ tipo: 'item', id })
      if (!e.shiftKey) setColocando(null) // Shift: continua colocando o mesmo móvel
      return
    }
    if (ferramenta === 'parede') { colocarPonto(ima(raw, inicio, e.shiftKey).p); return }
    if (ferramenta === 'arco') { // parede curva: começo, fim, e o 3º clique diz o quanto curva
      const p = ima(raw, null, e.shiftKey).p
      if (!formaIni) return setFormaIni(p)
      if (!formaFim) return dist(p, formaIni) > 0.1 && setFormaFim(p)
      return criarForma(pontosArco(formaIni, p, formaFim), true)
    }
    if (FORMAS.has(ferramenta)) {
      const p = ima(raw, null, e.shiftKey).p
      if (!formaIni) return setFormaIni(p)
      return criarForma(pontosForma(formaIni, p, e.shiftKey))
    }
    if (ferramenta === 'cota') {
      const p = ima(raw, cotaIni, e.shiftKey).p
      if (!cotaIni) return setCotaIni(p)
      if (dist(p, cotaIni) > 0.01) mudar((pr) => ({ ...pr, cotas: [...(pr.cotas || []), { id: novoId(), a: cotaIni, b: p }] }))
      return setCotaIni(null)
    }
    if (vaoTool) {
      const v = acharVao(raw, ferramenta)
      if (!v) return
      const id = novoId()
      mudar((p) => ({ ...p, aberturas: [...p.aberturas, { id, tipo: ferramenta, parede: v.parede, t: v.t, lado: 1 }] }))
      setSel({ tipo: 'abertura', id }) // já abre o painel com tipo, largura, altura e peitoril
      return
    }
    const d = e.target.dataset
    if (d.girar) {
      const it = projeto.itens.find((i) => i.id === d.girar)
      arraste.current = { tipo: 'girar', id: it.id, centro: [it.x, it.z], base: projeto }
      return
    }
    if (d.ponta) {
      const w = projeto.paredes.find((p) => p.id === d.id)
      arraste.current = { tipo: 'ponta', q: w[d.ponta], base: projeto }
      return
    }
    if (d.id) {
      if (noGrupo.has(d.id)) { arraste.current = { tipo: 'grupo', ini: raw, base: projeto }; return } // arrasta a seleção inteira
      setGrupo([])
      setSel({ tipo: d.tipo, id: d.id })
      arraste.current = { tipo: d.tipo, id: d.id, ini: raw, base: projeto }
      return
    }
    const salaSel = sel?.tipo === 'sala' && salas.find((x) => x.id === sel.id)
    if (salaSel && dentro(salaSel.poligono, raw)) { // arrastar dentro do cômodo selecionado move o cômodo inteiro
      arraste.current = { tipo: 'grupo', alvo: alvoDaSala(projeto, salaSel), ini: raw, base: projeto }
      return
    }
    arraste.current = { tipo: 'caixa', ini: raw, iniTela: ler(e).tela } // no vazio: janela de seleção (ou clique = escolher cômodo)
  }

  // Igual ao AutoCAD: da esquerda para a direita pega só o que está todo dentro; da direita para a esquerda, o que encostar
  const fecharCaixa = (a) => {
    const fim = a.fim || a.ini
    if (dist(a.ini, fim) * s < 5) { // foi só um clique
      const sa = salas.findLast((x) => dentro(x.poligono, a.ini)) // a lista vem do maior para o menor
      setGrupo([])
      setSel(sa ? { tipo: 'sala', id: sa.id } : null)
      return
    }
    const janela = (a.fimTela || a.iniTela)[0] > a.iniTela[0] // direção na tela, mesmo com a vista girada
    const [mx, Mx] = [Math.min(a.ini[0], fim[0]), Math.max(a.ini[0], fim[0])], [mz, Mz] = [Math.min(a.ini[1], fim[1]), Math.max(a.ini[1], fim[1])]
    const [tmx, tMx] = [Math.min(a.iniTela[0], a.fimTela[0]), Math.max(a.iniTela[0], a.fimTela[0])], [tmz, tMz] = [Math.min(a.iniTela[1], a.fimTela[1]), Math.max(a.iniTela[1], a.fimTela[1])]
    const r = (q) => { const t = tela(q); return t[0] >= tmx && t[0] <= tMx && t[1] >= tmz && t[1] <= tMz }
    const pega = (pts, a2, b2) => (janela ? pts.every(r) : pts.some(r) || (a2 && tocaRet(a2, b2, r)))
    const lista = []
    for (const w of projeto.paredes) if (pega([w.a, w.b], w.a, w.b)) lista.push({ tipo: 'parede', id: w.id })
    for (const i of projeto.itens) {
      const c = dimsItem(i)
      if (!c) continue
      const co = Math.cos(-i.rot), si = Math.sin(-i.rot)
      const cantos = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [i.x + (u * c.l * co - v * c.p * si) / 2, i.z + (u * c.l * si + v * c.p * co) / 2])
      if (pega(janela ? cantos : [...cantos, [i.x, i.z]])) lista.push({ tipo: 'item', id: i.id })
    }
    for (const k of projeto.cotas || []) if (pega([k.a, k.b], k.a, k.b)) lista.push({ tipo: 'cota', id: k.id })
    if (lista.length === 1) { setGrupo([]); setSel(lista[0]) } else { setSel(null); setGrupo(lista) }
  }

  const up = () => {
    const a = arraste.current
    arraste.current = null
    if (a?.tipo === 'caixa') { setCaixa(null); fecharCaixa(a) }
    if (a?.direito && !a.moveu) { encerrar(); setColocando(null) }
  }

  const move = (e) => {
    const { tela, raw } = ler(e)
    const a = arraste.current
    if (a?.tipo === 'caixa') { a.fim = raw; a.fimTela = tela; setCaixa({ a: a.iniTela, b: tela }); return }
    if (a?.tipo === 'pan') {
      const dx = e.clientX - a.ult[0], dy = e.clientY - a.ult[1]
      if (Math.abs(dx) + Math.abs(dy) > 0) a.moveu = true
      a.ult = [e.clientX, e.clientY]
      setVista((v) => ({ ...v, x: v.x + dx, y: v.y + dy }))
      return
    }
    const m = a?.tipo === 'ponta' ? ima(raw, null, e.shiftKey, [a.q])
      : (ferramenta === 'parede' || ferramenta === 'cota' || FORMAS.has(ferramenta) || ferramenta === 'arco') && !colocando ? ima(raw, ferramenta === 'cota' ? cotaIni : ferramenta === 'parede' ? inicio : null, e.shiftKey)
      : { p: fixar([arred(raw[0], 0.05), arred(raw[1], 0.05)]), tipo: 'grade' }
    if (vaoTool && !colocando) m.abertura = acharVao(raw, ferramenta)
    setMouse({ tela, ...m })
    if (!a) return
    const { base } = a
    let novo
    if (a.tipo === 'girar') {
      // alça fica atrás do móvel (-y local); acha o ângulo que aponta a alça para o mouse. 15° em 15°, Shift livre
      const bruto = Math.atan2(-(raw[0] - a.centro[0]), -(raw[1] - a.centro[1]))
      const rot = +(e.shiftKey ? bruto : arred(bruto, PASSO_ANG)).toFixed(5)
      novo = { ...base, itens: base.itens.map((i) => (i.id === a.id ? { ...i, rot } : i)) }
    } else if (a.tipo === 'ponta') novo = moverPontos(base, [a.q], m.p[0] - a.q[0], m.p[1] - a.q[1])
    else if (a.tipo === 'abertura') {
      const ab = base.aberturas.find((v) => v.id === a.id)
      const v = acharVao(raw, ab.tipo, ab.parede, medidas(ab).l)
      if (!v) return
      novo = { ...base, aberturas: base.aberturas.map((x) => (x.id === a.id ? { ...x, t: v.t } : x)) }
    } else {
      const passo = e.shiftKey ? 0.01 : 0.05
      const dx = arred(raw[0] - a.ini[0], passo), dz = arred(raw[1] - a.ini[1], passo)
      if (a.tipo === 'grupo') novo = moverAlvo(base, a.alvo || grupo, dx, dz)
      else if (a.tipo === 'item')
        novo = { ...base, itens: base.itens.map((i) => {
          if (i.id !== a.id) return i
          const m = { ...i, x: +(i.x + dx).toFixed(3), z: +(i.z + dz).toFixed(3) }
          return e.altKey ? m : { ...m, ...encaixarNaParede(m, dimsItem(m), base.paredes) } // não atravessa parede; Alt solta
        }) }
      else if (a.tipo === 'cota') {
        const mv = (q) => fixar([q[0] + dx, q[1] + dz])
        novo = { ...base, cotas: base.cotas.map((k) => (k.id === a.id ? { ...k, a: mv(k.a), b: mv(k.b) } : k)) }
      } else {
        const w = base.paredes.find((p) => p.id === a.id)
        novo = moverPontos(base, [w.a, w.b], dx, dz)
      }
    }
    if (!a.movido) { marcar(); a.movido = true } // só grava no histórico se realmente arrastou
    mudar(() => novo, false)
  }

  const tela = (p) => [x + s * (p[0] * cosR - p[1] * senR), y + s * (p[0] * senR + p[1] * cosR)]
  // área de mundo visível (com giro): cantos da tela em metros
  const cantos = [[0, 0], [tam.w, 0], [0, tam.h], [tam.w, tam.h]].map(([tx, ty]) => { const dx = tx - x, dy = ty - y; return [(dx * cosR + dy * senR) / s, (-dx * senR + dy * cosR) / s] })
  const x0 = Math.min(...cantos.map((q) => q[0])), x1 = Math.max(...cantos.map((q) => q[0])), z0 = Math.min(...cantos.map((q) => q[1])), z1 = Math.max(...cantos.map((q) => q[1]))
  const paredeSel = sel?.tipo === 'parede' && paredesPorId[sel.id]
  const desenhando = (['parede', 'cota', 'arco'].includes(ferramenta) || FORMAS.has(ferramenta)) && !colocando
  const itemSel = sel?.tipo === 'item' && projeto.itens.find((i) => i.id === sel.id)
  // lado de fora de cada parede: para longe do centro do cômodo dela
  const salaDe = {}
  for (const sa of salas) for (const id of sa.paredes) salaDe[id] ||= sa
  const internas = paredesInternas(projeto.paredes, salas)
  const ladoFora = (w) => {
    const sa = salaDe[w.id]
    if (!sa) return 1
    const L = dist(w.a, w.b), nx = -(w.b[1] - w.a[1]) / L, nz = (w.b[0] - w.a[0]) / L
    return ((w.a[0] + w.b[0]) / 2 - sa.centro[0]) * nx + ((w.a[1] + w.b[1]) / 2 - sa.centro[1]) * nz >= 0 ? 1 : -1
  }
  const cursor = arraste.current?.tipo === 'pan' ? 'grabbing' : desenhando || colocando ? 'none' : vaoTool ? 'crosshair' : 'default'

  return (
    <div className="planta">
      <svg ref={svgRef} onPointerDown={down} onPointerMove={move} onPointerUp={up}
        onPointerLeave={() => setMouse(null)} onContextMenu={(e) => e.preventDefault()} style={{ cursor }}>
        <defs>
          <pattern id="g01" width={0.1} height={0.1} patternUnits="userSpaceOnUse">
            <path d="M0.1 0H0V0.1" fill="none" className="grade1" strokeWidth={1 / s} />
          </pattern>
          <pattern id="g1" width={1} height={1} patternUnits="userSpaceOnUse">
            {s > 25 && <rect width={1} height={1} fill="url(#g01)" />}
            <path d="M1 0H0V1" fill="none" className="grade2" strokeWidth={1 / s} />
          </pattern>
          <pattern id="hachura" width={0.1} height={0.1} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={0.1} height={0.1} className="hach-fundo" />
            <line x1={0} y1={0} x2={0} y2={0.1} className="hach-linha" strokeWidth={1 / s} />
          </pattern>
        </defs>
        <g transform={`translate(${x} ${y}) rotate(${(r * 180) / Math.PI}) scale(${s})`}>
          {camadas.grade && <rect x={x0} y={z0} width={x1 - x0} height={z1 - z0} fill="url(#g1)" />}
          <line x1={x0} x2={x1} y1={0} y2={0} className="eixo-x" strokeWidth={1 / s} />
          <line y1={z0} y2={z1} x1={0} x2={0} className="eixo-z" strokeWidth={1 / s} />

          {abaixo && abaixo.itens.filter((i) => i.tipo === 'escada-reta' || i.tipo === 'escada-caracol').map((i) => {
            const q = cantosItem(i, dimsItem(i)) // vão da escada que vem de baixo: retângulo com X, como no AutoCAD
            return <path key={'v' + i.id} d={`M${q.map((p) => p.join(' ')).join('L')}Z M${q[0].join(' ')}L${q[2].join(' ')} M${q[1].join(' ')}L${q[3].join(' ')}`}
              className="vao-escada" strokeWidth={1 / s} strokeDasharray={`${5 / s} ${4 / s}`} fill="none" pointerEvents="none" />
          })}
          {abaixo && abaixo.paredes.map((w) => (
            <line key={'ab' + w.id} x1={w.a[0]} y1={w.a[1]} x2={w.b[0]} y2={w.b[1]} className="andar-abaixo" strokeWidth={w.esp ?? E} strokeLinecap="square" />
          ))}
          {salas.map((sa) => {
            const piso = PISOS[(projeto.comodos || {})[sa.id]?.piso]
            const sl = sel?.tipo === 'sala' && sel.id === sa.id
            if (!piso && !sl) return null
            return <polygon key={'s' + sa.id} points={sa.poligono.map((q) => q.join(',')).join(' ')} fill={piso?.cor || 'none'} fillOpacity={0.22}
              className={sl ? 'sala-sel' : ''} strokeWidth={2 / s} strokeDasharray={`${6 / s} ${4 / s}`} pointerEvents="none" />
          })}
          {camadas.moveis && projeto.itens.map((i) => {
            const c = dimsItem(i), sl = marcado(i.id)
            if (!c) return null
            const dwg = renderDesenho2D(c.tipo, c.l, c.p, c.cor)
            return (
              <g key={i.id} transform={`translate(${i.x} ${i.z}) rotate(${(-i.rot * 180) / Math.PI})`} className={`movel${sl ? ' sel' : ''}`} vector-effect="non-scaling-stroke">
                <g className="cad" opacity={c.y > 0 ? 0.6 : 1}>
                  {dwg.elements.map((el, k) => <g key={k} dangerouslySetInnerHTML={{ __html: el }} />)}
                  <rect x={dwg.viewBox[0]} y={dwg.viewBox[1]} width={dwg.viewBox[2]} height={dwg.viewBox[3]} fill="none" stroke="none" pointerEvents="none" />
                </g>
                <rect data-tipo="item" data-id={i.id} x={-c.l / 2} y={-c.p / 2} width={c.l} height={c.p}
                  fill="transparent" stroke={sl ? 'var(--sel)' : 'none'} strokeWidth={2 / s} className="alvo" pointerEvents="all" />
                {sl && (
                  <g className="girar">
                    <line x1={0} x2={0} y1={-c.p / 2} y2={-c.p / 2 - 22 / s} strokeWidth={1.5 / s} />
                    <circle data-girar={i.id} cx={0} cy={-c.p / 2 - 22 / s} r={7 / s} strokeWidth={1.5 / s} />
                  </g>
                )}
                {camadas.textos && s > 35 && <text className="rotulo" fontSize={10 / s} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${(i.rot * 180) / Math.PI})`}>{c.nome}</text>}
              </g>
            )
          })}

          {/* parede = contorno grosso + miolo hachurado por cima; as duas passadas juntam os cantos sem risco no meio */}
          {camadas.paredes && projeto.paredes.map((w) => (
            <line key={'c' + w.id} x1={w.a[0]} y1={w.a[1]} x2={w.b[0]} y2={w.b[1]}
              className="parede" strokeWidth={w.esp ?? E} strokeLinecap="square" />
          ))}
          {camadas.paredes && projeto.paredes.map((w) => (
            <line key={'h' + w.id} data-tipo="parede" data-id={w.id} x1={w.a[0]} y1={w.a[1]} x2={w.b[0]} y2={w.b[1]}
              className="alvo" style={{ stroke: 'url(#hachura)' }} strokeWidth={Math.max(0, (w.esp ?? E) - 3 / s)} strokeLinecap="square" />
          ))}
          {/* seleção da parede: faixa só no miolo dela, com ponta reta, para não pintar a parede vizinha */}
          {camadas.paredes && projeto.paredes.filter((w) => marcado(w.id)).map((w) => (
            <line key={'s' + w.id} x1={w.a[0]} y1={w.a[1]} x2={w.b[0]} y2={w.b[1]} className="parede-sel"
              strokeWidth={Math.max(2 / s, (w.esp ?? E) - 4 / s)} strokeLinecap="butt" pointerEvents="none" />
          ))}
          {camadas.aberturas && projeto.aberturas.map((ab) => paredesPorId[ab.parede] && (
            <Abertura key={ab.id} ab={ab} w={paredesPorId[ab.parede]} s={s} sel={marcado(ab.id)} />
          ))}
          {camadas.cotas && projeto.paredes.map((w) => {
            if (internas.has(w.id)) return null
            const sg = ladoFora(w), e2 = (w.esp ?? E) / 2
            return <CotaCAD key={w.id} a={w.a} b={w.b} off={sg * (e2 + 0.45)} ini={sg * (e2 + 0.06)} s={s} />
          })}
          {camadas.cotas && (projeto.cotas || []).map((k) => (
            <g key={k.id} className={marcado(k.id) ? 'cota-sel' : ''}>
              <CotaCAD a={k.a} b={k.b} s={s} />
              <line data-tipo="cota" data-id={k.id} x1={k.a[0]} y1={k.a[1]} x2={k.b[0]} y2={k.b[1]} stroke="transparent" strokeWidth={10 / s} className="alvo" />
            </g>
          ))}
          {camadas.cotas && itemSel && dimsItem(itemSel) && <CotasItem it={itemSel} c={dimsItem(itemSel)} paredes={projeto.paredes} s={s} />}
          {FORMAS.has(ferramenta) && formaIni && mouse && (() => {
            const pts = pontosForma(formaIni, mouse.p)
            if (!pts) return null
            const a = formaIni, b = mouse.p
            return (
              <g pointerEvents="none">
                <polygon points={pts.map((q) => q.join(',')).join(' ')} className="previa-forma" strokeWidth={E} strokeLinejoin="miter" />
                {CAIXA.has(ferramenta)
                  ? <><CotaCAD a={a} b={[b[0], a[1]]} s={s} off={-0.4 * Math.sign(b[1] - a[1] || 1)} classe="cota-cad cota-item" /><CotaCAD a={[b[0], a[1]]} b={b} s={s} off={0.4 * Math.sign(b[0] - a[0] || 1)} classe="cota-cad cota-item" /></>
                  : <CotaCAD a={formaIni} b={pts[0]} s={s} classe="cota-cad cota-item" texto={`R ${dist(formaIni, pts[0]).toFixed(2)}`} />}
              </g>
            )
          })()}
          {ferramenta === 'arco' && formaIni && mouse && (
            <polyline points={(formaFim ? pontosArco(formaIni, mouse.p, formaFim) : [formaIni, mouse.p]).map((q) => q.join(',')).join(' ')}
              className="previa-forma" fill="none" strokeWidth={E} pointerEvents="none" />
          )}
          {mouse?.guias && mouse.guias.map((q, k) => (
            <g key={'g' + k} className="guia" pointerEvents="none">
              <line x1={q[0]} y1={q[1]} x2={mouse.p[0]} y2={mouse.p[1]} strokeWidth={1 / s} strokeDasharray={`${4 / s} ${4 / s}`} />
              <path d={`M${q[0] - 5 / s} ${q[1] - 5 / s}L${q[0] + 5 / s} ${q[1] + 5 / s}M${q[0] + 5 / s} ${q[1] - 5 / s}L${q[0] - 5 / s} ${q[1] + 5 / s}`} strokeWidth={1.5 / s} />
            </g>
          ))}
          {ferramenta === 'cota' && cotaIni && mouse && <CotaCAD a={cotaIni} b={mouse.p} s={s} classe="cota-cad cota-item" />}
          {camadas.textos && salas.map((sa, i) => (
            <g key={sa.id} className="rotulo-sala" transform={`translate(${sa.centro[0]} ${sa.centro[1]})`}>
              <text fontSize={13 / s} textAnchor="middle" fontWeight="600">{((projeto.comodos || {})[sa.id]?.nome || `AMBIENTE ${i + 1}`).toUpperCase()}</text>
              <text y={16 / s} fontSize={11 / s} textAnchor="middle">A = {sa.area.toFixed(2).replace('.', ',')} m²</text>
              {PISOS[(projeto.comodos || {})[sa.id]?.piso] && <text y={30 / s} fontSize={10 / s} textAnchor="middle" opacity={0.75}>{PISOS[(projeto.comodos || {})[sa.id].piso].nome}</text>}
            </g>
          ))}

          {vaoTool && mouse?.abertura && (
            <Abertura ab={{ tipo: ferramenta, t: mouse.abertura.t, lado: 1 }} w={paredesPorId[mouse.abertura.parede]} s={s} fantasma />
          )}

          {desenhando && inicio && mouse && (
            <>
              <line x1={inicio[0]} y1={inicio[1]} x2={mouse.p[0]} y2={mouse.p[1]} className="previa"
                strokeWidth={E} strokeLinecap="square" pointerEvents="none" />
              <Cota a={inicio} b={mouse.p} s={s} />
            </>
          )}

          {colocando && mouse && (() => {
            const c = porTipo[colocando]
            const dwg = renderDesenho2D(c.tipo, c.l, c.p, c.cor)
            return (
              <g transform={`translate(${mouse.p[0]} ${mouse.p[1]})`} className="fantasma-movel" pointerEvents="none" opacity={0.6} vector-effect="non-scaling-stroke">
                {dwg.elements.map((el, k) => <g key={k} dangerouslySetInnerHTML={{ __html: el }} />)}
              </g>
            )
          })()}

          {paredeSel && ['a', 'b'].map((k) => (
            <rect key={k} data-ponta={k} data-id={paredeSel.id} className="alca"
              x={paredeSel[k][0] - 6 / s} y={paredeSel[k][1] - 6 / s} width={12 / s} height={12 / s} strokeWidth={1.5 / s} />
          ))}
        </g>

        {caixa && (() => {
          const jan = caixa.b[0] > caixa.a[0]
          return <rect x={Math.min(caixa.a[0], caixa.b[0])} y={Math.min(caixa.a[1], caixa.b[1])} width={Math.abs(caixa.b[0] - caixa.a[0])} height={Math.abs(caixa.b[1] - caixa.a[1])}
            className={jan ? 'caixa-janela' : 'caixa-cruzada'} strokeWidth={1} strokeDasharray={jan ? 'none' : '5 4'} pointerEvents="none" />
        })()}
        {mouse && (desenhando || colocando || arraste.current?.tipo === 'ponta') && (() => {
          const [cx, cy] = tela(mouse.p)
          return (
            <g pointerEvents="none">
              <line x1={0} x2={tam.w} y1={cy} y2={cy} className="mira" />
              <line y1={0} y2={tam.h} x1={cx} x2={cx} className="mira" />
              {mouse.tipo === 'ponta'
                ? <rect x={cx - 7} y={cy - 7} width={14} height={14} className="ima" />
                : mouse.tipo === 'meio' ? <path d={`M${cx} ${cy - 8} L${cx + 8} ${cy + 6} L${cx - 8} ${cy + 6}Z`} className="ima" />
                : <circle cx={cx} cy={cy} r={3} className="ponto" />}
            </g>
          )
        })()}
      </svg>

      {desenhando && inicio && mouse && (
        <div className="hud" style={{ left: mouse.tela[0] + 18, top: mouse.tela[1] + 18 }}>
          {dist(inicio, mouse.p).toFixed(2)} m · {Math.round((-Math.atan2(mouse.p[1] - inicio[1], mouse.p[0] - inicio[0]) * 180) / Math.PI)}°
          {digitado && <div className="digitado">{digitado} m ↵</div>}
        </div>
      )}

      <div className="camadas">
        {CAMADAS.map(([k, nome]) => (
          <label key={k}><input type="checkbox" checked={camadas[k]} onChange={() => setCamadas((c) => ({ ...c, [k]: !c[k] }))} />{nome}</label>
        ))}
      </div>
      <Escala s={s} r={r} aoNorte={() => {
        const b = svgRef.current.getBoundingClientRect(), cx = b.width / 2, cy = b.height / 2, c = Math.cos(-r), sn = Math.sin(-r)
        setVista((vi) => ({ ...vi, r: 0, x: cx + (vi.x - cx) * c - (vi.y - cy) * sn, y: cy + (vi.x - cx) * sn + (vi.y - cy) * c }))
      }} />

      <div className="status">
        <span>X {mouse ? mouse.p[0].toFixed(2) : '—'} · Z {mouse ? mouse.p[1].toFixed(2) : '—'}</span>
        <span>1 m = {Math.round(s)} px</span>
        <span>
          {colocando ? 'Clique para colocar · Shift+clique coloca vários · botão direito cancela'
            : desenhando ? (inicio ? 'Digite o comprimento + Enter · Shift = livre · clique no 1º ponto fecha · Esc/botão direito termina' : 'Clique para começar a parede')
            : ferramenta === 'arco' ? (!formaIni ? 'Parede curva: clique no começo' : !formaFim ? 'Clique no fim da parede' : 'Mexa o mouse para curvar e clique · Esc cancela')
            : CAIXA.has(ferramenta) && ferramenta !== 'retangulo' ? (formaIni ? 'Clique no canto oposto · ou digite 6x4 + Enter · arraste para outro lado para virar a forma' : 'Clique no 1º canto da forma')
            : ferramenta === 'retangulo' ? (formaIni ? 'Clique no canto oposto · ou digite 4x3 + Enter · Shift = livre · Esc cancela' : 'Clique no 1º canto do retângulo (as linhas tracejadas são guias de alinhamento)')
            : ferramenta === 'poligono' ? (formaIni ? `Clique para o tamanho (${lados} lados) · ou digite o raio + Enter · Shift = livre` : 'Clique no centro do polígono/círculo')
            : ferramenta === 'cota' ? (cotaIni ? 'Clique no 2º ponto da medida · Esc cancela' : 'Clique no 1º ponto da medida (gruda nas pontas e no meio das paredes)')
            : vaoTool ? (mouse?.abertura ? 'Clique para colocar na parede' : 'Passe o mouse em cima de uma parede')
            : grupo.length ? `${grupo.length} selecionados · arraste um deles para mover todos · Ctrl+C/V/D · M espelha · setas empurram · Delete apaga`
            : 'Arraste no vazio para selecionar · clique no cômodo para nome e piso · botão direito/meio arrasta a planta · roda = zoom · F enquadra'}
        </span>
      </div>
    </div>
  )
}
