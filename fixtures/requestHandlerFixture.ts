import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/requestHandler';
import { APILogger } from '../utils/apiLogger';
import { setCustomExpectLogger } from '../utils/customExpects';

export type TestOptions = {
  api: RequestHandler;
}

export const test = base.extend<TestOptions>({
  api: async ({request, baseURL}, use) => {
    const logger = new APILogger();
    setCustomExpectLogger(logger);
    const requestHandler = new RequestHandler(request, baseURL!, logger);
    await use(requestHandler);
  }
});
