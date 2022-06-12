import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { DOCUMENT } from '@angular/common';
import { LocalStorageService } from 'src/app/data-management/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor{

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private localService: LocalStorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event) => {
          // Nothing
        },
        (err) => {
          /*
          if (err instanceof HttpErrorResponse) {
            if (err.status == 401 || err.status == 500 || err.status == 400) {
              this.localService.removeData('mssd2-auth-token');
              this.localService.removeData('mssd2-auth-code');
              this.document.location.href = 'https://www.bungie.net/en/OAuth/Authorize?client_id=40559&response_type=code';
            }
          }
          */
        }
      )
    );
  }
}
