type Args = {
  selectShape: (id: string | null) => void
  requestRender: () => void
}

export function handleSelectionClearMouseDown({
  selectShape,
  requestRender,
}: Args) {
  selectShape(null)
  requestRender()
}