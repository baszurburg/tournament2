import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Policy } from './policy.model';


@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private firestore: AngularFirestore) { }

  getPolicies() {
    return this.firestore.collection('policies').snapshotChanges();
  }

  createPolicy(policy: Policy){
    return this.firestore.collection('policies').add(policy);
  }

  updatePolicy(policy: Policy){
    this.firestore.doc('policies/' + policy.id).update(policy);
  }

  deletePolicy(policyId: string){
    this.firestore.doc('policies/' + policyId).delete().then(function() {
      console.log('Policy deleted with id: ', policyId);
    }).catch(function(error) {
      console.error('Error removing policy: ', error);
    });

  }

}
