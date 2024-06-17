import { ViewControllerPlugin } from '@sprucelabs/heartwood-view-controllers'
import { assert } from '@sprucelabs/test-utils'
import { AdjustMmpVcPluginSetupOptions } from './AdjustMmpVcPlugin'
import { MmpVcPlugin } from './mmp.types'

export default class MockAdjustMmpVcPlugin
    implements
        ViewControllerPlugin,
        MmpVcPlugin<Record<string, any>, Record<string, any>>
{
    private lastSetupOptions?: Record<string, any>
    private lastTrackedEvent?: {
        eventName: string
        options: Record<string, any> | undefined
    }

    public setup(options: Record<string, any>): void {
        this.lastSetupOptions = options
    }

    public trackEvent(
        eventName: string,
        options?: Record<string, any> | undefined
    ): void {
        this.lastTrackedEvent = {
            eventName,
            options,
        }
    }

    public assertTrackEventWasCalled() {
        assert.isTruthy(
            this.lastTrackedEvent,
            `You gotta call this.plugins.mmp.trackEvent(...)`
        )
    }

    public assertTrackEventWasCalledWith(
        eventName: string,
        options?: Record<string, any>
    ) {
        assert.isEqual(
            eventName,
            this.lastTrackedEvent?.eventName,
            `this.plugins.mmp.trackEvent(...) was not called with the expected eventName. Expected: ${eventName}, got: ${this.lastTrackedEvent?.eventName}`
        )

        assert.isEqualDeep(
            options,
            this.lastTrackedEvent?.options,
            `this.plugins.mmp.trackEvent(...) was not called with the expected options.`
        )
    }

    public assertSetupWasCalled() {
        assert.isTruthy(
            this.lastSetupOptions,
            `You gotta call this.plugins.mmp.setup(...)`
        )
    }

    public assertSetupWasCalledWith(
        setupOptions: AdjustMmpVcPluginSetupOptions
    ) {
        assert.isEqualDeep(
            this.lastSetupOptions,
            setupOptions,
            `this.plugins.mmp.setup(...) was not called with the expected options.`
        )
    }
}
