'use strict'

import { SharedStyleRenamer } from '../lib/shared-style-renamer'

export function renameTextStyles(context) {
  const styles = context.document.documentData().layerTextStyles()
  const renamer = new SharedStyleRenamer(context, styles, 'text')
  renamer.run()
}

export function renameLayerStyles(context) {
  const styles = context.document.documentData().layerStyles()
  const renamer = new SharedStyleRenamer(context, styles, 'layer')
  renamer.run()
}
