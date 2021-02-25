import Arweave from 'arweave';
import React from 'react'

const client = new Arweave({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

export function trimAddress(addr) {
  if (addr.length <= 0) {
    return addr
  }

  return addr.slice(0, 5) + '...' + addr.slice(-5)
}

export function useAddress(eventListenerCallback, deps) {
    const [address, setAddress] = React.useState('');
    const rDeps = deps ? [eventListenerCallback, ...deps] : [eventListenerCallback]

    React.useEffect(() => {
      addEventListener("arweaveWalletLoaded", async () => {
        const addr = await client.wallets.getAddress();
        console.log('arweave wallet loaded', addr)
        setAddress(addr);
        if (eventListenerCallback) {
          eventListenerCallback(addr)
        }
      });
    }, rDeps);
  
    return address
}

export function useHasAddress(eventListenerCallback, deps) {
  if (!eventListenerCallback) {
    eventListenerCallback = (addr) => {}
  }

  return useAddress((addr) => eventListenerCallback(addr.length > 0), deps).length > 0
}