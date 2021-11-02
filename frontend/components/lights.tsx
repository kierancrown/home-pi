import { useEffect, useState } from 'react';
import { Lights, LightState } from '../types/hue';
import { waitFor } from '../utils';
import LightView from './Light';

export default function LightsView(): JSX.Element {
    const [lights, setLights] = useState<Lights>();

    const getLights = async () => {
        const res = await fetch('http://192.168.10.95:8080/hue/lights', { cache: 'no-cache' });
        if (res.status === 200) {
            setLights(await res.json());
        } else {
            console.error('Unable to get lights from API');
        }
        await waitFor(2500);
        await getLights();
    };

    useEffect(() => {
        getLights();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleOn = async (id: string, state: LightState) => {
        const res = await fetch('http://192.168.10.95:8080/hue/lights/state', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, state }),
        });
        if (res.status === 200) {
            setLights(await res.json());
            setTimeout(() => {
                getLights();
            }, 500);
        } else {
            console.error('Unable to set light state');
        }
    };

    return (
        <>
            <div className="header space-y-3 flex flex-col mb-5">
                <h1 className="text-3xl font-bold">Lights</h1>
            </div>
            <div role="list" className="flex space-x-4">
                {lights &&
                    Object.values(lights).map((light) => {
                        return <LightView key={light.uniqueid} light={light} onCallback={toggleOn} />;
                    })}
            </div>
        </>
    );
}
