import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ACTIONS, SetupContext } from '../context/setup';
import { ACTIONS as HOME_ACTIONS, Home, HomeContext } from '../context/home';
import { isEqual } from 'lodash';

interface Props {
    children?: JSX.Element;
}
const PageWrapper = ({ children }: Props): JSX.Element => {
    const { dispatch } = useContext(SetupContext);
    const { dispatch: homeDispatch, activeHome } = useContext(HomeContext);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // If nothing in local storage exists
    // Check if homes exist on server
    // If no open create home modal

    // If yes, set local storage

    // If in local storage allow right away
    // Check in background if still exists

    useEffect(() => {
        // Check if home exists
        setLoading(true);
        if (activeHome) {
            setLoading(false);
            (async () => {
                try {
                    const res = await axios({
                        method: 'get',
                        url: `http://localhost:8080/home/${activeHome._id}`,
                    });
                    if (isEqual(activeHome, res.data)) {
                        console.log('No changes in home obj');
                    } else if (homeDispatch) {
                        homeDispatch({ type: HOME_ACTIONS.SET_ACTIVE_HOME, value: res.data as Home });
                        console.log('Change in home obj');
                    }
                } catch (error) {
                    alert(String(error));
                }
            })();
            return;
        }
        (async () => {
            try {
                const res = await axios({
                    method: 'get',
                    url: 'http://localhost:8080/homes',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (res.data.error === true) {
                    alert(res.data.message);
                } else {
                    console.log(res.data);
                    if (Array.isArray(res.data) && res.data.length) {
                        if (res.data.length > 1) {
                            // Redirect to choose home
                        } else if (homeDispatch) {
                            // Redirect to home
                            homeDispatch({ type: HOME_ACTIONS.SET_ACTIVE_HOME, value: res.data[0] });
                            router.replace(`/`);
                        }
                        setLoading(false);
                    } else if (dispatch) {
                        dispatch({ type: ACTIONS.OPEN_SETUP_MODAL, value: true });
                    } else {
                        alert('Unable to use context');
                    }
                }
            } catch (error) {
                alert(String(error));
            }
        })();
    }, [activeHome, dispatch, homeDispatch, router]);

    return <>{loading ? 'Loading' : children}</>;
};

export default PageWrapper;
