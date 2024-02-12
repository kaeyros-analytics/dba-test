import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScenarioService } from '../services/scenario.service';
import { Observable, Subscription, map } from 'rxjs';
import { BackendScenario, Scenario } from '../models/scenario.model';
import { CredentialsService } from '../services/credentials.service';
import { BackendCredential, BackendCredentials } from '../models/credential.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credential } from '../models/credential.model';
import { HttpErrorResponse } from '@angular/common/http';
import { data } from 'jquery';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  backendScenario$!: Observable<BackendScenario>;
  backendCredentials$!: Observable<BackendCredentials>;

  credentialForm!: FormGroup;
  activeScenarioForm!: FormGroup;
  activeScenario!: Scenario;

  responseMsg = '';

  constructor(
    private scenarioService: ScenarioService,
    private credentialsService: CredentialsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.backendScenario$ = this.scenarioService.getScenarios();
    this.backendCredentials$ = this.credentialsService.getAllCredentials();
    this.backendScenario$.subscribe(
      (backendData) => {
        for (let scenario of backendData.data) {
          if (scenario.active) {
            this.activeScenario = scenario;
          }
        }
      }
    );
    this.initActiveScenarioForm();
    this.initCredentialForm();
  }

  initActiveScenarioForm() {
    this.activeScenarioForm = this.formBuilder.group({
      scenario: [this.activeScenario ? this.activeScenario : '', [Validators.required]]
    });
  }

  onSubmitActiveScenarioForm() {
    const scenarioEditValue = this.activeScenarioForm.value
    this.scenarioService.activeScenario(scenarioEditValue['scenario']).subscribe(
      (data) => this.responseMsg = "Scenario is successfully activated!"
    );
  }

  initCredentialForm(credential?: Credential) {
    if (credential) {
      this.credentialForm = this.formBuilder.group({
        company: [credential.company, Validators.required],
        phone_number_id: [''+credential.phone_number_id, Validators.required],
        verify_token: [credential.verify_token, Validators.required],
        token: [credential.token, Validators.required],
        _id: [credential._id]
      });
    } else {
      this.credentialForm = this.formBuilder.group({
        company: ['', Validators.required],
        phone_number_id: ['', Validators.required],
        verify_token: ['', Validators.required],
        token: ['', Validators.required]
      });
    }
  }

  updateCredential(credential: Credential) {
    this.initCredentialForm(credential);
  }

  deleteCredential(id?: string) {
    this.credentialsService.deleteCredential(id ? id : '').subscribe(
      data => console.log(data),
      (error: HttpErrorResponse) => this.responseMsg = error.message
    );
  }

  onSubmitCredentialFor() {
    const credentialValue = this.credentialForm.value;
    const credential: Credential = {
      company: credentialValue['company'],
      phone_number_id: credentialValue['phone_number_id'],
      verify_token: credentialValue['verify_token'],
      token: credentialValue['token']
    };
    if (this.credentialForm.get('_id')?.value) {
      credential._id = this.credentialForm.get('_id')?.value;
      this.credentialsService.updateCredential(credential).subscribe(
        (data: BackendCredential) => {
          this.responseMsg = 'Successfully saved!';
          this.credentialForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.responseMsg = error.message;
        }
      );
    } else {
      this.credentialsService.createCredential(credential).subscribe(
        (data: BackendCredential) => {
          this.responseMsg = 'Successfully saved!';
          this.credentialForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.responseMsg = error.message;
        }
      );
    }
  }

}
