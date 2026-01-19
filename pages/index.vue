<template>
  <section class="m-2">
    <div class="my-4">
      <div class="font-bold mb-2 text-2xl">rndrfero's Readable Palette Checker</div>
    </div>

    <div class="my-2 max-w-[600px]">
      A typography color testing tool that validates text-background combinations in your palette for optimal readability. 
    </div>
    <div class="my-2 max-w-[600px]">
       Test your custom color schemes to ensure text is clear and easy to read for everyone.
    </div>

    <!-- COLORS -->

    <div class="my-8">
      <div class="font-bold mb-2 text-2xl">The Palette</div>
      <div class="flex flex-wrap gap-2">
        <div v-for="(color, key) in colors" :key="key" class="p-2 w-full max-w-[300px] border border-gray-300 rounded bg-gray-100">
          <div class="mb-2 flex items-center gap-2">            
            <input 
              type="color" 
              v-model="color.value"
              class="w-8 h-8 rounded cursor-pointer"
            >
            <label class="sr-only" :for="`color-hex-${key}`">
              Hex color code
            </label>
            <input
              :id="`color-hex-${key}`"
              type="text" 
              v-model="color.value"
              class="w-20 px-1 rounded border border-gray-300 bg-white"
              pattern="^#[0-9A-Fa-f]{6}$"
              title="Hex color code (e.g. #FF0000)"
              aria-label="Hex color code"
            >
            <span class="font-bold">{{ colorName(color.value) }}</span>
            <button 
              @click="removeColor(key)"
              class="ml-auto text-red-500 hover:text-red-700 text-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Remove color"
              :disabled="!canRemoveColors"
            >
              ×
            </button>
          </div>
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="color.isText" >
              <span>Text</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="color.isBackground" >
              <span>Background</span>
            </label>
          </div>
        </div>

        <!-- Add new color -->
        <div class="p-2 w-full max-w-[300px] border border-gray-300 rounded bg-gray-100 border-dashed flex items-center justify-center cursor-pointer">
          <button 
            @click="addColor"
            class="text-green-500 hover:text-green-700 text-3xl"
            title="Add random color"
          >
            +
          </button>
        </div>
      </div>  
    </div>

    <!-- PARAMETERS -->

    <div class="my-8">
      <div class="font-bold mb-2 text-2xl">Luminance contrast</div>
      <div>
        <label for="luminance-threshold" class="mr-2">
          Luminance delta threshold:
        </label>
        <input
          id="luminance-threshold"
          v-model="thresholdL"
          type="range"
          :min="0.0"
          :max="1.0"
          :step="0.01"
          class="slider align-middle"
          aria-label="Luminance delta threshold"
        >
        <span class="ml-2 text-sm font-mono">
          {{ Number(thresholdL).toFixed(2) }}
        </span>
      </div>
    </div>

    <!-- COLOR COMBINATIONS -->
     
    <div class="my-8">
      <div class="font-bold mb-2 text-2xl">Combinations: {{ count }}</div>

      <div class="flex flex-wrap gap">
        <div v-for="(row, key) in grid" :key="key" class="p-2 w-full max-w-[300px]">
            <div
              v-for="(textColor, key2) in row.colors"
              :key="key2"
              :style="{ color: textColor, backgroundColor: row.color }"
            >
              <div class="inner text-sm my-1 p-1">
                {{ colorName(textColor) }} on {{ colorName(row.color) }}
              </div>
            </div>
        </div>
      </div>
    </div>

    <div class="my-8">
      <div class="font-bold mb-2 text-2xl">Javascript code</div>
      <textarea 
        class="w-full h-48 p-2 font-mono text-xs bg-gray-100 border border-gray-300 rounded"
        readonly
        v-model="code"
      ></textarea>
    </div>
  </section>
</template>

<script>
import tinycolor from "tinycolor2";
import ntc from '~/utils/ntc';
import { calculateDeltaL } from '~/utils/ColorMath';

const DEFAULT_COLORS = [
  { value: "#333333", isText: true, isBackground: true }, 
  { value: "#FFFFFF", isText: true, isBackground: false },
  { value: "#00ADD8", isText: true, isBackground: true }, 
  { value: "#06587E", isText: true, isBackground: true }, 
  { value: "#488D34", isText: true, isBackground: true }, 
  { value: "#F7A501", isText: true, isBackground: true }, 
  { value: "#ED5C03", isText: true, isBackground: true }, 
  { value: "#DE2A1B", isText: true, isBackground: true }, 
  { value: "#FF9F93", isText: true, isBackground: true }, 
  { value: "#F96D5C", isText: true, isBackground: true }, 
];

export default {
  async asyncData(context) {
    await context.app.$cms.init(context);
  },
  data: () => {
    return {
      thresholdL: 0.3,
      thresholdE: 100,
      colors: [...DEFAULT_COLORS],
    };
  },

  computed: {
    backgroundColors() {
      return this.colors.filter(({ isBackground }) => isBackground);
    },
    textColors() {
      return this.colors.filter(({ isText }) => isText);
    },
    canRemoveColors() {
      return this.colors.length >= 4;
    },
    grid() {
      return this.backgroundColors
        .map(({ value: backgroundValue }) => {
          const validTextColors = this.textColors
            .map(({ value: textValue }) => textValue)
            .filter((textValue) => this.compare(backgroundValue, textValue));

          return {
            color: backgroundValue,
            colors: validTextColors,
          };
        })
        .filter((row) => row.colors.length > 0);
    },
    count() {
      return this.grid.reduce((total, row) => {
        return total + row.colors.length;
      }, 0);
    },
    code() {
      const lines = ["const palette = ["];

      this.backgroundColors.forEach(({ value: backgroundValue }) => {
        this.textColors.forEach(({ value: textValue }) => {
          if (!this.compare(backgroundValue, textValue)) {
            return;
          }

          lines.push(
            `  // ${this.colorName(textValue)} on ${this.colorName(backgroundValue)}`,
            `  { backgroundColor: '${backgroundValue}', color: '${textValue}' },`
          );
        });
      });

      lines.push("];");
      return lines.join("\n");
    },
  },

  methods: {
    compare(col1, col2) {
      return calculateDeltaL(col1, col2) > this.thresholdL;
    },
    colorName(color) { return ntc.name(color)[1]; },
    removeColor(index) {
      this.colors.splice(index, 1);
    },
    addColor() {
      this.colors.push({
        value: tinycolor.random().toHexString(),
        isText: true,
        isBackground: true
      });
    },
  },
};
</script>

<style lang="scss">
</style>

