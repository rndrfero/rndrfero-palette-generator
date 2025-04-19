<template>
  <section class="section">
    <div class="m-2">
      <h1 class="text-xl">rndrfero's Typography Contrast Palette Tool</h1>
    </div>

    <div class="m-2">
      <ul>
        <li>L = luminance</li>
        <li>E = color difference metric - Delta E in the CIELAB color space</li>
      </ul>
    </div>

    <div class="flex m-2 text-2xl">
      <div>
        Threshold L: {{ thresholdL }} - Threshold E: {{ thresholdE }} &rarr;
        {{ count }} combinations
      </div>
    </div>

    <div class="flex m-2">
      <div class="mx-2">
        <input
          v-model="thresholdL"
          type="range"
          :min="0.0"
          :max="1.0"
          :step="0.01"
          class="slider"
        />
      </div>

      <div class="mx-2">
        <input
          v-model="thresholdE"
          type="range"
          :min="0.0"
          :max="200.0"
          :step="1"
          class="slider"
        />
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 m-2">
      <div v-for="(row, key) in grid" :key="key" class="p-2">
        <div class="">
          <!-- <h2 class="title"> </h2> -->
          <div class="font-bold mb-2">{{ colorName(row.color) }} - {{ row.color }}</div>
          <div>
            <!-- text: <input v-model="colors[key].isText" type="checkbox" /> bg:
            <input v-model="colors[key].isBackground" type="checkbox" /> -->
          </div>

          <div
            v-for="(cell, key2) in row.colors"
            :key="key2"
            :style="{ color: cell.color, backgroundColor: row.color }"
          >
            <div v-if="cell.pass" class="inner text-sm my-1 p-1">
              Hello there - {{ colorName(cell.color) }} on {{ colorName(row.color) }}
              <!-- Hello there dear folks! - {{ cell.color.color }} -
              {{ cell.deltaE.toFixed(2) }} -
              {{ cell.deltaL.toFixed(2) }} -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <code class="whitespace-pre">{{ code }}</code>
    </div>
  </section>
</template>

<script>
import { isProxy, toRaw } from "vue";
import tinycolor from "tinycolor2";
import ntc from '~/utils/ntc';
import { calculateDeltaL } from '~/utils/ColorMath';

export default {
  async asyncData(context) {
    await context.app.$cms.init(context);
  },
  data: () => {
    return {
      thresholdL: 0.47,
      thresholdE: 100,
      inputColors: [
        { color: "#000000", isText: true, isBackground: false },
        { color: "#FFFFFF", isText: true, isBackground: false },

        // original palette
        { color: "#eff1f4", isText: false, isBackground: true },
        { color: "#cbecdd", isText: true, isBackground: true },
        { color: "#c5d3f2", isText: true, isBackground: true },
        { color: "#fac7d2", isText: true, isBackground: true },

        { color: "#fffea8", isText: true, isBackground: true },
        { color: "#c2cf96", isText: true, isBackground: true },
        { color: "#dbc5b6", isText: true, isBackground: true },
        { color: "#caf8fc", isText: true, isBackground: true },
        { color: "#fdd386", isText: true, isBackground: true },
        { color: "#f8a3b5", isText: true, isBackground: true },
      ]      
    };
  },

  computed: {
    tinycolor() {
      return tinycolor;
    },
    grid() {
      const ret = [];

      this.inputColors.forEach(({ color, isBackground }) => {
        if (!isBackground) {
          return;
        }

        const row = { color, colors: [] };

        this.inputColors.forEach((x) => {
          if (!x.isText) {
            return;
          }
          const color2 = x.color;
          const pass = this.compare(color, color2);

          row.colors.push({
            color: color2,
            pass,
          });
        });
        ret.push(row);
      });

      return ret;
    },
    count() {
      return this.grid.reduce((total, row) => {
        return total + row.colors.filter((cell) => cell.pass).length;
      }, 0);
    },
    code() {
      let ret = "";

      this.inputColors.forEach(({ color, isBackground }) => {
        if (!isBackground) {
          return;
        }

        this.inputColors.forEach((x) => {
          const color2 = x.color;

          const pass = this.compare(color, color2);
          if (!x.isText || !pass) {
            return;
          }

          ret +=
            "{backgroundColor: '" + color + "', color: '" + color2 + "' },";
          ret += " // " + x.name + " on " + name + "\n";
        });
      });

      return ret;
    },
  },

  methods: {
    compare(col1, col2) {
      return calculateDeltaL(col1, col2) > this.thresholdL;
    },
    colorName(color) { return ntc.name(color)[1]; },
  },
};
</script>

<style lang="scss">
</style>

