import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { PlongeurService } from '../services/plongeur.service';

@Component({
  selector: 'app-plongeur',
  templateUrl: './plongeur.component.html',
  styleUrls: ['./plongeur.component.scss'],
  host: {}, //'[@moveIn]': ''
  animations: [
    //Animations moveIn(), fallIn(), moveInLeft(): https://coursetro.com/posts/code/32/Create-a-Full-Angular-Authentication-System-with-Firebase
    moveIn(), fallIn(), moveInLeft(),
  ]
})
export class PlongeurComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalConfirm') modalConfirm: TemplateRef<any>;

  plongeurCount: number = 0;
  plongeurs = [];
  plongeurTextEdit: string;
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
  pagePlongeur: number = 1;
  
  constructor(private plongeurService: PlongeurService, private tostr: ToastrService, private modal: NgbModal) { }

  ngOnInit() {

    this.resetForm();

    // Chargement de la liste des plongeurs
    this.plongeurService.getPlongeurs().subscribe(plongeur => {
      this.plongeurs = plongeur;
      this.plongeurCount = this.plongeurs.length;
      //console.log('this.plongeurs : ', this.plongeurs);
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
   * Gestion Plongeur
   */ 

  //Action : Afficher modal pour éditer
  onEdit(plongeur) {
    this.plongeurTextEdit = "Editer un plongeur";
    this.isAdd = false;
    this.plongeurService.selectedPlongeur = Object.assign({}, plongeur);
    this.modalReference = this.modal.open(this.modalContent, { size: 'lg' });
  }

  //Action : Afficher modal pour ajouter
  onAdd() {
    this.resetForm();
    this.modalReference = this.modal.open(this.modalContent, { size: 'lg' });
  }

  //Action : Soumission du formulaire d'édition
  onSubmit() {
    if (this.plongeurService.selectedPlongeur.$key == null){
      this.plongeurService.InsertPlongeur(this.plongeurService.selectedPlongeur);
    }else
      this.plongeurService.updatePlongeur(this.plongeurService.selectedPlongeur);
    this.modalReference.close();
    this.resetForm();
    this.tostr.success('Enregistrement effectué', 'Plongeur enregistré');
  }

  //Action : Afficher modal pour confirmation Supprimer
  onDelete(plongeur) {
    this.modalReference = this.modal.open(this.modalConfirm, { size: 'lg' });
    this.plongeurService.selectedPlongeur = Object.assign({}, plongeur);
  }

  //Action : Supprimer
  isDelete(isDelete: boolean) {
    if (isDelete) {
      this.plongeurService.deletePlongeur(this.plongeurService.selectedPlongeur.$key);
      this.modalReference.close();
      this.tostr.warning("Suppression effectuée", "Plongeur supprimé");
    }else 
      this.modalReference.close();
  }

  //Action : Supprimer
  allDelete() {
    this.plongeurs.forEach(plongeur => {
      this.plongeurService.deletePlongeur(plongeur.$key);
    });
  }

  //Action : Afficher modal pour ajouter
  onAbort() {
    this.modalReference.close();
  }

  //Action : Réinitialiser le formulaire
  resetForm() {
    this.plongeurService.selectedPlongeur = {
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
    this.plongeurTextEdit = "Ajouter un plongeur";
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

    this.plongeurs.forEach(plongeur => {
      data.push(
      {
        id: plongeur.$key,
        nom: plongeur.nom,
        prenom: plongeur.prenom,
        dateNaissance: plongeur.dateNaissance,
        certificat: plongeur.certificat,
        prencodePostalom: plongeur.codePostal,
        ville: plongeur.ville,
        telephone: plongeur.telephone,
        email: plongeur.email,
        brevet: plongeur.brevet,
        prenomAccident: plongeur.prenomAccident,
        nomAccident: plongeur.nomAccident,
        telephoneAccident: plongeur.telephoneAccident
      });
    });

    new Angular5Csv(data, 'Plongeurs', optionsCSV);
  }
}
