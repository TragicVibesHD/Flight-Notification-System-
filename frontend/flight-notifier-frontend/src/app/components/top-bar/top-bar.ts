import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar {
  auth = inject(Auth);
}