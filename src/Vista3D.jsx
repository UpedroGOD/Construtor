import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CanvasTexture, Path, Shape, SRGBColorSpace, Vector2, Vector3 } from 'three'
import { direcao, seguradas } from './teclas'
import { OrbitControls, Grid } from '@react-three/drei'
import { PISOS, medidas, varianteDe, dimsItem } from './catalogo'
import { ALTURA_PAREDE, ESPESSURA, ALTURA_ANDAR, arred, novoId, prender, dentro, dist, cantosItem, offsetPoligono, encaixarNaParede } from './projeto'
import ItemModelo3D from './ItemModelo3D'

// Plaquinha de texto que sempre olha para a câmera (desenhada num canvas; sem depender de fonte externa)
function Etiqueta({ texto, position }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256; c.height = 64
    const g = c.getContext('2d')
    g.fillStyle = 'rgba(29,31,36,.92)'
    g.beginPath(); g.roundRect(4, 8, 248, 48, 12); g.fill()
    g.fillStyle = '#fff'; g.font = '600 30px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'
    g.fillText(texto, 128, 33)
    const t = new CanvasTexture(c)
    t.colorSpace = SRGBColorSpace
    return t
  }, [texto])
  useEffect(() => () => tex.dispose(), [tex])
  return (
    <sprite position={position} scale={[0.8, 0.2, 1]} renderOrder={10}>
      <spriteMaterial map={tex} depthTest={false} transparent />
    </sprite>
  )
}

// Pedaço de parede no sistema local: x ao longo da parede, y para cima
function Bloco({ x0, x1, y0, y1, cor, onDown, espessura = ESPESSURA, ...resto }) {
  if (x1 - x0 < 0.001 || y1 - y0 < 0.001) return null
  return (
    <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, 0]} onPointerDown={onDown} castShadow receiveShadow>
      <boxGeometry args={[x1 - x0, y1 - y0, espessura]} />
      <meshStandardMaterial color={cor} {...resto} />
    </mesh>
  )
}

// centro = centro do cômodo em foco; parede entre a câmera e o centro vira um toco baixo para ver dentro
function Parede({ a, b, aberturas, selecionada, onDown, centro, medida, altura: H = ALTURA_PAREDE, esp: E = ESPESSURA }) {
  const dx = b[0] - a[0], dz = b[1] - a[1]
  const len = Math.hypot(dx, dz)
  const cheia = useRef(), toco = useRef()
  const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2
  useFrame(({ camera }) => {
    if (!cheia.current) return
    const esconder = !!centro && (camera.position.x - mx) * (mx - centro[0]) + (camera.position.z - mz) * (mz - centro[1]) > 0
    cheia.current.visible = !esconder
    toco.current.visible = esconder
  })
  // parede escondida não pode roubar o clique do móvel atrás dela
  const down = (e) => { if (cheia.current?.visible) onDown?.(e) }
  if (len < 0.05) return null
  const cor = selecionada ? '#7aa7ff' : '#f2efe9'
  // vãos ordenados ao longo da parede; a parede vira pedaços cheios entre eles + peitoril e verga
  const vaos = aberturas
    .map((ab) => { const m = medidas(ab); return { ...ab, ...m, variante: varianteDe(ab), t: prender(ab.t, m.l, len) } })
    .filter((v) => v.l <= len)
    .sort((p, q) => p.t - q.t)
  const pecas = []
  let x = -E / 2
  for (const v of vaos) {
    const v0 = v.t - v.l / 2, v1 = v.t + v.l / 2
    pecas.push(<Bloco key={v.id + 'c'} x0={x} x1={v0} y0={0} y1={H} cor={cor} espessura={E} onDown={down} />)
    pecas.push(<Bloco key={v.id + 'p'} x0={v0} x1={v1} y0={0} y1={v.peitoril} cor={cor} espessura={E} onDown={down} />)
    pecas.push(<Bloco key={v.id + 'v'} x0={v0} x1={v1} y0={v.peitoril + v.a} y1={H} cor={cor} espessura={E} onDown={down} />)
    const vidro = { cor: '#9fd3ff', transparent: true, opacity: 0.35, espessura: 0.02 }
    const madeira = { cor: '#8a5a3b', espessura: 0.04 }
    if (v.tipo === 'janela') pecas.push(<Bloco key={v.id + 'g'} x0={v0} x1={v1} y0={v.peitoril} y1={v.peitoril + v.a} {...vidro} />)
    else if (v.variante === 'dupla') pecas.push(<Bloco key={v.id + 'f1'} x0={v0} x1={v.t - 0.005} y0={0} y1={v.a} {...madeira} />, <Bloco key={v.id + 'f2'} x0={v.t + 0.005} x1={v1} y0={0} y1={v.a} {...madeira} />)
    else if (v.variante === 'correr') pecas.push(<Bloco key={v.id + 'f'} x0={v0} x1={v.t + 0.05} y0={0} y1={v.a} {...vidro} opacity={0.5} />)
    else if (v.variante === 'garagem') pecas.push(<Bloco key={v.id + 'f'} x0={v0} x1={v1} y0={0} y1={v.a} cor="#9aa0a8" espessura={0.05} />)
    else if (v.variante === 'vidro') pecas.push(<Bloco key={v.id + 'f'} x0={v0} x1={v1} y0={0} y1={v.a} {...vidro} />)
    else if (v.variante !== 'arco') pecas.push(<Bloco key={v.id + 'f'} x0={v0} x1={v1} y0={0} y1={v.a} {...madeira} />)
    x = Math.max(x, v1)
  }
  pecas.push(<Bloco key="fim" x0={x} x1={len + E / 2} y0={0} y1={H} cor={cor} espessura={E} onDown={down} />)
  return (
    <group position={[a[0], 0, a[1]]} rotation={[0, -Math.atan2(dz, dx), 0]}>
      <group ref={cheia}>{pecas}</group>
      <group ref={toco} visible={false}>
        <Bloco x0={-E / 2} x1={len + E / 2} y0={0} y1={0.12} espessura={E} cor={selecionada ? '#7aa7ff' : '#cfc8bc'} onDown={(e) => toco.current.visible && onDown?.(e)} />
      </group>
      {medida && <Etiqueta texto={`${len.toFixed(2)} m`} position={[len / 2, H + 0.25, 0]} />}
    </group>
  )
}

const RAIZ2 = Math.SQRT1_2
function Item({ tipo, x, z, rot, l, p, a, y, pintura, cor, opacidade = 1, onDown }) {
  const c = dimsItem({ tipo, l, p, a, y, pintura })
  if (!c) return null

  // Objetos especiais com geometria simples (rampa, escada)
  if (tipo === 'rampa') {
    const L = Math.hypot(c.p, c.a)
    return (
      <group position={[x, 0, z]} rotation={[0, rot, 0]} onPointerDown={onDown}>
        <mesh position={[0, c.a / 2, 0]} rotation={[Math.atan2(c.a, c.p), 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[c.l, 0.08, L]} />
          <meshStandardMaterial color={cor || c.cor} transparent={opacidade < 1} opacity={opacidade} />
        </mesh>
      </group>
    )
  }
  if (c.forma === 'escada') {
    const n = Math.max(2, Math.round(c.a / 0.18)), fundo = c.p / n
    return (
      <group position={[x, 0, z]} rotation={[0, rot, 0]} onPointerDown={onDown}>
        {Array.from({ length: n }, (_, k) => (
          <mesh key={k} position={[0, ((k + 1) * c.a) / n / 2, c.p / 2 - fundo * (k + 0.5)]} castShadow receiveShadow>
            <boxGeometry args={[c.l, ((k + 1) * c.a) / n, fundo]} />
            <meshStandardMaterial color={cor || c.cor} transparent={opacidade < 1} opacity={opacidade} />
          </mesh>
        ))}
      </group>
    )
  }

  // Para outros objetos, usar modelo 3D detalhado
  return (
    <ItemModelo3D tipo={tipo} x={x} z={z} rot={rot} l={c.l} p={c.p} a={c.a} y={c.y} pintura={pintura} cor={cor} opacidade={opacidade} onDown={onDown} />
  )
}

// contorno do cômodo com os furos (vão da escada). Girado -90° em x: y da forma vira -z do mundo
function forma(poligono, buracos = []) {
  const f = new Shape(poligono.map(([x, z]) => new Vector2(x, -z)))
  for (const b of buracos) if (b.every((q) => dentro(poligono, q))) f.holes.push(new Path(b.map(([x, z]) => new Vector2(x, -z))))
  return f
}

function Piso({ poligono, cor = '#d2b48c', buracos }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.006} receiveShadow>
      <shapeGeometry args={[forma(poligono, buracos)]} />
      <meshStandardMaterial color={cor} />
    </mesh>
  )
}

// laje de 30 cm embaixo do piso dos andares de cima (fecha a fresta entre o teto de baixo e o chão de cima)
const LAJE = ALTURA_ANDAR - ALTURA_PAREDE
function Laje({ poligono, buracos }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-LAJE} castShadow receiveShadow>
      <extrudeGeometry args={[forma(poligono, buracos), { depth: LAJE, bevelEnabled: false }]} />
      <meshStandardMaterial color="#b9b4ab" />
    </mesh>
  )
}

// contornos de laje: cômodos do andar de baixo + cômodos deste andar (balanço), empurrados até a face de fora
const lajes = (debaixo = [], deste = []) => [...debaixo, ...deste].map((sa) => offsetPoligono(sa.poligono, ESPESSURA / 2))

// vão no piso de cima onde tem escada no andar de baixo
const ESCADAS = new Set(['escada-reta', 'escada-caracol'])
const vaosEscada = (itens = []) => itens.filter((i) => ESCADAS.has(i.tipo) && dimsItem(i)).map((i) => cantosItem(i, dimsItem(i)))

const giro = new Vector3(), CIMA = new Vector3(0, 1, 0)

// Modo foco: câmera presa no centro do cômodo; E gira para a esquerda, Q para a direita
function Foco({ sala, travado }) {
  const { camera, controls } = useThree()
  const [cx, cz] = sala.centro
  const raio = Math.max(...sala.poligono.map((p) => dist(p, sala.centro)))
  useEffect(() => {
    if (!controls) return
    controls.target.set(cx, 0.8, cz)
    camera.position.set(cx + raio * 1.5, raio * 1.4 + 2.5, cz + raio * 1.5)
    controls.update()
  }, [controls, cx, cz, raio, camera])
  return <GirarQE travado={travado} />
}

// Q/E giram a câmera em volta do ponto que ela olha (E = esquerda). Com móvel selecionado, Q/E giram o móvel.
function GirarQE({ travado }) {
  useFrame(({ camera, controls }, dt) => {
    const q = seguradas.has('q'), e = seguradas.has('e')
    if (q === e || !controls || travado) return
    giro.copy(camera.position).sub(controls.target).applyAxisAngle(CIMA, (e ? 1 : -1) * 1.8 * Math.min(dt, 0.05))
    camera.position.copy(controls.target).add(giro)
    controls.update()
  })
  return null
}

const frente = new Vector3(), lado = new Vector3(), passo = new Vector3()

// WASD anda com a câmera e o ponto que ela olha, no plano do chão, na direção para onde ela aponta
function AndarWASD() {
  useFrame(({ camera, controls }, dt) => {
    const d = direcao()
    if (!d.x && !d.y) return
    camera.getWorldDirection(frente)
    frente.y = 0
    frente.normalize()
    lado.crossVectors(frente, camera.up).normalize()
    passo.set(0, 0, 0).addScaledVector(frente, d.y).addScaledVector(lado, d.x).normalize()
      .multiplyScalar(6 * Math.min(dt, 0.05) * (d.rapido ? 2.5 : 1)) // 6 m/s
    camera.position.add(passo)
    if (controls) { controls.target.add(passo); controls.update() }
  })
  return null
}

export default function Vista3D({ projeto, mudar, marcar, sel, setSel, grupo = [], colocando, setColocando, tema, foco, diorama, salas = [], andaresAbaixo = [], andar = 0 }) {
  const [cursor, setCursor] = useState([0, 0])
  const arraste = useRef(null)
  const [arrastando, setArrastando] = useState(false)

  const noChaoMove = (e) => {
    const p = [arred(e.point.x, 0.05), arred(e.point.z, 0.05)]
    setCursor(p)
    const a = arraste.current
    if (!a) return
    if (!a.movido) { marcar(); a.movido = true }
    mudar((pr) => ({ ...pr, itens: pr.itens.map((i) => { if (i.id !== a.id) return i; const m = { ...i, x: p[0] - a.off[0], z: p[1] - a.off[1] }; return { ...m, ...encaixarNaParede(m, dimsItem(m), pr.paredes) } }) }), false)
  }

  const noChaoDown = (e) => {
    if (e.button !== 0) return
    if (colocando) {
      const id = novoId()
      const novo = { id, tipo: colocando, x: cursor[0], z: cursor[1], rot: 0 }
      mudar((p) => ({ ...p, itens: [...p.itens, { ...novo, ...encaixarNaParede(novo, dimsItem(novo), p.paredes) }] }))
      setSel({ tipo: 'item', id })
      if (!e.shiftKey) setColocando(null)
      return
    }
    setSel(null)
  }

  // diorama: só o cômodo em foco existe; o resto do projeto some
  const paredes = diorama && foco ? projeto.paredes.filter((w) => foco.paredes.includes(w.id)) : projeto.paredes
  const itens = diorama && foco ? projeto.itens.filter((i) => dentro(foco.poligono, [i.x, i.z])) : projeto.itens
  const pisos = diorama && foco ? [foco] : salas
  const vaoAqui = andar > 0 ? vaosEscada(andaresAbaixo[andar - 1]?.p.itens) : []

  const soltar = () => { arraste.current = null; setArrastando(false) }

  return (
    <Canvas shadows camera={{ position: [8, 10, 10], fov: 45 }} onContextMenu={(e) => e.preventDefault()} onPointerUp={soltar} onPointerLeave={soltar}>
      <color attach="background" args={[diorama ? '#141a26' : tema === 'escuro' ? '#15171c' : '#e9edf2']} />
      <hemisphereLight args={['#ffffff', '#b9b0a3', 1.2]} />
      <directionalLight position={[8, 14, 6]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
      <mesh rotation-x={-Math.PI / 2} onPointerMove={noChaoMove} onPointerDown={noChaoDown} receiveShadow>
        <planeGeometry args={[200, 200]} />
        {diorama || andar > 0
          ? <meshBasicMaterial transparent opacity={0} depthWrite={false} /> /* invisível, mas ainda pega o mouse */
          : <meshStandardMaterial color={tema === 'escuro' ? '#2a2d33' : '#dcd6cc'} />}
      </mesh>
      {pisos.map((sa) => <Piso key={sa.id} poligono={sa.poligono} cor={PISOS[(projeto.comodos || {})[sa.id]?.piso]?.cor} buracos={vaoAqui} />)}
      {/* laje = teto do andar de baixo e chão deste: aparece sozinha em cima de todo cômodo de baixo, até a face de fora da parede */}
      {andar > 0 && !diorama && lajes(andaresAbaixo[andar - 1]?.salas, pisos).map((pol, n) => <Laje key={'l' + n} poligono={pol} buracos={vaoAqui} />)}
      {/* andares de baixo: o andar atual fica sempre na altura 0 e os outros descem */}
      {!diorama && (
        <group position-y={-andar * ALTURA_ANDAR}>
          {andar > 0 && <mesh rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[200, 200]} /><meshStandardMaterial color="#2a2d33" /></mesh>}
          <Grid args={[200, 200]} cellSize={0.1} sectionSize={1} cellColor="#2f343c" sectionColor="#454c57" fadeDistance={40} position={[0, 0.002, 0]} />
        </group>
      )}
      {!diorama && andaresAbaixo.map(({ k, p, salas: ss }) => (
        <group key={k} position-y={-(andar - k) * ALTURA_ANDAR}>
          {ss.map((sa) => <Piso key={sa.id} poligono={sa.poligono} cor={PISOS[(p.comodos || {})[sa.id]?.piso]?.cor} buracos={vaosEscada(andaresAbaixo[k - 1]?.p.itens)} />)}
          {k > 0 && lajes(andaresAbaixo[k - 1]?.salas, ss).map((pol, n) => <Laje key={'l' + n} poligono={pol} buracos={vaosEscada(andaresAbaixo[k - 1]?.p.itens)} />)}
          {/* parede de baixo sobe até encostar na laje de cima */}
          {p.paredes.map((w) => <Parede key={w.id} a={w.a} b={w.b} aberturas={p.aberturas.filter((ab) => ab.parede === w.id)} altura={(w.altura ?? ALTURA_PAREDE) + LAJE - 0.01} esp={w.esp} medida={false} />)}
          {p.itens.map((i) => <Item key={i.id} {...i} />)}
        </group>
      ))}

      {paredes.map((w) => (
        <Parede key={w.id} a={w.a} b={w.b} aberturas={projeto.aberturas.filter((ab) => ab.parede === w.id)} altura={w.altura} esp={w.esp} centro={foco?.centro} medida={!foco} selecionada={sel?.id === w.id || grupo.some((g) => g.id === w.id)}
          onDown={(e) => { if (e.button !== 0 || colocando) return; e.stopPropagation(); setSel({ tipo: 'parede', id: w.id }) }} />
      ))}

      {itens.map((i) => (
        <Item key={i.id} {...i} cor={sel?.id === i.id || grupo.some((g) => g.id === i.id) ? '#7aa7ff' : undefined}
          onDown={(e) => {
            if (e.button !== 0 || colocando) return
            e.stopPropagation()
            setSel({ tipo: 'item', id: i.id })
            arraste.current = { id: i.id, off: [arred(e.point.x, 0.05) - i.x, arred(e.point.z, 0.05) - i.z] } // mantém o ponto onde pegou
            setArrastando(true)
          }} />
      ))}

      {colocando && <Item tipo={colocando} x={cursor[0]} z={cursor[1]} rot={0} opacidade={0.5} />}

      {/* esquerdo fica livre para mexer nos móveis; direito gira, meio/roda dá zoom, Ctrl+direito arrasta */}
      {foco ? <Foco sala={foco} travado={sel?.tipo === 'item' || grupo.length > 0} /> : <><AndarWASD /><GirarQE travado={sel?.tipo === 'item' || sel?.tipo === 'sala' || grupo.length > 0} /></>}
      <OrbitControls makeDefault enablePan={!foco} enabled={!arrastando} maxPolarAngle={Math.PI / 2.1}
        mouseButtons={{ LEFT: undefined, MIDDLE: 1, RIGHT: 0 }} />
    </Canvas>
  )
}
