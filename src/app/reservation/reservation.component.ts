import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moveIn, fallIn, moveInLeft } from '../router.animations';

import { ReservationService } from '../services/reservation.service';
import { MoniteurService } from '../services/moniteur.service';
import { PlongeurService } from '../services/plongeur.service';

import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, DAYS_OF_WEEK, CalendarEventTitleFormatter, CalendarDateFormatter, CalendarUtils } from 'angular-calendar';

import { CustomEventTitleFormatter } from '../utils/custom-event-title-formatter.provider';
import { CustomDateFormatter } from '../utils/custom-date-formatter.provider';
import { CustomCalenderUtils } from '../utils/CustomCalenderUtils';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {}, //'[@moveIn]': ''
  animations: [ 
    moveIn(), fallIn(), moveInLeft(),
  ],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
    {
      provide: CalendarUtils,
      useClass: CustomCalenderUtils,
    }
  ]
})

export class ReservationComponent implements OnInit {
  
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalEvent') modalEvent: TemplateRef<any>;
  @ViewChild('modalConfirm') modalConfirm: TemplateRef<any>;
  @ViewChild('modalAddPlongeur') modalAddPlongeur: TemplateRef<any>;
  @ViewChild('modalAddMoniteur') modalAddMoniteur: TemplateRef<any>;

   /**
   *  Variables publics
   */

  reservationTextEdit: string = '';
  reservationTextAbort: string = '';
  view: string = 'week';
  viewDate: Date = new Date();
  locale: string = 'fr';
  activeDayIsOpen: boolean = false;
  modalDelete: any;
  modalEdit: any;
  modalPlongeur: any;
  modalMoniteur: any;
  
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  reservationCount: number = 0;
  events = [];
  event: any;

  draggable: boolean = true;

  resizable: any = {
    beforeStart: true,
    afterEnd: true,
  };

  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    }
  };

  actions: CalendarEventAction[] = [
  {
    label: '<i class="fa fa-fw fa-times"></i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      //this.events = this.events.filter(iEvent => iEvent !== event);
      this.event = event;
      this.handleEvent('Deleted', event);
    }
  }
  ];

  refresh: Subject<any> = new Subject();

  // Varialbes Plongeur
  plongeurCount: number = 0;
  plongeurs = [];
  reservationPlongeurs = [];

  // Variables Moniteur
  moniteurCount: number = 0;
  moniteurs = [];
  reservationMoniteurs = [];
  
  // Animation
  state: string;

  // FilterBy
  term: string;
  
  // OrderBy
  orderEvent: string = 'start';
  order: string = 'nom';
  reverse: boolean = false;
  
  // Pagination
  pagePlongeurModal: number = 1;
  pageMoniteurModal: number = 1;

  constructor(private reservationService: ReservationService, 
              private plongeurService: PlongeurService, 
              private moniteurService: MoniteurService, 
              private tostr: ToastrService, 
              private modal: NgbModal) {}
  
  ngOnInit() {
    // Initialisation de l'objet
    this.resetForm();
    // Chargement de la liste des réservations
    this.reservationService.getReservations().subscribe(reservation => {
      //console.log('reservation : ', reservation);
      this.events = [];
      reservation.forEach(element => {
        //console.log('element : ', element);

        //Chargement des constantes non sauvegardés en base
        element["draggable"] = this.draggable;
        element["actions"] = this.actions;
        element["resizable"] = this.resizable;
        //On passe les dates de millisecond en vrai date pour le DatePicker
        element["start"] = new Date(element["start"]);
        element["end"] = new Date(element["end"]);
        
        this.events.push(element);
        this.reservationCount = this.events.length;
        this.refresh.next();
      })
    });
    
    // Chargement de la liste des plongeurs
    this.plongeurService.getPlongeurs().subscribe(plongeur => {
      this.plongeurs = plongeur;
      //this.plongeurCount = this.plongeurs.length;
      //console.log('this.plongeurs : ', this.plongeurs);
    });
     
    // Chargement de la liste des moniteurs
    this.moniteurService.getMoniteurs().subscribe(plongeur => {
      this.moniteurs = plongeur;
      //this.moniteurCount = this.moniteurs.length;
      //console.log('this.moniteurs : ', this.moniteurs);
    });
    
  }

  //Gestion du orderBy
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  /**
   * Gestion Reservation
   */ 

  // Total des participants
  getTotalPlongeurs(plongeurs){
    var countPlongeur = 0;
    if (plongeurs){
      Object.keys(plongeurs).map(key => {
        this.plongeurs.forEach(plongeur => {
          if (plongeur.$key == key){
            countPlongeur = countPlongeur + plongeurs[key].nb;
            //console.log('infoPlongeurs',this.infoPlongeurs);
          }
        });
      });
    }
    //console.log('countPlongeur',countPlongeur);
    return countPlongeur;
  }

  getTotalMoniteurs(moniteurs){
    var countMoniteurs = 0;
    if (moniteurs){
      countMoniteurs = Object.keys(moniteurs).length;
    } 
    //console.log('countMoniteurs',countMoniteurs);
    return countMoniteurs; 
  }

  // Ajouter un evenment : context menu
  addEvent(date: Date): void {
    this.resetForm();
    this.reservationService.selectedReservation.start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() == 0 ? 8 : date.getHours(), 0);
    this.reservationService.selectedReservation.end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() == 0 ? 10 : date.getHours() + 2, 30);
    this.showAddEventModal('Ajouter', 'Annuler');
    this.refresh.next();
  }

  showAddEventModal(textTitle, textButtonAbort){
    
    this.reservationPlongeurs = [];
    this.reservationMoniteurs = [];

    this.plongeurCount = 0;
    this.moniteurCount = 0;

    if (this.reservationService.selectedReservation.plongeurs){
      Object.keys(this.reservationService.selectedReservation.plongeurs).map(key => {
        
        this.plongeurs.forEach(plongeur => {
          if (plongeur.$key == key){
            //console.log('this.reservationService.selectedReservation.plongeurs', this.reservationService.selectedReservation.plongeurs[key]);
            this.reservationPlongeurs.push(plongeur);
            this.plongeurCount = this.plongeurCount + this.reservationService.selectedReservation.plongeurs[key].nb;
          }
        });
      });
    };

    if (this.reservationService.selectedReservation.moniteurs){
      Object.keys(this.reservationService.selectedReservation.moniteurs).map(key => {
        
        this.moniteurs.forEach(moniteur => {
          if (moniteur.$key == key){
            this.reservationMoniteurs.push(moniteur);
            this.moniteurCount = this.moniteurCount + 1;
          }
        });
      });
    };
    
    this.reservationTextEdit = textTitle + " une réservation";
    this.reservationTextAbort = textButtonAbort;
    this.modalEdit = this.modal.open(this.modalEvent, { windowClass: 'modal-full' });
  }

  //Action : Afficher modal pour éditer
  hourSegmentClicked(date: Date) {
    //console.log('date', date);
    this.resetForm();
    this.reservationService.selectedReservation.start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    this.reservationService.selectedReservation.end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 2,  date.getMinutes() + 30);
    this.showAddEventModal('Ajouter', 'Annuler');
  }

  //Action : Afficher modal pour éditer
  onEdit(reservation) {
    this.showAddEventModal('Editer', 'Supprimer');
    this.reservationService.selectedReservation = Object.assign({}, reservation);
  }

  //Action : Afficher modal pour ajouter
  onAdd() {
    this.resetForm();
    this.showAddEventModal('Ajouter', 'Annuler');
  }

  //Action : Soumission du formulaire d'édition
  onSubmit() {
    //console.log('this.reservationService.selectedReservation', this.reservationService.selectedReservation);
    if (this.reservationService.selectedReservation.$key == null){
      this.reservationService.InsertReservation(this.reservationService.selectedReservation);}
    else{
      this.reservationService.updateReservation(this.reservationService.selectedReservation);
    }
      
    this.refresh.next();
    this.resetForm();
    if (this.modalEdit) this.modalEdit.close();
    this.tostr.success('Enregistrement effectué', 'Réservation enregistrée');
  }
  
  //Action : Afficher modal pour confirmation Supprimer
  onDelete(reservation) {
    this.modalDelete = this.modal.open(this.modalConfirm, { size: 'lg' });
    this.reservationService.selectedReservation = Object.assign({}, reservation);
  }

  //Action : Supprimer
  isDelete(isDelete: boolean) {
    if (isDelete) {
      this.reservationService.deleteReservation(this.reservationService.selectedReservation.$key);
      this.modalDelete.close();
      this.modalEdit.close();
      this.events = this.events.filter(iEvent => iEvent !== this.event);
      this.tostr.warning("Suppression effectuée", "Réservation supprimée");
    }else 
      this.modalDelete.close();
  }

  //Action : Réinitialiser la réservation courante
  resetForm() {
    
    let date = new Date();
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0)

    this.reservationService.selectedReservation = {
      $key: null,
      start: date,
      end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 2, 30),
      title: '',
      plongeurs: {},
      moniteurs: {},
      color: this.colors.blue,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.reservationTextEdit = "Ajouter une réservation";
    this.reservationTextAbort = "Annuler";
  }


  /**
   * DEBUT => Fonction par défaut du module Calendar
   */

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    //this.refresh.next();
    //console.log('drag, event:', event);
  }

  // Lorsque l'on drag (et non un resize) un event pour la vue semaine, l'appel se fait 2 fois
  // Le boolean bl_eventTimesChangedOnce permet de bloquer le 2ème appel
  bl_eventTimesChangedOnce : boolean = false;

  eventTimesChangedForWeek({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    
    // Si c'est un resize, le boolean est toujours false pour toujours rentrer dans le handleEvent
    if (event.start == newStart || event.end == newEnd) this.bl_eventTimesChangedOnce = false;

    if (!this.bl_eventTimesChangedOnce){
      //console.log('drag, event:', event); 
      event.start = newStart;
      event.end = newEnd;
      this.handleEvent('Dropped or resized', event);
      this.bl_eventTimesChangedOnce = true;
    }else{
      this.bl_eventTimesChangedOnce = false;
    }
  }

  handleEvent(action: string, event: any): void {
    
    //this.modalData = { event, action };
    //console.log(this.modalData);
    
    this.reservationService.selectedReservation = {
      $key: event.$key,
      start: event.start,
      end: event.end,
      title: event.title,
      plongeurs: event.plongeurs ? event.plongeurs : {},
      moniteurs: event.moniteurs ? event.moniteurs : {},
      color: event.color,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }
    
    if (action == 'Clicked' || action == 'Edited'){
      this.onEdit(this.reservationService.selectedReservation);
      //('Clicked');
    }else if (action == 'Deleted'){
      this.onDelete(this.reservationService.selectedReservation)
      //console.log('Deleted');
    }else if (action == 'Dropped or resized'){
      this.onSubmit();
      //console.log('Edited');
    }
    
    //this.modal.open(this.modalData, { size: 'lg' });
  }

  /**
   * FIN => Fonction par défaut du module Calendar
   */

   showModalPlongeur(){
     this.term = '';
     this.modalPlongeur = this.modal.open(this.modalAddPlongeur, { size: 'lg' });
   }

   addPlongeur(plongeur){
    var blNewPlongeur = false;
    var nbPlongeurOldValue = 0;
    
    //console.log('plongeur', plongeur); 

    // Si pas de plongeur dans la reservation, creation d'un objet vide
    if(!this.reservationService.selectedReservation.plongeurs) this.reservationService.selectedReservation.plongeurs = {};
    
    // Si plongeur.$key non présent, Alors nouveau plongeur, sinon on sauvegarde le nombre de plongeur pour le compteur
    if (!this.reservationService.selectedReservation.plongeurs[plongeur.$key]){
      // On affecte le nombre de plongeur à la key
      this.reservationService.selectedReservation.plongeurs[plongeur.$key] = {
        nb: 1,
        photo: false,
        nitrox: false,
        accompte: '',
        commentaire: '',
      }
      // Si c'est un nouveau plongeur, on l'ajoute au tableau
      this.reservationPlongeurs.push(plongeur);
      this.plongeurCount = this.plongeurCount + this.reservationService.selectedReservation.plongeurs[plongeur.$key].nb;

      //console.log('this.reservationService.selectedReservation', this.reservationService.selectedReservation); 

    } 
    
    // On ferme la modal
    this.modalPlongeur.close();
   }

   setCountPlongeur(newValue, oldValue){
     //console.log('newValue', newValue); 
     this.plongeurCount = this.plongeurCount + newValue - oldValue;
   }

   deletePlongeur(plongeur){
    this.plongeurCount = this.plongeurCount - this.reservationService.selectedReservation.plongeurs[plongeur.$key].nb;
    var index: number = this.reservationPlongeurs.indexOf(plongeur);
    if (index !== -1) {
        this.reservationPlongeurs.splice(index, 1);
        this.reservationService.selectedReservation.plongeurs[plongeur.$key].Deleted
    }    
    delete this.reservationService.selectedReservation.plongeurs[plongeur.$key];
   }

   showModalMoniteur(){
     this.term = '';
     this.modalMoniteur = this.modal.open(this.modalAddMoniteur, { size: 'lg' });
   }

   addMoniteur(moniteur){
    //console.log('moniteur', moniteur.$key); 
    if(!this.reservationService.selectedReservation.moniteurs) this.reservationService.selectedReservation.moniteurs = {};
    this.reservationService.selectedReservation.moniteurs[moniteur.$key]=true;
    this.reservationMoniteurs.push(moniteur);
    this.moniteurCount = this.moniteurCount + 1;
    this.modalMoniteur.close();
    //console.log('moniteurs', this.reservationService.selectedReservation); 
   }

   deleteMoniteur(moniteur){
    var index: number = this.reservationMoniteurs.indexOf(moniteur);
    //console.log('index', index)
    if (index !== -1) {
        this.reservationMoniteurs.splice(index, 1);
        this.reservationService.selectedReservation.moniteurs[moniteur.$key].Deleted
    }    
    delete this.reservationService.selectedReservation.moniteurs[moniteur.$key];
    this.moniteurCount = this.moniteurCount - 1;
   }
}
