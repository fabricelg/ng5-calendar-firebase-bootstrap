import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { MoniteurService } from '../services/moniteur.service';

@Component({
  selector: 'app-moniteur',
  templateUrl: './moniteur.component.html',
  styleUrls: ['./moniteur.component.scss'],
  host: {}, //'[@moveIn]': ''
  animations: [
    //Animations moveIn(), fallIn(), moveInLeft(): https://coursetro.com/posts/code/32/Create-a-Full-Angular-Authentication-System-with-Firebase
    moveIn(), fallIn(), moveInLeft(),
  ]
})
export class MoniteurComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalConfirm') modalConfirm: TemplateRef<any>;

  moniteurCount: number = 0;
  moniteurs = [];
  moniteurTextEdit: string;
  modalReference: any;
  isAdd = false;
  
  // Animation
  state: string;

  // FilterBy
  term: string;
  
  // OrderBy
  order: string = 'nom';
  reverse: boolean = false;

  // Pagination
  pageMoniteur: number = 1;
  
  constructor(private moniteurService: MoniteurService, private tostr: ToastrService, private modal: NgbModal) { }

  ngOnInit() {

    this.resetForm();

    // Chargement de la liste des moniteurs
    this.moniteurService.getMoniteurs().subscribe(moniteur => {
      this.moniteurs = moniteur;
      this.moniteurCount = this.moniteurs.length;
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
   * Gestion Moniteur
   */ 

  //Action : Afficher modal pour éditer
  onEdit(moniteur) {
    this.moniteurTextEdit = "Editer un moniteur";
    this.isAdd = false;
    this.moniteurService.selectedMoniteur = Object.assign({}, moniteur);
    this.modalReference = this.modal.open(this.modalContent, { size: 'lg' });
  }

  //Action : Afficher modal pour ajouter
  onAdd() {
    this.resetForm();
    this.modalReference = this.modal.open(this.modalContent, { size: 'lg' });
  }

  //Action : Soumission du formulaire d'édition
  onSubmit() {
    if (this.moniteurService.selectedMoniteur.$key == null){
      this.moniteurService.InsertMoniteur(this.moniteurService.selectedMoniteur);
    }else
      this.moniteurService.updateMoniteur(this.moniteurService.selectedMoniteur);
    this.modalReference.close();
    this.resetForm();
    this.tostr.success('Enregistrement effectué', 'Moniteur enregistré');
  }

  //Action : Afficher modal pour confirmation Supprimer
  onDelete(moniteur) {
    this.modalReference = this.modal.open(this.modalConfirm, { size: 'lg' });
    this.moniteurService.selectedMoniteur = Object.assign({}, moniteur);
  }

  //Action : Supprimer
  isDelete(isDelete: boolean) {
    if (isDelete) {
      this.moniteurService.deleteMoniteur(this.moniteurService.selectedMoniteur.$key);
      this.modalReference.close();
      this.tostr.warning("Suppression effectuée", "Moniteur supprimé");
    }else 
      this.modalReference.close();
  }

  //Action : Supprimer
  allDelete() {
    this.moniteurs.forEach(moniteur => {
      this.moniteurService.deleteMoniteur(moniteur.$key);
    });
  }

  //Action : Afficher modal pour ajouter
  onAbort() {
    this.modalReference.close();
  }

  //Action : Réinitialiser le formulaire
  resetForm() {
    this.moniteurService.selectedMoniteur = {
      $key: null,
      nom: '',
      prenom: '',
      dateNaissance: '',
      certificat: '',
      codePostal: '',
      ville: '',
      telephone: '',
      email: '',
      brevet: '',
      prenomAccident: '',
      nomAccident: '',
      telephoneAccident: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.moniteurTextEdit = "Ajouter un moniteur";
    this.isAdd = true;
  }

  exportCSV (){
    // Export CSV
    var data = [];

    var optionsCSV = { 
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false, 
      showTitle: true,
      useBom: true,
      title: 'id;nom;prenom;dateNaissance;certificat;codePostal;ville;telephone;email;brevet;prenomAccident;nomAccident;telephoneAccident',
    };

    this.moniteurs.forEach(moniteur => {
      data.push(
      {
        id: moniteur.$key,
        nom: moniteur.nom,
        prenom: moniteur.prenom,
        dateNaissance: moniteur.dateNaissance,
        certificat: moniteur.certificat,
        prencodePostalom: moniteur.codePostal,
        ville: moniteur.ville,
        telephone: moniteur.telephone,
        email: moniteur.email,
        brevet: moniteur.brevet,
        prenomAccident: moniteur.prenomAccident,
        nomAccident: moniteur.nomAccident,
        telephoneAccident: moniteur.telephoneAccident
      });
    });

    new Angular5Csv(data, 'Moniteurs', optionsCSV);
  }
}
