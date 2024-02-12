import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioFormComponent } from './scenario-form/scenario-form.component';
import { ScenarioListComponent } from './scenario-list/scenario-list.component';
import { SettingsComponent } from './settings/settings.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: 'form', component: ScenarioFormComponent },
  { path: 'list', component: ScenarioListComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
