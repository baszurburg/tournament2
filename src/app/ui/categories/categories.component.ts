import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import * as tournamentActions from '../../../shared/state/tournament.actions';
import { Category } from '../../models/category.interface';
import { DataService } from '../../services/data.service';
import { Store } from '@ngxs/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Poule } from '../../models/poule.interface';

@Component({
  selector: 'tnm-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @Input() public tournamentCode: string;

  public categories: Array<Category>;
  public tournamentPoules: Array<Poule>;

  public categoryForm: FormGroup;
  public modalRef: BsModalRef;

  public modalTitle: string;
  public formModus: 'CREATE' | 'UPDATE';

  private categoryIdToBeDeleted: string;

  public constructor(
    private dataService: DataService,
    private store: Store,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.createCategoryForm();
  }

  public ngOnInit(): void {
    this.getCategories();
    this.getTournamentPoules();
  }

  private getCategories(): void {
    this.store.dispatch(new tournamentActions.StartLoading());
    this.dataService.getCategories(this.tournamentCode).subscribe((data) => {
      this.categories = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Category;
      });
      this.store.dispatch(new tournamentActions.StoreCategories(this.categories));
      this.store.dispatch(new tournamentActions.StopLoading());
    }, (_error) => {
      console.warn(_error);
      this.store.dispatch(new tournamentActions.StopLoading());
    });
  }

  private getTournamentPoules(): void {
      this.store.dispatch(new tournamentActions.StartLoading());
      this.dataService.getTournamentPoules(this.tournamentCode).subscribe((data) => {
        this.tournamentPoules = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Poule;
        });
        this.store.dispatch(new tournamentActions.StoreTournamentPoules(this.tournamentPoules));
        this.store.dispatch(new tournamentActions.StopLoading());
      }, (_error) => {
        console.warn(_error);
        this.store.dispatch(new tournamentActions.StopLoading());
      });

  }

  // Reactive Form

  private createCategoryForm(): void {
    this.categoryForm = this.fb.group({
      id: undefined,
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: '',
      startDate: ['', Validators.required],
      sortOrder: ['0', Validators.required],
      tournamentCode: [{value: '', disabled: true}, Validators.required]
    });
  }
  public openCreateCategoryModal(categoryModal: TemplateRef<any>): void {
    this.modalTitle = 'Create a new category';
    this.formModus = 'CREATE';

    this.categoryForm.controls['id'].setValue('');
    this.categoryForm.controls['code'].setValue('');
    this.categoryForm.controls['name'].setValue('');
    this.categoryForm.controls['startDate'].setValue('');
    this.categoryForm.controls['sortOrder'].setValue('0');
    this.categoryForm.controls['description'].setValue('');
    this.categoryForm.controls['tournamentCode'].setValue(this.tournamentCode);

    this.modalRef = this.modalService.show(categoryModal);
  }

  public openUpdateCategoryModal(categoryModal: TemplateRef<any>, category?: Category): void {
    this.modalTitle = 'Update category';
    this.formModus = 'UPDATE';

    this.categoryForm.controls['id'].setValue(category.id);
    this.categoryForm.controls['code'].setValue(category.code);
    this.categoryForm.controls['name'].setValue(category.name);
    if (category.startDate) {
      this.categoryForm.controls['startDate'].setValue(new Date(category.startDate['seconds'] * 1000));
    }
    this.categoryForm.controls['sortOrder'].setValue(category.sortOrder || '0');
    this.categoryForm.controls['description'].setValue(category.description);
    this.categoryForm.controls['tournamentCode'].setValue(this.tournamentCode);

    this.modalRef = this.modalService.show(categoryModal);
  }

  public openConfirm(confirmModal: TemplateRef<any>, category: Category): void {
    this.categoryIdToBeDeleted = category.id;
    this.modalRef = this.modalService.show(confirmModal, {class: 'modal-sm'});
  }

  // PageEvents

  public onSubmitCategory(): void {
    let category = this.categoryForm.value as Category;
    category.tournamentCode = this.tournamentCode;
    if (this.formModus === 'CREATE') {
      delete category.id;
      this.createCategory(category);
    } else {
      this.updateCategory(category);
    }
    this.modalRef.hide();
  }

  public confirm(): void {
    this.deleteCategory(this.categoryIdToBeDeleted);
    this.modalRef.hide();
  }

  public decline(): void {
    this.modalRef.hide();
  }

  // Category CRUD

  public createCategory(category: Category): void {
    this.dataService.createCategory(category).then(() => {
      console.log('Category created');
    }).catch((error) => {
      console.warn('Error creating category: ', error);
    });
  }

  public updateCategory(category: Category): void {
    this.dataService.updateCategory(category);
  }

  public deleteCategory(id: string): void {
    this.dataService.deleteCategory(id);
  }

  // public deleteAllCategories(): void {
  //   this.dataService.deleteAllCategories(this.tournamentCode);
  // }

}
