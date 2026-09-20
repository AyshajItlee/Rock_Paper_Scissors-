import { useState } from "react";
import "./App.css";
import rockImg from "./assets/rock.jpg";
import paperImg from "./assets/paper.jpg";
import scissorsImg from "./assets/scissors.jpg";

// The only three values a choice can ever be
type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "loss" | "tie";

const CHOICES: Choice[] = ["rock", "paper", "scissors"];

const IMAGES: Record<Choice, string> = {
  rock: rockImg,
  paper: paperImg,
  scissors: scissorsImg,
};

const LABELS: Record<Choice, string> = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
};

// Each key beats the choice stored as its value
const BEATS: Record<Choice, Choice> = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

const MESSAGES: Record<Result, string> = {
  win: "You win!",
  loss: "You lose!",
  tie: "It's a tie!",
};

function getResult(player: Choice, computer: Choice): Result {
  if (player === computer) return "tie";
  return BEATS[player] === computer ? "win" : "loss";
}

function getRandomChoice(): Choice {
  const index = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[index];
}

// One square, rounded, black-bordered box that holds a choice image
function ChoiceBox({ title, choice }: { title: string; choice: Choice | null }) {
  return (
    <div className="player">
      <div className="image-box">
        {choice ? (
          <img src={IMAGES[choice]} alt={LABELS[choice]} title={LABELS[choice]} />
        ) : (
          <span className="placeholder">?</span>
        )}
      </div>
      <p className="caption">
        {title}: {choice ? LABELS[choice] : "—"}
      </p>
    </div>
  );
}

function App() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [ties, setTies] = useState(0);

  const total = wins + losses + ties;
  const winPercent = total === 0 ? 0 : (wins / total) * 100;

  function play(choice: Choice) {
    const computer = getRandomChoice();
    const outcome = getResult(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(outcome);

    if (outcome === "win") setWins(wins + 1);
    else if (outcome === "loss") setLosses(losses + 1);
    else setTies(ties + 1);
  }

  function reset() {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setWins(0);
    setLosses(0);
    setTies(0);
  }

  return (
    <main className="game">
      <h1>Rock Paper Scissors</h1>

      <section className="arena">
        <ChoiceBox title="You" choice={playerChoice} />
        <span className="versus">vs</span>
        <ChoiceBox title="Computer" choice={computerChoice} />
      </section>

      <p className={`message ${result ?? ""}`} aria-live="polite">
        {result ? MESSAGES[result] : "Pick one to start"}
      </p>

      <div className="buttons">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            onClick={() => play(choice)}
            className={playerChoice === choice ? "selected" : ""}
          >
            {LABELS[choice]}
          </button>
        ))}
      </div>

      <div className="stats">
        <span>Wins: {wins}</span>
        <span>Ties: {ties}</span>
        <span>Losses: {losses}</span>
        <span>Total: {total}</span>
        <span>Win rate: {winPercent.toFixed(2)}%</span>
      </div>

      <button className="reset" onClick={reset}>
        Reset score
      </button>
    </main>
  );
}

export default App;