export default {
    template: `
    <div class="page new-project-page">
      <header class="header">
        <h1>Last mile</h1>
      </header>
      <main class="new-project">
        <div class="new-project__spaces">
          <form @submit.prevent="$emit('open-space', newSpaceInput)" class="new-project__form">
            <input class="new-project__input" type="text"
                   minlength="1"
                   maxlength="30"
                   required
                   v-model="newSpaceInput"
                   autofocus
                   placeholder="Space name..."/>
            <button class="button-with-border">Create</button>
          </form>
          <div class="new-project__recent" v-if="lastSpace">
            Open
            <button class="new-project__button"
                    @click="$emit('open-space', lastSpace.name)">
              {{ lastSpace.name }}
            </button>
            , or
            <button @click="spacesShown = !spacesShown" class="new-project__button">
              view recent spaces
            </button>
          </div>
        </div>
        <ul class="new-project__spaces-list" v-if="spacesShown && spacesList.length">
          <li class="new-project__space-entry" v-for="space in spacesList" :key="space.name">
            <button @click="$emit('open-space', space.name)"
                    class="new-project__button">
              {{ space.name }} ({{ space.completedTasks }}/{{ space.totalTasks }})
            </button>
            ·
            <button @click="downloadSpaceJson(space.name)">download</button>
            ·
            <button @click="space.prompt = true" v-if="!space.prompt">delete</button>
            <div v-else>
              <button @click="deleteSpace(space.name)">yes</button>
              /
              <button @click="space.prompt = false">no</button>
            </div>
          </li>
        </ul>
        <article class="new-project__description">
          <p>
            The “Last mile” is your space for focusing on and progressing through a single task. Each space includes a
            plain to-do list and a timer.
            This is not a replacement for a full-fledged task tracker. It’s a tool for tackling one bite-sized task at
            a time.
          </p>
          <p>
            Spaces are meant to be temporary. Once you’re done with a task, delete the space and move on.
          </p>
          <p>
            All data is stored locally in your browser’s storage, ensuring simplicity and privacy.
          </p>
          <p>
            It is a shameless copy of an <span class="daily-place">daily.place</span> app.
          </p>
        </article>
      </main>
    </div>
  `,
    emits: ['open-space'],
    created() {
        this.loadSpacesList();
    },
    data() {
        return {
            spacesList: [],
            newSpaceInput: "",
            spacesShown: false
        };
    },
    computed: {
        lastSpace() {
            return this.spacesList.length ? this.spacesList[this.spacesList.length - 1] : null;
        }
    },
    methods: {
        loadSpacesList() {
            this.spacesList = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith("space-")) {
                    try {
                        const spaceData = JSON.parse(localStorage.getItem(key));
                        const completedTasks = spaceData.todos.filter(task => task.checked).length;
                        this.spacesList.push({
                            name: key.slice(6),
                            completedTasks,
                            totalTasks: spaceData.todos.length,
                            prompt: false  // Initialize for deletion confirmation
                        });
                    } catch (e) {
                        console.error(`Error parsing data for key ${key}:`, e);
                    }
                }
            }
        },
        deleteSpace(space) {
            localStorage.removeItem(`space-${space}`);
            this.loadSpacesList();
        },
        downloadSpaceJson(space) {
            const spaceData = localStorage.getItem(`space-${space}`);
            const blob = new Blob([spaceData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${space}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    },
}
