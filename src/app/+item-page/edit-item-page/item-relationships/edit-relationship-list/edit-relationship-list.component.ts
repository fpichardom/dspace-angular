import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { Observable } from 'rxjs/internal/Observable';
import { FieldUpdate, FieldUpdates } from '../../../../core/data/object-updates/object-updates.reducer';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { Item } from '../../../../core/shared/item.model';
import { map, switchMap} from 'rxjs/operators';
import { hasValue } from '../../../../shared/empty.util';
import {Relationship} from '../../../../core/shared/item-relationships/relationship.model';

@Component({
  selector: 'ds-edit-relationship-list',
  styleUrls: ['./edit-relationship-list.component.scss'],
  templateUrl: './edit-relationship-list.component.html',
})
/**
 * A component creating a list of editable relationships of a certain type
 * The relationships are rendered as a list of related items
 */
export class EditRelationshipListComponent implements OnInit, OnChanges {
  /**
   * The item to display related items for
   */
  @Input() item: Item;

  /**
   * The URL to the current page
   * Used to fetch updates for the current item from the store
   */
  @Input() url: string;

  /**
   * The label of the relationship-type we're rendering a list for
   */
  @Input() relationshipLabel: string;

  /**
   * The FieldUpdates for the relationships in question
   */
  updates$: Observable<FieldUpdates>;

  constructor(
    protected objectUpdatesService: ObjectUpdatesService,
    protected relationshipService: RelationshipService
  ) {
  }

  ngOnInit(): void {
    this.initUpdates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initUpdates();
  }

  /**
   * Initialize the FieldUpdates using the related items
   */
  initUpdates() {
    this.updates$ = this.getUpdatesByLabel(this.relationshipLabel);
  }

  /**
   * Get FieldUpdates for the relationships of a specific type
   * @param label   The relationship type's label
   */
  public getUpdatesByLabel(label: string): Observable<FieldUpdates> {
    return this.relationshipService.getItemRelationshipsByLabel(this.item, label).pipe(
      map((relationsRD) => relationsRD.payload.page.map((relationship) =>
        Object.assign(new Relationship(), relationship, {uuid: relationship.id})
      )),
      switchMap((initialFields) => this.objectUpdatesService.getFieldUpdatesExclusive(this.url, initialFields)),
    );
  }

  /**
   * Get the i18n message key for a relationship
   * @param label   The relationship type's label
   */
  public getRelationshipMessageKey(label: string): string {
    if (hasValue(label) && label.indexOf('Of') > -1) {
      return `relationships.${label.substring(0, label.indexOf('Of') + 2)}`
    } else {
      return label;
    }
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackUpdate(index, update: FieldUpdate) {
    return update && update.field ? update.field.uuid : undefined;
  }
}
