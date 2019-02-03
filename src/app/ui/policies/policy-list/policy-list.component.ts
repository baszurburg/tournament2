import { Component, OnInit, TemplateRef } from '@angular/core';
import { PolicyService } from '../policy.service';
import { Policy } from '../policy.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tnm-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss']
})
export class PolicyListComponent implements OnInit {

  modalRef: BsModalRef;
  policies: Policy[];

  constructor(
    private policyService: PolicyService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.policyService.getPolicies().subscribe(data => {
      this.policies = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Policy;
      });
    });
  }

  // Modal

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  // Policy CRUD

  create(policy: Policy) {
    delete policy.id;
    policy.policyAmount = policy.policyAmount + 25;
    this.policyService.createPolicy(policy);
  }

  update(policy: Policy) {
    this.policyService.updatePolicy(policy);
  }

  delete(id: string) {
    this.policyService.deletePolicy(id);
  }

}
