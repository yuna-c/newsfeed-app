import { useEffect, useRef } from 'react';
import scrollLock from 'scroll-lock';

function Modal({ isOpen, onClose, children }) {
  // scroll 막을 대상을 useRef로 Dom의 어떤 요소의 스클롤을 막을지 직접 지정 console.log(scrollLock);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      scrollLock.disablePageScroll(modalRef.current);
    } else {
      scrollLock.enablePageScroll(modalRef.current);
    }

    return () => {
      scrollLock.clearQueueScrollLocks();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center w-full h-full bg-black/50"
      onClick={onClose}
      ref={modalRef} // ← 여기를 scrollLock이 참조해서 잠금
    >
      <div
        onClick={(e) => e.stopPropagation()} //내용 눌러도 안닫히게
        className="p-8 bg-white rounded-lg min-w-[90%] sm:min-w-[400px] xl:w-[50%] overflow-auto max-h-[90%]"
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
