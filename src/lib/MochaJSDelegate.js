'use strict'

export default class MochaJSDelegate {
  constructor(selectorHandlerDict, superclass) {
    this.uniqueClassName = 'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString()
    this.delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(this.uniqueClassName, superclass || NSObject)
    this.delegateClassDesc.registerClass()
    this.handlers = {}

    if (typeof selectorHandlerDict === 'object') {
      const selectors = Object.keys(selectorHandlerDict)

      for (const selectorString of selectors) {
        this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString])
      }
    }
  }

  setHandlerForSelector(selectorString, func) {
    const handlerHasBeenSet = (selectorString in this.handlers)
    this.handlers[selectorString] = func

    /*
      For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
      We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
    */
    if (!handlerHasBeenSet) {
      const args = []
      const regex = /:/g

      while (regex.exec(selectorString)) {
        args.push('arg' + args.length)
      }

      // JavascriptCore tends to die a horrible death if an uncaught exception occurs in an action method
      const body = `{
        try {
          return func.apply(this, arguments)
        }
        catch(ex) {
          log(ex)
        }
      }`
      const code = NSString.stringWithFormat('(function (%@) %@)', args.join(', '), body)
      const dynamicFunction = eval(String(code))
      const selector = NSSelectorFromString(selectorString)
      this.delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction)
    }
  }

  removeHandlerForSelector(selectorString) {
    delete this.handlers[selectorString]
  }

  getHandlerForSelector(selectorString) {
    return this.handlers[selectorString]
  }

  getAllHandlers() {
    return this.handlers
  }

  getClass() {
    return NSClassFromString(this.uniqueClassName)
  }

  getClassInstance() {
    return this.getClass().new()
  }
}
