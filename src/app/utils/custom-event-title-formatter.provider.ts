import { LOCALE_ID, Inject,OnInit } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';

import { PlongeurService } from '../services/plongeur.service';
import { MoniteurService } from '../services/moniteur.service';

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter implements OnInit {
  
  plongeurs = [];
  infoPlongeurs = '';
  countPlongeur = 0;
  countPlongeurPhoto = 0;
  countPlongeurNitrox = 0;
  
  moniteurs = [];
  infoMoniteurs = '';
  
  constructor(@Inject(LOCALE_ID) private locale: string, @Inject(PlongeurService) private plongeurService: PlongeurService, @Inject(MoniteurService) private moniteurService: MoniteurService) {
    super();

    // Chargement de la liste des plongeurs participants
    this.plongeurService.getPlongeurs().subscribe(plongeur => {
      this.plongeurs = plongeur;
      //console.log('this.plongeurs : ', this.plongeurs);
    });

    // Chargement de la liste des moniteurs participants
    this.moniteurService.getMoniteurs().subscribe(moniteur => {
      this.moniteurs = moniteur;
      //console.log('this.moniteurs : ', this.moniteurs);
    });
  }

  ngOnInit() {
    //console.log('ngOnInit');
  }

  ngDoCheck() {
    //console.log('ngDoCheck');
  }

  ngAfterViewInit() {
    //console.log('ngAfterViewInit');
  }

  // you can override any of the methods defined in the parent class

  month(event): string {
    
    this.countPlongeur = 0;
     
    if (event.plongeurs){
      Object.keys(event.plongeurs).map(key => {
        this.plongeurs.forEach(plongeur => {
          if (plongeur.$key == key){
            this.countPlongeur = this.countPlongeur + event.plongeurs[key].nb;
            //console.log('infoPlongeurs',this.infoPlongeurs);
          }
        });
      });
    }
    
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )}</b> - <b>${new DatePipe(this.locale).transform(
      event.end,
      'HH:mm',
      this.locale
    )}</b>
    &nbsp;Total : ${event.plongeurs && event.moniteurs ? 
                    this.countPlongeur + Object.keys(event.moniteurs).length :
                    event.plongeurs ? this.countPlongeur  :
                    event.moniteurs ? Object.keys(event.moniteurs).length : 0}
    &nbsp;-&nbsp;Plongeur${event.plongeurs && this.countPlongeur > 1 ? 's' : ''} : ${event.plongeurs ? this.countPlongeur : 0}
    &nbsp;-&nbsp;Moniteur${event.moniteurs && Object.keys(event.moniteurs).length > 1 ? 's' : ''} : ${event.moniteurs ? Object.keys(event.moniteurs).length : 0}
    &nbsp;<i>${event.title}</i>
    `;
  }

  week(event): string {
    return ``;
  }

  day(event): string {
    
    this.infoPlongeurs = '';
    this.infoMoniteurs = '';

    this.countPlongeur = 0;
    this.countPlongeurPhoto = 0;
    this.countPlongeurNitrox = 0;
     
    if (event.plongeurs){
      Object.keys(event.plongeurs).map(key => {
        this.plongeurs.forEach(plongeur => {
          if (plongeur.$key == key){
            this.infoPlongeurs = this.infoPlongeurs + '<br>' + (event.plongeurs[key].accompte == 'En attente' ? '<span class="text-red">' : '') + event.plongeurs[key].nb + 'P: ' + (plongeur["brevet"] != '' ? plongeur["brevet"] : '<s>brevet</s>')  + ' : ' + plongeur["nom"] + ' ' + plongeur["prenom"] + (event.plongeurs[key].accompte == 'En attente' ? '</span>' : '');
            this.countPlongeur = this.countPlongeur + event.plongeurs[key].nb;
            
            if (event.plongeurs[key].photo) this.countPlongeurPhoto = this.countPlongeurPhoto + event.plongeurs[key].nb;
            if (event.plongeurs[key].nitrox) this.countPlongeurNitrox = this.countPlongeurNitrox + event.plongeurs[key].nb;
            //console.log('infoPlongeurs',this.infoPlongeurs);
          }
        });
      });
    }
    
    if (event.moniteurs){
      Object.keys(event.moniteurs).map(key => {
        this.moniteurs.forEach(moniteur => {
          if (moniteur.$key == key){
            this.infoMoniteurs = this.infoMoniteurs + '<br>M: ' + moniteur["nom"] + ' ' + moniteur["prenom"];
            //console.log('infoMoniteurs',this.infoMoniteurs);
          }
        });
      });
    }
    
    return `<div class="tooltip-custom"><b>${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )}</b> - <b>${new DatePipe(this.locale).transform(
      event.end,
      'HH:mm',
      this.locale
    )}${event.title != `` ? `, <i>${event.title}</i>` : ``}</b>
    <br>Total : ${event.plongeurs && event.moniteurs ? 
                    this.countPlongeur + Object.keys(event.moniteurs).length :
                    event.plongeurs ? this.countPlongeur  :
                    event.moniteurs ? Object.keys(event.moniteurs).length : 0} (M: ${event.moniteurs ? Object.keys(event.moniteurs).length : 0}, P: ${event.plongeurs ? this.countPlongeur : 0})
    <br>Photo : ${this.countPlongeurPhoto}
    <br>Nitrox : ${this.countPlongeurNitrox}
    <br>${this.infoPlongeurs}${this.infoMoniteurs} 
    </div>
    `;
  }

  monthTooltip(event): string {
    return this.day(event);
  }

  weekTooltip(event: CalendarEvent): string {
    return `${event.title}`;
  }

  dayTooltip(event: CalendarEvent): string {
    //return `<h5>${JSON.stringify(event)}</h5>`;
    return this.day(event);
  }
}