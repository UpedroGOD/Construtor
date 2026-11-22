import { useEffect, useState } from 'react'
import Catalogo from './PainelMoveis'
import { igual } from './projeto'
import Blueprint from './Blueprint'
import Vista3D from './Vista3D'
import { Rotacao } from './App'
import { Icone } from './icones'

// Tela cheia: 1) planta azul para desenhar o cômodo  2) a sala sozinha, estilo diorama, para decorar
export default function ModoSala({ props, salas, setFerramenta, girar, desfazer, refazer, apagar, sair }) {
  const [etapa, setEtapa] = useState('planta')
  const { colocando, setColocando, setSel, sel } = props
  const [alvo, setAlvo] = useState(null) // um canto do cômodo que acabou de ser confirmado na planta
  const sala = (alvo && salas.find((s) => s.poligono.some((p) => igual(p, alvo)))) || salas[0]

  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {}) // navegador pode negar; a janela já cobre a tela
    return () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}) }
  }, [])

  useEffect(() => { if (etapa === 'sala' && !sala) setEtapa('planta') }, [etapa, sala])

  const usar = (f) => { setFerramenta(f); setColocando(null); setSel(null) }

  if (etapa === 'planta')
    return (
      <div className="modo-sala">
        <Blueprint salas={salas} mudar={props.mudar} sair={sair} aoConfirmar={(canto) => { setAlvo(canto); setEtapa('sala'); usar('selecionar') }} />
      </div>
    )

  return (
    <div className="modo-sala">
      <header className="sala-barra">
        <div className="sala-grupo">
          <button className="sala-bt" onClick={() => setEtapa('planta')} title="Voltar para a planta azul"><Icone nome="planta" />Planta</button>
        </div>
        <div className="sala-grupo">
          <button className="sala-bt so-icone" onClick={desfazer} title="Desfazer (Ctrl+Z)" aria-label="Desfazer"><Icone nome="desfazer" /></button>
          <button className="sala-bt so-icone" onClick={refazer} title="Refazer (Ctrl+Y)" aria-label="Refazer"><Icone nome="refazer" /></button>
          <button className="sala-bt so-icone" onClick={apagar} disabled={!sel} title="Apagar (Delete)" aria-label="Apagar"><Icone nome="lixo" /></button>
          {sel?.tipo === 'item' && <Rotacao girar={girar} />}
        </div>
        <span className="espaco" />
        <button className="sala-bt" onClick={sair} title="Voltar ao editor">Fechar</button>
      </header>

      <div className="area" data-tema="escuro">
        <Vista3D {...props} foco={sala} diorama />
        {<div className="dica-sala">Q / E giram a sala (ou o móvel selecionado) · arraste os móveis · roda dá zoom</div>}
      </div>

      <footer className="catalogo-sala">
        <Catalogo colocando={colocando} setColocando={setColocando} horizontal />
      </footer>
    </div>
  )
}
