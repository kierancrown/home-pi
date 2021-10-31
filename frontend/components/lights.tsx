import { useEffect, useState } from 'react';
import { Lights, LightState } from '../types/hue';
import LightView from './Light';

export default function LightsView() {
    const [lights, setLights] = useState<Lights>();

    const getLights = async () => {
        const res = await fetch('http://127.0.0.1:8080/hue/lights', { cache: 'no-cache' });
        if (res.status === 200) {
            setLights((await res.json()) as Lights);
        } else {
            console.error('Unable to get lights from API');
        }
    };

    useEffect(() => {
        getLights();
    }, []);

    const toggleOn = async (id: string, state: LightState) => {
        const res = await fetch('http://127.0.0.1:8080/hue/lights/state', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, state }),
        });
        if (res.status === 200) {
            setLights((await res.json()) as Lights);
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
                        return <LightView light={light} onCallback={toggleOn} />;
                    })}
            </div>
        </>
    );
}
