import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuildSearcherPage } from './build-searcher.page';

const routes: Routes = [
    {
        path: '',
        component: BuildSearcherPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BuildSearcherPageRoutingModule {}
