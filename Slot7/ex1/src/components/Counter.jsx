import { useState } from "react";
import { Button } from "react-bootstrap";
import './Counter.css';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));
  const reset = () => setCount(0);

  return (
    <div className="counter text-center mt-5">
      <h1>Counter: {count}</h1>
      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button variant="primary" onClick={increment}>Increment</Button>
        <Button variant="secondary" onClick={decrement} disabled={count === 0}>
          Decrement
        </Button>
        <Button variant="danger" onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}

export default Counter; 