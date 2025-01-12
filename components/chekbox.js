export default {
    template: `
      <div class="checkbox-button" @click="toggle(!modelValue)">
        <input type="checkbox" v-model=modelValue class="checkbox-button__input"/>

        <div class="checkbox-button__square">
          <div class="checkbox-button__checkbox"
               :class="{['checkbox-button__checkbox--selected']: modelValue}"
          ></div>
        </div>
      </div>
    `,
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
    },
    methods: {
        toggle(checked) {
            this.$emit('update:modelValue', checked)
        }
    }
}
