/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { SetupContext, ACTIONS } from '../context/setup';
import { classNames } from '../utils';
import axios from 'axios';
import { useRouter } from 'next/router';

function CreateRoomModal(): JSX.Element {
    const { createRoomModalOpen, dispatch } = useContext(SetupContext);
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState<false | string>(false);
    const router = useRouter();

    const setOpen = (value: boolean) => {
        if (dispatch) dispatch({ type: ACTIONS.OPEN_ROOM_MODAL, value });
    };

    const createRoomReq = async (): Promise<void> => {
        try {
            const res = await axios({
                method: 'put',
                url: 'http://localhost:8080/room',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    name: roomName,
                }),
            });
            if (res.data.error === true) {
                setError(res.data.message);
            } else {
                console.log('Created room with id' + res.data.id);
                router.replace('/rooms');
                setOpen(false);
            }
        } catch (error) {
            setError(String(error));
        }
    };

    return (
        <Transition.Root show={createRoomModalOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 space-y-5">
                            <div>
                                <div className="text-left">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Setup a new room
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Setup rooms so you can group devices together
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="room" className="sr-only">
                                    Room Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="room"
                                        id="room"
                                        className={classNames(
                                            'block w-full pr-10 sm:text-sm rounded-md',
                                            error !== false
                                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                                : 'focus:ring-blue-500 focus:border-blue-500',
                                        )}
                                        placeholder="Room Name"
                                        value={roomName}
                                        onChange={(e) => {
                                            setRoomName(e.currentTarget.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                createRoomReq();
                                            }
                                        }}
                                        aria-invalid={error ? 'true' : 'false'}
                                        aria-describedby={error ? 'room-name-error' : 'room-name'}
                                    />
                                    {error !== false && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <ExclamationCircleIcon
                                                className="h-5 w-5 text-red-500"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    )}
                                </div>
                                {error !== false && (
                                    <p className="mt-2 text-sm text-red-600" id="email-error">
                                        {error}
                                    </p>
                                )}
                            </div>
                            <div className="">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                    onClick={createRoomReq}
                                >
                                    Create new room
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default CreateRoomModal;
