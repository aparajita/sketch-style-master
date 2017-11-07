/*
 * Copyright 2015 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

import MochaJSDelegate from './MochaJSDelegate'


export class NibUI {
  constructor(context, resourceBundleName, nibName, delegate, ivars) {
    const bundlePath = context.plugin.urlForResourceNamed(resourceBundleName).path()
    this._bundle = NSBundle.bundleWithPath(bundlePath)
    this._nibName = nibName
    this._delegate = delegate
    this.outlets = Object.create(null)
    this.ivars = Object.create(null)
    this._delegateProxy = null

    // Construct a class that will be the nib's owner
    this._createNibOwner(nibName)

    // Get the list of outlets and actions as defined in the nib
    const connections = this._loadConnections(nibName)
    this._prepareOutletConnections(connections.outlets)

    if (delegate) {
      this._connectActionsToDelegate(connections.actions, delegate)
    }

    if (ivars) {
      this._addIvars(ivars)
    }

    // Now that the nib owner class is completely constructed, register it with the ObjC runtime
    this._registerNibOwner()

    if (ivars) {
      this._initIvars(ivars)
    }

    this._load()
  }

  // Create a class name that doesn't exist yet. Note that we can't reuse the same
  // definition lest Sketch will throw an MOJavaScriptException when binding the UI,
  // probably due to JavaScript context / plugin lifecycle incompatibility.
  _createNibOwner(nibName) {
    let className

    do {
      className = nibName + NSUUID.UUID().UUIDString()
    }
    while (NSClassFromString(className) != null)

    this._cls = MOClassDescription.allocateDescriptionForClassWithName_superclass_(className, NSObject)

    // We need to add the NSObject protocol so it will be KVC compliant
    const protocol = MOProtocolDescription.descriptionForProtocolWithName('NSObject')
    this._cls.addProtocol(protocol)
  }

  _registerNibOwner() {
    this._cls.registerClass()
    this._nibOwner = NSClassFromString(this._cls.name()).alloc().init()
  }

  // Create setter methods that will be called when connecting each outlet during nib loading.
  // The setter methods register the connected view.
  _prepareOutletConnections(outlets) {
    for (let i = 0; i < outlets.length; i++) {
      const outletName = outlets[i]
      const selector = `set${outletName.charAt(0).toUpperCase()}${outletName.substring(1)}:`
      const setterFunc = view => {
        this.outlets[outletName] = view
      }

      this._cls.addInstanceMethodWithSelector_function(NSSelectorFromString(selector), setterFunc)
    }
  }

  _connectDelegateMethods() {
    if (!this._delegate) {
      return
    }

    let objectsToConnect = []
    let view = null

    if ('window' in this.outlets) {
      objectsToConnect.push(this.outlets.window)
      view = this.outlets.window.contentView()
    }
    else if ('view' in this.outlets) {
      view = this.outlets.view
    }

    if (!view) {
      return
    }

    this._checkForTextViewsToConnect(view, objectsToConnect)

    if (objectsToConnect.length) {
      const delegateProxy = this._getDelegateProxy()

      if (delegateProxy) {
        for (const object of objectsToConnect) {
          object.setDelegate(delegateProxy)
        }
      }
    }
  }

  _checkForTextViewsToConnect(view, objectsToConnect) {
    const children = view.subviews()

    for (const childView of Array.from(children)) {
      if (childView.isKindOfClass(NSTextField) && childView.isEditable() && childView.tag() > 0) {
        objectsToConnect.push(childView)
      }

      this._checkForTextViewsToConnect(childView, objectsToConnect)
    }
  }

  _getDelegateProxy() {
    if (!this._delegateProxy) {
      const selectors = [
        'windowWillClose:',
        'control:textShouldBeginEditing:',
        'controlTextDidBeginEditing:',
        'controlTextDidChange:',
        'control:textShouldEndEditing:',
        'controlTextDidEndEditing:'
      ]
      const delegateConfig = {}

      for (const selector of selectors) {
        let methodName = selector.replace(/(:.)/g, (match, subpattern) => subpattern.charAt(1).toUpperCase())
                                 .replace(/:$/, '')

        const method = this._delegate[methodName]

        if (method) {
          delegateConfig[selector] = method.bind(this._delegate)
        }
      }

      const delegate = new MochaJSDelegate(delegateConfig)
      this._delegateProxy = delegate.getClassInstance()
    }

    return this._delegateProxy
  }

  // Hook up actions with the delegate
  _connectActionsToDelegate(actions, delegate) {
    for (const action of actions) {
      const funcName = action.slice(0, -1) // Trim ':' from end of action
      const func = delegate[funcName]

      if (typeof func === 'function') {
        const forwardingFunc = sender => {
          // javascriptCore tends to die a horrible death if an uncaught exception occurs in an action method
          try {
            func.call(delegate, sender)
          }
          catch (ex) {
            log(NSString.stringWithFormat('%@: %@\nStack:\n%@', ex.name, ex.message, ex.stack))
          }
        }

        this._cls.addInstanceMethodWithSelector_function(NSSelectorFromString(action), forwardingFunc)
      }
    }
  }

  _addIvars(ivars) {
    for (const name of Object.keys(ivars)) {
      // Step 1: add an ivar to the nib owner class
      const value = ivars[name]
      const typeEncoding = this.constructor._typeEncodingForValue(value)

      if (!typeEncoding) {
        log(`Cannot determine the type encoding for the ivar '${name}', value = ${value}`)
        continue
      }

      if (this._cls.addInstanceVariableWithName_typeEncoding(name, typeEncoding)) {
        // Step 2: add a getter/setter to the ivar proxy object
        Object.defineProperty(this.ivars, name, {
          get: () => this.getIvar(name),
          set: value => this.setIvar(name, value)
        })
      }
      else {
        log('Unable to add ivar: ' + name)
      }
    }
  }

  _initIvars(ivars) {
    for (const name of Object.keys(ivars)) {
      this.setIvar(name, ivars[name])
    }
  }

  static _typeEncodingForValue(value) {
    const valueType = typeof value

    switch (valueType) {
      case 'string':
      case 'object':
        return '@'

      case 'number':
        return 'd'

      case 'boolean':
        return 'i'

      default:
        return null
    }
  }

  _loadConnections(nibName) {
    const path = `${this._bundle.resourcePath()}/${nibName}.json`
    const json = NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, null)

    if (json) {
      return JSON.parse(json)
    }

    return {
      outlets: [],
      actions: []
    }
  }

  _load() {
    const tloPointer = MOPointer.alloc().initWithValue(null)

    if (!this._bundle.loadNibNamed_owner_topLevelObjects(this._nibName, this._nibOwner, tloPointer)) {
      throw new Error(`Could not load nib '${this._nibName}'`)
    }

    this._connectDelegateMethods()
  }

  getIvar(name) {
    return this._nibOwner.valueForKey(name)
  }

  setIvar(name, value) {
    this._nibOwner.setValue_forKey(value, name)
  }
}
