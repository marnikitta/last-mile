export default {
    template: `
      <section class="panel">
        <header class="panel__header">
          <h2>area</h2>
        </header>
        <textarea @input="this.adjustHeight"
                  rows="1"
                  placeholder="What are you doing?" class="area__text" v-model="text"></textarea>
      </section>
    `,
    data() {
        return {
            text: ""
        }
    },
    methods: {
        adjustHeight(event) {
            const area = event.target;
            area.style.height = '5px';
            area.style.height = (area.scrollHeight + 27 * 2) + "px";
            return false;
        }
    },
}