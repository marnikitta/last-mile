import {createApp} from "vue";
import Timer from "./components/timer.js";
import TodoList from "./components/todo.js";

const app = createApp({
    template: `
      <div class="container">
        <header class="header">
          <h1>
            <template v-if="selectedSpace">{{ selectedSpace }}</template>
            <template v-else>Now</template>
          </h1>
          <nav>
            <ul class="header__menu">
              <li>
                <button @click="selectedSpace=null">new space</button>
              </li>
              <li>
                <button>spaces</button>
              </li>
            </ul>
          </nav>
        </header>
        <main class="panels" v-if="selectedSpace">
          <Timer/>
          <TodoList/>
        </main>
        <main class="new-project" v-else>
          <form @submit.prevent="createSpace" class="new-project__form">
            <input class="new-project__input" type="text"
                   minlength="1"
                   maxlength="20"
                   required
                   v-model="spaceInput"
                   placeholder="Space name..."/>
            <button class="button-with-border">Create</button>
          </form>
          <article class="new-project__description">
            <p>
              "Now" is an app for progressing through single task. It has a timer and a todo list. It is not a regular
              task tracker.
            </p>
            <p>
              Everything is stored in browser's local storage.
            </p>
            <p>
              Inspired by <span class="cursive">daily.place</span> app.
            </p>
          </article>
        </main>
      </div>
    `,
    components: {
        Timer,
        TodoList,
    },
    created() {
        this.loadSpacesList();
    },
    mounted() {
        document.getElementById("app").classList.add("mounted");
    },
    data() {
        return {
            spaces: [],
            selectedSpace: null,
            spaceInput: ""
        }
    },
    methods: {
        createSpace(space) {
            this.spaces.push(this.spaceInput);
            this.persistSpace(this.spaceInput, {
                timer: {},
                todo: {items: []}
            });
            this.openSpace(this.spaceInput);
        },
        openSpace(space) {
            this.selectedSpace = space;
        },
        loadSpacesList() {
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (key.startsWith("space-")) {
                    this.spaces.push(key.slice(6));
                }
            }
        },
        persistSpace(name, body) {
            localStorage.setItem(`space-${name}`, JSON.stringify(body));
        }
    }
});
app.mount('#app')