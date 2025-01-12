import {watch} from "vue";
import Timer from "./timer.js";
import TodoList from "./todo.js";
import {store} from "../store.js"

export default {
    template: `
      <header class="header">
        <h1>
          <template v-if="selectedSpace">{{ selectedSpace }}</template>
        </h1>
        <nav>
          <ul class="header__menu">
            <li>
              <button @click="$emit('new-space')">new space</button>
            </li>
          </ul>
        </nav>
      </header>
      <main class="panels" v-if="selectedSpace">
        <Timer/>
        <TodoList/>
      </main>
    `,
    components: {
        Timer,
        TodoList,
    },
    props: {
        selectedSpace: {
            type: String,
            required: true
        }
    },
    emits: ['new-space'],
    created() {
        let state = JSON.parse(localStorage.getItem(this.storageKey));
        store.resetState(state)
        this.saveState();
    },
    mounted() {
        watch(
            () => store.state,
            (newState) => {
                console.log("Saving state", newState);
                this.saveState();
            },
            {deep: true}
        );
    },
    methods: {
        saveState() {
            localStorage.setItem(this.storageKey, JSON.stringify(store.state));
        }
    },
    computed: {
        storageKey() {
            return `space-${this.selectedSpace}`;
        }
    }
}
