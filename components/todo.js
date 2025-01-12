import TodoItem from "./todo_item.js"

export default {
    template: `
      <section class="panel">
        <header class="panel__header">
          <h2>todo</h2>
          <button class="todo_settings">
            sort
          </button>
        </header>
        <ul class="todo__list">
          <todo-item v-for="item in items" :key="item.id"
                     v-model:label="item.text"
                     v-model:checked="item.checked"/>
        </ul>
        <div class="todo__add">
          <input type="text"
                 minlength="3"
                 maxlength="50"
                 placeholder="New todo"/>
          <button class="todo__button">Add</button>
        </div>
      </section>
    `,
    components: {
        TodoItem,
    },
    data() {
        return {
            items: [
                {id: 0, text: "Launch a new labeling session", checked: false},
                {id: 1, text: "Wait for feedback", checked: true},
                {id: 2, text: "Item 3", checked: false},
                {id: 3, text: "Fix buttons in timer. They look shitty", checked: false},
            ]
        }
    },
}