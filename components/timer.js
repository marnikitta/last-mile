export default {
    template: `
      <section class="panel timer">
        <header class="panel__header">
          <h2>timer</h2>
          <button class="timer__settings">edit</button>
        </header>
        <h3 class="timer__time">{{ timeString }}</h3>
        <div class="timer__buttons-wrapper">
          <button class="timer__button">25:</button>
          <button class="timer__button">5:</button>
          <button class="timer__button">15:</button>
          <button class="timer__button" disabled>Pause</button>
        </div>
      </section>
    `,
    data() {
        return {
            timeSeconds: 25 * 60
        }
    },
    computed: {
        timeString() {
            const minutes = Math.floor(this.timeSeconds / 60);
            const seconds = this.timeSeconds % 60;
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }
}