import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-messageserror',
  templateUrl: './messageserror.component.html',
  styleUrls: ['./messageserror.component.css']
})
export class MessageserrorComponent implements OnInit {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
  constructor() { }

  ngOnInit() {
  }

}
