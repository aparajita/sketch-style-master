/*
  Handler for 'Rename Text Styles' command.
*/

'use strict'

// Code being used
import { regExpEscape } from './utils'
import { NibUI } from './sketch-nibui'

// webpack build dependencies
import '../nib/RenameStyles.xib'
import '../nib/RenameStyles.m'

const PREVIEW_COLUMN_COUNT = 2
const PREVIEW_CELL_SPACING = NSMakeSize(16, 2)
const PREVIEW_VISIBLE_ROWS = 27

const FIND_FIELD_TAG = 1
const REPLACE_FIELD_TAG = 2

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export class SharedStyleRenamer {
  constructor(context, styles, layerType) {
    this.context = context
    this.sketch = context.api()
    this.styles = styles
    this.styleInfo = []
    this.renamedStyles = []
    this.find = ''
    this.replace = ''
    this.cellFontRegular = NSFont.systemFontOfSize(NSFont.systemFontSize())
    this.cellFontBold = NSFont.boldSystemFontOfSize(NSFont.systemFontSize())
    this.layerType = layerType
    this.dialogTitle = `Rename ${capitalize(layerType)} Styles`

    this.ivars = {
      styles,
      renameCount: 0,
      findPattern: '',
      ignoreCase: false,
      useRegex: false,
      replacePattern: '',
      showMatchingStyles: false,
      autoScroll: true,
      findColor: NSColor.textColor()
    }
  }

  makeAlert() {
    const alert = NSAlert.new()
    alert.setMessageText(this.dialogTitle)

    const icon = NSImage.alloc().initByReferencingFile(this.sketch.resourceNamed('rename-styles@2x.png').path())
    alert.setIcon(icon)

    return alert
  }

  loadNib() {
    this.nib = new NibUI(this.context, 'UIBundle', 'RenameStyles', this, this.ivars)
    this.nib.outlets.window.setTitle(this.dialogTitle)
  }

  windowWillClose() {
    NSApp.stopModal()
  }

  controlTextDidChange(notification) {
    const tag = notification.object().tag()

    if (tag == FIND_FIELD_TAG) {
      this.searchForMatchingStyles()
    }
    else if (tag == REPLACE_FIELD_TAG) {
      this.updateReplacedNames()
    }
  }

  toggleShowOnlyMatchingStyles() {
    if (!this.nib.ivars.showMatchingStyles.boolValue()) {
      this.resetRenamedStyles()
    }

    this.searchForMatchingStyles()
  }

  toggleFindOption() {
    this.searchForMatchingStyles()
  }

  toggleAutoscroll() {
    this.scrollToFirstRenamedStyle()
  }

  handleRename() {
    this.renameStyles()
    NSApp.stopModal()
  }

  handleApply() {
    this.applyRename()
  }

  handleCancel() {
    NSApp.stopModal()
  }

  applyRename() {
    this.renameStyles()
    this.initStyleInfo()
    this.nib.ivars.findPattern = ''
    this.nib.ivars.replacePattern = ''
    this.nib.ivars.showMatchingStyles = false
    this.nib.outlets.window.makeFirstResponder(this.nib.outlets.window.initialFirstResponder())
    this.searchForMatchingStyles()
  }

  scrollToFirstRenamedStyle() {
    if (!this.nib.ivars.autoScroll.boolValue()) {
      return
    }

    const insets = this.nib.outlets.scrollView.contentInsets()
    let point = NSMakePoint(0, 0)

    if (this.renamedStyles.length > 0) {
      for (let i = 0; i < this.renamedStyles.length; i++) {
        const info = this.renamedStyles[i]

        if (info.newName.length > 0) {
          point = this.matrix.cellFrameAtRow_column(i, 0).origin
          break
        }
      }
    }
    else {
      point = this.matrix.cellFrameAtRow_column(0, 0).origin
    }

    point.y -= insets.top - 1 // Not sure why - 1 is necessary, but it is
    this.matrix.scrollPoint(point)
    this.nib.outlets.scrollView.reflectScrolledClipView(this.nib.outlets.scrollView.contentView())
  }

  searchForMatchingStyles() {
    // We always want to replace all occurrences of the find string within
    // a style name, so we have to transform a plain search into a RegExp with
    // the 'g' flag, because a plain text replace only replaces the first occurrence.
    const flags = this.nib.ivars.ignoreCase.boolValue() ? 'gi' : 'g'
    const regex = !!this.nib.ivars.useRegex.boolValue()

    // When the text field's value is empty, the bound value is returning null,
    // so make sure we have at least an empty string.
    let find = String(this.nib.ivars.findPattern || '')

    // RegExp constructor can fail, be sure to catch exceptions!
    try {
      if (regex) {
        this.find = new RegExp(find, flags)
      }
      else {
        this.find = new RegExp(regExpEscape(find), flags)
      }

      this.nib.ivars.findColor = NSColor.textColor()
    }
    catch (ex) {
      this.nib.ivars.findColor = NSColor.redColor()
      find = ''
      this.find = new RegExp('', flags)
    }

    this.updateStylesToRename(find.length === 0)
    this.setMatrixData()
    this.scrollToFirstRenamedStyle()
  }

  updateReplacedNames() {
    this.replace = String(this.nib.ivars.replacePattern || '')
    this.updateRenamedStyles()
    this.setMatrixData()
  }

  initStyleInfo() {
    const styles = this.styles.objects()
    this.styleInfo = new Array(styles.length)

    for (let i = 0; i < styles.length; i++) {
      const style = styles[i]

      this.styleInfo[i] = {
        style,
        name: style.name()
      }
    }

    this.styleInfo.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }

      if (a.name > b.name) {
        return 1
      }

      return 0
    })

    this.nib.ivars.renameCount = 0
    this.resetRenamedStyles()
  }

  resetRenamedStyles() {
    this.renamedStyles = new Array(this.styleInfo.length)

    for (let i = 0; i < this.styleInfo.length; i++) {
      const info = this.styleInfo[i]
      this.renamedStyles[i] = {
        style: info.style,
        oldName: info.name,
        newName: ''
      }
    }
  }

  updateStylesToRename(empty) {
    const renamedStyles = []
    let renameCount = 0

    for (let i = 0; i < this.styleInfo.length; i++) {
      const info = this.styleInfo[i]
      const found = !empty && this.find.test(info.name)
      let newName

      if (found) {
        newName = info.name.replace(this.find, this.replace)

        if (newName.length === 0) {
          newName = '<empty>'
        }
        else {
          renameCount++
        }

        if (this.nib.ivars.showMatchingStyles.boolValue()) {
          renamedStyles.push({
            style: info.style,
            oldName: info.name,
            newName
          })
        }
        else {
          this.renamedStyles[i].newName = newName
        }
      }
      else if (!this.nib.ivars.showMatchingStyles.boolValue()) {
        this.renamedStyles[i].newName = ''
      }
    }

    if (this.nib.ivars.showMatchingStyles.boolValue()) {
      this.renamedStyles = renamedStyles
    }

    this.nib.ivars.renameCount = renameCount
  }

  updateRenamedStyles() {
    let renameCount = 0

    for (const info of this.renamedStyles) {
      if (info.newName) {
        info.newName = info.oldName.replace(this.find, this.replace)

        if (info.newName.length === 0) {
          info.newName = '<empty>'
        }
        else {
          renameCount++
        }
      }
    }

    this.nib.ivars.renameCount = renameCount
  }

  renameStyles() {
    for (const info of this.renamedStyles) {
      if (info.newName.length > 0) {
        const copy = info.style.copy()
        copy.setName(info.newName)
        info.style.syncPropertiesFromObject(copy)
        this.styles.updateValueOfSharedObject_byCopyingInstance(info.style, copy.style())
      }
    }

    this.context.document.reloadInspector()
  }

  alignLabelWithColumn(label, column) {
    const insets = this.nib.outlets.scrollView.contentInsets()
    const scrollViewOrigin = this.nib.outlets.scrollView.frame().origin
    let cellOrigin = this.matrix.cellFrameAtRow_column(0, column).origin
    const labelOrigin = label.frame().origin
    labelOrigin.x = scrollViewOrigin.x + insets.left + cellOrigin.x
    label.setFrameOrigin(labelOrigin)
  }

  setMatrixData() {
    let maxWidth = 0
    this.matrix.renewRows_columns(this.renamedStyles.length, PREVIEW_COLUMN_COUNT)
    this.matrix.sizeToCells()
    const cells = this.matrix.cells()

    for (let row = 0; row < this.renamedStyles.length; row++) {
      const info = this.renamedStyles[row]

      // After setting the cell's value, get its width so we can calculate
      // the maximum width we'll need for cells.
      const index = row * PREVIEW_COLUMN_COUNT
      let cell = cells[index]
      cell.setFont(info.newName.length === 0 ? this.cellFontRegular : this.cellFontBold)
      cell.setStringValue(info.oldName)
      let size = cell.cellSize()
      maxWidth = Math.max(maxWidth, size.width)

      cell = cells[index + 1]
      cell.setFont(this.cellFontRegular)
      cell.setStringValue(info.newName)
      size = cell.cellSize()
      maxWidth = Math.max(maxWidth, size.width)
    }

    return NSMakeSize(maxWidth, cells[0].cellSize().height)
  }

  initMatrix() {
    const BORDER_STYLE = NSBezelBorder

    const scrollViewSize = this.nib.outlets.scrollView.frame().size
    const contentSize = NSScrollView.contentSizeForFrameSize_horizontalScrollerClass_verticalScrollerClass_borderType_controlSize_scrollerStyle(
      scrollViewSize,
      null,
      NSScroller,
      BORDER_STYLE,
      NSRegularControlSize,
      NSScrollerStyleOverlay
    )

    const insets = this.nib.outlets.scrollView.contentInsets()
    contentSize.width -= insets.left + insets.right
    contentSize.height -= insets.top + insets.bottom

    // Start with a default size, we'll fix that later
    let cellSize = NSMakeSize(100, 16)
    const cellPrototype = NSCell.alloc().initTextCell('')
    this.matrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(
      NSMakeRect(0, 0, cellSize.width * PREVIEW_COLUMN_COUNT, cellSize.height * this.renamedStyles.length),
      NSListModeMatrix,
      cellPrototype,
      this.renamedStyles.length,
      PREVIEW_COLUMN_COUNT
    )

    cellSize = this.setMatrixData()

    // Add 25% to the cell width to allow for longer names when renaming
    cellSize.width *= 1.25

    // Make sure the cell width is no less than half of the initial scrollview width
    const minWidth = Math.floor(scrollViewSize.width / 2)
    cellSize.width = Math.max(cellSize.width, minWidth)

    this.matrix.setCellSize(CGSizeMake(cellSize.width, cellSize.height));
    this.matrix.setIntercellSpacing(PREVIEW_CELL_SPACING)
    this.matrix.sizeToCells()

    this.nib.outlets.scrollView.setDocumentView(this.matrix)

    this.alignLabelWithColumn(this.nib.outlets.beforeLabel, 0)
    this.alignLabelWithColumn(this.nib.outlets.afterLabel, 1)

    // Resize the window to fit the matrix
    let matrixHeight = cellSize.height * PREVIEW_VISIBLE_ROWS
    matrixHeight += PREVIEW_CELL_SPACING.height * (PREVIEW_VISIBLE_ROWS - 1)
    const matrixSize = NSMakeSize(this.matrix.frame().size.width, matrixHeight)

    // Now adjust the containing view width and column labels to fit the matrix
    const frameSize = NSScrollView.frameSizeForContentSize_horizontalScrollerClass_verticalScrollerClass_borderType_controlSize_scrollerStyle(
      matrixSize,
      null,
      NSScroller,
      BORDER_STYLE,
      NSRegularControlSize,
      NSScrollerStyleOverlay
    )

    // Take content insets into account
    frameSize.width += insets.left + insets.right
    frameSize.height += insets.top + insets.bottom

    // Calculate the difference in the old size vs. new size, apply that to the view frame
    const sizeDiff = NSMakeSize(frameSize.width - scrollViewSize.width, frameSize.height - scrollViewSize.height)
    const windowFrame = this.nib.outlets.window.frame()
    windowFrame.size.width += sizeDiff.width
    windowFrame.size.height += sizeDiff.height

    const minSize = this.nib.outlets.window.minSize()
    windowFrame.size.width = Math.max(windowFrame.size.width, minSize.width)
    windowFrame.size.height = Math.max(windowFrame.size.height, minSize.height)

    this.nib.outlets.window.setFrame_display(windowFrame, true)
  }

  showAlert(message) {
    const alert = this.makeAlert()
    alert.setInformativeText(message)
    alert.runModal()
  }

  showFindDialog() {
    if (this.styles.numberOfSharedStyles() === 0) {
      const alert = this.makeAlert()
      alert.setInformativeText(`This document has no shared ${this.layerType} styles.`)
      alert.runModal()
      return 0
    }

    this.loadNib()
    this.initStyleInfo()
    this.initMatrix()

    return NSApp.runModalForWindow(this.nib.outlets.window)
  }

  run() {
    const response = this.showFindDialog()

    if (response !== 0) {
      this.nib.outlets.window.orderOut(null)
    }

    return response
  }
}

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
