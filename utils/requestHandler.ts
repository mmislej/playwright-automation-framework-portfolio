import { APIRequestContext, test } from '@playwright/test';
import { APILogger } from './apiLogger';

export class RequestHandler {
  private request: APIRequestContext;
  private logger: APILogger;
  private baseUrl: string;
  private defaultBaseUrl: string;
  private apiPath: string = '';
  private queryParams: object = {};
  private apiHeaders: Record<string, string> = {};
  private apiBody: object = {};

  constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
    this.request = request;
    this.defaultBaseUrl = apiBaseUrl;
    this.logger = logger;
  }

  url(url: string): this {
    this.baseUrl = url;
    return this;
  }

  path(path: string): this {
    this.apiPath = path;
    return this;
  }

  params(params: object): this {
    this.queryParams = params;
    return this;
  }

  headers(headers: Record<string, string>): this {
    this.apiHeaders = headers;
    return this;
  }

  body(body: object): this {
    this.apiBody = body;
    return this;
  }

  private getHeades(): Record<string, string> {
    return this.apiHeaders;
  }

  private cleanupFields() {
    this.apiBody = {}
    this.apiHeaders = {}
    this.baseUrl = undefined
    this.apiPath = ''
    this.queryParams = {}
  }

  private statusCodeValidator(actualStatus: number, expectStatus: number, callingMethod: Function) {
    if (actualStatus !== expectStatus) {
      const logs = this.logger.getRecentLogs()
      const error = new Error(`Expected status ${expectStatus} but got ${actualStatus}\n\nRecent API Activity: \n${logs}`)
      Error.captureStackTrace(error, callingMethod)
      throw error
    }
  }

  private getUrl(): string {
    const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value);
    }
    return url.toString();
  }

  async getRequest(statusCode: number) {
    let responseJSON: any
    const url = this.getUrl()
    await test.step(`GET request to: ${url}`, async () => {
      this.logger.logRequest('GET', url, this.getHeades())
      const response = await this.request.get(url, {
        headers: this.getHeades()
      })
      this.cleanupFields()
      const actualStatus = response.status()
      responseJSON = await response.json()
      this.logger.logResponse(actualStatus, responseJSON)
      this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
    })
    return responseJSON
  }

  async postRequest(statusCode: number) {
    let responseJSON: any
    const url = this.getUrl()
    await test.step(`POST request to: ${url}`, async () => {
      this.logger.logRequest('POST', url, this.getHeades())
      const response = await this.request.post(url, {
        headers: this.getHeades(),
        form: this.apiBody as Record<string, string>,
      })
      this.cleanupFields()
      const actualStatus = response.status()
      responseJSON = await response.json()
      this.logger.logResponse(actualStatus, responseJSON)
      this.statusCodeValidator(actualStatus, statusCode, this.postRequest)
    })
    return responseJSON
  }

  async putRequest(statusCode: number) {
    let responseJSON: any
    const url = this.getUrl()
    await test.step(`PUT request to: ${url}`, async () => {
      this.logger.logRequest('PUT', url, this.getHeades())
      const response = await this.request.put(url, {
        headers: this.getHeades(),
        form: this.apiBody as Record<string, string>,
      })
      this.cleanupFields()
      const actualStatus = response.status()
      responseJSON = await response.json()
      this.logger.logResponse(actualStatus, responseJSON)
      this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
    })
    return responseJSON
  }

  async deleteRequest(statusCode: number) {
    let responseJSON: any
    const url = this.getUrl()
    await test.step(`DELETE request to: ${url}`, async () => {
      this.logger.logRequest('DELETE', url, this.getHeades())
      const response = await this.request.delete(url, {
        headers: this.getHeades(),
        form: this.apiBody as Record<string, string>,
      })
      this.cleanupFields()
      const actualStatus = response.status()
      responseJSON = await response.json()
      this.logger.logResponse(actualStatus, responseJSON)
      this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
    })
    return responseJSON
  }
}
