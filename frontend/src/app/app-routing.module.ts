import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './user/add/add.component';
import { EditComponent } from './user/edit/edit.component';
import { ListComponent } from './user/list/list.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/',
        pathMatch: 'full'
    },
    { path: "", component: ListComponent },
    { path: "add", component: AddComponent },
    { path: "edit/:id", component: EditComponent },
]
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }