import { ACTION_MAP } from "./App";

export function DigitButton({ dispatch, digit }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTION_MAP.APPEND_DIGIT, payLoad: { digit } })
      }
    >
      {digit}
    </button>
  );
}

export function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTION_MAP.CHOOSE_OPERATION, payLoad: { operation } })
      }
    >
      {operation}
    </button>
  );
}
