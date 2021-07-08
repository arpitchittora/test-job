import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  public userForm!: FormGroup;
  image: File | undefined;
  submitted: boolean = false
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(public fb: FormBuilder, private _userSerivce: UserService, private router: Router) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: [''],
      country_code: [''],
      mobile_number: [''],
      avatar: [null]
    });
  }

  get f() { return this.userForm.controls; }

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  onFileChange(event: any) {
    console.log({ event });

    if (event && event.target.files && event.target.files) {
      const tag = new Date().getTime();
      const reader = new FileReader();

      reader.onload = (event: any) => {
        if (this.userForm)
          this.userForm.patchValue({
            avatar: { tag, url: event.target.result }
          });
      };

      event.target.files[0]['tag'] = tag;
      this.image = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSubmit() {
    this.submitted = false
    if (this.userForm && this.userForm.invalid) {
      this.submitted = true
      return;
    }
    let data = new FormData()
    data.append('username', this.userForm.value.username)
    data.append('email', this.userForm.value.email)
    data.append('dob', this.userForm.value.dob)
    if (this.userForm.value.mobile_number != '') {
      data.append('country_code', this.userForm.value.mobile_number.dialCode)
      data.append('mobile_number', this.userForm.value.mobile_number.nationalNumber)
    }
    if (this.image) {
      data.append('image', this.image)
    }
    this._userSerivce.addUser(data).subscribe(res => {
      if (res.status == 'success') {
        this.router.navigate(['/'])
      }
    }, err => {
      if (err.error.message) {
        if (err.error.message instanceof Array)
          alert(err.error.message[0]['message'])
        else
          alert(err.error.message)
      }
    })
  }
}
