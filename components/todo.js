import Checkbox from "./chekbox.js";
import {store} from "../store.js";

export default {
    template: `
      <section class="panel todo">
        <header class="panel__header">
          <div class="panel__title-group">
            <h2>todo</h2>
            <span class="panel__subtitle">{{ doneText }}</span>
          </div>
          <button @click="sortList">
            sort
          </button>
        </header>
        <main>
          <ul class="todo__list">
            <li v-for="(item, index) in items" :key="item.id" class="todo-item">
              <div class="todo-item__controls">
                <checkbox v-model="item.checked"/>
                <input placeholder="..."
                       type="text"
                       @keydown.prevent.enter="addItem(item.id)"
                       @keydown.prevent.up="moveFocus(index, -1)"
                       @keydown.prevent.down="moveFocus(index, 1)"
                       @keydown.delete="removeItem(item.id, true)"
                       :ref="'input-' + item.id"
                       v-model="item.text" class="todo-item__input"/>
              </div>
              <button class="todo-item__button" @click="removeItem(item.id)">×</button>
            </li>
          </ul>
        </main>
      </section>
    `,
    components: {
        Checkbox
    },
    created() {
        this.items = store.state.todos;
        if (this.items.length === 0) {
            this.addItem(null);
        }
    },
    data() {
        return {
            textInput: "",
            items: [
                {id: 0, text: "Launch a new labeling session", checked: false},
                {id: 1, text: "Wait for feedback", checked: true},
                {id: 2, text: "Item 3", checked: false},
                {id: 3, text: "Fix buttons in timer. They look shitty", checked: false},
            ]
        }
    },
    computed: {
        doneText() {
            let checkedCount = this.items.filter(item => item.checked).length
            return `${checkedCount}/${this.items.length}`
        }
    },
    methods: {
        addItem(after = null) {
            let id = Math.max.apply(null, this.items.map(item => item.id));
            id = id === -Infinity ? 0 : id + 1;

            const newItem = {
                id: id,
                text: "",
                checked: false
            }

            if (after !== null) {
                this.items.splice(this.items.findIndex(item => item.id === after) + 1, 0, newItem);
            } else {
                this.items.push(newItem);
            }

            this.$nextTick(() => {
                const newInput = this.$refs[`input-${id}`];
                if (newInput && newInput[0]) {
                    newInput[0].focus();
                }
            });
        },
        moveFocus(index, direction) {
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= this.items.length) {
                return;
            }

            const input = this.$refs[`input-${this.items[newIndex].id}`][0];
            if (input) {
                input.focus();
            }
        },
        removeItem(id, check = false) {
            if (check && this.items.find(item => item.id === id).text !== "") {
                return;
            }

            if (this.items.length === 1) {
                // todo: tooltip that we cant delete the last item in the list
                return;
            }

            this.moveFocus(this.items.findIndex(item => item.id === id), -1);
            this.items = this.items.filter(item => item.id !== id);
        },
        sortList() {
            // put unchecked items first, then checked items
            // keep the original order of checked and unchecked items
            const checked = this.items.filter(item => item.checked);
            const unchecked = this.items.filter(item => !item.checked);
            this.items = unchecked.concat(checked);

        }
    },
    watch: {
        items: {
            handler(newItems) {
                store.updateTodos(newItems);
            },
            deep: true
        }
    }
}
