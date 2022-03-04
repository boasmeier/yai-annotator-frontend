import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    submittedAndValid = false;

    constructor(private formBuilder: FormBuilder) {
        this.registerForm = this.getForm();
    }

    ngOnInit() {

    }

    getForm() {
        return this.formBuilder.group({
            firstName: ['', [
                Validators.required,
                Validators.pattern("^[^0-9`~!@#$%^&*()_+={}|:;“’<,>.?๐฿]*$")]
            ],
            lastName: ['', Validators.required],
            birthday: [''],
            email: ['', [Validators.required, Validators.email]],
            phoneNr: ['', Validators.pattern("^[0-9\+]*$")],
            message: ['', [Validators.required, Validators.max(20)]]
        });
    }

    onSubmit(data: any) {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.submittedAndValid = true;
        this.submitted = false;
        this.registerForm = this.getForm();
        console.log('Submit: ', data);
        setTimeout(() => this.submittedAndValid = false, 5000);
        return;
    }

}
