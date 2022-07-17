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

  async ngOnInit(): Promise<void> {
    // console.log(this.electronService.isElectron);
    await this.electronService.findAll();
    await this.electronService.readFileHost();
    // this.electronService.create({
    //     name: 'Zalo',
    //     url: 'www.zalo.com',
    //     description: 'www',
    //     isEnabled: true
    // });

  }

}
