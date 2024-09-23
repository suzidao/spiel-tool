/** @format */
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ReactNode } from "react";
import { HiMiniXMark as CloseX } from "react-icons/hi2";

export default function Modal(props: {
  title: string;
  children: ReactNode;
  actionText?: string;
  modalAction?: () => void;
}) {
  const { title, children } = props;
  const router = useRouter();
  const dialogRef = useRef<React.ElementRef<"dialog">>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeModal = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
    e.target === dialogRef.current && router.back();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={closeModal}
      onClose={router.back}
      className="backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="bg-white">
        <div className="flex justify-between items-center border-b border-black pl-3 pr-2 py-2">
          <span className="font-semibold text-lg">{title}</span>
          <form method="dialog" className="flex items-center">
            <button>
              <CloseX className="h-6 w-6" />
            </button>
          </form>
        </div>
        <div className="w-auto">{children}</div>
        {/* <div className="flex justify-center items-center gap-2 p-2">
          <form className="m-4" method="dialog">
            <button>Close</button>
          </form>
          {!!actionText && !!modalAction && (
            <button type="submit" onClick={modalAction}>
              {actionText}
            </button>
          )}
        </div> */}
      </div>
    </dialog>
  );
}
