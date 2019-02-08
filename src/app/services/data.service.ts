import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, DocumentReference, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category.interface';
import { Tournament } from '../models/tournament.interface';

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

  public createCategory(category: Category): Promise<DocumentReference> {
    return this.firestore.collection('categories').add(category);
  }

  public updateCategory(category: Category): void {
    this.firestore.doc(`categories/${category.id}`).update(category);
  }

  public deleteCategory(categoryId: string): void {
    this.firestore.doc(`categories/${categoryId}`).delete().then(() => {
      console.log('Category deleted with id: ', categoryId);
    }).catch((error) => {
      console.error('Error removing category: ', error);
    });
  }

  public deleteAllCategories(tournamentCode: string): void {
    this.firestore.collection('categories', (category) => category
      .where('tournamentCode', '==', tournamentCode))
      .get().subscribe((data) => {
        data.forEach((doc: QueryDocumentSnapshot<any>) => {
          this.deleteCategory(doc.id);
        });
      });
  }
}
