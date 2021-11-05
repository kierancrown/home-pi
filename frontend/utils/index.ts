async function waitFor(x: number): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(x);
        }, x);
    });
}

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

export { waitFor, classNames };
