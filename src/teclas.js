// Teclas de movimento seguradas agora (w a s d + shift). Lidas a cada quadro pelas vistas 2D e 3D.
export const seguradas = new Set()

const MOV = ['w', 'a', 's', 'd', 'q', 'e']
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.ctrlKey || e.metaKey) return
  const k = e.key.toLowerCase()
  if (MOV.includes(k)) seguradas.add(k)
  if (e.key === 'Shift') seguradas.add('shift')
})
window.addEventListener('keyup', (e) => {
  seguradas.delete(e.key.toLowerCase())
  if (e.key === 'Shift') seguradas.delete('shift')
})
window.addEventListener('blur', () => seguradas.clear()) // trocou de janela segurando tecla: não sai andando sozinho

// Direção pedida pelo teclado: x = direita(+)/esquerda(-), y = frente(+)/trás(-)
export function direcao() {
  const x = (seguradas.has('d') ? 1 : 0) - (seguradas.has('a') ? 1 : 0)
  const y = (seguradas.has('w') ? 1 : 0) - (seguradas.has('s') ? 1 : 0)
  return { x, y, rapido: seguradas.has('shift') }
}
