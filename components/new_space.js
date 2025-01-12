export default {
    template: `
      <div class="container">
        <header class="header">
          <h1>
            Last mile
          </h1>
        </header>
        <main class="new-project">
          <div class="new-project__spaces">
            <form @submit.prevent="$emit('open-space', newSpaceInput)" class="new-project__form">
              <input class="new-project__input" type="text"
                     minlength="1"
                     maxlength="20"
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
              <button @click="spacesShown=!spacesShown" class="new-project__button">show recent spaces</button>
            </div>
          </div>
          <ul class="new-project__spaces-list" v-if="spacesShown && spacesList.length">
            <li class="new-project__space-entry" v-for="space in spacesList">
              <button @click="$emit('open-space', space.name)"
                      class="new-project__button">
                {{ space.name }}
              </button>
              ·
              <button @click="downloadSpaceJson(space.name)">download</button>
              ·
              <button @click="space.prompt=true" v-if="!space.prompt">delete</button>
              <div v-else>
                <button @click="deleteSpace(space.name)">yes</button>
                /
                <button @click="space.prompt=false">no</button>
              </div>
            </li>
          </ul>
          <article class="new-project__description">
            <p>
              "Last mile" is space for progressing through single task. It has a timer and a todo list. It is not a
              replacement for a full-fledged task tracker. It is a tool for focusing on one thing at a time.
            </p>
            <p>
              Spaces are ment to be temporary. You can create a new space for a new task, or continue with the last one.
            </p>
            <p>
              Everything is stored in browser's local storage.
            </p>
            <p>
              Inspired by <span class="daily-place">daily.place</span> app.
            </p>
          </article>
        </main>
      </div>
    `,
    created() {
        this.loadSpacesList();
    },
    emits: ['open-space'],
    data() {
        return {
            spacesList: [],
            newSpaceInput: "",
            spacesShown: false
        }
    },
    computed: {
        lastSpace() {
            if (this.spacesList) {
                return this.spacesList[this.spacesList.length - 1];
            } else {
                return null;
            }
        }
    },
    methods: {
        loadSpacesList() {
            this.spacesList = []
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (key.startsWith("space-")) {
                    this.spacesList.push({
                        name: key.slice(6)
                    });
                }
            }
        },
        deleteSpace(space) {
            localStorage.removeItem(`space-${space}`);
            this.loadSpacesList();
        },
        downloadSpaceJson(space) {
            const spaceData = localStorage.getItem(`space-${space}`);
            const blob = new Blob([spaceData], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${space}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    },
}
