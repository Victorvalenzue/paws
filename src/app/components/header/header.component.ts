import { Component, Input, OnInit } from '@angular/core';

type HeaderInformation = {
  title: string;
  subtitle: string;
  image: string;
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input()
  information: HeaderInformation | undefined;
  @Input()
  withExtra = false;
  @Input()
  withBorder = false;
  @Input()
  showDay = false;

  constructor() {}

  ngOnInit() {}

  cordialDate() {
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const today = new Date();
    const weekDay = days[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];

    return `${weekDay} ${day} de ${month}`;
  }
}
