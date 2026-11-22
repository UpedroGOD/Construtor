// Cômodos prontos: paredes, porta, janela, móveis já arrumados, nome e piso. Medidas em metros a partir do canto de cima à esquerda.
// Móvel: [tipo, x, z, rot]  (rot 0 = de frente para baixo; π = para cima; π/2 = para a direita; -π/2 = para a esquerda)
// Porta/janela: [lado, distância a partir da esquerda (cima/baixo) ou de cima (esq/dir), variante]
import { novoId, encaixarNaParede } from './projeto.js'
import { dimsItem } from './catalogo.js'

const PI = Math.PI
export const PRONTOS = {
  banheiro: { nome: 'Banheiro', piso: 'porcelanato', w: 2, h: 2.5, porta: ['baixo', 0.6], janela: ['cima', 1.2, 'basculante'],
    itens: [['vaso-sanitario', 0.4, 0.4, 0], ['pia-de-banheiro-com-gabinete', 1.4, 0.3, 0], ['box-com-chuveiro', 1.5, 2.0, PI]] },
  cozinha: { nome: 'Cozinha', piso: 'ceramica', w: 3, h: 3, porta: ['baixo', 0.6], janela: ['cima', 1.5],
    itens: [['fogao-4-bocas', 0.5, 0.3, 0], ['pia-com-gabinete', 1.5, 0.3, 0], ['geladeira', 2.6, 0.4, 0], ['mesa', 1.6, 1.9, 0], ['cadeira', 1.3, 2.55, PI], ['cadeira', 1.9, 2.55, PI]] },
  casal: { nome: 'Quarto de casal', piso: 'laminado', w: 3.5, h: 3.5, porta: ['baixo', 0.6], janela: ['cima', 1.75],
    itens: [['cama', 1.75, 1.0, 0], ['criado-mudo', 0.75, 0.3, 0], ['criado-mudo', 2.75, 0.3, 0], ['guarda-roupa-4-portas', 2.5, 3.2, PI]] },
  solteiro: { nome: 'Quarto de solteiro', piso: 'laminado', w: 3, h: 3, porta: ['baixo', 0.6], janela: ['cima', 2.0],
    itens: [['cama-de-solteiro', 0.5, 1.0, 0], ['criado-mudo', 1.25, 0.3, 0], ['escrivaninha', 2.3, 0.35, 0], ['guardaroupa', 2.4, 2.6, PI]] },
  sala: { nome: 'Sala de estar', piso: 'madeira', w: 4, h: 5, porta: ['baixo', 0.6], janela: ['cima', 2.0],
    itens: [['tapete', 2, 3.3, 0], ['sofa', 2, 4.5, PI], ['mesa-de-centro', 2, 3.3, 0], ['rack-de-tv', 2, 0.3, 0], ['tv-50', 2, 0.3, 0], ['poltrona', 0.5, 3.2, PI / 2]] },
  lavanderia: { nome: 'Lavanderia', piso: 'frio', w: 2, h: 2, porta: ['baixo', 0.5],
    itens: [['maquina-de-lavar', 0.4, 0.4, 0], ['tanque', 1.2, 0.35, 0], ['armario-de-lavanderia', 1.75, 1.4, -PI / 2]] },
  escritorio: { nome: 'Escritório', piso: 'laminado', w: 3, h: 3, porta: ['baixo', 0.6], janela: ['esq', 1.5],
    itens: [['mesapc', 1.5, 0.4, 0], ['cadeira-de-escritorio', 1.5, 1.2, PI], ['estante', 2.7, 1.8, -PI / 2]] },
  bebe: { nome: 'Quarto de bebê', piso: 'carpete', w: 3, h: 3, porta: ['baixo', 0.6], janela: ['cima', 1.2],
    itens: [['berco', 0.45, 1.0, PI / 2], ['comoda', 1.9, 0.3, 0], ['poltrona-de-amamentacao', 2.4, 2.4, PI]] },
}

// Monta o cômodo com o canto de cima à esquerda em (ox, oz). Devolve os pedaços para somar ao projeto.
export function montar(chave, ox, oz) {
  const t = PRONTOS[chave], { w, h } = t
  const P = (x, z) => [+(ox + x).toFixed(3), +(oz + z).toFixed(3)]
  // sentido horário na tela: a esquerda de cada parede aponta para dentro (porta abre para dentro com lado 1)
  const lados = { cima: [P(0, 0), P(w, 0)], dir: [P(w, 0), P(w, h)], baixo: [P(w, h), P(0, h)], esq: [P(0, h), P(0, 0)] }
  const paredes = Object.fromEntries(Object.entries(lados).map(([k, [a, b]]) => [k, { id: novoId(), a, b }]))
  // distância contada a partir do começo de cada parede (baixo começa na direita, esq começa embaixo)
  const naParede = (lado, d) => ({ cima: d, dir: d, baixo: w - d, esq: h - d }[lado])
  const aberturas = []
  if (t.porta) aberturas.push({ id: novoId(), tipo: 'porta', parede: paredes[t.porta[0]].id, t: naParede(t.porta[0], t.porta[1]), lado: 1, ...(t.porta[2] && { variante: t.porta[2] }) })
  if (t.janela) aberturas.push({ id: novoId(), tipo: 'janela', parede: paredes[t.janela[0]].id, t: naParede(t.janela[0], t.janela[1]), lado: 1, ...(t.janela[2] && { variante: t.janela[2] }) })
  const lista = Object.values(paredes)
  const itens = t.itens.filter(([tipo]) => dimsItem({ tipo })).map(([tipo, x, z, rot]) => {
    const i = { id: novoId(), tipo, x: ox + x, z: oz + z, rot }
    return { ...i, ...encaixarNaParede(i, dimsItem(i), lista) } // encosta na parede certinho
  })
  return { paredes: lista, aberturas, itens, idSala: lista.map((x) => x.id).sort().join(), nome: t.nome, piso: t.piso }
}
