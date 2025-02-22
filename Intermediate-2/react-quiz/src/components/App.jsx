import { useEffect } from "react";
import Header from "./Header";
import MainComp from "./MainComp";
import { useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";


const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // "loading", "error", "ready", "active", "finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer": {
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "reset":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    // return {
    //   ...state,
    //   status: "ready",
    //   index: 0,
    //   answer: null,
    //   points: 0,
    //   highscore: 0,
    // };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action is unknown");
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />

      <MainComp className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
            status={status}
          />
        )}
      </MainComp>
    </div>
  );
}

export default App;

// const initialState = {
//   balance: 0,
//   loan: 0,
//   isActive: false,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "openAccount":
//       return {
//         ...state,
//         status: action.payload,
//       };
//       case "deposit":
//         return {
//           ...state,
//         }

//     default:
//       break;
//   }
// }

// export default function App() {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   return (
//     <div className="App">
//       <h1>useReducer Bank Account</h1>
//       <p>Balance: X</p>
//       <p>Loan: X</p>

//       <p>
//         <button onClick={() => {}} disabled={false}>
//           Open account
//         </button>
//       </p>
//       <p>
//         <button onClick={() => {}} disabled={false}>
//           Deposit 150
//         </button>
//       </p>
//       <p>
//         <button onClick={() => {}} disabled={false}>
//           Withdraw 50
//         </button>
//       </p>
//       <p>
//         <button onClick={() => {}} disabled={false}>
//           Request a loan of 5000
//         </button>
//       </p>
//       <p>
//         <button onClick={() => {}} disabled={false}>
//           Pay loan
//         </button>
//       </p>
//       <p>
//         <button onClick={() => {}} disabled={false}>
//           Close account
//         </button>
//       </p>
//     </div>
//   );
// }
