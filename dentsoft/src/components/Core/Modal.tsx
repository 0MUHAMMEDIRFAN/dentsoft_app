import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

interface ModalButton {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    loading?: boolean;
}

interface ModalProps {
    isShow: boolean;
    setShow: (show: boolean) => void;
    title: string;
    children: React.ReactNode;
    // maxHeight?: string;
    // size?: 'sm' | 'md' | 'lg' | 'xl';
    // Button configuration
    showButtons?: boolean;
    // buttons?: ModalButton[];
    // Legacy support for simple submit/cancel pattern
    onSubmit?: () => void;
    onCancel?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
}

function Modal({
    isShow,
    setShow,
    onCancel,
    onSubmit,
    showButtons = true,
    title,
    children,
    cancelLabel = "Discard",
    submitLabel = "Save",
    loading = false,
}: ModalProps) {

    const closeModal = () => {
        if (!loading) {
            if (onCancel) {
                onCancel();
            }
            setShow(false);
        }
    }
    return (
        <>
            <Transition appear show={isShow} as={Fragment}>
                <Dialog as="div" className="relative z-[500] " onClose={closeModal}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto ">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-x-full scale-75"
                                enterTo="opacity-100 translate-x-0 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-x-0 tanslate-y-0 scale-100 "
                                leaveTo="opacity-0 translate-x-3/4 -translate-y-20 scale-75"
                            >
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        <p className='font-semibold text-base'>
                                            {title}
                                        </p>
                                    </DialogTitle>
                                    <button
                                        className={`${(loading) ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-5 top-6`}
                                        onClick={closeModal}
                                        disabled={loading}
                                    >
                                        <i className='bx bx-x text-2xl leading-7' />
                                    </button>

                                    <div className='flex text-sm w-full'>
                                        <form className='w-full' onSubmit={(event) => {
                                            event.preventDefault();
                                            if (onSubmit) {
                                                onSubmit()
                                            }
                                        }}>

                                            {children}

                                            {showButtons &&
                                                <div className='mt-6 flex gap-2.5'>
                                                    <button
                                                        type="submit"
                                                        className={`${(loading) ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}
                                                        disabled={loading}
                                                    >
                                                        {loading ? <i className='bx bx-loader-alt animate-spin'></i> : submitLabel}
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className={`${(loading) ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`}
                                                        onClick={closeModal}
                                                        disabled={loading}
                                                    >
                                                        {cancelLabel}
                                                    </button>
                                                </div>}
                                        </form>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Modal