import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuildSearcherPageRoutingModule } from './build-searcher-routing.module';

import { BuildSearcherPage } from './build-searcher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BuildSearcherPageRoutingModule
  ],
  declarations: [BuildSearcherPage]
})
export class BuildSearcherPageModule {}
