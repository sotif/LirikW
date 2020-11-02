import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {FilterService} from './services/filter.service';
import {FilterResult, Video} from './models/filters';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public searching = false;
  public searchString: string;
  public searchObservable: Subject<string> = new Subject<string>();

  public searchResults: Video[];
  public filterResult: FilterResult;
  public loading = false;

  public latestVods: Video[];

  private destroy$  = new Subject();

  constructor(
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.searchObservable.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.searchString = search;
      this.searching = !!this.searchString;
      this.loading = this.searching;

      // Do the actual search
      this.filterService.getTotalFilter(this.searchString)
        .subscribe(
          (filter) => {
            this.loading = false;
            this.filterResult = filter;
          },
          err => {
            // TODO PROPER ERROR
            console.error(err);
            this.loading = false;
          }
        );
    });

    this.filterService.getLatestVods(8)
      .subscribe((latest) => {
        this.latestVods = latest;
      }, err => {
        // TODO proper ERROR
        console.error(err);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  public searchChanged(e: string): void {
    this.searchObservable.next(e);
  }
}
