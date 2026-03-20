import { writable } from 'svelte/store';

/** Set true during data reload (create/update/delete) to show full-page blur + spinner */
export const dataLoading = writable(false);
