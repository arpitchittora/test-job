import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/types/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public userForm!: FormGroup;
  image: File | undefined;
  submitted: boolean = false
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  user: User | undefined
  userId: String = '';
  basePath = environment.basePath

  constructor(public fb: FormBuilder, private _userSerivce: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(data => {

      if (data) {
        this.userId = data['id'];
      }
    });
    this.initForm()
    this.getUserInfo()
  }

  getUserInfo() {
    this._userSerivce.getUserInfo(this.userId).subscribe(res => {
      this.user = res.data
      this.f.username.setValue(this.user?.username)
      this.f.email.setValue(this.user?.email)
      this.f.dob.setValue(this.user?.dob)
      this.f.country_code.setValue(this.user?.country_code)
      this.f.avatar.setValue({ url: (this.user?.avatar ? this.basePath + 'users/' + this.user.avatar : '') })
    })
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
    console.log(this.userForm.value)
    if (this.userForm.value.mobile_number != '' && this.userForm.value.mobile_number != null) {
      data.append('country_code', this.userForm.value.mobile_number.dialCode)
      data.append('mobile_number', this.userForm.value.mobile_number.nationalNumber)
    }
    if (this.image) {
      data.append('image', this.image)
    }
    this._userSerivce.updateUser(this.userId, data).subscribe(res => {
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
