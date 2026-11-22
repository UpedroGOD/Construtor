// Modelos 3D detalhados para cada objeto - correspondem aos desenhos 2D
// Prioridade: 2D perfeito primeiro, 3D para visualização

import * as THREE from 'three'

// Sistema de materiais padrão
export const MATERIAIS = {
  sofa: new THREE.MeshStandardMaterial({ color: 0x4a5568 }),
  cama: new THREE.MeshStandardMaterial({ color: 0xd9cfc0 }),
  mesa: new THREE.MeshStandardMaterial({ color: 0x8a5a3b }),
  armario: new THREE.MeshStandardMaterial({ color: 0xd8cfc0 }),
  eletro: new THREE.MeshStandardMaterial({ color: 0xc9ced6 }),
  fogao: new THREE.MeshStandardMaterial({ color: 0xb9bfc8 }),
  tv: new THREE.MeshStandardMaterial({ color: 0x3a3f48 }),
  pia: new THREE.MeshStandardMaterial({ color: 0xdfe6ec }),
  vaso: new THREE.MeshStandardMaterial({ color: 0xeef2f5 }),
  planta: new THREE.MeshStandardMaterial({ color: 0x4f8a4b }),
  tapete: new THREE.MeshStandardMaterial({ color: 0xb5654d }),
  madeira: new THREE.MeshStandardMaterial({ color: 0xa8774d }),
  geral: new THREE.MeshStandardMaterial({ color: 0x9aa1ab }),
  porta: new THREE.MeshStandardMaterial({ color: 0x8a5a3b }),
  janela: new THREE.MeshStandardMaterial({ color: 0x9fd3ff, transparent: true, opacity: 0.35 }),
  parede: new THREE.MeshStandardMaterial({ color: 0xf2efe9 }),
  piso: new THREE.MeshStandardMaterial({ color: 0xdcd6cc }),
  chuveiro: new THREE.MeshStandardMaterial({ color: 0x9fc4dc }),
  banheira: new THREE.MeshStandardMaterial({ color: 0xe6edf2 }),
  luxo: new THREE.MeshStandardMaterial({ color: 0xe8c45a }),
  piscina: new THREE.MeshStandardMaterial({ color: 0x3d93d1 }),
  arvore: new THREE.MeshStandardMaterial({ color: 0x3e7d3a }),
  escada: new THREE.MeshStandardMaterial({ color: 0xa89f90 }),
}

// Cria um grupo 3D para cada tipo de objeto
// Cada objeto tem geometria detalhada correspondente ao desenho 2D

// ========= ASSENTOS =========

export function modeloSofa2(l, p, a, cor = '#4a5568') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Base do sofá
  const baseGeo = new THREE.BoxGeometry(l, p * 0.15, p)
  const base = new THREE.Mesh(baseGeo, mat)
  base.position.y = p * 0.075
  base.castShadow = true
  base.receiveShadow = true
  grupo.add(base)

  // Encosto
  const encostoGeo = new THREE.BoxGeometry(l, a, p * 0.3)
  const encosto = new THREE.Mesh(encostoGeo, mat)
  encosto.position.y = p * 0.15 + a / 2
  encosto.position.z = -p * 0.35
  encosto.castShadow = true
  encosto.receiveShadow = true
  grupo.add(encosto)

  // Braços (2)
  const braçoGeo = new THREE.BoxGeometry(0.1, a * 0.8, p * 0.3)
  for (const x of [-l/2 + 0.05, l/2 - 0.05]) {
    const braço = new THREE.Mesh(braçoGeo, mat)
    braço.position.set(x, p * 0.15 + a * 0.4, -p * 0.35)
    braço.castShadow = true
    braço.receiveShadow = true
    grupo.add(braço)
  }

  // Almofadas
  const almofadaGeo = new THREE.BoxGeometry(l * 0.45, a * 0.6, p * 0.25)
  for (const x of [-l/4, l/4]) {
    const almofada = new THREE.Mesh(almofadaGeo, mat)
    almofada.position.set(x, p * 0.15 + a * 0.3, -p * 0.4)
    almofada.castShadow = true
    almofada.receiveShadow = true
    grupo.add(almofada)
  }

  return grupo
}

export function modeloSofa3(l, p, a, cor = '#4a5568') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Base
  const baseGeo = new THREE.BoxGeometry(l, p * 0.15, p)
  const base = new THREE.Mesh(baseGeo, mat)
  base.position.y = p * 0.075
  base.castShadow = true
  base.receiveShadow = true
  grupo.add(base)

  // Encosto
  const encostoGeo = new THREE.BoxGeometry(l, a, p * 0.3)
  const encosto = new THREE.Mesh(encostoGeo, mat)
  encosto.position.y = p * 0.15 + a / 2
  encosto.position.z = -p * 0.35
  encosto.castShadow = true
  encosto.receiveShadow = true
  grupo.add(encosto)

  // Braços
  const braçoGeo = new THREE.BoxGeometry(0.1, a * 0.8, p * 0.3)
  for (const x of [-l/2 + 0.05, l/2 - 0.05]) {
    const braço = new THREE.Mesh(braçoGeo, mat)
    braço.position.set(x, p * 0.15 + a * 0.4, -p * 0.35)
    braço.castShadow = true
    braço.receiveShadow = true
    grupo.add(braço)
  }

  // 3 Almofadas
  const almofadaGeo = new THREE.BoxGeometry(l * 0.3, a * 0.6, p * 0.25)
  for (const x of [-l/3, 0, l/3]) {
    const almofada = new THREE.Mesh(almofadaGeo, mat)
    almofada.position.set(x, p * 0.15 + a * 0.3, -p * 0.4)
    almofada.castShadow = true
    almofada.receiveShadow = true
    grupo.add(almofada)
  }

  return grupo
}

export function modeloSofaCanto(l, p, a, cor = '#4a5568') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })
  const braço = p * 0.3

  // Seção horizontal
  const hGeo = new THREE.BoxGeometry(l - braço, p * 0.15, p)
  const hBase = new THREE.Mesh(hGeo, mat)
  hBase.position.set(-braço/2, p * 0.075, 0)
  hBase.castShadow = true
  hBase.receiveShadow = true
  grupo.add(hBase)

  const hEncostoGeo = new THREE.BoxGeometry(l - braço, a, p * 0.3)
  const hEncosto = new THREE.Mesh(hEncostoGeo, mat)
  hEncosto.position.set(-braço/2, p * 0.15 + a/2, -p*0.35)
  hEncosto.castShadow = true
  hEncosto.receiveShadow = true
  grupo.add(hEncosto)

  // Seção vertical
  const vGeo = new THREE.BoxGeometry(p * 0.15, p * 0.15, p - braço)
  const vBase = new THREE.Mesh(vGeo, mat)
  vBase.position.set(l/2 - braço/2, p * 0.075, -braço/2)
  vBase.castShadow = true
  vBase.receiveShadow = true
  grupo.add(vBase)

  const vEncostoGeo = new THREE.BoxGeometry(p * 0.3, a, p - braço)
  const vEncosto = new THREE.Mesh(vEncostoGeo, mat)
  vEncosto.position.set(l/2 - braço/2, p * 0.15 + a/2, -braço/2)
  vEncosto.castShadow = true
  vEncosto.receiveShadow = true
  grupo.add(vEncosto)

  return grupo
}

export function modeloPoltrona(l, p, a, cor = '#a0703f') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Assento
  const assentoGeo = new THREE.BoxGeometry(l, p * 0.15, p)
  const assento = new THREE.Mesh(assentoGeo, mat)
  assento.position.y = p * 0.075
  assento.castShadow = true
  assento.receiveShadow = true
  grupo.add(assento)

  // Encosto
  const encostoGeo = new THREE.BoxGeometry(l * 0.9, a * 0.8, p * 0.3)
  const encosto = new THREE.Mesh(encostoGeo, mat)
  encosto.position.set(0, p * 0.15 + a * 0.4, -p*0.35)
  encosto.castShadow = true
  encosto.receiveShadow = true
  grupo.add(encosto)

  // Pernas (4)
  const pernaGeo = new THREE.BoxGeometry(0.05, p * 0.3, 0.05)
  for (const x of [-l/2 + 0.05, l/2 - 0.05]) {
    for (const z of [-p/2 + 0.05, p/2 - 0.05]) {
      const perna = new THREE.Mesh(pernaGeo, mat)
      perna.position.set(x, -p * 0.15, z)
      perna.castShadow = true
      perna.receiveShadow = true
      grupo.add(perna)
    }
  }

  return grupo
}

export function modeloCadeira(l, p, a, cor = '#a0703f') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Assento
  const assentoGeo = new THREE.BoxGeometry(l, p * 0.08, p)
  const assento = new THREE.Mesh(assentoGeo, mat)
  assento.position.y = p * 0.04
  assento.castShadow = true
  assento.receiveShadow = true
  grupo.add(assento)

  // Encosto
  const encostoGeo = new THREE.BoxGeometry(l * 0.8, a * 0.8, 0.05)
  const encosto = new THREE.Mesh(encostoGeo, mat)
  encosto.position.set(0, p * 0.04 + a * 0.4, p/2 - 0.05)
  encosto.castShadow = true
  encosto.receiveShadow = true
  grupo.add(encosto)

  // Pernas
  const pernaGeo = new THREE.BoxGeometry(0.03, p * 0.4, 0.03)
  for (const x of [-l/2 + 0.02, l/2 - 0.02]) {
    for (const z of [-p/2 + 0.02, p/2 - 0.02]) {
      const perna = new THREE.Mesh(pernaGeo, mat)
      perna.position.set(x, -p * 0.2, z)
      perna.castShadow = true
      perna.receiveShadow = true
      grupo.add(perna)
    }
  }

  return grupo
}

export function modeloBanqueta(l, p, a, cor = '#8a5a3b') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Assento
  const assentoGeo = new THREE.BoxGeometry(l, p * 0.1, p)
  const assento = new THREE.Mesh(assentoGeo, mat)
  assento.position.y = p * 0.05
  assento.castShadow = true
  assento.receiveShadow = true
  grupo.add(assento)

  // Pés (4)
  const peGeo = new THREE.BoxGeometry(0.04, a * 0.8, 0.04)
  for (const x of [-l/2 + 0.02, l/2 - 0.02]) {
    for (const z of [-p/2 + 0.02, p/2 - 0.02]) {
      const pe = new THREE.Mesh(peGeo, mat)
      pe.position.set(x, -a * 0.4, z)
      pe.castShadow = true
      pe.receiveShadow = true
      grupo.add(pe)
    }
  }

  return grupo
}

// ========= MESAS =========

export function modeloMesaQuadrada(l, p, a, cor = '#8a5a3b') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Tampo
  const tampoGeo = new THREE.BoxGeometry(l, a * 0.2, p)
  const tampo = new THREE.Mesh(tampoGeo, mat)
  tampo.position.y = a - a * 0.1
  tampo.castShadow = true
  tampo.receiveShadow = true
  grupo.add(tampo)

  // Pés (4)
  const peGeo = new THREE.BoxGeometry(0.05, a * 0.8, 0.05)
  for (const x of [-l/2 + 0.05, l/2 - 0.05]) {
    for (const z of [-p/2 + 0.05, p/2 - 0.05]) {
      const pe = new THREE.Mesh(peGeo, mat)
      pe.position.set(x, a * 0.4, z)
      pe.castShadow = true
      pe.receiveShadow = true
      grupo.add(pe)
    }
  }

  return grupo
}

export function modeloMesaRedonda(d, a, cor = '#9c7a5b') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })
  const r = d / 2

  // Tampo circular
  const tampoGeo = new THREE.CylinderGeometry(r, r, a * 0.2, 32)
  const tampo = new THREE.Mesh(tampoGeo, mat)
  tampo.position.y = a - a * 0.1
  tampo.castShadow = true
  tampo.receiveShadow = true
  grupo.add(tampo)

  // Pé central
  const peGeo = new THREE.CylinderGeometry(0.05, 0.05, a * 0.8, 16)
  const pe = new THREE.Mesh(peGeo, mat)
  pe.position.y = a * 0.4
  pe.castShadow = true
  pe.receiveShadow = true
  grupo.add(pe)

  return grupo
}

export function modeloMesaJantar(l, p, a, cor = '#8a5a3b') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Tampo
  const tampoGeo = new THREE.BoxGeometry(l, a * 0.2, p)
  const tampo = new THREE.Mesh(tampoGeo, mat)
  tampo.position.y = a - a * 0.1
  tampo.castShadow = true
  tampo.receiveShadow = true
  grupo.add(tampo)

  // Pés (4)
  const peGeo = new THREE.BoxGeometry(0.06, a * 0.8, 0.06)
  for (const x of [-l/2 + 0.08, l/2 - 0.08]) {
    for (const z of [-p/2 + 0.08, p/2 - 0.08]) {
      const pe = new THREE.Mesh(peGeo, mat)
      pe.position.set(x, a * 0.4, z)
      pe.castShadow = true
      pe.receiveShadow = true
      grupo.add(pe)
    }
  }

  return grupo
}

export function modeloEscrivaninha(l, p, a, cor = '#8a5a3b') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Tampo
  const tampoGeo = new THREE.BoxGeometry(l, a * 0.15, p)
  const tampo = new THREE.Mesh(tampoGeo, mat)
  tampo.position.y = a - a * 0.075
  tampo.castShadow = true
  tampo.receiveShadow = true
  grupo.add(tampo)

  // Pés (4)
  const peGeo = new THREE.BoxGeometry(0.05, a * 0.85, 0.05)
  for (const x of [-l/2 + 0.08, l/2 - 0.08]) {
    for (const z of [-p/2 + 0.08, p/2 - 0.08]) {
      const pe = new THREE.Mesh(peGeo, mat)
      pe.position.set(x, a * 0.425, z)
      pe.castShadow = true
      pe.receiveShadow = true
      grupo.add(pe)
    }
  }

  // Gaveteiro lateral
  const gavetaGeo = new THREE.BoxGeometry(l * 0.3, a * 0.6, p * 0.5)
  const gaveta = new THREE.Mesh(gavetaGeo, mat)
  gaveta.position.set(-l/2 + l * 0.15, a * 0.3, 0)
  gaveta.castShadow = true
  gaveta.receiveShadow = true
  grupo.add(gaveta)

  return grupo
}

export function modeloMesaCentro(l, p, a, cor = '#8a5a3b') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Tampo
  const tampoGeo = new THREE.BoxGeometry(l, a * 0.2, p)
  const tampo = new THREE.Mesh(tampoGeo, mat)
  tampo.position.y = a - a * 0.1
  tampo.castShadow = true
  tampo.receiveShadow = true
  grupo.add(tampo)

  // Pés (4)
  const peGeo = new THREE.BoxGeometry(0.04, a * 0.8, 0.04)
  for (const x of [-l/2 + 0.05, l/2 - 0.05]) {
    for (const z of [-p/2 + 0.05, p/2 - 0.05]) {
      const pe = new THREE.Mesh(peGeo, mat)
      pe.position.set(x, a * 0.4, z)
      pe.castShadow = true
      pe.receiveShadow = true
      grupo.add(pe)
    }
  }

  return grupo
}

export function modeloCriadoMudo(l, p, a, cor = '#d8cfc0') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Corpo
  const corpoGeo = new THREE.BoxGeometry(l, a, p)
  const corpo = new THREE.Mesh(corpoGeo, mat)
  corpo.position.y = a / 2
  corpo.castShadow = true
  corpo.receiveShadow = true
  grupo.add(corpo)

  // Gaveta
  const gavetaGeo = new THREE.BoxGeometry(l * 0.8, a * 0.4, p * 0.8)
  const gaveta = new THREE.Mesh(gavetaGeo, mat)
  gaveta.position.set(0, a * 0.3, 0)
  gaveta.castShadow = true
  gaveta.receiveShadow = true
  grupo.add(gaveta)

  return grupo
}

export function modeloPenteadeira(l, p, a, cor = '#d8cfc0') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Base
  const baseGeo = new THREE.BoxGeometry(l, a * 0.7, p)
  const base = new THREE.Mesh(baseGeo, mat)
  base.position.y = a * 0.35
  base.castShadow = true
  base.receiveShadow = true
  grupo.add(base)

  // Espelho
  const espelhoGeo = new THREE.BoxGeometry(l * 0.8, a * 0.4, 0.02)
  const espelho = new THREE.Mesh(espelhoGeo, new THREE.MeshStandardMaterial({ color: 0x4a5568 }))
  espelho.position.set(0, a * 0.85, p/2 - 0.02)
  grupo.add(espelho)

  return grupo
}

// ========= CAMAS =========

export function modeloCama(l, p, a, cor = '#d9cbb3') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Colchão
  const colchaoGeo = new THREE.BoxGeometry(l, p * 0.2, p)
  const colchao = new THREE.Mesh(colchaoGeo, mat)
  colchao.position.y = p * 0.1
  colchao.castShadow = true
  colchao.receiveShadow = true
  grupo.add(colchao)

  // Travesseiros (2)
  const travesseiroGeo = new THREE.BoxGeometry(l * 0.35, p * 0.15, p * 0.3)
  for (const x of [-l/4, l/4]) {
    const travesseiro = new THREE.Mesh(travesseiroGeo, mat)
    travesseiro.position.set(x, p * 0.275, -p * 0.35)
    travesseiro.castShadow = true
    travesseiro.receiveShadow = true
    grupo.add(travesseiro)
  }

  // Cabeceira
  const cabeceiraGeo = new THREE.BoxGeometry(l, a * 0.4, 0.05)
  const cabeceira = new THREE.Mesh(cabeceiraGeo, mat)
  cabeceira.position.set(0, p * 0.2 + a * 0.2, -p/2 + 0.05)
  cabeceira.castShadow = true
  cabeceira.receiveShadow = true
  grupo.add(cabeceira)

  return grupo
}

export function modeloBerco(l, p, a, cor = '#d9cbb3') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Colchão
  const colchaoGeo = new THREE.BoxGeometry(l, p * 0.15, p)
  const colchao = new THREE.Mesh(colchaoGeo, mat)
  colchao.position.y = p * 0.075
  colchao.castShadow = true
  colchao.receiveShadow = true
  grupo.add(colchao)

  // Grade
  const gradeGeo = new THREE.BoxGeometry(l * 0.9, a * 0.4, p * 0.9)
  const grade = new THREE.Mesh(gradeGeo, mat)
  grade.position.set(0, p * 0.15 + a * 0.2, 0)
  grade.castShadow = true
  grade.receiveShadow = true
  grupo.add(grade)

  // Barras da grade
  const barraGeo = new THREE.BoxGeometry(0.03, a * 0.2, p * 0.8)
  for (let i = 0; i < 4; i++) {
    const barra = new THREE.Mesh(barraGeo, mat)
    barra.position.set(-l/2 + l * 0.25 + i * l * 0.15, p * 0.15 + a * 0.2, 0)
    barra.castShadow = true
    barra.receiveShadow = true
    grupo.add(barra)
  }

  return grupo
}

export function modeloBeliche(l, p, a, cor = '#d9cbb3') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Cama inferior
  const camaInfGeo = new THREE.BoxGeometry(l, p * 0.15, p)
  const camaInf = new THREE.Mesh(camaInfGeo, mat)
  camaInf.position.y = p * 0.075
  camaInf.castShadow = true
  camaInf.receiveShadow = true
  grupo.add(camaInf)

  // Cama superior
  const camaSupGeo = new THREE.BoxGeometry(l, p * 0.15, p)
  const camaSup = new THREE.Mesh(camaSupGeo, mat)
  camaSup.position.set(0, p * 0.2 + a * 0.4, 0)
  camaSup.castShadow = true
  camaSup.receiveShadow = true
  grupo.add(camaSup)

  // Estrutura vertical
  const estruturaGeo = new THREE.BoxGeometry(0.05, a, p * 0.9)
  for (const x of [-l/2 + 0.05, l/2 - 0.05]) {
    const est = new THREE.Mesh(estruturaGeo, mat)
    est.position.set(x, a * 0.5, 0)
    est.castShadow = true
    est.receiveShadow = true
    grupo.add(est)
  }

  // Escada
  const escadaGeo = new THREE.BoxGeometry(0.2, a * 0.2, p * 0.4)
  const escada = new THREE.Mesh(escadaGeo, mat)
  escada.position.set(-l/2 + 0.2, a * 0.4, p/2 - 0.3)
  escada.castShadow = true
  escada.receiveShadow = true
  grupo.add(escada)

  return grupo
}

export function modeloGuardaRoupa(l, p, a, cor = '#d8cfc0') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })
  const numPortas = a > 2 ? 3 : 2
  const larguraPorta = l / numPortas

  // Corpo
  const corpoGeo = new THREE.BoxGeometry(l, a, p)
  const corpo = new THREE.Mesh(corpoGeo, mat)
  corpo.position.y = a / 2
  corpo.castShadow = true
  corpo.receiveShadow = true
  grupo.add(corpo)

  // Portas
  const portaGeo = new THREE.BoxGeometry(larguraPorta * 0.95, a * 0.95, p * 0.95)
  for (let i = 0; i < numPortas; i++) {
    const porta = new THREE.Mesh(portaGeo, mat)
    const x = -l/2 + (i + 0.5) * larguraPorta
    porta.position.set(x, a * 0.475, p/2 + 0.03)
    porta.castShadow = true
    porta.receiveShadow = true
    grupo.add(porta)
  }

  // Maçanetas
  const maçanetaGeo = new THREE.BoxGeometry(0.02, 0.05, 0.05)
  for (let i = 0; i < numPortas; i++) {
    const maçaneta = new THREE.Mesh(maçanetaGeo, mat)
    const x = -l/2 + (i + 0.5) * larguraPorta
    maçaneta.position.set(x, p/2 - p * 0.1, p/2 + 0.04)
    grupo.add(maçaneta)
  }

  return grupo
}

export function modeloComoda(l, p, a, cor = '#d8cfc0') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Corpo
  const corpoGeo = new THREE.BoxGeometry(l, a, p)
  const corpo = new THREE.Mesh(corpoGeo, mat)
  corpo.position.y = a / 2
  corpo.castShadow = true
  corpo.receiveShadow = true
  grupo.add(corpo)

  // Gavetas (3)
  const gavetaGeo = new THREE.BoxGeometry(l * 0.9, a * 0.25, p * 0.9)
  for (let i = 0; i < 3; i++) {
    const gaveta = new THREE.Mesh(gavetaGeo, mat)
    gaveta.position.set(0, a * (-0.35 + i * 0.33), p/2 + 0.03)
    gaveta.castShadow = true
    gaveta.receiveShadow = true
    grupo.add(gaveta)
  }

  return grupo
}

export function modeloEspelho(l, p, a, cor = '#4a5568') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Espelho
  const espelhoGeo = new THREE.BoxGeometry(l, a, 0.02)
  const espelho = new THREE.Mesh(espelhoGeo, new THREE.MeshStandardMaterial({ color: 0x4a5568 }))
  espelho.position.set(0, a / 2, p/2 - 0.02)
  grupo.add(espelho)

  return grupo
}

// ========= ARMAZENAMENTO =========

export function modeloEstante(l, p, a, cor = '#b98b5e') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })
  const numPrateleiras = 4

  // Estrutura lateral esquerda
  const ladoGeo = new THREE.BoxGeometry(0.05, a, p)
  const ladoE = new THREE.Mesh(ladoGeo, mat)
  ladoE.position.set(-l/2 + 0.025, a/2, 0)
  ladoE.castShadow = true
  ladoE.receiveShadow = true
  grupo.add(ladoE)

  const ladoD = new THREE.Mesh(ladoGeo, mat)
  ladoD.position.set(l/2 - 0.025, a/2, 0)
  ladoD.castShadow = true
  ladoD.receiveShadow = true
  grupo.add(ladoD)

  // Prateleiras
  const prateleiraGeo = new THREE.BoxGeometry(l * 0.9, 0.03, p * 0.9)
  for (let i = 0; i < numPrateleiras; i++) {
    const prat = new THREE.Mesh(prateleiraGeo, mat)
    prat.position.set(0, a * (-0.45 + i * 0.22), 0)
    prat.castShadow = true
    prat.receiveShadow = true
    grupo.add(prat)
  }

  return grupo
}

export function modeloRackTV(l, p, a, cor = '#d8cfc0') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Base
  const baseGeo = new THREE.BoxGeometry(l, a * 0.6, p)
  const base = new THREE.Mesh(baseGeo, mat)
  base.position.y = a * 0.3
  base.castShadow = true
  base.receiveShadow = true
  grupo.add(base)

  // Prateleira
  const pratGeo = new THREE.BoxGeometry(l * 0.9, 0.03, p * 0.8)
  const prat = new THREE.Mesh(pratGeo, mat)
  prat.position.set(0, a * 0.3, 0)
  prat.castShadow = true
  prat.receiveShadow = true
  grupo.add(prat)

  return grupo
}

// ========= COZINHA =========

export function modeloFogao(l, p, a, cor = '#b9bfc8') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Corpo
  const corpoGeo = new THREE.BoxGeometry(l, a, p)
  const corpo = new THREE.Mesh(corpoGeo, mat)
  corpo.position.y = a / 2
  corpo.castShadow = true
  corpo.receiveShadow = true
  grupo.add(corpo)

  // Queimadores (4)
  const queimadorGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16)
  for (const dx of [-0.2, 0.2]) {
    for (const dy of [-0.15, 0.15]) {
      const q = new THREE.Mesh(queimadorGeo, mat)
      q.position.set(dx, a * 0.55, dy)
      grupo.add(q)
    }
  }

  // Porta do forno
  const portaGeo = new THREE.BoxGeometry(l * 0.8, a * 0.35, p * 0.05)
  const porta = new THREE.Mesh(portaGeo, mat)
  porta.position.set(0, p * 0.15, p/2 + 0.03)
  porta.castShadow = true
  porta.receiveShadow = true
  grupo.add(porta)

  return grupo
}

export function modeloGeladeira(l, p, a, cor = '#c9ced6') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })
  const numPortas = l > 0.8 ? 2 : 1
  const larguraPorta = l / numPortas

  // Corpo
  const corpoGeo = new THREE.BoxGeometry(l, a, p)
  const corpo = new THREE.Mesh(corpoGeo, mat)
  corpo.position.y = a / 2
  corpo.castShadow = true
  corpo.receiveShadow = true
  grupo.add(corpo)

  // Portas
  const portaGeo = new THREE.BoxGeometry(larguraPorta * 0.95, a * 0.95, p * 0.95)
  for (let i = 0; i < numPortas; i++) {
    const porta = new THREE.Mesh(portaGeo, mat)
    porta.position.set(-l/2 + (i + 0.5) * larguraPorta, a * 0.475, p/2 + 0.03)
    porta.castShadow = true
    porta.receiveShadow = true
    grupo.add(porta)
  }

  // Maçaneta
  const maçanetaGeo = new THREE.BoxGeometry(0.02, 0.05, 0.05)
  const maçaneta = new THREE.Mesh(maçanetaGeo, mat)
  maçaneta.position.set(-l/2 + larguraPorta * 0.15, p * 0.35, p/2 + 0.04)
  grupo.add(maçaneta)

  return grupo
}

export function modeloPia(l, p, a, cor = '#dfe6ec') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Gabinete
  const gabineteGeo = new THREE.BoxGeometry(l, a * 0.7, p)
  const gabinete = new THREE.Mesh(gabineteGeo, mat)
  gabinete.position.y = a * 0.35
  gabinete.castShadow = true
  gabinete.receiveShadow = true
  grupo.add(gabinete)

  // Cuba
  const cubaGeo = new THREE.CylinderGeometry(l * 0.25, p * 0.35, a * 0.3, 32)
  const cuba = new THREE.Mesh(cubaGeo, mat)
  cuba.position.set(0, a * 0.15, p/2 - 0.05)
  cuba.rotation.x = Math.PI / 2
  cuba.castShadow = true
  cuba.receiveShadow = true
  grupo.add(cuba)

  // Torneira
  const torneiraGeo = new THREE.BoxGeometry(0.02, 0.02, p * 0.3)
  const torneira = new THREE.Mesh(torneiraGeo, mat)
  torneira.position.set(-l * 0.1, a * 0.6, p/2 - 0.15)
  grupo.add(torneira)

  return grupo
}

// ========= BANHEIRO =========

export function modeloVaso(l, p, a, cor = '#eef2f5') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Base
  const baseGeo = new THREE.BoxGeometry(l, a * 0.4, p * 0.4)
  const base = new THREE.Mesh(baseGeo, mat)
  base.position.y = a * 0.2
  base.castShadow = true
  base.receiveShadow = true
  grupo.add(base)

  // Assento
  const assentoGeo = new THREE.BoxGeometry(l, a * 0.1, p * 0.3)
  const assento = new THREE.Mesh(assentoGeo, mat)
  assento.position.y = a * 0.45
  assento.castShadow = true
  assento.receiveShadow = true
  grupo.add(assento)

  // Tampa
  const tampaGeo = new THREE.CylinderGeometry(l * 0.45, l * 0.45, a * 0.1, 32)
  const tampa = new THREE.Mesh(tampaGeo, mat)
  tampa.position.set(0, a * 0.5, p/2 - p*0.05)
  tampa.rotation.x = Math.PI / 2
  grupo.add(tampa)

  return grupo
}

export function modeloPiaBanheiro(l, p, a, cor = '#dfe6ec') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Gabinete
  const gabineteGeo = new THREE.BoxGeometry(l, a * 0.7, p * 0.6)
  const gabinete = new THREE.Mesh(gabineteGeo, mat)
  gabinete.position.set(0, a * 0.35, p/2 - p*0.2)
  gabinete.castShadow = true
  gabinete.receiveShadow = true
  grupo.add(gabinete)

  // Cuba
  const cubaGeo = new THREE.SphereGeometry(p * 0.25, 32, 32)
  const cuba = new THREE.Mesh(cubaGeo, mat)
  cuba.position.set(0, a * 0.25, p/2 - p*0.25)
  cuba.castShadow = true
  cuba.receiveShadow = true
  grupo.add(cuba)

  return grupo
}

export function modeloChuveiro(l, p, a, cor = '#9fc4dc') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Box
  const boxGeo = new THREE.BoxGeometry(l, a, p)
  const box = new THREE.Mesh(boxGeo, mat)
  box.position.y = a / 2
  grupo.add(box)

  // Chuveiro
  const chuveiroGeo = new THREE.CylinderGeometry(0.05, 0.05, p * 0.3, 16)
  const chuveiro = new THREE.Mesh(chuveiroGeo, mat)
  chuveiro.position.set(l * 0.2, a * 0.8, p * 0.2)
  chuveiro.rotation.x = Math.PI / 2
  grupo.add(chuveiro)

  return grupo
}

export function modeloBanheira(l, p, a, cor = '#e6edf2') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Banheira
  const banheiraGeo = new THREE.BoxGeometry(l, a, p)
  const banheira = new THREE.Mesh(banheiraGeo, mat)
  banheira.position.y = a / 2
  banheira.castShadow = true
  banheira.receiveShadow = true
  grupo.add(banheira)

  // Interior
  const interiorGeo = new THREE.BoxGeometry(l * 0.9, a * 0.5, p * 0.9)
  const interior = new THREE.Mesh(interiorGeo, mat)
  interior.position.y = a * 0.25
  interior.castShadow = true
  interior.receiveShadow = true
  grupo.add(interior)

  return grupo
}

// ========= ELETRÔNICOS =========

export function modeloTV(l, p, a, cor = '#3a3f48') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Tela
  const telaGeo = new THREE.BoxGeometry(l, a, 0.05)
  const tela = new THREE.Mesh(telaGeo, mat)
  tela.position.set(0, a / 2, p/2 + 0.03)
  tela.castShadow = true
  tela.receiveShadow = true
  grupo.add(tela)

  // Suporte
  const suporteGeo = new THREE.BoxGeometry(l * 0.4, a * 0.2, 0.05)
  const suporte = new THREE.Mesh(suporteGeo, mat)
  suporte.position.set(0, -a * 0.1, p/2 + 0.03)
  grupo.add(suporte)

  return grupo
}

export function modeloComputador(l, p, a, cor = '#3a3f48') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Gabinete
  const gabineteGeo = new THREE.BoxGeometry(l * 0.4, a, p * 0.5)
  const gabinete = new THREE.Mesh(gabineteGeo, mat)
  gabinete.position.set(-l/2 + l * 0.2, a / 2, 0)
  gabinete.castShadow = true
  gabinete.receiveShadow = true
  grupo.add(gabinete)

  // Monitor
  const monitorGeo = new THREE.BoxGeometry(l * 0.4, a * 0.7, 0.05)
  const monitor = new THREE.Mesh(monitorGeo, mat)
  monitor.position.set(l/2 - l * 0.2, a * 0.35, p/2 + 0.03)
  monitor.castShadow = true
  monitor.receiveShadow = true
  grupo.add(monitor)

  return grupo
}

export function modeloNotebook(l, p, a, cor = '#3a3f48') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Base
  const baseGeo = new THREE.BoxGeometry(l, a * 0.2, p)
  const base = new THREE.Mesh(baseGeo, mat)
  base.position.y = a * 0.1
  base.castShadow = true
  base.receiveShadow = true
  grupo.add(base)

  // Tela
  const telaGeo = new THREE.BoxGeometry(l, a * 0.5, 0.02)
  const tela = new THREE.Mesh(telaGeo, mat)
  tela.position.set(0, a * 0.45, p/2 + 0.02)
  grupo.add(tela)

  return grupo
}

// ========= ILUMINAÇÃO =========

export function modeloLuminaria(l, p, a, cor = '#e8c45a') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Luminária
  const luzGeo = new THREE.CylinderGeometry(l/2, l/2, a, 32)
  const luz = new THREE.Mesh(luzGeo, mat)
  luz.position.y = a / 2
  luz.castShadow = true
  luz.receiveShadow = true
  grupo.add(luz)

  // Suporte
  const suporteGeo = new THREE.BoxGeometry(0.05, 0.05, p * 0.5)
  const suporte = new THREE.Mesh(suporteGeo, mat)
  suporte.position.set(0, a + p * 0.25, 0)
  grupo.add(suporte)

  return grupo
}

export function modeloAbajur(l, p, a, cor = '#e8c45a') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Base
  const baseGeo = new THREE.BoxGeometry(l, a * 0.2, p)
  const base = new THREE.Mesh(baseGeo, mat)
  base.position.y = a * 0.1
  base.castShadow = true
  base.receiveShadow = true
  grupo.add(base)

  // Abajur
  const abajurGeo = new THREE.CylinderGeometry(l/2, l/2, a * 0.6, 32)
  const abajur = new THREE.Mesh(abajurGeo, mat)
  abajur.position.y = a * 0.5
  abajur.castShadow = true
  abajur.receiveShadow = true
  grupo.add(abajur)

  return grupo
}

// ========= DECORAÇÃO =========

export function modeloQuadro(l, p, a, cor = '#4a5568') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Quadro
  const quadroGeo = new THREE.BoxGeometry(l, a, 0.05)
  const quadro = new THREE.Mesh(quadroGeo, mat)
  quadro.position.set(0, a / 2, p/2 - 0.03)
  quadro.castShadow = true
  quadro.receiveShadow = true
  grupo.add(quadro)

  return grupo
}

export function modeloPlanta(l, p, a, cor = '#4f8a4b') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Vaso
  const vasoGeo = new THREE.CylinderGeometry(l*0.3, l*0.3, p * 0.4, 32)
  const vaso = new THREE.Mesh(vasoGeo, mat)
  vaso.position.set(0, p * 0.2, 0)
  vaso.castShadow = true
  vaso.receiveShadow = true
  grupo.add(vaso)

  // Planta
  const plantaGeo = new THREE.SphereGeometry(l * 0.4, 32, 32)
  const planta = new THREE.Mesh(plantaGeo, mat)
  planta.position.set(0, p * 0.6, 0)
  planta.castShadow = true
  planta.receiveShadow = true
  grupo.add(planta)

  return grupo
}

export function modeloTapete(l, p, a, cor = '#b5654d') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Tapete
  const tapeteGeo = new THREE.BoxGeometry(l, 0.02, p)
  const tapete = new THREE.Mesh(tapeteGeo, mat)
  tapete.position.y = 0.01
  tapete.receiveShadow = true
  grupo.add(tapete)

  return grupo
}

// ========= EXTERIOR =========

export function modeloCarro(l, p, a, cor = '#b23a3a') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Corpo
  const corpoGeo = new THREE.BoxGeometry(l, a, p)
  const corpo = new THREE.Mesh(corpoGeo, mat)
  corpo.position.y = a / 2
  corpo.castShadow = true
  corpo.receiveShadow = true
  grupo.add(corpo)

  // Janelas
  const janelaGeo = new THREE.BoxGeometry(l * 0.8, a * 0.5, p * 0.05)
  const janela = new THREE.Mesh(janelaGeo, new THREE.MeshStandardMaterial({ color: 0x4a5568 }))
  janela.position.set(0, a * 0.3, p/2 + 0.03)
  grupo.add(janela)

  // Rodas
  const rodaGeo = new THREE.CylinderGeometry(p * 0.2, p * 0.2, 0.1, 32)
  for (const x of [-l/4, l/4]) {
    for (const z of [-p/2 + 0.1, p/2 - 0.1]) {
      const roda = new THREE.Mesh(rodaGeo, mat)
      roda.position.set(x, 0, z)
      roda.rotation.z = Math.PI / 2
      roda.castShadow = true
      roda.receiveShadow = true
      grupo.add(roda)
    }
  }

  return grupo
}

export function modeloPiscina(l, p, a, cor = '#3d93d1') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Piscina
  const piscinaGeo = new THREE.BoxGeometry(l, a, p)
  const piscina = new THREE.Mesh(piscinaGeo, mat)
  piscina.position.y = a / 2
  piscina.receiveShadow = true
  grupo.add(piscina)

  return grupo
}

// ========= ESCADA =========

export function modeloEscada(l, p, a, cor = '#a89f90') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })
  const degraus = Math.max(3, Math.round(p / 0.3))
  const alturaDegrau = p / degraus

  // Degraus
  const degrauGeo = new THREE.BoxGeometry(l, alturaDegrau, p / degraus)
  for (let i = 0; i < degraus; i++) {
    const degrau = new THREE.Mesh(degrauGeo, mat)
    degrau.position.set(0, i * alturaDegrau, -p/2 + (i + 0.5) * p / degraus)
    degrau.castShadow = true
    degrau.receiveShadow = true
    grupo.add(degrau)
  }

  return grupo
}

// ========= ESTRUTURA =========

export function modeloColuna(l, p, a, cor = '#c9c3b8') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Coluna
  const colunaGeo = new THREE.BoxGeometry(l, a, p)
  const coluna = new THREE.Mesh(colunaGeo, mat)
  coluna.position.y = a / 2
  coluna.castShadow = true
  coluna.receiveShadow = true
  grupo.add(coluna)

  return grupo
}

export function modeloRampa(l, p, a, cor = '#b8b2a7') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  // Rampa (plano inclinado)
  const rampaGeo = new THREE.BoxGeometry(l, a, p)
  const rampa = new THREE.Mesh(rampaGeo, mat)
  rampa.position.y = a / 2
  rampa.rotation.x = Math.atan2(a, p)
  rampa.castShadow = true
  rampa.receiveShadow = true
  grupo.add(rampa)

  return grupo
}

// ========= FORMAS =========

export function modeloCubo(l, p, a, cor = '#8fa3bf') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  const geo = new THREE.BoxGeometry(l, a, p)
  const cubo = new THREE.Mesh(geo, mat)
  cubo.position.y = a / 2
  cubo.castShadow = true
  cubo.receiveShadow = true
  grupo.add(cubo)

  return grupo
}

export function modeloCilindro(l, p, a, cor = '#8fbfa3') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  const geo = new THREE.CylinderGeometry(l/2, l/2, a, 32)
  const cilindro = new THREE.Mesh(geo, mat)
  cilindro.position.y = a / 2
  cilindro.castShadow = true
  cilindro.receiveShadow = true
  grupo.add(cilindro)

  return grupo
}

export function modeloEsfera(l, p, a, cor = '#bf8fa3') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  const geo = new THREE.SphereGeometry(l/2, 32, 32)
  const esfera = new THREE.Mesh(geo, mat)
  esfera.position.y = a / 2
  esfera.castShadow = true
  esfera.receiveShadow = true
  grupo.add(esfera)

  return grupo
}

export function modeloCone(l, p, a, cor = '#bfa38f') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  const geo = new THREE.ConeGeometry(l/2, a, 32)
  const cone = new THREE.Mesh(geo, mat)
  cone.position.y = a / 2
  cone.castShadow = true
  cone.receiveShadow = true
  grupo.add(cone)

  return grupo
}

export function modeloPiramide(l, p, a, cor = '#c4b07a') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  const geo = new THREE.ConeGeometry(l * 0.707, a, 4)
  const piramide = new THREE.Mesh(geo, mat)
  piramide.position.y = a / 2
  piramide.rotation.y = Math.PI / 4
  piramide.castShadow = true
  piramide.receiveShadow = true
  grupo.add(piramide)

  return grupo
}

export function modeloPrisma(l, p, a, cor = '#9a8fbf') {
  const grupo = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: cor })

  const geo = new THREE.CylinderGeometry(l * 0.5, l * 0.5, p, 3)
  const prisma = new THREE.Mesh(geo, mat)
  prisma.position.y = a / 2
  prisma.castShadow = true
  prisma.receiveShadow = true
  grupo.add(prisma)

  return grupo
}

// ========= MAPA DE MODELOS =========

// Mapeia tipo de objeto para função de modelo 3D
export const MODELOS_3D = {
  // Assentos
  'sofa': modeloSofa2,
  'sofa-3-lugares': modeloSofa3,
  'sofa-de-canto-l': modeloSofaCanto,
  'poltrona': modeloPoltrona,
  'cadeira-de-jantar': modeloCadeira,
  'cadeira-estofada': modeloCadeira,
  'cadeira-de-cozinha': modeloCadeira,
  'banqueta-alta-de-bar': modeloBanqueta,
  'banqueta': modeloBanqueta,

  // Mesas
  'mesa-de-jantar': modeloMesaJantar,
  'mesa-de-centro': modeloMesaCentro,
  'mesa-lateral': modeloMesaCentro,
  'mesa-de-apoio': modeloMesaCentro,
  'mesa-de-jantar-4-lugares': modeloMesaJantar,
  'mesa-de-jantar-6-lugares': modeloMesaJantar,
  'mesa-de-jantar-8-lugares': modeloMesaJantar,
  'mesa-redonda': modeloMesaRedonda,
  'mesa-quadrada': modeloMesaQuadrada,
  'mesa-de-bar': modeloMesaCentro,
  'mesa-de-cafe-da-manha': modeloMesaCentro,
  'escrivaninha': modeloEscrivaninha,
  'mesa-em-l': modeloMesaCentro,
  'mesa-gamer': modeloEscrivaninha,
  'mesa-de-estudos-infantil': modeloMesaCentro,
  'prancheta-de-desenho': modeloMesaCentro,
  'aparador': modeloMesaCentro,
  'buffet': modeloMesaCentro,
  'criado-mudo-mesa-de-cabecalho': modeloCriadoMudo,
  'mesa-de-passar': modeloMesaCentro,
  'mesa-de-jardim': modeloMesaRedonda,
  'mesa-de-piquenique': modeloMesaCentro,

  // Camas
  'cama': modeloCama,
  'cama-de-casal': modeloCama,
  'cama-de-solteiro': modeloCama,
  'cama-queen': modeloCama,
  'cama-king': modeloCama,
  'cama-box': modeloCama,
  'cama-com-bau': modeloCama,
  'bicama': modeloCama,
  'beliche': modeloBeliche,
  'treliche': modeloBeliche,
  'berco': modeloBerco,
  'mini-berco': modeloBerco,
  'moises': modeloBerco,
  'cama-de-cachorro-gato': modeloCama,

  // Armazenamento
  'guarda-roupa': modeloGuardaRoupa,
  'guarda-roupa-2-portas': modeloGuardaRoupa,
  'guarda-roupa-3-portas': modeloGuardaRoupa,
  'guarda-roupa-4-portas': modeloGuardaRoupa,
  'estante-de-livros': modeloEstante,
  'cristaleira': modeloEstante,
  'rack-de-tv': modeloRackTV,
  'armario-alto': modeloGuardaRoupa,
  'armario-baixo': modeloComoda,
  'cômoda': modeloComoda,
  'gaveteiro': modeloComoda,

  // Cozinha
  'fogao-4-bocas': modeloFogao,
  'fogao-6-bocas': modeloFogao,
  'geladeira': modeloGeladeira,
  'geladeira-1-porta': modeloGeladeira,
  'geladeira-2-portas': modeloGeladeira,
  'pia-com-gabinete': modeloPia,

  // Banheiro
  'vaso-sanitario': modeloVaso,
  'pia-de-banheiro-com-gabinete': modeloPiaBanheiro,
  'box-com-chuveiro': modeloChuveiro,
  'banheira': modeloBanheira,

  // Eletrônicos
  'tv': modeloTV,
  'tv-32': modeloTV,
  'tv-50': modeloTV,
  'tv-65': modeloTV,
  'computador-de-mesa': modeloComputador,
  'notebook': modeloNotebook,
  'monitor': modeloTV,

  // Iluminação
  'luminaria-de-teto-embutida': modeloLuminaria,
  'abajur': modeloAbajur,
  'luminaria-de-mesa': modeloAbajur,
  'luminaria-de-chao': modeloAbajur,

  // Decoração
  'quadro': modeloQuadro,
  'tapete': modeloTapete,
  'planta-media': modeloPlanta,
  'planta-grande': modeloPlanta,
  'planta-pequena': modeloPlanta,

  // Exterior
  'carro': modeloCarro,
  'piscina': modeloPiscina,

  // Escada
  'escada-reta': modeloEscada,
  'escada-caracol': modeloEscada,

  // Estrutura
  'coluna-pilar': modeloColuna,
  'rampa': modeloRampa,

  // Formas
  'cubo': modeloCubo,
  'cilindro': modeloCilindro,
  'esfera-2': modeloEsfera,
  'cone': modeloCone,
  'piramide-2': modeloPiramide,
  'prisma': modeloPrisma,

  // Móveis variados
  'sofa-cama': modeloSofa2,
  'sofa-retratil-reclinavel': modeloSofa2,
  'chaise-longue': modeloSofa2,
  'futon': modeloSofa2,
  'poltrona-reclinavel': modeloPoltrona,
  'poltrona-do-papai': modeloPoltrona,
  'poltrona-de-amamentacao': modeloPoltrona,
  'poltrona-puff-pera': modeloPoltrona,
  'puff': modeloBanqueta,
  'puff-bau': modeloBanqueta,
  'banco-de-madeira': modeloMesaCentro,
  'namoradeira': modeloSofa2,
  'recamier-pe-de-cama': modeloMesaCentro,
  'cadeira-de-balanca': modeloCadeira,
  'cadeira-escritorio': modeloCadeira,
  'cadeira-gamer': modeloCadeira,
  'cadeira-de-mesa-infantil': modeloCadeira,
  'mesa-de-passar': modeloMesaCentro,
  'guarda-roupa-de-correr': modeloGuardaRoupa,
  'closet-aberto': modeloEstante,
  'arara-de-roupas': modeloEstante,
  'cabideiro': modeloEstante,
  'sapateira': modeloEstante,
  'trocador-de-bebe': modeloComoda,
  'biombo': modeloMesaCentro,
  'prateleira-de-parede': modeloMesaCentro,
  'nicho': modeloMesaCentro,
  'prateleira-de-canto': modeloMesaCentro,
  'painel-de-tv': modeloMesaCentro,
  'home-theater': modeloMesaCentro,
  'armario-multiuso': modeloGuardaRoupa,
  'arquivo-de-gavetas': modeloComoda,
  'caixa-organizadora': modeloMesaCentro,
  'cesto': modeloMesaCentro,
  'bau-de-brinquedos': modeloComoda,
  'adega': modeloEstante,
  'carrinho-de-bar': modeloMesaCentro,
  'porta-chaves': modeloMesaCentro,
  'porta-casacos-de-entrada': modeloMesaCentro,
  'banco-de-entrada-com-sapateira': modeloMesaCentro,
  'geladeira-duplex': modeloGeladeira,
  'geladeira-side-by-side': modeloGeladeira,
  'freezer': modeloGeladeira,
  'frigobar': modeloGeladeira,
  'coifa': modeloMesaCentro,
  'depurador': modeloMesaCentro,
  'cuba': modeloPia,
  'armario-aereo': modeloEstante,
  'armario-de-chao': modeloGuardaRoupa,
  'paneleiro': modeloEstante,
  'despensa': modeloEstante,
  'bancada': modeloMesaCentro,
  'ilha-de-cozinha': modeloMesaCentro,
  'lava-loucas': modeloPia,
  'lixeira': modeloMesaCentro,
  'filtro-de-agua': modeloMesaCentro,
  'cafeteira': modeloMesaCentro,
  'liquidificador': modeloMesaCentro,
  'batedeira': modeloMesaCentro,
  'air-fryer': modeloMesaCentro,
  'torradeira': modeloMesaCentro,
  'chaleira': modeloMesaCentro,
  'sanduicheira': modeloMesaCentro,
  'panela-eletrica-de-arroz': modeloMesaCentro,
  'escorredor-de-louca': modeloMesaCentro,
  'tabua-de-corte': modeloMesaCentro,
  'porta-temperos': modeloMesaCentro,
  'fruteira': modeloMesaCentro,
  'galheteiro': modeloMesaCentro,
  'jogo-de-panelas': modeloMesaCentro,
  'panos-de-prato': modeloMesaCentro,
  'espelho-de-banheiro': modeloEspelho,
  'espeleira': modeloEspelho,
  'chuveiro-aberto': modeloChuveiro,
  'banheira-de-hidromassagem': modeloBanheira,
  'ofuro': modeloBanheira,
  'toalheiro': modeloMesaCentro,
  'porta-papel': modeloMesaCentro,
  'cesto-de-roupa-suja': modeloMesaCentro,
  'tapete-de-banheiro': modeloTapete,
  'lixeirinha': modeloMesaCentro,
  'prateleira-de-banho': modeloEstante,
  'nicho-de-parede': modeloEstante,
  'maquina-de-lavar': modeloMesaCentro,
  'lava-e-seca': modeloMesaCentro,
  'secadora': modeloMesaCentro,
  'tanque': modeloPia,
  'varal-de-chao': modeloMesaCentro,
  'varal-de-teto': modeloMesaCentro,
  'tabua-de-passar': modeloMesaCentro,
  'ferro-de-passar': modeloMesaCentro,
  'armario-de-lavanderia': modeloGuardaRoupa,
  'balde-e-vassoura': modeloMesaCentro,
  'aspirador': modeloMesaCentro,
  'video-game': modeloMesaCentro,
  'controle-de-videogame': modeloMesaCentro,
  'impressora': modeloMesaCentro,
  'roteador': modeloMesaCentro,
  'caixa-de-som': modeloMesaCentro,
  'soundbar': modeloTV,
  'toca-discos': modeloMesaCentro,
  'aparelho-de-som': modeloMesaCentro,
  'radio': modeloMesaCentro,
  'fone-em-suporte': modeloMesaCentro,
  'despertador': modeloMesaCentro,
  'relogio-digital': modeloMesaCentro,
  'ventilador-de-mesa': modeloLuminaria,
  'ventilador-de-chao': modeloLuminaria,
  'ventilador-de-teto': modeloLuminaria,
  'ar-condicionado-split': modeloMesaCentro,
  'aquecedor': modeloMesaCentro,
  'umidificador': modeloMesaCentro,
  'telefone': modeloMesaCentro,
  'tablet': modeloMesaCentro,
  'celular-carregando': modeloMesaCentro,
  'lustre': modeloLuminaria,
  'pendente': modeloLuminaria,
  'plafon': modeloLuminaria,
  'spot-trilho': modeloLuminaria,
  'arandela': modeloLuminaria,
  'fita-de-led': modeloLuminaria,
  'cordao-de-luzinhas': modeloLuminaria,
  'letreiro-neon': modeloLuminaria,
  'luz-noturna': modeloLuminaria,
  'luminaria-de-jardim': modeloLuminaria,
  'poste-de-luz': modeloLuminaria,
  'refletor': modeloLuminaria,
  'lampiao': modeloLuminaria,
  'planta-pequena-vaso-de-mesa': modeloPlanta,
  'planta-media-2': modeloPlanta,
  'planta-grande-de-chao': modeloPlanta,
  'planta-pendurada': modeloPlanta,
  'cacto': modeloPlanta,
  'suculenta': modeloPlanta,
  'vaso-de-flores': modeloPlanta,
  'horta-de-temperos': modeloPlanta,
  'escultura': modeloMesaCentro,
  'vaso-decorativo': modeloMesaCentro,
  'vela': modeloMesaCentro,
  'castiçal': modeloMesaCentro,
  'livro-decorativo': modeloMesaCentro,
  'almofada': modeloMesaCentro,
  'manta': modeloMesaCentro,
  'porta-retratos': modeloMesaCentro,
  'globo': modeloMesaCentro,
  'aquario': modeloPiscina,
  'gaiola': modeloMesaCentro,
  'tapete-pequeno': modeloTapete,
  'tapete-medio': modeloTapete,
  'tapete-grande': modeloTapete,
  'tapete-redondo': modeloTapete,
  'passadeira': modeloTapete,
  'capacho': modeloTapete,
  'cortina': modeloMesaCentro,
  'persiana': modeloMesaCentro,
  'blackout': modeloMesaCentro,
  'varao-de-cortina': modeloMesaCentro,
  'lareira': modeloMesaCentro,
  'lareira-eletrica': modeloMesaCentro,
  'lenha': modeloMesaCentro,
  'livros-empilhados': modeloMesaCentro,
  'revistas': modeloMesaCentro,
  'roupas-jogadas': modeloMesaCentro,
  'sapatos': modeloMesaCentro,
  'mochila': modeloMesaCentro,
  'caixas-de-mudanca': modeloMesaCentro,
  'louca-suja': modeloMesaCentro,
  'controle-remoto': modeloMesaCentro,
  'xícara-de-cafe': modeloMesaCentro,
  'berço-2': modeloBerco,
  'cama-infantil': modeloCama,
  'trocador': modeloComoda,
  'cadeirao-de-comer': modeloCadeira,
  'cercadinho': modeloEstante,
  'casinha': modeloMesaCentro,
  'tenda': modeloMesaCentro,
  'escorredor-interno': modeloMesaCentro,
  'mesa-e-cadeirinha-infantil': modeloMesaCentro,
  'cavalinho-de-balanco': modeloMesaCentro,
  'ursinho': modeloMesaCentro,
  'blocos': modeloMesaCentro,
  'carrinho-de-bebe': modeloMesaCentro,
  'estante-de-jogos': modeloEstante,
  'mesa-de-sinuca': modeloMesaCentro,
  'pebolim': modeloMesaCentro,
  'pingue-pongue': modeloMesaCentro,
  'fliperama': modeloMesaCentro,
  'alvo-de-dardo': modeloMesaCentro,
  'piano': modeloMesaCentro,
  'teclado-musical': modeloMesaCentro,
  'violao-no-suporte': modeloMesaCentro,
  'bateria': modeloMesaCentro,
  'cavalete-de-pintura': modeloMesaCentro,
  'maquina-de-costura': modeloMesaCentro,
  'telescopio': modeloMesaCentro,
  'esteira': modeloMesaCentro,
  'bicicleta-ergometrica': modeloMesaCentro,
  'banco-de-musculacao': modeloMesaCentro,
  'saco-de-pancada': modeloMesaCentro,
  'tapete-de-yoga': modeloTapete,
  'espelho-de-academia': modeloEspelho,
  'escritor': modeloEscrivaninha,
  'quadro-de-avisos': modeloQuadro,
  'quadro-branco': modeloQuadro,
  'impressora-2': modeloMesaCentro,
  'fragmentadora': modeloMesaCentro,
  'bebedouro': modeloMesaCentro,
  'cesto-de-lixo': modeloMesaCentro,
  'divisoria-de-baia': modeloMesaCentro,
  'mesa-e-cadeiras-de-jardim': modeloMesaCentro,
  'cadeira-de-jardim': modeloCadeira,
  'banco-de-jardim': modeloMesaCentro,
  'espreguiçadeira': modeloMesaCentro,
  'guarda-sol': modeloLuminaria,
  'ombrelone': modeloLuminaria,
  'rede': modeloTapete,
  'balanco': modeloMesaCentro,
  'pergolado': modeloMesaCentro,
  'churrasqueira-de-alvenaria': modeloMesaCentro,
  'churrasqueira-portatil': modeloMesaCentro,
  'forno-de-pizza': modeloMesaCentro,
  'bar-de-piscina': modeloMesaCentro,
  'borda-de-piscina': modeloTapete,
  'escada-de-piscina': modeloEscada,
  'boia': modeloTapete,
  'hidromassagem-externa': modeloBanheira,
  'chuveirao': modeloChuveiro,
  'fonte': modeloPiscina,
  'lago': modeloPiscina,
  'arvore': modeloPlanta,
  'arbusto': modeloPlanta,
  'cerca-viva': modeloMesaCentro,
  'flores': modeloPlanta,
  'grama': modeloTapete,
  'pedras': modeloMesaCentro,
  'caminho-de-pedras': modeloTapete,
  'horta-2': modeloPlanta,
  'canteiro': modeloPlanta,
  'casinha-de-cachorro': modeloMesaCentro,
  'comedouro': modeloMesaCentro,
  'bicicleta': modeloMesaCentro,
  'caixa-de-correio': modeloMesaCentro,
  'lixeiras-de-coleta': modeloMesaCentro,

  // Tipos do catálogo sem chave direta: modelo 3D exato do móvel.
  // Sem estes, criarModelo3D cai na caixa genérica e os móveis ficam como cubos.
  'sofa-2-lugares': modeloSofa2,
  'sofa-retratil': modeloSofa2,
  'cadeira': modeloCadeira,
  'cadeira-de-balanco': modeloCadeira,
  'cadeira-infantil': modeloCadeira,
  'puff-pera': modeloPoltrona,
  'mesa': modeloMesaCentro,
  'mesa-de-jantar-2-lugares': modeloMesaJantar,
  'mesa-extensivel': modeloMesaJantar,
  'mesa-de-poquer': modeloMesaJantar,
  'mesa-dobravel-de-parede': modeloMesaCentro,
  'mesa-bandeja': modeloMesaCentro,
  'mesa-nicho': modeloEstante,
  'penteadeira': modeloPenteadeira,
  'cama-suspensa-mesa-embaixo': modeloCama,
  'cama-montessoriana': modeloCama,
  'colchao-no-chao': modeloCama,
  'cabeceira': modeloCama,
  'dossel': modeloCama,
  'mosquiteiro': modeloCama,
  'criado-mudo': modeloCriadoMudo,
  'guardaroupa': modeloGuardaRoupa,
  'comoda': modeloComoda,
  'bau': modeloComoda,
  'espelho-de-chao': modeloEspelho,
  'espelho-de-parede': modeloEspelho,
  'espelheira': modeloEspelho,
  'estante': modeloEstante,
  'estante-vazada-divisoria': modeloEstante,
  'cooktop': modeloFogao,
  'forno-de-embutir': modeloFogao,
  'micro-ondas': modeloMesaCentro,
  'bide': modeloVaso,
  'cuba-de-apoio': modeloPia,
  'suporte-de-tv-de-parede': modeloMesaCentro,
  'videogame': modeloMesaCentro,
  'computador-gabinete': modeloComputador,
  'fone-no-suporte': modeloMesaCentro,
  'luminaria-embutida': modeloLuminaria,
  'luminaria-de-leitura': modeloLuminaria,
  'poster': modeloQuadro,
  'moldura-de-fotos': modeloQuadro,
  'mural-de-cortica': modeloQuadro,
  'mapa': modeloQuadro,
  'relogio-de-parede': modeloQuadro,
  'trofeu': modeloMesaCentro,
  'prateleira-de-colecionaveis': modeloEstante,
  'castical': modeloMesaCentro,
  'xicara-de-cafe': modeloMesaCentro,
  'casinha-infantil': modeloMesaCentro,
  'tenda-infantil': modeloMesaCentro,
  'escorregador': modeloMesaCentro,
  'blocos-de-brinquedo': modeloMesaCentro,
  'mesapc': modeloEscrivaninha,
  'cadeira-de-escritorio': modeloCadeira,
  'espreguicadeira': modeloMesaCentro,
  'cadeira-de-praia': modeloCadeira,
  'balanco-de-varanda': modeloMesaCentro,
  'horta': modeloPlanta,
  'meia-parede': modeloMesaCentro,
  'mureta': modeloMesaCentro,
  'divisoria-de-vidro': modeloMesaCentro,
  'guarda-corpo': modeloMesaCentro,
  'escada-de-mao': modeloEscada,
  'bloco': modeloMesaCentro,
  'placa': modeloQuadro,
  'coluna-redonda': modeloColuna,
  'esfera': modeloEsfera,
  'piramide': modeloPiramide,
  'prisma-triangular': modeloPrisma,

  // Aberturas
  'porta': (l, p, a) => {
    const grupo = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({ color: 0x8a5a3b })
    const portaGeo = new THREE.BoxGeometry(l, a, 0.05)
    const porta = new THREE.Mesh(portaGeo, mat)
    porta.position.set(0, a/2, 0.03)
    porta.castShadow = true
    porta.receiveShadow = true
    grupo.add(porta)
    return grupo
  },
  'janela': (l, p, a) => {
    const grupo = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({ color: 0x9fd3ff, transparent: true, opacity: 0.35 })
    const janelaGeo = new THREE.BoxGeometry(l, a, 0.02)
    const janela = new THREE.Mesh(janelaGeo, mat)
    janela.position.set(0, a/2, 0)
    janela.castShadow = true
    janela.receiveShadow = true
    grupo.add(janela)
    return grupo
  },
  'rampa': modeloRampa
}

// Função auxiliar para criar modelo 3D
export function criarModelo3D(tipo, l, p, a, cor = '#4a5568') {
  const modelo = MODELOS_3D[tipo]
  if (!modelo) {
    // Modelo genérico (caixa)
    const grupo = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({ color: cor })
    const geo = new THREE.BoxGeometry(l, a, p)
    const caixa = new THREE.Mesh(geo, mat)
    caixa.position.y = a / 2
    caixa.castShadow = true
    caixa.receiveShadow = true
    grupo.add(caixa)
    return grupo
  }
  return modelo(l, p, a, cor)
}
