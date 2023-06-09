import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const modalVariants = {
  init: { opacity: 0 },
  anim: {
    opacity: 1,
    transition: { delay: 0.5 }
  }
};

export default function Modal({ modal, setModal, onNewGame, isWin }) {
  const handleNewGame = () => {
    onNewGame();
    setModal(false);
  };

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          className="modal"
          variants={modalVariants}
          initial="init"
          animate="anim"
          exit="init" 
        >
          <div className="card-modal">
            <h1>{isWin ? "You Won!" : "You Lost!"}</h1>
            <button onClick={handleNewGame}>Another Game?</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
