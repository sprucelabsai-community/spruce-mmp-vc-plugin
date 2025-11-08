import '#spruce/permissions/permissions.types'
import generateUrlEmitTargetAndPayloadSchema from '#spruce/schemas/heartwood/v2021_02_11/generateUrlEmitTargetAndPayload.schema'
import generateUrlResponsePayloadSchema from '#spruce/schemas/heartwood/v2021_02_11/generateUrlResponsePayload.schema'
import { buildEventContract } from '@sprucelabs/mercury-types'


const generateUrlEventContract = buildEventContract({
    eventSignatures: {
        'heartwood.generate-url::v2021_02_11': {
            isGlobal: true,
            
            aiInstructions: "Use ths to generate url to a skill view on the platform based on it's SkillViewId, or a full url (https://...). It's important to use this generate url's because the domain is dynamic and can change based on environment. Also, it's good practice to hide this event unless explicitly needed.",
            
            emitPermissions: {"contractId":"heartwood.skill-views","permissionIdsAny":["can-generate-url"]},
            
            emitPayloadSchema: generateUrlEmitTargetAndPayloadSchema,
            responsePayloadSchema: generateUrlResponsePayloadSchema,
            
            
        }
    }
})
export default generateUrlEventContract

export type GenerateUrlEventContract = typeof generateUrlEventContract
