import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Credential, BackendCredential, BackendCredentials } from '../models/credential.model';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllCredentials() {
    return this.http.get<BackendCredentials>(`${this.apiUrl}/credentials`)
  }

  getCredentialsByPhoneNumberId(phone_number_id: string) {
    return this.http.get<BackendCredential>(`${this.apiUrl}/credentials/${phone_number_id}`);
  }

  createCredential(credential: Credential) {
    return this.http.post<BackendCredential>(`${this.apiUrl}/credentials`, credential);
  }

  updateCredential(credential: Credential) {
    return this.http.put<BackendCredential>(`${this.apiUrl}/credentials`, credential);
  }

  deleteCredential(id: string) {
    return this.http.delete(`${this.apiUrl}/credentials/${id}`);
  }
}
