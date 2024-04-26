import { defineStore } from 'pinia'

// contains header title
export const useHeaderStore = defineStore({
  id: 'header',
  state: () => ({
    title: 'Dashboard',
  }),
  actions: {
    setTitle(title: string) {
      this.title = title
    },
  }
})