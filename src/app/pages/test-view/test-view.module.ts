import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestViewPageRoutingModule } from './test-view-routing.module';

import { TestViewPage } from './test-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestViewPageRoutingModule
  ],
  declarations: [TestViewPage]
})
export class TestViewPageModule {}
