import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Se algo quebrar, mostra o erro em vez de uma tela vazia
class Protecao extends Component {
  state = { erro: null }
  static getDerivedStateFromError(erro) { return { erro } }
  render() {
    if (!this.state.erro) return this.props.children
    return (
      <div className="erro-app">
        <h1>Algo deu errado</h1>
        <pre>{String(this.state.erro?.stack || this.state.erro)}</pre>
        <button onClick={() => location.reload()}>Recarregar</button>
        <button onClick={() => {
          const p = localStorage.getItem('construtor-projeto')
          if (p) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([p])); a.download = 'projeto-backup.json'; a.click() }
          if (confirm('Baixei um backup do projeto. Apagar o projeto salvo e recomeçar?')) { localStorage.removeItem('construtor-projeto'); location.reload() }
        }}>Recomeçar (com backup)</button>
      </div>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Protecao><App /></Protecao>
  </StrictMode>,
)
