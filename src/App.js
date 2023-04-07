//CSS
import './App.css'

//React
import { useCallback, useEffect, useState } from 'react'

//data
import { wordsList } from './data/word'

//Components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'
import WinScreen from './components/WinScreen'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
  { id: 4, name: 'win' }
]

let guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)

  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState()
  const [pickedCategory, setPickedCategory] = useState()
  const [letters, setLetters] = useState([])
  const [usedWords, setUsedWords] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //pick random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)]
    return { word, category }
  }, [words])

  const countWords = obj => {
    let counter = 0
    for (var chave in obj) {
      counter += obj[chave].length
    }
    return counter
  }
  const totalWords = countWords(words)

  //start secret word game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates()
    //pick word and pick category
    const { word, category } = pickWordAndCategory()

    if (usedWords.includes(word)) {
      if (usedWords.length === totalWords) {
        setGameStage(stages[3].name)
        return
      } else {
        startGame()
        return
      }
    }

    usedWords.push(word)

    //create an array of letters
    let wordLetters = word.split('')
    wordLetters = wordLetters.map(l => l.toLowerCase())

    //fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory, usedWords, totalWords])

  //process the letter input
  const verifyLetter = letter => {
    const normalizedLetter = letter.toLowerCase()

    //check if guessed letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }

    //push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters(actualGuessedLetters => [
        ...actualGuessedLetters,
        normalizedLetter
      ])

      //add score points
    } else {
      setWrongLetters(actualWrongLetters => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      //remove guesses
      setGuesses(actualGuesses => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  //check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    //win condition
    if (
      uniqueLetters.length === guessedLetters.length &&
      gameStage === stages[1].name
    ) {
      setScore(actualScore => (actualScore += 100))
      setGuesses(guessesQty)
      setTimeout(function () {
        startGame()
      }, 1000)

      //restart game with new word
    }
  }, [guessedLetters, letters, startGame, gameStage])

  //restart game
  const retry = () => {
    setUsedWords([])
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
      {gameStage === 'win' && (
        <WinScreen retry={retry} score={score} totalWords={totalWords} />
      )}
    </div>
  )
}

export default App
