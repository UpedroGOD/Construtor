export const ALTURA_PAREDE = 2.7
export const ESPESSURA = 0.15
export const CHAVE = 'construtor-projeto'
export const VAZIO = { paredes: [], itens: [], aberturas: [], cotas: [] }

export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
export const igual = (a, b) => dist(a, b) < 1e-6
export const arred = (v, passo) => Math.round(v / passo) * passo
export const fixar = (p) => [+p[0].toFixed(3), +p[1].toFixed(3)] // evita lixo de ponto flutuante tipo 1.0000000002
export const novoId = () => crypto.randomUUID()

export function carregar() {
  try {
    const p = JSON.parse(localStorage.getItem(CHAVE))
    return Array.isArray(p?.paredes) && Array.isArray(p?.itens) ? { aberturas: [], cotas: [], ...p } : VAZIO
  } catch {
    return VAZIO
  }
}

// Move pontos de parede e leva junto toda parede ligada neles, para os cantos não se soltarem
export function moverPontos(proj, pontos, dx, dz) {
  const mv = (q) => (pontos.some((p) => igual(p, q)) ? fixar([q[0] + dx, q[1] + dz]) : q)
  return { ...proj, paredes: proj.paredes.map((w) => ({ ...w, a: mv(w.a), b: mv(w.b) })) }
}

// Projeta um ponto na parede: t = distância desde a ponta "a", d = distância até a linha da parede
export function projetar(p, w) {
  const L = dist(w.a, w.b)
  const ux = (w.b[0] - w.a[0]) / L, uz = (w.b[1] - w.a[1]) / L
  const vx = p[0] - w.a[0], vz = p[1] - w.a[1]
  return { t: vx * ux + vz * uz, d: Math.abs(vx * uz - vz * ux), L }
}
export const prender = (t, l, L) => Math.min(Math.max(t, l / 2), L - l / 2) // vão sempre dentro da parede

function centroide(pol) {
  let A = 0, cx = 0, cz = 0
  for (let i = 0; i < pol.length; i++) {
    const [x0, z0] = pol[i], [x1, z1] = pol[(i + 1) % pol.length]
    const c = x0 * z1 - x1 * z0
    A += c; cx += (x0 + x1) * c; cz += (z0 + z1) * c
  }
  if (Math.abs(A) < 1e-9) return { centro: pol[0], area: 0 }
  return { centro: [cx / (3 * A), cz / (3 * A)], area: Math.abs(A / 2) }
}

// Acha os cômodos como faces do desenho das paredes. Corta as paredes onde outra encosta (T) ou cruza (X),
// tira as pontas soltas e dá a volta em cada face pelo lado de dentro. Cômodos colados dividindo parede funcionam.
// id do cômodo = paredes dele (não muda quando a parede é arrastada, então nome e piso continuam).
export function salas(paredes) {
  const K = (p) => p[0].toFixed(3) + ',' + p[1].toFixed(3)
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const cortes = paredes.map(() => [0, 1])
  for (let i = 0; i < paredes.length; i++) {
    const w = paredes[i], L = dist(w.a, w.b)
    if (L < 1e-6) continue
    for (let j = 0; j < paredes.length; j++) {
      if (i === j) continue
      const v = paredes[j]
      for (const q of [v.a, v.b]) { // ponta de outra parede encostada no meio desta (T)
        const r = projetar(q, w)
        if (r.d < 1e-3 && r.t > 1e-3 && r.t < L - 1e-3) cortes[i].push(r.t / L)
      }
      if (j > i) { // cruzamento no meio das duas (X)
        const ex = w.b[0] - w.a[0], ez = w.b[1] - w.a[1], fx = v.b[0] - v.a[0], fz = v.b[1] - v.a[1]
        const den = ex * fz - ez * fx
        if (Math.abs(den) < 1e-9) continue
        const qx = v.a[0] - w.a[0], qz = v.a[1] - w.a[1]
        const s1 = (qx * fz - qz * fx) / den, s2 = (qx * ez - qz * ex) / den
        if (s1 > 1e-4 && s1 < 1 - 1e-4 && s2 > 1e-4 && s2 < 1 - 1e-4) { cortes[i].push(s1); cortes[j].push(s2) }
      }
    }
  }
  const nos = new Map()
  const no = (p) => { const k = K(p); if (!nos.has(k)) nos.set(k, { p, viz: [] }); return k }
  const feitas = new Set()
  paredes.forEach((w, i) => {
    const ts = [...new Set(cortes[i].map((t) => +t.toFixed(6)))].sort((x, y) => x - y)
    for (let k = 0; k + 1 < ts.length; k++) {
      const kp = no(lerp(w.a, w.b, ts[k])), kq = no(lerp(w.a, w.b, ts[k + 1]))
      const id = kp < kq ? kp + '|' + kq : kq + '|' + kp
      if (kp === kq || feitas.has(id)) continue
      feitas.add(id)
      nos.get(kp).viz.push({ k: kq, w: w.id })
      nos.get(kq).viz.push({ k: kp, w: w.id })
    }
  })
  for (let mudou = true; mudou;) { // pontas soltas não fecham cômodo nenhum
    mudou = false
    for (const [k, n] of nos) if (n.viz.length < 2) {
      for (const v of n.viz) { const o = nos.get(v.k); o.viz = o.viz.filter((x) => x.k !== k) }
      nos.delete(k)
      mudou = true
    }
  }
  for (const n of nos.values()) {
    for (const v of n.viz) { const o = nos.get(v.k).p; v.ang = Math.atan2(o[1] - n.p[1], o[0] - n.p[0]) }
    n.viz.sort((x, y) => x.ang - y.ang)
  }
  const visto = new Set(), res = []
  for (const [k0, n0] of nos) for (const v0 of n0.viz) {
    if (visto.has(k0 + '>' + v0.k)) continue
    const pol = [], ids = new Set()
    let u = k0, v = v0.k, w = v0.w
    for (let guarda = 0; guarda < 10000; guarda++) {
      visto.add(u + '>' + v)
      pol.push(nos.get(u).p)
      ids.add(w)
      const viz = nos.get(v).viz, idx = viz.findIndex((x) => x.k === u)
      const prox = viz[(idx - 1 + viz.length) % viz.length]
      u = v; v = prox.k; w = prox.w
      if (u === k0 && v === v0.k) break
    }
    let A = 0
    for (let i = 0; i < pol.length; i++) { const [x0, z0] = pol[i], [x1, z1] = pol[(i + 1) % pol.length]; A += x0 * z1 - x1 * z0 }
    if (A / 2 <= 1e-4) continue // face de fora (contorno da casa) ou degenerada
    const limpo = pol.filter((p, i) => { // tira cantos no meio de uma reta
      const a = pol[(i - 1 + pol.length) % pol.length], b = pol[(i + 1) % pol.length]
      return Math.abs((p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0])) > 1e-9
    })
    const lista = [...ids]
    res.push({ id: lista.slice().sort().join(), poligono: limpo, paredes: lista, ...centroide(limpo) })
  }
  return res.sort((p, q) => q.area - p.area)
}

export function dentro(pol, [x, z]) {
  let d = false
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const [xi, zi] = pol[i], [xj, zj] = pol[j]
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) d = !d
  }
  return d
}

// ---------- Andares ----------
export const ALTURA_ANDAR = 3.0 // pé-direito 2,70 + laje
export const LISTAS = ['paredes', 'itens', 'aberturas', 'cotas']
export const andarDe = (x) => x.andar || 0
export const nomeAndar = (n) => (n === 0 ? 'Térreo' : `${n}º andar`)
export const filtrarAndar = (p, n) => ({ ...p, ...Object.fromEntries(LISTAS.map((k) => [k, (p[k] || []).filter((x) => andarDe(x) === n)])) })
// junta de volta o que foi editado num andar com o resto do prédio; o que é novo ganha o andar atual
export function juntarAndar(todo, editado, n) {
  const out = { ...todo, ...editado }
  for (const k of LISTAS)
    out[k] = [...(todo[k] || []).filter((x) => andarDe(x) !== n), ...(editado[k] || []).map((x) => (andarDe(x) === n ? x : { ...x, andar: n }))]
  return out
}

// ---------- Seleção de vários (comandos do AutoCAD) ----------
// alvo = [{ tipo: 'item'|'parede'|'abertura'|'cota', id }]
export const LISTA_DO_TIPO = { item: 'itens', parede: 'paredes', abertura: 'aberturas', cota: 'cotas' }
function separar(alvo) {
  const S = { itens: new Set(), paredes: new Set(), aberturas: new Set(), cotas: new Set() }
  for (const a of alvo) if (LISTA_DO_TIPO[a.tipo]) S[LISTA_DO_TIPO[a.tipo]].add(a.id)
  return S
}
const mvP = (q, dx, dz) => fixar([q[0] + dx, q[1] + dz])

// mover: paredes ligadas a quem se move esticam junto (igual arrastar uma parede só)
export function moverAlvo(p, alvo, dx, dz) {
  const S = separar(alvo)
  const pontos = p.paredes.filter((w) => S.paredes.has(w.id)).flatMap((w) => [w.a, w.b])
  const n = pontos.length ? moverPontos(p, pontos, dx, dz) : p
  return {
    ...n,
    itens: n.itens.map((i) => (S.itens.has(i.id) ? { ...i, x: +(i.x + dx).toFixed(3), z: +(i.z + dz).toFixed(3) } : i)),
    cotas: (n.cotas || []).map((k) => (S.cotas.has(k.id) ? { ...k, a: mvP(k.a, dx, dz), b: mvP(k.b, dx, dz) } : k)),
  }
}

export function apagarAlvo(p, alvo) {
  const S = separar(alvo)
  return {
    ...p,
    paredes: p.paredes.filter((w) => !S.paredes.has(w.id)),
    aberturas: p.aberturas.filter((ab) => !S.aberturas.has(ab.id) && !S.paredes.has(ab.parede)), // porta/janela sai com a parede
    itens: p.itens.filter((i) => !S.itens.has(i.id)),
    cotas: (p.cotas || []).filter((k) => !S.cotas.has(k.id)),
  }
}

export function copiarAlvo(p, alvo) {
  const S = separar(alvo)
  return {
    paredes: p.paredes.filter((w) => S.paredes.has(w.id)),
    aberturas: p.aberturas.filter((ab) => S.paredes.has(ab.parede)),
    itens: p.itens.filter((i) => S.itens.has(i.id)),
    cotas: (p.cotas || []).filter((k) => S.cotas.has(k.id)),
  }
}

// cola a cópia deslocada, com ids novos; devolve o projeto e a lista do que foi colado (para já ficar selecionado)
export function colarCopia(p, copia, dx, dz) {
  const ids = {}
  const paredes = copia.paredes.map((w) => { ids[w.id] = novoId(); return { ...w, id: ids[w.id], a: mvP(w.a, dx, dz), b: mvP(w.b, dx, dz) } })
  const aberturas = copia.aberturas.map((ab) => ({ ...ab, id: novoId(), parede: ids[ab.parede] }))
  const itens = copia.itens.map((i) => ({ ...i, id: novoId(), x: +(i.x + dx).toFixed(3), z: +(i.z + dz).toFixed(3) }))
  const cotas = copia.cotas.map((k) => ({ ...k, id: novoId(), a: mvP(k.a, dx, dz), b: mvP(k.b, dx, dz) }))
  return {
    projeto: { ...p, paredes: [...p.paredes, ...paredes], aberturas: [...p.aberturas, ...aberturas], itens: [...p.itens, ...itens], cotas: [...(p.cotas || []), ...cotas] },
    alvo: [...paredes.map((x) => ({ tipo: 'parede', id: x.id })), ...itens.map((x) => ({ tipo: 'item', id: x.id })), ...cotas.map((x) => ({ tipo: 'cota', id: x.id }))],
  }
}

// espelhar em volta do centro da seleção. eixo 'x' = esquerda↔direita, 'z' = cima↔baixo
export function espelharAlvo(p, alvo, eixo) {
  const S = separar(alvo)
  const pts = [
    ...p.paredes.filter((w) => S.paredes.has(w.id)).flatMap((w) => [w.a, w.b]),
    ...p.itens.filter((i) => S.itens.has(i.id)).map((i) => [i.x, i.z]),
    ...(p.cotas || []).filter((k) => S.cotas.has(k.id)).flatMap((k) => [k.a, k.b]),
  ]
  if (!pts.length) return p
  const c = eixo === 'x' ? (Math.min(...pts.map((q) => q[0])) + Math.max(...pts.map((q) => q[0]))) / 2 : (Math.min(...pts.map((q) => q[1])) + Math.max(...pts.map((q) => q[1]))) / 2
  const m = (q) => fixar(eixo === 'x' ? [2 * c - q[0], q[1]] : [q[0], 2 * c - q[1]])
  return {
    ...p,
    paredes: p.paredes.map((w) => (S.paredes.has(w.id) ? { ...w, a: m(w.a), b: m(w.b) } : w)),
    aberturas: p.aberturas.map((ab) => (S.paredes.has(ab.parede) ? { ...ab, lado: -(ab.lado || 1) } : ab)), // espelho troca o lado de abrir
    // frente do móvel = (sen rot, cos rot); espelhar em x vira -rot, em z vira π - rot
    itens: p.itens.map((i) => (S.itens.has(i.id) ? { ...i, ...(eixo === 'x' ? { x: 2 * c - i.x, rot: -i.rot } : { z: 2 * c - i.z, rot: Math.PI - i.rot }) } : i)),
    cotas: (p.cotas || []).map((k) => (S.cotas.has(k.id) ? { ...k, a: m(k.a), b: m(k.b) } : k)),
  }
}

// Paredes com cômodo dos dois lados (divisórias internas): não levam cota de fora
export function paredesInternas(paredes, listaSalas) {
  const lados = {}
  for (const w of paredes) {
    const L = dist(w.a, w.b)
    if (L < 1e-6) continue
    const nx = -(w.b[1] - w.a[1]) / L, nz = (w.b[0] - w.a[0]) / L, mx = (w.a[0] + w.b[0]) / 2, mz = (w.a[1] + w.b[1]) / 2
    for (const sa of listaSalas) if (sa.paredes.includes(w.id)) {
      // lado do cômodo = ponto do cômodo logo ao lado do meio da parede
      const lado = dentro(sa.poligono, [mx + nx * 0.05, mz + nz * 0.05]) ? 1 : dentro(sa.poligono, [mx - nx * 0.05, mz - nz * 0.05]) ? -1 : 0
      ;(lados[w.id] ||= new Set()).add(lado)
    }
  }
  return new Set(Object.keys(lados).filter((id) => lados[id].has(1) && lados[id].has(-1)))
}

// girar a seleção em volta do centro dela. delta > 0 = anti-horário na tela (mesmo sentido do móvel girando sozinho)
// pontas de parede que se movem levam junto as paredes ligadas nelas
export function girarAlvo(p, alvo, delta) {
  const S = separar(alvo)
  const ws = p.paredes.filter((w) => S.paredes.has(w.id)), is = p.itens.filter((i) => S.itens.has(i.id)), ks = (p.cotas || []).filter((k) => S.cotas.has(k.id))
  const pts = [...ws.flatMap((w) => [w.a, w.b]), ...is.map((i) => [i.x, i.z]), ...ks.flatMap((k) => [k.a, k.b])]
  if (!pts.length) return p
  const cx = (Math.min(...pts.map((q) => q[0])) + Math.max(...pts.map((q) => q[0]))) / 2
  const cz = (Math.min(...pts.map((q) => q[1])) + Math.max(...pts.map((q) => q[1]))) / 2
  const co = Math.cos(delta), si = Math.sin(delta)
  const g = (q) => fixar([cx + (q[0] - cx) * co + (q[1] - cz) * si, cz - (q[0] - cx) * si + (q[1] - cz) * co])
  const pontas = ws.flatMap((w) => [w.a, w.b])
  const gp = (q) => (pontas.some((x) => igual(x, q)) ? g(q) : q)
  return {
    ...p,
    paredes: p.paredes.map((w) => ({ ...w, a: gp(w.a), b: gp(w.b) })),
    itens: p.itens.map((i) => { if (!S.itens.has(i.id)) return i; const [x, z] = g([i.x, i.z]); return { ...i, x, z, rot: +(i.rot + delta).toFixed(5) } }),
    cotas: (p.cotas || []).map((k) => (S.cotas.has(k.id) ? { ...k, a: g(k.a), b: g(k.b) } : k)),
  }
}

// cantos de um móvel no chão (já girado)
export function cantosItem(i, c) {
  const co = Math.cos(-i.rot), si = Math.sin(-i.rot)
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [i.x + (u * c.l * co - v * c.p * si) / 2, i.z + (u * c.l * si + v * c.p * co) / 2])
}

// tudo que forma um cômodo: as paredes dele e os móveis/cotas de dentro (para mover, girar, copiar o cômodo inteiro)
export function alvoDaSala(p, sa) {
  return [
    ...sa.paredes.map((id) => ({ tipo: 'parede', id })),
    ...p.itens.filter((i) => dentro(sa.poligono, [i.x, i.z])).map((i) => ({ tipo: 'item', id: i.id })),
    ...(p.cotas || []).filter((k) => dentro(sa.poligono, k.a) && dentro(sa.poligono, k.b)).map((k) => ({ tipo: 'cota', id: k.id })),
  ]
}

// empurra o contorno do cômodo para fora d metros (do eixo até a face de fora da parede)
export function offsetPoligono(pol, d) {
  let A = 0
  for (let i = 0; i < pol.length; i++) { const [x0, z0] = pol[i], [x1, z1] = pol[(i + 1) % pol.length]; A += x0 * z1 - x1 * z0 }
  const sg = A > 0 ? -1 : 1 // lado de fora
  const n = pol.length
  const borda = pol.map((a, i) => {
    const b = pol[(i + 1) % n], L = dist(a, b), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o = [-u[1] * sg * d, u[0] * sg * d]
    return { p: [a[0] + o[0], a[1] + o[1]], u }
  })
  return pol.map((_, i) => {
    const e1 = borda[(i - 1 + n) % n], e2 = borda[i]
    const den = e1.u[0] * e2.u[1] - e1.u[1] * e2.u[0]
    if (Math.abs(den) < 1e-9) return e2.p
    const t = ((e2.p[0] - e1.p[0]) * e2.u[1] - (e2.p[1] - e1.p[1]) * e2.u[0]) / den
    return [e1.p[0] + e1.u[0] * t, e1.p[1] + e1.u[1] * t]
  })
}

// Móvel não entra na parede: empurra para fora e, se ficar a menos de `ima` da face, encosta certinho nela.
// Pensa no móvel como retângulo girado (largura c.l × profundidade c.p).
export function encaixarNaParede(i, c, paredes, ima = 0.12) {
  let x = i.x, z = i.z
  const co = Math.cos(-i.rot), si = Math.sin(-i.rot), X = [co, si], Y = [-si, co] // eixos do móvel no chão
  for (let volta = 0; volta < 3; volta++) {
    for (const w of paredes) {
      const L = dist(w.a, w.b)
      if (L < 1e-6) continue
      const d = [(w.b[0] - w.a[0]) / L, (w.b[1] - w.a[1]) / L], n = [-d[1], d[0]], e = (w.esp ?? ESPESSURA) / 2
      const h = (Math.abs(n[0] * X[0] + n[1] * X[1]) * c.l + Math.abs(n[0] * Y[0] + n[1] * Y[1]) * c.p) / 2
      const hw = (Math.abs(d[0] * X[0] + d[1] * X[1]) * c.l + Math.abs(d[0] * Y[0] + d[1] * Y[1]) * c.p) / 2
      const rx = x - w.a[0], rz = z - w.a[1], t = rx * d[0] + rz * d[1], sn = rx * n[0] + rz * n[1]
      if (t < -hw + 0.01 || t > L + hw - 0.01) continue // não está ao lado desta parede
      const folga = Math.abs(sn) - e - h, lado = sn >= 0 ? 1 : -1
      if (folga < 0 || folga < ima) { x -= n[0] * lado * folga; z -= n[1] * lado * folga } // empurra para fora / encosta
    }
    ima = 0 // o ímã só vale na 1ª volta; as outras só desfazem sobreposição
  }
  return { x: +x.toFixed(3), z: +z.toFixed(3) }
}
