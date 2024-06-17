import {
    AbstractSkillViewController,
    SpruceSchemas,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import AdjustMmpVcPlugin, {
    AdjustMmpVcPluginSetupOptions,
} from '../../AdjustMmpVcPlugin'
import { Partner } from '../../mmp.types'
import mmpAssert, {
    DidTrackEventOptions,
    PluginIsSetupOptions,
} from '../../mmpAssert'

@fake.login()
export default class AssertingMmpPluginTest extends AbstractSpruceFixtureTest {
    private static vc: MmpTestViewController
    protected static async beforeEach() {
        await super.beforeEach()
        this.setupBeforeEach()
        this.views.setController('mmp', MmpTestViewController)
        this.vc = this.views.Controller('mmp', {})
    }

    @test()
    protected static async throwsMissingParamsIfBeforeEachButNoParams() {
        //@ts-ignore
        const err = await assert.doesThrowAsync(() => mmpAssert.pluginIsSetup())

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['action', 'partner'],
        })
    }

    @test()
    protected static async throwsWithInvalidpartner() {
        await assert.doesThrowAsync(
            () =>
                this.assertPluginIsSetup({
                    action: () => {},
                    partner: generateId() as Partner,
                }),
            'invalid'
        )
    }

    @test()
    protected static async throwsWhenMmpNotSetup() {
        await assert.doesThrowAsync(
            () =>
                this.assertPluginIsSetup({
                    action: () => {},
                    partner: 'adjust',
                }),
            'setup'
        )
    }

    @test()
    protected static async worksWhenMmpIsSetup() {
        await this.assertPluginIsSetup({
            action: () => this.vc.setup(),
            partner: 'adjust',
        })
    }

    @test()
    protected static async throwsWithSetupOptionsThatDontMatch() {
        await assert.doesThrowAsync(() =>
            this.assertPluginIsSetup({
                action: () => this.vc.setup(),
                partner: 'adjust',
                setupOptions: {
                    appToken: generateId(),
                    environment: generateId(),
                },
            })
        )
    }

    @test()
    protected static async passesIfSetupOptionsMatch() {
        const setupOptions = {
            appToken: generateId(),
            environment: generateId(),
        }
        await this.assertPluginIsSetup({
            action: () => this.vc.setup(setupOptions),
            partner: 'adjust',
            setupOptions,
        })
    }

    @test()
    protected static async didTrackThrowsWithMissing() {
        //@ts-ignore
        const err = await assert.doesThrowAsync(() => mmpAssert.didTrackEvent())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['action', 'eventName'],
        })
    }

    @test()
    protected static async throwsWhenTrackEventNotCalled() {
        await assert.doesThrowAsync(
            () =>
                this.assertDidTrackEvent({
                    action: () => {},
                    eventName: generateId(),
                }),
            'trackEvent'
        )
    }

    @test()
    protected static async throwsWhenWrongEventNamePassed() {
        await assert.doesThrowAsync(
            () =>
                this.assertDidTrackEvent({
                    action: () => this.vc.trackEvent(),
                    eventName: generateId(),
                }),
            'eventName'
        )
    }

    @test()
    protected static async passesWhenEventNameMatches() {
        const eventName = generateId()
        await this.assertDidTrackEvent({
            action: () => this.vc.trackEvent(eventName),
            eventName,
        })
    }

    @test()
    protected static async throwsWhenTrackEventPassedWrongOptions() {
        const eventName = generateId()
        await assert.doesThrowAsync(() =>
            this.assertDidTrackEvent({
                action: () =>
                    this.vc.trackEvent(eventName, {
                        go: 'dogs',
                    }),
                eventName,
                trackOptions: {
                    dogs: 'go',
                },
            })
        )
    }

    @test()
    protected static async trackEventPassesWhenOptionsMatch() {
        const eventName = generateId()
        const trackOptions = {
            [generateId()]: generateId(),
        }
        await this.assertDidTrackEvent({
            action: () => this.vc.trackEvent(eventName, trackOptions),
            eventName,
            trackOptions,
        })
    }

    private static assertDidTrackEvent(options: DidTrackEventOptions): any {
        return mmpAssert.didTrackEvent(options)
    }

    private static setupBeforeEach() {
        mmpAssert.beforeEach(this.views.getFactory())
    }

    private static assertPluginIsSetup(options: PluginIsSetupOptions) {
        return mmpAssert.pluginIsSetup(options)
    }
}

class MmpTestViewController extends AbstractSkillViewController {
    public async setup(setupOptions?: AdjustMmpVcPluginSetupOptions) {
        this.plugins.mmp.setup({
            appToken: generateId(),
            environment: generateId(),
            ...setupOptions,
        })
    }

    public async trackEvent(eventName?: string, options?: Record<string, any>) {
        this.plugins.mmp.trackEvent(eventName ?? generateId(), options)
    }

    public render(): SpruceSchemas.HeartwoodViewControllers.v2021_02_11.SkillView {
        return {}
    }
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface ViewControllerPlugins {
        mmp: AdjustMmpVcPlugin
    }

    interface ViewControllerMap {
        mmp: MmpTestViewController
    }
}
