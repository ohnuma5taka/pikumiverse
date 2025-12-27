import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { fileUtil } from '@/app/core/utils/file.util';
import { StoreService } from '@/app/core/services/store.service';

// type ApiResponse<T> = {
//   messages: string[];
//   data?: T;
// };
type ApiResponse<T> = T;

type AppHttpHeaders =
  | HttpHeaders
  | { [header: string]: string | string[] }
  | undefined;

type HttpOptions = {
  headers?: AppHttpHeaders;
  params?: HttpParams | { [param: string]: string | string[] } | undefined;
  reportProgress?: boolean | undefined;
  responseType?: 'json' | undefined;
  withCredentials?: boolean | undefined;
};

type ArraybufferHttpOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe: 'response';
  context?: HttpContext;
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType: 'arraybuffer';
  withCredentials?: boolean;
};

const defaultHttpOptions: HttpOptions = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
  },
  withCredentials: true,
};

const arraybufferHttpOptions: ArraybufferHttpOptions = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
  },
  observe: 'response',
  responseType: 'arraybuffer',
  withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, private store: StoreService) {}

  async get<T>(url: string, body?: any, headers?: AppHttpHeaders) {
    const httpOptions = this.setHttpOptions(headers);
    httpOptions.params = body
      ? new HttpParams({ fromObject: body })
      : undefined;
    const res = await firstValueFrom(
      this.http.get<ApiResponse<T>>(url, httpOptions)
    );
    return this.extractData(res);
  }

  async post<T>(url: string, body?: any, headers?: AppHttpHeaders) {
    const httpOptions = this.setHttpOptions(headers);
    const res = await firstValueFrom(
      this.http.post<ApiResponse<T>>(url, body, httpOptions)
    );
    // if (!res) return undefined;
    return this.extractData(res);
  }

  async getExcel(url: string, body: Object = {}, columns: string[] = []) {
    const _body = { ...body, columns };
    const res = await firstValueFrom(
      this.http.post(url, _body, arraybufferHttpOptions)
    );
    if (!res.body) return;
    const disposition = res.headers.get('Content-Disposition');
    const filename = fileUtil.extractFilename(disposition);
    fileUtil.downloadExcel(res.body, filename || 'data');
  }

  async put<T>(url: string, body?: any, headers?: AppHttpHeaders) {
    const httpOptions = this.setHttpOptions(headers);
    const res = await firstValueFrom(
      this.http.put<ApiResponse<T>>(url, body, httpOptions)
    );
    return this.extractData(res);
  }

  async delete<T>(url: string, body?: any, headers?: AppHttpHeaders) {
    const httpOptions = this.setHttpOptions(headers);
    if (body) {
      httpOptions.params = new HttpParams({ fromObject: body });
    }
    const res = await firstValueFrom(
      this.http.delete<ApiResponse<T>>(url, httpOptions)
    );
    return this.extractData(res);
  }

  private setHttpOptions(headers?: AppHttpHeaders) {
    if (!headers) return defaultHttpOptions;
    return {
      ...defaultHttpOptions,
      headers: {
        ...defaultHttpOptions.headers,
        ...headers,
      },
    };
  }

  // private extractData<T>(res: ApiResponse<T>): T {
  //   console.log(
  //     'extractData',
  //     res,
  //     (res.data !== '' && res.data !== '{}' ? res.data : {}) as T
  //   );

  //   return (res.data !== '' && res.data !== '{}' ? res.data : {}) as T;
  // }

  private extractData<T>(res: ApiResponse<T>): T {
    return (res !== '' && res !== '{}' ? res : {}) as T;
  }
}
