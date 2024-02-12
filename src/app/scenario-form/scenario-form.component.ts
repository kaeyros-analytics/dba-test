import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { ScenarioService } from '../services/scenario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Question, Response, Scenario } from '../models/scenario.model';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-scenario-form',
  templateUrl: './scenario-form.component.html',
  styleUrls: ['./scenario-form.component.scss']
})
export class ScenarioFormComponent implements OnInit, AfterViewInit {
  @ViewChild('scenario', {static: false}) scenario!: ElementRef;

  company = "Kaeyros";
  phoneNumberId = "100609346426084";
  // company = "Devskills";
  // phoneNumberId = "109638115536303";
  responseMsg = '';
  
  constructor(
    private renderer: Renderer2,
    private elmRef: ElementRef,
    private scenarioService: ScenarioService,
    private router: Router
 ) { }
 
  ngOnInit() {
  }

  addQuestion() {
    this.renderer.appendChild(this.scenario.nativeElement, this.question());
  }
  addResponse() {
    document.getElementById('first-responses')?.appendChild(this.response());
  }

  cleanData(data: Question | Response) {
    if ("questions" in data && data.questions) {
      if (data.questions.length === 0) {
        delete data.questions;
      } else {
        data.questions.forEach(q => this.cleanData(q));
      }
    }
    if ("responses" in data && data.responses) {
      if (data.responses.length === 0) {
        delete data.responses;
      } else {
        data.responses.forEach(r => this.cleanData(r));
      }
    }
  };

  getScenario() {
    const title = (<HTMLInputElement>document.querySelector('#title input')).value;
    const htmlContent = document.querySelector('.scenario');
    const content = this.getScenarioData(htmlContent);
    console.log(content);
    const scenario: Scenario = {
      company: this.company,
      phone_number_id: this.phoneNumberId,
      title: title,
      description: content
    };
    this.scenarioService.createScenario(scenario).subscribe(
      data => this.router.navigateByUrl('/settings'),
      (error: HttpErrorResponse) => this.responseMsg = error.message
    );
  }

  getScenarioData(element: Element|null, questions: Question[] = []) {
    if (element) {
      for (let child of element.children) {
        let question: Question = { label: '', responses: []};
        
        if (child.classList.contains('quest-resp')) {
          for (let subChild of child.children) {
            if (subChild.classList.contains('quest_wrapper')) {
              const textareaId = subChild.querySelector('textarea')?.getAttribute('id');
              question.label = (<HTMLInputElement>document.getElementById(textareaId ? textareaId : '')).value;
            } else if (subChild.classList.contains('responses')) {
              for (let reswrap of subChild.children) {
                let response: Response = { label: '', questions: [] };
                const inputId = reswrap.querySelector('input')?.getAttribute('id');
                response.label = (<HTMLInputElement>document.getElementById(inputId ? inputId : '')).value;
                const resQuestHtml = reswrap.querySelector('.questions');
                response.questions = this.getScenarioData(resQuestHtml, response.questions);
                
                if (response.label !== '') question.responses?.push(response);
              }
            }
          }
        }
        if (question.label !== '') questions.push(question);
      }
    }
    return questions;
  }

  question() {
    const quest_resp = this.renderer.createElement('div');
    this.renderer.setAttribute(quest_resp, 'class', 'quest-resp');
    const id = uuid();
    this.renderer.setAttribute(quest_resp, 'id', id);
    const questWrapper = this.renderer.createElement('div');
    this.renderer.setAttribute(questWrapper, 'class', 'quest_wrapper');
    this.renderer.appendChild(quest_resp, questWrapper);

    const responsesContainer = this.renderer.createElement('div');
    this.renderer.setAttribute(responsesContainer, 'class', 'responses');
    this.renderer.appendChild(quest_resp, responsesContainer);

    const div = this.renderer.createElement('div');
    this.renderer.setAttribute(div, 'class', 'input-group mb-3');

    const btnResp = this.renderer.createElement('button');
    this.renderer.setAttribute(btnResp, 'type', 'button');
    this.renderer.setAttribute(btnResp, 'class', 'btn btn-outline-secondary');
    this.renderer.listen(btnResp, 'click', (e) => {
      this.renderer.appendChild(responsesContainer, this.response());
    });
    const respText = this.renderer.createText('R');
    this.renderer.appendChild(btnResp, respText);

    const textarea = this.renderer.createElement('textarea');
    const idInput = uuid();
    this.renderer.setAttribute(textarea, 'id', idInput);
    this.renderer.setAttribute(textarea, 'placeholder', 'your question here');
    this.renderer.setAttribute(textarea, 'class', 'form-control');
    this.renderer.setAttribute(textarea, 'minlength', '3');
    this.renderer.setAttribute(textarea, 'maxlength', '1024');
    this.renderer.setAttribute(textarea, 'required', 'required');

    const btnRemove = this.renderer.createElement('button');
    this.renderer.setAttribute(btnRemove, 'type', 'button');
    this.renderer.setAttribute(btnRemove, 'class', 'btn btn-outline-secondary');
    const x = this.renderer.createElement('i');
    this.renderer.setAttribute(x, 'class', 'bi bi-x-lg');
    this.renderer.listen(btnRemove, 'click', (event) => {
      const elem = document.getElementById(id);
      elem?.parentNode?.removeChild(elem);
    });
    this.renderer.appendChild(btnRemove, x);

    this.renderer.appendChild(div, btnResp);
    this.renderer.appendChild(div, textarea);
    this.renderer.appendChild(div, btnRemove);

    this.renderer.appendChild(questWrapper, div);
    
    return quest_resp;
  }

  response() {
    const resp_wrapper = this.renderer.createElement('div');
    this.renderer.setAttribute(resp_wrapper, 'class', 'resp_wrapper');
    const id = uuid();
    this.renderer.setAttribute(resp_wrapper, 'id', id);
    const div = this.renderer.createElement('div');
    this.renderer.setAttribute(div, 'class', 'input-group mb-3');

    const questionsContainer = this.renderer.createElement('div');
    this.renderer.setAttribute(questionsContainer, 'class', 'questions');
    
    const btnQuest = this.renderer.createElement('button');
    this.renderer.setAttribute(btnQuest, 'type', 'button');
    this.renderer.setAttribute(btnQuest, 'class', 'btn btn-outline-secondary');
    const quest = this.renderer.createText('Q');
    this.renderer.appendChild(btnQuest, quest);
    this.renderer.listen(btnQuest, 'click', (event) => {
      this.renderer.appendChild(questionsContainer, this.question());
    });

    const input = this.renderer.createElement('input');
    this.renderer.setAttribute(input, 'type', 'input')
    const idInput = uuid();
    this.renderer.setAttribute(input, 'id', idInput);
    this.renderer.setAttribute(input, 'placeholder', 'your answer here');
    this.renderer.setAttribute(input, 'class', 'form-control');
    this.renderer.setAttribute(input, 'minlength', '3');
    this.renderer.setAttribute(input, 'maxlength', '20');
    this.renderer.setAttribute(input, 'required', 'required');

    const btnRemove = this.renderer.createElement('button');
    this.renderer.setAttribute(btnRemove, 'type', 'button');
    this.renderer.setAttribute(btnRemove, 'class', 'btn btn-outline-secondary');
    const x = this.renderer.createElement('i');
    this.renderer.setAttribute(x, 'class', 'bi bi-x-lg');
    this.renderer.listen(btnRemove, 'click', (event) => {
      const elem = document.getElementById(id);
      elem?.parentNode?.removeChild(elem);
    });
    this.renderer.appendChild(btnRemove, x);

    this.renderer.appendChild(div, btnQuest);
    this.renderer.appendChild(div, input);
    this.renderer.appendChild(div, btnRemove);
    
    this.renderer.appendChild(resp_wrapper, div);
    this.renderer.appendChild(resp_wrapper, questionsContainer);
    return resp_wrapper;
  }

  ngAfterViewInit(): void {
    $(document).ready(() => {
      // $('.quest-resp').css('width', '90%');
    });
  }

}
