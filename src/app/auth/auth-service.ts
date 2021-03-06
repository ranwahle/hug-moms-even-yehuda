import { Injectable } from "@angular/core";
import { Authentication } from "./authentication";
import { myAuthInfo } from "./my-auth-info";
import { foreachEntityItem } from "../shared/utils";
import { Helpers } from "../models";
import { SelectService } from "../select-popup/select-service";
import { Router } from "@angular/router";
import { evilStatics } from "./evil-statics";
import { LoginAction } from "./loginAction";
import { LoginFromSmsAction } from "../login-from-sms/login-from-sms-action";


@Injectable()
export class AuthService {

    async loginFromSms(key: string) {
        this.auth.loggedIn(await new LoginFromSmsAction().run({ key: key }), false);
        if (this.auth.valid) {
            this.router.navigate(['/my-families']);
        }
    }
    constructor(
        private dialog: SelectService,
        private router: Router
    ) { }
    async login(user: string, password: string, remember: boolean,fail:()=>void) {

        this.auth.loggedIn(await new LoginAction().run({ user: user, password: password }), remember);
        if (this.auth.valid) {
            if (this.auth.info.admin)
                this.router.navigate(['/families'])
            else
                this.router.navigate(['/my-families'])

        }
        else {
            this.dialog.Error("משתמשת לא נמצאה או סיסמה שגויה");
            fail();
        }

    }
    signout(): any {
        this.auth.signout();
        this.router.navigate(['/login']);
    }
    auth = evilStatics.auth;

}