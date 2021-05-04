import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reload',
  templateUrl: './reload.component.html',
  styleUrls: ['./reload.component.css']
})
export class ReloadComponent implements OnInit {
  @Input()
  message: string;
  @Input() isloading: boolean;
  constructor() { }

  ngOnInit() {
  }

}
