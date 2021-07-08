import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from 'src/types/user';
import { UserService } from 'src/user.service';
interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  }
];

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  countries = COUNTRIES;
  users: User[] = []
  basePath = `${environment.basePath}`

  constructor(private _userSerivce: UserService) { }

  ngOnInit(): void {
    console.log("working")
    this.getUsers()
  }

  getUsers() {
    this._userSerivce.getUsers().subscribe(res => {
      this.users = res.data
    })
  }

  deleteUser(id: String) {
    if (confirm('Are you sure want to delete it?')) {
      const data = [...this.users]
      this._userSerivce.deleteUser(id).subscribe(res => {
        this.users = data.filter(x => x._id !== id)
      })
    }
  }

}
