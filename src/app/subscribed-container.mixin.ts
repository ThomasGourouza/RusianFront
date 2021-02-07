import { OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Mixin class with embedded onDestroy implementation to notify component
 * via an rxjs subject (to avoid boilerplate code)
 */
export const subscribedContainerMixin = <T extends Constructor>(base: T = class { } as T) =>

    class extends base implements OnDestroy {

        destroyed$ = new Subject<boolean>();

        ngOnDestroy(): void {
            this.destroyed$.next();
        }
    };
