import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private readonly baseUrl = environment.aiUrl;
  private readonly headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  constructor(private http: HttpClient) {}

  checkSafety(location: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/predict`, { location }, { headers: this.headers });
  }

  chat(message: string, history: ChatMessage[]): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/chat`, { message, history }, { headers: this.headers });
  }
}
