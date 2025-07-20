function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()} //내용 눌러도 안닫히게
        className="p-8 bg-white rounded-lg min-w-[50%] max-w-[90%]"
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
