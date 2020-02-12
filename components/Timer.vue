<template>
    <div>
      <!-- <div class="day">
        <span class="number">{{ days }} :</span>
        <div class="format">{{ wordString.day }}</div>
      </div> -->
      <div class="hour">
        <span class="number">{{ hours }} </span>
        <div class="format">{{ wordString.hours }}</div>
      </div>
      <div class="hour">
        <span class="colon">:</span>
      </div>
      <div class="min">
        <span class="number">{{ minutes }}</span>
        <div class="format">{{ wordString.minutes }}</div>
      </div>
      <div class="min">
        <span class="colon">:</span>
      </div>
      <div class="sec">
        <span class="number">{{ seconds }}</span>
        <div class="format">{{ wordString.seconds }}</div>
      </div>
      <div class="message">{{ message }}</div>
      <div class="status-tag" :class="statusType">{{ statusText }}</div>
    </div>
</template>
<script>
export default {
  props: ["starttime", "endtime", "trans"],
  data: function() {
    return {
      timer: "",
      wordString: {},
      start: "",
      end: "",
      interval: "",
      days: "",
      minutes: "",
      hours: "",
      seconds: "",
      message: "",
      statusType: "",
      statusText: ""
    };
  },
  created: function() {
    this.wordString = JSON.parse(this.trans);
  },
  mounted() {
    this.start = new Date(this.starttime).getTime();
    this.end = new Date(this.endtime).getTime();
    // Update the count down every 1 second
    this.timerCount(this.start, this.end);
    this.interval = setInterval(() => {
      this.timerCount(this.start, this.end);
    }, 1000);
  },
  methods: {
    timerCount: function(start, end) {
      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down date
      var distance = start - now;
      var passTime = end - now;

      if (distance < 0 && passTime < 0) {
        this.message = this.wordString.expired;
        this.statusType = "expired";
        this.statusText = this.wordString.status.expired;
        clearInterval(this.interval);
        return;
      } else if (distance < 0 && passTime > 0) {
        this.calcTime(passTime);
        this.message = this.wordString.running;
        this.statusType = "running";
        this.statusText = this.wordString.status.running;
      } else if (distance > 0 && passTime > 0) {
        this.calcTime(distance);
        this.message = this.wordString.upcoming;
        this.statusType = "upcoming";
        this.statusText = this.wordString.status.upcoming;
      }
    },
    calcTime: function(dist) {
      // Time calculations for days, hours, minutes and seconds
      this.days = Math.floor(dist / (1000 * 60 * 60 * 24));
      this.hours = Math.floor(
        (dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((dist % (1000 * 60)) / 1000);
    }
  }
};
</script>
<style scoped>
.colon {
  font-size: 30px;
  font-weight: 500;
  padding: -3px 5px;
}
.day,
.hour,
.min,
.sec {
  font-size: 30px;
  display: inline-block;
  font-weight: 500;
  margin: 0;
}
.sec .format {
  font-weight: 300;
  font-size: 14px;
  opacity: 0.8;
  width: 40px;
}
.number {
  padding: 0;
  border-radius: 5px;
  display: inline-block;
  width: 40px;
  text-align: center;
}
.message {
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
}
</style>
