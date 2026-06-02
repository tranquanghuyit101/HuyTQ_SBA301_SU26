/**
 * CounterDisplay.jsx – Hiển thị giá trị đếm hiện tại (Bài 1)
 *
 * TODO: Dùng useCounter() từ CounterContext để lấy count.
 *       Hiển thị giá trị count ra màn hình.
 *       Component này KHÔNG nhận bất kỳ props nào.
 */
import { useCounter } from "../../context/CounterContext";

export default function CounterDisplay() {
  const { count } = useCounter();
  return <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{count}</div>
}
