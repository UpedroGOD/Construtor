// Importar e exportar: PDF (folha A3 com carimbo), SVG, PNG, DXF (AutoCAD) e leitura de DXF.
import { renderToStaticMarkup } from 'react-dom/server'
import { PISOS, medidas, dimsItem } from './catalogo'
import { ESPESSURA, dist, prender, novoId, fixar, salas as acharSalas, paredesInternas } from './projeto'
import { CotaCAD, Abertura } from './Planta2D'
import { Desenho } from './desenhos'

const E = ESPESSURA
const ESCALAS = [20, 25, 50, 75, 100, 125, 200, 250, 500, 1000]
const A3 = { w: 420, h: 297, margem: 10, carimbo: 60 } // mm; carimbo = altura reservada embaixo

export function baixar(nome, conteudo, tipo) {
  const a = document.createElement('a')
  a.href = conteudo instanceof Blob ? URL.createObjectURL(conteudo) : URL.createObjectURL(new Blob([conteudo], { type: tipo }))
  a.download = nome
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}

export const nomeArquivo = (p) => (p.nome || 'projeto').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w-]+/g, '_')

const ladoFora = (w, salaDe) => {
  const sa = salaDe[w.id]
  if (!sa) return 1
  const L = dist(w.a, w.b), nx = -(w.b[1] - w.a[1]) / L, nz = (w.b[0] - w.a[0]) / L
  return ((w.a[0] + w.b[0]) / 2 - sa.centro[0]) * nx + ((w.a[1] + w.b[1]) / 2 - sa.centro[1]) * nz >= 0 ? 1 : -1
}

function limites(p) {
  const pts = [...p.paredes.flatMap((w) => [w.a, w.b]), ...p.itens.map((i) => [i.x, i.z]), ...(p.cotas || []).flatMap((k) => [k.a, k.b])]
  if (!pts.length) return null
  const xs = pts.map((q) => q[0]), zs = pts.map((q) => q[1])
  const m = 1.2 // folga para as cotas de fora
  return { x: Math.min(...xs) - m, z: Math.min(...zs) - m, w: Math.max(...xs) - Math.min(...xs) + 2 * m, h: Math.max(...zs) - Math.min(...zs) + 2 * m }
}

// menor escala padrão em que o desenho cabe na área útil da folha A3
export function escalaA3(p) {
  const b = limites(p)
  if (!b) return 50
  const uw = A3.w - 2 * A3.margem, uh = A3.h - 2 * A3.margem - A3.carimbo
  return ESCALAS.find((e) => (b.w * 1000) / e <= uw && (b.h * 1000) / e <= uh) || 1000
}

const ESTILO = `
.parede{stroke:#111} .hach-fundo{fill:#fff} .hach-linha{stroke:#111;stroke-opacity:.55}
.abertura{stroke:#111} .abertura .vao{stroke:#fff}
.movel{stroke:#444} .cad rect,.cad ellipse,.cad circle,.cad path{fill:none}
.cota-cad{stroke:#1a4fa0} .cota{fill:#1a4fa0;font-family:Consolas,monospace;stroke:none}
.rotulo{fill:#444;stroke:none;font-family:Arial,sans-serif} .rotulo-sala text{fill:#111;stroke:none;font-family:Arial,sans-serif}`

// Planta inteira como SVG em metros. s = "pixels" por metro só para a grossura de traço e tamanho de texto
function Folha({ p, s }) {
  const b = limites(p) || { x: -5, z: -5, w: 10, h: 10 }
  const salas = acharSalas(p.paredes)
  const salaDe = {}
  for (const sa of salas) for (const id of sa.paredes) salaDe[id] ||= sa
  const internas = paredesInternas(p.paredes, salas)
  const porId = Object.fromEntries(p.paredes.map((w) => [w.id, w]))
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`${b.x} ${b.z} ${b.w} ${b.h}`}>
      <style>{ESTILO}</style>
      <defs>
        <pattern id="hachura" width={0.1} height={0.1} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={0.1} height={0.1} className="hach-fundo" />
          <line x1={0} y1={0} x2={0} y2={0.1} className="hach-linha" strokeWidth={1 / s} />
        </pattern>
      </defs>
      <rect x={b.x} y={b.z} width={b.w} height={b.h} fill="#fff" />
      {p.itens.map((i) => {
        const c = dimsItem(i)
        if (!c) return null
        return (
          <g key={i.id} transform={`translate(${i.x} ${i.z}) rotate(${(-i.rot * 180) / Math.PI})`} className="movel">
            <g className="cad"><Desenho c={c} /></g>
            <text className="rotulo" fontSize={8 / s} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${(i.rot * 180) / Math.PI})`}>{c.nome}</text>
          </g>
        )
      })}
      {p.paredes.map((w) => <line key={'c' + w.id} x1={w.a[0]} y1={w.a[1]} x2={w.b[0]} y2={w.b[1]} className="parede" strokeWidth={w.esp ?? E} strokeLinecap="square" />)}
      {p.paredes.map((w) => <line key={'h' + w.id} x1={w.a[0]} y1={w.a[1]} x2={w.b[0]} y2={w.b[1]} style={{ stroke: 'url(#hachura)' }} strokeWidth={Math.max(0, (w.esp ?? E) - 2 / s)} strokeLinecap="square" />)}
      {p.aberturas.map((ab) => porId[ab.parede] && <Abertura key={ab.id} ab={ab} w={porId[ab.parede]} s={s} />)}
      {p.paredes.map((w) => {
        if (internas.has(w.id)) return null
        const sg = ladoFora(w, salaDe), e2 = (w.esp ?? E) / 2
        return <CotaCAD key={w.id} a={w.a} b={w.b} off={sg * (e2 + 0.45)} ini={sg * (e2 + 0.06)} s={s} />
      })}
      {(p.cotas || []).map((k) => <CotaCAD key={k.id} a={k.a} b={k.b} s={s} />)}
      {salas.map((sa, i) => (
        <g key={sa.id} className="rotulo-sala" transform={`translate(${sa.centro[0]} ${sa.centro[1]})`}>
          <text fontSize={11 / s} textAnchor="middle" fontWeight="600">{(p.comodos?.[sa.id]?.nome || `AMBIENTE ${i + 1}`).toUpperCase()}</text>
          <text y={14 / s} fontSize={9 / s} textAnchor="middle">A = {sa.area.toFixed(2).replace('.', ',')} m²{PISOS[p.comodos?.[sa.id]?.piso] ? ` · ${PISOS[p.comodos[sa.id].piso].nome}` : ''}</text>
        </g>
      ))}
    </svg>
  )
}

// SVG no tamanho real de papel (mm) para a escala dada
export function svgPlanta(p, escala = escalaA3(p)) {
  const b = limites(p) || { w: 10, h: 10 }
  const s = 4000 / escala // 1 "px" de traço = 0,25 mm no papel
  return renderToStaticMarkup(<Folha p={p} s={s} />)
    .replace('<svg ', `<svg width="${((b.w * 1000) / escala).toFixed(1)}mm" height="${((b.h * 1000) / escala).toFixed(1)}mm" `)
}

export function exportarSVG(p) {
  baixar(`${nomeArquivo(p)}.svg`, '<?xml version="1.0" encoding="UTF-8"?>\n' + svgPlanta(p), 'image/svg+xml')
}

export function exportarPNG(p) {
  const b = limites(p)
  if (!b) return alert('Desenhe alguma coisa antes de exportar.')
  const pxm = Math.min(200, 6000 / Math.max(b.w, b.h)) // até ~6000 px no lado maior
  const svg = renderToStaticMarkup(<Folha p={p} s={pxm / 1.5} />)
    .replace('<svg ', `<svg width="${Math.round(b.w * pxm)}" height="${Math.round(b.h * pxm)}" `)
  const img = new Image()
  img.onload = () => {
    const cv = document.createElement('canvas')
    cv.width = Math.round(b.w * pxm)
    cv.height = Math.round(b.h * pxm)
    const g = cv.getContext('2d')
    g.fillStyle = '#fff'
    g.fillRect(0, 0, cv.width, cv.height)
    g.drawImage(img, 0, 0)
    cv.toBlob((blob) => baixar(`${nomeArquivo(p)}.png`, blob))
  }
  img.onerror = () => alert('Não consegui gerar a imagem.')
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}

// PDF: abre a folha A3 deitada com carimbo e chama a impressão do navegador ("Salvar como PDF")
export function exportarPDF(p) {
  if (!limites(p)) return alert('Desenhe alguma coisa antes de exportar.')
  const escala = escalaA3(p)
  const area = acharSalas(p.paredes).reduce((t, sa) => t + sa.area, 0)
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(p.nome || 'Planta')}</title><style>
@page{size:A3 landscape;margin:0}
html,body{margin:0;background:#fff;font-family:Arial,sans-serif;color:#111}
.folha{width:${A3.w}mm;height:${A3.h}mm;box-sizing:border-box;padding:${A3.margem}mm;display:flex;flex-direction:column;border:0}
.desenho{flex:1;display:flex;align-items:center;justify-content:center;border:0.5mm solid #111;margin-bottom:3mm}
.carimbo{height:${A3.carimbo - 13}mm;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;border:0.5mm solid #111}
.carimbo div{border-left:0.3mm solid #111;padding:2mm 3mm;display:flex;flex-direction:column;gap:1mm}
.carimbo div:first-child{border-left:0}
.carimbo small{font-size:7pt;text-transform:uppercase;letter-spacing:.08em;color:#555}
.carimbo b{font-size:13pt}
</style></head><body><div class="folha">
<div class="desenho">${svgPlanta(p, escala)}</div>
<div class="carimbo">
<div><small>Projeto</small><b>${esc(p.nome || 'Sem nome')}</b><small>Conteúdo</small><span>PLANTA BAIXA</span></div>
<div><small>Escala</small><b>1:${escala}</b><small>Unidade</small><span>metros</span></div>
<div><small>Área dos ambientes</small><b>${area.toFixed(2).replace('.', ',')} m²</b></div>
<div><small>Data</small><b>${new Date().toLocaleDateString('pt-BR')}</b><small>Folha</small><span>A3 · 01/01</span></div>
</div></div>
<script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`
  const w = window.open('', '_blank')
  if (!w) return alert('O navegador bloqueou a janela. Libere pop-ups para este site e tente de novo.')
  w.document.write(html)
  w.document.close()
}

// ---------------- DXF (R12, ASCII: abre em qualquer versão do AutoCAD) ----------------
// Nosso plano usa z para baixo; no DXF o Y é para cima, então Y = -z.
const CAMADAS_DXF = [['EIXO_PAREDES', 8], ['PAREDES', 7], ['PORTAS', 3], ['JANELAS', 4], ['MOVEIS', 9], ['COTAS', 5], ['TEXTOS', 2]]

export function gerarDXF(p) {
  const out = []
  const g = (...pares) => { for (let i = 0; i < pares.length; i += 2) out.push(pares[i], typeof pares[i + 1] === 'number' ? +pares[i + 1].toFixed(4) : pares[i + 1]) }
  const linha = (cam, a, b) => g(0, 'LINE', 8, cam, 10, a[0], 20, -a[1], 30, 0, 11, b[0], 21, -b[1], 31, 0)
  const texto = (cam, q, h, t, ang = 0) => g(0, 'TEXT', 8, cam, 10, q[0], 20, -q[1], 30, 0, 40, h, 1, t, 50, ang, 72, 1, 73, 2, 11, q[0], 21, -q[1], 31, 0)
  const angDXF = (v) => (Math.atan2(-v[1], v[0]) * 180) / Math.PI // ângulo no sistema do DXF (Y para cima)

  g(0, 'SECTION', 2, 'HEADER', 9, '$ACADVER', 1, 'AC1009', 9, '$INSUNITS', 70, 6, 0, 'ENDSEC')
  g(0, 'SECTION', 2, 'TABLES', 0, 'TABLE', 2, 'LAYER', 70, CAMADAS_DXF.length)
  for (const [nome, cor] of CAMADAS_DXF) g(0, 'LAYER', 2, nome, 70, 0, 62, cor, 6, 'CONTINUOUS')
  g(0, 'ENDTAB', 0, 'ENDSEC', 0, 'SECTION', 2, 'ENTITIES')

  for (const w of p.paredes) {
    const L = dist(w.a, w.b)
    if (L < 0.01) continue
    const e = w.esp ?? E, u = [(w.b[0] - w.a[0]) / L, (w.b[1] - w.a[1]) / L], n = [-u[1], u[0]]
    const P = (t, y) => [w.a[0] + u[0] * t + n[0] * y, w.a[1] + u[1] * t + n[1] * y] // sistema da parede → planta
    linha('EIXO_PAREDES', w.a, w.b)
    // faces da parede, cortadas nos vãos de porta/janela
    const vaos = p.aberturas.filter((ab) => ab.parede === w.id).map((ab) => {
      const d = medidas(ab), t = prender(ab.t, d.l, L)
      return { ...ab, l: d.l, t0: t - d.l / 2, t1: t + d.l / 2 }
    }).filter((v) => v.l <= L).sort((x, y) => x.t0 - y.t0)
    let t = -e / 2
    for (const v of [...vaos, { t0: L + e / 2, t1: L + e / 2 }]) {
      if (v.t0 > t) { linha('PAREDES', P(t, -e / 2), P(v.t0, -e / 2)); linha('PAREDES', P(t, e / 2), P(v.t0, e / 2)) }
      if (v.id) { linha('PAREDES', P(v.t0, -e / 2), P(v.t0, e / 2)); linha('PAREDES', P(v.t1, -e / 2), P(v.t1, e / 2)) }
      t = Math.max(t, v.t1)
    }
    linha('PAREDES', P(-e / 2, -e / 2), P(-e / 2, e / 2))
    linha('PAREDES', P(L + e / 2, -e / 2), P(L + e / 2, e / 2))
    for (const v of vaos) {
      if (v.tipo === 'porta') {
        const lado = v.lado || 1, H = P(v.t0, (lado * e) / 2), folha = P(v.t0, lado * (e / 2 + v.l)), fim = P(v.t1, (lado * e) / 2)
        linha('PORTAS', H, folha)
        let a0 = angDXF([fim[0] - H[0], fim[1] - H[1]]), a1 = angDXF([folha[0] - H[0], folha[1] - H[1]])
        if ((((a1 - a0) % 360) + 360) % 360 > 180) [a0, a1] = [a1, a0] // arco do DXF corre no sentido anti-horário
        g(0, 'ARC', 8, 'PORTAS', 10, H[0], 20, -H[1], 30, 0, 40, v.l, 50, a0, 51, a1)
      } else {
        for (const y of [-e / 2, 0, e / 2]) linha('JANELAS', P(v.t0, y), P(v.t1, y))
      }
    }
  }

  for (const i of p.itens) {
    const c = dimsItem(i)
    if (!c) continue
    const co = Math.cos(-i.rot), si = Math.sin(-i.rot)
    const P = (x, y) => [i.x + x * co - y * si, i.z + x * si + y * co]
    const q = [P(-c.l / 2, -c.p / 2), P(c.l / 2, -c.p / 2), P(c.l / 2, c.p / 2), P(-c.l / 2, c.p / 2)]
    q.forEach((a, k) => linha('MOVEIS', a, q[(k + 1) % 4]))
    linha('MOVEIS', P(-c.l / 2, c.p / 2 - Math.min(0.05, c.p / 4)), P(c.l / 2, c.p / 2 - Math.min(0.05, c.p / 4))) // frente
    texto('MOVEIS', [i.x, i.z], 0.08, c.nome)
  }

  const salas = acharSalas(p.paredes)
  const salaDe = {}
  for (const sa of salas) for (const id of sa.paredes) salaDe[id] ||= sa
  const internas = paredesInternas(p.paredes, salas)
  const cota = (a, b, off, ini) => {
    const L = dist(a, b)
    if (L < 0.01) return
    const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [-u[1], u[0]], sg = Math.sign(off) || 1
    const A = [a[0] + n[0] * off, a[1] + n[1] * off], B = [b[0] + n[0] * off, b[1] + n[1] * off]
    if (off) for (const q of [a, b]) linha('COTAS', [q[0] + n[0] * ini, q[1] + n[1] * ini], [q[0] + n[0] * (off + sg * 0.05), q[1] + n[1] * (off + sg * 0.05)])
    linha('COTAS', A, B)
    for (const q of [A, B]) linha('COTAS', [q[0] - (u[0] - n[0]) * 0.05, q[1] - (u[1] - n[1]) * 0.05], [q[0] + (u[0] - n[0]) * 0.05, q[1] + (u[1] - n[1]) * 0.05])
    let ang = angDXF(u)
    if (ang > 90) ang -= 180
    if (ang <= -90) ang += 180
    const r = (ang * Math.PI) / 180 // texto um pouco acima da linha de cota
    texto('COTAS', [(A[0] + B[0]) / 2 - Math.sin(r) * 0.08, (A[1] + B[1]) / 2 - Math.cos(r) * 0.08], 0.1, L.toFixed(2), ang)
  }
  for (const w of p.paredes) {
    if (internas.has(w.id)) continue
    const sg = ladoFora(w, salaDe), e2 = (w.esp ?? E) / 2
    cota(w.a, w.b, sg * (e2 + 0.45), sg * (e2 + 0.06))
  }
  for (const k of p.cotas || []) cota(k.a, k.b, 0, 0)
  salas.forEach((sa, k) => {
    texto('TEXTOS', sa.centro, 0.15, (p.comodos?.[sa.id]?.nome || `AMBIENTE ${k + 1}`).toUpperCase())
    texto('TEXTOS', [sa.centro[0], sa.centro[1] + 0.25], 0.1, `A = ${sa.area.toFixed(2).replace('.', ',')} m2`)
  })
  g(0, 'ENDSEC', 0, 'EOF')
  return out.join('\r\n') + '\r\n'
}

export function exportarDXF(p) {
  baixar(`${nomeArquivo(p)}.dxf`, gerarDXF(p), 'application/dxf')
}

// Lê um DXF e devolve paredes. Prefere a camada EIXO_PAREDES (a que nós exportamos); senão, camadas com PAREDE/WALL no nome; senão, tudo.
export function lerDXF(txt) {
  const l = txt.split(/\r?\n/).map((s) => s.trim())
  const pares = []
  for (let i = 0; i + 1 < l.length; i += 2) pares.push([parseInt(l[i], 10), l[i + 1]])
  let fator = null
  const iu = pares.findIndex(([c, v]) => c === 9 && v === '$INSUNITS')
  if (iu >= 0) fator = { 1: 0.0254, 2: 0.3048, 4: 0.001, 5: 0.01, 6: 1 }[parseInt(pares[iu + 1]?.[1], 10)] ?? null

  // entidades: cada uma é a lista de pares entre um "0" e o próximo
  const ini = pares.findIndex(([c, v], k) => c === 2 && v === 'ENTITIES' && pares[k - 1]?.[1] === 'SECTION')
  if (ini < 0) throw new Error('Arquivo DXF sem seção ENTITIES.')
  const ents = []
  for (let k = ini + 1; k < pares.length; k++) {
    const [c, v] = pares[k]
    if (c === 0) { if (v === 'ENDSEC') break; ents.push({ tipo: v, cod: [] }) } else ents.at(-1)?.cod.push([c, v])
  }
  const num = (cod, c) => parseFloat(cod.find(([k]) => k === c)?.[1])
  const segs = [] // { cam, a, b } em unidades do arquivo, Y para cima
  for (let k = 0; k < ents.length; k++) {
    const { tipo, cod } = ents[k]
    const cam = (cod.find(([c]) => c === 8)?.[1] || '').toUpperCase()
    if (tipo === 'LINE') segs.push({ cam, a: [num(cod, 10), num(cod, 20)], b: [num(cod, 11), num(cod, 21)] })
    else if (tipo === 'LWPOLYLINE') {
      const xs = cod.filter(([c]) => c === 10).map(([, v]) => parseFloat(v)), ys = cod.filter(([c]) => c === 20).map(([, v]) => parseFloat(v))
      const pts = xs.map((x, j) => [x, ys[j]]), fechado = (num(cod, 70) || 0) & 1
      for (let j = 0; j + 1 < pts.length; j++) segs.push({ cam, a: pts[j], b: pts[j + 1] })
      if (fechado && pts.length > 2) segs.push({ cam, a: pts.at(-1), b: pts[0] })
    } else if (tipo === 'POLYLINE') {
      const fechado = (num(cod, 70) || 0) & 1, pts = []
      while (ents[k + 1]?.tipo === 'VERTEX') { k++; pts.push([num(ents[k].cod, 10), num(ents[k].cod, 20)]) }
      for (let j = 0; j + 1 < pts.length; j++) segs.push({ cam, a: pts[j], b: pts[j + 1] })
      if (fechado && pts.length > 2) segs.push({ cam, a: pts.at(-1), b: pts[0] })
    }
  }
  const validos = segs.filter((s) => [...s.a, ...s.b].every(Number.isFinite))
  if (!validos.length) throw new Error('Não achei linhas (LINE/POLYLINE) no DXF.')
  const camadas = [...new Set(validos.map((s) => s.cam))]
  const escolhida = camadas.includes('EIXO_PAREDES') ? ['EIXO_PAREDES'] : camadas.filter((c) => /PAREDE|WALL|ALVEN/.test(c))
  const usar = escolhida.length ? validos.filter((s) => escolhida.includes(s.cam)) : validos
  if (fator === null) { // sem unidade no arquivo: desenho com mais de 300 "unidades" quase sempre está em mm
    const ext = Math.max(...usar.flatMap((s) => [Math.abs(s.a[0]), Math.abs(s.a[1]), Math.abs(s.b[0]), Math.abs(s.b[1])]))
    fator = ext > 300 ? 0.001 : 1
  }
  let paredes = usar.map((s) => ({ a: [s.a[0] * fator, -s.a[1] * fator], b: [s.b[0] * fator, -s.b[1] * fator] })).filter((w) => dist(w.a, w.b) >= 0.05)
  let juntadas = 0
  if (!escolhida.includes('EIXO_PAREDES')) ({ paredes, juntadas } = juntarFaces(paredes)) // planta de outra pessoa: parede = 2 linhas
  paredes = soldar(paredes).map((w) => ({ ...w, id: novoId(), a: fixar(w.a), b: fixar(w.b) })).filter((w) => dist(w.a, w.b) >= 0.05)
  return { paredes, camadas: escolhida.length ? escolhida : camadas, fator, juntadas }
}

// Duas linhas paralelas a 4–60 cm uma da outra, cobrindo o mesmo trecho, são as duas faces de uma parede:
// vira uma parede só no meio, com a espessura igual à distância entre elas.
// shortcut: a face de fora inteira contra várias faces de dentro picadas casa só com uma; as outras sobram como parede fina.
export function juntarFaces(segs) {
  const usado = segs.map(() => false), paredes = []
  let juntadas = 0
  for (let i = 0; i < segs.length; i++) {
    if (usado[i]) continue
    const A = segs[i], Li = dist(A.a, A.b), u = [(A.b[0] - A.a[0]) / Li, (A.b[1] - A.a[1]) / Li], n = [-u[1], u[0]]
    let melhor = null
    for (let j = i + 1; j < segs.length; j++) {
      if (usado[j]) continue
      const B = segs[j], Lj = dist(B.a, B.b), v = [(B.b[0] - B.a[0]) / Lj, (B.b[1] - B.a[1]) / Lj]
      if (Math.abs(u[0] * v[1] - u[1] * v[0]) > 0.02) continue // não é paralela
      const rel = (q) => [(q[0] - A.a[0]) * u[0] + (q[1] - A.a[1]) * u[1], (q[0] - A.a[0]) * n[0] + (q[1] - A.a[1]) * n[1]]
      const [ta, da] = rel(B.a), [tb] = rel(B.b)
      if (Math.abs(da) < 0.04 || Math.abs(da) > 0.6) continue
      const t0 = Math.min(ta, tb), t1 = Math.max(ta, tb)
      if (Math.min(Li, t1) - Math.max(0, t0) < 0.5 * Math.min(Li, Lj)) continue // não cobrem o mesmo trecho
      if (!melhor || Math.abs(da) < Math.abs(melhor.d)) melhor = { j, d: da, t0, t1 }
    }
    usado[i] = true
    if (!melhor) { paredes.push({ a: A.a, b: A.b }); continue }
    usado[melhor.j] = true
    juntadas++
    // face de dentro é mais curta e a de fora mais comprida: a média dá o eixo de canto a canto
    const P = (t) => [A.a[0] + u[0] * t + (n[0] * melhor.d) / 2, A.a[1] + u[1] * t + (n[1] * melhor.d) / 2]
    paredes.push({ a: P(melhor.t0 / 2), b: P((Li + melhor.t1) / 2), esp: +Math.abs(melhor.d).toFixed(3) })
  }
  return { paredes, juntadas }
}

// gruda pontas quase iguais (até 3 cm) e puxa pontas soltas até a parede que está logo na frente (até 35 cm),
// para os cantos e os encontros em T fecharem e os cômodos serem reconhecidos
function soldar(paredes) {
  const reps = []
  const rep = (q) => reps.find((r) => dist(r, q) < 0.03) || (reps.push(q), q)
  let ws = paredes.map((w) => ({ ...w, a: rep(w.a), b: rep(w.b) }))
  const usos = new Map()
  for (const w of ws) for (const q of [w.a, w.b]) usos.set(q, (usos.get(q) || 0) + 1)
  const puxar = (q, eu) => {
    if (usos.get(q) > 1) return q
    for (const w of ws) {
      if (w === eu) continue
      const L = dist(w.a, w.b), ux = (w.b[0] - w.a[0]) / L, uz = (w.b[1] - w.a[1]) / L
      const t = (q[0] - w.a[0]) * ux + (q[1] - w.a[1]) * uz, d = Math.abs((q[0] - w.a[0]) * -uz + (q[1] - w.a[1]) * ux)
      if (t > 0.01 && t < L - 0.01 && d > 1e-4 && d < 0.35) return [w.a[0] + ux * t, w.a[1] + uz * t]
    }
    return q
  }
  ws = ws.map((w) => ({ ...w, a: puxar(w.a, w), b: puxar(w.b, w) }))
  return ws
}
