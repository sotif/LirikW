import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
