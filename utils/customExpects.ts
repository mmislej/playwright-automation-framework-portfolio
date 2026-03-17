import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './apiLogger';
import { validateSchema } from './schemaValidator';

let apiLogger: APILogger

export const setCustomExpectLogger = (logger: APILogger) => {
  apiLogger = logger
}

export const expect = baseExpect.extend({
  shouldEqual(received: any, expected: any) {
    let pass: boolean;
    let logs: string = ''

    try {
      baseExpect(received).toEqual(expected);
      pass = true;
      if (this.isNot) {
        logs = apiLogger.getRecentLogs()
      }
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getRecentLogs()
    }

    const hint = this.isNot ? 'not' : ''
    const message = this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
      '\n\n' +
      `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(received)}\n\n` +
      `Recent API Activity: \n${logs}`

    return { message: () => message, pass }
  },

  shouldBeLessThanOrEqual(received: any, expected: any) {
    let pass: boolean;
    let logs: string = ''

    try {
      baseExpect(received).toBeLessThanOrEqual(expected);
      pass = true;
      if (this.isNot) {
        logs = apiLogger.getRecentLogs()
      }
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getRecentLogs()
    }

    const hint = this.isNot ? 'not' : ''
    const message = this.utils.matcherHint('shouldBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
      '\n\n' +
      `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(received)}\n\n` +
      `Recent API Activity: \n${logs}`

    return { message: () => message, pass }
  },

  shouldBeDefined(received: any) {
    let pass: boolean;
    let logs: string = ''

    try {
      baseExpect(received).toBeDefined();
      pass = true;
      if (this.isNot) {
        logs = apiLogger.getRecentLogs()
      }
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getRecentLogs()
    }

    const hint = this.isNot ? 'not' : ''
    const message = this.utils.matcherHint('shouldBeDefined', undefined, undefined, { isNot: this.isNot }) +
      '\n\n' +
      `Expected: ${hint} defined\n` +
      `Received: ${this.utils.printReceived(received)}\n\n` +
      `Recent API Activity: \n${logs}`

    return { message: () => message, pass }
  },

  shouldBeGreaterThan(received: any, expected: any) {
    let pass: boolean;
    let logs: string = ''

    try {
      baseExpect(received).toBeGreaterThan(expected);
      pass = true;
      if (this.isNot) {
        logs = apiLogger.getRecentLogs()
      }
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getRecentLogs()
    }

    const hint = this.isNot ? 'not' : ''
    const message = this.utils.matcherHint('shouldBeGreaterThan', undefined, undefined, { isNot: this.isNot }) +
      '\n\n' +
      `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(received)}\n\n` +
      `Recent API Activity: \n${logs}`

    return { message: () => message, pass }
  },

  async shouldMatchSchema(received: any, dirName: string, fileName: string, createSchemaFlag: boolean = false) {
    let pass: boolean;
    let message: string = ''

    try {
      await validateSchema(dirName, fileName, received, createSchemaFlag)
      pass = true;
      message = 'Schema validation passed'
    } catch (e: any) {
      pass = false;
      const logs = apiLogger.getRecentLogs()
      message = `${e.message}\n\nRecent API Activity: \n${logs}`
    }

    return { message: () => message, pass }
  },
})

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T>{
      shouldEqual(expected: T): R
      shouldBeLessThanOrEqual(expected: T): R
      shouldBeDefined(): R
      shouldBeGreaterThan(expected: T): R
      shouldMatchSchema(dirName: string, fileName: string, createSchemaFlag?: boolean): Promise<R>
    }
  }
}
