export default {
    template: `
      <section class="panel timer">
        <header class="panel__header">
          <div class="panel__title-group">
            <h2>timer</h2>
            <span class="panel__subtitle" v-if="setsCount">×{{ setsCount }}</span>
          </div>
          <button v-if="setsCount" @click="setsCount=0">reset</button>
        </header>
        <main>
          <h3 class="timer__time">{{ timeString }}</h3>
          <div class="timer__controls">
            <button class="timer__button" @click="startTimer(2)">25:</button>
            <button class="timer__button" @click="startTimer(5 * 60)">5:</button>
            <button class="timer__button" @click="startTimer(15 * 60)">15:</button>
            <button class="timer__button" @click="continueTimer" v-if="wasPaused">Resume</button>
            <button class="timer__button" @click="pauseTimer" :disabled="!timer" v-else>Pause</button>
          </div>
        </main>
      </section>
    `,
    created() {
        this.audio = new Audio("/assets/pomodoro-timer.mp3");
    },
    data() {
        return {
            secondsOnStart: 25 * 60,
            setsCount: 0,
            timeSeconds: 25 * 60,
            timer: null,
            wasPaused: false,
            audio: null,
            previousTimestamp: null
        }
    },
    computed: {
        timeString() {
            const minutes = Math.floor(this.timeSeconds / 60);
            const seconds = this.timeSeconds % 60;
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        },
    },
    methods: {
        startTimer(time) {
            if (this.timer) {
                this.reset()
            }

            this.timeSeconds = time
            this.secondsOnStart = time

            this.timer = setInterval(() => {
                if (this.previousTimestamp === null) {
                    this.previousTimestamp = Date.now() - 1000;
                }

                const delta = Math.round((Date.now() - this.previousTimestamp) / 1000);
                this.timeSeconds = this.timeSeconds - delta;
                this.previousTimestamp = Date.now();

                if (this.timeSeconds <= 0) {
                    this.audio.play();
                    if (this.secondsOnStart === 2) {
                        this.setsCount++;
                    }
                    this.reset();
                }
            }, 1000);
        },
        continueTimer() {
            this.startTimer(this.timeSeconds);
        },
        pauseTimer() {
            clearInterval(this.timer);
            this.timer = null;
            this.wasPaused = true;
        },
        reset() {
            clearInterval(this.timer);
            this.timer = null;
            this.previousTimestamp = null;
            this.wasPaused = false;
        },
    }
}