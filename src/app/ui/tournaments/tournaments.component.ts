import { Component, OnInit, TemplateRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Tournament } from '../../models/tournament.interface';
import { Store } from '@ngxs/store';
import * as tournamentActions from '../../../shared/state/tournament.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'tnm-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {

  public tournaments: Array<Tournament>;

  public tournamentForm: FormGroup;
  public modalRef: BsModalRef;

  public modalTitle: string;
  public formModus: 'CREATE' | 'UPDATE';

  private tournamentToBeDeleted: Tournament;

  public constructor(
    private dataService: DataService,
    private store: Store,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.createTournamentForm();
  }

  public ngOnInit(): void {
    this.store.dispatch(new tournamentActions.StartLoading());
    this.dataService.getTournaments().subscribe((data) => {
      this.tournaments = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Tournament;
      });
      this.store.dispatch(new tournamentActions.StoreTournaments(this.tournaments));
      this.store.dispatch(new tournamentActions.StopLoading());
    }, (_error) => {
      console.warn(_error);
      this.store.dispatch(new tournamentActions.StopLoading());
    });
  }

  // Reactive Form

  private createTournamentForm(): void {
    this.tournamentForm = this.fb.group({
      id: undefined,
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: '',
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required]
    });
  }

  public openCreateTournamentModal(tournamentModal: TemplateRef<any>): void {
    this.modalTitle = 'Create a new tournament';
    this.formModus = 'CREATE';

    this.tournamentForm.controls['code'].setValue('');
    this.tournamentForm.controls['name'].setValue('');
    this.tournamentForm.controls['dateStart'].setValue('');
    this.tournamentForm.controls['dateEnd'].setValue('');
    this.tournamentForm.controls['description'].setValue('');

    this.modalRef = this.modalService.show(tournamentModal);
  }

  public openUpdateTournamentModal(tournamentModal: TemplateRef<any>, tournament?: Tournament): void {
    this.modalTitle = 'Update tournament';
    this.formModus = 'UPDATE';

    this.tournamentForm.controls['id'].setValue(tournament.id);
    this.tournamentForm.controls['code'].setValue(tournament.code);
    this.tournamentForm.controls['name'].setValue(tournament.name);
    this.tournamentForm.controls['dateStart'].setValue(new Date(tournament.dateStart['seconds'] * 1000));
    this.tournamentForm.controls['dateEnd'].setValue(new Date(tournament.dateEnd['seconds'] * 1000));
    this.tournamentForm.controls['description'].setValue(tournament.description);

    this.modalRef = this.modalService.show(tournamentModal);
  }

  public openConfirm(confirmModal: TemplateRef<any>, tournament: Tournament): void {
    this.tournamentToBeDeleted = tournament;
    this.modalRef = this.modalService.show(confirmModal, {class: 'modal-sm'});
  }

  // Tournament CRUD

  public createTournament(tournament: Tournament): void {
    this.dataService.createTournament(tournament).then(() => {
      console.log('Tournament created');
    }).catch((error) => {
      console.warn('Error creating tournament: ', error);
    });
  }

  public updateTournament(tournament: Tournament): void {
    this.dataService.updateTournament(tournament);
  }

  public deleteTournament(tournament: Tournament): void {
    this.dataService.deleteTournament(tournament);
  }

  // PageEvents

  public onSubmitTournament(): void {
    let tournament = this.tournamentForm.value as Tournament;

    if (this.formModus === 'CREATE') {
      delete tournament.id;
      this.createTournament(tournament);
    } else {
      this.updateTournament(tournament);
    }
    this.modalRef.hide();
  }

  public onSelectTournament(tournament: Tournament): void {
    this.store.dispatch(new tournamentActions.SelectTournament(tournament.code));
  }

  public confirm(): void {
    this.deleteTournament(this.tournamentToBeDeleted);
    this.modalRef.hide();
  }

  public decline(): void {
    this.modalRef.hide();
  }

}
