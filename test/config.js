// This line overrides the jest buffer's prototype for compatability with nacl
global.Buffer = Buffer;
global.Uint8Array = Uint8Array;

Object.setPrototypeOf(global.Buffer.prototype, global.Uint8Array.prototype);
