import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideMenuBarComponent } from '../../components/sideMenuBar/sideMenuBar.component';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SideMenuBarComponent
  ],
  templateUrl: './dashboardLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent { 
  public routes = routes[0].children?.filter( (route) => route.data )
}
