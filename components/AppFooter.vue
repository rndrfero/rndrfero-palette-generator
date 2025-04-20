<template>
  <footer class="w-full py-4 mt-auto border-t border-gray-200 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
        <p class="text-sm text-gray-600 flex items-center">
          <UserIcon class="mr-1" />
          rndrfero
        </p>
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
  // Show a confirmation dialog
  if (confirm('This will clear your saved palette data. Are you sure you want to continue?')) {
    // Clear all local storage
    localStorage.clear();
    
    // Reload the page to reinitialize the application state
    window.location.reload();
  }
};
</script> 