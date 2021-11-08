import * as t from "io-ts"

import { makeHandler } from "next-rest/server"

const getRequestHeaders = t.type({ accept: t.literal("application/json") })
const getRequestBody = t.void

const putRequestHeaders = t.type({ accept: t.literal("application/json") })
const putRequestBody = t.type({ isGizmo: t.boolean })

const deleteRequestHeaders = t.type({ "if-not-modified-since": t.string })
const deleteRequestBody = t.void

type GetRequestHeaders = t.TypeOf<typeof getRequestHeaders>
type GetRequestBody = t.TypeOf<typeof getRequestBody>
type GetResponseHeaders = {
	"last-modified": string
	"content-type": "application/json"
}
type GetResponseBody = { id: string; isGizmo: boolean }

type PutRequestHeaders = t.TypeOf<typeof putRequestHeaders>
type PutRequestBody = t.TypeOf<typeof putRequestBody>
type PutResponseHeaders = { "last-modified": string }
type PutResponseBody = void

type DeleteRequestHeaders = t.TypeOf<typeof deleteRequestHeaders>
type DeleteRequestBody = t.TypeOf<typeof deleteRequestBody>
type DeleteResponseHeaders = {}
type DeleteResponseBody = void

declare module "next-rest" {
	interface API {
		"/api/widgets/[id]": Route<{
			GET: {
				request: {
					headers: GetRequestHeaders
					body: GetRequestBody
				}
				response: {
					headers: GetResponseHeaders
					body: GetResponseBody
				}
			}
			PUT: {
				request: {
					headers: PutRequestHeaders
					body: PutRequestBody
				}
				response: {
					headers: PutResponseHeaders
					body: PutResponseBody
				}
			}
			DELETE: {
				request: {
					headers: DeleteRequestHeaders
					body: DeleteRequestBody
				}
				response: {
					headers: DeleteResponseHeaders
					body: DeleteResponseBody
				}
			}
		}>
	}
}

export default makeHandler("/api/widgets/[id]", {
	GET: {
		headers: getRequestHeaders.is,
		body: getRequestBody.is,
		exec: async ({ params, headers, body }) => {
			return {
				headers: {
					"content-type": "application/json",
					"last-modified": "Wed, 21 Oct 2015 07:28:00 GMT",
				},
				body: { id: params.id, isGizmo: false },
			}
		},
	},
	PUT: {
		headers: putRequestHeaders.is,
		body: putRequestBody.is,
		exec: async ({ params, headers, body }) => {
			return { headers: { "last-modified": "" }, body: undefined }
		},
	},
	DELETE: {
		headers: deleteRequestHeaders.is,
		body: deleteRequestBody.is,
		exec: async ({ params, headers, body }) => {
			return { headers: {}, body: undefined }
		},
	},
})
