import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestViewPage } from './test-view.page';

const routes: Routes = [
  {
    path: '',
    component: TestViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestViewPageRoutingModule {}
