import { useState } from 'react'
import { CATALOGO, CATEGORIAS } from './catalogo'
import { Miniatura } from './desenhos'
import { PRONTOS } from './comodosProntos'

const sem = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Catálogo de móveis por categoria, com busca. horizontal = faixa de baixo do Modo Sala
export function Catalogo({ colocando, setColocando, horizontal }) {
  const [cat, setCat] = useState(CATEGORIAS[0].id)
  const [busca, setBusca] = useState('')
  const termo = sem(busca.trim())
  const lista = CATALOGO.filter((c) => !c.obra && (termo ? sem(c.nome).includes(termo) : c.cat === cat))

  return (
    <div className={`cat${horizontal ? ' horizontal' : ''}`}>
      <div className="cat-topo">
        <input className="cat-busca" type="search" placeholder={`Buscar em ${CATALOGO.length - 1} itens…`} value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div className="cat-abas">
          {CATEGORIAS.map((k) => (
            <button key={k.id} className={!termo && cat === k.id ? 'ativo' : ''} title={k.nome} onClick={() => { setCat(k.id); setBusca('') }}>
              <span>{k.icone}</span>{horizontal ? '' : ' ' + k.nome}
            </button>
          ))}
        </div>
      </div>
      <div className="cat-itens">
        {lista.map((c) => (
          <button key={c.tipo} className={`cat-item${colocando === c.tipo ? ' ativo' : ''}`} onClick={() => setColocando(colocando === c.tipo ? null : c.tipo)}
            title={`${c.nome} · ${c.l} × ${c.p} × ${c.a} m${c.y ? ` · a ${c.y} m do chão` : ''}`}>
            <Miniatura c={c} />
            <span className="cat-nome">{c.nome}</span>
            {!horizontal && <small>{c.l} × {c.p} × ${c.a} m</small>}
          </button>
        ))}
        {!lista.length && <p className="ajuda">Nada encontrado.</p>}
      </div>
    </div>
  )
}

export default Catalogo

// Cômodos prontos para colocar no projeto
export function ComodosProntos({ onColocar }) {
  const [busca, setBusca] = useState('')
  const termo = sem(busca.trim())
  const lista = Object.entries(PRONTOS).filter(([_, c]) => termo ? sem(c.nome).includes(termo) : true)

  return (
    <div className="comodos-prontos">
      <div className="cat-topo">
        <input className="cat-busca" type="search" placeholder={`Buscar cômodo pronto…`} value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>
      <div className="cat-itens">
        {lista.map(([chave, c]) => (
          <button key={chave} className="cat-item" onClick={() => onColocar(chave, c)}
            title={`${c.nome} · ${c.w} × ${c.h} m`}>
            <div className="miniatura-comodo">
              <svg viewBox="0 0 100 100" width="56" height="56" style={{ border: '1px solid #d1d5db', borderRadius: 4 }}>
                <rect x="5" y="5" width={90} height={90} fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
                {/* Porta */}
                <rect x="45" y="5" width="10" height="14" fill="#fff" stroke="#374151" strokeWidth="1" />
                {/* Janela */}
                <rect x="5" y="45" width="20" height="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
                {/* Móveis indicativos */}
                <rect x="15" y="15" width="12" height="20" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                <rect x="73" y="65" width="12" height="20" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
              </svg>
              <div className="comodo-info">
                <div className="comodo-nome">{c.nome}</div>
                <div className="comodo-medida">{c.w} × {c.h} m</div>
              </div>
            </div>
          </button>
        ))}
        {!lista.length && <p className="ajuda">Nada encontrado.</p>}
      </div>
    </div>
  )
}
