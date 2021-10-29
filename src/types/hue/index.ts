interface Light {
    id?: string;
    state: {
        on: boolean;
        bri: number;
        alert: string;
        mode: string;
        reachable: boolean;
    };
    swupdate: {
        state: string;
        lastinstall: string;
    };
    type: string;
    name: string;
    modelid: string;
    manufacturername: string;
    productname: string;
    capabilities: {
        certified: boolean;
        control: {
            mindimlevel: number;
            maxlumen: number;
        };
        streaming: {
            renderer: boolean;
            proxy: boolean;
        };
    };
    config: {
        archetype: string;
        function: string;
        direction: string;
        startup: {
            mode: string;
            configured: boolean;
        };
    };
    uniqueid: string;
    swversion: string;
    swconfigid: string;
    productid: string;
}

interface Lights {
    [key: string]: Light;
}

export { Light, Lights };
