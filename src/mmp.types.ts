export type Partner = 'adjust'

export interface MmpVcPlugin<SetupOptions, TrackEventOptions> {
    setup(options: SetupOptions): void
    trackEvent(eventName: string, options?: TrackEventOptions): void
}
