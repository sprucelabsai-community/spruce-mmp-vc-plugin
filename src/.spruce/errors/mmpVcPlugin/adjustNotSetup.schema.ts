import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'

const adjustNotSetupSchema: SpruceErrors.MmpVcPlugin.AdjustNotSetupSchema = {
    id: 'adjustNotSetup',
    namespace: 'MmpVcPlugin',
    name: 'Adjust not setup',
    fields: {},
}

SchemaRegistry.getInstance().trackSchema(adjustNotSetupSchema)

export default adjustNotSetupSchema
