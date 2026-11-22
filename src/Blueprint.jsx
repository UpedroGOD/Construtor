import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { dentro, igual, novoId } from './projeto'

const CEL_M = 0.5 // cada quadradinho da grade = 50 cm
const CEL_PX = 36

// tira pontos no meio de uma reta (ex.: 3 cliques numa linha viram 1 parede só)
function simplificar(pol) {
  return pol.filter((p, i) => {
    const a = pol[(i - 1 + pol.length) % pol.length], b = pol[(i + 1) % pol.length]
    return Math.abs((p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0])) > 1e-9
  })
}

const Icone = {
  lapis: <path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  seta: <path d="M4 12h15M13 6l6 6-6 6" />,
  lixo: <path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" />,
  vassoura: <path d="M4 7h9M7 7V4h3v3M5.5 7l1 13h5M14 21l7-12M17.5 9.5l-5 8.5M12 18l-2 3M15 19l-1 2" />,
}
const Botao = ({ icone, ativo, ...p }) => (
  <button className={`bp-botao${ativo ? ' ativo' : ''}`} {...p}>
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{Icone[icone]}</svg>
  </button>
)

export default function Blueprint({ salas, mudar, aoConfirmar, sair }) {
  const svgRef = useRef()
  const [tam, setTam] = useState({ w: 1000, h: 700 })
  const [comodos, setComodos] = useState(() => salas.map((s) => ({ id: s.id, poligono: s.poligono, paredes: s.paredes })))
  const [traco, setTraco] = useState([]) // pontos do cômodo sendo desenhado
  const [hover, setHover] = useState(null)
  const [lapis, setLapis] = useState(true)
  const [sel, setSel] = useState(null)
  const apertado = useRef(false)

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setTam({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(svgRef.current)
    return () => ro.disconnect()
  }, [])

  // origem do mundo no meio da tela, alinhada com a grade
  const ox = Math.round(tam.w / 2 / CEL_PX) * CEL_PX, oy = Math.round(tam.h / 2 / CEL_PX) * CEL_PX
  const tela = ([x, z]) => [ox + (x / CEL_M) * CEL_PX, oy + (z / CEL_M) * CEL_PX]
  const mundo = (e) => {
    const b = svgRef.current.getBoundingClientRect()
    return [((e.clientX - b.left - ox) / CEL_PX) * CEL_M, ((e.clientY - b.top - oy) / CEL_PX) * CEL_M]
  }
  const naGrade = ([x, z]) => [Math.round(x / CEL_M) * CEL_M, Math.round(z / CEL_M) * CEL_M]
  // parede só reta: trava no eixo que mais andou desde o último ponto
  const travar = (p) => {
    const u = traco.at(-1)
    if (!u) return p
    return Math.abs(p[0] - u[0]) >= Math.abs(p[1] - u[1]) ? [p[0], u[1]] : [u[0], p[1]]
  }
  const alvo = (e) => travar(naGrade(mundo(e)))

  const adicionar = (p) => {
    const u = traco.at(-1)
    if (!u) return setTraco([p])
    if (igual(p, u)) return
    if (traco.length >= 3 && igual(p, traco[0])) { // voltou ao 1º ponto: fecha o cômodo
      const pol = simplificar(traco)
      if (pol.length >= 3) setComodos((c) => [...c, { id: novoId(), poligono: pol }])
      return setTraco([])
    }
    setTraco((t) => [...t, p])
  }

  const down = (e) => {
    if (e.button !== 0) return
    svgRef.current.setPointerCapture(e.pointerId)
    if (!lapis) {
      const m = mundo(e)
      setSel(comodos.findLast((c) => dentro(c.poligono, m))?.id ?? null)
      return
    }
    apertado.current = true
    adicionar(alvo(e))
  }
  const up = (e) => {
    if (!apertado.current) return
    apertado.current = false
    const p = alvo(e)
    if (traco.length && !igual(p, traco.at(-1))) adicionar(p) // clicou, arrastou e soltou em outra bolinha
  }

  const apagarSel = () => { setComodos((c) => c.filter((x) => x.id !== sel)); setSel(null) }
  const limpar = () => { if (confirm('Limpar a planta inteira?')) { setComodos([]); setTraco([]); setSel(null) } }

  const confirmar = () => {
    if (!comodos.length) return
    const originais = new Set(salas.flatMap((s) => s.paredes))
    const mantidas = new Set(comodos.flatMap((c) => c.paredes || []))
    const novas = comodos.filter((c) => !c.paredes).flatMap((c) =>
      c.poligono.map((a, i) => ({ id: novoId(), a, b: c.poligono[(i + 1) % c.poligono.length] })))
    mudar((p) => {
      const fora = (id) => originais.has(id) && !mantidas.has(id) // cômodo apagado aqui sai do projeto
      return { ...p, paredes: [...p.paredes.filter((w) => !fora(w.id)), ...novas], aberturas: p.aberturas.filter((ab) => !fora(ab.parede)) }
    })
    aoConfirmar(comodos.at(-1).poligono[0]) // abre no 3D o último cômodo desenhado
  }

  useEffect(() => {
    const tecla = (e) => {
      if (e.key === 'Escape') setTraco([])
      if (e.key === 'Backspace') setTraco((t) => t.slice(0, -1))
      if (e.key === 'Delete' && sel) apagarSel()
      if (e.key === 'Enter') confirmar()
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  const pts = (pol) => pol.map((p) => tela(p).join(',')).join(' ')
  const medidas = (pol, fechado) => pol.slice(0, fechado ? pol.length : -1).map((a, i) => {
    const b = pol[(i + 1) % pol.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const [x, y] = tela([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])
    const vertical = a[0] === b[0]
    return <text key={i} x={x + (vertical ? 10 : 0)} y={y + (vertical ? 4 : -10)} className="bp-medida" textAnchor={vertical ? 'start' : 'middle'}>{len.toFixed(1)} m</text>
  })
  const previa = lapis && hover && traco.length ? [...traco, hover] : traco

  return (
    <div className="bp-mesa">
      <Decoracao />
      <div className="bp-papel">
        <h1 className="bp-titulo">BLUEPRINT MODE</h1>
        <svg ref={svgRef} className="bp-svg" onPointerDown={down} onPointerUp={up}
          onPointerMove={(e) => setHover(alvo(e))} onPointerLeave={() => setHover(null)} onContextMenu={(e) => { e.preventDefault(); setTraco((t) => t.slice(0, -1)) }}
          style={{ cursor: lapis ? 'crosshair' : 'pointer' }}>
          <defs>
            <pattern id="bp-grade" width={CEL_PX} height={CEL_PX} patternUnits="userSpaceOnUse" x={ox % CEL_PX} y={oy % CEL_PX}>
              <path d={`M${CEL_PX} 0H0V${CEL_PX}`} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
              <circle cx="0" cy="0" r="2.2" fill="rgba(255,255,255,.75)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bp-grade)" />

          {comodos.map((c) => (
            <g key={c.id}>
              <polygon points={pts(c.poligono)} className={`bp-comodo${sel === c.id ? ' sel' : ''}`} />
              {medidas(c.poligono, true)}
            </g>
          ))}

          {previa.length > 1 && <polyline points={pts(previa)} className="bp-traco" />}
          {previa.length > 1 && medidas(previa, false)}
          {traco.map((p, i) => { const [x, y] = tela(p); return <circle key={i} cx={x} cy={y} r={i === 0 ? 7 : 5} className={i === 0 ? 'bp-inicio' : 'bp-ponto'} /> })}
          {lapis && hover && (() => { const [x, y] = tela(hover); return <circle cx={x} cy={y} r="9" className="bp-mira" /> })()}
        </svg>

        <div className="bp-barra esquerda">
          <Botao icone="lapis" ativo={lapis} title="Desenhar" onClick={() => { setLapis(!lapis); setSel(null) }} />
          <Botao icone="x" title="Cancelar traço (Esc)" onClick={() => setTraco([])} disabled={!traco.length} />
          <Botao icone="seta" title="Confirmar e ir para o 3D (Enter)" onClick={confirmar} disabled={!comodos.length} className="bp-botao confirmar" />
        </div>
        <div className="bp-barra direita">
          <Botao icone="lixo" title="Apagar cômodo selecionado" onClick={apagarSel} disabled={!sel} />
          <Botao icone="vassoura" title="Limpar tudo" onClick={limpar} disabled={!comodos.length && !traco.length} />
        </div>
        <button className="bp-sair" onClick={sair}>Sair ✕</button>
        <p className="bp-dica">
          {lapis
            ? traco.length ? 'Clique na próxima bolinha · volte no 1º ponto para fechar · botão direito desfaz o ponto' : 'Clique numa bolinha para começar o cômodo'
            : 'Clique num cômodo para selecionar'}
        </p>
      </div>
    </div>
  )
}

// Só enfeite em volta do papel: caneca, mancha de café, lápis e contas rabiscadas
function Decoracao() {
  return (
    <svg className="bp-deco" aria-hidden="true">
      <g transform="translate(70 90)">
        <circle r="34" fill="none" stroke="rgba(110,70,30,.25)" strokeWidth="5" transform="translate(60 40)" />
        <circle r="30" fill="#f4efe6" stroke="#d8cfc1" strokeWidth="3" />
        <circle r="22" fill="#5a3a22" />
        <circle r="22" fill="none" stroke="#7a5034" strokeWidth="2" />
        <path d="M28 -10 q22 10 0 22" fill="none" stroke="#f4efe6" strokeWidth="8" strokeLinecap="round" />
      </g>
      <g transform="translate(40 330) rotate(-35)">
        <rect width="150" height="12" rx="2" fill="#f2c14e" />
        <rect x="150" width="14" height="12" fill="#e7a3a3" />
        <path d="M0 0 L-22 6 L0 12z" fill="#e8d4b0" />
        <path d="M-15 4 L-22 6 L-15 8z" fill="#333" />
      </g>
      <g className="bp-contas" transform="translate(30 520)">
        <text>3,5 × 4 = 14 m²</text>
        <text y="26">2,7 + 0,15 = 2,85</text>
        <text y="52">porta 0,80?</text>
        <path d="M0 64 q40 -6 90 2" fill="none" stroke="#3b3b3b" strokeWidth="1.5" />
      </g>
      <circle cx="96%" cy="88%" r="26" fill="none" stroke="rgba(110,70,30,.22)" strokeWidth="4" />
      <circle cx="95%" cy="87%" r="10" fill="rgba(110,70,30,.12)" />
    </svg>
  )
}
