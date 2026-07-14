import { Component } from '@angular/core';
import { SOCIAL_LINKS } from '../../shared/constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  year = new Date().getFullYear();
  readonly social = SOCIAL_LINKS;
}
