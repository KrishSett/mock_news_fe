export function writeLog (msg, type) {
    switch (type) {
        case 'error':
            console.log(msg);
            break;
        default:
            console.warn(msg);
    }
}