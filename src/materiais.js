// Lista de materiais para orçamento: tudo calculado do desenho (paredes, pisos, portas, janelas, móveis)
import { ALTURA_PAREDE, ESPESSURA, dist, salas, filtrarAndar, nomeAndar, andarDe, LISTAS } from './projeto.js'
import { medidas, VARIANTES, varianteDe, dimsItem, PISOS, ACABAMENTOS } from './catalogo.js'

export function levantar(todo) {
  const n = Math.max(1, ...LISTAS.flatMap((k) => (todo[k] || []).map((x) => andarDe(x) + 1)))
  let paredeM2 = 0, alvenariaM3 = 0, paredeML = 0
  const pisos = {}, acab = {}, aberturas = {}, moveis = {}, comodos = []
  for (let k = 0; k < n; k++) {
    const p = filtrarAndar(todo, k)
    for (const w of p.paredes) {
      const L = dist(w.a, w.b), H = w.altura ?? ALTURA_PAREDE, e = w.esp ?? ESPESSURA
      const vaos = p.aberturas.filter((ab) => ab.parede === w.id).reduce((t, ab) => { const m = medidas(ab); return t + m.l * m.a }, 0)
      const area = Math.max(0, L * H - vaos)
      paredeML += L; paredeM2 += area; alvenariaM3 += area * e
      const ac = ACABAMENTOS[w.acabamento]?.nome || ACABAMENTOS.reboco.nome
      acab[ac] = (acab[ac] || 0) + area * 2 // as duas faces
    }
    for (const sa of salas(p.paredes)) {
      const c = (p.comodos || {})[sa.id] || {}
      const piso = PISOS[c.piso]?.nome || 'Sem piso definido'
      pisos[piso] = (pisos[piso] || 0) + sa.area
      comodos.push({ andar: nomeAndar(k), nome: c.nome || 'Ambiente', area: sa.area, piso })
    }
    for (const ab of p.aberturas) {
      const m = medidas(ab), nome = `${ab.tipo === 'porta' ? 'Porta' : 'Janela'} ${VARIANTES[ab.tipo][varianteDe(ab)].nome.toLowerCase()} ${m.l.toFixed(2)}×${m.a.toFixed(2)} m`
      aberturas[nome] = (aberturas[nome] || 0) + 1
    }
    for (const i of p.itens) { const c = dimsItem(i); if (c) moveis[c.nome] = (moveis[c.nome] || 0) + 1 }
  }
  return { paredeML, paredeM2, alvenariaM3, pisos, acab, aberturas, moveis, comodos }
}

export function csv(l) {
  const f = (v) => (typeof v === 'number' ? v.toFixed(2).replace('.', ',') : `"${String(v).replace(/"/g, '""')}"`)
  const linhas = [['Grupo', 'Item', 'Quantidade', 'Unidade'],
    ['Paredes', 'Comprimento total', l.paredeML, 'm'], ['Paredes', 'Área (sem vãos)', l.paredeM2, 'm²'], ['Paredes', 'Alvenaria', l.alvenariaM3, 'm³'],
    ...Object.entries(l.acab).map(([k, v]) => ['Acabamento de parede (2 faces)', k, v, 'm²']),
    ...Object.entries(l.pisos).map(([k, v]) => ['Piso', k, v, 'm²']),
    ...Object.entries(l.aberturas).map(([k, v]) => ['Portas e janelas', k, v, 'un']),
    ...Object.entries(l.moveis).map(([k, v]) => ['Móveis e objetos', k, v, 'un']),
    ...l.comodos.map((c) => ['Cômodos', `${c.andar} · ${c.nome} · ${c.piso}`, c.area, 'm²'])]
  return '﻿' + linhas.map((r) => r.map(f).join(';')).join('\r\n') // ; e BOM: abre certo no Excel em português
}
