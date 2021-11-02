import React from 'react';
import { Light, LightState } from '../types/hue';

interface LightViewProps {
    light: Light;
    onCallback: (id: string, state: LightState) => Promise<void>;
}

const LightView = ({ light, onCallback }: LightViewProps): JSX.Element => {
    return (
        <div
            key={light.id}
            className="flex flex-col items-center text-center bg-gray-100 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-200 cursor-pointer w-36 h-36 p-4"
            onClick={() => onCallback(light.id || '-1', { on: !light.state.on })}
            style={{ color: light.state.on ? 'orange' : 'gray' }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
                data-icon="lightbulb"
                data-prefix="fad"
                viewBox="0 0 352 512"
            >
                <g className="fa-group">
                    <path
                        fill="currentColor"
                        d="M175.45 0C73.44.31 0 83 0 176a175 175 0 0043.56 115.78c16.52 18.85 42.36 58.22 52.21 91.45 0 .26.07.52.11.78h160.24c0-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45A175.9 175.9 0 00175.45 0zm.55 96a80.09 80.09 0 00-80 80 16 16 0 01-32 0A112.12 112.12 0 01176 64a16 16 0 010 32z"
                        className="fa-secondary"
                        opacity="0.4"
                    ></path>
                    <path
                        fill="currentColor"
                        d="M96.06 454.35L96 416h160v38.35a32 32 0 01-5.41 17.65l-17.09 25.73A32 32 0 01206.86 512h-61.71a32 32 0 01-26.64-14.28L101.42 472a32 32 0 01-5.36-17.65z"
                        className="fa-primary"
                    ></path>
                </g>
            </svg>
            <h4 className="font-medium text line-clamp-2 mt-4">{light.name}</h4>
        </div>
    );
};

export default LightView;
