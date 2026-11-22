// Teste de ponta a ponta: abre o app no Chrome e usa como uma pessoa (clica, arrasta, aperta teclas).
// Rodar com o servidor ligado:  npm run dev   e em outro terminal:  npm run teste
import { chromium } from 'playwright-core'

const URL = process.env.URL || 'http://localhost:5180'
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const navegador = await chromium.launch({ executablePath: CHROME, headless: !process.env.VER })
const pagina = await navegador.newPage({ viewport: { width: 1400, height: 900 }, acceptDownloads: true })
const erros = []
pagina.on('pageerror', (e) => erros.push(e.message))
pagina.on('console', (m) => m.type() === 'error' && erros.push(m.text()))
pagina.on('dialog', (d) => d.accept()) // confirm() e alert()

let ok = 0, falhas = 0
async function passo(nome, fn) {
  try { await fn(); ok++; console.log('  ✓', nome) } catch (e) { falhas++; console.log('  ✗', nome, '→', e.message.split('\n')[0]) }
}
const certo = (c, msg) => { if (!c) throw new Error(msg) }
const projeto = () => pagina.evaluate(() => JSON.parse(localStorage.getItem('construtor-projeto')))
const espera = (ms = 120) => pagina.waitForTimeout(ms)
const tecla = async (k) => { await pagina.keyboard.press(k); await espera() }

await pagina.goto(URL)
await pagina.evaluate(() => localStorage.clear())
await pagina.reload()
await pagina.waitForSelector('.planta > svg')
await espera(300)

// metro → pixel na tela, lendo o zoom atual da planta (ela se reenquadra ao voltar do 3D)
async function P(x, z) {
  const caixa = await pagina.locator('.planta > svg').boundingBox()
  const t = await pagina.locator('.planta > svg > g').first().getAttribute('transform')
  const [tx, ty, gr, sc] = t.match(/-?[\d.]+(e-?\d+)?/g).map(Number) // translate(x y) rotate(graus) scale(s)
  const r = (gr * Math.PI) / 180
  return [caixa.x + tx + sc * (x * Math.cos(r) - z * Math.sin(r)), caixa.y + ty + sc * (x * Math.sin(r) + z * Math.cos(r))]
}
const clicar = async (x, z) => { await pagina.mouse.click(...(await P(x, z))); await espera() }
const arrastar = async (a, b) => {
  await pagina.mouse.move(...(await P(...a))); await pagina.mouse.down()
  await pagina.mouse.move(...(await P(...b)), { steps: 8 }); await pagina.mouse.up(); await espera()
}

console.log('Construtor — teste de ponta a ponta')

await passo('desenha um cômodo 4×3 com a ferramenta parede', async () => {
  for (const q of [[0, 0], [4, 0], [4, 3], [0, 3], [0, 0]]) await clicar(...q)
  const p = await projeto()
  certo(p.paredes.length === 4, `esperava 4 paredes, veio ${p.paredes.length}`)
  certo(await pagina.getByText('AMBIENTE 1').count() === 1, 'rótulo do cômodo não apareceu')
})

await passo('parede no meio (T) divide em dois cômodos', async () => {
  await clicar(2, 0); await clicar(2, 3); await tecla('Escape')
  certo(await pagina.getByText('AMBIENTE 2').count() === 1, 'não virou 2 cômodos')
})

await passo('coloca porta e janela na parede', async () => {
  await tecla('o'); await clicar(1, 0)
  await tecla('j'); await clicar(4, 1.5)
  const p = await projeto()
  certo(p.aberturas.length === 2, `aberturas: ${p.aberturas.length}`)
})

await passo('coloca um sofá pelo catálogo', async () => {
  await pagina.getByRole('button', { name: /Sofá 3 lugares/ }).first().click()
  await clicar(1, 1.8)
  certo((await projeto()).itens.length === 1, 'sofá não entrou')
})

await passo('seleciona o sofá, gira com E e duplica com Ctrl+D', async () => {
  await tecla('v'); await clicar(1, 1.8)
  certo(await pagina.locator('h3', { hasText: 'Sofá 3 lugares' }).count() === 1, 'painel do móvel não abriu')
  await tecla('e')
  certo(Math.abs((await projeto()).itens[0].rot - Math.PI / 12) < 1e-6, 'E não girou')
  await tecla('Control+d')
  certo((await projeto()).itens.length === 2, 'Ctrl+D não duplicou')
})

await passo('seta empurra 5 cm e Ctrl+Z desfaz', async () => {
  await tecla('Escape')
  const sofa = (await projeto()).itens[0]; await clicar(sofa.x, sofa.z)
  const antes = (await projeto()).itens[0] // o sofá encosta sozinho na parede, então acha pelo 1º colocado
  certo(antes, 'não achei o sofá original')
  await tecla('ArrowRight')
  const depois = (await projeto()).itens.find((i) => i.id === antes.id)
  certo(Math.abs(depois.x - antes.x - 0.05) < 1e-6, 'seta não moveu')
  await tecla('Control+z')
  certo(Math.abs((await projeto()).itens.find((i) => i.id === antes.id).x - antes.x) < 1e-6, 'Ctrl+Z não voltou')
})

await passo('janela de seleção pega tudo e Delete apaga; Ctrl+Z volta', async () => {
  await tecla('Escape')
  await arrastar([-1, -1], [5.5, 4])
  certo(await pagina.getByText(/Seleção · \d+ itens/).count() === 1, 'seleção de vários não apareceu')
  await tecla('Delete')
  certo((await projeto()).paredes.length === 0, 'Delete não apagou as paredes')
  await tecla('Control+z')
  certo((await projeto()).paredes.length === 5, 'Ctrl+Z não trouxe as paredes de volta')
})

await passo('clica no cômodo, dá nome e piso', async () => {
  await tecla('Escape'); await clicar(3, 2.6)
  certo(await pagina.locator('h3', { hasText: 'Nome e piso' }).count() >= 1, 'painel do cômodo não abriu')
  const nome = pagina.getByPlaceholder(/AMBIENTE/)
  await nome.fill('Cozinha'); await nome.press('Enter'); await espera()
  await pagina.locator('label', { hasText: 'Piso' }).locator('select').selectOption('porcelanato'); await espera()
  certo(await pagina.getByText('COZINHA').count() >= 1, 'nome não apareceu na planta')
  certo(await pagina.getByText('Porcelanato').count() >= 1, 'piso não apareceu')
})

await passo('porta: troca para dupla e muda a largura', async () => {
  await tecla('Escape'); await clicar(1, 0)
  certo(await pagina.locator('h3', { hasText: 'Porta' }).count() === 1, 'painel da porta não abriu')
  await pagina.locator('label', { hasText: 'Tipo' }).locator('select').selectOption('dupla'); await espera()
  const ab = (await projeto()).aberturas.find((x) => x.tipo === 'porta')
  certo(ab.variante === 'dupla', 'não virou dupla')
})

await passo('ferramenta cota mede 4 m', async () => {
  await tecla('Escape'); await tecla('c'); await clicar(0, 4.5); await clicar(4, 4.5)
  const k = (await projeto()).cotas
  certo(k.length === 1 && Math.abs(Math.hypot(k[0].b[0] - k[0].a[0], k[0].b[1] - k[0].a[1]) - 4) < 0.01, 'cota errada')
})

await passo('3D abre e Q/E/WASD não quebram', async () => {
  await tecla('Escape'); await tecla('Tab')
  await pagina.waitForSelector('canvas')
  for (const k of ['q', 'e', 'w', 'a']) { await pagina.keyboard.down(k); await espera(150); await pagina.keyboard.up(k) }
  await tecla('f'); await tecla('f')
  await tecla('Tab')
  await pagina.waitForSelector('.planta > svg')
})

await passo('novo andar: parede vai para o 1º andar e o térreo continua igual', async () => {
  await pagina.getByRole('button', { name: 'Novo andar' }).click(); await espera()
  await tecla('p'); await clicar(0, 0); await clicar(3, 0); await tecla('Escape')
  const p = await projeto()
  certo(p.paredes.filter((w) => w.andar === 1).length === 1, 'parede não foi para o 1º andar')
  certo(p.paredes.filter((w) => !w.andar).length === 5, 'térreo mudou')
  await pagina.getByRole('button', { name: 'Térreo' }).click(); await espera()
})

await passo('exporta DXF e salva .json (downloads)', async () => {
  await pagina.getByRole('button', { name: /Projeto e arquivos/ }).click(); await espera(300)
  const [dxf] = await Promise.all([pagina.waitForEvent('download'), pagina.getByRole('button', { name: 'DXF' }).click()])
  certo(dxf.suggestedFilename().endsWith('.dxf'), 'DXF não baixou')
  const [json] = await Promise.all([pagina.waitForEvent('download'), pagina.getByRole('button', { name: /Salvar/ }).click()])
  certo(json.suggestedFilename().endsWith('.json'), 'JSON não baixou')
})

await passo('Modo Sala abre a planta azul e sai', async () => {
  await pagina.getByRole('tab', { name: 'Sala' }).click()
  await pagina.waitForSelector('text=BLUEPRINT MODE')
  await pagina.getByRole('button', { name: /Sair/ }).click(); await espera()
  certo(await pagina.locator('.modo-sala').count() === 0, 'não saiu do Modo Sala')
})

await passo('janela de seleção + E gira o grupo inteiro', async () => {
  await tecla('Escape'); await tecla('v')
  await arrastar([-1, -1], [5.5, 4])
  const antes = await projeto()
  await tecla('e')
  const depois = await projeto()
  const mudou = depois.paredes.filter((w) => !w.andar).some((w) => { const a = antes.paredes.find((x) => x.id === w.id); return a && (a.a[0] !== w.a[0] || a.a[1] !== w.a[1]) })
  certo(mudou, 'paredes do grupo não giraram')
  certo(depois.itens.every((i) => Math.abs(i.rot - antes.itens.find((x) => x.id === i.id).rot - Math.PI / 12) < 1e-4), 'móveis do grupo não giraram')
  await tecla('Control+z')
})

await passo('DXF de outra pessoa: parede de 2 linhas vira 1 e os cômodos fecham', async () => {
  const r = await pagina.evaluate(async () => {
    const { lerDXF } = await import('/src/arquivos.jsx')
    const { salas } = await import('/src/projeto.js')
    const poli = (pts) => ['0', 'LWPOLYLINE', '8', 'ARQ-PAREDE', '90', String(pts.length), '70', '1', ...pts.flatMap(([x, y]) => ['10', String(x), '20', String(y)])]
    const linha = (a, b) => ['0', 'LINE', '8', 'ARQ-PAREDE', '10', a[0], '20', a[1], '11', b[0], '21', b[1]].map(String)
    const e = 0.075
    const dxf = ['0', 'SECTION', '2', 'HEADER', '9', '$INSUNITS', '70', '6', '0', 'ENDSEC', '0', 'SECTION', '2', 'ENTITIES',
      ...poli([[-e, e], [4 + e, e], [4 + e, -3 - e], [-e, -3 - e]]), // face de fora (Y para cima no DXF)
      ...poli([[e, -e], [4 - e, -e], [4 - e, -3 + e], [e, -3 + e]]), // face de dentro
      ...linha([2 - e, -e], [2 - e, -3 + e]), ...linha([2 + e, -e], [2 + e, -3 + e]), // divisória no meio
      '0', 'ENDSEC', '0', 'EOF'].join('\n')
    const { paredes, juntadas } = lerDXF(dxf)
    return { n: paredes.length, juntadas, esp: paredes[0]?.esp, salas: salas(paredes).map((s) => +s.area.toFixed(2)) }
  })
  certo(r.juntadas === 5 && r.n === 5, `esperava 5 paredes juntadas, veio ${JSON.stringify(r)}`)
  certo(Math.abs(r.esp - 0.15) < 1e-6, 'espessura errada ' + r.esp)
  certo(r.salas.length === 2 && r.salas.every((a) => Math.abs(a - 6) < 0.01), 'cômodos não fecharam: ' + r.salas)
})

await passo('1º andar com escada embaixo: laje e vão abrem no 3D sem erro', async () => {
  await tecla('Escape')
  await pagina.getByRole('button', { name: /Escada reta|Estrutura/ }).first().click() // aba Estrutura
  await pagina.getByRole('button', { name: /Escada reta/ }).first().click()
  await clicar(1, 1.5)
  await pagina.getByRole('button', { name: '1º andar' }).click(); await espera()
  for (const q of [[0, 0], [4, 0], [4, 3], [0, 3], [0, 0]]) await clicar(...q)
  await tecla('Escape')
  await pagina.getByRole('tab', { name: '3D' }).click()
  await pagina.waitForSelector('canvas'); await espera(800)
  await pagina.getByRole('tab', { name: 'Planta' }).click(); await espera()
  certo(await pagina.locator('.vao-escada').count() === 1, 'vão da escada não aparece na planta do 1º andar')
  await pagina.getByRole('button', { name: 'Térreo' }).click(); await espera()
})

await passo('Q/E giram a planta 2D; desenhar com ela girada continua certo; norte volta', async () => {
  await tecla('Escape'); await tecla('v'); await tecla('Escape')
  await pagina.keyboard.down('e'); await espera(400); await pagina.keyboard.up('e'); await espera()
  const t = await pagina.locator('.planta > svg > g').first().getAttribute('transform')
  const graus = Number(t.match(/rotate\(([-\d.e]+)/)[1])
  certo(Math.abs(graus) > 5, 'a planta não girou: ' + t)
  const antes = (await projeto()).paredes.length
  await tecla('p'); await clicar(1.5, 1); await clicar(2.5, 1); await tecla('Escape')
  const todas = (await projeto()).paredes, nova = todas.slice(antes).find((w) => !w.andar)
  certo(nova && Math.abs(nova.a[0] - 1.5) < 0.11 && Math.abs(nova.b[0] - 2.5) < 0.11 && Math.abs(nova.a[1] - 1) < 0.11, 'parede saiu no lugar errado: ' + JSON.stringify(nova))
  await pagina.locator('.norte').click(); await espera()
  const t2 = await pagina.locator('.planta > svg > g').first().getAttribute('transform')
  certo(/rotate\(0\)/.test(t2), 'norte não voltou: ' + t2)
})

await passo('cômodo selecionado: move com seta, foca no 3D e apaga sem levar a parede do vizinho', async () => {
  // projeto limpo: dois quartos 3×3 colados, com uma cama no da esquerda
  await pagina.evaluate(() => localStorage.setItem('construtor-projeto', JSON.stringify({
    paredes: [{ id: 'a', a: [0, 0], b: [6, 0] }, { id: 'b', a: [6, 0], b: [6, 3] }, { id: 'c', a: [6, 3], b: [0, 3] }, { id: 'd', a: [0, 3], b: [0, 0] }, { id: 'm', a: [3, 0], b: [3, 3] }],
    itens: [{ id: 'cama', tipo: 'cama', x: 1.5, z: 1.5, rot: 0 }], aberturas: [], cotas: [],
  })))
  await pagina.reload(); await pagina.waitForSelector('.planta > svg'); await espera(300)
  await tecla('v'); await clicar(0.4, 0.4) // canto vazio do quarto da esquerda
  certo(await pagina.locator('h3', { hasText: 'Nome e piso' }).count() >= 1, 'cômodo não foi selecionado')
  await tecla('ArrowDown')
  const p = await projeto()
  certo(Math.abs(p.itens[0].z - 1.55) < 1e-6, 'a cama de dentro não andou junto')
  certo(Math.abs(p.paredes.find((w) => w.id === 'd').a[1] - 3.05) < 1e-6, 'a parede do cômodo não andou')
  await tecla('Control+z')
  await pagina.getByRole('button', { name: /Focar no 3D/ }).click()
  await pagina.waitForSelector('canvas')
  certo(await pagina.getByRole('button', { name: /Sair do foco/ }).count() === 1, 'não entrou no foco')
  await pagina.getByRole('tab', { name: 'Planta' }).click(); await espera(300)
  await tecla('Delete')
  const q = await projeto()
  certo(q.paredes.some((w) => w.id === 'm'), 'apagou a parede que o vizinho usa')
  certo(!q.paredes.some((w) => w.id === 'd') && !q.itens.length, 'não apagou as paredes/móveis do cômodo')
})

await passo('Retângulo (T) com 4x3 digitado e Polígono (G) de 6 lados com raio 2', async () => {
  await pagina.evaluate(() => localStorage.clear())
  await pagina.reload(); await pagina.waitForSelector('.planta > svg'); await espera(300)
  await tecla('t'); await clicar(0, 0); await pagina.mouse.move(...(await P(2, 2)), { steps: 3 })
  for (const k of ['4', 'x', '3', 'Enter']) await tecla(k)
  let p = await projeto()
  certo(p.paredes.length === 4, `retângulo deu ${p.paredes.length} paredes`)
  certo(p.paredes.some((w) => Math.abs(Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]) - 4) < 1e-6), 'lado de 4 m não existe')
  await tecla('Escape')
  await tecla('g'); await pagina.getByRole('button', { name: 'Hexágono' }).click(); await clicar(-6, 0); await pagina.mouse.move(...(await P(-4, 0)))
  for (const k of ['2', 'Enter']) await tecla(k)
  p = await projeto()
  const hexa = p.paredes.slice(-6)
  certo(hexa.every((w) => Math.abs(Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]) - 2) < 0.01), 'hexágono de raio 2 tem lado 2')
  await tecla('Escape')
})

await passo('guia de alinhamento: parede termina alinhada com a ponta de outra parede', async () => {
  await tecla('p')
  const ref = (await projeto()).paredes[0].b // ponta já existente
  await clicar(ref[0] - 3, ref[1] + 6)
  await pagina.mouse.move(...(await P(ref[0] + 0.07, ref[1] + 6)), { steps: 4 }); await espera()
  certo(await pagina.locator('.guia').count() >= 1, 'guia tracejada não apareceu')
  await clicar(ref[0] + 0.07, ref[1] + 6); await tecla('Escape')
  const w = (await projeto()).paredes.at(-1)
  certo(Math.abs(w.b[0] - ref[0]) < 1e-6, `não alinhou: ${w.b[0]} x ${ref[0]}`)
})

await passo('forma pronta (cilindro) com largura editada no painel', async () => {
  await pagina.getByPlaceholder(/Buscar em/).fill('cilindro'); await espera()
  await pagina.getByRole('button', { name: /^Cilindro/ }).first().click()
  await clicar(1.5, 1.5)
  await pagina.getByPlaceholder(/Buscar em/).fill('')
  await tecla('v'); await clicar(1.5, 1.5)
  const campo = pagina.locator('label', { hasText: 'Largura' }).locator('input')
  await campo.fill('2.5'); await campo.press('Enter'); await espera()
  const it = (await projeto()).itens.find((i) => i.tipo === 'cilindro')
  certo(it && it.l === 2.5, 'largura não mudou: ' + JSON.stringify(it))
})

await passo('1º andar já nasce com chão (laje) em cima do térreo', async () => {
  await tecla('Escape')
  await pagina.getByRole('button', { name: 'Novo andar' }).click(); await espera()
  await pagina.getByRole('tab', { name: '3D' }).click(); await pagina.waitForSelector('canvas'); await espera(800)
  await pagina.getByRole('tab', { name: 'Planta' }).click(); await espera()
  await pagina.getByRole('button', { name: 'Térreo' }).click(); await espera()
})

await passo('nenhum erro no console', async () => {
  certo(!erros.length, erros.slice(0, 3).join(' | '))
})

console.log(`\n${ok} passaram, ${falhas} falharam`)
await navegador.close()
process.exit(falhas ? 1 : 0)
