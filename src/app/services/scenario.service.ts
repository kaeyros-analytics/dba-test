import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { BackendScenario, Scenario } from '../models/scenario.model';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getScenarios() {
    return this.http.get<BackendScenario>(`${this.apiUrl}/getall`);
  }

  createScenario(scenario: Scenario) {
    return this.http.post<Scenario>(`${this.apiUrl}/create`, scenario);
  }

  activeScenario(scenario: Scenario) {
    return this.http.post<Scenario>(`${this.apiUrl}/active`, scenario);
  }
}
