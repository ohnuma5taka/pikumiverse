import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpInterceptor,
  HttpParams,
} from '@angular/common/http';
import { catchError, filter, map, throwError } from 'rxjs';
import { StoreService } from '@/app/core/services/store.service';
import { Router } from '@angular/router';
import { env } from '@/environments/env';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { jsonUtil } from '@/app/core/utils/json.util';

export enum HttpStatusCodeEnum {
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  methodNotAllowed = 405,
  timeout = 408,
  conflict = 409,
  internalServerError = 500,
  notImplemented = 501,
  serviceUnavailable = 503,
}

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private store: StoreService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!request.url.startsWith('/')) return next.handle(request);
    const jwt = this.store.getters.jwt();
    const urlPrefix =
      request.url.indexOf('/assets') > -1 ? '' : env.apiPathPrefix;

    const req = request.clone({
      url: this.encode(urlPrefix + request.url),
      body: jsonUtil.toSnakeCase(request.body),
      params: this.formatParams(request.params),
      setHeaders: { Authorization: `Bearer ${jwt}`, Device: 'PC' },
    });
    if (!request.url.startsWith('/assets')) {
      console.log(
        'req',
        {
          method: request.method,
          url: request.method === 'GET' ? request.urlWithParams : request.url,
        },
        request.method === 'GET'
          ? ''
          : JSON.parse(jsonUtil.stringify(request.body))
      );
    }

    return next.handle(req).pipe(
      filter(
        (event): event is HttpResponse<any> => event instanceof HttpResponse
      ),
      map((res) => this.handleResponse(res)),
      catchError((err) => {
        this.handleError(err);
        return throwError(() => err);
      })
    );
  }

  private formatParams(params: HttpParams) {
    const object: Record<string, any> = {};
    params.keys().forEach((key) => {
      object[key] =
        params.getAll(key)?.length === 1 ? params.get(key) : params.getAll(key);
    });

    const newObject = jsonUtil.toSnakeCase(object) as Record<string, any>;
    let newParams = new HttpParams();
    for (const key in newObject) {
      const value = newObject[key];
      if (Array.isArray(value)) {
        value.forEach((v) => (newParams = newParams.append(key, v)));
      } else {
        newParams = newParams.set(key, value);
      }
    }
    return newParams;
  }

  private serialize(body: Object) {
    return Array.from(
      Object.entries(body).map((x) => `${x[0]}=${encodeURIComponent(x[1])}`)
    ).join('&');
  }

  private encoder = (_: string, value: any) =>
    typeof value === 'string' ? value.replace(/%/g, '%25') : value;

  private encode = <T>(data: T): T =>
    data ? JSON.parse(JSON.stringify(data, this.encoder)) : ('' as T);

  private handleResponse<T>(res: HttpResponse<T>): HttpResponse<T> {
    const xAuthToken = res.headers.get('x-auth-token');
    if (xAuthToken) this.store.setters.jwt(xAuthToken);
    const _res = res.clone({
      body: res.body ? (jsonUtil.toCamelCase(res.body) as T) : null,
    });
    if (!res.url?.includes('/assets')) {
      console.log('res', { url: _res.url, headers: _res.headers }, _res.body);
    }
    return _res;
  }

  private handleError(err: HttpErrorResponse) {
    let msg: string;
    if (!err) {
      msg =
        '通信に失敗しました。しばらく待機した後に再度アクセスをお願いします。\n状態が改善されない場合は担当者へお問合せ下さい。';
      this.snackbar.error(msg);
      return;
    }
    switch (err.status) {
      case HttpStatusCodeEnum.unauthorized:
        // msg =
        //   'しばらくの間アクセスが無かったため、再度ログインをお願いします。';
        // this.snackbar.error(msg);
        // this.store.setters.loginRedirecting(true);
        // this.router.navigate([AppPageEnum.login]);
        break;

      case HttpStatusCodeEnum.badRequest:
        msg =
          err.error.data || '異常なパラメータが検出されました。（Code: 400)';
        this.snackbar.error(msg);
        break;

      case HttpStatusCodeEnum.notFound:
        msg = err.error.data || '情報が見つかりませんでした。（Code: 404)';
        this.snackbar.error(msg);
        break;

      // any error handlings
      default:
        console.error(err);
        break;
    }
  }
}
