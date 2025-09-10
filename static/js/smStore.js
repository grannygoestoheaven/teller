import { AudioSm } from "AudioSm.js";

export function createSm(actions) {
    const sm = new AudioSm();
    sm.actions = actions; // the SM instance can reference external side effects
    return sm;
}