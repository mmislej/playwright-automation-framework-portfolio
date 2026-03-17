import { APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://automationexercise.com/api';

export interface CreateAccountPayload {
  name: string;
  email: string;
  password: string;
  title?: string;
  birth_date?: string;
  birth_month?: string;
  birth_year?: string;
  firstname: string;
  lastname: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile_number: string;
}

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createAccount(payload: CreateAccountPayload): Promise<void> {
    const form = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    ) as Record<string, string>;
    const response = await this.request.post(`${BASE_URL}/createAccount`, { form });
    const body = await response.json();
    if (body.responseCode !== 201) {
      throw new Error(`createAccount failed: ${body.message}`);
    }
  }

  async deleteAccount(email: string, password: string): Promise<void> {
    const response = await this.request.fetch(`${BASE_URL}/deleteAccount`, {
      method: 'DELETE',
      form: { email, password },
    });
    const body = await response.json();
    if (body.responseCode !== 200) {
      throw new Error(`deleteAccount failed: ${body.message}`);
    }
  }

  async verifyLogin(email: string, password: string): Promise<boolean> {
    const response = await this.request.post(`${BASE_URL}/verifyLogin`, {
      form: { email, password },
    });
    const body = await response.json();
    return body.responseCode === 200;
  }

  async getUserByEmail(email: string): Promise<Record<string, unknown>> {
    const response = await this.request.get(`${BASE_URL}/getUserDetailByEmail`, {
      params: { email },
    });
    return response.json();
  }
}
