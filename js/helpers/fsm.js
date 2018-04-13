/**
 *  {
 *      state1: {
 *          action1: callback1
 *          action2: callback2
 *      },
 *      state2: {
 *          action1: callback1
 *      }
 *  }
 */

function fsm(states, initialState) {
    this.currentState = initialState;

    return {
        action: function(action) {
            states[this.currentState][action]();
        },

        transition: function(state) {
            this.currentState = state;
        },

        currentState: this.currentState
    }
}
