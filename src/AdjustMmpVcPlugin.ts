import {
    Device,
    ViewControllerPlugin,
    ViewControllerPluginOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import SpruceError from './errors/SpruceError'
import { MmpVcPlugin } from './mmp.types'

export default class AdjustMmpVcPlugin
    implements
        ViewControllerPlugin,
        MmpVcPlugin<AdjustMmpVcPluginSetupOptions, AdjustTrackEventOptions>
{
    private device: Device
    private isSetup = false

    public constructor(options: ViewControllerPluginOptions) {
        const { device } = options
        this.device = device
    }

    public setup(options: AdjustMmpVcPluginSetupOptions) {
        const { appToken, environment } = assertOptions(options, [
            'appToken',
            'environment',
        ])

        this.device.sendCommand('mmp_setup:adjust', {
            appToken,
            environment,
        })

        this.isSetup = true
    }

    public trackEvent(eventName: string, options?: AdjustTrackEventOptions) {
        if (!this.isSetup) {
            throw new SpruceError({
                code: 'ADJUST_NOT_SETUP',
            })
        }

        assertOptions({ eventName }, ['eventName'])

        this.device.sendCommand('mmp_track_event:adjust', {
            eventName,
            ...options,
        })
    }
}

export interface AdjustTrackEventOptions {
    revenue?: {
        amount: number
        currency: string
    }
    transationId?: string
    productId?: string
}

export interface AdjustMmpVcPluginSetupOptions {
    appToken: string
    environment: string
}
