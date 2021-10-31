async function waitFor(x: number): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(x);
        }, x);
    });
}
export { waitFor };
