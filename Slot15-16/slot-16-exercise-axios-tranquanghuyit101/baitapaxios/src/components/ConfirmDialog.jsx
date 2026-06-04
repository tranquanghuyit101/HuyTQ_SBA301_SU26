import { Button, Modal } from 'react-bootstrap'

function ConfirmDialog({ visible, title, message, onCancel, onConfirm }) {
  return (
    <Modal show={visible} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDialog
