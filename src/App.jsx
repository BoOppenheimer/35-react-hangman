import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import Modal from "./components/Modal";

export default function App() {
  const [input, setInput] = useState("");
  const [wordbank, setWordBank] = useState([
    "old",
    "tired",
    "strange",
    "caulous",
    "superficial",
    "tennessee"
  ]);
  const [guessed, setGuessed] = useState([]); 
  const [currentWord, setCurrentWord] = useState(""); 
  const [currentWordArray, setCurrentWordArray] = useState([]); 
  const [currentCorrectLetters, setCurrentCorrectLetters] = useState([]); 
  const [errorMessage, setErrorMessage] = useState("");
  const [score, setScore] = useState(0);
  const [showhangman, setShowhangman] = useState([]); 
  const [modal, setModal] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (currentWord.length > 1) {
      build_underscores(currentWord);
      return;
    }
    chooseWord(wordbank);
  }, [currentWord, wordbank]);

  useEffect(() => {
    inputRef.current.focus(); 
  }, []);

  function chooseWord(inputbank) {
    let randomNum = Math.floor(Math.random() * inputbank.length);
    let tempWord = inputbank[randomNum];
    let tempArray = tempWord.split("");
    setCurrentWord(tempWord);
    setCurrentWordArray(tempArray);
  }

  function build_underscores(currentWord) {
    let tempArray = [];
    for (var i = 0; i < currentWord.length; i++) {
      tempArray.push("_");
    }
    setCurrentCorrectLetters(tempArray);
  }

  function input_Handler(e) {
    const userInput = e.target.value;
    const sanitizedInput = userInput.replace(/[^a-zA-Z]/g, ""); 
    setInput(sanitizedInput.toUpperCase()); 

    if (userInput !== sanitizedInput) {
      setErrorMessage("Only letters are allowed");
    } else {
      setErrorMessage("");
    }
  }

  function guessSubmit_Handler(current_guess) {
    const guess = current_guess.toLowerCase();
  
    if (guessed.includes(guess)) {
      setInput("");
      setErrorMessage("You already picked that letter");
      return;
    }
  
    let tempArray = [...currentCorrectLetters];
    let numOfMatch = 0;
  
    currentWordArray.forEach((myLetter, index) => {
      if (guess === myLetter) {
        tempArray[index] = guess;
        ++numOfMatch;
      }
    });
  
    if (numOfMatch === 0) {
      setScore((prevScore) => prevScore + 1);
      let newHangArray = [...showhangman];
      newHangArray.push(guess);
      setShowhangman(newHangArray);
  
      if (score + 1 === 6) {
        setModal(true);
      }
    }
  
    setCurrentCorrectLetters(tempArray);
    let newGuess = [...guessed];
    newGuess.push(guess);
    setGuessed(newGuess);
    setInput("");
    setErrorMessage("");
    inputRef.current.focus();
  
    if (tempArray.join("") === currentWordArray.join("")) {
      setModal(true);
    }
  }
  
  

  function handleNewGame() {
    setInput("");
    setGuessed([]);
    setCurrentWord("");
    setCurrentWordArray([]);
    setCurrentCorrectLetters([]);
    setScore(0);
    setShowhangman([]);
    setModal(false);
    inputRef.current.focus(); 
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault(); 
  
      if (modal) {
        handleNewGame();
      } else if (input.trim() !== "" && /^[a-zA-Z]+$/.test(input)) {
        guessSubmit_Handler(input);
      }
    }
  }


  const bodyVariants = {
    init: { pathLength: 0 },
    anim: { pathLength: 1 }
  };


  return (
    <div className="App">
      <Modal
        modal={modal}
        setModal={setModal}
        onNewGame={handleNewGame}
        isWin={currentCorrectLetters.join("") === currentWordArray.join("")}
      />

      <div className="game_box">
        <div className="game">
          hangman: {currentWord}
          <div className="score">score: {score}</div>
          <svg className="hangman" viewBox="-50 -8 240 160">
            <g className="hangmanSVG" transform="matrix(.95 0 0 .95 64 18)">
              {showhangman[0] && (
                <circle cx="35.83" cy="12.5" r="12" className="head" />
              )}
              {showhangman[1] && (
                <motion.path
                  variants={bodyVariants}
                  initial="init"
                  animate="anim"
                  d="M32.34 24.62L32.34 70.62"
                  className="body"
                />
              )}
              {showhangman[2] && (
                <motion.path
                  variants={bodyVariants}
                  initial="init"
                  animate="anim"
                  d="M32.34 28.62L0.34 58.62"
                  className="left_arm"
                />
              )}
              {showhangman[3] && (
                <motion.path
                  variants={bodyVariants}
                  initial="init"
                  animate="anim"
                  d="M32.34 28.62L64.34 58.62"
                  className="right_arm"
                />
              )}
              {showhangman[4] && (
                <motion.path
                  variants={bodyVariants}
                  initial="init"
                  animate="anim"
                  d="M32.34 70.62L54.34 115.62"
                  className="right_leg"
                />
              )}
              {showhangman[5] && (
                <motion.path
                  variants={bodyVariants}
                  initial="init"
                  animate="anim"
                  d="M32.34 70.62L10.34 115.62"
                  className="left_leg"
                />
              )}
            </g>

            <g className="gallow">
              <line className="cls-1" x1="96" y1="17" x2="96" y2="1" />
              <line className="cls-1" x1="25" y1="1" x2="97" y2="1" />
              <line className="cls-1" x1="26" y1="1" x2="26" y2="147" />
              <line className="cls-2" x1="43" y1="1" x2="26" y2="17" />
              <line className="cls-1" y1="147" x2="135" y2="147" />
              <line className="cls-2" x1="39" y1="1" x2="26" y2="13" />
            </g>
          </svg>
        </div>
        <div className="clue">
          "I am thinking of a word that is {currentWord.length} letters long."
        </div>
        <div className="currentLetters">
          {currentCorrectLetters.map((underscore, index) => {
            return (
              <div className="letter" key={index}>
                {underscore}
              </div>
            );
          })}
        </div>
        <div className="guessed_letters">
          Guessed Letters:
          <div className="guessed_letter_display">
          {guessed}
          </div>
          <div className="error-message">{errorMessage}</div>
        </div>
      </div>
      <div className="input">
     
      <label htmlFor="letter" >
        your letter:</label>
      <input
          type="text"
          name="letter"
           maxLength="1"
            size="1"
            onChange={input_Handler}
            onKeyDown={handleKeyDown}
            value={input}
            ref={inputRef}
        />
        
      
        <div>
          <button onClick={() => guessSubmit_Handler(input)}>Guess</button>
        </div>
      </div>
    </div>
  );
}
