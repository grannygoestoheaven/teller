import { handleStateChange } from "./states.js";

// export function startStateMachine(sm) {

//     const originalDispatch = sm.dispatchEvent.bind(sm);

//     sm.dispatchEvent = (eventId) => {
//     const prevStateId = sm.stateId;
//     originalDispatch(eventId);
//     const newStateId = sm.stateId;

//     if (prevStateId !== newStateId) {
//         handleStateChange(sm, newStateId);
//     }
//     };

//     sm.start();
// };

export function startStateMachine(sm) {

    const originalDispatch = sm.dispatchEvent.bind(sm);
    
    sm.dispatchEvent = (eventId) => {
        // set a property on the instance before the dispatch, ensuring the history is accessible to the handler.
        sm.previousStateId = sm.stateId;
        // Update sm.stateId to the new state
        originalDispatch(eventId);
        const newStateId = sm.stateId;

        if (sm.previousStateId !== newStateId) {
            // Only pass sm and the new state ID, as history is now on sm
            handleStateChange(sm, newStateId); 
        }
    };
    sm.start();
};