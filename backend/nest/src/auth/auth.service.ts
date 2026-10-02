import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Simple placeholder for authentication logic
  validateUser(username: string, password: string): boolean {
    // In a real app, verify against DB or other store
    return username === 'admin' && password === 'admin';
  }
}
