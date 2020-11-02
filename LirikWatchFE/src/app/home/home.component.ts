import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public searching = false;
  public searchString: string;
  public searchObservable: Subject<string> = new Subject<string>();

  private destroy$  = new Subject();

  constructor() { }

  ngOnInit(): void {
    this.searchObservable.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.searchString = search;
      this.searching = !!this.searchString;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  public searchChanged(e: string): void {
    this.searchObservable.next(e);
  }
}
