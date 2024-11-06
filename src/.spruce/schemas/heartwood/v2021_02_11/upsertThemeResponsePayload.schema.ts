import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import themeSchema_v2021_02_11 from '#spruce/schemas/heartwood/v2021_02_11/theme.schema'

const upsertThemeResponsePayloadSchema: SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeResponsePayloadSchema  = {
	id: 'upsertThemeResponsePayload',
	version: 'v2021_02_11',
	namespace: 'Heartwood',
	name: '',
	    fields: {
	            /** . */
	            'theme': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: themeSchema_v2021_02_11,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(upsertThemeResponsePayloadSchema)

export default upsertThemeResponsePayloadSchema
