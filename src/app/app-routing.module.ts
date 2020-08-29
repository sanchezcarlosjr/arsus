import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'inbox',
      loadChildren: () => import('./inbox/inbox.module').then((m) => m.InboxModule),
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
    },
  ]),
  {
    path: '',
    loadChildren: () => import('./portfolio/portfolio.module').then((m) => m.PortfolioModule),
  },
  {
    path: 'research',
    loadChildren: () => import('./research/research.module').then((m) => m.ResearchModule),
  },
  { path: 'privacy-policy', loadChildren: () => import('./privacy/privacy.module').then((m) => m.PrivacyModule) },
  { path: 'terms-and-conditions', loadChildren: () => import('./terms/terms.module').then((m) => m.TermsModule) },
  {
    path: ':title/:uid',
    loadChildren: () => import('./projects/projects.module').then((m) => m.ProjectsModule),
  },
  { path: '**', redirectTo: 'tabs/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
