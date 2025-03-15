import Checkbox from "./chekbox.js";
import { store } from "../store.js";

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
                     @keydown.enter.prevent="addItem(item.id)"
                     @keydown.up.prevent="moveFocus(index, -1)"
                     @keydown.down.prevent="moveFocus(index, 1)"
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
            items: []
        }
    },
    computed: {
        doneText() {
            const checkedCount = this.items.filter(item => item.checked).length;
            return `${checkedCount}/${this.items.length}`;
        }
    },
    methods: {
        addItem(after = null) {
            // Use the spread operator for ID generation
            const maxId = this.items.length ? Math.max(...this.items.map(item => item.id)) : -1;
            const id = maxId + 1;
            const newItem = { id, text: "", checked: false };

            if (after !== null) {
                const index = this.items.findIndex(item => item.id === after);
                this.items.splice(index + 1, 0, newItem);
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
            const item = this.items.find(item => item.id === id);
            if (!item) return;
            if (check && item.text !== "") {
                return;
            }

            if (this.items.length === 1) {
                // Optionally show a tooltip: you can't delete the last item.
                return;
            }

            const index = this.items.findIndex(item => item.id === id);
            this.moveFocus(index, -1);
            this.items = this.items.filter(item => item.id !== id);
        },
        sortList() {
            // Place unchecked items first while preserving the order within each group
            const unchecked = this.items.filter(item => !item.checked);
            const checked = this.items.filter(item => item.checked);
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
