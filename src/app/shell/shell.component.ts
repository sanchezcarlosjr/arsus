import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AuthStateModule } from '@store/auth/auth.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  @Select(AuthStateModule.admin) admin: Observable<boolean>;
  constructor() {}

  ngOnInit() {
  }
}
