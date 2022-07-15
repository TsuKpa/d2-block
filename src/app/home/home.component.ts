import { Component, OnInit } from '@angular/core';
import { ElectronService } from '@app/core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showModal = false;
  constructor(private electronService: ElectronService) { }

  ngOnInit(): void {
    // console.log(this.electronService.isElectron);
    this.electronService.getData();

  }

}
