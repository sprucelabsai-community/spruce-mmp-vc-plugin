import { ViewControllerFactory } from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import { assert } from '@sprucelabs/test-utils'
import { AdjustMmpVcPluginSetupOptions } from './AdjustMmpVcPlugin'
import { Partner } from './mmp.types'
import MockAdjustMmpVcPlugin from './MockAdjustMmpVcPlugin'

let mockPlugin: MockAdjustMmpVcPlugin | undefined

const mmpAssert = {
    beforeEach(views: ViewControllerFactory) {
        mockPlugin = new MockAdjustMmpVcPlugin()
        views.addPlugin('mmp', mockPlugin)
    },

    async pluginIsSetup(options: PluginIsSetupOptions): Promise<void> {
        const { action, partner, setupOptions } = options ?? {}

        assertBeforeEachCalled()

        assertOptions(
            {
                action,
                partner,
            },
            ['action', 'partner']
        )

        assert.isEqual(
            partner,
            'adjust',
            'The partner you passed was invalid. For now I only support Adjust.'
        )

        await action()

        mockPlugin?.assertSetupWasCalled()

        if (setupOptions) {
            mockPlugin?.assertSetupWasCalledWith(setupOptions)
        }
    },

    async didTrackEvent(options: DidTrackEventOptions) {
        assertBeforeEachCalled()

        const { action, eventName, trackOptions } = assertOptions(options, [
            'action',
            'eventName',
        ])

        await action()

        mockPlugin?.assertTrackEventWasCalled()
        mockPlugin?.assertTrackEventWasCalledWith(eventName, trackOptions)
    },
}

export default mmpAssert

function assertBeforeEachCalled() {
    assert.isTruthy(
        mockPlugin,
        'You must call mmpAssert.beforeEach(this.views.getFactory()) before using this assert util.'
    )
}

export interface PluginIsSetupOptions {
    action: () => void | Promise<void>
    partner: Partner
    setupOptions?: AdjustMmpVcPluginSetupOptions
}

export interface DidTrackEventOptions {
    action: () => void | Promise<void>
    eventName: string
    trackOptions?: Record<string, any>
}
