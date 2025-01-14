import {createApp} from "vue";
import NewSpace from "./components/new_space.js";
import Space from "./components/space.js";

const app = createApp({
    template: `
      <Space v-if="selectedSpace" :selectedSpace="selectedSpace" @new-space="selectedSpace=null"/>
      <NewSpace v-else @open-space="openSpace"/>
    `,
    components: {
        Space,
        NewSpace,
    },
    mounted() {
        document.getElementById("app").classList.add("mounted");
    },
    data() {
        return {
            selectedSpace: null
        }
    },
    methods: {
        openSpace(space) {
            this.selectedSpace = space
        },
    },
});
app.mount('#app')
