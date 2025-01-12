import {createApp} from "vue";
import Timer from "./components/timer.js";
import TodoList from "./components/todo.js";
import Area from "./components/area.js"

const app = createApp({
    template: `
      <div class="container">
        <header class="header"><h1>Now</h1></header>
        <div class="panels">
          <Timer/>
          <TodoList/>
        </div>
<!--        <Area/>-->
        <div>
        </div>
      </div>
    `,
    components: {
        Timer,
        TodoList,
        Area
    },
    data() {
        return {
            message: "banana"
        }
    },
    methods: {
        testMethod() {
            return this.message + "!";
        }
    },
    mounted() {
        document.getElementById("app").classList.add("mounted");
    }
})
app.mount('#app')