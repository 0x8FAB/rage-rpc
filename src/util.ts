enum MpTypes {
    Blip = 'b',
    Checkpoint = 'cp',
    Colshape = 'c',
    Label = 'l',
    Marker = 'm',
    Object = 'o',
    Pickup = 'p',
    Player = 'pl',
    Vehicle = 'v'
}
const DEBUG = false;

function isObjectMpType(obj: any, type: MpTypes) {
    try {
        const client = getEnvironment() === 'client';
        if (obj && typeof obj === 'object' && typeof obj.id !== 'undefined') {
            const test = (type, collection, mpType) => client ? obj.type === type && collection.at(obj.id) === obj : obj instanceof mpType;
            switch (type) {
                case MpTypes.Blip: return test('blip', mp.blips, mp.Blip);
                case MpTypes.Checkpoint: return test('checkpoint', mp.checkpoints, mp.Checkpoint);
                case MpTypes.Colshape: return test('colshape', mp.colshapes, mp.Colshape);
                case MpTypes.Label: return test('textlabel', mp.labels, mp.TextLabel);
                case MpTypes.Marker: return test('marker', mp.markers, mp.Marker);
                case MpTypes.Object: return test('object', mp.objects, mp.Object);
                case MpTypes.Pickup: return test('pickup', mp.pickups, mp.Pickup);
                case MpTypes.Player: return test('player', mp.players, mp.Player);
                case MpTypes.Vehicle: return test('vehicle', mp.vehicles, mp.Vehicle);
            }
        }
        return false;
    } catch (err) {
        // handle error
        if (DEBUG) mp.console.logError(`isObjectMpType: ${err}`);
    }
}

export function uid(): string {
    try {
        const first = (Math.random() * 46656) | 0;
        const second = (Math.random() * 46656) | 0;
        const firstPart = ('000' + first.toString(36)).slice(-3);
        const secondPart = ('000' + second.toString(36)).slice(-3);
        return firstPart + secondPart;
    } catch (err) {
        // handle error
        if (DEBUG) mp.console.logError(`catch uid(): ${err}`);
    }
}

export function getEnvironment(): string {
    try {
        if (typeof(mp) === 'undefined') return 'react';
        else if (mp.joaat) return 'server';
        else if (mp.game && mp.game.joaat) return 'client';
        else if (mp.trigger) return 'cef';
    } catch (err) {
        // handle error
        if (DEBUG) mp.console.logError(`catch getEnvironment: ${err}`);
    }
}

export function stringifyData(data: any): string {
    try {
        const env = getEnvironment();
        return JSON.stringify(data, (_, value) => {
            if (env === 'client' || env === 'server' && value && typeof value === 'object') {
                let type;

                if (isObjectMpType(value, MpTypes.Blip)) type = MpTypes.Blip;
                else if (isObjectMpType(value, MpTypes.Checkpoint)) type = MpTypes.Checkpoint;
                else if (isObjectMpType(value, MpTypes.Colshape)) type = MpTypes.Colshape;
                else if (isObjectMpType(value, MpTypes.Marker)) type = MpTypes.Marker;
                else if (isObjectMpType(value, MpTypes.Object)) type = MpTypes.Object;
                else if (isObjectMpType(value, MpTypes.Pickup)) type = MpTypes.Pickup;
                else if (isObjectMpType(value, MpTypes.Player)) type = MpTypes.Player;
                else if (isObjectMpType(value, MpTypes.Vehicle)) type = MpTypes.Vehicle;

                if (type) return {
                    __t: type,
                    i: typeof value.remoteId === 'number' ? value.remoteId : value.id
                };
            }

            return value;
        });
    } catch (err) {
        // handle error
        if (DEBUG) mp.console.logError(`catch stringifyData: ${err}`);
    }
}

export function parseData(data: string): any {
    try {
        const env = getEnvironment();
        return JSON.parse(data, (_, value) => {
            if ((env === 'client' || env === 'server') && value && typeof value === 'object' && typeof value['__t'] === 'string' && typeof value.i === 'number' && Object.keys(value).length === 2) {
                const id = value.i;
                const type = value['__t'];
                let collection;

                switch (type) {
                    case MpTypes.Blip: collection = mp.blips; break;
                    case MpTypes.Checkpoint: collection = mp.checkpoints; break;
                    case MpTypes.Colshape: collection = mp.colshapes; break;
                    case MpTypes.Label: collection = mp.labels; break;
                    case MpTypes.Marker: collection = mp.markers; break;
                    case MpTypes.Object: collection = mp.objects; break;
                    case MpTypes.Pickup: collection = mp.pickups; break;
                    case MpTypes.Player: collection = mp.players; break;
                    case MpTypes.Vehicle: collection = mp.vehicles; break;
                }

                if (collection) return collection[env === 'client' ? 'atRemoteId' : 'at'](id);
            }

            return value;
        });
    } catch (err) {
        // handle error
        if (DEBUG) mp.console.logError(`catch parseData: ${err}`);
    }
}

// export function promiseResolve(result: any): Promise<any> {
//     try {
//         return new Promise(resolve => setTimeout(() => resolve(result), 0));
//     } catch (err) {
//         // handle error
//         if (DEBUG) mp.console.logError(`catch promiseResolve: ${err}`);
//     }
// }

// export function promiseReject(error: any): Promise<any> {
//     try {
//         return new Promise((_, reject) => setTimeout(() => reject(error), 0));
//     } catch (err) {
//         // handle error
//         if (DEBUG) mp.console.logError(`catch promiseReject: ${err}`);
//     }
// }

export function promiseTimeout(promise: Promise<any>, timeout?: number) {
    try {
        if (typeof timeout === 'number') {
            return Promise.race([
                new Promise((_, reject) => {
                    setTimeout(() => reject('TIMEOUT'), timeout);
                }),
                promise
            ]);
        } else return promise;
    } catch (err) {
        // handle error
        if (DEBUG) mp.console.logError(`catch promiseTimeout: ${err}`);
    }
}

export function isBrowserValid(browser: Browser): boolean {
    try {
        browser.url;
    } catch (e) {
        if (DEBUG) mp.console.logError(`catch OK: isBrowserValid: ${e}`);
        return false;
    }
    return true;
}

export function chunkSubstr(str: string, size: number): Array<String> {
    try {
    const numChunks = Math.ceil(str.length / size);
    var chunks = new Array(numChunks);

    let index = 0;
    for (let i = 0; i < numChunks; i += 1) {
        chunks[i] = str.substr(index, size);

        index += size;
    }

        return chunks;
    } catch (err) {
        // handle error
        if (DEBUG) mp.console.logError(`catch chunkSubstr: ${err}`);
    }
}