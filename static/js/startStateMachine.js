import { handleStateChange } from "./states.js";

export function startStateMachine(sm) {

    const originalDispatch = sm.dispatchEvent.bind(sm);
    sm.dispatchEvent = (eventId) => {
    const prevStateId = sm.stateId;
    originalDispatch(eventId);
    const newStateId = sm.stateId;

    if (prevStateId !== newStateId) {
        handleStateChange(sm, newStateId);
    }
    };

    sm.start();
};
