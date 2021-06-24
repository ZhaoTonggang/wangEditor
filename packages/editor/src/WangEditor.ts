/**
 * @description Editor class
 * @author wangfupeng
 */

// import $, { Dom7Array } from 'dom7'
import { Node, Transforms } from 'slate'
import {
  IDomEditor,
  DomEditor,
  IConfig,
  createEditor,

  // 注册菜单
  IMenuConf,
  registerMenu,

  // 渲染 modal -> view
  IRenderElemConf,
  RenderTextStyleFnType,
  registerTextStyleHandler,
  registerRenderElemConf,

  // to html
  IElemToHtmlConf,
  TextToHtmlFnType,
  TextStyleToHtmlFnType,
  registerTextStyleToHtmlHandler,
  registerTextToHtmlHandler,
  registerElemToHtmlConf,
} from '@wangeditor/core'

type PluginType = <T extends IDomEditor>(editor: T) => T

class WangEditor {
  // private $container: Dom7Array
  private containerId: string
  private initContent: Node[]
  config: IConfig = {}
  editorCore: IDomEditor | null = null // TODO 输出 editor API

  constructor(containerId: string, initContent?: Node[]) {
    this.containerId = containerId
    this.initContent = initContent || []

    this.config = {
      ...WangEditor.config, // 全局配置
      ...this.config,
    }
  }

  /**
   * 修改 menu config
   * @param menuKey menu key
   * @param newMenuConfig menu config
   */
  setMenuConfig(menuKey: string, newMenuConfig: { [key: string]: any }) {
    const { config } = this
    if (config.menuConf == null) config.menuConf = {}
    const { menuConf } = config
    menuConf[menuKey] = newMenuConfig

    this.tryReRenderWangEditor()
  }

  /**
   * 创建 editorCore 实例
   */
  create() {
    const { containerId, config, initContent } = this
    const { plugins } = WangEditor

    const editorCore = createEditor({ containerId, config, initContent, plugins })
    this.editorCore = editorCore
  }

  /**
   * 修改编辑器 config ，并重新渲染
   * @param newConfig new config
   */
  setConfig(newConfig: Partial<IConfig> = {}) {
    this.config = {
      ...this.config,
      ...newConfig,
    }

    this.tryReRenderWangEditor()
  }

  /**
   * 销毁编辑器
   */
  destroy() {
    const { editorCore } = this
    if (editorCore == null) return

    // TODO 销毁编辑器实例
  }

  /**
   * 尝试重新渲染编辑器视图
   */
  private tryReRenderWangEditor() {
    const { editorCore, config } = this
    if (editorCore == null) return

    // 取消选择
    Transforms.deselect(editorCore)
    // 重新设置 config ，重要！！！
    editorCore.setConfig(config)

    // 触发 更新视图
    const textarea = DomEditor.getTextarea(editorCore)
    textarea.onEditorChange()

    // 尝试 focus
    if (config.autoFocus !== false) {
      DomEditor.focus(editorCore)
    }
  }

  // -------------------------------------- 分割线 --------------------------------------

  // 全局 - 配置
  static config: IConfig = {}
  static setConfig(newConfig: Partial<IConfig> = {}) {
    this.config = {
      ...this.config,
      ...newConfig,
    }
  }

  // 全局 - 注册插件
  static plugins: PluginType[] = []
  static registerPlugin(plugin: PluginType) {
    this.plugins.push(plugin)
  }

  // 全局 - 注册 menu
  static registerMenu(menuConf: IMenuConf, customConfig?: { [key: string]: any }) {
    registerMenu(menuConf, customConfig)
  }

  // 全局 - 注册 renderElem
  static registerRenderElem(renderElemConf: IRenderElemConf) {
    registerRenderElemConf(renderElemConf)
  }

  // 全局 - 注册 renderTextStyle
  static registerRenderTextStyle(fn: RenderTextStyleFnType) {
    registerTextStyleHandler(fn)
  }

  // 全局 - 注册 elemToHtml
  static registerElemToHtml(elemToHtmlConf: IElemToHtmlConf) {
    registerElemToHtmlConf(elemToHtmlConf)
  }

  // 全局 - 注册 textToHtml
  static registerTextToHtml(fn: TextToHtmlFnType) {
    registerTextToHtmlHandler(fn)
  }

  // 全局 - 注册 textStyleToHtml
  static registerTextStyleToHtml(fn: TextStyleToHtmlFnType) {
    registerTextStyleToHtmlHandler(fn)
  }
}

export default WangEditor
