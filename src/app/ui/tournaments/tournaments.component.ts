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
  public formModus: 'CREATE'|'UPDATE';

  constructor(
    private dataService: DataService,
    private store: Store,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.createTournamentForm();
  }

  ngOnInit() {
    this.store.dispatch(new tournamentActions.StartLoading());
    this.dataService.getTournaments().subscribe(data => {
      this.tournaments = data.map(e => {
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
  openCreateTournamentModal(tournamentModal: TemplateRef<any>) {
    this.modalTitle = 'Create a new tournament';
    this.formModus = 'CREATE';
    this.modalRef = this.modalService.show(tournamentModal);
  }

  openUpdateTournamentModal(tournamentModal: TemplateRef<any>, tournament?: Tournament) {
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

  // Tournament CRUD

  public createTournament(tournament: Tournament): void {
    this.dataService.createTournament(tournament);
  }

  public updateTournament(tournament: Tournament): void {
    this.dataService.updateTournament(tournament);
  }

  public deleteTournament(id: string): void {
    this.dataService.deleteTournament(id);
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

  public onSelectTournament(tournament: Tournament) {
    this.store.dispatch(new tournamentActions.SelectTournament(tournament.code));
  }

}
