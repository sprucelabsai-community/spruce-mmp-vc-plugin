import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface AdjustNotSetupErrorOptions extends SpruceErrors.MmpVcPlugin.AdjustNotSetup, ISpruceErrorOptions {
	code: 'ADJUST_NOT_SETUP'
}

type ErrorOptions =  | AdjustNotSetupErrorOptions 

export default ErrorOptions
