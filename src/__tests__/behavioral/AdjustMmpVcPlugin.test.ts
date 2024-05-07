import { randomInt } from 'crypto'
import { SpyDevice } from '@sprucelabs/heartwood-view-controllers'
import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import AdjustMmpVcPlugin, {
    AdjustTrackEventOptions,
} from '../../AdjustMmpVcPlugin'

export default class AdjustMmpVcPluginTest extends AbstractSpruceFixtureTest {
    private static plugin: AdjustMmpVcPlugin
    private static device: SpyDevice
    private static appToken: string
    private static env: string
    private static lastEventToken: string

    public static async beforeEach() {
        await super.beforeEach()

        this.plugin = this.views.BuildPlugin(AdjustMmpVcPlugin)
        this.device = this.views.getDevice()
        this.appToken = generateId()
        this.env = generateId()
    }

    @test()
    protected static async setupThrowsWithMissing() {
        //@ts-ignore
        const err = assert.doesThrow(() => this.plugin.setup())

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['appToken', 'environment'],
        })
    }

    @test()
    protected static async setupSendsExpectedCommandToDevice() {
        this.setup()
        this.assertLastCommand('mmp_setup:adjust')
        assert.isEqualDeep(this.device.lastCommandPayload, {
            appToken: this.appToken,
            env: this.env,
        })
    }

    @test()
    protected static async trackEventThrowsIfNotSetup() {
        //@ts-ignore
        const err = assert.doesThrow(() => this.plugin.trackEvent())
        errorAssert.assertError(err, 'ADJUST_NOT_SETUP')
    }

    @test()
    protected static async throwsMissingParamsWhenTrackingAfterSetup() {
        this.setup()
        //@ts-ignore
        const err = assert.doesThrow(() => this.plugin.trackEvent())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['eventToken'],
        })
    }

    @test()
    protected static async trackEventSendsExpectedCommandToDevice() {
        this.setupAndAssertTracksEventWithExpectedOptions({})
    }

    @test()
    protected static async canTrackEventWithAdditionalOptions() {
        this.setupAndAssertTracksEventWithExpectedOptions({
            productId: generateId(),
            revenue: {
                amount: randomInt(100),
                currency: 'USD',
            },
            transationId: generateId(),
        })
    }

    private static setupAndAssertTracksEventWithExpectedOptions(
        expected: AdjustTrackEventOptions
    ) {
        this.setup()
        this.assertTracksEventsWithExpectedOptions(expected)
    }

    private static assertTracksEventsWithExpectedOptions(
        options: AdjustTrackEventOptions
    ) {
        this.trackRandomEvent(options)
        this.assertLastEventOptions(options)
    }

    private static assertLastEventOptions(expected: AdjustTrackEventOptions) {
        this.assertLastCommand('mmp_track_event:adjust', expected)
    }

    private static trackRandomEvent(options?: AdjustTrackEventOptions) {
        const eventToken = generateId()
        this.trackEvent(eventToken, options)
        this.lastEventToken = eventToken
        return eventToken
    }

    private static trackEvent(
        eventToken: string,
        options?: AdjustTrackEventOptions
    ) {
        this.plugin.trackEvent(eventToken, options)
    }

    private static assertLastCommandPayload(expected: Record<string, any>) {
        assert.isEqualDeep(this.device.lastCommandPayload, expected)
    }

    private static assertLastCommand(
        expected: string,
        expectedPayload?: Record<string, any>
    ) {
        assert.isEqual(this.device.lastCommand, expected)
        if (expectedPayload) {
            this.assertLastCommandPayload({
                eventToken: this.lastEventToken,
                ...expectedPayload,
            })
        }
    }

    private static setup() {
        this.plugin.setup(this.appToken, this.env)
    }
}
