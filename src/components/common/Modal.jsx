function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center w-full h-full bg-black/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()} //내용 눌러도 안닫히게
        className="p-8 bg-white rounded-lg min-w-[90%] sm:min-w-[400px] xl:w-[50%]"
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
