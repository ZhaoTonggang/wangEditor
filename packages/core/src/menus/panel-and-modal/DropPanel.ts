/**
 * @description dropPanel class
 * @author wangfupeng
 */

import { IDomEditor } from '../../editor/interface'
import $, { Dom7Array } from '../../utils/dom'
import PanelAndModal from './BaseClass'

class DropPanel extends PanelAndModal {
  readonly $elem: Dom7Array = $(`<div class="w-e-drop-panel"></div>`)

  constructor(editor: IDomEditor) {
    super(editor)
  }
}

export default DropPanel
