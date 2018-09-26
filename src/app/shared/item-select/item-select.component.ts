import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../core/shared/item.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { ItemSelectService } from './item-select.service';

@Component({
  selector: 'ds-item-select',
  styleUrls: ['./item-select.component.scss'],
  templateUrl: './item-select.component.html'
})

export class ItemSelectComponent implements OnInit {

  @Input()
  itemsRD$: Observable<RemoteData<PaginatedList<Item>>>;

  @Input()
  paginationOptions: PaginationComponentOptions;

  checked: boolean[] = [];

  constructor(private itemSelectService: ItemSelectService) {
  }

  ngOnInit(): void {
    this.itemsRD$.subscribe((value) => console.log(value));
  }

  switch(id: string) {
    this.itemSelectService.switch(id);
  }

  getSelected(id: string): Observable<boolean> {
    return this.itemSelectService.getSelected(id);
  }

}
