import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';

type StorageType = 'local' | 'session';

type StoreKey = 'jwt';

const arrayKeys: StoreKey[] = [];

@Injectable({ providedIn: 'root' })
export class StoreService implements OnDestroy {
  private onSubject = <T>(): Subject<{ key: string; value: T }> =>
    new Subject();
  changes = <T>() => this.onSubject<T>().asObservable().pipe(share());

  constructor() {
    this.initialize();
  }

  ngOnDestroy() {
    this.finalize();
  }

  private set<T>(key: StoreKey, value: T, storageType?: StorageType) {
    const storage = storageType === 'session' ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
    this.onSubject<T>().next({ key, value });
  }

  private get<T>(key: StoreKey, storageType?: StorageType): T {
    const value =
      storageType === 'session'
        ? sessionStorage.getItem(key) || ''
        : localStorage.getItem(key) || '';
    return (
      !!value && value !== 'undefined'
        ? JSON.parse(value)
        : arrayKeys.includes(key)
        ? []
        : ''
    ) as T;
  }

  clear(key: StoreKey, storageType?: StorageType) {
    const storage = storageType === 'session' ? sessionStorage : localStorage;
    storage.removeItem(key);
    this.onSubject<null>().next({ key, value: null });
  }

  clearAll() {
    localStorage.clear();
    sessionStorage.clear();
  }

  public setters = {
    jwt: (value: string) => this.set<string>('jwt', value),
  };

  public getters = {
    jwt: (): string => this.get<string>('jwt'),
  };

  private initialize() {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    const key = event.key || '';
    const value = event.newValue ? JSON.parse(event.newValue) : '';
    if (event.storageArea == localStorage) {
      this.onSubject<any>().next({ key, value });
    }
  }

  private finalize() {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
    this.onSubject<any>().complete();
  }
}
