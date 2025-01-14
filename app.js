import {createApp} from "vue";
import NewSpace from "./components/new_space.js";
import Space from "./components/space.js";

const app = createApp({
    template: `
      <Space v-if="selectedSpace" :selectedSpace="selectedSpace" @new-space="openSpace(null)"/>
      <NewSpace v-else @open-space="openSpace"/>
    `,
    components: {
        Space,
        NewSpace,
    },
    mounted() {
        document.getElementById("app").classList.add("mounted");

        window.addEventListener("popstate", (event) => {
            console.log(event)
            if (event.state) {
                this.selectedSpace = event.state.selectedSpace
            } else {
                this.selectedSpace = null
            }
        });
    },
    data() {
        return {
            selectedSpace: null
        }
    },
    methods: {
        openSpace(space) {
            this.selectedSpace = space
            if (!space) {
                window.history.pushState({selectedSpace: null}, "", "#")
            } else {
                window.history.pushState({selectedSpace: space}, "", `#${space}`)
            }
        },
    },
});
app.mount('#app')
