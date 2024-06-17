import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import mmpAssert from '../../mmpAssert'

export default class MmpAssertThrowsUnlessBeforeEachTest extends AbstractSpruceFixtureTest {
    @test()
    protected static async setupThrowsWhenNoBeforeEachCalled() {
        await assert.doesThrowAsync(
            //@ts-ignore
            () => mmpAssert.pluginIsSetup(),
            'beforeEach'
        )
    }

    @test()
    protected static async didTrackEventThrowsWhenNoBeforeEachCalled() {
        await assert.doesThrowAsync(
            //@ts-ignore
            () => mmpAssert.didTrackEvent(),
            'beforeEach'
        )
    }
}
