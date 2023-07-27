"use client";

enum WordStatus {
  CORRECT,
  WRONG_POSITION,
  INCORRECT,
  EMPTY,
  TYPING,
}

type wordsRowProps = {
  initialWords: string[];
  initialWordsStatus: WordStatus[];
};

const squareClassName = (status: WordStatus): string => {
  const squereClassNameBasic =
    "w-[62px] h-[62px] flex justify-center items-center font-extrabold text-[32px] uppercase";
  switch (status) {
    case WordStatus.CORRECT:
      return `${squereClassNameBasic} text-white bg-correct`;
    case WordStatus.INCORRECT:
      return `${squereClassNameBasic} text-white bg-incorrect`;
    case WordStatus.WRONG_POSITION:
      return `${squereClassNameBasic} text-white bg-wrong-position`;
    case WordStatus.TYPING:
      return `${squereClassNameBasic} border-2 border-black`;
    case WordStatus.EMPTY:
      return `${squereClassNameBasic} border-2 border-lightGrey`;
    default:
      return squereClassNameBasic;
  }
};

export default function Row({
  initialWords,
  initialWordsStatus,
}: wordsRowProps) {
  return (
    <div className="flex items-center gap-x-2">
      {initialWords.map((word: string, index: number) => (
        <div
          key={index}
          className={`${squareClassName(initialWordsStatus[index])}`}
        >
          {word}
        </div>
      ))}
    </div>
  );
}
