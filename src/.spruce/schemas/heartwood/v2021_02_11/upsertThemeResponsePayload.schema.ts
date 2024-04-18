import { SchemaRegistry } from '@sprucelabs/schema'
import themeSchema_v2021_02_11 from '#spruce/schemas/heartwood/v2021_02_11/theme.schema'
import { SpruceSchemas } from '../../schemas.types'

const upsertThemeResponsePayloadSchema: SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeResponsePayloadSchema =
    {
        id: 'upsertThemeResponsePayload',
        version: 'v2021_02_11',
        namespace: 'Heartwood',
        name: '',
        fields: {
            /** . */
            theme: {
                type: 'schema',
                isRequired: true,
                options: { schema: themeSchema_v2021_02_11 },
            },
        },
    }

SchemaRegistry.getInstance().trackSchema(upsertThemeResponsePayloadSchema)

export default upsertThemeResponsePayloadSchema
