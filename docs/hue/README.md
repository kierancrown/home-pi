# Home Pi - Hue Rest API

Connect to the hue bridge and controls hue lights.

### [GET] /hue/status

Returns an overview of the bridge status. Includes discovered lights object

**Example**

```
{
    status: 'Online',
    bridgeIP: 192.168.0.0,
    lights: {
        ...
    },
}
```

### [GET] /hue/lights

Returns discovered lights object. This includes information like power state, brigtness, etc

**Example**

```
{
    "1": {
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
}
```

### [GET] /hue/light/:id

Returns a single light object. Where _:id_ is set to the relevant light id

**Example**

```
{
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
```

### [PUT] /hue/lights/state

Accepts a single object or array of objects that describe the power state for specific hue lights

**Expected Input**

```(json5)
{
    {
        "id": "1",
        "state": {
            on: boolean;
            bri: number;    // Optional
            alert: string;  // Optional
            mode: string;   // Optional
        }
    }
}
```

**Example Response**

The response will return an updated lights array for each hue light affected
