"use client";

import Row from "./Row";
import { useReducer, useEffect } from "react";
import { produce } from "immer";
import Confetti from "./Confetti";
import { draftMode } from "next/dist/client/components/headers";

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

const answer = ["R", "U", "L", "E", "R"];

export default function Home(): JSX.Element {
  const [state, dispatch] = useReducer(
    produce((draft: Words, action) => {
      // find the first array contains "" (empty string)
      const currentArr = draft.wordsList.find((arr) => {
        return arr.includes("");
      });

      const currentArrIndex = currentArr && draft.wordsList.indexOf(currentArr);

      // find the first position of empty string that array
      const currentWord = currentArr && currentArr.find((w) => w === "");
      const currentWordIndex =
        currentArrIndex !== undefined && currentWord !== undefined
          ? draft.wordsList[currentArrIndex].indexOf(currentWord)
          : undefined;

      const isCurentIndexValid =
        currentArrIndex !== undefined && currentWordIndex !== undefined;

      function updateWordStatus(
        status: WordStatus,
        arrIndex: number,
        wordIndex: number
      ) {
        draft.wordsStatusList[arrIndex][wordIndex] = status;
      }

      function isGameOver() {
        let status;
        const winStatus = "00000";

        draft.wordsStatusList.forEach((wordArr) => {
          if (
            wordArr.includes(WordStatus.EMPTY) ||
            wordArr.join("") === winStatus
          ) {
            status = false;
            return;
          }
          status = true;
        });
        return status;
      }

      function updateWord(payload: string) {
        if (payload === "ENTER") {
          draft.wordsList.forEach((wordArr, arrIndex) => {
            wordArr.forEach((word, wordIndex) => {
              const isMatch = answer.includes(word.toUpperCase());
              const matchWord = answer.find(
                (ans) => ans === word.toUpperCase()
              );

              if (draft.wordsList[arrIndex].includes("")) {
                return;
              }

              const isWordListedInAnswer = isMatch && matchWord;
              const isCorrectedWord = word === answer[wordIndex];

              isWordListedInAnswer
                ? isCorrectedWord
                  ? updateWordStatus(WordStatus.CORRECT, arrIndex, wordIndex)
                  : updateWordStatus(
                      WordStatus.WRONG_POSITION,
                      arrIndex,
                      wordIndex
                    )
                : updateWordStatus(WordStatus.INCORRECT, arrIndex, wordIndex);
            });

            if (wordArr.join("") === answer.join("")) {
              draft.gameStatus = "WIN";
            }
          });

          if (isGameOver()) {
            draft.gameStatus = "LOSE";
          }

          return;
        }

        // set the payload into that position
        const isCurrentExist =
          currentArr !== undefined &&
          currentWord !== undefined &&
          currentWordIndex !== undefined &&
          currentArrIndex !== undefined;

        if (isCurrentExist) {
          draft.wordsStatusList[currentArrIndex][currentWordIndex] =
            WordStatus.TYPING;

          draft.wordsList[currentArrIndex][currentWordIndex] = payload;
        }
      }

      switch (action.type) {
        case "SET_KEY_PRESS":
          if (action.payload !== undefined) {
            updateWord(action.payload);
          }
          break;

        // return draft;
        case "REMOVE_KEY":
          if (isCurentIndexValid) {
            // remove the last
            if (currentWordIndex === 0 && currentArrIndex >= 1) {
              draft.wordsStatusList[currentArrIndex - 1][4] ===
                WordStatus.TYPING &&
                ((draft.wordsList[currentArrIndex - 1][4] = ""),
                (draft.wordsStatusList[currentArrIndex - 1][4] =
                  WordStatus.EMPTY));
            }

            draft.wordsList[currentArrIndex][currentWordIndex - 1] = "";
            draft.wordsStatusList[currentArrIndex][currentWordIndex - 1] =
              WordStatus.EMPTY;
          } else {
            // remove the word in the last row last word since the "currentArrIndex" and "currentWordIndex" will be undefined when all words are filled in
            draft.wordsList[5][4] = "";
            draft.wordsStatusList[5][4] = WordStatus.EMPTY;
          }
          break;
        // return draft;
        case "START_OVER":
          draft.gameStatus = initialState.gameStatus;
          draft.wordsList = initialState.wordsList;
          draft.wordsStatusList = initialState.wordsStatusList;

          break;

        default:
          return draft;
      }
    }),
    initialState
  );

  function handleKeyEvent(e: KeyboardEvent) {
    const key: string = e.key.toLocaleUpperCase();
    const codePoint = key.codePointAt(0);

    // const lastRowIndex = state.wordsList.findLastIndex(
    //   (arr) => {arr.join("").length === 5}
    // );

    if (e.key === "Enter") {
      dispatch({
        type: "SET_KEY_PRESS",
        wordsList: state.wordsList,
        wordsStatusList: state.wordsStatusList,
        payload: e.key.toUpperCase(),
      });
    }

    // if (
    //   lastRowIndex >= 0 &&
    //   state.wordsStatusList[rowIndex].includes(WordStatus.TYPING)
    // ) {
    //   return;
    // }

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

  function handlePlayAgain() {
    dispatch({
      type: "START_OVER",
    });
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
        <>
          <p className="font-bold text-[30px] text-correct">YOU WIN !!!</p>
          <Confetti />
        </>
      )}
      {state.gameStatus === "LOSE" && (
        <div className="w-screen h-screen fixed bg-black/30 flex justify-center items-center">
          <div className="flex flex-col gap-5 items-center justify-center bg-white w-[50%] h-[50%] min-h-[300px] text-center p-10 rounded-2xl shadow-sm">
            <p className="font-bold text-[30px]">Game Over</p>
            <p
              className="py-1 px-2 bg-gray-500 text-white font-bold rounded-md hover:cursor-pointer"
              onClick={handlePlayAgain}
            >
              PLAY AGAIN
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
