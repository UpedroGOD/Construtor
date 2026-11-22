// Modelo 3D detalhado para cada objeto - usado no Vista3D
import * as THREE from 'three'
import { criarModelo3D, MODELOS_3D } from './modelos3d'

// Componente React Three Fiber para renderizar modelos 3D detalhados
export function ItemModelo3D({ tipo, x, z, rot, l, p, a, y, pintura, cor, opacidade = 1, onDown }) {
  // Usar a função de criação do modelos3d.js
  const modelo = criarModelo3D(tipo, l, p, a, cor || '#4a5568')

  // Aplicar cor customizada se fornecida
  if (cor) {
    modelo.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(cor)
      }
    })
  }

  // Aplicar opacidade
  if (opacidade < 1) {
    modelo.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true
        child.material.opacity = opacidade
      }
    })
  }

  return (
    <group position={[x, (y || 0), z]} rotation={[0, rot, 0]} onPointerDown={onDown}>
      {modelo.children.map((child, i) => {
        const mesh = new THREE.Mesh(child.geometry.clone(), child.material.clone())
        mesh.position.copy(child.position)
        mesh.rotation.copy(child.rotation)
        mesh.scale.copy(child.scale)
        mesh.castShadow = true
        mesh.receiveShadow = true
        return <primitive object={mesh} key={i} />
      })}
    </group>
  )
}

// Componente simplificado para uso direto no JSX do @react-three/fiber
export function Item3D({ tipo, x, z, rot, l, p, a, y, pintura, cor, opacidade = 1, onDown }) {
  // Para objetos de abertura (porta, janela, rampa) usar modelos específicos
  if (tipo === 'porta' || tipo === 'janela' || tipo === 'rampa') {
    return (
      <group position={[x, (y || 0), z]} rotation={[0, rot, 0]} onPointerDown={onDown}>
        <primitive object={criarModelo3D(tipo, l, p, a, cor || '#4a5568')} />
      </group>
    )
  }

  // Para outros objetos, usar o modelo detalhado
  return (
    <group position={[x, (y || 0), z]} rotation={[0, rot, 0]} onPointerDown={onDown}>
      <primitive object={criarModelo3D(tipo, l, p, a, cor || '#4a5568')} />
    </group>
  )
}

export default ItemModelo3D
