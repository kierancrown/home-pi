import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext } from 'react';
import { HomeContext } from '../context/home';
import { SetupContext, ACTIONS } from '../context/setup';

const Home: NextPage = () => {
    const { activeHome } = useContext(HomeContext);
    const { dispatch } = useContext(SetupContext);

    return (
        <div>
            <Head>
                <title>Home Pi - Home Overview</title>
                <meta name="description" content="Home Pi is home automation software written by Kieran Crown" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="header space-y-3 flex flex-col mb-10">
                <h1 className="text-5xl font-bold">{activeHome?.name}</h1>
                <h2 className="text-2xl font-medium ml-1">This is an overview of every smart device in your home</h2>
            </div>
            {activeHome?.rooms.length ? (
                activeHome.rooms.map((room) => {
                    <p>Room: {room}</p>;
                })
            ) : (
                <button
                    onClick={() => {
                        if (dispatch) dispatch({ type: ACTIONS.OPEN_ROOM_MODAL, value: true });
                    }}
                >
                    Create room
                </button>
            )}
        </div>
    );
};

export default Home;
