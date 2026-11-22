// Catálogo montado a partir de Documents\shorts\LISTA_MOVEIS.md.
// Linha: [nome, largura (x), profundidade (z), altura (y), forma do desenho, { y: altura do chão até a base, id, cor }]
// "y" > 0 = pendurado na parede, no teto ou em cima de mesa/bancada. "id" só onde já existia, para não quebrar projetos salvos.

const COR = {
  sofa: '#6b7f99', L: '#6b7f99', cadeira: '#a0703f', mesa: '#8a5a3b', redondo: '#9c7a5b', cama: '#d9cbb3', armario: '#d8cfc0',
  estante: '#b98b5e', eletro: '#c9ced6', fogao: '#b9bfc8', tv: '#3a3f48', pia: '#dfe6ec', vaso: '#eef2f5', banheira: '#e6edf2',
  chuveiro: '#9fc4dc', planta: '#4f8a4b', tapete: '#b5654d', luz: '#e8c45a', piscina: '#3d93d1', carro: '#b23a3a', arvore: '#3e7d3a',
  escada: '#a89f90', jogo: '#2f7a4a', deco: '#c49a6c', geral: '#9aa1ab', cubo: '#8fa3bf', cilindro: '#8fbfa3', esfera: '#bf8fa3', cone: '#bfa38f', piramide: '#c4b07a', prisma: '#9a8fbf',
}

const CATS = [
  ['assentos', 'Assentos', '🛋', [
    ['Sofá 2 lugares', 1.6, 0.9, 0.85, 'sofa'], ['Sofá 3 lugares', 2.1, 0.9, 0.85, 'sofa', { id: 'sofa' }],
    ['Sofá de canto (L)', 2.6, 1.8, 0.85, 'L'], ['Sofá-cama', 1.9, 0.95, 0.85, 'sofa'], ['Sofá retrátil', 2.3, 1.6, 0.95, 'sofa'],
    ['Chaise longue', 0.8, 1.7, 0.8, 'sofa'], ['Futon', 1.9, 0.9, 0.4, 'sofa'],
    ['Poltrona', 0.8, 0.8, 0.95, 'sofa'], ['Poltrona reclinável', 0.9, 1.0, 1.0, 'sofa'], ['Poltrona do papai', 0.95, 1.1, 1.05, 'sofa'],
    ['Poltrona de amamentação', 0.75, 0.85, 1.0, 'sofa'], ['Cadeira de balanço', 0.65, 1.0, 1.0, 'cadeira'], ['Puff pera', 0.8, 0.8, 0.7, 'redondo'],
    ['Puff', 0.5, 0.5, 0.45, 'redondo'], ['Puff baú', 0.8, 0.45, 0.45, 'geral'], ['Banqueta', 0.4, 0.4, 0.45, 'redondo'],
    ['Banco de madeira', 1.2, 0.35, 0.45, 'mesa'], ['Namoradeira', 1.3, 0.75, 0.85, 'sofa'], ['Recamier (pé de cama)', 1.4, 0.45, 0.45, 'geral'],
    ['Cadeira de jantar', 0.45, 0.5, 0.9, 'cadeira', { id: 'cadeira' }], ['Cadeira estofada', 0.5, 0.55, 0.95, 'cadeira'],
    ['Cadeira de cozinha', 0.42, 0.45, 0.85, 'cadeira'], ['Banqueta alta de bar', 0.4, 0.4, 0.75, 'redondo'], ['Cadeira infantil', 0.32, 0.32, 0.55, 'cadeira'],
  ]],
  ['mesas', 'Mesas', '🍽', [
    ['Mesa de jantar 2 lugares', 0.8, 0.7, 0.75, 'mesa'], ['Mesa de jantar 4 lugares', 1.2, 0.8, 0.75, 'mesa', { id: 'mesa' }],
    ['Mesa de jantar 6 lugares', 1.8, 0.9, 0.75, 'mesa'], ['Mesa de jantar 8 lugares', 2.2, 1.0, 0.75, 'mesa'],
    ['Mesa quadrada', 1.0, 1.0, 0.75, 'mesa'], ['Mesa redonda', 1.1, 1.1, 0.75, 'redondo'], ['Mesa extensível', 1.6, 0.9, 0.75, 'mesa'],
    ['Mesa dobrável de parede', 0.8, 0.5, 0.75, 'mesa'], ['Mesa de centro', 1.0, 0.6, 0.4, 'mesa'], ['Mesa lateral', 0.5, 0.5, 0.55, 'mesa'],
    ['Mesa de apoio', 0.45, 0.35, 0.65, 'mesa'], ['Mesa-bandeja', 0.5, 0.35, 0.6, 'mesa'], ['Mesa nicho', 0.6, 0.35, 0.6, 'estante'],
    ['Mesa de estudos infantil', 0.9, 0.5, 0.55, 'mesa'], ['Prancheta de desenho', 1.0, 0.7, 0.9, 'mesa'],
    ['Aparador', 1.4, 0.4, 0.8, 'armario'], ['Buffet', 1.6, 0.45, 0.85, 'armario'], ['Mesa de bar', 0.6, 0.6, 1.05, 'redondo'],
    ['Mesa de café da manhã', 0.9, 0.6, 0.75, 'mesa'], ['Penteadeira', 1.0, 0.45, 0.75, 'mesa'], ['Mesa de pôquer', 1.2, 1.2, 0.75, 'redondo', { cor: '#2f7a4a' }],
  ]],
  ['quarto', 'Camas e quarto', '🛏', [
    ['Cama de solteiro', 0.9, 1.9, 0.5, 'cama'], ['Cama de casal', 1.4, 1.9, 0.5, 'cama', { id: 'cama' }], ['Cama queen', 1.6, 2.0, 0.5, 'cama'],
    ['Cama king', 1.9, 2.0, 0.5, 'cama'], ['Cama box', 1.4, 1.9, 0.6, 'cama'], ['Cama com baú', 1.4, 1.9, 0.5, 'cama'], ['Bicama', 0.9, 1.9, 0.6, 'cama'],
    ['Beliche', 0.9, 1.9, 1.6, 'cama'], ['Treliche', 0.9, 1.9, 1.9, 'cama'], ['Cama suspensa (mesa embaixo)', 0.9, 1.9, 1.7, 'cama'],
    ['Cama montessoriana', 0.9, 1.9, 0.2, 'cama'], ['Cama infantil', 0.7, 1.5, 0.4, 'cama'], ['Berço', 0.7, 1.3, 0.9, 'cama'], ['Mini-berço', 0.6, 0.9, 0.85, 'cama'],
    ['Moisés', 0.45, 0.8, 0.6, 'redondo'], ['Cama de cachorro/gato', 0.6, 0.5, 0.2, 'redondo'], ['Colchão no chão', 0.9, 1.9, 0.15, 'cama'],
    ['Cabeceira', 1.6, 0.1, 1.2, 'geral'], ['Dossel', 1.6, 2.1, 2.2, 'cama'], ['Mosquiteiro', 1.0, 1.0, 2.0, 'redondo', { cor: '#d9dde2' }],
    ['Criado-mudo', 0.45, 0.4, 0.55, 'armario'], ['Guarda-roupa 2 portas', 1.0, 0.6, 2.1, 'armario', { id: 'guardaroupa' }],
    ['Guarda-roupa 3 portas', 1.4, 0.6, 2.1, 'armario'], ['Guarda-roupa 4 portas', 1.8, 0.6, 2.1, 'armario'], ['Guarda-roupa de correr', 2.0, 0.65, 2.2, 'armario'],
    ['Closet aberto', 2.0, 0.5, 2.2, 'estante'], ['Arara de roupas', 1.2, 0.45, 1.6, 'geral'], ['Cabideiro', 0.5, 0.5, 1.75, 'redondo'],
    ['Sapateira', 0.8, 0.35, 1.0, 'armario'], ['Cômoda', 1.0, 0.5, 0.85, 'armario'], ['Gaveteiro', 0.45, 0.5, 0.65, 'armario'], ['Baú', 0.9, 0.45, 0.5, 'geral'],
    ['Trocador de bebê', 0.8, 0.5, 0.9, 'armario'], ['Espelho de chão', 0.5, 0.05, 1.6, 'geral', { cor: '#bcd3e0' }],
    ['Espelho de parede', 0.6, 0.03, 0.9, 'geral', { y: 1.1, cor: '#bcd3e0' }], ['Biombo', 1.5, 0.05, 1.7, 'geral'],
  ]],
  ['armazenamento', 'Armazenamento', '🗄', [
    ['Estante de livros', 0.8, 0.35, 1.8, 'estante', { id: 'estante' }], ['Estante vazada (divisória)', 1.2, 0.35, 1.8, 'estante'],
    ['Cristaleira', 1.0, 0.45, 1.9, 'armario'], ['Prateleira de parede', 0.8, 0.25, 0.03, 'estante', { y: 1.5 }], ['Nicho', 0.4, 0.25, 0.4, 'estante', { y: 1.4 }],
    ['Prateleira de canto', 0.35, 0.35, 1.6, 'estante'], ['Rack de TV', 1.8, 0.45, 0.55, 'armario'], ['Painel de TV', 1.8, 0.05, 1.2, 'geral', { y: 0.6 }],
    ['Home theater', 1.2, 0.4, 0.9, 'eletro'], ['Armário alto', 0.8, 0.5, 2.0, 'armario'], ['Armário baixo', 0.8, 0.45, 0.85, 'armario'],
    ['Armário multiuso', 0.7, 0.45, 1.8, 'armario'], ['Caixa organizadora', 0.4, 0.3, 0.25, 'geral'], ['Cesto', 0.4, 0.4, 0.5, 'redondo'],
    ['Baú de brinquedos', 0.8, 0.45, 0.5, 'geral'], ['Adega', 0.6, 0.5, 0.9, 'eletro'], ['Carrinho de bar', 0.7, 0.4, 0.85, 'mesa'],
    ['Porta-chaves', 0.3, 0.05, 0.2, 'deco', { y: 1.4 }], ['Porta-casacos de entrada', 0.6, 0.1, 0.3, 'deco', { y: 1.6 }],
    ['Banco de entrada com sapateira', 1.0, 0.4, 0.48, 'armario'],
  ]],
  ['cozinha', 'Cozinha', '🍳', [
    ['Geladeira 1 porta', 0.6, 0.65, 1.5, 'eletro'], ['Geladeira 2 portas', 0.7, 0.7, 1.8, 'eletro', { id: 'geladeira' }],
    ['Geladeira duplex', 0.9, 0.75, 1.85, 'eletro'], ['Geladeira side by side', 0.92, 0.75, 1.8, 'eletro'], ['Freezer', 0.6, 0.65, 1.6, 'eletro'],
    ['Frigobar', 0.5, 0.5, 0.85, 'eletro'], ['Fogão 4 bocas', 0.55, 0.6, 0.85, 'fogao'], ['Fogão 6 bocas', 0.8, 0.6, 0.85, 'fogao'],
    ['Cooktop', 0.6, 0.5, 0.05, 'fogao', { y: 0.9 }], ['Forno de embutir', 0.6, 0.55, 0.6, 'eletro'], ['Micro-ondas', 0.5, 0.4, 0.3, 'eletro', { y: 0.9 }],
    ['Coifa', 0.9, 0.5, 0.6, 'geral', { y: 1.65 }], ['Depurador', 0.6, 0.45, 0.15, 'geral', { y: 1.6 }], ['Pia com gabinete', 1.2, 0.6, 0.9, 'pia'],
    ['Cuba', 0.5, 0.4, 0.2, 'pia', { y: 0.9 }], ['Armário aéreo', 0.8, 0.35, 0.7, 'armario', { y: 1.5 }], ['Armário de chão', 0.8, 0.6, 0.9, 'armario'],
    ['Paneleiro', 0.6, 0.6, 2.1, 'armario'], ['Despensa', 0.8, 0.5, 2.0, 'armario'], ['Bancada', 1.8, 0.6, 0.9, 'mesa'], ['Ilha de cozinha', 1.6, 0.9, 0.9, 'mesa'],
    ['Lava-louças', 0.6, 0.6, 0.85, 'eletro'], ['Lixeira', 0.3, 0.3, 0.6, 'redondo'], ['Filtro de água', 0.3, 0.3, 0.45, 'eletro', { y: 0.9 }],
    ['Cafeteira', 0.2, 0.25, 0.3, 'eletro', { y: 0.9 }], ['Liquidificador', 0.2, 0.2, 0.4, 'redondo', { y: 0.9 }], ['Batedeira', 0.25, 0.35, 0.35, 'eletro', { y: 0.9 }],
    ['Air fryer', 0.3, 0.35, 0.32, 'eletro', { y: 0.9 }], ['Torradeira', 0.3, 0.18, 0.2, 'eletro', { y: 0.9 }], ['Chaleira', 0.2, 0.2, 0.25, 'redondo', { y: 0.9 }],
    ['Sanduicheira', 0.25, 0.25, 0.1, 'eletro', { y: 0.9 }], ['Panela elétrica de arroz', 0.3, 0.3, 0.25, 'redondo', { y: 0.9 }],
    ['Escorredor de louça', 0.45, 0.3, 0.3, 'geral', { y: 0.9 }], ['Tábua de corte', 0.4, 0.25, 0.02, 'mesa', { y: 0.9 }],
    ['Porta-temperos', 0.3, 0.1, 0.25, 'deco', { y: 0.9 }], ['Fruteira', 0.3, 0.3, 0.12, 'redondo', { y: 0.9 }], ['Galheteiro', 0.15, 0.1, 0.2, 'deco', { y: 0.9 }],
    ['Jogo de panelas', 0.6, 0.3, 0.2, 'redondo', { y: 0.9 }], ['Panos de prato', 0.4, 0.05, 0.4, 'deco', { y: 0.8 }],
  ]],
  ['banheiro', 'Banheiro', '🛁', [
    ['Vaso sanitário', 0.4, 0.65, 0.75, 'vaso'], ['Bidê', 0.4, 0.55, 0.4, 'vaso'], ['Pia de banheiro com gabinete', 0.6, 0.45, 0.85, 'pia'],
    ['Cuba de apoio', 0.45, 0.35, 0.15, 'pia', { y: 0.85 }], ['Espelho de banheiro', 0.6, 0.03, 0.8, 'geral', { y: 1.2, cor: '#bcd3e0' }],
    ['Espelheira', 0.6, 0.15, 0.7, 'armario', { y: 1.2 }], ['Box com chuveiro', 0.9, 0.9, 2.0, 'chuveiro'], ['Chuveiro aberto', 0.9, 0.9, 2.1, 'chuveiro'],
    ['Banheira', 1.7, 0.75, 0.55, 'banheira'], ['Banheira de hidromassagem', 1.8, 1.2, 0.6, 'banheira'], ['Ofurô', 1.0, 1.0, 0.8, 'redondo', { cor: '#a07850' }],
    ['Toalheiro', 0.6, 0.1, 0.1, 'deco', { y: 1.0 }], ['Porta-papel', 0.15, 0.1, 0.15, 'deco', { y: 0.7 }], ['Cesto de roupa suja', 0.4, 0.4, 0.6, 'redondo'],
    ['Tapete de banheiro', 0.7, 0.45, 0.01, 'tapete', { cor: '#5f87a8' }], ['Lixeirinha', 0.25, 0.25, 0.3, 'redondo'],
    ['Prateleira de banho', 0.4, 0.15, 0.03, 'estante', { y: 1.3 }], ['Nicho de parede', 0.6, 0.12, 0.3, 'estante', { y: 1.2 }],
  ]],
  ['lavanderia', 'Lavanderia', '🧺', [
    ['Máquina de lavar', 0.6, 0.65, 0.85, 'eletro'], ['Lava e seca', 0.6, 0.65, 0.85, 'eletro'], ['Secadora', 0.6, 0.65, 0.85, 'eletro'],
    ['Tanque', 0.6, 0.55, 0.85, 'pia'], ['Varal de chão', 1.5, 0.55, 1.0, 'geral'], ['Varal de teto', 1.2, 0.5, 0.1, 'geral', { y: 2.3 }],
    ['Tábua de passar', 1.2, 0.35, 0.85, 'geral'], ['Ferro de passar', 0.25, 0.12, 0.15, 'eletro', { y: 0.85 }], ['Armário de lavanderia', 0.6, 0.4, 1.8, 'armario'],
    ['Balde e vassoura', 0.4, 0.3, 1.2, 'deco'], ['Aspirador', 0.3, 0.3, 0.4, 'redondo'],
  ]],
  ['eletronicos', 'Eletrônicos', '📺', [
    ['TV 32"', 0.73, 0.08, 0.45, 'tv', { y: 0.55 }], ['TV 50"', 1.12, 0.08, 0.65, 'tv', { y: 0.55 }], ['TV 65"', 1.45, 0.08, 0.85, 'tv', { y: 0.55 }],
    ['Suporte de TV de parede', 0.4, 0.05, 0.3, 'deco', { y: 1.2 }], ['Videogame', 0.3, 0.25, 0.08, 'eletro', { y: 0.55 }], ['Controle de videogame', 0.15, 0.1, 0.05, 'deco', { y: 0.45 }],
    ['Computador (gabinete)', 0.22, 0.48, 0.48, 'eletro'], ['Notebook', 0.35, 0.25, 0.02, 'eletro', { y: 0.75 }], ['Monitor', 0.6, 0.2, 0.45, 'tv', { y: 0.75 }],
    ['Impressora', 0.45, 0.35, 0.2, 'eletro', { y: 0.75 }], ['Roteador', 0.2, 0.15, 0.05, 'eletro', { y: 0.75 }], ['Caixa de som', 0.25, 0.25, 0.4, 'eletro'],
    ['Soundbar', 0.9, 0.1, 0.08, 'tv', { y: 0.55 }], ['Toca-discos', 0.45, 0.35, 0.12, 'eletro', { y: 0.75 }], ['Aparelho de som', 0.45, 0.3, 0.3, 'eletro', { y: 0.55 }],
    ['Rádio', 0.25, 0.1, 0.15, 'eletro', { y: 0.55 }], ['Fone no suporte', 0.15, 0.15, 0.25, 'deco', { y: 0.75 }], ['Despertador', 0.12, 0.08, 0.1, 'deco', { y: 0.55 }],
    ['Relógio digital', 0.2, 0.08, 0.1, 'deco', { y: 0.55 }], ['Ventilador de mesa', 0.35, 0.25, 0.45, 'redondo', { y: 0.75 }], ['Ventilador de chão', 0.45, 0.45, 1.3, 'redondo'],
    ['Ventilador de teto', 1.2, 1.2, 0.3, 'luz', { y: 2.3 }], ['Ar-condicionado split', 0.85, 0.25, 0.3, 'eletro', { y: 2.2 }], ['Aquecedor', 0.5, 0.25, 0.6, 'eletro'],
    ['Umidificador', 0.25, 0.25, 0.35, 'redondo', { y: 0.55 }], ['Telefone', 0.2, 0.2, 0.1, 'deco', { y: 0.55 }], ['Tablet', 0.25, 0.18, 0.01, 'tv', { y: 0.75 }],
    ['Celular carregando', 0.08, 0.16, 0.01, 'tv', { y: 0.55 }],
  ]],
  ['iluminacao', 'Iluminação', '💡', [
    ['Lustre', 0.7, 0.7, 0.6, 'luz', { y: 1.9 }], ['Pendente', 0.35, 0.35, 0.4, 'luz', { y: 1.9 }], ['Plafon', 0.4, 0.4, 0.08, 'luz', { y: 2.6 }],
    ['Spot / trilho', 1.0, 0.08, 0.08, 'luz', { y: 2.6 }], ['Luminária embutida', 0.15, 0.15, 0.02, 'luz', { y: 2.68 }], ['Abajur', 0.3, 0.3, 0.5, 'luz', { y: 0.55 }],
    ['Luminária de mesa', 0.2, 0.2, 0.45, 'luz', { y: 0.75 }], ['Luminária de chão', 0.4, 0.4, 1.6, 'luz'], ['Luminária de leitura', 0.35, 0.35, 1.4, 'luz'],
    ['Arandela', 0.2, 0.15, 0.3, 'luz', { y: 1.8 }], ['Fita de LED', 1.0, 0.02, 0.01, 'luz', { y: 2.6 }], ['Cordão de luzinhas', 2.0, 0.02, 0.02, 'luz', { y: 2.2 }],
    ['Letreiro neon', 0.6, 0.03, 0.3, 'luz', { y: 1.6, cor: '#e85ad8' }], ['Luz noturna', 0.08, 0.05, 0.08, 'luz', { y: 0.3 }],
    ['Luminária de jardim', 0.2, 0.2, 0.5, 'luz'], ['Poste de luz', 0.3, 0.3, 3.0, 'luz'], ['Refletor', 0.3, 0.2, 0.25, 'luz', { y: 2.5 }], ['Lampião', 0.2, 0.2, 1.5, 'luz'],
  ]],
  ['decoracao', 'Decoração', '🖼', [
    ['Quadro', 0.8, 0.04, 0.6, 'deco', { y: 1.3 }], ['Pôster', 0.5, 0.01, 0.7, 'deco', { y: 1.3 }], ['Moldura de fotos', 0.3, 0.03, 0.4, 'deco', { y: 1.4 }],
    ['Mural de cortiça', 0.9, 0.02, 0.6, 'deco', { y: 1.3 }], ['Mapa', 1.0, 0.01, 0.7, 'deco', { y: 1.3 }], ['Relógio de parede', 0.35, 0.04, 0.35, 'redondo', { y: 1.8 }],
    ['Troféu', 0.15, 0.15, 0.35, 'deco', { y: 1.0 }], ['Prateleira de colecionáveis', 0.8, 0.25, 1.2, 'estante', { y: 0.8 }],
    ['Planta pequena', 0.2, 0.2, 0.3, 'planta', { y: 0.75 }], ['Planta média', 0.4, 0.4, 0.8, 'planta'], ['Planta grande', 0.7, 0.7, 1.8, 'planta'],
    ['Planta pendurada', 0.35, 0.35, 0.5, 'planta', { y: 1.8 }], ['Cacto', 0.3, 0.3, 0.9, 'planta'], ['Suculenta', 0.12, 0.12, 0.12, 'planta', { y: 0.75 }],
    ['Vaso de flores', 0.2, 0.2, 0.4, 'planta', { y: 0.75 }], ['Horta de temperos', 0.6, 0.25, 0.25, 'planta', { y: 0.9 }], ['Escultura', 0.3, 0.3, 0.6, 'deco', { y: 0.85 }],
    ['Vaso decorativo', 0.2, 0.2, 0.35, 'redondo', { y: 0.85 }], ['Vela', 0.08, 0.08, 0.15, 'redondo', { y: 0.45 }], ['Castiçal', 0.1, 0.1, 0.3, 'redondo', { y: 0.75 }],
    ['Livro decorativo', 0.25, 0.18, 0.05, 'deco', { y: 0.45 }], ['Almofada', 0.45, 0.45, 0.15, 'deco', { y: 0.45 }], ['Manta', 0.6, 0.4, 0.05, 'deco', { y: 0.45 }],
    ['Porta-retratos', 0.15, 0.03, 0.2, 'deco', { y: 0.55 }], ['Globo', 0.3, 0.3, 0.45, 'redondo', { y: 0.75 }], ['Aquário', 1.0, 0.4, 0.5, 'piscina', { y: 0.7 }],
    ['Gaiola', 0.4, 0.4, 0.6, 'redondo', { y: 0.8 }], ['Tapete pequeno', 1.0, 0.6, 0.01, 'tapete'], ['Tapete médio', 2.0, 1.4, 0.01, 'tapete', { id: 'tapete' }],
    ['Tapete grande', 3.0, 2.0, 0.01, 'tapete'], ['Tapete redondo', 1.6, 1.6, 0.01, 'redondo', { cor: '#b5654d' }], ['Passadeira', 2.5, 0.6, 0.01, 'tapete'],
    ['Capacho', 0.6, 0.4, 0.01, 'tapete', { cor: '#8a6a45' }], ['Cortina', 1.5, 0.1, 2.4, 'deco', { y: 0.15, cor: '#9b8bb0' }],
    ['Persiana', 1.2, 0.05, 1.3, 'deco', { y: 1.0, cor: '#d6d0c4' }], ['Blackout', 1.5, 0.1, 2.4, 'deco', { y: 0.15, cor: '#3f4654' }],
    ['Varão de cortina', 1.8, 0.05, 0.05, 'deco', { y: 2.55 }], ['Lareira', 1.2, 0.4, 1.0, 'eletro', { cor: '#8b6f5a' }], ['Lareira elétrica', 1.0, 0.25, 0.6, 'eletro'],
    ['Lenha', 0.5, 0.3, 0.3, 'geral', { cor: '#7a5434' }], ['Livros empilhados', 0.3, 0.22, 0.2, 'deco'], ['Revistas', 0.3, 0.22, 0.03, 'deco', { y: 0.4 }],
    ['Roupas jogadas', 0.6, 0.5, 0.1, 'deco', { cor: '#7d8fb3' }], ['Sapatos', 0.3, 0.3, 0.12, 'deco'], ['Mochila', 0.35, 0.25, 0.45, 'deco', { cor: '#4a6b8a' }],
    ['Caixas de mudança', 0.5, 0.4, 0.4, 'geral', { cor: '#b9935f' }], ['Louça suja', 0.4, 0.3, 0.15, 'deco', { y: 0.9 }],
    ['Controle remoto', 0.05, 0.18, 0.02, 'tv', { y: 0.45 }], ['Xícara de café', 0.1, 0.1, 0.1, 'redondo', { y: 0.75 }],
  ]],
  ['infantil', 'Infantil', '🧸', [
    ['Cadeirão de comer', 0.6, 0.75, 1.05, 'cadeira'], ['Cercadinho', 1.0, 1.0, 0.75, 'geral'], ['Casinha infantil', 1.2, 1.0, 1.3, 'geral', { cor: '#d98c6a' }],
    ['Tenda infantil', 1.1, 1.1, 1.6, 'redondo', { cor: '#e0b45a' }], ['Escorregador', 1.5, 0.6, 1.0, 'geral', { cor: '#d9534f' }],
    ['Mesa e cadeirinha infantil', 0.6, 0.6, 0.5, 'mesa'], ['Cavalinho de balanço', 0.7, 0.3, 0.6, 'geral'], ['Ursinho', 0.3, 0.25, 0.4, 'redondo', { cor: '#a5774f' }],
    ['Blocos de brinquedo', 0.4, 0.4, 0.1, 'deco', { cor: '#d9b44a' }], ['Carrinho de bebê', 0.6, 0.9, 1.05, 'geral'],
  ]],
  ['lazer', 'Lazer', '🎮', [
    ['Estante de jogos', 1.0, 0.35, 1.5, 'estante'], ['Mesa de sinuca', 2.5, 1.4, 0.8, 'jogo'], ['Pebolim', 1.4, 0.75, 0.9, 'jogo'],
    ['Pingue-pongue', 2.74, 1.53, 0.76, 'jogo', { cor: '#2a5f9e' }], ['Fliperama', 0.7, 0.8, 1.7, 'eletro', { cor: '#5b3fa0' }],
    ['Alvo de dardo', 0.5, 0.05, 0.5, 'redondo', { y: 1.5 }], ['Piano', 1.5, 0.6, 1.3, 'armario', { cor: '#24272d' }], ['Teclado musical', 1.3, 0.4, 0.8, 'mesa'],
    ['Violão no suporte', 0.4, 0.35, 1.0, 'deco'], ['Bateria', 1.6, 1.3, 1.2, 'redondo'], ['Cavalete de pintura', 0.6, 0.6, 1.6, 'geral'],
    ['Máquina de costura', 0.5, 0.4, 0.8, 'mesa'], ['Telescópio', 0.6, 0.6, 1.4, 'redondo'], ['Esteira', 0.8, 1.8, 1.4, 'geral'],
    ['Bicicleta ergométrica', 0.55, 1.1, 1.3, 'geral'], ['Banco de musculação', 1.2, 0.6, 0.5, 'mesa'], ['Saco de pancada', 0.4, 0.4, 1.5, 'redondo', { y: 0.5 }],
    ['Tapete de yoga', 0.6, 1.8, 0.01, 'tapete', { cor: '#6aa0a0' }], ['Espelho de academia', 1.5, 0.03, 1.8, 'geral', { y: 0.2, cor: '#bcd3e0' }],
  ]],
  ['escritorio', 'Escritório', '💻', [
    ['Escrivaninha', 1.2, 0.6, 0.75, 'mesa'], ['Mesa em L', 1.6, 1.4, 0.75, 'L', { cor: '#8a5a3b' }], ['Mesa gamer', 1.4, 0.7, 0.75, 'mesa', { id: 'mesapc', cor: '#2f2f35' }],
    ['Cadeira de escritório', 0.6, 0.6, 1.1, 'cadeira'], ['Cadeira gamer', 0.7, 0.7, 1.3, 'cadeira', { cor: '#b33a3a' }], ['Arquivo de gavetas', 0.45, 0.6, 0.7, 'armario'],
    ['Quadro branco', 1.2, 0.03, 0.9, 'deco', { y: 1.1, cor: '#eef0f2' }], ['Fragmentadora', 0.35, 0.25, 0.6, 'eletro'], ['Bebedouro', 0.35, 0.35, 1.1, 'eletro'],
    ['Cesto de lixo', 0.3, 0.3, 0.35, 'redondo'], ['Divisória de baia', 1.2, 0.05, 1.2, 'geral'],
  ]],
  ['externa', 'Área externa', '🌳', [
    ['Mesa de jardim', 1.0, 1.0, 0.75, 'redondo'], ['Cadeira de jardim', 0.55, 0.6, 0.85, 'cadeira'], ['Banco de jardim', 1.5, 0.6, 0.8, 'sofa', { cor: '#8a5a3b' }],
    ['Mesa de piquenique', 1.8, 1.5, 0.75, 'mesa'], ['Espreguiçadeira', 0.7, 1.9, 0.4, 'cama', { cor: '#e8e2d6' }], ['Cadeira de praia', 0.6, 0.8, 0.8, 'cadeira', { cor: '#4a90c2' }],
    ['Rede', 0.9, 3.0, 1.0, 'tapete', { cor: '#d9a35a' }], ['Balanço de varanda', 1.3, 0.7, 1.8, 'sofa'], ['Guarda-sol', 1.8, 1.8, 2.2, 'redondo', { cor: '#d9534f' }],
    ['Ombrelone', 3.0, 3.0, 2.5, 'redondo', { cor: '#e8e2d6' }], ['Pergolado', 3.0, 3.0, 2.5, 'geral', { cor: '#8a6a45' }],
    ['Churrasqueira de alvenaria', 1.2, 0.7, 2.0, 'fogao', { cor: '#a5523a' }], ['Churrasqueira portátil', 0.6, 0.4, 0.9, 'fogao'],
    ['Forno de pizza', 1.2, 1.2, 1.6, 'redondo', { cor: '#a5523a' }], ['Bar de piscina', 2.0, 0.6, 1.1, 'mesa'], ['Piscina', 6.0, 3.0, 0.05, 'piscina'],
    ['Borda de piscina', 6.6, 3.6, 0.04, 'tapete', { cor: '#cfc6b4' }], ['Escada de piscina', 0.5, 0.3, 1.0, 'geral'], ['Boia', 1.0, 1.0, 0.2, 'redondo', { cor: '#f2c14e' }],
    ['Hidromassagem externa', 2.0, 2.0, 0.9, 'banheira'], ['Chuveirão', 0.4, 0.4, 2.2, 'chuveiro'], ['Fonte', 1.2, 1.2, 1.0, 'redondo', { cor: '#8fb8d0' }],
    ['Lago', 3.0, 2.0, 0.03, 'piscina'], ['Árvore', 3.0, 3.0, 5.0, 'arvore'], ['Arbusto', 1.0, 1.0, 1.0, 'planta'], ['Cerca viva', 3.0, 0.6, 1.5, 'planta'],
    ['Flores', 0.8, 0.4, 0.4, 'planta', { cor: '#c45a8a' }], ['Grama', 2.0, 2.0, 0.02, 'tapete', { cor: '#4f8a4b' }], ['Pedras', 0.6, 0.5, 0.3, 'redondo', { cor: '#8d9096' }],
    ['Caminho de pedras', 0.6, 3.0, 0.02, 'tapete', { cor: '#8d9096' }], ['Horta', 2.0, 1.0, 0.3, 'planta'], ['Canteiro', 1.5, 0.5, 0.3, 'planta'],
    ['Casinha de cachorro', 1.0, 0.8, 0.9, 'geral', { cor: '#a5774f' }], ['Comedouro', 0.4, 0.2, 0.1, 'redondo'], ['Bicicleta', 0.6, 1.7, 1.0, 'geral'],
    ['Carro', 1.8, 4.5, 1.5, 'carro'], ['Caixa de correio', 0.3, 0.4, 1.2, 'geral'], ['Lixeiras de coleta', 1.5, 0.5, 1.0, 'geral', { cor: '#3f8f5a' }],
  ]],
  ['estrutura', 'Estrutura', '🧱', [
    ['Coluna / pilar', 0.3, 0.3, 2.7, 'geral', { cor: '#c9c3b8' }], ['Meia parede', 1.0, 0.15, 1.2, 'geral', { cor: '#e6e1d8' }],
    ['Mureta', 1.0, 0.15, 1.0, 'geral', { cor: '#e6e1d8' }], ['Divisória de vidro', 1.0, 0.05, 2.4, 'geral', { cor: '#9fc4dc' }],
    ['Guarda-corpo', 1.0, 0.05, 1.1, 'geral', { cor: '#8d9096' }], ['Escada reta', 0.9, 3.0, 2.8, 'escada'], ['Escada caracol', 1.6, 1.6, 2.8, 'redondo', { cor: '#a89f90' }],
    ['Escada de mão', 0.5, 0.1, 2.0, 'geral'],
  ]],
  ['formas', 'Formas', '⬛', [
    ['Cubo', 1, 1, 1, 'cubo', { cor: '#8fa3bf' }], ['Bloco', 2, 1, 0.5, 'cubo', { cor: '#a7adb7' }], ['Placa', 2, 2, 0.05, 'cubo', { cor: '#c9c3b8' }],
    ['Cilindro', 1, 1, 1, 'cilindro', { cor: '#8fbfa3' }], ['Coluna redonda', 0.4, 0.4, 2.7, 'cilindro', { cor: '#d8d4cc' }],
    ['Esfera', 1, 1, 1, 'esfera', { cor: '#bf8fa3' }], ['Cone', 1, 1, 1.2, 'cone', { cor: '#bfa38f' }],
    ['Pirâmide', 1, 1, 1, 'piramide', { cor: '#c4b07a' }], ['Prisma triangular', 1, 1, 1, 'prisma', { cor: '#9a8fbf' }],
  ]],
]

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const CATEGORIAS = CATS.map(([id, nome, icone]) => ({ id, nome, icone }))

export const CATALOGO = [
  { tipo: 'rampa', nome: 'Rampa', l: 1.2, p: 3.0, a: 0.5, cor: '#b8b2a7', forma: 'rampa', y: 0, obra: true },
  ...CATS.flatMap(([cat, , , linhas]) =>
    linhas.map(([nome, l, p, a, forma, o = {}]) => ({ tipo: o.id || slug(nome), nome, l, p, a, forma, cat, y: o.y || 0, cor: o.cor || COR[forma] }))),
]

export const porTipo = Object.fromEntries(CATALOGO.map((c) => [c.tipo, c]))

// Coisas da obra (não são móveis). l = largura, a = altura do vão, peitoril = altura do chão até o vão
export const ABERTURAS = {
  porta: { nome: 'Porta', l: 0.8, a: 2.1, peitoril: 0 },
  janela: { nome: 'Janela', l: 1.2, a: 1.2, peitoril: 1.0 },
}

// Tipos de porta e janela com o tamanho padrão de cada um
export const VARIANTES = {
  porta: {
    comum: { nome: 'Comum', l: 0.8, a: 2.1 }, dupla: { nome: 'Dupla', l: 1.6, a: 2.1 }, correr: { nome: 'De correr', l: 1.6, a: 2.1 },
    vidro: { nome: 'De vidro', l: 0.9, a: 2.1 }, garagem: { nome: 'Garagem', l: 2.6, a: 2.2 }, arco: { nome: 'Arco (sem porta)', l: 0.9, a: 2.1 },
  },
  janela: {
    correr: { nome: 'De correr', l: 1.2, a: 1.2, peitoril: 1.0 }, basculante: { nome: 'Basculante', l: 0.6, a: 0.6, peitoril: 1.5 },
    maximar: { nome: 'Maxim-ar', l: 0.8, a: 0.6, peitoril: 1.4 }, fixa: { nome: 'Fixa', l: 1.0, a: 1.0, peitoril: 1.0 },
    sacada: { nome: 'Janela-porta (sacada)', l: 1.6, a: 2.1, peitoril: 0 },
  },
}
export const varianteDe = (ab) => ab.variante || (ab.tipo === 'porta' ? 'comum' : 'correr')
// medidas finais de uma porta/janela: padrão do tipo < padrão da variante < o que o usuário editou
export function medidas(ab) {
  const m = { ...ABERTURAS[ab.tipo], ...VARIANTES[ab.tipo]?.[varianteDe(ab)] }
  for (const k of ['l', 'a', 'peitoril']) if (Number.isFinite(ab[k])) m[k] = ab[k]
  return m
}

// Pisos para os cômodos
export const PISOS = {
  madeira: { nome: 'Madeira', cor: '#a8774d' }, laminado: { nome: 'Laminado', cor: '#c49a6c' }, porcelanato: { nome: 'Porcelanato', cor: '#d8d4cc' },
  frio: { nome: 'Piso frio', cor: '#c3ccd4' }, ceramica: { nome: 'Cerâmica', cor: '#c98f6b' }, carpete: { nome: 'Carpete', cor: '#7d8296' },
  cimento: { nome: 'Cimento queimado', cor: '#8f908c' }, pedra: { nome: 'Pedra', cor: '#857e72' }, grama: { nome: 'Grama', cor: '#4f8a4b' },
  areia: { nome: 'Areia', cor: '#d9c48f' },
}

// medidas finais de um móvel colocado: as do catálogo, trocadas pelo que o usuário editou nele
export function dimsItem(i) {
  const c = porTipo[i?.tipo]
  if (!c) return null
  const m = { ...c }
  for (const k of ['l', 'p', 'a', 'y']) if (Number.isFinite(i[k])) m[k] = i[k]
  if (typeof i.pintura === 'string') m.cor = i.pintura
  return m
}

// Acabamento das paredes (cor no 3D; tinta usa a cor escolhida)
export const ACABAMENTOS = {
  reboco: { nome: 'Reboco branco', cor: '#f2efe9' }, tinta: { nome: 'Tinta (escolha a cor)', cor: '#d9cfc0' },
  azulejo: { nome: 'Azulejo', cor: '#dfe8ee' }, tijolinho: { nome: 'Tijolinho', cor: '#b5654d' }, madeira: { nome: 'Painel de madeira', cor: '#a8774d' },
  pedra: { nome: 'Pedra', cor: '#8d8679' }, concreto: { nome: 'Concreto aparente', cor: '#9a9a96' },
}
export const corDaParede = (w) => (w.acabamento === 'tinta' && w.tinta) || ACABAMENTOS[w.acabamento]?.cor || ACABAMENTOS.reboco.cor
