"use client";

import Row from "./Row";
import { useReducer, useEffect } from "react";
interface Words {
  gameStatus: GameStatus;
  wordsList: string[][];
  wordsStatusList: WordStatus[][];
}

enum WordStatus {
  CORRECT,
  WRONG_POSITION,
  INCORRECT,
  EMPTY,
  TYPING,
}

type ActionType =
  | "SET_KEY_PRESS"
  | "REMOVE_KEY"
  | "SET_GAME_STATUS_WIN"
  | "SET_NEW_GAME";
type GameStatus = "PENDING" | "WIN" | "LOSE";

interface Action {
  type: ActionType;
  wordsList: string[][];
  wordsStatusList: WordStatus[][];
  payload?: string;
}

const initialState: Words = {
  gameStatus: "PENDING",
  wordsList: [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ],
  wordsStatusList: [
    [
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
    ],
    [
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
    ],
    [
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
    ],
    [
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
    ],
    [
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
    ],
    [
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
      WordStatus.EMPTY,
    ],
  ],
};

function reducer(state: Words, action: Action): Words {
  const newState = { ...state };

  // find the first array contains "" (empty string)
  const currentArr = state.wordsList.find((arr) => arr.includes(""));
  const currentArrIndex = currentArr && state.wordsList.indexOf(currentArr);

  // find the first position of empty string that array
  const currentWord = currentArr && currentArr.find((w) => w === "");
  const currentWordIndex =
    currentArrIndex !== undefined && currentWord !== undefined
      ? state.wordsList[currentArrIndex].indexOf(currentWord)
      : undefined;
  const isCurentIndexValid =
    currentArrIndex !== undefined && currentWordIndex !== undefined;

  function updateWordStatus(
    status: WordStatus,
    arrIndex: number,
    wordIndex: number
  ) {
    state.wordsStatusList[arrIndex][wordIndex] = status;
  }

  function isWordsListStillProcessing() {
    let status;
    state.wordsStatusList.forEach((wordArr) => {
      if (wordArr.includes(WordStatus.EMPTY)) {
        status = true;
        return;
      }
      status = false;
    });
    return status;
  }

  function updateWord(payload: string) {
    if (payload === "ENTER") {
      state.wordsList.forEach((wordArr, arrIndex) => {
        wordArr.forEach((word, wordIndex) => {
          const isMatch = answer.includes(word.toUpperCase());
          const matchWord = answer.find((ans) => ans === word.toUpperCase());

          if (state.wordsList[arrIndex].includes("")) {
            return;
          }

          const isWordListedInAnswer = isMatch && matchWord;
          const isCorrectedWord = word === answer[wordIndex];

          isWordListedInAnswer
            ? isCorrectedWord
              ? updateWordStatus(WordStatus.CORRECT, arrIndex, wordIndex)
              : updateWordStatus(WordStatus.WRONG_POSITION, arrIndex, wordIndex)
            : updateWordStatus(WordStatus.INCORRECT, arrIndex, wordIndex);
        });
      });

      if (!isWordsListStillProcessing()) {
        newState.gameStatus = "LOSE";
      }

      return newState;
    }

    // set the payload into that position
    const isCurrentExist =
      currentArr !== undefined &&
      currentWord !== undefined &&
      currentWordIndex !== undefined &&
      currentArrIndex !== undefined;
    if (isCurrentExist) {
      state.wordsStatusList[currentArrIndex][currentWordIndex] =
        WordStatus.TYPING;

      state.wordsList[currentArrIndex][currentWordIndex] = payload;
    }
  }

  switch (action.type) {
    case "SET_KEY_PRESS":
      if (action.payload !== undefined) {
        updateWord(action.payload);
      }

      return newState;
    case "REMOVE_KEY":
      if (isCurentIndexValid) {
        // remove the last
        if (currentWordIndex === 0 && currentArrIndex >= 1) {
          state.wordsStatusList[currentArrIndex - 1][4] === WordStatus.TYPING &&
            ((state.wordsList[currentArrIndex - 1][4] = ""),
            (state.wordsStatusList[currentArrIndex - 1][4] = WordStatus.EMPTY));
        }

        state.wordsList[currentArrIndex][currentWordIndex - 1] = "";
        state.wordsStatusList[currentArrIndex][currentWordIndex - 1] =
          WordStatus.EMPTY;
      } else {
        // remove the word in the last row last word since the "currentArrIndex" and "currentWordIndex" will be undefined when all words are filled in
        state.wordsList[5][4] = "";
        state.wordsStatusList[5][4] = WordStatus.EMPTY;
      }
      return newState;
    case "SET_GAME_STATUS_WIN":
      newState.gameStatus = "WIN";
      return newState;

    default:
      return newState;
  }
}

const answer = ["R", "U", "L", "E", "R"];
export default function Home(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleKeyEvent(e: KeyboardEvent) {
    const key: string = e.key.toLocaleUpperCase();
    const codePoint = key.codePointAt(0);

    const lastRowIndex = state.wordsList.findLastIndex(
      (arr) => arr.join("").length === 5
    );

    if (e.key === "Enter") {
      dispatch({
        type: "SET_KEY_PRESS",
        wordsList: state.wordsList,
        wordsStatusList: state.wordsStatusList,
        payload: e.key.toUpperCase(),
      });
      state.wordsList.forEach((wordArr) => {
        if (wordArr.join("") === answer.join(""))
          dispatch({
            type: "SET_GAME_STATUS_WIN",
            wordsList: state.wordsList,
            wordsStatusList: state.wordsStatusList,
          });
      });
    }

    if (
      lastRowIndex >= 0 &&
      state.wordsStatusList[lastRowIndex].includes(WordStatus.TYPING)
    ) {
      return;
    }

    if (
      codePoint !== undefined &&
      codePoint <= 90 &&
      codePoint >= 65 &&
      e.key.length === 1
    ) {
      dispatch({
        type: "SET_KEY_PRESS",
        wordsList: state.wordsList,
        wordsStatusList: state.wordsStatusList,
        payload: e.key.toUpperCase(),
      });
    }
  }

  function handleKeyDelete(e: KeyboardEvent) {
    if (e.key === "Backspace") {
      if (
        state.wordsStatusList[5][4] === WordStatus.WRONG_POSITION ||
        state.wordsStatusList[5][4] === WordStatus.CORRECT ||
        state.wordsStatusList[5][4] === WordStatus.INCORRECT
      ) {
        return;
      }
      dispatch({
        type: "REMOVE_KEY",
        wordsList: state.wordsList,
        wordsStatusList: state.wordsStatusList,
      });
    }
  }

  useEffect(() => {
    if (state.gameStatus === "WIN") {
      window.removeEventListener("keypress", handleKeyEvent);
      return;
    }

    window.addEventListener("keypress", handleKeyEvent);
    window.addEventListener("keydown", handleKeyDelete);

    return () => {
      window.removeEventListener("keypress", handleKeyEvent);
      window.removeEventListener("keydown", handleKeyDelete);
    };
  }, [state.gameStatus]);

  console.log("init", initialState);

  return (
    <main className="flex flex-col items-center justify-center gap-y-2 h-screen font-nyt-franklin ">
      <h1 className="text-[25px] font-bold tracking-[2px] text-center">
        Wordle
      </h1>
      <p>Take a guess!</p>
      {state.wordsList.map((_, index: number) => {
        return (
          <Row
            key={index}
            initialWords={state.wordsList[index]}
            initialWordsStatus={state.wordsStatusList[index]}
          />
        );
      })}
      {state.gameStatus === "WIN" && (
        <p className="font-bold text-[30px] text-correct">YOU WIN !!!</p>
      )}
      {state.gameStatus === "LOSE" && (
        <div className="w-screen h-screen fixed bg-black/30 flex justify-center items-center">
          <div className="flex flex-col gap-5 items-center justify-center bg-white w-[50%] h-[50%] min-h-[300px] text-center p-10 rounded-2xl shadow-sm">
            <p className="font-bold text-[30px]">Game Over</p>
          </div>
        </div>
      )}
    </main>
  );
}
