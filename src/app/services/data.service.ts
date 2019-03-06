import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, DocumentReference, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category.interface';
import { Tournament } from '../models/tournament.interface';
import { Poule } from '../models/poule.interface';
import * as tournamentActions from '../../shared/state/tournament.actions';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public constructor(private firestore: AngularFirestore) { }

  // Tournaments
  // ==================================================

  public getTournaments(): Observable<Array<DocumentChangeAction<any>>> {
    return this.firestore.collection('tournaments').snapshotChanges();
  }

  public getTournament(tournamentCode: string): Observable<Array<DocumentChangeAction<any>>> {
    return this.firestore.collection('tournaments', (tournament) => tournament
      .where('code', '==', tournamentCode))
      .snapshotChanges();
  }

  public createTournament(tournament: Tournament): Promise<DocumentReference> {
    return this.firestore.collection('tournaments').add(tournament);
  }

  public updateTournament(tournament: Tournament): void {
    this.firestore.doc(`tournaments/${tournament.id}`).update(tournament);
  }

  public deleteTournament(tournament: Tournament): void {
    const tournamentId = tournament.id;
    this.deleteAllCategories(tournament.code);
    this.firestore.doc(`tournaments/${tournamentId}`).delete().then(() => {
      console.log('Tournament deleted with id: ', tournamentId);
    }).catch((error) => {
      console.error('Error removing tournament: ', error);
    });
  }

  // Categories
  // ==================================================

  public getCategories(tournamentCode: string): Observable<Array<DocumentChangeAction<any>>> {
    return this.firestore.collection('categories', (category) => category
      .where('tournamentCode', '==', tournamentCode))
      .snapshotChanges();
  }

  public getCategory(tournamentCode: string, categoryCode: string): Observable<Array<DocumentChangeAction<any>>> {
    return this.firestore.collection('categories', (category) => category
      .where('tournamentCode', '==', tournamentCode)
      .where('code', '==', categoryCode))
      .snapshotChanges();
  }

  public createCategory(category: Category): Promise<DocumentReference> {
    return this.firestore.collection('categories').add(category);
  }

  public updateCategory(category: Category): void {
    this.firestore.doc(`categories/${category.id}`).update(category);
  }

  public deleteCategory(category: Category, tournamentCode?: string): void {
    const categoryId = category.id;
    this.deleteAllPoules(tournamentCode, category.code);
    this.firestore.doc(`categories/${categoryId}`).delete().then(() => {
      console.log('Category deleted with id: ', categoryId);
    }).catch((error) => {
      console.error('Error removing category: ', error);
    });
  }
  public deleteAllCategories(tournamentCode: string): void {
    this.getCategories(tournamentCode).subscribe((data) => {
      let categories = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Category;
      });
      categories.forEach((cat: Category) => {
        this.deleteCategory(cat, tournamentCode);
      });
    });
    // this.firestore.collection('categories', (category) => category
    //   .where('tournamentCode', '==', tournamentCode))
    //   .get().subscribe((data) => {
    //     data.forEach((doc: QueryDocumentSnapshot<any>) => {
    //       this.deleteCategory(doc.id, tournamentCode);
    //     });
    //   });
  }

// POULES
// ==================================================

  public getTournamentPoules(tournamentCode: string): Observable<Array<DocumentChangeAction<any>>> {
    return this.firestore.collection('poules', (poule) => poule
      .where('tournamentCode', '==', tournamentCode))
      .snapshotChanges();
  }

  public getPoules(tournamentCode: string, categoryCode: string): Observable<Array<DocumentChangeAction<any>>> {
    return this.firestore.collection('poules', (poule) => poule
      .where('tournamentCode', '==', tournamentCode)
      .where('categoryCode', '==', categoryCode))
      .snapshotChanges();
  }

  public getPoule(tournamentCode: string, categoryCode: string, pouleCode: string): Observable<Array<DocumentChangeAction<any>>> {
    return this.firestore.collection('poules', (poule) => poule
      .where('tournamentCode', '==', tournamentCode)
      .where('categoryCode', '==', categoryCode)
      .where('code', '==', pouleCode))
      .snapshotChanges();
  }

  public createPoule(poule: Poule): Promise<DocumentReference> {
    return this.firestore.collection('poules').add(poule);
  }

  public updatePoule(poule: Poule): void {
    this.firestore.doc(`poules/${poule.id}`).update(poule);
  }

  public deletePoule(pouleId: string): void {
    this.firestore.doc(`poules/${pouleId}`).delete().then(() => {
      console.log('Poule deleted with id: ', pouleId);
    }).catch((error) => {
      console.error('Error removing poule: ', error);
    });
  }

  public deleteAllPoules(tournamentCode: string, categoryCode: string): void {
    this.firestore.collection('poules', (poule) => poule
      .where('tournamentCode', '==', tournamentCode)
      .where('categoryCode', '==', categoryCode))
      .get().subscribe((data) => {
      data.forEach((doc: QueryDocumentSnapshot<any>) => {
        this.deletePoule(doc.id);
      });
    });
  }

}
