import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const code = this.activatedRoute.snapshot.queryParams.code;
    if (!code) {
      this.router.navigate(['/']);
    }

    this.authService.authenticate(code)
      .subscribe(resp => {
        if (this.authService.loggedIn()) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/login']);
        }
      }, err => {
        console.error(err);
      });
  }

}
