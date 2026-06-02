/**
 * CounterControls.jsx – Các nút điều khiển bộ đếm (Bài 1)
 *
 * TODO: Dùng useCounter() từ CounterContext để lấy increment, decrement, reset.
 *       Render 3 nút: Tăng (+), Giảm (−), Reset.
 *       Component này KHÔNG nhận bất kỳ props nào.
 */
import { useCounter } from "../../context/CounterContext";

export default function CounterControls() {
  const { increment, decrement, reset } = useCounter();
  return( <div>
    <button onClick={decrement}>−</button>
    <button onClick={reset}>Reset</button>
    <button onClick={increment}>+</button>
  </div>
  );
}
