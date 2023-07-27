"use client";

import Row from "./Row";
import { useReducer, useEffect } from "react";
interface Words {
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

type ActionType = "SET_KEY_PRESS" | "REMOVE_KEY";

interface Action {
  type: ActionType;
  wordsList: string[][];
  wordsStatusList: WordStatus[][];
  payload?: string;
}

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
    default:
      return state;
  }
}

const answer = ["R", "U", "L", "E", "R"];
export default function Home(): JSX.Element {
  const initialState: Words = {
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
    window.addEventListener("keypress", (e) => handleKeyEvent(e));
    window.addEventListener("keydown", (e) => handleKeyDelete(e));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center gap-y-2 h-screen font-nyt-franklin ">
      {state.wordsList.map((_, index: number) => {
        return (
          <Row
            key={index}
            initialWords={state.wordsList[index]}
            initialWordsStatus={state.wordsStatusList[index]}
          />
        );
      })}
    </main>
  );
}
