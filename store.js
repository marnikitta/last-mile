import {reactive} from 'vue';

const state = reactive({
    /**
     * @type {number}
     */
    completedSets: 0,
    /**
     * @type {Array<{id: number, text: string, checked: boolean}>}
     */
    todos: [],
});

export const store = {
    state,

    setCompletedSets(sets) {
        state.completedSets = sets;
    },

    updateTodos(todos) {
        state.todos = todos;
    },

    resetState(defaultState) {
        if (defaultState === null) {
            state.completedSets = 0;
            state.todos = [];
        } else {
            Object.assign(state, defaultState);
        }
    },
};