import { store } from '../store.js';

export default {
    template: `
    <section class="panel timer">
      <header class="panel__header">
        <div class="panel__title-group">
          <h2>timer</h2>
          <span class="panel__subtitle">×{{ completedSets }}</span>
        </div>
        <button @click="resetTimer">
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
          <button class="button-with-border" @click="resumeTimer" v-if="wasPaused">Resume</button>
          <button class="button-with-border" @click="pauseTimer" :disabled="!timer" v-else>Pause</button>
        </div>
      </main>
    </section>
  `,
    data() {
        return {
            // The initial duration of the timer (used to check for full pomodoro cycles)
            initialSeconds: 25 * 60,
            completedSets: store.state.completedSets,
            // Current remaining time in seconds
            timeSeconds: 25 * 60,
            timer: null,
            wasPaused: false,
            // Preload the audio so that it’s ready when needed
            audio: new Audio("/assets/pomodoro-timer.mp3"),
            // The absolute end time (in ms) for the current timer session
            targetTime: null
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
            // Cancel any running timer
            this.clearTimer();

            this.initialSeconds = time;
            this.timeSeconds = time;
            this.wasPaused = false;

            this.targetTime = Date.now() + time * 1000;

            this.timer = setInterval(this.tick, 1000);
        },
        tick() {
            const remaining = Math.round((this.targetTime - Date.now()) / 1000);
            if (remaining <= 0) {
                this.timeSeconds = 0;
                this.audio.play();
                if (this.initialSeconds === 25 * 60) {
                    this.completedSets++;
                }
                this.clearTimer();
            } else {
                this.timeSeconds = remaining;
            }
        },
        pauseTimer() {
            if (this.timer) {
                this.clearTimer();
                this.wasPaused = true;
            }
        },
        resumeTimer() {
            if (this.wasPaused && this.timeSeconds > 0) {
                this.targetTime = Date.now() + this.timeSeconds * 1000;
                this.timer = setInterval(this.tick, 1000);
                this.wasPaused = false;
            }
        },
        resetTimer() {
            this.clearTimer();
            this.timeSeconds = 25 * 60;
            this.initialSeconds = 25 * 60;
            this.wasPaused = false;
        },
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
    },
    watch: {
        completedSets(newSets) {
            store.setCompletedSets(newSets);
        }
    },
    beforeDestroy() {
        this.clearTimer();
    }
}
