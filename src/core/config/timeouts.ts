// The portal's Blazor WebAssembly runtime takes ~25-35s to boot in each new browser context
// before any page content renders, so the first readiness check on a page needs this budget.
export const APP_STARTUP_TIMEOUT = 60_000;
