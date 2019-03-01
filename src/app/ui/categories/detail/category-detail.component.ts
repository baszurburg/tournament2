import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TournamentsState } from '../../../../shared/state/tournament.state';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../../models/category.interface';
import { Tournament } from '../../../models/tournament.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import * as tournamentActions from '../../../../shared/state/tournament.actions';
import { Poule } from '../../../models/poule.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'tnm-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit, OnDestroy {

  @Select(TournamentsState.getSelectedCategory) private selectedCategory: Observable<Category>;
  @Select(TournamentsState.getSelectedTournament) private selectedTournament: Observable<Tournament>;

  public tournament: Tournament;
  public category: Category;
  public poules: Array<Poule>;

  public pouleForm: FormGroup;
  public modalRef: BsModalRef;
  public modalTitle: string;
  public formModus: 'CREATE' | 'UPDATE';

  private pouleIdToBeDeleted: string;

  private tournaments: Array<Tournament>;
  private categories: Array<Category>;
  private selectedTournamentCode: string;
  private selectedCategoryCode: string;

  private stateSubscriptions: Array<Subscription> = [];

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private store: Store,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.createPouleForm();
  }

  public ngOnInit(): void {
    this.getTournament();
    this.getCategory();
    this.getPoules();
  }

  private getTournament(): void {
    this.stateSubscriptions.push(this.route.params.subscribe((params) => {
      this.selectedTournamentCode = params['tournamentCode'];
      this.store.dispatch(new tournamentActions.StartLoading());

      this.stateSubscriptions.push(this.dataService.getTournament(this.selectedTournamentCode).subscribe((data) => {
        this.tournaments = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Tournament;
        });

        this.tournament = this.tournaments[0] || null;
        this.store.dispatch(new tournamentActions.StopLoading());
        if (!this.tournament) {
          this.router.navigate(['/tournaments']);
        } else {
          this.store.dispatch(new tournamentActions.SelectTournament(this.tournament));
        }
      }, (_error) => {
        console.warn(_error);
        this.store.dispatch(new tournamentActions.StopLoading());
        if (!this.tournament) {
          this.router.navigate(['/tournaments']);
        }
      }));
    }));
  }

  private getCategory(): void {
    this.stateSubscriptions.push(this.route.params.subscribe((params) => {
      this.selectedCategoryCode = params['categoryCode'];
      this.store.dispatch(new tournamentActions.StartLoading());

      this.stateSubscriptions.push(this.dataService.getCategory(this.selectedTournamentCode, this.selectedCategoryCode).subscribe((data) => {
        this.categories = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Category;
        });

        this.category = this.categories[0] || null;
        this.store.dispatch(new tournamentActions.StopLoading());
        if (!this.category) {
          this.router.navigate(['/tournaments']);
        } else {
          this.store.dispatch(new tournamentActions.SelectCategory(this.category));
        }
      }, (_error) => {
        console.warn(_error);
        this.store.dispatch(new tournamentActions.StopLoading());
        if (!this.category) {
          this.router.navigate(['/tournaments']);
        }
      }));
    }));
  }

  private getPoules(): void {

    this.stateSubscriptions.push(this.route.params.subscribe((params) => {
      const categoryCode = params['categoryCode'];
      const tournamentCode = params['tournamentCode'];

      this.store.dispatch(new tournamentActions.StartLoading());
      this.dataService.getPoules(tournamentCode, categoryCode).subscribe((data) => {
        this.poules = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Poule;
        });
        this.store.dispatch(new tournamentActions.StorePoules(this.poules));
        this.store.dispatch(new tournamentActions.StopLoading());
      }, (_error) => {
        console.warn(_error);
        this.store.dispatch(new tournamentActions.StopLoading());
      });
    }));

  }

  // Reactive Form

  private createPouleForm(): void {
    this.pouleForm = this.fb.group({
      id: undefined,
      code: ['', Validators.required],
      name: ['', Validators.required],
      color: ['', Validators.required],
      matchDuration: [10, Validators.required],
      tournamentCode: [{value: '', disabled: true}, Validators.required],
      categoryCode: [{value: '', disabled: true}, Validators.required]
    });
  }
  public openCreatePouleModal(pouleModal: TemplateRef<any>): void {
    this.modalTitle = 'Create a new poule';
    this.formModus = 'CREATE';

    this.pouleForm.controls['id'].setValue('');
    this.pouleForm.controls['code'].setValue('');
    this.pouleForm.controls['name'].setValue('');
    this.pouleForm.controls['color'].setValue('');
    this.pouleForm.controls['matchDuration'].setValue(10);
    this.pouleForm.controls['tournamentCode'].setValue(this.selectedTournamentCode);
    this.pouleForm.controls['categoryCode'].setValue(this.selectedCategoryCode);

    this.modalRef = this.modalService.show(pouleModal);
  }

  public openUpdatePouleModal(pouleModal: TemplateRef<any>, poule?: Poule): void {
    this.modalTitle = 'Update poule';
    this.formModus = 'UPDATE';

    this.pouleForm.controls['id'].setValue(poule.id);
    this.pouleForm.controls['code'].setValue(poule.code);
    this.pouleForm.controls['name'].setValue(poule.name);
    this.pouleForm.controls['color'].setValue(poule.color);
    this.pouleForm.controls['matchDuration'].setValue(poule.matchDuration);
    this.pouleForm.controls['tournamentCode'].setValue(poule.tournamentCode);
    this.pouleForm.controls['categoryCode'].setValue(poule.categoryCode);

    this.modalRef = this.modalService.show(pouleModal);
  }

  public openConfirm(confirmModal: TemplateRef<any>, id: string): void {
    this.pouleIdToBeDeleted = id;
    this.modalRef = this.modalService.show(confirmModal, {class: 'modal-sm'});
  }

  // PageEvents

  public onSubmitPoule(): void {
    let poule = this.pouleForm.value as Poule;
    if (this.formModus === 'CREATE') {
      delete poule.id;
      this.createPoule(poule);
    } else {
      this.updatePoule(poule);
    }
    this.modalRef.hide();
  }

  public confirm(): void {
    this.deletePoule(this.pouleIdToBeDeleted);
    this.modalRef.hide();
  }

  public decline(): void {
    this.modalRef.hide();
  }
  // Category CRUD

  public createPoule(poule: Poule): void {
    this.dataService.createPoule(poule).then(() => {
      console.log('Poule created');
    }).catch((error) => {
      console.warn('Error creating poule: ', error);
    });
  }

  public updatePoule(poule: Poule): void {
    this.dataService.updatePoule(poule);
  }

  public deletePoule(id: string): void {
    this.dataService.deletePoule(id);
  }

  // public deleteAllPoules(): void {
  //   this.dataService.deleteAllPoules(this.tournamentCode, this.categoryCode);
  // }

  public ngOnDestroy(): void {
    this.stateSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
