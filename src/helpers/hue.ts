import axios from 'axios';

interface BridgeDiscoveries {
    id: string;
    internalipaddress: string;
}

async function discoverBridge(): Promise<BridgeDiscoveries[]> {
    const res = await axios.get('https://discovery.meethue.com/');
    if (Array.isArray(res.data)) return res.data;
    else return [];
}

export { discoverBridge };
