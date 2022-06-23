import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from './data-management/data.resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'build-searcher',
    loadChildren: () => import('./pages/build-searcher/build-searcher.module').then( m => m.BuildSearcherPageModule)
  },
  {
    path: 'result',
    resolve: {
      results: DataResolverService
    },
    loadChildren: () => import('./pages/result/result.module').then( m => m.ResultPageModule)
  },
  {
    path: 'test-view',
    loadChildren: () => import('./pages/test-view/test-view.module').then( m => m.TestViewPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
