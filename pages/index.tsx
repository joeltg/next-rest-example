import React, { useCallback } from "react"

import api from "next-rest/client"
import type { GetServerSideProps } from "next"

import { widgets } from "utils/widgets"

interface IndexProps {
	widgets: { id: string; isGizmo: boolean; updatedAt: string }[]
}

export const getServerSideProps: GetServerSideProps<IndexProps, {}> = async (
	context
) => {
	return {
		props: {
			widgets: Array.from(widgets.entries()).map(
				([id, { isGizmo, updatedAt }]) => ({
					id,
					isGizmo,
					updatedAt: updatedAt.toISOString(),
				})
			),
		},
	}
}

export default function Index({ widgets }: IndexProps) {
	const handleUpdateGizmoStatus = useCallback(
		(id: string, isGizmo: boolean) => {},
		[]
	)

	const handleDeleteWidget = useCallback((id: string, updatedAt: string) => {
		api
			.delete("/api/widgets/[id]", {
				params: { id },
				headers: { "if-not-modified-since": new Date(updatedAt).toUTCString() },
				body: undefined,
			})
			.then(({ headers, body }) => {})
			.catch((err) => {})
	}, [])

	return (
		<main>
			{widgets.map((widget) => (
				<fieldset key={widget.id}>
					<legend>{widget.id}</legend>
					<p>i'm a widget</p>
					<p>
						gizmo status:{" "}
						<input
							type="checkbox"
							checked={widget.isGizmo}
							onChange={(event) =>
								handleUpdateGizmoStatus(widget.id, event.target.checked)
							}
						/>
					</p>
					<p>
						<input
							type="button"
							value="delete widget"
							onClick={() => handleDeleteWidget(widget.id, widget.updatedAt)}
						/>
					</p>
				</fieldset>
			))}
		</main>
	)
}
