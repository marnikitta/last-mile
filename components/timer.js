import {store} from '../store.js';

export default {
    template: `
      <section class="panel timer">
        <header class="panel__header">
          <div class="panel__title-group">
            <h2>timer</h2>
            <span class="panel__subtitle">×{{ completedSets }}</span>
          </div>
          <button @click="completedSets=  0">
            reset
          </button>
        </header>
        <main>
          <h3 class="timer__time">{{ timeString }}</h3>
          <div class="timer__controls">
            <div class="timer__controls-group">
              <button class="button-with-border" @click="startTimer(25 * 60)">25:</button>
              <button class="button-with-border" @click="startTimer(5 * 60)">5:</button>
              <button class="button-with-border" @click="startTimer(15 * 60)">15:</button>
            </div>
            <button class="button-with-border" @click="continueTimer" v-if="wasPaused">Resume</button>
            <button class="button-with-border" @click="pauseTimer" :disabled="!timer" v-else>Pause</button>
          </div>
        </main>
      </section>
    `,
    created() {
        this.audio = new Audio("/assets/pomodoro-timer.mp3");
        this.completedSets = store.state.completedSets
    },
    data() {
        return {
            secondsOnStart: 25 * 60,
            completedSets: 0,
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
            this.reset()

            this.timeSeconds = time
            this.secondsOnStart = time

            this.timer = setInterval(() => {
                if (this.previousTimestamp === null) {
                    this.previousTimestamp = Date.now() - 1000;
                }

                const delta = Math.round((Date.now() - this.previousTimestamp) / 1000);
                if (this.timeSeconds - delta <= 0) {
                    this.audio.play();
                    if (this.secondsOnStart === 25 * 60) {
                        this.completedSets++;
                    }
                    this.reset();
                } else {
                    this.timeSeconds = this.timeSeconds - delta;
                    this.previousTimestamp = Date.now();
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
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.timer = null;
            this.previousTimestamp = null;
            this.wasPaused = false;
        },
    },
    watch: {
        completedSets(newSets) {
            store.setCompletedSets(newSets);
        }
    }
}