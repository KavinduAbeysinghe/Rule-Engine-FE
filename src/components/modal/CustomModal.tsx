import { Modal } from "react-bootstrap";

interface CustomModalProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    body: any;
    size?: "sm" | "lg" | "xl";
}

const CustomModal = ({show, handleClose, title,body, size}: CustomModalProps) => {

    return (
        <>
            <Modal show={show} onHide={handleClose} centered size={size}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
            </Modal>
        </>
    );
}

export default CustomModal;