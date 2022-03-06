import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credentials } from 'src/app/models/credentials';

import { LoginService } from '../../services/login.service';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    registerForm: FormGroup;
    submitted = false;
    submittedAndValid = false;
    private jwt: string;

    constructor(private formBuilder: FormBuilder,
        private messageService: MessageService,
        private loginService: LoginService) {
        this.registerForm = this.getForm();
        this.jwt = '';
    }

    async hash(string: string): Promise<string> {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    }

    getForm() {
        return this.formBuilder.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    async onSubmit(data: Credentials) {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        const credentials = data;
        data.password = await this.hash(data.password);
        this.loginService.login(data).subscribe(jwt => {
            this.jwt = jwt.token;
            localStorage.setItem("id_token", this.jwt);
            this.submittedAndValid = true;
            this.submitted = false;
            this.registerForm = this.getForm();
            setTimeout(() => this.submittedAndValid = false, 5000);
        });

        return;
    }
}
