import Checkbox from "./chekbox.js";

export default {
    template: `
      <div class="todo-item">
        <div class="todo-item__group">
          <checkbox v-model="localChecked"/>
          <!--          <span>{{ label }}</span>-->
          <input type="text" v-model="localLabel" class="todo-item__input"/>
        </div>
        <div class="todo-item__group">
<!--         up arrow -->
          <button class="todo-item__button">×</button>
        </div>
      </div>
    `,
    components: {
        Checkbox,
    },
    props: {
        label: {
            type: String,
            required: true
        },
        checked: {
            type: Boolean,
            required: true
        }
    },
    methods: {},
    computed: {
        localChecked: {
            get() {
                return this.checked
            },
            set(c) {
                this.$emit('update:checked', c)
            }
        },
        localLabel: {
            get() {
                return this.label
            },
            set(l) {
                this.$emit('update:label', l)
            }
        }
    },
}