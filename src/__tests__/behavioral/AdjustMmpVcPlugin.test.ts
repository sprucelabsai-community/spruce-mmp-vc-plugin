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
    private static lastEventName: string

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
            environment: this.env,
        })
    }

    @test()
    protected static async doesNotTrackIfNotSetup() {
        //@ts-ignore
        this.plugin.trackEvent(generateId())
        assert.isFalsy(this.device.lastCommand)
    }

    @test()
    protected static async throwsMissingParamsWhenTrackingAfterSetup() {
        this.setup()
        //@ts-ignore
        const err = assert.doesThrow(() => this.plugin.trackEvent())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['eventName'],
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
        const eventName = generateId()
        this.trackEvent(eventName, options)
        this.lastEventName = eventName
        return eventName
    }

    private static trackEvent(
        eventName: string,
        options?: AdjustTrackEventOptions
    ) {
        this.plugin.trackEvent(eventName, options)
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
                eventName: this.lastEventName,
                ...expectedPayload,
            })
        }
    }

    private static setup() {
        this.plugin.setup({ appToken: this.appToken, environment: this.env })
    }
}
