import {
	Device,
	ViewControllerPlugin,
	ViewControllerPluginOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import SpruceError from './errors/SpruceError'

export default class AdjustMmpVcPlugin implements ViewControllerPlugin {
	private device: Device
	private isSetup: boolean = false

	public constructor(options: ViewControllerPluginOptions) {
		const { device } = options

		this.device = device
	}

	public setup(appToken: string, environment: string) {
		assertOptions(
			{
				appToken,
				environment,
			},
			['appToken', 'environment']
		)

		this.device.sendCommand('adjust_mmp_setup', {
			appToken,
			env: environment,
		})

		this.isSetup = true
	}

	public trackEvent(eventToken: string, options?: AdjustTrackEventOptions) {
		if (!this.isSetup) {
			throw new SpruceError({
				code: 'ADJUST_NOT_SETUP',
			})
		}

		assertOptions({ eventToken }, ['eventToken'])

		this.device.sendCommand('adjust_mmp_track_event', {
			eventToken,
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
