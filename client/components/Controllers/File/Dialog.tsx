import * as store from '@client/store'

export default function Dialog() {
  const dialog = store.useStore((state) => state.dialog)

  switch (dialog) {
    default:
      return null
  }
}
