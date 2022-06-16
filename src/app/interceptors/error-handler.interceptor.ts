import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { DOCUMENT } from '@angular/common';
import { LocalStorageService } from 'src/app/data-management/local-storage.service';
import { RestService } from '../data-management/rest.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor{

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private localService: LocalStorageService,
    private restService: RestService,
    private router: Router
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
          if (err instanceof HttpErrorResponse) {
            if (err.status == 401 || err.status == 400) {
              this.restService.getRefreshToken().subscribe(
                () => {
                  this.router.navigate(['build-searcher']);
                },
                (err) => {
                  this.router.navigate(['login']);
                  console.log(err);
                }
              );
            }
          }
        }
      )
    );
  }
}
