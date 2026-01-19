<template>
  <footer class="w-full py-4 mt-auto border-t border-gray-200 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
        <a 
          href="https://www.rndrfero.com" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          <UserIcon class="mr-1" />
          rndrfero
        </a>
        <a 
          href="https://github.com/rndrfero/rndrfero-palette-generator" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          <GitHubIcon class="mr-1" />
          Fork me on GitHub
        </a>
        <button 
          @click="clearLocalStorage" 
          class="text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          <TrashIcon class="mr-1" />
          Clear Local Storage
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import UserIcon from '~/assets/icons/UserIcon.vue';
import GitHubIcon from '~/assets/icons/GitHubIcon.vue';
import TrashIcon from '~/assets/icons/TrashIcon.vue';

const clearLocalStorage = () => {
  if (
    !confirm(
      'This will clear your saved palette data for this tool. Other sites will not be affected. Continue?'
    )
  ) {
    return;
  }

  const prefix = 'readable-palette-checker:';

  Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => {
      localStorage.removeItem(key);
    });

  window.location.reload();
};
</script> 