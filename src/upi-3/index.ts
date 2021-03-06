import {CompositeDisposable, Disposable} from 'atom'

import {PluginManager} from '../plugin-manager'
import {TTextBufferCallback, TEventRangeType} from '../editor-control'
import {ISetTypesParams, TControlDefinition} from '../output-panel'
import {IParamSpec} from '../config-params'
import {TTooltipHandler} from '../tooltip-registry'
import {MAIN_MENU_LABEL} from '../utils'

export * from './instance'

export interface IAtomMenuCommand {
  label: string
  command: string
}

export interface IAtomSubmenu {
  label: string
  submenu: TAtomMenu[]
}

export type TAtomMenu = IAtomMenuCommand | IAtomSubmenu

export type TSingleOrArray<T> = T | T[]

export interface IRegistrationOptions {
  name: string
  menu?: {label: string, menu: TAtomMenu}
  messageTypes?: ISetTypesParams
  events?: {
    onWillSaveBuffer?: TSingleOrArray<TTextBufferCallback>
    onDidSaveBuffer?: TSingleOrArray<TTextBufferCallback>
    onDidStopChanging?: TSingleOrArray<TTextBufferCallback>
  }
  controls?: Array<TControlDefinition<Object>>
  params?: {[paramName: string]: IParamSpec<Object>}
  tooltip?: TTooltipHandler | {priority?: number, handler: TTooltipHandler, eventTypes?: TEventRangeType[]}
}

export function consume (pluginManager: PluginManager, options: IRegistrationOptions): Disposable {
  const {name, menu, messageTypes, events, controls, params, tooltip} = options
  const disp = new CompositeDisposable()

  if (menu) {
    const menuDisp = atom.menu.add([{
      label: MAIN_MENU_LABEL,
      submenu: [ {label: menu.label, submenu: menu.menu} ]
    }])
    disp.add(menuDisp)
  }
  if (messageTypes) {
    // TODO: make disposable
    for (const type of Object.keys(messageTypes)) {
      const opts = messageTypes[type]
      pluginManager.outputPanel.createTab(type, opts)
    }
  }
  if (events) {
    for (const k in events) {
      if (k.startsWith('on') && pluginManager[k]) {
        let v: TTextBufferCallback | TTextBufferCallback[] = events[k]
        if (!Array.isArray(v)) { v = [v] }
        for (const i of v) {
          disp.add(pluginManager[k](i))
        }
      }
    }
  }
  if (tooltip) {
    let handler: TTooltipHandler, priority: number | undefined, eventTypes: TEventRangeType[] | undefined
    if (typeof tooltip === 'function') {
      handler = tooltip
    } else {
      ({handler, priority, eventTypes} = tooltip)
    }
    if (!priority) { priority = 100 }
    disp.add(pluginManager.tooltipRegistry.register(name, {priority, handler, eventTypes}))
  }
  if (controls) {
    for (const i of controls) {
      disp.add(pluginManager.outputPanel.addPanelControl(i))
    }
  }
  if (params) {
    for (const paramName of Object.keys(params)) {
      const spec = params[paramName]
      disp.add(
        pluginManager.configParamManager.add(this.pluginName, paramName, spec)
      )
    }
  }

  return disp
}
