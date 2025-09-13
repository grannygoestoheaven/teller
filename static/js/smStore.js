import "./AudioSm.js";

export function createSm(actions) {
    const sm = Window.AudioSm();
    sm.actions = actions; // the SM instance can reference external side effects
    return sm;
}
