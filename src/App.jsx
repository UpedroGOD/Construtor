import { useEffect, useMemo, useRef, useState } from 'react'
import { porTipo, ABERTURAS, VARIANTES, PISOS, medidas, varianteDe, dimsItem } from './catalogo'
import { baixar, nomeArquivo, exportarPDF, exportarDXF, exportarSVG, exportarPNG, lerDXF } from './arquivos'
import Catalogo from './PainelMoveis'
import { ComodosProntos } from './PainelMoveis'
import { Icone } from './icones'
import { montar, PRONTOS } from './comodosProntos'
import {
  CHAVE, ALTURA_PAREDE, ESPESSURA, carregar, salas, dist, moverPontos, filtrarAndar, juntarAndar, nomeAndar, andarDe, LISTAS,
  moverAlvo, apagarAlvo, copiarAlvo, colarCopia, espelharAlvo, girarAlvo, alvoDaSala,
} from './projeto'
import ModoSala from './ModoSala'
import Planta2D from './Planta2D'
import Vista3D from './Vista3D'

// Campo de número que só grava ao apertar Enter ou sair do campo (digitar "3." no meio não estraga nada)
function Campo({ rotulo, valor, min, max, aoMudar, unidade = 'm', passo = 0.05 }) {
  const [texto, setTexto] = useState(null)
  const gravar = () => {
    const v = parseFloat(String(texto).replace(',', '.'))
    if (texto !== null && v >= min && v <= max) aoMudar(v)
    setTexto(null)
  }
  return (
    <label className="campo">
      <span>{rotulo}</span>
      <input type="number" step={passo} min={min} max={max} value={texto ?? +valor.toFixed(2)}
        onChange={(e) => setTexto(e.target.value)} onBlur={gravar} onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} />
      <small>{unidade}</small>
    </label>
  )
}

// preferências de tela (painel recolhido, seções abertas): só conveniência, pode falhar sem problema
function lerPref(k, padrao) { try { return JSON.parse(localStorage.getItem('construtor-' + k)) ?? padrao } catch { return padrao } }
function gravarPref(k, v) { try { localStorage.setItem('construtor-' + k, JSON.stringify(v)) } catch { /* sem storage */ } }

const FERRAMENTAS = [
  ['selecionar', 'Selecionar', 'V', 'Selecionar e mover (V). Arraste no vazio para pegar vários'],
  ['parede', 'Parede', 'P', 'Parede (P): clique ponto a ponto; digite o comprimento + Enter'],
  ['porta', 'Porta', 'O', 'Porta (O): passe em cima de uma parede e clique'],
  ['janela', 'Janela', 'J', 'Janela (J): passe em cima de uma parede e clique'],
  ['cota', 'Medir', 'C', 'Medir (C): clique em 2 pontos; a medida fica desenhada na planta'],
]
const FORMAS_LISTA = [
  ['retangulo', 'Retângulo', 'T', 'Retângulo (T): canto a canto, ou digite 4x3 + Enter'],
  ['formaL', 'Em L', '', 'Cômodo em L: canto a canto, ou digite 6x4 + Enter'],
  ['formaU', 'Em U', '', 'Cômodo em U: canto a canto'],
  ['formaT', 'Em T', '', 'Cômodo em T: canto a canto'],
  ['poligono', 'Polígono', 'G', 'Polígono/círculo (G): centro e tamanho'],
  ['elipse', 'Elipse', '', 'Elipse/oval: canto a canto'],
  ['arco', 'Curva', '', 'Parede curva: começo, fim e um 3º clique para curvar'],
]
const ICONE_DE = { cota: 'medir' }

function Secao({ id, titulo, icone, abertas, alternar, children }) {
  const aberta = abertas[id] !== false
  return (
    <section className={`secao${aberta ? ' aberta' : ''}`}>
      <button className="secao-topo" onClick={() => alternar(id)} aria-expanded={aberta}>
        <Icone nome={icone} tamanho={15} /><span>{titulo}</span><span className="chev"><Icone nome="seta" tamanho={14} /></span>
      </button>
      <div className="secao-corpo"><div className="secao-dentro">{children}</div></div>
    </section>
  )
}

export function Rotacao({ girar }) {
  const g = Math.PI / 180
  return (
    <div className="rotacao">
      <button onClick={() => girar(90 * g)} title="Girar 90° para a esquerda">⟲ 90°</button>
      <button onClick={() => girar(15 * g)} title="Girar 15° para a esquerda (E)">⟲ 15°</button>
      <button onClick={() => girar(-15 * g)} title="Girar 15° para a direita (Q)">⟳ 15°</button>
      <button onClick={() => girar(-90 * g)} title="Girar 90° para a direita">⟳ 90°</button>
    </div>
  )
}

export default function App() {
  const [estado, setEstado] = useState(() => ({ p: carregar(), passado: [], futuro: [] }))
  const todo = estado.p
  const [andar, setAndar] = useState(0)
  const projeto = useMemo(() => filtrarAndar(todo, andar), [todo, andar]) // tudo na tela trabalha só com o andar atual
  const [vista, setVista] = useState('2d')
  const [ferramenta, setFerramenta] = useState('parede')
  const [sel, setSel] = useState(null) // { tipo: 'item'|'parede'|'abertura'|'cota'|'sala', id }
  const [grupo, setGrupo] = useState([]) // seleção de vários (janela de seleção)
  const [colocando, setColocando] = useState(null)
  const [painelFechado, setPainelFechado] = useState(() => lerPref('painel-fechado', false))
  const alternarPainel = (v) => { setPainelFechado(v); gravarPref('painel-fechado', v) }
  const [abertas, setAbertas] = useState(() => lerPref('secoes', { construir: true, formas: true, editar: true, moveis: true, projeto: false, atalhos: false }))
  const alternarSecao = (id) => setAbertas((a) => { const n = { ...a, [id]: !a[id] }; gravarPref('secoes', n); return n })
  const [lados, setLados] = useState(8) // polígono: 4 = quadrado, 6 = hexágono, 24+ ≈ círculo
  const tema = 'escuro'
  const copia = useRef(null)
  const colagens = useRef(0)

  const [focoId, setFocoId] = useState(null)
  const [modoSala, setModoSala] = useState(false)
  const listaSalas = useMemo(() => salas(projeto.paredes), [projeto.paredes])
  const foco = (vista === '3d' && listaSalas.find((s) => s.id === focoId)) || null
  const alternarFoco = () => setFocoId(foco ? null : listaSalas[0]?.id ?? null)

  const numAndares = Math.max(todo.andares || 1, ...LISTAS.flatMap((k) => (todo[k] || []).map((x) => andarDe(x) + 1)))
  const abaixo = useMemo(() => (andar > 0 ? filtrarAndar(todo, andar - 1) : null), [todo, andar])
  const andaresAbaixo = useMemo(() => Array.from({ length: andar }, (_, k) => {
    const p = filtrarAndar(todo, k)
    return { k, p, salas: salas(p.paredes) }
  }), [todo, andar])

  useEffect(() => { try { localStorage.setItem(CHAVE, JSON.stringify(todo)) } catch { /* sem espaço/bloqueado: segue sem salvar */ } }, [todo])

  const mudarTodo = (f, gravar = true) =>
    setEstado((e) => ({ p: f(e.p), passado: gravar ? [...e.passado.slice(-99), e.p] : e.passado, futuro: gravar ? [] : e.futuro }))
  // as telas recebem só o andar atual; aqui o resultado volta para dentro do prédio inteiro
  const mudar = (f, gravar = true) => mudarTodo((t) => juntarAndar(t, f(filtrarAndar(t, andar)), andar), gravar)
  const marcar = () => setEstado((e) => ({ ...e, passado: [...e.passado.slice(-99), e.p], futuro: [] }))
  const desfazer = () => setEstado((e) => (e.passado.length ? { p: e.passado.at(-1), passado: e.passado.slice(0, -1), futuro: [e.p, ...e.futuro] } : e))
  const refazer = () => setEstado((e) => (e.futuro.length ? { p: e.futuro[0], passado: [...e.passado, e.p], futuro: e.futuro.slice(1) } : e))

  const limparSel = () => { setSel(null); setGrupo([]) }
  const salaSel = sel?.tipo === 'sala' ? listaSalas.find((x) => x.id === sel.id) : null
  // o que os comandos (mover, girar, copiar, apagar...) vão afetar; cômodo selecionado = paredes + o que tem dentro
  const alvo = grupo.length ? grupo : salaSel ? alvoDaSala(projeto, salaSel) : sel && sel.tipo !== 'sala' ? [sel] : []
  const focar = (id) => { setVista('3d'); setFocoId(id) }

  const apagar = () => {
    if (!alvo.length) return
    // apagar um cômodo não pode levar a parede que ele divide com o vizinho
    const divididas = salaSel ? new Set(listaSalas.filter((x) => x.id !== salaSel.id).flatMap((x) => x.paredes)) : new Set()
    mudar((p) => apagarAlvo(p, alvo.filter((a) => !(a.tipo === 'parede' && divididas.has(a.id)))))
    limparSel()
  }
  const copiar = () => { if (alvo.length) { copia.current = copiarAlvo(projeto, alvo); colagens.current = 0 } }
  const colar = () => {
    if (!copia.current) return
    const d = 0.5 * ++colagens.current // cada colagem um pouco mais para o lado, para não ficar em cima
    const r = colarCopia(projeto, copia.current, d, d) // ids gerados aqui fora, para o que fica selecionado bater com o que foi colado
    mudar(() => r.projeto)
    setSel(null)
    setGrupo(r.alvo)
  }
  const duplicar = () => { copiar(); colar() }
  const espelhar = (eixo) => alvo.length && mudar((p) => espelharAlvo(p, alvo, eixo))
  const mover = (dx, dz) => alvo.length && mudar((p) => moverAlvo(p, alvo, dx, dz))

  const girar = (delta) => grupo.length || salaSel ? mudar((p) => girarAlvo(p, alvo, delta)) : sel?.tipo === 'item' &&
    mudar((p) => ({ ...p, itens: p.itens.map((i) => (i.id === sel.id ? { ...i, rot: +(i.rot + delta).toFixed(5) } : i)) }))
  const definirAngulo = (graus) => sel?.tipo === 'item' &&
    mudar((p) => ({ ...p, itens: p.itens.map((i) => (i.id === sel.id ? { ...i, rot: (graus * Math.PI) / 180 } : i)) }))
  const mudarItem = (id, campos) => mudar((p) => ({ ...p, itens: p.itens.map((i) => (i.id === id ? { ...i, ...campos } : i)) }))
  const mudarAbertura = (id, f) => mudar((p) => ({ ...p, aberturas: p.aberturas.map((ab) => (ab.id === id ? { ...ab, ...f(ab) } : ab)) }))
  const mudarComodo = (id, campos) => mudar((p) => ({ ...p, comodos: { ...(p.comodos || {}), [id]: { ...(p.comodos || {})[id], ...campos } } }))

  const escolherFerramenta = (f) => { setFerramenta(f); setColocando(null); if (f !== 'selecionar') { limparSel(); setVista('2d') } }
  const abrirSala = () => { setModoSala(true); setFerramenta('parede'); setColocando(null); limparSel() }
  const trocarAndar = (n) => { setAndar(n); limparSel(); setFocoId(null) }

  useEffect(() => {
    const tecla = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return
      const k = e.key.toLowerCase()
      if (e.ctrlKey && k === 'z') { e.preventDefault(); return e.shiftKey ? refazer() : desfazer() }
      if (e.ctrlKey && k === 'y') { e.preventDefault(); return refazer() }
      if (e.ctrlKey && k === 'c') { e.preventDefault(); return copiar() }
      if (e.ctrlKey && k === 'v') { e.preventDefault(); return colar() }
      if (e.ctrlKey && k === 'd') { e.preventDefault(); return duplicar() }
      if (e.ctrlKey) return
      if (!modoSala && vista === '3d' && k === 'f') return alternarFoco()
      if (e.key === 'Tab' && !modoSala) { e.preventDefault(); return setVista((v) => (v === '2d' ? '3d' : '2d')) }
      if (e.key === 'Escape') { setColocando(null); limparSel(); setFocoId(null) }
      if (e.key === 'Delete') apagar()
      // setas empurram a seleção: 5 cm, ou 50 cm com Shift
      const seta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]
      if (seta && alvo.length) { e.preventDefault(); const d = e.shiftKey ? 0.5 : 0.05; return mover(seta[0] * d, seta[1] * d) }
      if (k === 'm' && alvo.length) return espelhar(e.shiftKey ? 'z' : 'x')
      if (k === 'v') escolherFerramenta('selecionar')
      if (k === 'p') escolherFerramenta('parede')
      if (k === 'o') escolherFerramenta('porta')
      if (k === 'j') escolherFerramenta('janela')
      if (k === 'c') escolherFerramenta('cota')
      if (k === 't') escolherFerramenta('retangulo')
      if (k === 'g') escolherFerramenta('poligono')
      if (k === 'r' && sel?.tipo === 'abertura') mudarAbertura(sel.id, (ab) => ({ lado: -(ab.lado || 1) }))
      // Q/E giram o móvel selecionado (E = esquerda); sem móvel selecionado, giram a câmera no 3D
      if (k === 'f' && vista === '2d' && salaSel && !modoSala) return focar(salaSel.id)
      if ((grupo.length || salaSel || sel?.tipo === 'item') && (k === 'e' || k === 'q')) girar(((k === 'e' ? 1 : -1) * Math.PI) / 12)
      if (k === 'r' && (grupo.length || salaSel || sel?.tipo === 'item')) girar(((e.shiftKey ? -1 : 1) * Math.PI) / 12)
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  const salvarJSON = () => baixar(`${nomeArquivo(todo)}.json`, JSON.stringify(todo, null, 2), 'application/json')

  // .json = projeto inteiro (substitui, com todos os andares); .dxf = paredes do AutoCAD (somam no andar atual)
  const abrir = async (e) => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    try {
      const txt = await f.text()
      if (/\.dxf$/i.test(f.name)) {
        const { paredes, camadas, fator, juntadas } = lerDXF(txt)
        if (!paredes.length) throw new Error('Nenhuma parede encontrada no DXF.')
        mudar((p) => ({ ...p, paredes: [...p.paredes, ...paredes] }))
        alert(`${paredes.length} paredes importadas da(s) camada(s): ${camadas.join(', ') || '(sem nome)'} para o ${nomeAndar(andar)}.${juntadas ? `\n${juntadas} paredes desenhadas com 2 linhas viraram 1 parede com a espessura certa.` : ''}\nUnidade usada: ${fator === 1 ? 'metros' : fator === 0.001 ? 'milímetros' : fator === 0.01 ? 'centímetros' : fator + ' m por unidade'}.`)
        return
      }
      const p = JSON.parse(txt)
      if (!Array.isArray(p.paredes) || !Array.isArray(p.itens)) throw new Error('Não é um projeto do Construtor.')
      const ponto = (q) => Array.isArray(q) && q.length === 2 && q.every(Number.isFinite)
      const andarOk = (x) => ({ ...x, andar: Number.isInteger(x.andar) && x.andar >= 0 && x.andar < 200 ? x.andar : 0 })
      mudarTodo(() => ({
        nome: typeof p.nome === 'string' ? p.nome.slice(0, 120) : '',
        andares: Number.isInteger(p.andares) && p.andares > 0 && p.andares < 200 ? p.andares : 1,
        comodos: p.comodos && typeof p.comodos === 'object' ? p.comodos : {},
        paredes: p.paredes.filter((w) => w && ponto(w.a) && ponto(w.b)).map(andarOk),
        itens: p.itens.filter((i) => i && porTipo[i.tipo] && Number.isFinite(i.x) && Number.isFinite(i.z)).map((i) => andarOk({ ...i, rot: Number.isFinite(i.rot) ? i.rot : 0 })),
        aberturas: Array.isArray(p.aberturas) ? p.aberturas.filter((ab) => ab && ABERTURAS[ab.tipo] && Number.isFinite(ab.t)).map(andarOk) : [],
        cotas: Array.isArray(p.cotas) ? p.cotas.filter((k) => k && ponto(k.a) && ponto(k.b)).map(andarOk) : [],
      }))
      trocarAndar(0)
    } catch (err) {
      alert('Não consegui abrir o arquivo: ' + (err.message || 'formato inválido.'))
    }
  }

  // exporta o andar atual; o nome do andar vai junto no carimbo
  const paraExportar = () => ({ ...projeto, nome: `${todo.nome || 'Projeto'} — ${nomeAndar(andar)}` })

  const props = { projeto, mudar, marcar, ferramenta, sel, setSel, grupo, setGrupo, colocando, setColocando, tema, salas: listaSalas }

  return (
    <div className="app">
      <aside className={`painel${painelFechado ? ' fechado' : ''}`}>
        {painelFechado ? (
          <nav className="trilho" aria-label="Ferramentas">
            <button className="trilho-bt" onClick={() => alternarPainel(false)} title="Abrir painel"><Icone nome="painel" /></button>
            <span className="trilho-sep" />
            {[...FERRAMENTAS, ...FORMAS_LISTA.slice(0, 1)].map(([f, nome, tecla]) => (
              <button key={f} className={`trilho-bt${ferramenta === f && !colocando ? ' ativo' : ''}`} onClick={() => escolherFerramenta(f)} title={`${nome}${tecla ? ` (${tecla})` : ''}`}>
                <Icone nome={ICONE_DE[f] || f} />
              </button>
            ))}
            <span className="trilho-sep" />
            <button className="trilho-bt" onClick={desfazer} disabled={!estado.passado.length} title="Desfazer (Ctrl+Z)"><Icone nome="desfazer" /></button>
            <button className="trilho-bt" onClick={refazer} disabled={!estado.futuro.length} title="Refazer (Ctrl+Y)"><Icone nome="refazer" /></button>
            <button className="trilho-bt" onClick={apagar} disabled={!alvo.length} title="Apagar (Delete)"><Icone nome="lixo" /></button>
            <span className="trilho-sep" />
            <button className={`trilho-bt${vista === '2d' ? ' ativo' : ''}`} onClick={() => setVista('2d')} title="Planta"><Icone nome="planta" /></button>
            <button className={`trilho-bt${vista === '3d' ? ' ativo' : ''}`} onClick={() => setVista('3d')} title="3D"><Icone nome="cubo" /></button>
            <button className="trilho-bt" onClick={abrirSala} title="Sala"><Icone nome="sala" /></button>
          </nav>
        ) : (
        <div className="painel-rolagem">
        <header className="painel-topo">
          <span className="marca"><span className="marca-ponto" />Construtor</span>
          <button className="bt-icone" onClick={() => alternarPainel(true)} title="Recolher painel" aria-label="Recolher painel"><Icone nome="painel" /></button>
        </header>
        <div className="segmentado" role="tablist" aria-label="Vista">
          <button role="tab" aria-selected={vista === '2d'} className={vista === '2d' ? 'ativo' : ''} onClick={() => setVista('2d')}><Icone nome="planta" tamanho={15} />Planta</button>
          <button role="tab" aria-selected={vista === '3d'} className={vista === '3d' ? 'ativo' : ''} onClick={() => setVista('3d')}><Icone nome="cubo" tamanho={15} />3D</button>
          <button role="tab" aria-selected={false} onClick={abrirSala} title="Monta um cômodo na planta azul e decora em tela cheia"><Icone nome="sala" tamanho={15} />Sala</button>
        </div>
        <div className="andares">
          {Array.from({ length: numAndares }, (_, n) => (
            <button key={n} className={andar === n ? 'ativo' : ''} onClick={() => trocarAndar(n)}>{nomeAndar(n)}</button>
          ))}
          <button className="bt-icone" title="Novo andar em cima (já vem com o chão pronto)" aria-label="Novo andar" onClick={() => { mudarTodo((t) => ({ ...t, andares: numAndares + 1 })); trocarAndar(numAndares) }}><Icone nome="mais" tamanho={15} /></button>
        </div>

        <div className="barra-acoes">
          <button className="bt-icone" onClick={desfazer} disabled={!estado.passado.length} title="Desfazer (Ctrl+Z)" aria-label="Desfazer"><Icone nome="desfazer" /></button>
          <button className="bt-icone" onClick={refazer} disabled={!estado.futuro.length} title="Refazer (Ctrl+Y)" aria-label="Refazer"><Icone nome="refazer" /></button>
          <button className="bt-icone" onClick={apagar} disabled={!alvo.length} title="Apagar seleção (Delete)" aria-label="Apagar"><Icone nome="lixo" /></button>
        </div>

        <Secao id="construir" titulo="Construir" icone="parede" abertas={abertas} alternar={alternarSecao}>
          <div className="ferramentas">
            {FERRAMENTAS.map(([f, nome, tecla, dica]) => (
              <button key={f} className={`ferr${ferramenta === f && !colocando ? ' ativo' : ''}`} onClick={() => escolherFerramenta(f)} title={dica}>
                <Icone nome={ICONE_DE[f] || f} /><span>{nome}</span>{tecla && <kbd>{tecla}</kbd>}
              </button>
            ))}
          </div>
          {ferramenta === 'cota' && <p className="dica">Medir: clique em dois pontos. A medida fica desenhada na planta (é a "cota" do AutoCAD) e sai no PDF.</p>}
        </Secao>

        <Secao id="formas" titulo="Formas de cômodo" icone="retangulo" abertas={abertas} alternar={alternarSecao}>
          <div className="ferramentas formas">
            {FORMAS_LISTA.map(([f, nome, tecla, dica]) => (
              <button key={f} className={`ferr${ferramenta === f && !colocando ? ' ativo' : ''}`} onClick={() => escolherFerramenta(f)} title={dica}>
                <Icone nome={f} /><span>{nome}</span>{tecla && <kbd>{tecla}</kbd>}
              </button>
            ))}
          </div>
          {ferramenta === 'poligono' && (
            <div className="props">
              <Campo key={'lados' + lados} rotulo="Lados" valor={lados} min={3} max={64} passo={1} unidade="" aoMudar={(v) => setLados(Math.round(v))} />
              <div className="chips">{[[3, 'Triângulo'], [4, 'Quadrado'], [6, 'Hexágono'], [8, 'Octógono'], [32, 'Círculo']].map(([n, t]) => (
                <button key={n} className={lados === n ? 'ativo' : ''} onClick={() => setLados(n)}>{t}</button>))}</div>
            </div>
          )}
        </Secao>

        {(alvo.length > 0 || sel) && (
        <Secao id="editar" titulo={grupo.length ? `Seleção · ${grupo.length} itens` : salaSel ? 'Cômodo' : 'Selecionado'} icone="selecionar" abertas={abertas} alternar={alternarSecao}>
        {alvo.length > 0 && (
          <>
            {grupo.length > 0 && <Rotacao girar={girar} />}
            <div className="comandos">
              <button onClick={copiar} title="Ctrl+C">Copiar</button>
              <button onClick={colar} disabled={!copia.current} title="Ctrl+V">Colar</button>
              <button onClick={duplicar} title="Ctrl+D">Duplicar</button>
              <button onClick={() => espelhar('x')} title="M">Espelhar ↔</button>
              <button onClick={() => espelhar('z')} title="Shift+M">Espelhar ↕</button>
            </div>
            <div className="props">
              <Campo key={'mx' + alvo.length} rotulo="Mover X (→)" valor={0} min={-1000} max={1000} aoMudar={(v) => v && mover(v, 0)} />
              <Campo key={'mz' + alvo.length} rotulo="Mover Z (↓)" valor={0} min={-1000} max={1000} aoMudar={(v) => v && mover(0, v)} />
            </div>
          </>
        )}

        {sel?.tipo === 'item' && (() => {
          const it = projeto.itens.find((x) => x.id === sel.id)
          if (!it) return null
          const graus = ((Math.round((it.rot * 180) / Math.PI) % 360) + 360) % 360
          return (
            <>
              <h3>{porTipo[it.tipo].nome}</h3>
              <Rotacao girar={girar} />
              <div className="props">
                <Campo key={it.id + 'r'} rotulo="Ângulo" valor={graus} min={-360} max={360} passo={15} unidade="°" aoMudar={definirAngulo} />
                {[['l', 'Largura'], ['p', 'Profundidade'], ['a', 'Altura'], ['y', 'Altura do chão']].map(([k, rot]) => (
                  <Campo key={it.id + k + dimsItem(it)[k]} rotulo={rot} valor={dimsItem(it)[k]} min={k === 'y' ? 0 : 0.01} max={50} aoMudar={(v) => mudarItem(it.id, { [k]: v })} />
                ))}
                <label className="campo campo-largo">
                  <span>Cor</span>
                  <input type="color" value={dimsItem(it).cor} onChange={(e) => mudarItem(it.id, { pintura: e.target.value })} />
                </label>
              </div>
              {['l', 'p', 'a', 'y', 'pintura'].some((k) => it[k] !== undefined) && (
                <button onClick={() => mudarItem(it.id, { l: undefined, p: undefined, a: undefined, y: undefined, pintura: undefined })}>Voltar ao tamanho e cor do catálogo</button>
              )}
            </>
          )
        })()}

        {sel?.tipo === 'parede' && (() => {
          const w = projeto.paredes.find((x) => x.id === sel.id)
          if (!w) return null
          const len = dist(w.a, w.b)
          // muda o comprimento puxando a ponta "b" na mesma direção; paredes ligadas nela acompanham
          const comprimento = (n) => mudar((p) => moverPontos(p, [w.b], ((w.b[0] - w.a[0]) / len) * (n - len), ((w.b[1] - w.a[1]) / len) * (n - len)))
          const campo = (k, v) => mudar((p) => ({ ...p, paredes: p.paredes.map((x) => (x.id === w.id ? { ...x, [k]: v } : x)) }))
          return (
            <>
              <h3>Parede</h3>
              <div className="props">
                <Campo key={w.id + 'c'} rotulo="Comprimento" valor={len} min={0.1} max={100} aoMudar={comprimento} />
                <Campo key={w.id + 'a'} rotulo="Altura" valor={w.altura ?? ALTURA_PAREDE} min={0.1} max={20} aoMudar={(v) => campo('altura', v)} />
                <Campo key={w.id + 'e'} rotulo="Espessura" valor={w.esp ?? ESPESSURA} min={0.05} max={1} aoMudar={(v) => campo('esp', v)} />
              </div>
            </>
          )
        })()}

        {sel?.tipo === 'abertura' && (() => {
          const ab = projeto.aberturas.find((x) => x.id === sel.id)
          if (!ab) return null
          const m = medidas(ab)
          return (
            <>
              <h3>{ab.tipo === 'porta' ? 'Porta' : 'Janela'}</h3>
              <label className="campo campo-largo">
                <span>Tipo</span>
                <select value={varianteDe(ab)} onChange={(e) => mudarAbertura(ab.id, () => ({ variante: e.target.value, l: undefined, a: undefined, peitoril: undefined }))}>
                  {Object.entries(VARIANTES[ab.tipo]).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}
                </select>
              </label>
              <div className="props">
                <Campo key={ab.id + 'l' + m.l} rotulo="Largura" valor={m.l} min={0.3} max={8} aoMudar={(v) => mudarAbertura(ab.id, () => ({ l: v }))} />
                <Campo key={ab.id + 'a' + m.a} rotulo="Altura" valor={m.a} min={0.3} max={4} aoMudar={(v) => mudarAbertura(ab.id, () => ({ a: v }))} />
                {ab.tipo === 'janela' && <Campo key={ab.id + 'p' + m.peitoril} rotulo="Peitoril" valor={m.peitoril} min={0} max={3} aoMudar={(v) => mudarAbertura(ab.id, () => ({ peitoril: v }))} />}
              </div>
              {ab.tipo === 'porta' && <button onClick={() => mudarAbertura(ab.id, (x) => ({ lado: -(x.lado || 1) }))}>Virar lado de abrir (R)</button>}
            </>
          )
        })()}

        {sel?.tipo === 'sala' && (() => {
          const sa = listaSalas.find((x) => x.id === sel.id)
          if (!sa) return null
          const c = (projeto.comodos || {})[sa.id] || {}
          const i = listaSalas.indexOf(sa)
          return (
            <>
              <h3>Nome e piso</h3>
              <input className="cat-busca" placeholder={`AMBIENTE ${i + 1}`} defaultValue={c.nome || ''} key={sa.id + (c.nome || '')}
                onBlur={(e) => e.target.value !== (c.nome || '') && mudarComodo(sa.id, { nome: e.target.value.slice(0, 40) })}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} />
              <label className="campo campo-largo">
                <span>Piso</span>
                <select value={c.piso || ''} onChange={(e) => mudarComodo(sa.id, { piso: e.target.value || undefined })}>
                  <option value="">Padrão</option>
                  {Object.entries(PISOS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}
                </select>
              </label>
              <p className="ajuda">Área: {sa.area.toFixed(2).replace('.', ',')} m² · arraste dentro dele para mover · setas empurram · Q/E giram</p>
              <div className="grupo">
                <button className="ativo" onClick={() => focar(sa.id)} title="F">◎ Focar no 3D</button>
                <Rotacao girar={girar} />
                <button onClick={apagar} title="Delete — a parede dividida com o vizinho fica">Apagar cômodo</button>
              </div>
            </>
          )
        })()}

        </Secao>
        )}

        <Secao id="moveis" titulo="Móveis e objetos" icone="moveis" abertas={abertas} alternar={alternarSecao}>
          <Catalogo colocando={colocando} setColocando={setColocando} />
        </Secao>

        <Secao id="comodos-prontos" titulo="Cômodos prontos" icone="sala" abertas={abertas} alternar={alternarSecao}>
          <ComodosProntos onColocar={(chave, config) => {
            const colocado = montar(chave, 0, 0)
            mudar((p) => ({
              paredes: [...p.paredes, ...colocado.paredes],
              aberturas: [...p.aberturas, ...colocado.aberturas],
              itens: [...p.itens, ...colocado.itens],
              comodos: { ...(p.comodos || {}), [colocado.idSala]: { nome: config.nome, piso: config.piso } }
            }))
            setColocando(null)
            setSel(null)
          }} />
        </Secao>

        <Secao id="projeto" titulo="Projeto e arquivos" icone="arquivo" abertas={abertas} alternar={alternarSecao}>
        <input className="cat-busca" placeholder="Nome do projeto" defaultValue={todo.nome || ''} key={todo.nome || ''}
          onBlur={(e) => e.target.value !== (todo.nome || '') && mudarTodo((p) => ({ ...p, nome: e.target.value.slice(0, 120) }))}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} />
        <div className="grupo">
          <button onClick={salvarJSON} title="Salva o projeto inteiro (todos os andares)">Salvar (.json)</button>
          <label className="botao" title="Abre um projeto .json ou traz as paredes de um .dxf do AutoCAD">Abrir / importar
            <input type="file" accept=".json,.dxf" onChange={abrir} hidden /></label>
        </div>
        <small className="ajuda">Exportar planta do {nomeAndar(andar)}</small>
        <div className="exportar">
          <button onClick={() => exportarPDF(paraExportar())} title="Folha A3 com escala e carimbo, pronta para imprimir">PDF</button>
          <button onClick={() => exportarDXF(paraExportar())} title="Abre no AutoCAD, com camadas">DXF</button>
          <button onClick={() => exportarSVG(paraExportar())} title="Vetor no tamanho real de papel">SVG</button>
          <button onClick={() => exportarPNG(paraExportar())} title="Imagem em alta resolução">PNG</button>
        </div>
        <button onClick={() => confirm(`Apagar tudo do ${nomeAndar(andar)}?`) && (mudar((p) => ({ ...p, paredes: [], itens: [], aberturas: [], cotas: [] })), limparSel())}>
          Limpar {nomeAndar(andar)}
        </button>
        </Secao>

        <Secao id="atalhos" titulo="Atalhos" icone="camadas" abertas={abertas} alternar={alternarSecao}>
        <p className="ajuda">
          <kbd>WASD</kbd> anda · <kbd>Tab</kbd> 2D/3D · <kbd>Ctrl+Z</kbd> desfaz · <kbd>Ctrl+C</kbd>/<kbd>V</kbd>/<kbd>D</kbd> copiar/colar/duplicar ·
          {' '}<kbd>M</kbd> espelha · <kbd>Setas</kbd> empurram · <kbd>Q</kbd>/<kbd>E</kbd> giram · <kbd>Delete</kbd> apaga
          {vista === '2d' && <> · arraste no vazio para selecionar vários (da esquerda = só o que está dentro, da direita = o que encostar)</>}
          {' '}· <kbd>Alt</kbd> solta o móvel da parede
        </p>
        </Secao>
        </div>
        )}
      </aside>

      <main className="area" data-tema={tema}>
        {vista === '2d' ? <Planta2D {...props} abaixo={abaixo} lados={lados} /> : <Vista3D {...props} foco={foco} andaresAbaixo={andaresAbaixo} andar={andar} />}
        {vista === '3d' && (
          <button className={`foco${foco ? ' ativo' : ''}`} disabled={!listaSalas.length} onClick={alternarFoco}
            title={listaSalas.length ? '' : 'Feche um cômodo com paredes para usar o foco'}>
            {foco ? 'Sair do foco (F)' : 'Modo foco (F)'}{foco && <small>Q / E giram</small>}
          </button>
        )}
      </main>
      {modoSala && (
        <ModoSala props={{ ...props, tema: 'escuro' }} salas={listaSalas} setFerramenta={setFerramenta} girar={girar}
          desfazer={desfazer} refazer={refazer} apagar={apagar} sair={() => setModoSala(false)} />
      )}
    </div>
  )
}
