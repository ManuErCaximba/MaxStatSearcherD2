import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { RestService } from '../data-management/rest.service';
import { NavController } from '@ionic/angular';
import { BuildSearcherPage } from '../pages/build-searcher/build-searcher.page';
import { LocalStorageService } from '../data-management/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private restService: RestService,
    private navCtrl: NavController,
    private localService: LocalStorageService
  ) { }

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
            if (err.status == 401 || err.status == 400 || err.status == 500) {
              this.restService.getRefreshToken().subscribe(
                (data) => {
                  this.localService.saveData('mssd2-auth-token', data['access_token']);
                  this.localService.saveData('mssd2-refresh-token', data['refresh_token']);
                  this.navCtrl.navigateForward('/build-searcher')
                },
                (err) => {
                  this.navCtrl.navigateForward('/login')
                }
              );
            }
          }
        }
      )
    );
  }
}
