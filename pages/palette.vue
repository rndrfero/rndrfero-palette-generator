<template>
  <section class="section">
    <h1><fa icon="cog" /> Imanent Typography palette tool</h1>

    <div>
      <div>With luminance threshold: {{ threshold }}</div>

      <input
        v-model="threshold"
        type="range"
        :min="0.0"
        :max="1.0"
        :step="0.01"
        class="slider"
      ></input>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="(value, key) in colors"
        :key="key"
        :style="{ backgroundColor: value }"
        class="p-2"
        
      >
        <div class="">
          <!-- <h2 class="title"> </h2> -->
          <div class="font-bold mb-2">
            {{ key }} {{ value }}
            {{ `${tinycolor(value).getLuminance().toFixed(2)}` }}
          </div>

          <div
            v-for="(value2, key2) in colors"
            :key="key2"
            :style="{ color: value2 }"
          >
            <div v-if="compare(value, value2)" class="inner">
              {{ key2 }} - {{ value2 }} - Hello there dear folks!
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import tinycolor from "tinycolor2";

export default {
  async asyncData(context) {
    await context.app.$cms.init(context);
  },
  data: () => {
    return {
      threshold: 0.1,
      colors: {
        black: "#333333",
        white: "#FFFFFF",
        blue: "#5AABD8",
        blueAlt: "#00ADD8",
        dark: "#06587E",
        green: "#488D34",
        yellow: "#F7A501",
        yellowAlt: "#B97B00",
        orange: "#ED5C03",
        orangeAlt: "#DE2A1B",
        pink: "#FF9F93",
        pinkAlt: "#F96D5C",
      },
      bulma: [
        "light",
        "dark",
        "primary",
        "info",
        "link",
        "success",
        "warning",
        "danger",
      ],
    };
  },

  computed: {
    tinycolor() {
      return tinycolor; //require("tinycolor2");
    },
  },

  methods: {
    compare(col1, col2) {
      return (
        Math.abs(
          this.tinycolor(col1).getLuminance() -
            this.tinycolor(col2).getLuminance()
        ) > this.threshold
      );
    },
  },
};
</script>

<style lang="scss">
// .outer {
//   padding: 1rem;
// }
// .inner {
//   padding: 0.3rem;
//   &.intro {
//     background: white;
//     color: black;
//     position: relative;
//     left: -1rem;
//   }
// }
</style>

<!-- <template>
  <div id="app">
    <h1>Hello, World!</h1>
  </div>
</template>

<script setup></script>

<style scoped>
#app {
  text-align: center;
  margin-top: 50px;
}
</style> -->
