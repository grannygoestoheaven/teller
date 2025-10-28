import { elements, actions, sm } from "./config.js";
import { events } from "./listeners.js";
import { handleStateChange } from "./states.js";

export function startStateMachine() {

    sm = new AudioSm(); // the class is included in the html file, so we can call it here. It's the StateSmith approach. You don't edit the generated class.
    sm.actions = actions;

    const originalDispatch = sm.dispatchEvent.bind(sm);
    sm.dispatchEvent = (eventId) => {
    const prevStateId = sm.stateId;
    originalDispatch(eventId);
    const newStateId = sm.stateId;

    if (prevStateId !== newStateId) {
        handleStateChange(sm, newStateId);
    }
    };

    events(sm, elements);

    sm.start();
};
