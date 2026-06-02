/**
 * Bài 4 – Shopping Cart (useReducer)
 * =====================================
 * Mục tiêu: Giỏ hàng với thêm / xóa / thay đổi số lượng / xóa toàn bộ.
 *
 * Chạy test: npm test -- Ex04
 */
import { useReducer } from 'react'
import { Card, Button, Table, Badge, Row, Col, Form } from 'react-bootstrap'

// Danh sách sản phẩm mẫu (không cần sửa)
const PRODUCTS = [
  { id: 1, name: 'Áo thun',   price: 150000 },
  { id: 2, name: 'Quần jean', price: 350000 },
  { id: 3, name: 'Giày vải',  price: 280000 },
]

// ─────────────────────────────────────────────
// TODO 1: Định nghĩa initialState
// ─────────────────────────────────────────────
const initialState = { items: [] };

// ─────────────────────────────────────────────
// TODO 2: Viết reducer(state, action)
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }]
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QTY': {
      const { id, qty } = action.payload;
      // Chuyển đổi giá trị về kiểu Number để tính toán chính xác
      const numericQty = Number(qty);
      
      if (numericQty <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, qty: numericQty } : item
        )
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

export default function Ex04_ShoppingCart() {
  // TODO 3: Gọi useReducer
  const [state, dispatch] = useReducer(reducer, initialState);

  // ─────────────────────────────────────────────
  // TODO 4: Tính toán derived state (Bỏ toLocaleString để khớp với mong đợi của Test)
  // ─────────────────────────────────────────────
  const total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Card className="mx-auto" style={{ maxWidth: 650 }}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <strong>Bài 4 – Shopping Cart</strong>
        {/* TODO 5: Hiển thị itemCount */}
        <Badge bg="danger" data-testid="item-count">{itemCount}</Badge>
      </Card.Header>
      <Card.Body>

        {/* Danh sách sản phẩm */}
        <h6>Sản phẩm</h6>
        <Row className="mb-4">
          {PRODUCTS.map(p => (
            <Col key={p.id} xs={4}>
              <Card>
                <Card.Body className="p-2 text-center">
                  <div><strong>{p.name}</strong></div>
                  <div className="text-muted small">{p.price}đ</div>
                  {/* TODO 6: onClick dispatch ADD_ITEM */}
                  <Button
                    size="sm"
                    className="mt-1"
                    variant="primary"
                    data-testid={`btn-add-${p.id}`}
                    onClick={() => dispatch({ type: 'ADD_ITEM', payload: p })}
                  >
                    + Thêm
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Bảng giỏ hàng */}
        <h6>Giỏ hàng</h6>
        <Table size="sm" bordered data-testid="cart-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* TODO 7: Render state.items.map */}
            {state.items.map(item => (
              <tr key={item.id} data-testid={`cart-row-${item.id}`}>
                <td className="align-middle">{item.name}</td>
                <td className="align-middle">{item.price}đ</td>
                <td className="align-middle" style={{ width: 90 }}>
                  <Form.Control
                    type="number"
                    size="sm"
                    data-testid={`qty-input-${item.id}`}
                    value={item.qty}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_QTY',
                      payload: { id: item.id, qty: e.target.value }
                    })}
                  />
                </td>
                <td className="align-middle">{item.price * item.qty}đ</td>
                <td className="text-center align-middle">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    data-testid={`btn-remove-${item.id}`}
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Tổng tiền + Clear */}
        <div className="d-flex justify-content-between align-items-center">
          {/* TODO 8: Hiển thị tổng số tiền ở dạng số thuần túy */}
          <strong data-testid="cart-total">Tổng: {total}</strong>
          {/* TODO 9: onClick dispatch CLEAR_CART */}
          <Button 
            variant="outline-danger" 
            size="sm" 
            data-testid="btn-clear-cart"
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
          >
            Xóa giỏ hàng
          </Button>
        </div>

      </Card.Body>
    </Card>
  )
}