/**
 * Bài 3 – Todo List (useReducer)
 * ================================
 * Mục tiêu: Quản lý danh sách công việc với useReducer.
 *
 * Chạy test: npm test -- Ex03
 */
import { useReducer, useState } from 'react'
import { Card, Form, Button, ListGroup, Badge, ButtonGroup } from 'react-bootstrap'

// ─────────────────────────────────────────────
// TODO 1: Định nghĩa initialState
//   - Là mảng rỗng []
//   (mỗi todo: { id, text, done })
// ─────────────────────────────────────────────
const initialState = [];

// ─────────────────────────────────────────────
// TODO 2: Viết reducer(state, action)
//
//   Case 'ADD_TODO':
//     - action.payload = { id: Date.now(), text: '...', done: false }
//     - Trả về [...state, action.payload]
//
//   Case 'TOGGLE_TODO':
//     - action.payload = id của todo cần toggle
//     - Dùng .map() để đảo done của todo có id khớp
//
//   Case 'DELETE_TODO':
//     - action.payload = id của todo cần xóa
//     - Dùng .filter() để loại bỏ
//
//   Case 'CLEAR_DONE':
//     - Xóa tất cả todo có done = true
//     - Dùng .filter(t => !t.done)
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    case 'CLEAR_DONE':
      return state.filter(todo => !todo.done);
    default:
      return state;
  }
}

export default function Ex03_TodoList() {
  // TODO 3: Gọi useReducer(reducer, initialState)
  const [state, dispatch] = useReducer(reducer, initialState);

  // Input text (dùng useState riêng – đây là UI state, không phải app state)
  const [text, setText] = useState('')

  // ─────────────────────────────────────────────
  // TODO 4: Viết hàm handleAdd()
  //   - Nếu text.trim() rỗng thì return (không làm gì)
  //   - dispatch ADD_TODO với payload { id: Date.now(), text: text.trim(), done: false }
  //   - setText('') để xóa input
  // ─────────────────────────────────────────────
  function handleAdd() {
    if (!text.trim()) return;
    
    dispatch({
      type: 'ADD_TODO',
      payload: {
        id: Date.now(),
        text: text.trim(),
        done: false
      }
    });
    
    setText('');
  }

  // Derived state: đếm số todo chưa xong
  // TODO 5: Tính pendingCount = state.filter(t => !t.done).length
  const pendingCount = state.filter(t => !t.done).length;

  return (
    <Card className="mx-auto" style={{ maxWidth: 500 }}>
      <Card.Header>
        <strong>Bài 3 – Todo List</strong>{' '}
        {/* TODO 6: Hiển thị pendingCount trong Badge */}
        <Badge bg="primary" data-testid="pending-count">{pendingCount}</Badge>
        {' '}việc chưa xong
      </Card.Header>
      <Card.Body>

        {/* Form thêm todo */}
        <div className="d-flex gap-2 mb-3">
          <Form.Control
            data-testid="todo-input"
            placeholder="Nhập công việc..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          {/* TODO 7: onClick gọi handleAdd */}
          <Button data-testid="btn-add-todo" onClick={handleAdd}>Thêm</Button>
        </div>

        {/* Danh sách todo */}
        {/* TODO 8: Render state.map(todo => ...) */}
        <ListGroup data-testid="todo-list" className="mb-3">
          {state.map(todo => (
            <ListGroup.Item
              key={todo.id}
              data-testid={`todo-item-${todo.id}`}
              className="d-flex align-items-center gap-2"
            >
              <span 
                className="flex-grow-1"
                style={{ textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#aaa' : '#000' }}
              >
                {todo.text}
              </span>
              
              <ButtonGroup className="ms-auto" size="sm">
                <Button 
                  variant={todo.done ? 'secondary' : 'success'}
                  data-testid={`btn-toggle-${todo.id}`}
                  onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                >
                  {todo.done ? 'Hoàn tác' : 'Xong'}
                </Button>
                <Button 
                  variant="outline-danger"
                  data-testid={`btn-delete-${todo.id}`}
                  onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                >
                  Xóa
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Nút xóa tất cả đã xong */}
        {/* TODO 9: onClick dispatch CLEAR_DONE */}
        <Button 
          variant="outline-danger" 
          size="sm" 
          data-testid="btn-clear-done"
          onClick={() => dispatch({ type: 'CLEAR_DONE' })}
        >
          Xóa việc đã xong
        </Button>

      </Card.Body>
    </Card>
  )
}