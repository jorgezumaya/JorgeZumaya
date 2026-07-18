import { Component, OnInit, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ResumeService } from '../../core/services/resume.service';
import { injectIsBrowser } from '../../shared/util/platform';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
})
export class ResumeComponent implements OnInit {
  private readonly svc = inject(ResumeService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = injectIsBrowser();

  readonly loading = this.svc.loading;
  readonly error = this.svc.error;
  readonly rawUrl = this.svc.url;
  readonly safeUrl = computed(() => {
    const url = this.svc.url();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  ngOnInit(): void {
    if (this.isBrowser) {
      this.svc.load();
    }
  }
}
