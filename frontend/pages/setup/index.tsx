import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect } from 'react';
import SetupModal from '../../components/setup-modal';
import { SetupContext, ACTIONS } from '../../context/setup';

const SetupHome: NextPage = () => {
    const { dispatch } = useContext(SetupContext);

    useEffect(() => {
        if (dispatch) dispatch({ type: ACTIONS.OPEN_SETUP_MODAL, value: true });
    }, [dispatch]);

    return (
        <div>
            <Head>
                <title>Home Pi - Setup</title>
                <meta name="description" content="Home Pi is home automation software written by Kieran Crown" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SetupModal />
        </div>
    );
};

export default SetupHome;
