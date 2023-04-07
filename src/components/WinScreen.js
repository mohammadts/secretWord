import './WinScreen.css'

const GameOver = ({ retry, score, totalWords }) => {
  return (
    <div>
      <h1>Você ganhou o jogo</h1>
      <h2>
        A sua pontuação foi: <span>{score}</span>
      </h2>
      <h2>
        Você acertou as <span>{totalWords}</span> questões!
      </h2>{' '}
      <button onClick={retry}> Recomeçar</button>
    </div>
  )
}

export default GameOver
