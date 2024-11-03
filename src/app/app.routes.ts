import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AssuntosPageComponent } from './pages/assuntos-page/assuntos-page.component';
import { AutoresPageComponent } from './pages/autores-page/autores-page.component';
import { LivrosPageComponent } from './pages/livros-page/livros-page.component';
import { CriarLivroComponent } from './components/criar-livro/criar-livro.component';
import { RelatorioPageComponent } from './pages/relatorios-page/relatorios-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'autores', component: AutoresPageComponent },
    { path: 'assuntos', component: AssuntosPageComponent },
    { path: 'livros', component: LivrosPageComponent },
    { path: 'livros/create', component: CriarLivroComponent },
    { path: 'livros/edit', component: CriarLivroComponent },
    { path: 'relatorios', component: RelatorioPageComponent },
    { path: '**', redirectTo: '' },
];