import { useReducer } from "react";
import "./style.css";
import { DigitButton, OperationButton } from "./Button";

export const ACTION_MAP = {
  APPEND_DIGIT: "append-digit",
  CHOOSE_OPERATION: "choose-operation",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear",
  EVALUATE: "evaluate",
};

function reducerFn(state, { type, payLoad }) {
  // console.log(type, payLoad, state);
  switch (type) {
    case ACTION_MAP.APPEND_DIGIT:
      if (state.overwrite) {
        return { ...state, overwrite: false, currentOperand: payLoad.digit };
      }
      if (payLoad.digit === "0" && state.currentOperand === "0") {
        return state;
      } else if (payLoad.digit === "." && state.currentOperand.includes(".")) {
        return state;
      } else
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payLoad.digit}`,
        };

    case ACTION_MAP.CHOOSE_OPERATION:
      if (
        (state.currentOperand === null || undefined) &&
        (state.previousOperand === null || undefined)
      ) {
        return state;
      }
      if (state.previousOperand == null || undefined) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          currentOperand: null,
          operation: payLoad.operation,
        };
      }
      if (state.currentOperand == null || undefined) {
        return { ...state, operation: payLoad.operation };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payLoad.operation,
      };

    case ACTION_MAP.EVALUATE:
      if (
        state.previousOperand === null ||
        state.operation === null ||
        state.currentOperand === null
      ) {
        return state;
      }

      return {
        ...state,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state),
        overwrite: true,
      };

    case ACTION_MAP.DELETE_DIGIT:
      if (state.overwrite)
        return { ...state, currentOperand: null, overwrite: false };
      if (state.currentOperand === null) return { ...state };
      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: null };
      return { ...state, currentOperand: state.currentOperand.slice(0, -1) };

    case ACTION_MAP.CLEAR:
      return {};
    default:
      return state;
  }
}

function evaluate(state) {
  if (isNaN(state.currentOperand) || isNaN(state.previousOperand)) return "";
  let computation = "";
  const x = parseFloat(state.currentOperand);
  const y = parseFloat(state.previousOperand);
  switch (state.operation) {
    case "+":
      computation = x + y;
      break;
    case "-":
      computation = x - y;
      break;
    case "*":
      computation = x * y;
      break;
    case "/":
      computation = x / y;
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null || undefined) return;

  const [intPart, decimalPart] = operand.split(".");
  if (decimalPart == null) return INTEGER_FORMATTER.format(intPart);
  return `${INTEGER_FORMATTER.format(intPart)}.${decimalPart}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducerFn,
    {}
  );

  // console.log(currentOperand);

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION_MAP.CLEAR })}
      >
        AC
      </button>

      <button onClick={() => dispatch({ type: ACTION_MAP.DELETE_DIGIT })}>
        DEL
      </button>

      <OperationButton dispatch={dispatch} operation="/" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />

      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />

      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />

      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />

      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION_MAP.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
